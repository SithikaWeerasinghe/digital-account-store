import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Premium Gaming Digital Store`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: ['gaming', 'digital products', 'streaming', 'AI tools', 'software', 'gift cards', 'instant delivery'],
  openGraph: {
    title: `${APP_NAME} — Premium Gaming Digital Store`,
    description: APP_DESCRIPTION,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${orbitron.variable} min-h-screen flex flex-col bg-[#050509]`}
        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        suppressHydrationWarning
      >
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
