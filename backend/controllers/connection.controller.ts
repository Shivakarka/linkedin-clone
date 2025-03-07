import ConnectionRequest from "../models/connectionRequest.model";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import Notification from "../models/notification.model";
import { sendConnectionAcceptedEmail } from "../emails/emailHandlers";
import mongoose from "mongoose";

export const sendConnectionRequest = async (
  req: Request & {
    user?: {
      _id: string;
      connections: string[];
    };
  },
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { userId } = req.params;
    const senderId = req.user._id;

    if (senderId.toString() === userId) {
      return res
        .status(400)
        .json({ message: "You can't send a request to yourself" });
    }

    if (req.user.connections.includes(userId)) {
      return res.status(400).json({ message: "You are already connected" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      sender: senderId,
      recipient: userId,
      status: "pending",
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A connection request already exists" });
    }

    const newRequest = new ConnectionRequest({
      sender: senderId,
      recipient: userId,
    });

    await newRequest.save();

    res.status(201).json({ message: "Connection request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const acceptConnectionRequest = async (
  req: Request & {
    user?: {
      _id: string;
      connections: string[];
    };
  },
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { requestId } = req.params;
    const userId = req?.user._id;

    const request = (await ConnectionRequest.findById(requestId)
      .populate("sender", "name email username")
      .populate("recipient", "name username")) as any;

    if (!request) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    // check if the req is for the current user
    if (request.recipient._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to accept this request" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request has already been processed" });
    }

    request.status = "accepted";
    await request.save();

    // if im your friend then ur also my friend ;)
    const sender = (await User.findById(request.sender._id)) as any;
    const recipient = (await User.findById(userId)) as any;

    if (!sender || !recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    sender.connections.push(userId);
    recipient.connections.push(request.sender._id);

    await sender.save();
    await recipient.save();

    const notification = new Notification({
      recipient: request.sender._id,
      type: "connectionAccepted",
      relatedUser: userId,
    });

    await notification.save();

    res.json({ message: "Connection accepted successfully" });

    const senderEmail = request.sender.email;
    const senderName = request.sender.name;
    const recipientName = request.recipient.name;
    const profileUrl =
      process.env.CLIENT_URL + "/profile/" + request.recipient.username;

    try {
      await sendConnectionAcceptedEmail(
        senderEmail,
        senderName,
        recipientName,
        profileUrl
      );
    } catch (error) {
      console.error("Error in sendConnectionAcceptedEmail:", error);
    }
  } catch (error) {
    console.error("Error in acceptConnectionRequest controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectConnectionRequest = async (
  req: Request & {
    user?: {
      _id: string;
    };
  },
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await ConnectionRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    if (request.recipient.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to reject this request" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request has already been processed" });
    }

    request.status = "rejected";
    await request.save();

    res.json({ message: "Connection request rejected" });
  } catch (error) {
    console.error("Error in rejectConnectionRequest controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getConnectionRequests = async (
  req: Request & {
    user?: {
      _id: string;
    };
  },
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;

    const requests = await ConnectionRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "name username profilePicture headline connections");

    res.json(requests);
  } catch (error) {
    console.error("Error in getConnectionRequests controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserConnections = async (
  req: Request & {
    user?: {
      _id: string;
    };
  },
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user._id;

    const user = await User.findById(userId).populate(
      "connections",
      "name username profilePicture headline connections"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectedUsers = await User.find({
      _id: { $in: user.connections },
    }).select("name username profilePicture headline connections");

    res.json(connectedUsers);
  } catch (error) {
    console.error("Error in getUserConnections controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeConnection = async (
  req: Request & {
    user?: {
      _id: string;
    };
  },
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const myId = req.user._id;
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!myId || !userId) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    let updatedMyUser = await User.findById(myId);
    let updatedTargetUser = await User.findById(userId);

    const updatedMyConnections = updatedMyUser?.connections?.filter(
      (connection) => connection._id.toString() !== userId.toString() // Changed from connectionId
    );

    const updatedTargetConnections = updatedTargetUser?.connections?.filter(
      (connection) => connection._id.toString() !== myId.toString()
    );

    // Update user documents
    await User.findByIdAndUpdate(myId, {
      connections: updatedMyConnections,
    });

    await User.findByIdAndUpdate(userId, {
      connections: updatedTargetConnections,
    });

    res.json({
      message: "Connection removed successfully",
    });
  } catch (error) {
    console.error("Error in removeConnection controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getConnectionStatus = async (
  req: Request & {
    user?: {
      _id: string;
      connections: string[];
    };
  },
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    const currentUser = req.user;
    if (currentUser.connections.includes(targetUserId)) {
      return res.json({ status: "connected" });
    }

    const pendingRequest = await ConnectionRequest.findOne({
      $or: [
        { sender: currentUserId, recipient: targetUserId },
        { sender: targetUserId, recipient: currentUserId },
      ],
      status: "pending",
    });

    if (pendingRequest) {
      if (pendingRequest.sender.toString() === currentUserId.toString()) {
        return res.json({ status: "pending" });
      } else {
        return res.json({ status: "received", requestId: pendingRequest._id });
      }
    }

    // if no connection or pending req found
    res.json({ status: "not_connected" });
  } catch (error) {
    console.error("Error in getConnectionStatus controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
