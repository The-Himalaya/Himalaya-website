import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const quoteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  company: z.string().optional(),
  productInterest: z.string().min(1, 'Please select a product category'),
  quantity: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

interface RequestQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RequestQuoteModal({ isOpen, onClose }: RequestQuoteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Quote request:', data);
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form and close modal after 2 seconds
    setTimeout(() => {
      reset();
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg shadow-2xl z-50 p-6 md:p-8"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-display uppercase text-[var(--himalaya-white)] mb-2">
                  Request a Quote
                </h2>
                <p className="text-[var(--himalaya-smoke)]">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-[var(--himalaya-smoke)] hover:text-[var(--himalaya-white)] transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <Label htmlFor="name" className="text-[var(--himalaya-white)]">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      {...register('name')}
                      className="mt-2 bg-[var(--himalaya-navy)] border-[var(--border)] text-[var(--himalaya-white)]"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-[var(--himalaya-red)] text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-[var(--himalaya-white)]">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="mt-2 bg-[var(--himalaya-navy)] border-[var(--border)] text-[var(--himalaya-white)]"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-[var(--himalaya-red)] text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="text-[var(--himalaya-white)]">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="mt-2 bg-[var(--himalaya-navy)] border-[var(--border)] text-[var(--himalaya-white)]"
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && (
                      <p className="text-[var(--himalaya-red)] text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Company */}
                  <div>
                    <Label htmlFor="company" className="text-[var(--himalaya-white)]">
                      Company Name
                    </Label>
                    <Input
                      id="company"
                      {...register('company')}
                      className="mt-2 bg-[var(--himalaya-navy)] border-[var(--border)] text-[var(--himalaya-white)]"
                      placeholder="Your Company"
                    />
                  </div>

                  {/* Product Interest */}
                  <div>
                    <Label htmlFor="productInterest" className="text-[var(--himalaya-white)]">
                      Product Category *
                    </Label>
                    <Select onValueChange={(value) => setValue('productInterest', value)}>
                      <SelectTrigger className="mt-2 bg-[var(--himalaya-navy)] border-[var(--border)] text-[var(--himalaya-white)]">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--himalaya-card)] border-[var(--border)]">
                        <SelectItem value="frp-grp">FRP/GRP Products</SelectItem>
                        <SelectItem value="rcc">RCC Covers</SelectItem>
                        <SelectItem value="blocks">Cover Blocks</SelectItem>
                        <SelectItem value="pipes">Hume Pipes</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.productInterest && (
                      <p className="text-[var(--himalaya-red)] text-sm mt-1">
                        {errors.productInterest.message}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div>
                    <Label htmlFor="quantity" className="text-[var(--himalaya-white)]">
                      Estimated Quantity
                    </Label>
                    <Input
                      id="quantity"
                      {...register('quantity')}
                      className="mt-2 bg-[var(--himalaya-navy)] border-[var(--border)] text-[var(--himalaya-white)]"
                      placeholder="e.g., 100 units"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message" className="text-[var(--himalaya-white)]">
                    Message / Requirements *
                  </Label>
                  <Textarea
                    id="message"
                    {...register('message')}
                    className="mt-2 bg-[var(--himalaya-navy)] border-[var(--border)] text-[var(--himalaya-white)] min-h-[120px]"
                    placeholder="Please provide details about your requirements..."
                  />
                  {errors.message && (
                    <p className="text-[var(--himalaya-red)] text-sm mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Submit Request
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-[var(--himalaya-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <Send className="w-10 h-10 text-[var(--himalaya-gold)]" />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-display uppercase text-[var(--himalaya-white)] mb-2">
                  Request Submitted!
                </h3>
                <p className="text-[var(--himalaya-smoke)]">
                  Thank you for your inquiry. We'll get back to you within 24 hours.
                </p>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Floating Quote Button Component
export function FloatingQuoteButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 z-40 bg-[var(--himalaya-gold)] text-[var(--himalaya-black)] px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow font-medium flex items-center gap-2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Send className="w-5 h-5" />
        <span className="hidden md:inline">Request Quote</span>
      </motion.button>

      <RequestQuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
