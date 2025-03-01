import { Request, Response } from "express";
import Notification from "../models/notification.model";

export const getUserNotifications = async (
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
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate("relatedUser", "name username profilePicture")
      .populate("relatedPost", "content image");

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error in getUserNotifications controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markNotificationAsRead = async (
  req: Request & {
    user?: {
      _id: string;
    };
  },
  res: Response
) => {
  const notificationId = req.params.id;
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const notification = await Notification.findByIdAndUpdate(
      { _id: notificationId, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    res.json(notification);
  } catch (error) {
    console.error("Error in markNotificationAsRead controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNotification = async (
  req: Request & {
    user?: {
      _id: string;
    };
  },
  res: Response
) => {
  const notificationId = req.params.id;

  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: req.user._id,
    });

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
