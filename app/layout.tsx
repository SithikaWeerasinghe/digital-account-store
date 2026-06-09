import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/lib/contexts/CartContext';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import SplashScreen from '@/components/ui/SplashScreen';
import SplashScreenController from '@/components/ui/SplashScreenController';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';

// Runs before paint: show the splash on the first public-page load of a session
// (skips /admin and repeat visits) by setting data-apex-splash on <html>.
const SPLASH_INIT = `(function(){try{var p=location.pathname||'';if(p.indexOf('/admin')===0)return;if(sessionStorage.getItem('apexfled_splash_shown')==='1')return;document.documentElement.setAttribute('data-apex-splash','active');}catch(e){}})();`;

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
        {/* Splash gate — runs before paint so the splash shows first (no flash) */}
        <script dangerouslySetInnerHTML={{ __html: SPLASH_INIT }} />
        {/* Intro splash overlay (CSS-gated; once per session, never on /admin) */}
        <SplashScreen />
        <SplashScreenController />
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
