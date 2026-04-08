'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Download, Shield, Package, CheckCircle, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { ProductCard } from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { fetchProductBySlug, fetchProducts } from '@/lib/api';
import type { Product } from '@/lib/types';
import { ProductDetailSkeleton } from '@/components/shared/skeletons';
import { analytics } from '@/lib/analytics';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetail({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | undefined>();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightboxOpen || !product) return;
      const imgs = (product.images && product.images.length > 0) ? product.images : product.image ? [product.image] : [];
      const total = imgs.length;
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % total);
      if (e.key === 'ArrowLeft')  setActiveIndex((i) => (i - 1 + total) % total);
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, product]);

  useEffect(() => {
    const loadData = async () => {
      const { slug } = await params;
      const [p, allProducts] = await Promise.all([
        fetchProductBySlug(slug),
        fetchProducts(),
      ]);
      setProduct(p ?? undefined);
      if (p) {
        setActiveIndex(0);
        analytics.productView(p.name, p.categorySlug);
        setRelatedProducts(
          allProducts.filter((r) => r.categorySlug === p.categorySlug && r.id !== p.id).slice(0, 3)
        );
      }
      setLoading(false);
    };
    loadData();
  }, [params]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display uppercase text-[var(--himalaya-black)] mb-4">
            Product Not Found
          </h1>
          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <section className="py-6 bg-slate-50 border-b border-[var(--border)]">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-[var(--himalaya-smoke)]">
            <Link href="/" className="hover:text-[var(--himalaya-red)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[var(--himalaya-red)] transition-colors">
              Products
            </Link>
            <span>/</span>
            <Link
              href={`/products/${product.categorySlug}`}
              className="hover:text-[var(--himalaya-red)] transition-colors"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[var(--himalaya-black)]">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Details - Two Column Layout */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <Link
            href={`/products/${product.categorySlug}`}
            className="inline-flex items-center gap-2 text-[var(--himalaya-smoke)] hover:text-[var(--himalaya-red)] transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to {product.category}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT: 3D Viewer (Sticky) */}
            <div className="lg:sticky lg:top-24 h-fit">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Main image viewer */}
                {(() => {
                  const imgs = (product.images && product.images.length > 0) ? product.images : product.image ? [product.image] : [];
                  const current = imgs[activeIndex] ?? '';
                  const total = imgs.length;
                  const prev = () => setActiveIndex((i) => (i - 1 + total) % total);
                  const next = () => setActiveIndex((i) => (i + 1) % total);
                  return (
                    <>
                      {/* Main viewer */}
                      <div
                        className="relative bg-[var(--himalaya-card)] border border-[var(--border)] rounded-xl overflow-hidden aspect-square group cursor-zoom-in"
                        onClick={() => current && setLightboxOpen(true)}
                      >
                        {current ? (
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={activeIndex}
                              src={current}
                              alt={`${product.name} — view ${activeIndex + 1}`}
                              className="w-full h-full object-contain"
                              initial={{ opacity: 0, scale: 0.97 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.97 }}
                              transition={{ duration: 0.2 }}
                            />
                          </AnimatePresence>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Package className="w-24 h-24" />
                          </div>
                        )}

                        {/* Prev / Next arrows */}
                        {total > 1 && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); prev(); }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Previous image"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); next(); }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Next image"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </>
                        )}

                        {/* Counter + zoom hint */}
                        {total > 0 && (
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
                            {total > 1 && (
                              <span className="text-xs bg-black/50 text-white px-2.5 py-1 rounded-full">
                                {activeIndex + 1} / {total}
                              </span>
                            )}
                            {current && (
                              <span className="text-xs bg-black/40 text-white px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ZoomIn className="w-3 h-3" /> Enlarge
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Thumbnail strip */}
                      {total > 1 && (
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                          {imgs.map((img, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveIndex(i)}
                              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                activeIndex === i
                                  ? 'border-[var(--himalaya-red)] shadow-md scale-105'
                                  : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-300'
                              }`}
                              aria-label={`View image ${i + 1}`}
                            >
                              <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Lightbox */}
                      <AnimatePresence>
                        {lightboxOpen && current && (
                          <motion.div
                            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setLightboxOpen(false)}
                          >
                            {/* Close */}
                            <button
                              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                              onClick={() => setLightboxOpen(false)}
                              aria-label="Close"
                            >
                              <X className="w-5 h-5" />
                            </button>

                            {/* Prev */}
                            {total > 1 && (
                              <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                                onClick={(e) => { e.stopPropagation(); prev(); }}
                                aria-label="Previous"
                              >
                                <ChevronLeft className="w-6 h-6" />
                              </button>
                            )}

                            {/* Image */}
                            <AnimatePresence mode="wait">
                              <motion.img
                                key={activeIndex}
                                src={imgs[activeIndex]}
                                alt={`${product.name} — ${activeIndex + 1}`}
                                className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </AnimatePresence>

                            {/* Next */}
                            {total > 1 && (
                              <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                                onClick={(e) => { e.stopPropagation(); next(); }}
                                aria-label="Next"
                              >
                                <ChevronRight className="w-6 h-6" />
                              </button>
                            )}

                            {/* Counter */}
                            {total > 1 && (
                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {imgs.map((_, i) => (
                                  <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                                    className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
                                  />
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  );
                })()}

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white w-full"
                  >
                    <Link href="/contact">Add to Enquiry</Link>
                  </Button>
                  {product.datasheet ? (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="border-2 border-[var(--himalaya-gold)] text-[var(--himalaya-gold)] hover:bg-[var(--himalaya-gold)] hover:text-[var(--himalaya-black)] w-full"
                    >
                      <a href={product.datasheet} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        Datasheet
                      </a>
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      variant="outline"
                      disabled
                      className="border-2 border-gray-200 text-gray-400 w-full cursor-not-allowed"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Datasheet
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* RIGHT: Product Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Product Header */}
              <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-5xl md:text-6xl font-display uppercase text-[var(--himalaya-black)] mb-4">
                      {product.name}
                    </h1>
                    {product.standard && (
                      <Badge className="bg-[var(--himalaya-gold)]/10 text-[var(--himalaya-gold)] border border-[var(--himalaya-gold)]/30">
                        <Shield className="w-4 h-4 mr-2" />
                        {product.standard}
                      </Badge>
                    )}
                  </div>
                  {product.loadClass && (
                    <div className="bg-[var(--himalaya-red)] text-white px-6 py-3 rounded-lg text-center">
                      <div className="text-sm opacity-80">Load Class</div>
                      <div className="text-3xl font-display">{product.loadClass}</div>
                    </div>
                  )}
                </div>

                <p className="text-xl text-[var(--himalaya-smoke)] leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="specs" className="w-full">
                <TabsList className="bg-[var(--himalaya-card)] border border-[var(--border)] w-full">
                  <TabsTrigger
                    value="specs"
                    className="flex-1 data-[state=active]:bg-[var(--himalaya-red)] data-[state=active]:text-white"
                  >
                    Specifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="applications"
                    className="flex-1 data-[state=active]:bg-[var(--himalaya-red)] data-[state=active]:text-white"
                  >
                    Applications
                  </TabsTrigger>
                  {product.installation && (
                    <TabsTrigger
                      value="installation"
                      className="flex-1 data-[state=active]:bg-[var(--himalaya-red)] data-[state=active]:text-white"
                    >
                      Installation
                    </TabsTrigger>
                  )}
                </TabsList>

                {/* Technical Specifications */}
                <TabsContent value="specs" className="mt-6">
                  <div className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg p-6">
                    <h3 className="text-2xl font-display uppercase text-[var(--himalaya-black)] mb-6">
                      Technical Specifications
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center py-3 border-b border-[var(--border)] last:border-b-0"
                        >
                          <span className="text-[var(--himalaya-smoke)] capitalize font-medium">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-[var(--himalaya-black)] font-mono">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Applications */}
                <TabsContent value="applications" className="mt-6">
                  <div className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg p-6">
                    <h3 className="text-2xl font-display uppercase text-[var(--himalaya-black)] mb-6">
                      Recommended Applications
                    </h3>
                    <ul className="space-y-3">
                      {product.applications.map((application, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[var(--himalaya-red)] flex-shrink-0 mt-0.5" />
                          <span className="text-[var(--himalaya-black)]">{application}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                {/* Installation Notes */}
                {product.installation && (
                  <TabsContent value="installation" className="mt-6">
                    <div className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg p-6">
                      <h3 className="text-2xl font-display uppercase text-[var(--himalaya-black)] mb-6">
                        Installation Guidelines
                      </h3>
                      <ol className="space-y-4">
                        {product.installation.map((step, index) => (
                          <li key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--himalaya-red)] text-white flex items-center justify-center font-medium">
                              {index + 1}
                            </div>
                            <span className="text-[var(--himalaya-black)] pt-1">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </TabsContent>
                )}
              </Tabs>

              {/* Load Rating Visualization (if load class exists) */}
              {product.loadClass && (
                <div className="mt-8 bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg p-6">
                  <h3 className="text-2xl font-display uppercase text-[var(--himalaya-black)] mb-6">
                    Load Rating
                  </h3>
                  <div className="relative">
                    <div className="flex justify-between text-sm text-[var(--himalaya-smoke)] mb-2">
                      <span>A15 (1.5T)</span>
                      <span>B125 (12.5T)</span>
                      <span>C250 (25T)</span>
                      <span>D400 (40T)</span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--himalaya-gold)] to-[var(--himalaya-red)] rounded-full transition-all"
                        style={{
                          width: product.loadClass === 'D400' ? '100%' :
                                 product.loadClass === 'C250' ? '75%' :
                                 product.loadClass === 'B125' ? '50%' : '25%'
                        }}
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <span className="text-[var(--himalaya-black)] font-medium">
                        Rated for: {product.specs.loadCapacity || product.loadClass}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-display uppercase text-[var(--himalaya-black)] mb-4">
                Related Products
              </h2>
              <p className="text-xl text-[var(--himalaya-smoke)]">
                More from {product.category}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} {...relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - kept dark as final CTA */}
      <section className="py-24 bg-[var(--himalaya-navy)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg p-12"
          >
            <Package className="w-16 h-16 text-[var(--himalaya-red)] mx-auto mb-6" />
            <h3 className="text-4xl md:text-5xl font-display uppercase text-[var(--himalaya-black)] mb-4">
              Ready to Order?
            </h3>
            <p className="text-xl text-[var(--himalaya-smoke)] mb-8">
              Contact us for pricing, availability, and bulk order discounts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white"
              >
                <Link href="/contact">Request Quote</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-[var(--himalaya-gold)] text-[var(--himalaya-gold)] hover:bg-[var(--himalaya-gold)] hover:text-[var(--himalaya-black)]"
              >
                <a href="tel:+919876543210">Call: +91 98765 43210</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
