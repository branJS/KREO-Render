/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ProjectStore, Project } from "../lib/store/projects.store";

// Import the global edit mode hook. This allows the HUD and other
// components to read and toggle the editing state of the site. When
// editing is enabled, content becomes editable via contentEditable.
import { useEditMode } from "./providers";
import ContactForm from "./components/ContactForm";
import Hero from './components/Hero'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'


const WorldScene = dynamic(() => import("./WorldScene"), { ssr: false });

// Define the sections of the site. The blog section has been removed
// based on user feedback. Order matters for the HUD and navigation.
const SECTIONS = ["home","projects","contact","shop","downloads"] as const;
type SectionId = typeof SECTIONS[number];

const clamp = (n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));

/* ---------------- Mouse tracking ---------------- */
function useRootMouseVars(){
  useEffect(()=>{
    const r = document.documentElement;
    const onMove=(e:MouseEvent)=>{
      r.style.setProperty("--mx", e.clientX + "px");
      r.style.setProperty("--my", e.clientY + "px");
      r.style.setProperty("--mxp", (e.clientX / innerWidth).toFixed(4));
      r.style.setProperty("--myp", (e.clientY / innerHeight).toFixed(4));
    };
    window.addEventListener("mousemove", onMove);
    return ()=>window.removeEventListener("mousemove", onMove);
  },[]);
}

/* ---------------- Sound hooks ---------------- */
/**
 * Stub sound hook. The original implementation attempted to load and play
 * audio files for background music and sound effects. To simplify the
 * portfolio and remove external audio dependencies, this hook now
 * returns a muted flag and setter without interacting with the DOM.
 */
function useSound() {
  const [muted, setMuted] = useState(false);
  // In the future, sound effects could be re-enabled here. For now we
  // simply provide state to toggle a muted flag in the HUD if desired.
  return { muted, setMuted };
}

/* ---------------- Magnetic motion ---------------- */
function useMagnetic(){
  useEffect(()=>{
    const els=Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    let raf=0,mx=0,my=0;
    const onMove=(e:MouseEvent)=>{mx=e.clientX;my=e.clientY;if(!raf)raf=requestAnimationFrame(apply);};
    const apply=()=>{
      els.forEach(el=>{
        const r=el.getBoundingClientRect();
        const dx=mx-(r.left+r.width/2);
        const dy=my-(r.top+r.height/2);
        const pull=Math.max(0,1-Math.hypot(dx,dy)/240);
        const ease=0.24;
        const tx=dx*0.12*pull,ty=dy*0.12*pull;
        const prev=el.style.transform.match(/translate\(([-0-9.]+)px,\s*([-0-9.]+)px\)/);
        const px=prev?parseFloat(prev[1]):0;const py=prev?parseFloat(prev[2]):0;
        el.style.transform=`translate(${px+(tx-px)*ease}px, ${py+(ty-py)*ease}px)`;
      });
      raf=0;
    };
    window.addEventListener("mousemove",onMove);
    const clear=()=>els.forEach(el=>el.style.transform="translate(0,0)");
    window.addEventListener("mouseout",clear);
    return ()=>{window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseout",clear);};
  },[]);
}

/* ---------------- HUD ---------------- */
function HUD({muted,setMuted}:{muted:boolean;setMuted:(v:boolean)=>void}){
  // Public HUD — remove any client-side edit controls so editing is only
  // possible from the protected /admin route. We keep navigation and time.
  const time = new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
  return (
    <div className="hud">
      <div className="hud-left">
        <span className="tag bold">Brandon Allen</span>
      </div>
      <div className="hud-center">
        <nav className="hud-nav">
          {SECTIONS.map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className="hud-link"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("kreo:navigate", { detail: { section: s } }));
                const target = document.getElementById(s);
                if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {s.toUpperCase()}
            </a>
          ))}
        </nav>
      </div>
      <div className="hud-right">
        <span className="hud-time">{time}</span>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */
export default function Page(){
  useRootMouseVars();
  useMagnetic();
  const {muted,setMuted}=useSound();
  // Access edit mode state so we can render editable fields when editing.
  const { isEditing } = useEditMode();

  // Persistable state for the Projects section. When editing, the heading
  // and body of the Projects section can be changed. Values are loaded
  // from localStorage on mount and saved whenever they change.
  const [projectsTitle, setProjectsTitle] = useState<string>("Projects");
  const [projectsContent, setProjectsContent] = useState<string>(
    "Content placeholder for projects…"
  );

  // List of published projects loaded from localStorage. Only populated on mount.
  const [publishedProjects, setPublishedProjects] = useState<Project[]>([]);

  // Index of the currently highlighted project in the slideshow. This
  // increments every few seconds to create an auto-rotating preview in
  // the Projects section. Defaults to 0.
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  // Router for navigation to project pages
  const router = useRouter();


  // On mount, load any saved content from localStorage. Because
  // localStorage is only available in the browser, wrap in a typeof check.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const pt = localStorage.getItem("projects_title");
    const pc = localStorage.getItem("projects_content");
    if (pt) setProjectsTitle(pt);
    if (pc) setProjectsContent(pc);

    // Load published projects on mount
    const pubs = ProjectStore.listPublished();
    setPublishedProjects(pubs);

    // Listen for storage events so that when a project is published in
    // another tab or page the grid updates. Only handle changes to
    // the published projects map. When the 'kreo:published:projects'
    // key changes, reload the published list. This keeps the projects
    // grid in sync when returning from editing a project without
    // requiring a manual refresh.
    const onStorage = (e: StorageEvent) => {
      if (e.key === "kreo:published:projects") {
        const list = ProjectStore.listPublished();
        setPublishedProjects(list);
      }
    };
    window.addEventListener("storage", onStorage);
    // cleanup
    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);


  // Cycle through published projects every 2 seconds. If there is more
  // than one published project, advance the slideshow index on an interval.
  useEffect(() => {
    let timer: any;
    if (publishedProjects.length > 1) {
      timer = setInterval(() => {
        setCurrentProjectIndex((prev) => (prev + 1) % publishedProjects.length);
      }, 2000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [publishedProjects]);

  // About editing handlers removed; editing now happens in the protected /admin editor.

  // Whenever the content changes, persist it. The edit mode check
  // ensures we only save after editing; however, saving on every
  // render is inexpensive because localStorage writes are synchronous.
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("projects_title", projectsTitle);
  }, [projectsTitle]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("projects_content", projectsContent);
  }, [projectsContent]);
  // About section removed — editing moved to protected /admin route.

  /**
   * Create a new draft project. Prompt for a title, generate a unique slug,
   * save the draft to localStorage, and navigate to the project's edit page.
   */
  function handleCreateNewProject() {
    const title = prompt("Enter a title for your new project:", "Untitled Project")?.trim();
    if (!title) return;
    const slug = ProjectStore.generateUniqueSlug(title);
    const now = Date.now();
    const newProject: Project = {
      id: slug,
      slug,
      title,
      descriptionHTML: "",
      images: [],
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };
    ProjectStore.createDraft(newProject);
    router.push(`/projects/${slug}`);
  }

  /**
   * Navigate to an existing project by slug.
   */
  function handleOpenProject(slug: string) {
    router.push(`/projects/${slug}`);
  }

  return (
    <main className="kreo">
  {/* Remove the blog and about sections from the 3D world navigation */}
  <WorldScene sections={["home","projects","contact","shop","downloads"]}/>
      <HUD muted={muted} setMuted={setMuted}/>

      {/* HERO */}
      <section id="home" className="section hero visible">
        <div className="panel hero-panel center">
          <div className="hero-content">
            <h1 className="title">BRAN</h1>
            <p className="subtitle">BRANDON ALLEN — VISUALS, MOTION & INTERACTION (PLYMOUTH, UK)</p>
            <div className="chip-row nav-chips">
              <a href="#home" className="chip c-yellow" title="Home">Y</a>
              <a href="#projects" className="chip c-teal" title="Projects">T</a>
              {/* About section removed from public site */}
              {/* Blog chip removed */}
              <a href="#shop" className="chip c-red" title="Shop">R</a>
              <a href="#downloads" className="chip c-pink" title="Downloads">P</a>
            </div>
            <div className="cta-row">
              <a href="#projects" className="btn b-yellow" data-magnetic>Explore Projects</a>
              <a href="#contact" className="btn b-blue outline" data-magnetic>Get in Touch</a>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section">
        <div className="panel">
          <div className="panel-head">
            {/*
             * The Projects heading becomes editable in edit mode. When the
             * user finishes editing (onBlur), the state is updated and
             * persisted to localStorage.
             */}
            <h2
              className="section-title"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const val = e.currentTarget.textContent?.trim() || "";
                if (val) setProjectsTitle(val);
              }}
            >
              {projectsTitle}
            </h2>
          </div>
          {/* Projects grid and rotating preview. When editing, show a button to create a new project. */}
          <div className="section-body">
            {/* Slideshow preview: cycles through published projects every 2 seconds */}
            {publishedProjects.length > 0 && (
              <div
                className="slideshow-container"
                style={{
                  position: "relative",
                  marginBottom: "1rem",
                  height: "300px",
                  overflow: "hidden",
                  borderRadius: "8px",
                }}
              >
                {publishedProjects.map((p, i) => {
                  const imgSrc = p.images && p.images.length > 0 ? p.images[0].url : "";
                  return (
                    <div
                      key={p.slug}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        opacity: currentProjectIndex === i ? 1 : 0,
                        transition: "opacity 1s ease",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => handleOpenProject(p.slug)}
                    >
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={p.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background: "#eee",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--muted)",
                            fontWeight: 600,
                          }}
                        >
                          No Image
                        </div>
                      )}
                      <h3
                        style={{
                          position: "absolute",
                          bottom: "1rem",
                          left: "1rem",
                          color: "#fff",
                          background: "rgba(0,0,0,0.6)",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          margin: 0,
                        }}
                      >
                        {p.title}
                      </h3>
                    </div>
                  );
                })}
              </div>
            )}
            {/* New Project button displayed only in edit mode */}
            {isEditing && (
              <div style={{ marginBottom: "1rem" }}>
                <button
                  className="btn b-yellow"
                  onClick={handleCreateNewProject}
                  data-magnetic
                >
                  + New Project
                </button>
              </div>
            )}
            {publishedProjects.length > 0 ? (
              <div className="grid">
                {publishedProjects.map((p) => (
                  <div
                    key={p.slug}
                    className="card project-card"
                    onClick={() => handleOpenProject(p.slug)}
                    style={{ cursor: "pointer" }}
                  >
                    {p.images && p.images.length > 0 ? (
                      <img
                        src={p.images[0].url}
                        alt={p.title}
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "180px",
                          background: "#eee",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--muted)",
                          fontWeight: 600,
                        }}
                      >
                        No Image
                      </div>
                    )}
                    <h3
                      style={{
                        margin: ".5rem",
                        fontSize: "1.1rem",
                        fontWeight: 700,
                      }}
                    >
                      {p.title}
                    </h3>
                  </div>
                ))}
              </div>
            ) : (
              <p>
                No projects published yet.
                {isEditing ? " Create one using the button above." : ""}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT section removed — About content is now managed via /admin */}

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="panel">
          <div className="panel-head">
            <h2 className="section-title">Contact</h2>
          </div>
          {/* Use the dedicated ContactForm component which posts to /api/contact */}
          <ContactForm />
        </div>
      </section>

      {/* Blog section removed */}

      {/* SHOP */}
      <section id="shop" className="section">
        <div className="panel">
          <div className="panel-head">
            <h2 className="section-title">Shop</h2>
          </div>
          <div className="grid small">
            {Array.from({length:6}).map((_,i)=><div className="tile" key={i}>Soon</div>)}
          </div>
        </div>
      </section>

      {/* DOWNLOADS */}
      <section id="downloads" className="section">
        <div className="panel">
          <div className="panel-head">
            <h2 className="section-title">Downloads</h2>
          </div>
          <div className="downloads-flex">
            <a href="#" className="link b-yellow">Brand Pack</a>
            <a href="#" className="link b-blue">Press Kit</a>
            <a href="#" className="link b-green">Case PDFs</a>
          </div>
        </div>
      </section>

    </main>
  );
}
