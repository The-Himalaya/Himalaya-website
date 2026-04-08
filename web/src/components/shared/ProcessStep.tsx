'use client';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
}

export function ProcessStep({ number, title, description, icon: Icon, delay = 0 }: ProcessStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay }}
      className="relative flex gap-6 group"
    >
      {/* Number & Icon Circle */}
      <div className="flex-shrink-0">
        <div className="relative w-20 h-20 rounded-full bg-[var(--himalaya-red)] flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-8 h-8 text-white" />
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--himalaya-gold)] flex items-center justify-center text-sm font-bold text-[var(--himalaya-black)]">
            {number}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-2">
        <h4 className="text-xl font-display uppercase text-[var(--himalaya-white)] mb-2 group-hover:text-[var(--himalaya-red)] transition-colors">
          {title}
        </h4>
        <p className="text-[var(--himalaya-smoke)] leading-relaxed">{description}</p>
      </div>

      {/* Connector Line (except for last item) */}
      <div className="absolute left-10 top-24 w-0.5 h-full bg-gradient-to-b from-[var(--himalaya-red)] to-transparent" />
    </motion.div>
  );
}
