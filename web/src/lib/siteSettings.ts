'use client';

import { useState, useEffect } from 'react';

export interface SiteSettings {
  company_name: string;
  tagline: string;
  phone: string;
  phone2: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gst: string;
  established_year: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  map_embed_url: string;
}

export const defaultSettings: SiteSettings = {
  company_name: 'The Himalaya',
  tagline: 'Built to Last. Built for India.',
  phone: '+91 98765 43210',
  phone2: '',
  whatsapp: '+919876543210',
  email: 'info@thehimalaya.co.in',
  address: 'Industrial Area, Phase 2',
  city: 'Ahmedabad',
  state: 'Gujarat',
  pincode: '380001',
  country: 'India',
  gst: '24AAAAA0000A1Z5',
  established_year: '2004',
  linkedin: 'https://www.linkedin.com/company/himalaya-composites-precast-pvt-ltd/',
  facebook: 'https://facebook.com',
  instagram: 'https://www.instagram.com/thehimalaya_',
  map_embed_url: '',
};

/** Returns a settings object fetched from the backend REST API (bypasses Firestore rules). */
export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch settings');
        return r.json();
      })
      .then((data) => {
        if (data && typeof data === 'object') {
          setSettings({ ...defaultSettings, ...data });
        }
      })
      .catch(() => {
        // API unavailable — keep defaults
      });
  }, []);

  return settings;
}

/** One-shot fetch for client-side non-reactive use. */
export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const r = await fetch('/api/site-settings');
    if (r.ok) {
      const data = await r.json();
      if (data && typeof data === 'object') {
        return { ...defaultSettings, ...data };
      }
    }
  } catch {
    // fall through to defaults
  }
  return defaultSettings;
}

/** Convenience: WhatsApp chat link */
export function whatsappLink(settings: SiteSettings, message = ''): string {
  const num = settings.whatsapp.replace(/\D/g, '');
  return `https://wa.me/${num}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

/** Convenience: full formatted address */
export function fullAddress(settings: SiteSettings): string {
  return [settings.address, settings.city, `${settings.state} ${settings.pincode}`, settings.country]
    .filter(Boolean)
    .join(', ');
}
