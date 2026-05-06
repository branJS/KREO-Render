import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'THE GATE — Private Funding Case Study | KREO Studio',
  description: 'Private funding-focused case study — The Gate, Chelsea Square SW3. Produced by KREO Studio.',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: 'THE GATE — Private Funding Case Study | KREO Studio',
    description: 'Private funding-focused case study — The Gate, Chelsea Square SW3.',
  },
};

export default function CaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
