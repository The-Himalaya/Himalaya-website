'use client';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { analytics } from '@/lib/analytics';

export function WhatsAppButton() {
  const phoneNumber = '+919033516045';
  const message = encodeURIComponent('Hello! I would like to inquire about your products.');

  return (
    <motion.a
      href={`https://wa.me/+919033516045?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => analytics.whatsAppClick()}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <MessageCircle className="w-7 h-7 text-white relative z-10" />
      <div className="absolute right-full mr-3 bg-[var(--himalaya-card)] text-[var(--himalaya-white)] px-3 py-2 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat on WhatsApp
      </div>
    </motion.a>
  );
}
