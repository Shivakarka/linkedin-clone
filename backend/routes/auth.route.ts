import express, { NextFunction } from "express";
import {
  getCurrentUser,
  login,
  logout,
  signup,
} from "../controllers/auth.controller";
import protectRoute from "../middleware/auth.middleware";

const router = express.Router();
router.post("/signup", (req, res, next: NextFunction) => {
  signup(req, res, next).catch(next);
});

router.post("/login", (req, res, next: NextFunction) => {
  login(req, res, next).catch(next);
});

router.post("/logout", (req, res, next: NextFunction) => {
  logout(req, res, next).catch(next);
});

router.get(
  "/me",
  (req, res, next: NextFunction) => {
    protectRoute(req, res, next).catch(next);
  },
  (req, res, next: NextFunction) => {
    getCurrentUser(req, res, next).catch(next);
  }
);

export default router;
