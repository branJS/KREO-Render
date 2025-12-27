"use client";

/*
 * Cloudinary upload widget component.
 *
 * This component loads Cloudinary's upload widget on demand and exposes a
 * simple button for uploading images.  When an upload succeeds the
 * `onUpload` callback receives the secure URL of the uploaded asset.
 *
 * To configure the widget you must define the following environment
 * variables in `.env.local`:
 *  - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 *  - NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
 * See README.md for details.
 */

import { useEffect } from "react";
import Script from "next/script";

interface Props {
  onUpload: (url: string) => void;
}

export default function ImageUploader({ onUpload }: Props) {
  // Ensure Cloudinary widget script is included in the page head.  The
  // widget attaches itself to `window.cloudinary` once loaded.
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    if (!cloudName || !uploadPreset) {
      console.warn(
        "Cloudinary credentials missing: define NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env.local file."
      );
    }
  }, [cloudName, uploadPreset]);

  function openWidget() {
    if (typeof window === "undefined" || !(window as any).cloudinary) {
      console.error("Cloudinary upload widget is not available");
      return;
    }
    const cloudinary: any = (window as any).cloudinary;
    const widget = cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        multiple: true,
        sources: ["local", "url", "camera", "google_drive", "dropbox", "instagram"],
        folder: "portfolio", // optional folder name in your Cloudinary account
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          onUpload(result.info.secure_url);
        }
      }
    );
    widget.open();
  }

  return (
    <>
      {/* Cloudinary's script must be included exactly once.  next/script
          ensures it loads only on the client. */}
      <Script
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        strategy="lazyOnload"
      />
      <button
        type="button"
        onClick={openWidget}
        className="rounded bg-blue-500 text-white py-2 px-4 hover:bg-blue-600"
      >
        Upload Image
      </button>
    </>
  );
}