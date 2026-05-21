import type { Metadata } from "next";
import "./globals.css";
import { EditModeProvider } from "./providers";
import { KreoTransitionProvider } from "./components/KreoTransition";
import KreoNav from "./components/KreoNav";
import LiveChatWidget from "./components/LiveChatWidget";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

const SITE_URL = "https://www.kreostudio.co.uk";
const SITE_NAME = "KREO Studio by Brandon Allen";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Brandon Allen / KREO Studio | Brand, Web, AI & Cinematic Visual Systems",
    template: "%s | Brandon Allen / KREO Studio",
  },
  description:
    "KREO is the personal studio of Brandon Allen, an independent creative technologist and designer in Plymouth creating brand identity, websites, AI workflows, cinematic property marketing, 3D visuals and premium campaign systems.",
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
    "Brandon Allen designer",
    "Brandon Allen KREO",
    "creative technologist Plymouth",
    "visual identity designer",
    "brand identity UK",
  ],
  authors: [{ name: "Brandon Allen", url: SITE_URL }],
  creator: "Brandon Allen",
  publisher: "KREO Studio",
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
      { url: "/logos/kreo-yellow-crop.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/logos/kreo-yellow-crop.png",
    shortcut: "/logos/favicon-32.png",
  },
  openGraph: {
    title: "Brandon Allen / KREO Studio",
    description:
      "Brand identity, websites, AI workflows, cinematic property marketing, 3D visuals and premium campaign systems from Brandon Allen's Plymouth-based creative studio.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brandon Allen / KREO Studio",
    description:
      "Branding, websites, AI workflows, motion, 3D visuals and premium creative systems by Brandon Allen in Plymouth, UK.",
    site: "@kreoxi",
    creator: "@kreoxi",
  },
  verification: {
    google: "ANAeZTEnBQocluJ3b2aKuedLyoLKK-h60qR1Mmy2a58",
  },
};

// JSON-LD structured data for local business SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": `${SITE_URL}/#business`,
      name: "KREO Studio",
      alternateName: "KREO Studio by Brandon Allen",
      url: SITE_URL,
      logo: `${SITE_URL}/logos/kreo-yellow-crop.png`,
      description:
        "Personal design and creative technology studio led by Brandon Allen in Plymouth, Devon, creating brand identity, websites, AI workflows, cinematic property marketing, 3D renders, motion and premium campaign systems.",
      founder: { "@id": `${SITE_URL}/#brandon-allen` },
      employee: { "@id": `${SITE_URL}/#brandon-allen` },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Plymouth",
        addressRegion: "Devon",
        postalCode: "PL1",
        addressCountry: "GB",
      },
      geo: { "@type": "GeoCoordinates", latitude: 50.3755, longitude: -4.1427 },
      areaServed: [
        { "@type": "City", name: "Plymouth" },
        { "@type": "City", name: "Exeter" },
        { "@type": "City", name: "Truro" },
        { "@type": "City", name: "Manchester" },
        { "@type": "AdministrativeArea", name: "Devon" },
        { "@type": "AdministrativeArea", name: "Cornwall" },
        { "@type": "Country", name: "United Kingdom" },
      ],
      sameAs: ["https://x.com/kreoxi"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Graphic Design Services Plymouth",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Logo Design Plymouth", description: "Professional logo design from £250" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Brand Identity Plymouth", description: "Full brand identity system from £700" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Website Design Plymouth", description: "Custom website design and build from £900" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Motion Graphics Plymouth", description: "Animated assets and motion design from £450" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "3D Renders Plymouth", description: "Product and concept 3D visualisation from £250" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Print Design Plymouth", description: "Flyers, brochures, business cards from £90" } },
        ],
      },
      priceRange: "££",
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#brandon-allen`,
      name: "Brandon Allen",
      url: SITE_URL,
      jobTitle: "Independent creative technologist, designer and full-stack builder",
      worksFor: { "@id": `${SITE_URL}/#business` },
      sameAs: ["https://x.com/kreoxi"],
      knowsAbout: [
        "Brand identity",
        "Website design",
        "Full-stack web development",
        "AI workflows",
        "Cinematic property marketing",
        "3D visualisation",
        "Motion design",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "KREO Studio by Brandon Allen",
      publisher: { "@id": `${SITE_URL}/#business` },
    },
  ],
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
      <body>
        <EditModeProvider>
          <KreoTransitionProvider>
            {children}
            <KreoNav />
            <LiveChatWidget />
          </KreoTransitionProvider>
        </EditModeProvider>

        {/* ── Vercel: page-view tracking + real-user performance ── */}
        <Analytics />
        <SpeedInsights />

        {/* ── Google Analytics 4 — only loads when the env var is set ── */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
