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
    sendConnectionRequest(req, res);
  }
);
router.put(
  "/accept/:requestId",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    acceptConnectionRequest(req, res);
  }
);
router.put(
  "/reject/:requestId",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    rejectConnectionRequest(req, res);
  }
);
// Get all connection requests for the current user
router.get(
  "/requests",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    getConnectionRequests(req, res);
  }
);
// Get all connections for a user
router.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    getUserConnections(req, res);
  }
);
router.delete(
  "/:userId",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    removeConnection(req, res);
  }
);
router.get(
  "/status/:userId",
  (req: Request, res: Response, next: NextFunction) => {
    protectRoute(req, res, next);
  },
  (req: Request, res: Response) => {
    getConnectionStatus(req, res);
  }
);

export default router;
