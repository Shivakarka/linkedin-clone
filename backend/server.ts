import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import postRoutes from "./routes/post.route";
import notificationRoutes from "./routes/notification.route";
import connectionRoutes from "./routes/connection.route";
import { connectDB } from "./lib/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "https://linkedinclone-frontend.vercel.app",
      "http://localhost:5173",
      process?.env?.CLIENT_URL ?? "",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
    preflightContinue: true,
    optionsSuccessStatus: 204,
  })
);

// Add specific CORS headers for all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  next();
});

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to LinkedIn Clone API");
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
