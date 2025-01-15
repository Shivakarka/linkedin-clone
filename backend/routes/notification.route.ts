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
    getUserNotifications(req, res);
  }
);

router.put(
  "/:id/read",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    markNotificationAsRead(req, res);
  }
);

router.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    deleteNotification(req, res);
  }
);

export default router;
