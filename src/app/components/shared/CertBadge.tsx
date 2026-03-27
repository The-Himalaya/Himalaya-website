import { motion } from 'motion/react';
import { Award, Shield } from 'lucide-react';

interface CertBadgeProps {
  name: string;
  fullName: string;
  description?: string;
  issuer?: string;
}

export function CertBadge({ name, fullName, description, issuer }: CertBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, boxShadow: '0 0 20px rgba(240, 165, 0, 0.3)' }}
      transition={{ duration: 0.3 }}
      className="bg-white border-2 border-[var(--himalaya-red)]/20 rounded-lg p-6 text-center shadow-sm"
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-[var(--himalaya-red)]/10 flex items-center justify-center">
          {name.includes('ISO') ? (
            <Award className="w-8 h-8 text-[var(--himalaya-red)]" />
          ) : (
            <Shield className="w-8 h-8 text-[var(--himalaya-red)]" />
          )}
        </div>
      </div>

      {/* Badge Name */}
      <h3 className="text-xl font-display uppercase text-[var(--himalaya-black)] mb-2">
        {name}
      </h3>

      {/* Full Name */}
      <p className="text-sm text-[var(--himalaya-black)] mb-2">{fullName}</p>

      {/* Description */}
      {description && (
        <p className="text-xs text-slate-500 mb-2 line-clamp-2">
          {description}
        </p>
      )}

      {/* Issuer */}
      {issuer && (
        <p className="text-xs text-slate-500 font-medium">{issuer}</p>
      )}
    </motion.div>
  );
}
