"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectStore, Project, ProjectImage } from "../../../lib/store/projects.store";
// Import the edit mode hook from the providers file. From this file's
// location (app/projects/[slug]), the providers file is two levels up.
import { useEditMode } from "../../providers";
// Import the custom uploader component for images. It resides in
// app/components, which is also two levels up from this file.
import UploadImages from "../../components/UploadImages";

// Grab Cloudinary environment variables. These are exposed on the client
// through NEXT_PUBLIC_ prefixes. When present they indicate that the
// Cloudinary upload widget should be used and that data URLs should be
// migrated to Cloudinary on publish.
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// Upload a data URI to Cloudinary via their unsigned upload API. Returns
// the secure URL on success. If Cloudinary is not configured, the
// original data URI is returned unchanged.
async function uploadDataUrlToCloudinary(dataUrl: string): Promise<string> {
  if (!cloudName || !uploadPreset) {
    return dataUrl;
  }
  try {
    const fd = new FormData();
    fd.append('file', dataUrl);
    fd.append('upload_preset', uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: 'POST',
      body: fd,
    });
    if (!res.ok) {
      throw new Error(`Cloudinary upload failed: ${res.status}`);
    }
    const json = await res.json();
    return json.secure_url as string;
  } catch (e) {
    console.error('Failed to upload to Cloudinary', e);
    // If upload fails return the original data URI so at least it is not lost
    return dataUrl;
  }
}

// Ensure all project images have Cloudinary URLs. If an image has a
// data URI (starts with 'data:'), it will be uploaded to Cloudinary.
async function ensureCloudUrls(images: ProjectImage[]): Promise<ProjectImage[]> {
  const out: ProjectImage[] = [];
  for (const img of images) {
    if (img.url && img.url.startsWith('data:')) {
      const url = await uploadDataUrlToCloudinary(img.url);
      out.push({ ...img, url });
    } else {
      out.push(img);
    }
  }
  return out;
}

/**
 * Project page – displays a single project. When editing, this page allows
 * inline editing of the title, description, and images. Images can be
 * uploaded via a file input, reordered with simple up/down buttons, and
 * removed. A draft can be saved or published. When not editing, the
 * published snapshot is shown.
 */
export default function ProjectPage() {
  // Grab the slug from the route. The folder name [slug] means Next.js will
  // populate this param for us. Type assertion helps TypeScript know the type.
  const params = useParams();
  const slug = (params?.slug as string) || "";

  const router = useRouter();
  const { isEditing } = useEditMode();

  // Local state for the project. When editing we'll work on the draft
  // project stored in localStorage. When not editing we'll load the
  // published snapshot. If the slug doesn't exist, project will be null.
  const [project, setProject] = useState<Project | null>(null);

  // Load the appropriate project (draft or published) when the slug or
  // editing state changes. If editing and no draft exists, attempt to
  // initialize a draft from the published snapshot.
  useEffect(() => {
    if (!slug) return;
    if (typeof window === "undefined") return;
    if (isEditing) {
      let draft = ProjectStore.getDraft(slug);
      if (!draft) {
        const pub = ProjectStore.getPublished(slug);
        if (pub) {
          // Create a draft copy of the published project so it can be edited
          draft = {
            ...pub,
            status: "draft",
            updatedAt: Date.now(),
          };
          ProjectStore.updateDraft(draft);
        }
      }
      setProject(draft || null);
    } else {
      const pub = ProjectStore.getPublished(slug);
      setProject(pub || null);
    }
  }, [slug, isEditing]);

  // If no project found, show a simple message
  if (!project) {
    return (
      <main className="section">
        <div className="panel">
          <p>Project not found.</p>
          <button className="btn b-yellow" onClick={() => router.push("/#projects")}>← Back to Projects</button>
        </div>
      </main>
    );
  }

  /**
   * Update the draft in state and persist to localStorage. This helper
   * ensures we always update the updatedAt timestamp and call the
   * ProjectStore. Only used when editing.
   */
  function updateDraft(updated: Project) {
    const now = Date.now();
    const newDraft: Project = { ...updated, updatedAt: now };
    setProject(newDraft);
    ProjectStore.updateDraft(newDraft);
  }

  /**
   * Handle file input change. Read each selected image as a data URL and
   * append to the project's images array. Only valid image MIME types
   * are processed.
   */
  function handleAddImages(e: React.ChangeEvent<HTMLInputElement>) {
    if (!project) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newImages: ProjectImage[] = [];
    let processed = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        newImages.push({
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          url,
        });
        processed++;
        if (processed === files.length) {
          // Append images after processing all files
          const updatedProj: Project = {
            ...project,
            images: [...project.images, ...newImages],
          };
          updateDraft(updatedProj);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset the input value so the same file can be reselected
    e.target.value = "";
  }

  /**
   * Handle images returned from the UploadImages component. When images
   * are added, append them to the project's images and persist as a draft.
   */
  function handleUploadedImages(imgs: ProjectImage[]) {
    if (!project || !Array.isArray(imgs) || imgs.length === 0) return;
    const updated: Project = {
      ...project,
      images: [...project.images, ...imgs],
    };
    updateDraft(updated);
  }

  /**
   * Swap images at indices i and j within the project's images array.
   */
  function swapImages(i: number, j: number) {
    if (!project) return;
    const arr = [...project.images];
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
    updateDraft({ ...project, images: arr });
  }

  /**
   * Remove image at index i.
   */
  function removeImage(i: number) {
    if (!project) return;
    const arr = project.images.filter((_, idx) => idx !== i);
    updateDraft({ ...project, images: arr });
  }

  /**
   * Save the current draft. Persist the state to localStorage and display
   * feedback to the user.
   */
  function handleSaveDraft() {
    if (!project) return;
    updateDraft(project);
    alert("Draft saved");
  }

  /**
   * Publish the current project. Copies the draft to the published
   * collection and marks it as published. The published copy is returned
   * by ProjectStore.publish and we also update the local state accordingly.
   */
  function handlePublish() {
    if (!project) return;
    // Wrap publish in async to allow image migration
    (async () => {
      try {
        // First ensure all images are hosted on Cloudinary. If a data URI
        // exists it will be uploaded and replaced with a secure URL. This
        // prevents localStorage from growing too large and ensures images
        // load quickly when published.
        const sanitizedImages = await ensureCloudUrls(project.images || []);
        const updated: Project = { ...project, images: sanitizedImages };
        // Persist sanitized draft before publishing
        updateDraft(updated);
        const published = ProjectStore.publish(updated.slug);
        if (published) {
          setProject(published);
          alert('Project published!');
        } else {
          alert('Failed to publish project');
        }
      } catch (e) {
        console.error(e);
        alert('Publish failed. Check console for details.');
      }
    })();
  }

  // Event handlers for title and description. They update state and draft
  function handleTitleBlur(e: React.FocusEvent<HTMLHeadingElement>) {
    if (!project) return;
    const text = e.currentTarget.textContent?.trim() || "";
    if (text && text !== project.title) {
      updateDraft({ ...project, title: text });
    }
  }

  function handleDescriptionBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (!project) return;
    const html = e.currentTarget.innerHTML;
    if (html !== project.descriptionHTML) {
      updateDraft({ ...project, descriptionHTML: html });
    }
  }

  return (
    <main className="section" style={{ padding: "2rem" }}>
      <div className="panel">
        <button className="btn b-yellow" onClick={() => router.push("/#projects")}>← Back to Projects</button>
        {/* Title */}
        {isEditing ? (
          <h2
            className="section-title"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleBlur}
            style={{ marginTop: "1rem", marginBottom: "0.5rem" }}
          >
            {project.title || "Untitled Project"}
          </h2>
        ) : (
          <h2 className="section-title" style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
            {project.title || "Untitled Project"}
          </h2>
        )}
        {/* Description */}
        {isEditing ? (
          <div
            className="section-body"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleDescriptionBlur}
            dangerouslySetInnerHTML={{ __html: project.descriptionHTML || "<p>Add a project description…</p>" }}
            style={{ border: "1px dashed var(--ink)", padding: "0.5rem", marginBottom: "1rem", minHeight: "60px" }}
          />
        ) : (
          <div
            className="section-body"
            dangerouslySetInnerHTML={{ __html: project.descriptionHTML || "" }}
            style={{ marginBottom: "1rem" }}
          />
        )}
        {/* Image upload (only when editing) */}
        {isEditing && (
          <div style={{ marginBottom: "1rem" }}>
            {/* Replace the native file input with our custom UploadImages component */}
            <UploadImages onUploaded={handleUploadedImages} />
          </div>
        )}
        {/* Image gallery */}
        <div>
          {project.images && project.images.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {project.images.map((img, idx) => (
                <li key={img.id} style={{ marginBottom: "1rem" }}>
                  <img
                    src={img.url}
                    alt={project.title}
                    style={{ width: "100%", height: "auto", display: "block", borderRadius: "4px" }}
                  />
                  {isEditing && (
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                      <button
                        className="btn b-black outline"
                        disabled={idx === 0}
                        onClick={() => swapImages(idx, idx - 1)}
                      >
                        ↑
                      </button>
                      <button
                        className="btn b-black outline"
                        disabled={idx === project.images.length - 1}
                        onClick={() => swapImages(idx, idx + 1)}
                      >
                        ↓
                      </button>
                      <button
                        className="btn b-red outline"
                        onClick={() => removeImage(idx)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
              {isEditing ? "No images yet. Use 'Add Images' to upload." : "No images to display."}
            </p>
          )}
        </div>
        {/* Publish / Save controls */}
        {isEditing && (
          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <button className="btn b-blue" onClick={handleSaveDraft} data-magnetic>
              Save Draft
            </button>
            <button className="btn b-teal" onClick={handlePublish} data-magnetic>
              Publish
            </button>
          </div>
        )}
      </div>
    </main>
  );
}