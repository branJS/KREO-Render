import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Property Marketing, Branding & 3D Design",
  description:
    "Explore KREO's portfolio of cinematic property marketing, brand identity, CGI visuals, 3D renders and digital design work for clients in Plymouth and across the UK.",
  alternates: { canonical: "https://www.kreostudio.co.uk/projects" },
  openGraph: {
    title: "Projects | KREO - Property Marketing & Design",
    description:
      "Cinematic property marketing, brand identities and 3D visuals from KREO's client portfolio.",
    url: "https://www.kreostudio.co.uk/projects",
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
