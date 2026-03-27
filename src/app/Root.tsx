import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { WhatsAppButton } from "./components/global/WhatsAppButton";
import { CookieConsent } from "./components/global/CookieConsent";
import { FloatingQuoteButton } from "./components/global/RequestQuoteModal";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function Root() {
  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <FloatingQuoteButton />
      <CookieConsent />
    </div>
  );
}