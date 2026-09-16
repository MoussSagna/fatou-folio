import { randomBytes } from "node:crypto";
import { Router } from "express";

import { db } from "../prisma/db.js";
import { verifyPassword } from "../auth/password.js";

const router = Router();

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({
        message: "L’e-mail et le mot de passe sont obligatoires.",
      });

      return;
    }

    const users = await db.orm.public.User
      .where({ email: email.toLowerCase().trim() })
      .all();

    const user = users[0];

    if (!user) {
      res.status(401).json({
        message: "E-mail ou mot de passe incorrect.",
      });

      return;
    }

    const passwordValid = await verifyPassword(
      password,
      user.passwordHash,
    );

    if (!passwordValid) {
      res.status(401).json({
        message: "E-mail ou mot de passe incorrect.",
      });

      return;
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(
      Date.now() + SESSION_DURATION_MS,
    ).toISOString();

    await db.orm.public.Session.create({
      token,
      expiresAt,
      userId: user.id,
    });

    res.cookie("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(expiresAt),
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Impossible de se connecter.",
    });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const token = req.cookies?.session;

    if (token) {
      await db.orm.public.Session
        .where({ token })
        .delete();
    }

    res.clearCookie("session");

    res.status(204).send();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Impossible de se déconnecter.",
    });
  }
});

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.session;

    if (!token) {
      res.status(401).json({
        message: "Non authentifié.",
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
        message: "Non authentifié.",
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

    res.json({
      user: {
        id: session.user.id,
        email: session.user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Impossible de vérifier l’authentification.",
    });
  }
});

export default router;
