import { Router } from "express";

import { requireAuth } from "../middleware/require-auth.js";
import { db } from "../prisma/db.js";
import { deleteCloudinaryImage } from "../services/cloudinary.service.js";
import { getPortfolioProfile } from "../services/profile.service.js";

const router = Router();

interface ProfileRequestBody {
  name: string;
  title: string;
  bio: string;
  profileImage?: string | null;
  profileImagePublicId?: string | null;
  location?: string | null;
  contactEmail?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  behance?: string | null;
  dribbble?: string | null;
  cvUrl?: string | null;

  heroAvailabilityText?: string | null;
  heroCtaText?: string | null;
  aboutLabel?: string | null;
  aboutSecondaryText?: string | null;
  aboutCtaText?: string | null;
  skillsLabel?: string | null;
  skillsHeading?: string | null;
  experienceLabel?: string | null;
  experienceHeading?: string | null;
  contactLabel?: string | null;
  contactHeading?: string | null;
  contactAvailabilityText?: string | null;
  contactCtaText?: string | null;
  footerAvailabilityText?: string | null;
}

router.get("/", async (_req, res) => {
  try {
    const profile = await getPortfolioProfile();

    if (!profile) {
      res.json({
        id: 1,
        name: "",
        title: "",
        bio: "",
        profileImage: null,
        profileImagePublicId: null,
        location: null,
        contactEmail: null,
        instagram: null,
        linkedin: null,
        behance: null,
        dribbble: null,
        cvUrl: null,
        heroAvailabilityText: null,
        heroCtaText: null,
        aboutLabel: null,
        aboutSecondaryText: null,
        aboutCtaText: null,
        skillsLabel: null,
        skillsHeading: null,
        experienceLabel: null,
        experienceHeading: null,
        contactLabel: null,
        contactHeading: null,
        contactAvailabilityText: null,
        contactCtaText: null,
        footerAvailabilityText: null,
        skills: [],
      });

      return;
    }

    res.json({
      ...profile,
      skills: [],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Impossible de récupérer le profil.",
    });
  }
});

router.put("/", requireAuth, async (req, res) => {
  try {
    const {
      name,
      title,
      bio,
      profileImage,
      profileImagePublicId,
      location,
      contactEmail,
      instagram,
      linkedin,
      behance,
      dribbble,
      cvUrl,
      heroAvailabilityText,
      heroCtaText,
      aboutLabel,
      aboutSecondaryText,
      aboutCtaText,
      skillsLabel,
      skillsHeading,
      experienceLabel,
      experienceHeading,
      contactLabel,
      contactHeading,
      contactAvailabilityText,
      contactCtaText,
      footerAvailabilityText,
    } = req.body as ProfileRequestBody;

    if (
      typeof name !== "string" ||
      typeof title !== "string" ||
      typeof bio !== "string"
    ) {
      res.status(400).json({
        message: "Les données du profil sont invalides.",
      });

      return;
    }

    const existingProfile = await getPortfolioProfile();

    const profileData = {
      name: name.trim(),
      title: title.trim(),
      bio: bio.trim(),
      profileImage: profileImage?.trim() || null,
      profileImagePublicId:
        profileImagePublicId?.trim() || null,
      location: location?.trim() || null,
      contactEmail: contactEmail?.trim() || null,
      instagram: instagram?.trim() || null,
      linkedin: linkedin?.trim() || null,
      behance: behance?.trim() || null,
      dribbble: dribbble?.trim() || null,
      cvUrl: cvUrl?.trim() || null,
      heroAvailabilityText:
        heroAvailabilityText?.trim() || null,
      heroCtaText: heroCtaText?.trim() || null,
      aboutLabel: aboutLabel?.trim() || null,
      aboutSecondaryText:
        aboutSecondaryText?.trim() || null,
      aboutCtaText: aboutCtaText?.trim() || null,
      skillsLabel: skillsLabel?.trim() || null,
      skillsHeading: skillsHeading?.trim() || null,
      experienceLabel:
        experienceLabel?.trim() || null,
      experienceHeading:
        experienceHeading?.trim() || null,
      contactLabel: contactLabel?.trim() || null,
      contactHeading:
        contactHeading?.trim() || null,
      contactAvailabilityText:
        contactAvailabilityText?.trim() || null,
      contactCtaText:
        contactCtaText?.trim() || null,
      footerAvailabilityText:
        footerAvailabilityText?.trim() || null,
    };

    if (existingProfile) {
      const oldProfileImagePublicId =
        existingProfile.profileImagePublicId;

      await db.orm.public.Profile
        .where({ id: existingProfile.id })
        .update(profileData);

      if (
        oldProfileImagePublicId &&
        oldProfileImagePublicId !== profileImagePublicId
      ) {
        try {
          await deleteCloudinaryImage(
            oldProfileImagePublicId,
          );
        } catch (error) {
          console.error(
            `Failed to delete old profile image ${oldProfileImagePublicId}:`,
            error,
          );
        }
      }
    } else {
      await db.orm.public.Profile.create({
        ...profileData,
      });
    }

    const profile = await getPortfolioProfile();

    res.json({
      ...profile,
      skills: [],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Impossible de mettre à jour le profil.",
    });
  }
});

export default router;
