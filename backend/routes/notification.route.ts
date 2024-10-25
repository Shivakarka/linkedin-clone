import express, { NextFunction, Request, Response } from "express";
import protectRoute from "../middleware/auth.middleware";
import {
  deleteNotification,
  getUserNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller";

const router = express.Router();

router.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    getUserNotifications;
  }
);

router.put(
  "/:id/read",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    markNotificationAsRead;
  }
);

router.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    deleteNotification;
  }
);

export default router;
