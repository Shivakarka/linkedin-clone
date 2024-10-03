import express from "express";
import { login, logout, signup } from "../controllers/auth.controller";

const router = express.Router();
router.post("/signup", (req, res, next) => {
  signup(req, res, next).catch(next);
});

router.post("/login", (req, res, next) => {
  login(req, res, next).catch(next);
});

router.post("/logout", (req, res, next) => {
  logout(req, res, next).catch(next);
});
export default router;
