import express, { NextFunction, Request, Response } from "express";
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
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    getFeedPosts(req, res);
  }
);

router.post(
  "/create",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    createPost(req, res);
  }  
);

router.delete(
  "/delete/:id",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    deletePost(req, res);
  }  
);

router.get(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    getPostById(req, res);
  }
);

router.post(
  "/:id/comment",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    createComment(req, res);
  }
);

router.post(
  "/:id/like",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    likePost(req, res);
  }
);

export default router;
