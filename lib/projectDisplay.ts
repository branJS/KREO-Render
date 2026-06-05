type ProjectLike = {
  title?: string | null;
  category?: string | null;
  slug?: string | null;
};

export function isMotionProject(project: ProjectLike) {
  const haystack = [project.title, project.category, project.slug]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    haystack.includes("motion design") ||
    haystack.includes("motion reel") ||
    haystack.includes("motion")
  );
}

export const REAL_ESTATE_AGENCY_PROJECT = {
  _id: "real-estate-agency-coming-soon",
  title: "Real Estate Agency Projects",
  slug: "#real-estate-agency-projects",
  category: "property",
  description:
    "Cinematic property marketing, launch decks, CGI stills, and private visual systems. Work is available on request while the public case studies are being prepared.",
  coverImage: null,
  featured: false,
  tags: ["Property Marketing", "Investor Decks", "Launch Films"],
};

export const OCEAN_POLLUTION_PROJECT = {
  _id: "gdes464-ocean-pollution",
  title: "You Are Breathing Ocean Pollution",
  slug: "you-are-breathing-ocean-pollution",
  category: "campaign",
  description:
    "A social media campaign for the International Marine Litter Research Unit, translating research on airborne microplastic pollution into a five-frame motion sequence.",
  coverImage: null,
  coverImageUrl: "/projects/ocean-pollution/frame-05-dusk.jpg",
  featured: true,
  tags: ["Campaign Design", "Motion", "Environmental Communication"],
  publishedAt: "2026-05-12T00:00:00.000Z",
  _updatedAt: "2026-05-12T00:00:00.000Z",
  videoUrl: "/projects/ocean-pollution/final-reel.mp4",
  workbookUrl: "/projects/ocean-pollution/workbook/index.html",
  gallery: [
    {
      url: "/projects/ocean-pollution/frame-01-ocean.jpg",
      alt: "Ocean surface keyframe for You Are Breathing Ocean Pollution",
      caption: "Frame 01, What's in the ocean...",
    },
    {
      url: "/projects/ocean-pollution/frame-02-fibres.jpg",
      alt: "Microplastic fibre keyframe for You Are Breathing Ocean Pollution",
      caption: "Frame 02, doesn't stay there.",
    },
    {
      url: "/projects/ocean-pollution/frame-03-tilt.jpg",
      alt: "Coastal mist keyframe for You Are Breathing Ocean Pollution",
      caption: "Frame 03, It travels.",
    },
    {
      url: "/projects/ocean-pollution/frame-04-breath.jpg",
      alt: "Breath close-up keyframe for You Are Breathing Ocean Pollution",
      caption: "Frame 04, Closer than you think.",
    },
    {
      url: "/projects/ocean-pollution/frame-05-dusk.jpg",
      alt: "Final campaign keyframe for You Are Breathing Ocean Pollution",
      caption: "Frame 05, You are breathing ocean pollution.",
    },
  ],
  brief:
    "Create a digital campaign for a South West organisation connected to water, coast, or marine environments. The final outcome needed to work as a short social media video and a sequence of keyframes.",
  process:
    "Research into IMLRU and microplastic pollution was translated into a direct message, then developed through moodboards, keyframe planning, ComfyUI motion tests, and After Effects typography compositing.",
  outcome:
    "The final campaign uses five quiet, atmospheric frames to shift the viewer from ocean distance to personal exposure, landing on the line: You are breathing ocean pollution.",
};

export const PLYMOUTH_SIGNAL_PROJECT = {
  _id: "plymouth-signal-web-application",
  title: "Plymouth Signal",
  slug: "plymouth-signal",
  category: "webapp",
  description:
    "A real-time civic intelligence dashboard for Plymouth, designed as one calm instrument for transport, weather, marine, civic and event signals.",
  coverImage: null,
  coverImageUrl: "/portfolio/plymouth-signal/pulse.png",
  featured: true,
  tags: ["Web Application", "Civic Intelligence", "Realtime Dashboard"],
  publishedAt: "2026-05-20T00:00:00.000Z",
  _updatedAt: "2026-05-20T00:00:00.000Z",
  gallery: [
    {
      url: "/portfolio/plymouth-signal/pulse.png",
      alt: "Plymouth Signal pulse dashboard with city score and live status cards",
      caption: "Pulse: city status, live arrivals, weather, tide and source health in one calm overview.",
    },
    {
      url: "/portfolio/plymouth-signal/feed.png",
      alt: "Plymouth Signal city feed with live civic signal rows",
      caption: "City Feed: priority-ranked conditions and operational signal rows.",
    },
    {
      url: "/portfolio/plymouth-signal/transit.png",
      alt: "Plymouth Signal transit page with live bus map and Royal Parade board",
      caption: "Transit: live bus positions, route filters and scheduled departure board.",
    },
    {
      url: "/portfolio/plymouth-signal/events.png",
      alt: "Plymouth Signal events page with editorial event cards",
      caption: "Events: date-grouped listings with restrained categorisation.",
    },
    {
      url: "/portfolio/plymouth-signal/webcam.png",
      alt: "Plymouth Signal webcam page showing Plymouth Sound and Hoe Foreshore",
      caption: "Webcam: Hoe Foreshore stream treatment with source context.",
    },
  ],
  brief:
    "Design and build a city-facing intelligence surface that makes Plymouth feel legible at a glance without becoming noisy, tactical or overbuilt.",
  process:
    "The system was shaped around a maritime research-vessel mood: quiet dark surfaces, sparse live accents, route-level views and a dashboard rhythm that can scale across map, feed, transit, events, webcam and ask-console surfaces.",
  outcome:
    "The result is a polished civic web application concept that shows full-stack product thinking, data-interface craft, operational UI design and atmospheric brand direction without exposing sensitive implementation details.",
};

export const PROJECT_CAITLIN_PROJECT = {
  _id: "project-caitlin-command-mind",
  title: "Project Caitlin",
  slug: "project-caitlin",
  category: "webapp",
  description:
    "A local, Windows-first AI command system. A hybrid cognitive engine pairing a local RTX 3080 for vision and fallback with high-context API models for reasoning, run entirely on localhost through a CustomTkinter Mission Control GUI, a Streamlit dashboard and a ChromaDB-backed vector memory powered by Ollama.",
  coverImage: null,
  coverImageUrl: "/portfolio/project-caitlin/chat.png",
  featured: true,
  tags: ["AI System", "Local-First", "Mission Control"],
  publishedAt: "2026-06-05T00:00:00.000Z",
  _updatedAt: "2026-06-05T00:00:00.000Z",
  gallery: [
    {
      url: "/portfolio/project-caitlin/chat.png",
      alt: "Caitlin Mission Control chat interface with streaming tool calls and recalled memory",
      caption: "Chat: conversational command interface with streaming responses, tool-call tracking and memory recall.",
    },
    {
      url: "/portfolio/project-caitlin/memory.png",
      alt: "Caitlin memory tab with ChromaDB vector embedding plot",
      caption: "Memory: ChromaDB-backed vector store with embedding map, archivist maintenance and Obsidian vault sync.",
    },
    {
      url: "/portfolio/project-caitlin/runtime.png",
      alt: "Caitlin runtime doctor showing VRAM, tier SLO budgets and model residency",
      caption: "Runtime: doctor checks, tier SLO budgets, VRAM airlock and live model residency across the worker pool.",
    },
    {
      url: "/portfolio/project-caitlin/vision.png",
      alt: "Caitlin vision tab for screen and image analysis through the VRAM airlock",
      caption: "Vision: local moondream2 and qwen3vl-fast for screen capture and image analysis through the VRAM airlock.",
    },
    {
      url: "/portfolio/project-caitlin/upgrades.png",
      alt: "Caitlin self-upgrade review queue with shadow-branch sandbox gate",
      caption: "Upgrades: sandbox-verified self-upgrade pipeline with shadow-branch gate and human approval on every diff.",
    },
    {
      url: "/portfolio/project-caitlin/logs.png",
      alt: "Caitlin live log stream filtered by routing, memory, orchestration, safety and health",
      caption: "Logs: streaming agent event taxonomy filtered across routing, memory, orchestration, safety and health.",
    },
    {
      url: "/portfolio/project-caitlin/policies.png",
      alt: "Caitlin sovereignty policy viewer with approval queue and self-upgrade test matrix",
      caption: "Policies: sovereignty gates, runtime profile, approval queue and the self-upgrade pytest matrix.",
    },
  ],
  brief:
    "Build a local-first command mind that can reason, see, remember and self-improve on a single workstation without leaking sensitive context out to the cloud, while staying governed by explicit sovereignty rules.",
  process:
    "A ThreadingHTTPServer backend on 127.0.0.1:8765 routes intent through tiered model profiles (router, brain_fast, brain_deep) with Caitlin as the command mind coordinating Brandon (code worker) and Baba (analysis worker). The CustomTkinter Mission Control surfaces every layer, Chat, Memory, Runtime, Vision, Upgrades, Logs and Policies, behind a calm terminal-style design.",
  outcome:
    "A working hybrid cognitive engine: ChromaDB vector memory with RAG and archivist pruning, local vision through moondream2 and qwen3vl-fast, a sandbox-gated self-upgrade pipeline with pytest matrix and approval workflow, and YAML-based sovereignty policies constraining autonomous behaviour, all observable through one local Mission Control GUI.",
};

export const LOCAL_PORTFOLIO_PROJECTS = [PROJECT_CAITLIN_PROJECT, PLYMOUTH_SIGNAL_PROJECT, OCEAN_POLLUTION_PROJECT];
