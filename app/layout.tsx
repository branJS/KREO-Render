import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EditModeProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://brandonallen.uk";
const SITE_NAME = "KREO";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Freelance Graphic Designer Plymouth & Manchester | KREO",
    template: "%s | KREO — Graphic Design & Motion",
  },
  description:
    "KREO is a freelance graphic design studio based in Plymouth, UK — serving Plymouth, Manchester and beyond. Specialising in branding, 3D renders, motion graphics, print design and UI/UX.",
  keywords: [
    // Plymouth
    "graphic designer Plymouth",
    "freelance designer Plymouth",
    "branding Plymouth",
    "logo design Plymouth",
    "motion graphics Plymouth",
    "3D render Plymouth",
    "print design Plymouth",
    "creative studio Plymouth Devon",
    "Plymouth freelance creative",
    // Manchester
    "graphic designer Manchester",
    "freelance designer Manchester",
    "branding Manchester",
    "logo design Manchester",
    "motion graphics Manchester",
    "creative studio Manchester",
    "Manchester freelance graphic designer",
    // General UK
    "freelance graphic designer UK",
    "branding studio UK",
    "motion designer UK",
    "3D visualisation UK",
    "UI UX designer UK",
    // Brand
    "KREO design",
    "KREO studio",
    "visual identity designer",
    "brand identity UK",
  ],
  authors: [{ name: "KREO", url: SITE_URL }],
  creator: "KREO",
  publisher: "KREO",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/logos/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/logos/kreo-yellow.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/logos/kreo-yellow.png",
    shortcut: "/logos/favicon-32.png",
  },
  openGraph: {
    title: "Freelance Graphic Designer Plymouth & Manchester | KREO",
    description:
      "KREO is a freelance graphic design studio based in Plymouth, UK — specialising in branding, motion graphics, 3D renders and digital design.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freelance Graphic Designer Plymouth & Manchester | KREO",
    description:
      "Branding, motion graphics, 3D renders and digital design — from Plymouth to Manchester and beyond.",
    site: "@kreoxi",
    creator: "@kreoxi",
  },
};

// JSON-LD structured data for local business SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "KREO",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Freelance graphic design studio specialising in branding, motion graphics, 3D renders and digital design. Based in Plymouth, serving Plymouth, Manchester and the wider UK.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Plymouth",
    addressRegion: "Devon",
    addressCountry: "GB",
  },
  areaServed: [
    { "@type": "City", name: "Plymouth" },
    { "@type": "City", name: "Manchester" },
    { "@type": "Country", name: "United Kingdom" },
  ],
  sameAs: [`https://x.com/kreoxi`],
  serviceType: [
    "Graphic Design",
    "Branding",
    "Motion Graphics",
    "3D Rendering",
    "Print Design",
    "UI/UX Design",
  ],
  priceRange: "££",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="geo.region" content="GB-PLY" />
        <meta name="geo.placename" content="Plymouth, Devon" />
        <meta name="ICBM" content="50.3755, -4.1427" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <EditModeProvider>
          {children}
        </EditModeProvider>
      </body>
    </html>
  );
}
