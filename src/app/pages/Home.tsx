import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight, Shield, Award, TrendingUp, Package } from 'lucide-react';
import { ThreeDViewer } from '../components/shared/ThreeDViewer';
import { StatCounter } from '../components/shared/StatCounter';
import { CategoryCard } from '../components/shared/CategoryCard';
import { ProductCard } from '../components/shared/ProductCard';
import { ClientLogoMarquee } from '../components/shared/ClientLogoMarquee';
import { CertBadge } from '../components/shared/CertBadge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  fetchCategories,
  fetchFeaturedProducts,
  fetchProjects,
  certifications,
  clients,
} from '../data/api';
import type { Category, Product, Project } from '../data/mockData';
import { useRef, useState, useEffect } from 'react';

const slides = [
  {
    label: '20+ Years of Excellence',
    heading: 'Built to Last.',
    headingAccent: 'Built for India.',
    sub: 'Manufacturing world-class infrastructure products since 2004.',
    bg: 'from-[#014871] to-[#01629c]',
    accent: '#D7EDE2',
  },
  {
    label: 'FRP / GRP Products',
    heading: 'Covers That',
    headingAccent: 'Never Crack.',
    sub: 'Fibre-reinforced polymer manhole covers — corrosion-proof, load-bearing, built for Indian roads.',
    bg: 'from-[#012a4a] to-[#014871]',
    accent: '#9ecfba',
  },
  {
    label: 'RCC & Concrete',
    heading: 'Strength in',
    headingAccent: 'Every Pour.',
    sub: 'RCC manhole covers, cover blocks, hume pipes — precision-cast for civil & municipal infrastructure.',
    bg: 'from-[#011a2e] to-[#01629c]',
    accent: '#D7EDE2',
  },
  {
    label: 'Ready to Build?',
    heading: 'Get a Bulk',
    headingAccent: 'Quote Today.',
    sub: 'Serving 25+ cities. 5,000+ projects delivered. Pan-India supply.',
    bg: 'from-[#014871] to-[#011a2e]',
    accent: '#9ecfba',
    cta: true,
  },
];

type Slide = (typeof slides)[number];

function HeroSlide({
  slide,
  index,
  total,
  progress,
}: {
  slide: Slide;
  index: number;
  total: number;
  progress: ReturnType<typeof useSpring>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const mid = (start + end) / 2;

  const opacity = useTransform(
    progress,
    index === 0
      ? [0, mid, end - 0.05, end]
      : [start, start + 0.05, mid, end - 0.05, end],
    index === 0
      ? [1, 1, 1, 0]
      : [0, 1, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [start, start + 0.08, end - 0.08, end],
    ['40px', '0px', '0px', '-40px']
  );
  const scale = useTransform(progress, [start, start + 0.08, end], [0.96, 1, 1.02]);

  return (
    <motion.div
      style={{ opacity }}
      className={`absolute inset-0 bg-gradient-to-br ${slide.bg} flex items-center justify-center`}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(${slide.accent} 1px, transparent 1px), linear-gradient(90deg, ${slide.accent} 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Accent glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: slide.accent }}
      />

      <motion.div style={{ y, scale }} className="relative z-10 container mx-auto px-8 max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-6" style={{ color: slide.accent }}>
          {slide.label}
        </p>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display uppercase leading-none text-white mb-4">
          {slide.heading}
          <br />
          <span style={{ color: slide.accent }}>{slide.headingAccent}</span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mt-6 leading-relaxed">
          {slide.sub}
        </p>

        {slide.cta && (
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Button
              asChild
              size="lg"
              className="text-white text-base px-8 py-6"
              style={{ background: slide.accent }}
            >
              <Link to="/products">
                Explore Products <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-white/40 text-white hover:bg-white/10 text-base px-8 py-6"
            >
              <Link to="/bulk-order">Request Bulk Quote</Link>
            </Button>
          </div>
        )}
      </motion.div>

      {/* Progress dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, dotIdx) => (
          <div
            key={dotIdx}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: dotIdx === index ? slide.accent : 'rgba(255,255,255,0.3)' }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchFeaturedProducts().then(setFeaturedProducts);
    fetchProjects().then(setProjects);
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <div className="min-h-screen">
      {/* Hero — Sticky Scroll Storytelling */}
      <section ref={heroRef} className="relative h-[400vh]">
        <div className="sticky top-0 h-screen overflow-hidden bg-slate-900">
          {slides.map((slide, i) => (
            <HeroSlide
              key={i}
              slide={slide}
              index={i}
              total={slides.length}
              progress={smoothProgress}
            />
          ))}

          {/* Scroll progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 origin-left"
            style={{ scaleX: smoothProgress, background: '#D7EDE2' }}
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[var(--himalaya-navy)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <StatCounter end={2004} label="Established" suffix="" />
            <StatCounter end={5000} label="Projects Completed" suffix="+" />
            <StatCounter end={25} label="Cities Deployed" suffix="+" />
            <StatCounter end={50} label="Product SKUs" suffix="+" />
          </div>
        </div>
      </section>

      {/* Product Categories */}
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
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Comprehensive infrastructure solutions engineered for Indian conditions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-display uppercase text-[var(--himalaya-black)] mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-slate-500">
              IS:12592 certified, load-tested, built to exceed standards
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white"
            >
              <Link to="/products">
                View All Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Project Showcase */}
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
              Project Showcase
            </h2>
            <p className="text-xl text-slate-500">
              Powering India's infrastructure from metros to highways
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative h-96 rounded-lg overflow-hidden"
              >
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--himalaya-black)] via-[var(--himalaya-black)]/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-sm text-[var(--himalaya-gold)] mb-2">
                    {project.year} • {project.quantity}
                  </div>
                  <h3 className="text-2xl font-display uppercase text-[var(--himalaya-white)] mb-2">
                    {project.name}
                  </h3>
                  <p className="text-[var(--himalaya-smoke)] mb-3">{project.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {project.products.map((product, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[var(--himalaya-red)]/20 text-[var(--himalaya-red)] px-2 py-1 rounded"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-display uppercase text-[var(--himalaya-black)] mb-4">
              Why The Himalaya?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'IS Certified',
                description: 'All products certified to IS:12592 and BIS standards',
              },
              {
                icon: Award,
                title: 'Quality Assured',
                description: 'ISO 9001:2015 certified manufacturing processes',
              },
              {
                icon: TrendingUp,
                title: '20+ Years',
                description: 'Two decades of manufacturing excellence since 2004',
              },
              {
                icon: Package,
                title: 'Pan-India',
                description: 'Deployed across 25+ cities in major infrastructure projects',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-[var(--himalaya-red)]/10 rounded-full flex items-center justify-center group-hover:bg-[var(--himalaya-red)] transition-colors">
                  <item.icon className="w-10 h-10 text-[var(--himalaya-red)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-display uppercase text-[var(--himalaya-black)] mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-500">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
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
              Certifications
            </h2>
            <p className="text-xl text-slate-500">
              Certified excellence, proven quality
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {certifications.map((cert) => (
              <CertBadge key={cert.name} {...cert} />
            ))}
          </div>
        </div>
      </section>

      {/* Clients Marquee */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-display uppercase text-center text-[var(--himalaya-black)] mb-2">
            Trusted By Industry Leaders
          </h2>
        </div>
        <ClientLogoMarquee clients={clients} />
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-[var(--himalaya-navy)] overflow-hidden">
        {/* Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                var(--himalaya-red),
                var(--himalaya-red) 10px,
                transparent 10px,
                transparent 20px
              )
            `,
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-5xl md:text-6xl font-display uppercase text-[var(--himalaya-white)] mb-6">
                Ready to Build?
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Get a quote for your project. Our team responds within 24 hours.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white/10 border border-white/20 rounded-lg p-8"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-14 text-lg"
                />
                <Button
                  size="lg"
                  className="bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white h-14 px-8"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
              <p className="text-sm text-white/70 mt-4 text-center">
                Or call us directly: <a href="tel:+919876543210" className="text-[var(--himalaya-gold)] hover:underline">+91 98765 43210</a>
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
