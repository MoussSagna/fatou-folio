import type { NextFunction, Request, Response } from "express";

import { db } from "../prisma/db.js";

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
        message: "Authentification requise.",
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
        message: "Session invalide.",
      });

      return;
    }

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      await db.orm.public.Session
        .where({ token })
        .delete();

      res.status(401).json({
        message: "La session a expiré.",
      });

      return;
    }

    req.userId = session.user.id;

    next();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Impossible de vous authentifier.",
    });
  }
}
