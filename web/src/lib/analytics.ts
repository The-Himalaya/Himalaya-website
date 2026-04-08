'use client';

import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

let isInitialized = false;

export function initGA() {
  if (!GA_MEASUREMENT_ID || isInitialized) return;
  ReactGA.initialize(GA_MEASUREMENT_ID);
  isInitialized = true;
}

export function trackPageView(path: string) {
  if (!isInitialized) return;
  ReactGA.send({ hitType: 'pageview', page: path });
}

export const analytics = {
  requestQuote: (productCategory: string) => {
    if (!isInitialized) return;
    ReactGA.event({ category: 'Lead', action: 'request_quote', label: productCategory });
  },
  whatsAppClick: () => {
    if (!isInitialized) return;
    ReactGA.event({ category: 'Engagement', action: 'whatsapp_click' });
  },
  contactSubmit: (subject: string) => {
    if (!isInitialized) return;
    ReactGA.event({ category: 'Lead', action: 'contact_submit', label: subject });
  },
  bulkOrderSubmit: (productCategory: string, quantity: string) => {
    if (!isInitialized) return;
    ReactGA.event({ category: 'Lead', action: 'bulk_order_submit', label: productCategory, value: parseInt(quantity) || 0 });
  },
  productView: (productName: string, categorySlug: string) => {
    if (!isInitialized) return;
    ReactGA.event({ category: 'Product', action: 'product_view', label: `${categorySlug}/${productName}` });
  },
  cookieConsent: (accepted: boolean) => {
    if (!isInitialized) return;
    ReactGA.event({ category: 'Privacy', action: 'cookie_consent', label: accepted ? 'accepted' : 'declined' });
  },
};
