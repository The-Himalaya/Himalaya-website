import { motion } from 'motion/react';

interface ClientLogoMarqueeProps {
  clients: string[];
}

export function ClientLogoMarquee({ clients }: ClientLogoMarqueeProps) {
  // Duplicate array for seamless loop
  const duplicatedClients = [...clients, ...clients];

  return (
    <div className="relative overflow-hidden py-12 bg-[var(--himalaya-navy)]/50">
      {/* Gradient Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--himalaya-black)] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--himalaya-black)] to-transparent z-10" />

      {/* Scrolling Container */}
      <motion.div
        className="flex gap-16"
        animate={{
          x: [0, -50 + '%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 30,
            ease: 'linear',
          },
        }}
      >
        {duplicatedClients.map((client, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex items-center justify-center min-w-[200px] h-20"
          >
            <div className="text-2xl font-display uppercase text-[var(--himalaya-smoke)] hover:text-[var(--himalaya-white)] transition-colors grayscale hover:grayscale-0 cursor-pointer">
              {client}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
