import { Router } from "express";
import multer from "multer";

import cloudinary from "../config/cloudinary";
import { requireAuth } from "../middleware/require-auth";
import { deleteCloudinaryImage } from "../services/cloudinary.service";

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
      if (!req.file) {
        res.status(400).json({
          message: "No image provided",
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
          (error, uploadResult) => {
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
        const file = req.file;

        if (!file) {
          res.status(400).json({
            message: "No file uploaded",
          });

          return;
        }

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
            : "Failed to upload image",
      });
    }
  },
);

router.delete("/image", requireAuth, async (req, res) => {
  try {
    const { publicId } = req.body;

    if (typeof publicId !== "string" || !publicId.trim()) {
      res.status(400).json({
        message: "Invalid publicId",
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
          : "Failed to delete image",
    });
  }
});

export default router;