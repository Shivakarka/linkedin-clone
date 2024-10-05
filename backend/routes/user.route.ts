import express from "express";
import protectRoute from "../middleware/auth.middleware";
import {
  getPublicProfile,
  getSuggestedConnections,
  updateProfile,
} from "../controllers/user.controller";

const router = express.Router();

router.get(
  "/suggestions",
  (req, res, next) => {
    protectRoute(req, res, next);
  },
  (req, res) => {
    getSuggestedConnections(req, res);
  }
);

router.get(
  "/:username",
  (req, res, next) => {
    protectRoute(req, res, next);
  },
  (req, res) => {
    getPublicProfile(req, res);
  }
);

router.put(
  "/profile",
  (req, res, next) => {
    protectRoute(req, res, next);
  },
  (req, res) => {
    updateProfile(req, res);
  }
);

export default router;
