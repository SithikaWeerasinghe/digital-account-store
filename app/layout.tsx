import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/lib/contexts/CartContext';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import SplashScreen from '@/components/ui/SplashScreen';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={`${geistSans.className} min-h-screen flex flex-col bg-background text-foreground`} suppressHydrationWarning>
        {/* Intro splash (once per session, public pages only — self-disables on /admin) */}
        <SplashScreen />
        {/* Smooth scrolling on public pages only (self-disables on /admin) */}
        <SmoothScrollProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
