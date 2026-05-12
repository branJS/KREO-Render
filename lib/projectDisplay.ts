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

export const LOCAL_PORTFOLIO_PROJECTS = [OCEAN_POLLUTION_PROJECT];
