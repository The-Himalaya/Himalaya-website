'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Shield } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface ProductCardProps {
  name: string;
  slug: string;
  image: string;
  loadClass?: string;
  specs?: { [key: string]: string };
  category?: string;
}

export function ProductCard({ name, slug, image, loadClass, specs, category }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-[var(--himalaya-red)]/50 shadow-sm hover:shadow-md transition-all"
      style={{ perspective: '1000px' }}
    >
      <Link href={`/product/${slug}`} className="block">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden bg-slate-100">
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Load Class Badge */}
          {loadClass && (
            <div className="absolute top-4 right-4 bg-[var(--himalaya-red)] text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              {loadClass}
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--himalaya-black)] via-transparent to-transparent opacity-60" />
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-display uppercase text-[var(--himalaya-black)] mb-2 group-hover:text-[var(--himalaya-red)] transition-colors">
            {name}
          </h3>

          {category && (
            <p className="text-sm text-slate-500 mb-3">{category}</p>
          )}

          {/* Key Specs */}
          {specs && Object.entries(specs).slice(0, 2).length > 0 && (
            <div className="space-y-1 mb-4">
              {Object.entries(specs).slice(0, 2).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-slate-400 capitalize">{key}:</span>
                  <span className="text-[var(--himalaya-black)] font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* View Details Link */}
          <div className="flex items-center gap-2 text-[var(--himalaya-red)] text-sm font-medium group-hover:gap-3 transition-all">
            View Details
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
