import { Router } from "express";

import { requireAuth } from "../middleware/require-auth";
import { db } from "../prisma/db";

const router = Router();

interface ExperienceRequestBody {
  period: string;
  company: string;
  role: string;
  location?: string | null;
  description: string;
  order?: number;
}

router.get("/", async (_req, res) => {
  try {
    const experiences = await db.orm.public.Experience
      .where({ profileId: 1 })
      .all();

    const sortedExperiences = [...experiences].sort(
      (a, b) => a.order - b.order,
    );

    res.json(sortedExperiences);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch experiences",
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      period,
      company,
      role,
      location,
      description,
      order,
    } = req.body as ExperienceRequestBody;

    if (
      typeof period !== "string" ||
      typeof company !== "string" ||
      typeof role !== "string" ||
      typeof description !== "string"
    ) {
      res.status(400).json({
        message: "Invalid experience data",
      });

      return;
    }

    const experience =
      await db.orm.public.Experience.create({
        period: period.trim(),
        company: company.trim(),
        role: role.trim(),
        location: location?.trim() || null,
        description: description.trim(),
        order: order ?? 0,
        profileId: 1,
      });

    res.status(201).json(experience);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create experience",
    });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        message: "Invalid experience id",
      });

      return;
    }

    const {
      period,
      company,
      role,
      location,
      description,
      order,
    } = req.body as ExperienceRequestBody;

    if (
      typeof period !== "string" ||
      typeof company !== "string" ||
      typeof role !== "string" ||
      typeof description !== "string"
    ) {
      res.status(400).json({
        message: "Invalid experience data",
      });

      return;
    }

    const experiences =
      await db.orm.public.Experience
        .where({
          id,
          profileId: 1,
        })
        .all();

    const experience = experiences[0];

    if (!experience) {
      res.status(404).json({
        message: "Experience not found",
      });

      return;
    }

    await db.orm.public.Experience
      .where({
        id,
        profileId: 1,
      })
      .update({
        period: period.trim(),
        company: company.trim(),
        role: role.trim(),
        location: location?.trim() || null,
        description: description.trim(),
        order: order ?? 0,
      });

    const updatedExperiences =
      await db.orm.public.Experience
        .where({
          id,
          profileId: 1,
        })
        .all();

    res.json(updatedExperiences[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update experience",
    });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        message: "Invalid experience id",
      });

      return;
    }

    const experiences =
      await db.orm.public.Experience
        .where({
          id,
          profileId: 1,
        })
        .all();

    const experience = experiences[0];

    if (!experience) {
      res.status(404).json({
        message: "Experience not found",
      });

      return;
    }

    await db.orm.public.Experience
      .where({
        id,
        profileId: 1,
      })
      .delete();

    res.status(204).send();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete experience",
    });
  }
});

export default router;