import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter } from 'lucide-react';
import { CategoryCard } from '../components/shared/CategoryCard';
import { ProductCard } from '../components/shared/ProductCard';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { fetchCategories, fetchProducts } from '../data/api';
import type { Category, Product } from '../data/mockData';

export default function ProductsOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchProducts().then(setProducts);
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && product.categorySlug === activeTab;
  });

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-24" style={{ background: 'linear-gradient(135deg, #014871 0%, #D7EDE2 100%)' }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-6xl md:text-7xl font-display uppercase text-white mb-6">
              Our Products
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-8">
              IS:12592 certified, load-tested infrastructure solutions built for India
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--himalaya-smoke)]" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white border-gray-200 text-gray-900 h-14 text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Categories Overview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-display uppercase text-[var(--himalaya-black)] mb-4">
              Product Categories
            </h2>
            <p className="text-xl text-[var(--himalaya-smoke)]">
              Comprehensive infrastructure solutions for every application
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {categories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* All Products with Filter Tabs */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-display uppercase text-[var(--himalaya-black)]">
              All Products
            </h2>
            <div className="flex items-center gap-2 text-[var(--himalaya-smoke)]">
              <Filter className="w-5 h-5" />
              <span className="text-sm">Filter by category</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-[var(--himalaya-card)] border border-[var(--border)] mb-12 flex-wrap h-auto">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-[var(--himalaya-red)] data-[state=active]:text-white"
              >
                All Products
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category.slug}
                  value={category.slug}
                  className="data-[state=active]:bg-[var(--himalaya-red)] data-[state=active]:text-white"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl text-[var(--himalaya-smoke)]">
                    No products found matching your search.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[var(--himalaya-navy)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg p-12"
          >
            <h3 className="text-4xl md:text-5xl font-display uppercase text-[var(--himalaya-black)] mb-4">
              Can't Find What You Need?
            </h3>
            <p className="text-xl text-[var(--himalaya-smoke)] mb-8">
              We offer custom solutions for unique project requirements.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white px-8 py-4 rounded text-lg font-medium transition-colors"
            >
              Contact Our Team
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
