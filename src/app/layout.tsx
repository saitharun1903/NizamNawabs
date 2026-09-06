import type { Metadata } from 'next';
import { Barlow_Condensed, Manrope } from 'next/font/google';
import './globals.css';

const barlowCondensed = Barlow_Condensed({
  weight: ['600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-barlow-condensed',
  display: 'swap',
});

const manrope = Manrope({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nizamnawabs.com'),
  title: {
    default: 'Nizam Nawabs | Professional Basketball Team — Telangana',
    template: '%s | Nizam Nawabs Basketball',
  },
  description:
    'Official website of Nizam Nawabs, professional basketball club in the Telangana Pro Basketball League (TPBL). Season 1 Runners Up. Bold basketball, local pride, unstoppable spirit.',
  icons: {
    icon: '/brand/logo-crest.png',
    apple: '/brand/logo-crest.png',
  },
  openGraph: {
    title: 'Nizam Nawabs | Professional Basketball Team — Telangana',
    description: 'Official website of Nizam Nawabs. TPBL Season 1 Runners Up.',
    images: ['/brand/reference-full.png'],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${manrope.variable}`}>
      <body className="bg-brand-black text-brand-white min-h-screen antialiased selection:bg-brand-orange selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}

