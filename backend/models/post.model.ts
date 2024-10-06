import mongoose, { Document, Schema } from "mongoose";
import { User } from "./user.model";

interface Comment {
  content: string;
  user: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

interface IPost extends Document {
  author: mongoose.Schema.Types.ObjectId | typeof User;
  content?: string;
  image?: string;
  likes: mongoose.Schema.Types.ObjectId[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String },
    image: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        content: { type: String },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
export { IPost, Comment };
