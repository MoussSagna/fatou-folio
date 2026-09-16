import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import authRoutes from "./routes/auth.routes.js";
import experienceRouter from "./routes/experience.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import projectRoutes from "./routes/project.routes.js";
import skillRouter from "./routes/skill.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

const frontendUrl =
  process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/skills", skillRouter);
app.use("/api/experiences", experienceRouter);

export default app;