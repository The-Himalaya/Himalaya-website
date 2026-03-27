import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import logoSrc from '../../../../assets/logo.png';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products', hasDropdown: true },
    { name: 'Bulk Order', path: '/bulk-order' },
    { name: 'Blog', path: '/blog' },
    { name: 'Careers', path: '/career' },
    { name: 'Contact', path: '/contact' },
  ];

  const megaMenuColumns = [
    {
      category: 'FRP / GRP PRODUCTS',
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
      category: 'RCC MANHOLE COVER',
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
      category: 'CONCRETE / PVC COVER BLOCKS',
      path: '/products/cover-blocks',
      subCategories: [
        {
          name: 'CONCRETE COVER BLOCKS',
          items: [
            { name: 'Multiple Type Cover Blocks', path: '/products/cover-blocks/multiple-type-cover-blocks' },
            { name: 'Concrete Cover Blocks With Wire', path: '/products/cover-blocks/concrete-cover-blocks-with-wire' },
            { name: 'Tower Type Spacer', path: '/products/cover-blocks/tower-type-spacer' },
            { name: 'Concrete Pile Cover', path: '/products/cover-blocks/concrete-pile-cover' },
          ],
        },
      ],
    },
    {
      category: '',
      path: '',
      standaloneLinks: [
        { name: 'RCC HUME PIPES', path: '/products/rcc-hume-pipes' },
        { name: 'PVC FOOTSTEPS', path: '/products/pvc-footsteps' },
        { name: 'RCC ELECTRIC CHAMBERS', path: '/products/rcc-electric-chambers' },
        { name: 'DIAMOND DOWELS', path: '/products/diamond-dowels' },
      ],
    },
  ];

  const productCategories = [
    { name: 'FRP/GRP Products', path: '/products/frp-grp-products' },
    { name: 'RCC Covers', path: '/products/rcc-covers' },
    { name: 'Cover Blocks', path: '/products/cover-blocks' },
    { name: 'Hume Pipes', path: '/products/hume-pipes' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group pl-5">
              <img
                src={logoSrc}
                alt="The Himalaya Infrastructure Products"
                className="h-20 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <div key={link.path} className="relative group">
                  {link.hasDropdown ? (
                    <>
                      <button
                        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[var(--himalaya-red)] transition-colors uppercase tracking-wide"
                        onMouseEnter={() => setIsProductsOpen(true)}
                        onMouseLeave={() => setIsProductsOpen(false)}
                      >
                        {link.name}
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {/* Mega Menu Dropdown */}
                      <AnimatePresence>
                        {isProductsOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="fixed left-0 right-0 mt-2 bg-white border-t border-gray-200 shadow-2xl z-50"
                            style={{ top: '80px' }}
                            onMouseEnter={() => setIsProductsOpen(true)}
                            onMouseLeave={() => setIsProductsOpen(false)}
                          >
                            <div className="container mx-auto px-4 py-8">
                              <div className="grid grid-cols-4 gap-8">
                                {megaMenuColumns.map((col, colIdx) => (
                                  <div key={colIdx}>
                                    {col.standaloneLinks ? (
                                      <div className="flex flex-col gap-6">
                                        {col.standaloneLinks.map((link) => (
                                          <Link
                                            key={link.path}
                                            to={link.path}
                                            className="text-sm font-bold text-[#1b6572] hover:text-[#0e3d47] uppercase tracking-wide transition-colors"
                                          >
                                            {link.name}
                                          </Link>
                                        ))}
                                      </div>
                                    ) : (
                                      <>
                                        <Link
                                          to={col.path}
                                          className="block text-sm font-bold text-[#1b6572] hover:text-[#0e3d47] uppercase tracking-wide mb-4 transition-colors"
                                        >
                                          {col.category}
                                        </Link>
                                        {col.items && (
                                          <ul className="space-y-2">
                                            {col.items.map((item) => (
                                              <li key={item.path}>
                                                <Link
                                                  to={item.path}
                                                  className="text-sm text-gray-700 hover:text-[#0099CC] transition-colors"
                                                >
                                                  {item.name}
                                                </Link>
                                              </li>
                                            ))}
                                          </ul>
                                        )}
                                        {col.subCategories && col.subCategories.map((sub) => (
                                          <div key={sub.name} className="mb-4">
                                            <p className="text-xs font-bold text-[#0099CC] uppercase tracking-wide mb-2">{sub.name}</p>
                                            <ul className="space-y-2">
                                              {sub.items.map((item) => (
                                                <li key={item.path}>
                                                  <Link
                                                    to={item.path}
                                                    className="text-sm text-gray-700 hover:text-[#0099CC] transition-colors"
                                                  >
                                                    {item.name}
                                                  </Link>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        ))}
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={link.path}
                      className={`text-sm font-medium transition-colors uppercase tracking-wide ${
                        location.pathname === link.path
                          ? 'text-[var(--himalaya-red)]'
                          : 'text-gray-700 hover:text-[var(--himalaya-red)]'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Phone & CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 text-gray-700 hover:text-[var(--himalaya-red)] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">+91 98765 43210</span>
              </a>
              <Button
                asChild
                className="bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white"
              >
                <Link to="/contact">Get Quote</Link>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-gray-700 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white lg:hidden"
          >
            <div className="flex flex-col h-full pt-24 px-6">
              <nav className="flex-1 overflow-y-auto">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {link.hasDropdown ? (
                      <div className="mb-4">
                        <Link
                          to={link.path}
                          className="block text-2xl font-display uppercase text-gray-800 hover:text-[var(--himalaya-red)] transition-colors py-3"
                        >
                          {link.name}
                        </Link>
                        <div className="ml-4 mt-2 space-y-2">
                          {productCategories.map((category) => (
                            <Link
                              key={category.path}
                              to={category.path}
                              className="block text-lg text-gray-500 hover:text-[var(--himalaya-red)] transition-colors py-2"
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={link.path}
                        className="block text-2xl font-display uppercase text-gray-800 hover:text-[var(--himalaya-red)] transition-colors py-3 mb-4"
                      >
                        {link.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </nav>

              <div className="border-t border-gray-200 pt-6 pb-8">
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-3 text-gray-700 hover:text-[var(--himalaya-red)] transition-colors mb-4"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-lg font-medium">+91 98765 43210</span>
                </a>
                <Button
                  asChild
                  className="w-full bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white"
                >
                  <Link to="/contact">Get Quote</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
