import { Link } from 'react-router';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import logoSrc from '../../../../assets/logo.png';

export function Footer() {
  const productColumns = [
    {
      category: 'FRP / GRP Products',
      path: '/products/frp-grp-products',
      items: [
        { name: 'FRP Manhole Cover', path: '/products/frp-grp-products/frp-manhole-cover' },
        { name: 'FRP Recess Manhole Cover', path: '/products/frp-grp-products/frp-recess-manhole-cover' },
        { name: 'FRP Water Gully Cover', path: '/products/frp-grp-products/frp-water-gully-cover' },
        { name: 'FRP Double Seal Manhole Cover', path: '/products/frp-grp-products/frp-double-seal-manhole-cover' },
        { name: 'FRP Moulded Gratings', path: '/products/frp-grp-products/frp-moulded-gratings' },
        { name: 'FRP Overhead Tank Cover', path: '/products/frp-grp-products/frp-overhead-tank-cover' },
      ],
    },
    {
      category: 'RCC Manhole Cover',
      path: '/products/rcc-covers',
      items: [
        { name: 'Square Frame Round Cover', path: '/products/rcc-covers/square-frame-round-cover' },
        { name: 'Rectangle Frame Rectangle Cover', path: '/products/rcc-covers/rectangle-frame-rectangle-cover' },
        { name: 'Square Frame Square Cover', path: '/products/rcc-covers/square-frame-square-cover' },
        { name: 'Catchpit / Perforated Manhole Cover', path: '/products/rcc-covers/catchpit-perforated-manhole-cover' },
        { name: 'Round Frame Round Cover', path: '/products/rcc-covers/round-frame-round-cover' },
        { name: 'Trench Cover', path: '/products/rcc-covers/trench-cover' },
      ],
    },
    {
      category: 'Concrete / PVC Cover Blocks',
      path: '/products/cover-blocks',
      subLabel: 'Concrete Cover Blocks',
      items: [
        { name: 'Multiple Type Cover Blocks', path: '/products/cover-blocks/multiple-type-cover-blocks' },
        { name: 'Concrete Cover Blocks With Wire', path: '/products/cover-blocks/concrete-cover-blocks-with-wire' },
        { name: 'Tower Type Spacer', path: '/products/cover-blocks/tower-type-spacer' },
        { name: 'Concrete Pile Cover', path: '/products/cover-blocks/concrete-pile-cover' },
      ],
    },
    {
      category: '',
      path: '',
      standaloneLinks: [
        { name: 'RCC Hume Pipes', path: '/products/rcc-hume-pipes' },
        { name: 'PVC Footsteps', path: '/products/pvc-footsteps' },
        { name: 'RCC Electric Chambers', path: '/products/rcc-electric-chambers' },
        { name: 'Diamond Dowels', path: '/products/diamond-dowels' },
      ],
    },
  ];

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Bulk Order', path: '/bulk-order' },
    { name: 'Blog', path: '/blog' },
    { name: 'Careers', path: '/career' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-[var(--himalaya-navy)] border-t border-[var(--border)]">
      {/* Products Grid Section */}
      <div className="border-b border-[var(--border)]">
        <div className="container mx-auto px-4 py-10">
          <h3 className="text-lg font-display uppercase text-[var(--himalaya-white)] mb-8">
            Our Products
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {productColumns.map((col, colIdx) => (
              <div key={colIdx}>
                {col.standaloneLinks ? (
                  <ul className="space-y-4">
                    {col.standaloneLinks.map((link) => (
                      <li key={link.path}>
                        <Link
                          to={link.path}
                          className="text-sm font-semibold text-[#1b6572] hover:text-[#5bbfd4] uppercase tracking-wide transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>
                    <Link
                      to={col.path}
                      className="block text-sm font-semibold text-[#1b6572] hover:text-[#5bbfd4] uppercase tracking-wide mb-3 transition-colors"
                    >
                      {col.category}
                    </Link>
                    {col.subLabel && (
                      <p className="text-xs font-semibold text-[#0099CC]/70 uppercase tracking-wide mb-2">{col.subLabel}</p>
                    )}
                    <ul className="space-y-2">
                      {col.items?.map((item) => (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            className="text-sm text-[var(--himalaya-smoke)] hover:text-[var(--himalaya-red)] transition-colors"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <img
                src={logoSrc}
                alt="The Himalaya Infrastructure Products"
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-[var(--himalaya-smoke)] mb-6 leading-relaxed">
              Manufacturing world-class FRP/GRP manhole covers, RCC products, and infrastructure solutions since 2004. Built to last. Built for India.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[var(--himalaya-card)] flex items-center justify-center text-[var(--himalaya-smoke)] hover:bg-[var(--himalaya-red)] hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[var(--himalaya-card)] flex items-center justify-center text-[var(--himalaya-smoke)] hover:bg-[var(--himalaya-red)] hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[var(--himalaya-card)] flex items-center justify-center text-[var(--himalaya-smoke)] hover:bg-[var(--himalaya-red)] hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[var(--himalaya-card)] flex items-center justify-center text-[var(--himalaya-smoke)] hover:bg-[var(--himalaya-red)] hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-display uppercase text-[var(--himalaya-white)] mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[var(--himalaya-smoke)] hover:text-[var(--himalaya-red)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-display uppercase text-[var(--himalaya-white)] mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-[var(--himalaya-smoke)]">
                <MapPin className="w-5 h-5 flex-shrink-0 text-[var(--himalaya-red)] mt-0.5" />
                <span>
                  Industrial Area, Phase 2<br />
                  Ahmedabad, Gujarat 380001<br />
                  India
                </span>
              </li>
              <li className="flex gap-3 text-[var(--himalaya-smoke)]">
                <Phone className="w-5 h-5 flex-shrink-0 text-[var(--himalaya-red)]" />
                <a href="tel:+919876543210" className="hover:text-[var(--himalaya-red)] transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex gap-3 text-[var(--himalaya-smoke)]">
                <Mail className="w-5 h-5 flex-shrink-0 text-[var(--himalaya-red)]" />
                <a href="mailto:info@thehimalaya.co.in" className="hover:text-[var(--himalaya-red)] transition-colors">
                  info@thehimalaya.co.in
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--border)]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--himalaya-smoke)]">
            <div>
              © {new Date().getFullYear()} The Himalaya. All rights reserved. | GST: 24AAAAA0000A1Z5
            </div>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-[var(--himalaya-red)] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-[var(--himalaya-red)] transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
