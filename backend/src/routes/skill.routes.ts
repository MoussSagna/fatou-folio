import { Router } from "express";

import { requireAuth } from "../middleware/require-auth.js";
import { db } from "../prisma/db.js";

const router = Router();

interface SkillRequestBody {
  number: string;
  title: string;
  description: string;
  order?: number;
}

router.get("/", async (_req, res) => {
  try {
    const skills = await db.orm.public.Skill
      .where({ profileId: 1 })
      .all();

    const sortedSkills = [...skills].sort(
      (a, b) => a.order - b.order,
    );

    res.json(sortedSkills);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch skills",
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      number,
      title,
      description,
      order,
    } = req.body as SkillRequestBody;

    if (
      typeof number !== "string" ||
      typeof title !== "string" ||
      typeof description !== "string"
    ) {
      res.status(400).json({
        message: "Invalid skill data",
      });

      return;
    }

    const skill = await db.orm.public.Skill.create({
      number: number.trim(),
      title: title.trim(),
      description: description.trim(),
      order: order ?? 0,
      profileId: 1,
    });

    res.status(201).json(skill);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create skill",
    });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        message: "Invalid skill id",
      });

      return;
    }

    const {
      number,
      title,
      description,
      order,
    } = req.body as SkillRequestBody;

    if (
      typeof number !== "string" ||
      typeof title !== "string" ||
      typeof description !== "string"
    ) {
      res.status(400).json({
        message: "Invalid skill data",
      });

      return;
    }

    const skills = await db.orm.public.Skill
      .where({
        id,
        profileId: 1,
      })
      .all();

    const skill = skills[0];

    if (!skill) {
      res.status(404).json({
        message: "Skill not found",
      });

      return;
    }

    await db.orm.public.Skill
      .where({
        id,
        profileId: 1,
      })
      .update({
        number: number.trim(),
        title: title.trim(),
        description: description.trim(),
        order: order ?? 0,
      });

    const updatedSkills = await db.orm.public.Skill
      .where({
        id,
        profileId: 1,
      })
      .all();

    res.json(updatedSkills[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update skill",
    });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        message: "Invalid skill id",
      });

      return;
    }

    const skills = await db.orm.public.Skill
      .where({
        id,
        profileId: 1,
      })
      .all();

    const skill = skills[0];

    if (!skill) {
      res.status(404).json({
        message: "Skill not found",
      });

      return;
    }

    await db.orm.public.Skill
      .where({
        id,
        profileId: 1,
      })
      .delete();

    res.status(204).send();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete skill",
    });
  }
});

export default router;