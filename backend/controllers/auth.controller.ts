import { NextFunction, Request, Response } from "express";
import { User, UserDocument } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandlers";

export const signup = async (
  req: Request,
  res: Response,
  next?: NextFunction
) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await User.findOne({ email });
    const existingUserName = await User.findOne({ username });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (existingUserName) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password should be at least 8 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    res.cookie("jwt-linkedin", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({ message: "User registered successfully" });

    const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;

    try {
      await sendWelcomeEmail(user.email, user.name, profileUrl);
    } catch (emailError) {
      console.error("Error sending welcome Email", emailError);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next?: NextFunction
) => {
  res.send("Login endpoint");
};

export const logout = async (
  req: Request,
  res: Response,
  next?: NextFunction
) => {
  res.send("Logout endpoint");
};
