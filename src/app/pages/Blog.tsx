import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { fetchBlogPosts } from '../data/api';
import type { BlogPost } from '../data/mockData';

export default function Blog() {
  const [email, setEmail] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchBlogPosts().then(setBlogPosts);
  }, []);

  const categories = ['All', 'Technical Guides', 'Industry News', 'Project Spotlights', 'Company News'];

  const filteredPosts = activeCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-24" style={{ background: 'linear-gradient(135deg, #014871 0%, #D7EDE2 100%)' }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-6xl md:text-7xl font-display uppercase text-white mb-6">
              Blog & Insights
            </h1>
            <p className="text-xl md:text-2xl text-white/70">
              Technical guides, industry updates, and project spotlights
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg overflow-hidden">
                <div className="relative h-96 lg:h-auto">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[var(--himalaya-red)] text-white px-3 py-1 rounded text-sm font-medium">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="text-sm text-[var(--himalaya-red)] mb-2">{featuredPost.category}</div>
                  <h2 className="text-3xl md:text-4xl font-display uppercase text-[var(--himalaya-black)] mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-[var(--himalaya-smoke)] mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-[var(--himalaya-smoke)] mb-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <Button className="bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white w-fit">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* All Posts with Category Filter */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-display uppercase text-[var(--himalaya-black)] mb-12 text-center">
            All Articles
          </h2>

          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="max-w-6xl mx-auto">
            <TabsList className="bg-[var(--himalaya-card)] border border-[var(--border)] mb-12 flex-wrap justify-center">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat.toLowerCase().replace(/ /g, '-')}
                  className="data-[state=active]:bg-[var(--himalaya-red)] data-[state=active]:text-white"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeCategory}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg overflow-hidden hover:border-[var(--himalaya-red)] transition-colors"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <div className="text-xs text-[var(--himalaya-red)] mb-2">{post.category}</div>
                      <h3 className="text-xl font-display uppercase text-[var(--himalaya-black)] mb-3 line-clamp-2 group-hover:text-[var(--himalaya-red)] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[var(--himalaya-smoke)] mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-[var(--himalaya-smoke)]">
                        <span>{post.author}</span>
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Newsletter Section - kept dark as final CTA */}
      <section className="py-24 bg-[var(--himalaya-navy)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center bg-[var(--himalaya-card)] border-2 border-[var(--himalaya-gold)]/30 rounded-lg p-12"
          >
            <h3 className="text-4xl font-display uppercase text-[var(--himalaya-black)] mb-4">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-[var(--himalaya-smoke)] mb-8">
              Get the latest updates on infrastructure trends, new products, and technical guides
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white border-gray-200 text-gray-900 h-12"
              />
              <Button className="bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white h-12 px-8">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
