import cloudinary from "../lib/cloudinary";
import Post from "../models/post.model";
import Notification from "../models/notification.model";
import { sendCommentNotificationEmail } from "../emails/emailHandlers";
import { Request, Response } from "express";
import { User } from "../models/user.model";

export const getFeedPosts = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const userId = req.user._id;

    // Fetch and populate the user's connections
    const user = await User.findById(userId).populate("connections");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract connection IDs
    const userConnections = user.connections.map(
      (connection: any) => connection._id
    );

    // Query posts by author
    const posts = await Post.find({
      author: { $in: [...userConnections, userId] },
    })
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getFeedPosts controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createPost = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const { content, image } = req.body;
    let newPost;

    if (image) {
      const imgResult = await cloudinary.uploader.upload(image);
      newPost = new Post({
        author: req.user._id,
        content,
        image: imgResult.secure_url,
      });
    } else {
      newPost = new Post({
        author: req.user._id,
        content,
      });
    }

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // check if the current user is the author of the post
    if (post.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    // delete the image from cloudinary as well!
    if (post.image) {
      await cloudinary.uploader.destroy(
        post?.image?.split("/")?.pop()?.split(".")?.[0] ?? ""
      );
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error: any) {
    console.log("Error in delete post controller", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPostById = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture username headline");

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in getPostById controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createComment = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { user: req.user._id, content } },
      },
      { new: true }
    ).populate("author", "name email username headline profilePicture");

    if (!post?.author) {
      throw new Error("Author not found");
    }

    // create a notification if the comment owner is not the post owner
    if (post.author instanceof User) {
      if ((post.author as any)._id.toString() !== req.user._id.toString()) {
        const newNotification = new Notification({
          recipient: post.author._id,
          type: "comment",
          relatedUser: req.user._id,
          relatedPost: postId,
        });

        await newNotification.save();

        try {
          const postUrl = `${process.env.CLIENT_URL}/post/${postId}`;
          await sendCommentNotificationEmail(
            post.author.email,
            post.author.name,
            req.user.name,
            postUrl,
            content
          );
        } catch (error) {
          console.log("Error in sending comment notification email:", error);
        }
      }
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in createComment controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const likePost = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    const userId = req.user._id;

    if (post?.likes.includes(userId)) {
      // unlike the post
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // like the post
      post?.likes.push(userId);
      // create a notification if the post owner is not the user who liked
      if (post?.author.toString() !== userId.toString()) {
        const newNotification = new Notification({
          recipient: post?.author,
          type: "like",
          relatedUser: userId,
          relatedPost: postId,
        });

        await newNotification.save();
      }
    }

    if (!post) {
      throw new Error("Post not found");
    }

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in likePost controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
