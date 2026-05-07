import type { Metadata } from 'next';
import { Providers } from './providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Azaka Web - Decentralised Trade Finance on Stellar',
  description: 'Trade finance for African exporters. On-chain, instant, borderless.',
  keywords: ['trade finance', 'stellar', 'blockchain', 'export', 'import', 'letter of credit'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
