import mongoose from "mongoose";

type Experience = {
  title: string;
  company: string;
  startDate: Date;
  endDate: Date;
  description: string;
};

type Education = {
  school: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
};

type Connection = {
  userId: mongoose.Schema.Types.ObjectId;
};

interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  coverPicture?: string;
  headline?: string;
  location?: string;
  about?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  connections: Connection[];
}

// Define the User document type
interface UserDocument extends IUser, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    headline: {
      type: String,
      default: "Linkedin User",
    },
    location: {
      type: String,
      default: "India",
    },
    about: {
      type: String,
      default: "",
    },
    skills: [String],
    experience: [
      {
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    education: [
      {
        school: String,
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number,
      },
    ],
    connections: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<UserDocument>("User", userSchema);

export { User, IUser, UserDocument };
