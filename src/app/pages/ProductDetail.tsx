import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Download, Shield, Package, CheckCircle } from 'lucide-react';
import { ThreeDViewer } from '../components/shared/ThreeDViewer';
import { ProductCard } from '../components/shared/ProductCard';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { fetchProductBySlug, fetchProducts } from '../data/api';
import type { Product } from '../data/mockData';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | undefined>();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [p, allProducts] = await Promise.all([
        fetchProductBySlug(slug || ''),
        fetchProducts(),
      ]);
      setProduct(p);
      if (p) {
        setRelatedProducts(
          allProducts.filter((r) => r.categorySlug === p.categorySlug && r.id !== p.id).slice(0, 3)
        );
      }
      setLoading(false);
    };
    loadData();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen pt-20 flex items-center justify-center"><p className="text-lg text-slate-500">Loading...</p></div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display uppercase text-[var(--himalaya-black)] mb-4">
            Product Not Found
          </h1>
          <Button asChild>
            <Link to="/products">Back to Products</Link>
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
            <Link to="/" className="hover:text-[var(--himalaya-red)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-[var(--himalaya-red)] transition-colors">
              Products
            </Link>
            <span>/</span>
            <Link
              to={`/products/${product.categorySlug}`}
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
            to={`/products/${product.categorySlug}`}
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
                <div className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg overflow-hidden aspect-square">
                  <ThreeDViewer
                    productName={product.name}
                    fallbackImage={product.image}
                    className="w-full h-full"
                    autoRotate={true}
                  />
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Button
                    size="lg"
                    className="bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white w-full"
                  >
                    Add to Enquiry
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-[var(--himalaya-gold)] text-[var(--himalaya-gold)] hover:bg-[var(--himalaya-gold)] hover:text-[var(--himalaya-black)] w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Datasheet
                  </Button>
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
                <Link to="/contact">Request Quote</Link>
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
