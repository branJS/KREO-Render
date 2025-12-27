"use client";

import { useEffect, useRef, useState } from "react";

/*
 * AvatarUploader component
 *
 * Allows uploading an avatar image for the About section. When Cloudinary
 * environment variables (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and
 * NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) are provided, the component
 * automatically loads the Cloudinary upload widget and uses it to
 * upload images directly to your Cloudinary account. When those env
 * variables are absent (e.g. in local development), it falls back to
 * reading the selected file as a data URI via the FileReader API.
 *
 * Props:
 *  value: current image URL to display (optional)
 *  onChange: callback invoked with the new URL when a file is uploaded
 */

interface AvatarUploaderProps {
  value?: string;
  onChange: (url: string) => void;
}

export default function AvatarUploader({ value, onChange }: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  // Cloudinary env variables. If both are defined, we'll use the
  // Cloudinary upload widget for file uploads. Otherwise the fallback
  // FileReader will read the image as a data URI.
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // Load the Cloudinary widget script on mount if envs are present. This
  // script attaches a global `cloudinary` object to `window`. We only
  // inject the script once per session.
  useEffect(() => {
    if (!cloudName || !uploadPreset) return;
    if (typeof window === "undefined") return;
    if ((window as any).cloudinary) return;
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    document.body.appendChild(script);
  }, [cloudName, uploadPreset]);

  /**
   * Trigger the Cloudinary upload widget. Opens a modal UI that allows
   * selecting an image and cropping it square. On success, the secure
   * URL is passed to the onChange callback.
   */
  function openCloudinary() {
    const cn = cloudName;
    const preset = uploadPreset;
    // If Cloudinary isn't available yet (script not loaded) or envs missing,
    // fall back to local file picker.
    if (!cn || !preset || !(window as any).cloudinary) {
      inputRef.current?.click();
      return;
    }
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: cn,
        uploadPreset: preset,
        multiple: false,
        folder: "avatar",
        cropping: true,
        croppingAspectRatio: 1,
        clientAllowedFormats: ["png", "jpeg", "jpg", "webp", "gif"],
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          const info = result.info;
          onChange(info.secure_url);
        }
      }
    );
    widget.open();
  }

  /**
   * Handle selection of a local file via the hidden file input. Reads
   * the first selected file as a data URL and passes it back via
   * onChange.
   */
  function handleLocalFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      onChange(url);
      setBusy(false);
    };
    reader.onerror = () => {
      console.error("Failed to read avatar file");
      setBusy(false);
    };
    reader.readAsDataURL(file);
    // Reset the input value so selecting the same file again triggers change
    event.currentTarget.value = "";
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid var(--ink)",
          background: "#f4f4f4",
        }}
      >
        {value ? (
          <img
            src={value}
            alt="Avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--muted)",
              fontSize: "0.8rem",
            }}
          >
            No Avatar
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <button
          type="button"
          className="btn b-green"
          disabled={busy}
          onClick={() => {
            // Use Cloudinary if env variables exist; otherwise open local picker
            if (cloudName && uploadPreset && (window as any).cloudinary) {
              openCloudinary();
            } else {
              inputRef.current?.click();
            }
          }}
        >
          {busy ? "Uploading…" : value ? "Change Avatar" : "Upload Avatar"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleLocalFile}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}