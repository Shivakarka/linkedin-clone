import express, { NextFunction, Request, Response } from "express";
import protectRoute from "../middleware/auth.middleware";
import {
  acceptConnectionRequest,
  getConnectionRequests,
  getConnectionStatus,
  getUserConnections,
  rejectConnectionRequest,
  removeConnection,
  sendConnectionRequest,
} from "../controllers/connection.controller";

const router = express.Router();

router.post(
  "/request/:userId",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    sendConnectionRequest;
  }
);
router.put(
  "/accept/:requestId",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    acceptConnectionRequest;
  }
);
router.put(
  "/reject/:requestId",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    rejectConnectionRequest;
  }
);
// Get all connection requests for the current user
router.get(
  "/requests",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    getConnectionRequests;
  }
);
// Get all connections for a user
router.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    getUserConnections;
  }
);
router.delete(
  "/:userId",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    removeConnection;
  }
);
router.get(
  "/status/:userId",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    getConnectionStatus;
  }
);

export default router;
