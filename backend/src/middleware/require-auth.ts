import type { NextFunction, Request, Response } from "express";

import { db } from "../prisma/db";

export interface AuthenticatedRequest extends Request {
  userId?: number;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies?.session;

    if (!token) {
      res.status(401).json({
        message: "Authentication required",
      });

      return;
    }

    const sessions = await db.orm.public.Session
      .include("user")
      .where({ token })
      .all();

    const session = sessions[0];

    if (!session) {
      res.status(401).json({
        message: "Invalid session",
      });

      return;
    }

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      await db.orm.public.Session
        .where({ token })
        .delete();

      res.status(401).json({
        message: "Session expired",
      });

      return;
    }

    req.userId = session.user.id;

    next();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to authenticate",
    });
  }
}