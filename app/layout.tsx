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

const SITE_URL = "https://kreostudio.co.uk";
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
      { url: "/logos/kreo-yellow-crop.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/logos/kreo-yellow-crop.png",
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

// JSON-LD structured data for local business SEO + FAQ rich results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": `${SITE_URL}/#business`,
      name: "KREO Studio",
      url: SITE_URL,
      logo: `${SITE_URL}/logos/kreo-yellow-crop.png`,
      description:
        "Freelance graphic design studio in Plymouth, Devon — logo design, brand identity, motion graphics, 3D renders, website design and print. Serving Plymouth, Devon, Cornwall, Manchester and the wider UK.",
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
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "KREO Studio — Plymouth Graphic Design",
      publisher: { "@id": `${SITE_URL}/#business` },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How much does graphic design cost in Plymouth?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Graphic design in Plymouth ranges from £90 for business cards or flyers, £250 for logo design, £700 for a full brand identity, and £900 for website design. KREO Studio provides competitive, transparent pricing for Plymouth and Devon businesses.",
          },
        },
        {
          "@type": "Question",
          name: "Where is KREO Studio based?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "KREO Studio is based in Plymouth, Devon, and works with clients across Cornwall, the South West, Manchester, London and throughout the UK. All projects can be managed remotely.",
          },
        },
        {
          "@type": "Question",
          name: "What graphic design services does KREO offer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "KREO Studio offers logo design, brand identity, website design, motion graphics, 3D renders, label and packaging, social media design, and print design — all from Plymouth.",
          },
        },
        {
          "@type": "Question",
          name: "How do I get a quote for graphic design in Plymouth?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Use the contact form on the KREO Studio website at kreostudio.co.uk — describe your project and we'll respond within 24 hours with a free, no-obligation quote.",
          },
        },
      ],
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <EditModeProvider>
          {children}
        </EditModeProvider>
      </body>
    </html>
  );
}
