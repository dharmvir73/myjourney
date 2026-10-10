import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
const inter = localFont({
  src: '../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  variable: '--font-inter',
  weight: '100 900',
  display: 'swap',
});
const space = localFont({
  src: '../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
  variable: '--font-space',
  weight: '300 700',
  display: 'swap',
});
const mono = localFont({
  src: '../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2',
  variable: '--font-plex',
  weight: '400',
  display: 'swap',
  preload: false,
});
import './globals.css';

export const metadata: Metadata = {
  title: 'Dharmveer Kumar — Curious mind. Builder’s instinct.',
  description:
    'A personal journey through curiosity, frontend and mobile engineering, and original interaction experiments. Made with care by Dharmveer Kumar.',
  applicationName: 'Dharmveer — A personal journey',
  openGraph: {
    title: 'Dharmveer Kumar — Curious mind. Builder’s instinct.',
    description: 'A curious mind, a builder’s instinct, and a few original experiments.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: '#f4f2ec' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
