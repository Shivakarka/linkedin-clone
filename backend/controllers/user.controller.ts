import { Request, Response } from "express";
import { User } from "../models/user.model";
import cloudinary from "../lib/cloudinary";

export const getSuggestedConnections = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const currentUser = await User.findById(req.user._id).select("connections");

    //find users who are not already connected and also do not recommend our own profile
    const suggestedConnections = await User.find({
      _id: { $nin: currentUser?.connections, $ne: req.user._id },
    })
      .select("name username profilePicture headline")
      .limit(3);

    res.status(200).json(suggestedConnections);
  } catch (error) {
    console.error("Error in getSuggestedConnections:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getPublicProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const allowedFields = [
      "name",
      "username",
      "profilePicture",
      "headline",
      "location",
      "about",
      "coverPicture",
      "skills",
      "experience",
      "education",
    ];

    const updatedData = {} as any;
    for (const field of allowedFields) {
      if (req.body[field]) updatedData[field] = req.body[field];
    }

    if (req.body.profilePicture) {
      const result = await cloudinary.uploader.upload(req.body.profilePicture, {
        upload_preset: "linkedin",
      });
      updatedData.profilePicture = result.secure_url;
    }

    if (req.body.coverPicture) {
      const result = await cloudinary.uploader.upload(req.body.coverPicture, {
        upload_preset: "linkedin",
      });
      updatedData.coverPicture = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updatedData, {
      new: true,
    }).select("-password");

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
