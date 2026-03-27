import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { ProductCard } from '../components/shared/ProductCard';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { fetchCategoryBySlug, fetchCategoryProducts } from '../data/api';
import type { Category, Product } from '../data/mockData';

export default function ProductCategory() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const [loadClassFilter, setLoadClassFilter] = useState<string>('all');
  const [category, setCategory] = useState<Category | undefined>();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slug = categorySlug || '';
    Promise.all([
      fetchCategoryBySlug(slug),
      fetchCategoryProducts(slug),
    ]).then(([cat, prods]) => {
      setCategory(cat);
      setAllProducts(prods);
      setLoading(false);
    });
  }, [categorySlug]);

  const filteredProducts = allProducts.filter((product) => {
    if (loadClassFilter === 'all') return true;
    return product.loadClass === loadClassFilter;
  });

  const uniqueLoadClasses = [...new Set(allProducts.map((p) => p.loadClass).filter(Boolean))];

  if (loading) {
    return <div className="min-h-screen pt-20 flex items-center justify-center"><p className="text-lg text-slate-500">Loading...</p></div>;
  }

  if (!category) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display uppercase text-[var(--himalaya-black)] mb-4">
            Category Not Found
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
      {/* Hero Section - image overlay kept dark as it's over an image */}
      <section
        className="relative py-32 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(13, 13, 13, 0.8), rgba(13, 13, 13, 0.9)), url(${category.image})`,
        }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-[var(--himalaya-smoke)] hover:text-[var(--himalaya-red)] transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Products
            </Link>

            <h1 className="text-6xl md:text-7xl font-display uppercase text-white mb-6">
              {category.name}
            </h1>
            <p className="text-xl md:text-2xl text-[var(--himalaya-smoke)] max-w-3xl">
              {category.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Advantages Strip */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.advantages.map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-6 h-6 text-[var(--himalaya-red)] flex-shrink-0 mt-1" />
                <p className="text-[var(--himalaya-black)]">{advantage}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid with Filters */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
            <h2 className="text-4xl md:text-5xl font-display uppercase text-[var(--himalaya-black)]">
              Products ({filteredProducts.length})
            </h2>

            {/* Filter */}
            {uniqueLoadClasses.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-[var(--himalaya-smoke)] text-sm">Filter by Load Class:</span>
                <Select value={loadClassFilter} onValueChange={setLoadClassFilter}>
                  <SelectTrigger className="w-48 bg-white border-gray-200 text-gray-900">
                    <SelectValue placeholder="All Load Classes" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="all">All Load Classes</SelectItem>
                    {uniqueLoadClasses.map((loadClass) => (
                      <SelectItem key={loadClass} value={loadClass || ''}>
                        {loadClass}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-[var(--himalaya-smoke)]">
                No products found with the selected filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - kept dark as final CTA */}
      <section className="py-24 bg-[var(--himalaya-navy)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h3 className="text-4xl md:text-5xl font-display uppercase text-white mb-6">
              Need Help Choosing?
            </h3>
            <p className="text-xl text-white/70 mb-8">
              Our technical team can help you select the right products for your project
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white"
              >
                <Link to="/contact">Contact Technical Team</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-[var(--himalaya-gold)] text-[var(--himalaya-gold)] hover:bg-[var(--himalaya-gold)] hover:text-[var(--himalaya-black)]"
              >
                <Link to="/bulk-order">Request Bulk Quote</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Request Quote Button */}
      <div className="fixed bottom-6 left-6 z-40 hidden md:block">
        <Button
          asChild
          className="bg-[var(--himalaya-gold)] hover:bg-[var(--himalaya-gold)]/90 text-[var(--himalaya-black)] shadow-lg"
        >
          <Link to="/bulk-order">Request Quote</Link>
        </Button>
      </div>
    </div>
  );
}
