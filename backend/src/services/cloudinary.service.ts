import cloudinary from "../config/cloudinary";

export async function deleteCloudinaryImage(
  publicId: string,
): Promise<void> {
  if (!publicId) {
    return;
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(
      `Unable to delete Cloudinary image: ${result.result}`,
    );
  }
}