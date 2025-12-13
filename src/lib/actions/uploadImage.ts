"use server";

import cloudinary from "../cloudinary";
import { UploadApiResponse } from "cloudinary";
import { fileTypeFromBuffer } from "file-type";
import { revalidatePath } from "next/cache";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

export async function uploadCroppedImage(file: Blob, folder: string) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const sizeMB = buffer.byteLength / (1024 * 1024);
  if (sizeMB > MAX_SIZE_MB) {
    throw new Error(`File too large. Max allowed size is ${MAX_SIZE_MB} MB.`);
  }

  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || !ALLOWED_MIME_TYPES.includes(detected.mime)) {
    throw new Error("Invalid or unsupported file type.");
  }

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });

  revalidatePath("/profile");

  const transformedUrl = result.secure_url.replace(
    "/upload/",
    "/upload/w_500,h_500,c_fill,g_face,f_auto,q_auto/",
  );

  return transformedUrl;
}
