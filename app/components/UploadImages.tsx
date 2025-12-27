"use client";

import { useRef, useState, useCallback, useEffect } from "react";
// We import the ProjectImage type from the lib store. The relative path
// here goes up two directories from `app/components` to reach `lib`.
import type { ProjectImage } from "../../lib/store/projects.store";

/**
 * UploadImages component
 *
 * A reusable uploader for adding images to a project. When Cloudinary
 * environment variables are provided, this component uses the
 * Cloudinary upload widget to store files and returns secure URLs.
 * Otherwise it falls back to reading files locally as compressed
 * data URLs. The component also supports drag-and-drop and displays
 * status messages during processing.
 */
export default function UploadImages({
  onUploaded,
  className,
}: {
  /**
   * Callback invoked when one or more images have been processed.
   * Receives an array of ProjectImage objects with id, url and alt.
   */
  onUploaded: (imgs: ProjectImage[]) => void;
  /**
   * Optional className for styling the root element.
   */
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string>("");

  // Environment variables control whether Cloudinary is used
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // Load the Cloudinary widget script when envs are available
  useEffect(() => {
    if (cloudName && uploadPreset && typeof window !== "undefined") {
      const win: any = window;
      if (!win.cloudinary) {
        const script = document.createElement("script");
        script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [cloudName, uploadPreset]);

  // Helpers
  function openPicker() {
    inputRef.current?.click();
  }

  function createWidget() {
    const win: any = window;
    if (!win.cloudinary || !cloudName || !uploadPreset) return null;
    return win.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        multiple: true,
        sources: ["local", "url", "google_drive", "dropbox"],
        folder: "portfolio",
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
        maxFileSize: 25_000_000,
      },
      (error: any, result: any) => {
        if (error) {
          console.error(error);
          setStatus(error.message || "Upload failed");
          setBusy(false);
          return;
        }
        if (result && result.event === "success") {
          const info = result.info;
          const imgs: ProjectImage[] = [
            {
              id: crypto.randomUUID(),
              url: info.secure_url,
              width: info.width,
              height: info.height,
              alt: info.original_filename ?? "",
            },
          ];
          onUploaded(imgs);
          setStatus(`Uploaded ${imgs.length} image${imgs.length === 1 ? "" : "s"}`);
        }
        if (result && result.event === "queues-end") {
          setBusy(false);
        }
      }
    );
  }

  // Compress images to data URLs when Cloudinary is disabled. This reduces
  // localStorage usage and avoids quota exceed errors. Images are
  // resized to max 1600px width and encoded as WebP for efficiency.
  async function compressToDataUrl(file: File, maxW = 1600, quality = 0.82): Promise<string> {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxW / bitmap.width);
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const type = "image/webp";
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, type, quality));
    if (!blob) throw new Error("Compression failed");
    return await new Promise<string>((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(String(fr.result));
      fr.onerror = rej;
      fr.readAsDataURL(blob);
    });
  }

  // Read and compress files when Cloudinary is disabled
  const readLocally = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setBusy(true);
      setStatus(`Processing ${files.length} image${files.length === 1 ? "" : "s"}…`);
      const out: ProjectImage[] = [];
      let processed = 0;
      try {
        for (const f of Array.from(files)) {
          if (!f.type.startsWith("image/")) continue;
          const url = await compressToDataUrl(f);
          out.push({
            id: crypto.randomUUID(),
            url,
            alt: f.name,
          });
          processed++;
          setStatus(`Processed ${processed}/${files.length}`);
        }
        if (out.length > 0) {
          onUploaded(out);
          setStatus(`Added ${out.length} image${out.length === 1 ? "" : "s"}`);
        } else {
          setStatus("No images added.");
        }
      } catch (e: any) {
        console.error(e);
        setStatus(e?.message || "Failed to process images");
      } finally {
        setBusy(false);
      }
    },
    [onUploaded]
  );

  // Handle file input change
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (cloudName && uploadPreset && (window as any).cloudinary) {
      // prefer Cloudinary widget
      const widget = createWidget();
      if (widget) {
        setBusy(true);
        widget.open();
      } else {
        // fallback to local read
        readLocally(e.target.files);
      }
    } else {
      readLocally(e.target.files);
    }
    e.currentTarget.value = "";
  }

  // Click handler: open Cloudinary widget or file picker
  function handleClick() {
    if (cloudName && uploadPreset && (window as any).cloudinary) {
      const widget = createWidget();
      if (widget) {
        setBusy(true);
        widget.open();
        return;
      }
    }
    openPicker();
  }

  return (
    <div className={className ?? ""}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="hidden"
        tabIndex={-1}
        aria-hidden
      />
      <button className="btn" onClick={handleClick} disabled={busy}>
        {busy ? "Processing…" : "Add Images"}
      </button>
      {status && <div className="status" style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>{status}</div>}
    </div>
  );
}