import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/global/WhatsAppButton';
import { FloatingQuoteButton } from '@/components/global/RequestQuoteModal';
import { CookieConsent } from '@/components/global/CookieConsent';
import { ScrollToTop } from '@/components/global/ScrollToTop';
import { PageViewTracker } from '@/components/global/PageViewTracker';

export const metadata: Metadata = {
  title: 'The Himalaya - Infrastructure Products',
  description: 'Manufacturing world-class FRP/GRP manhole covers, RCC products, and infrastructure solutions since 2004. Built to last. Built for India.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <ScrollToTop />
          <PageViewTracker />
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
          <FloatingQuoteButton />
          <CookieConsent />
        </div>
      </body>
    </html>
  );
}
