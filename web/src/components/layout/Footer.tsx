'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useSiteSettings, whatsappLink, fullAddress } from '@/lib/siteSettings';

export function Footer() {
  const s = useSiteSettings();

  const productCategories = [
    { name: 'FRP / GRP Products', path: '/products/frp-grp-products' },
    { name: 'RCC Manhole Covers', path: '/products/rcc-covers' },
    { name: 'Concrete Cover Blocks', path: '/products/cover-blocks' },
    { name: 'RCC Hume Pipes', path: '/products/hume-pipes' },
    { name: 'PVC Footsteps', path: '/products/pvc-footsteps' },
    { name: 'RCC Electric Chambers', path: '/products/rcc-electric-chambers' },
    { name: 'Diamond Dowels', path: '/products/diamond-dowels' },
  ];

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Bulk Order', path: '/bulk-order' },
    { name: 'Blog', path: '/blog' },
    { name: 'Careers', path: '/career' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <img
                src="/logo.png"
                alt={s.company_name}
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed text-base">
              Manufacturing world-class FRP/GRP manhole covers, RCC products, and infrastructure solutions since {s.established_year}. {s.tagline}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {s.facebook && (
                <a href={s.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[var(--himalaya-navy)] hover:border-[var(--himalaya-navy)] hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              )}
              {s.linkedin && (
                <a href={s.linkedin} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[var(--himalaya-navy)] hover:border-[var(--himalaya-navy)] hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              )}
              {s.instagram && (
                <a href={s.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[var(--himalaya-navy)] hover:border-[var(--himalaya-navy)] hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              )}
              {s.whatsapp && (
                <a href={whatsappLink(s)} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-green-500 hover:border-green-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-gray-900 font-semibold uppercase tracking-wide mb-6 text-base">
              Products
            </h3>
            <ul className="space-y-3">
              {productCategories.map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className="text-gray-600 hover:text-black transition-colors text-base">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold uppercase tracking-wide mb-6 text-base">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-gray-600 hover:text-black transition-colors text-base">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 font-semibold uppercase tracking-wide mb-6 text-base">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-gray-600 text-base">
                <MapPin className="w-5 h-5 flex-shrink-0 text-[var(--himalaya-navy)] mt-0.5" />
                <span>{fullAddress(s)}</span>
              </li>
              {s.phone && (
                <li className="flex gap-3 text-base">
                  <Phone className="w-5 h-5 flex-shrink-0 text-[var(--himalaya-navy)]" />
                  <div className="flex flex-col gap-1">
                    <a href={`tel:${s.phone.replace(/\s/g, '')}`} className="text-gray-600 hover:text-black transition-colors">
                      {s.phone}
                    </a>
                    {s.phone2 && (
                      <a href={`tel:${s.phone2.replace(/\s/g, '')}`} className="text-gray-600 hover:text-black transition-colors">
                        {s.phone2}
                      </a>
                    )}
                  </div>
                </li>
              )}
              {s.email && (
                <li className="flex gap-3 text-base">
                  <Mail className="w-5 h-5 flex-shrink-0 text-[var(--himalaya-navy)]" />
                  <a href={`mailto:${s.email}`} className="text-gray-600 hover:text-black transition-colors">
                    {s.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-base text-gray-500">
            <div>
              © {new Date().getFullYear()} {s.company_name}. All rights reserved.
              {s.gst && <span className="ml-2">| GST: {s.gst}</span>}
            </div>
            {/* <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-black transition-colors">Terms & Conditions</Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
