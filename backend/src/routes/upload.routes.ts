import { Router } from "express";
import multer from "multer";
import type {
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";

import cloudinary from "../config/cloudinary.js";
import { requireAuth } from "../middleware/require-auth.js";
import { deleteCloudinaryImage } from "../services/cloudinary.service.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new Error("Only image files are allowed"));
      return;
    }

    callback(null, true);
  },
});

router.post(
  "/image",
  requireAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        res.status(400).json({
          message: "Aucune image fournie.",
        });

        return;
      }

      const result = await new Promise<{
        secure_url: string;
        public_id: string;
      }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "fatou-portfolio",
            resource_type: "image",
          },
          (
            error: UploadApiErrorResponse | undefined,
            uploadResult: UploadApiResponse | undefined,
          ) => {
            if (error) {
              reject(error);
              return;
            }

            if (!uploadResult) {
              reject(
                new Error("Cloudinary returned no upload result"),
              );
              return;
            }

            resolve({
              secure_url: uploadResult.secure_url,
              public_id: uploadResult.public_id,
            });
          },
        );

        stream.on("error", reject);
        stream.end(file.buffer);
      });

      res.status(201).json({
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("CLOUDINARY UPLOAD ERROR:", error);

      res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Impossible de téléverser l’image.",
      });
    }
  },
);

router.delete("/image", requireAuth, async (req, res) => {
  try {
    const { publicId } = req.body;

    if (typeof publicId !== "string" || !publicId.trim()) {
      res.status(400).json({
        message: "Identifiant public invalide.",
      });

      return;
    }

    await deleteCloudinaryImage(publicId);

    res.status(204).send();
  } catch (error) {
    console.error("CLOUDINARY DELETE ERROR:", error);

    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Impossible de supprimer l’image.",
    });
  }
});

export default router;
