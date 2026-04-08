'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Package } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface CategoryCardProps {
  name: string;
  slug: string;
  description: string;
  productCount: number;
  image: string;
  icon?: React.ReactNode;
}

export function CategoryCard({
  name,
  slug,
  description,
  productCount,
  image,
  icon,
}: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="group relative h-[400px] rounded-lg overflow-hidden"
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <Link href={`/products/${slug}`} className="block h-full">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--himalaya-black)] via-[var(--himalaya-black)]/70 to-[var(--himalaya-black)]/30" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
          {/* Icon */}
          <div className="mb-4 text-[var(--himalaya-red)] transform transition-transform group-hover:scale-110">
            {icon || <Package className="w-10 h-10" />}
          </div>

          {/* Category Name */}
          <h3 className="text-3xl md:text-4xl font-display uppercase text-[var(--himalaya-white)] mb-3 group-hover:text-[var(--himalaya-red)] transition-colors">
            {name}
          </h3>

          {/* Description */}
          <p className="text-[var(--himalaya-smoke)] mb-4 line-clamp-2">
            {description}
          </p>

          {/* Product Count & CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[var(--himalaya-gold)]">
              <Package className="w-5 h-5" />
              <span className="text-sm font-medium">
                {productCount} Products
              </span>
            </div>

            <div className="flex items-center gap-2 text-[var(--himalaya-red)] text-sm font-medium group-hover:gap-3 transition-all">
              Explore
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* Accent Line */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-[var(--himalaya-red)]"
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
      </Link>
    </motion.div>
  );
}
