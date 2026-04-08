'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchBlogPosts } from '@/lib/api';
import type { BlogPost } from '@/lib/types';
import { BlogPostCardSkeleton, FeaturedBlogPostSkeleton } from '@/components/shared/skeletons';

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts().then((posts) => {
      setBlogPosts(posts);
      setLoading(false);
    });
  }, []);

  // Derive unique categories from actual posts
  const categories = ['All', ...Array.from(new Set(blogPosts.map(p => p.category).filter(Boolean)))];

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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <FeaturedBlogPostSkeleton />
            ) : featuredPost ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg overflow-hidden">
                  <div className="relative h-96 lg:h-auto bg-slate-100">
                    {(featuredPost.image || (featuredPost.images && featuredPost.images[0])) && (
                      <img
                        src={featuredPost.image || featuredPost.images![0]}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover"
                      />
                    )}
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
                        {featuredPost.date ? new Date(featuredPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                      </div>
                    </div>
                    <Link href={`/blog/${featuredPost.slug}`}>
                      <Button className="bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white w-fit">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </div>
        </div>
      </section>

      {/* All Posts with Category Filter */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-display uppercase text-[var(--himalaya-black)] mb-12 text-center">
            All Articles
          </h2>

          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="max-w-6xl mx-auto">
            <TabsList className="bg-[var(--himalaya-card)] border border-[var(--border)] mb-12 flex-wrap justify-center h-auto gap-1 p-1">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat === 'All' ? 'all' : cat}
                  className="data-[state=active]:bg-[var(--himalaya-red)] data-[state=active]:text-white"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeCategory}>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => <BlogPostCardSkeleton key={i} />)}
                </div>
              ) : filteredPosts.length === 0 ? (
                <p className="text-center text-[var(--himalaya-smoke)] py-16">No posts in this category yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post, index) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg overflow-hidden hover:border-[var(--himalaya-red)] transition-colors cursor-pointer h-full"
                      >
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                          {(post.image || (post.images && post.images[0])) && (
                            <img
                              src={post.image || post.images![0]}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          )}
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
                            <span>{post.date ? new Date(post.date).toLocaleDateString() : ''}</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
