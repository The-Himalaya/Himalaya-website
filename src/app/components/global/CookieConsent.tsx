import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';
import { Button } from '../ui/button';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('himalaya-cookie-consent');
    if (!consent) {
      // Show after a delay
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('himalaya-cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('himalaya-cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50"
        >
          <div className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg shadow-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[var(--himalaya-gold)]/10 rounded-full flex items-center justify-center">
                <Cookie className="w-5 h-5 text-[var(--himalaya-gold)]" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-display uppercase text-[var(--himalaya-white)] mb-2">
                  Cookie Notice
                </h3>
                <p className="text-sm text-[var(--himalaya-smoke)] mb-4 leading-relaxed">
                  We use cookies to enhance your browsing experience and analyze site traffic. By clicking "Accept", you consent to our use of cookies.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAccept}
                    className="bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white flex-1"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={handleDecline}
                    variant="outline"
                    className="border-[var(--border)] text-[var(--himalaya-white)] hover:bg-[var(--himalaya-card)] flex-1"
                  >
                    Decline
                  </Button>
                </div>
              </div>

              <button
                onClick={handleDecline}
                className="flex-shrink-0 text-[var(--himalaya-smoke)] hover:text-[var(--himalaya-white)] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
