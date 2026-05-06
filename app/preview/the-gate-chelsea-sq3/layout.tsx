import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'THE GATE — Private Preview | KREO Studio',
  description: 'Private client preview — The Gate, Chelsea Square SW3. Produced by KREO Studio.',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  // Prevent this page from inheriting the root layout's open-graph tags
  openGraph: {
    title: 'THE GATE — Private Preview',
    description: 'Private client preview — The Gate, Chelsea Square SW3.',
    robots: undefined,
  },
};

export default function TheGateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
