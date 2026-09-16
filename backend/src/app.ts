import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import authRoutes from "./routes/auth.routes";
import experienceRouter from "./routes/experience.routes";
import profileRoutes from "./routes/profile.routes";
import projectRoutes from "./routes/project.routes";
import skillRouter from "./routes/skill.routes";
import uploadRoutes from "./routes/upload.routes";

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