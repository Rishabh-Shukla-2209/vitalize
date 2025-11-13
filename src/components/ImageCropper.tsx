"use client";

import { useState, useCallback, Dispatch, SetStateAction } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/utils";
import type { CropArea } from "@/lib/types";
import { Button } from "./ui/button";
import { FilePicker } from "./FilePicker";

export default function ImageCropper({
  setPreview,
  updating,
}: {
  setPreview: Dispatch<SetStateAction<string | null>>;
  updating: boolean;
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [cropping, setCropping] = useState(false);

  const onCropComplete = useCallback(
    (_: unknown, croppedAreaPixels: CropArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validMimeTypes.includes(file.type)) {
      setError("Only JPG, PNG, or WebP images are allowed.");
      return;
    }

    const maxSizeMB = 5;
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File must be smaller than ${maxSizeMB} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const showCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setError(null);

    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels, 400, 400);
      const url = URL.createObjectURL(blob);
      setPreview(url);
      setCropping(false);
    } catch (err) {
      console.error(err);
      setError("Failed to generate preview. Please try again.");
    }
  }, [imageSrc, croppedAreaPixels, setPreview]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {imageSrc && cropping && (
        <>
          <div className="relative w-80 h-80">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <Button variant="outline" onClick={showCroppedImage}>
            Done
          </Button>
        </>
      )}
      {error && <p className="error">{error}</p>}
      <div onClick={() => setCropping(true)} aria-disabled={updating}>
        <FilePicker onChange={onFileChange} />
      </div>
    </div>
  );
}
