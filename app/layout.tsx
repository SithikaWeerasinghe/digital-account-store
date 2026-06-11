import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/lib/contexts/CartContext';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import SplashScreen from '@/components/ui/SplashScreen';
import SplashScreenController from '@/components/ui/SplashScreenController';
import { APP_NAME } from '@/lib/constants';

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.apexfled.com';
const SITE_DESCRIPTION =
  'Browse premium digital subscriptions, accounts, AI tools, gaming products, and software with fast delivery and simple checkout.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: APP_NAME,
    template: `%s — ${APP_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: APP_NAME,
  // app/icon.svg and app/apple-icon.tsx are auto-detected by Next.js.
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    url: SITE_URL,
    title: APP_NAME,
    description: SITE_DESCRIPTION,
    // og image comes from app/opengraph-image.tsx automatically.
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: SITE_DESCRIPTION,
    // twitter image comes from app/twitter-image.tsx automatically.
  },
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
