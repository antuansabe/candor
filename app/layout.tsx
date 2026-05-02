import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CANDOR.md validator',
  description: 'Side-by-side test of CANDOR.md behavior changes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
