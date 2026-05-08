import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'THE GATE - Private Chelsea Square Preview | KREO Studio',
  description:
    'A private cinematic property preview for The Gate, Chelsea Square SW3. Produced by KREO Studio for selective client review.',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: 'THE GATE - Private Chelsea Square Preview',
    description: 'A confidential cinematic property preview for Chelsea Square SW3.',
    images: [
      {
        url: '/preview/the-gate/THE_GATE_Still_02_Principal_Reception.png',
        width: 1200,
        height: 630,
        alt: 'The Gate principal reception, Chelsea Square SW3',
      },
    ],
  },
};

export default function TheGateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
