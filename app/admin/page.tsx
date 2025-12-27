"use client";

/*
 * Next‑generation project editor for the portfolio site.  This page is
 * accessible only after logging in.  It allows editing a single
 * project consisting of a title, rich text description and an image
 * gallery with captions.  All data is persisted in the browser via
 * localStorage so that drafts are saved automatically and can be
 * published when ready.
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '../components/RichTextEditor';
import { ProjectStore } from '../../lib/store/projects.store';

interface ImageItem {
  id: string;
  dataUrl: string;
  caption: string;
}

interface EditorProject {
  title: string;
  description: string;
  images: ImageItem[];
}

export default function AdminEditorPage() {
  const router = useRouter();
  const [project, setProject] = useState<EditorProject>({ title: '', description: '', images: [] });
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const draftKey = 'projectDraft';
  const publishedKey = 'projectPublished';
  const draftSlugKey = 'projectDraftSlug';

  // On mount: ensure user is logged in and load draft
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Load existing draft if available (prefer ProjectStore draft if slug exists)
    const saved = localStorage.getItem(draftKey);
    const slug = localStorage.getItem(draftSlugKey);
    if (slug) {
      const storeDraft = ProjectStore.getDraft(slug);
      if (storeDraft) {
        // map store draft -> editor shape
        const mapped: EditorProject = {
          title: storeDraft.title,
          description: storeDraft.descriptionHTML,
          images: storeDraft.images.map((img) => ({ id: img.id, dataUrl: img.url, caption: img.alt || '' })),
        };
        setProject(mapped);
      }
    } else if (saved) {
      try {
        const parsed: EditorProject = JSON.parse(saved);
        setProject(parsed);
      } catch {
        // ignore parse errors
      }
    }
  }, [router]);

  // Save draft automatically whenever project changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(draftKey, JSON.stringify(project));
  }, [project]);

  // Handle image uploads
  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const newImages: ImageItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // convert file to data URL
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      newImages.push({ id: `${Date.now()}-${i}`, dataUrl, caption: '' });
    }
    setProject((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
    // Reset file input to allow re-upload of same files
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  // Update image caption
  function handleCaptionChange(id: string, caption: string) {
    setProject((prev) => ({
      ...prev,
      images: prev.images.map((img) => (img.id === id ? { ...img, caption } : img)),
    }));
  }

  // Delete image
  function handleDeleteImage(id: string) {
    setProject((prev) => ({ ...prev, images: prev.images.filter((img) => img.id !== id) }));
  }

  // Drag-and-drop handlers for image reorder
  const dragItemIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  function onDragStart(index: number) {
    dragItemIndex.current = index;
  }

  function onDragEnter(index: number) {
    dragOverIndex.current = index;
  }

  function onDragEnd() {
    const start = dragItemIndex.current;
    const over = dragOverIndex.current;
    if (start === null || over === null || start === over) {
      dragItemIndex.current = null;
      dragOverIndex.current = null;
      return;
    }
    setProject((prev) => {
      const images = [...prev.images];
      const [moved] = images.splice(start, 1);
      images.splice(over, 0, moved);
      return { ...prev, images };
    });
    dragItemIndex.current = null;
    dragOverIndex.current = null;
  }

  // Save draft (already automatic but allow manual save)
  function handleSaveDraft() {
    if (typeof window === 'undefined') return;
    // ensure slug exists and persist to ProjectStore
    const title = project.title.trim() || 'untitled';
    let slug = localStorage.getItem(draftSlugKey) || ProjectStore.generateUniqueSlug(title);
    const now = Date.now();
    const storeP = {
      id: slug,
      slug,
      title: project.title,
      descriptionHTML: project.description,
      images: project.images.map((img) => ({ id: img.id, url: img.dataUrl, alt: img.caption })),
      status: 'draft' as const,
      createdAt: ProjectStore.getDraft(slug)?.createdAt || now,
      updatedAt: now,
    };
    // create or update
    if (ProjectStore.getDraft(slug)) {
      ProjectStore.updateDraft(storeP);
    } else {
      ProjectStore.createDraft(storeP);
    }
    localStorage.setItem(draftKey, JSON.stringify(project));
    localStorage.setItem(draftSlugKey, slug);
    alert('Draft saved');
    return;
  }

  // Publish project
  function handlePublish() {
    if (typeof window === 'undefined') return;
    const title = project.title.trim() || 'untitled';
    let slug = localStorage.getItem(draftSlugKey) || ProjectStore.generateUniqueSlug(title);
    const now = Date.now();
    const storeP = {
      id: slug,
      slug,
      title: project.title,
      descriptionHTML: project.description,
      images: project.images.map((img) => ({ id: img.id, url: img.dataUrl, alt: img.caption })),
      status: 'draft' as const,
      createdAt: ProjectStore.getDraft(slug)?.createdAt || now,
      updatedAt: now,
    };
    if (ProjectStore.getDraft(slug)) {
      ProjectStore.updateDraft(storeP);
    } else {
      ProjectStore.createDraft(storeP);
    }
    ProjectStore.publish(slug);
    localStorage.setItem(publishedKey, JSON.stringify(project));
    localStorage.setItem(draftSlugKey, slug);
    alert('Project published');
  }

  function handleLogout() {
    localStorage.removeItem('auth');
    router.push('/login');
  }

  // Reset project
  function handleClear() {
    setProject({ title: '', description: '', images: [] });
    localStorage.removeItem(draftKey);
  }

  // Toggle preview mode
  function togglePreview() {
    setIsPreview((prev) => !prev);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {!isPreview && (
            <button
              onClick={handleSaveDraft}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-3 rounded"
            >
              Save Draft
            </button>
          )}
          {!isPreview && (
            <button
              onClick={handlePublish}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded"
            >
              Publish
            </button>
          )}
          {!isPreview && (
            <button
              onClick={handleClear}
              className="bg-red-400 hover:bg-red-500 text-white py-2 px-3 rounded"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isPreview}
              onChange={togglePreview}
              className="mr-2"
            />
            Preview
          </label>
          <button
            onClick={handleLogout}
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-3 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Editor or Preview */}
      {!isPreview ? (
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Project Title
            </label>
            <input
              id="title"
              type="text"
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <RichTextEditor
              value={project.description}
              onChange={(html) => setProject((prev) => ({ ...prev, description: html }))}
            />
          </div>
          {/* Images */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFilesSelected}
              ref={fileInputRef}
              className="mb-2"
            />
            {project.images.length > 0 && (
              <div className="grid md:grid-cols-3 gap-4">
                {project.images.map((img, index) => (
                  <div
                    key={img.id}
                    className="border rounded p-2 bg-white dark:bg-gray-800 shadow relative"
                    draggable
                    onDragStart={() => onDragStart(index)}
                    onDragEnter={() => onDragEnter(index)}
                    onDragEnd={onDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <img src={img.dataUrl} alt="Uploaded" className="w-full h-40 object-cover rounded mb-2" />
                    <input
                      type="text"
                      placeholder="Caption"
                      value={img.caption}
                      onChange={(e) => handleCaptionChange(img.id, e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute top-1 right-1 text-red-600 hover:text-red-700"
                      title="Delete image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Preview mode
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{project.title || 'Untitled Project'}</h1>
          <div
            className="prose dark:prose-invert mb-4"
            dangerouslySetInnerHTML={{ __html: project.description || '<p>No description</p>' }}
          />
          {project.images.length > 0 && (
            <div className="grid md:grid-cols-3 gap-4">
              {project.images.map((img) => (
                <figure key={img.id} className="border rounded p-2 bg-white dark:bg-gray-800">
                  <img src={img.dataUrl} alt={img.caption} className="w-full h-40 object-cover rounded mb-2" />
                  {img.caption && (
                    <figcaption className="text-sm text-center text-gray-600 dark:text-gray-300">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}