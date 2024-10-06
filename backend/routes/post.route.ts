import express from "express";
import protectRoute from "../middleware/auth.middleware";
import {
  createComment,
  createPost,
  deletePost,
  getFeedPosts,
  getPostById,
  likePost,
} from "../controllers/post.controller";

const router = express.Router();

router.get(
  "/",
  (req, res, next) => {
    protectRoute(req, res, next);
  },
  (req, res) => {
    getFeedPosts(req, res);
  }
);

router.post(
  "/create",
  (req, res, next) => {
    protectRoute(req, res, next);
  },
  createPost
);

router.delete(
  "/delete/:id",
  (req, res, next) => {
    protectRoute(req, res, next);
  },
  (req, res) => {
    deletePost(req, res);
  }
);

router.get(
  "/:id",
  (res, req, next) => {
    protectRoute(res, req, next);
  },
  getPostById
);

router.post(
  "/:id/comment",
  (res, req, next) => {
    protectRoute(res, req, next);
  },
  createComment
);

router.post(
  "/:id/like",
  (res, req, next) => {
    protectRoute(res, req, next);
  },
  likePost
);

export default router;
