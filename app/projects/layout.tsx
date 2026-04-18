import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Branding, Motion & 3D Design",
  description:
    "Explore KREO's portfolio of graphic design work — brand identities, motion graphics, 3D renders and digital projects for clients in Plymouth, Manchester and across the UK.",
  openGraph: {
    title: "Projects | KREO — Freelance Graphic Design",
    description:
      "Brand identities, motion graphics and 3D renders from KREO's client portfolio — Plymouth & Manchester based creative studio.",
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
