import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Freelance Graphic Designer in Plymouth | KREO Studios",
  description: "KREO Studios is the portfolio of a Plymouth-based graphic designer and AI producer, offering visual design services, digital content, and a blog for designers.",
  keywords: [
    "Graphic Design",
    "Plymouth",
    "Freelance Designer",
    "AI Producer",
    "Design Portfolio",
    "Digital Services",
    "Design Blog"
  ],
  openGraph: {
    title: "Freelance Graphic Designer in Plymouth | KREO Studios",
    description: "KREO Studios is the portfolio of a Plymouth-based graphic designer and AI producer, offering visual design services, digital content, and a blog for designers.",
    siteName: "KREO Studios",
    locale: "en_US",
    type: "website"
    // You can add `images: [...]` here in the future for OG image
  },
  twitter: {
    card: "summary_large_image",
    title: "Freelance Graphic Designer in Plymouth | KREO Studios",
    description: "KREO Studios is the portfolio of a Plymouth-based graphic designer and AI producer, offering visual design services, digital content, and a blog for designers."
    // You can add `images: [...]` here for Twitter card image if available
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
