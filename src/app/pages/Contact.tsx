import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Valid phone number required'),
  subject: z.string().min(1, 'Please select a subject'),
  productInterest: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    console.log('Contact form submitted:', data);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      details: ['Industrial Area, Phase 2', 'Ahmedabad, Gujarat 380001', 'India'],
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['+91 98765 43210', '+91 79 1234 5678'],
      links: ['tel:+919876543210', 'tel:+917912345678'],
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@thehimalaya.co.in', 'sales@thehimalaya.co.in'],
      links: ['mailto:info@thehimalaya.co.in', 'mailto:sales@thehimalaya.co.in'],
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Saturday: 9:00 AM - 6:00 PM', 'Sunday: Closed'],
    },
  ];

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
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-white/70">
              Get in touch with our team. We respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg p-6 text-center"
              >
                <div className="w-14 h-14 bg-[var(--himalaya-red)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-7 h-7 text-[var(--himalaya-red)]" />
                </div>
                <h3 className="text-lg font-display uppercase text-[var(--himalaya-black)] mb-3">
                  {info.title}
                </h3>
                <div className="space-y-1">
                  {info.details.map((detail, i) => (
                    info.links && info.links[i] ? (
                      <a
                        key={i}
                        href={info.links[i]}
                        className="block text-sm text-[var(--himalaya-smoke)] hover:text-[var(--himalaya-red)] transition-colors"
                      >
                        {detail}
                      </a>
                    ) : (
                      <p key={i} className="text-sm text-[var(--himalaya-smoke)]">
                        {detail}
                      </p>
                    )
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-display uppercase text-[var(--himalaya-black)] mb-8">
                Send Us a Message
              </h2>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-gray-700">Full Name *</Label>
                      <Input
                        id="name"
                        {...register('name')}
                        className="mt-2 bg-white border-gray-200 text-gray-900"
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="text-[var(--himalaya-red)] text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-700">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        className="mt-2 bg-white border-gray-200 text-gray-900"
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-[var(--himalaya-red)] text-sm mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="text-gray-700">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        className="mt-2 bg-white border-gray-200 text-gray-900"
                        placeholder="+91 98765 43210"
                      />
                      {errors.phone && <p className="text-[var(--himalaya-red)] text-sm mt-1">{errors.phone.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-gray-700">Subject *</Label>
                      <Select onValueChange={(value) => setValue('subject', value)}>
                        <SelectTrigger className="mt-2 bg-white border-gray-200 text-gray-900">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem value="product-inquiry">Product Inquiry</SelectItem>
                          <SelectItem value="bulk-order">Bulk Order</SelectItem>
                          <SelectItem value="technical-support">Technical Support</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.subject && <p className="text-[var(--himalaya-red)] text-sm mt-1">{errors.subject.message}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="productInterest" className="text-gray-700">Product Interest (Optional)</Label>
                    <Input
                      id="productInterest"
                      {...register('productInterest')}
                      className="mt-2 bg-white border-gray-200 text-gray-900"
                      placeholder="e.g., FRP D400 Covers"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-700">Message *</Label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      className="mt-2 bg-white border-gray-200 text-gray-900 min-h-[150px]"
                      placeholder="Tell us about your requirements..."
                    />
                    {errors.message && <p className="text-[var(--himalaya-red)] text-sm mt-1">{errors.message.message}</p>}
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[var(--himalaya-card)] border-2 border-[var(--himalaya-gold)] rounded-lg p-8 text-center"
                >
                  <div className="w-16 h-16 bg-[var(--himalaya-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-[var(--himalaya-gold)]" />
                  </div>
                  <h3 className="text-2xl font-display uppercase text-[var(--himalaya-black)] mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-[var(--himalaya-smoke)]">
                    We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-display uppercase text-[var(--himalaya-black)] mb-8">
                Visit Our Factory
              </h2>

              {/* Google Maps Embed */}
              <div className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg overflow-hidden mb-6 h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235013.7038781699!2d72.41493105!3d23.020810850000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="The Himalaya Location"
                ></iframe>
              </div>

              {/* Additional Info */}
              <div className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg p-6">
                <h3 className="text-xl font-display uppercase text-[var(--himalaya-black)] mb-4">
                  Quick Contact
                </h3>
                <div className="space-y-3 text-[var(--himalaya-smoke)]">
                  <p>For immediate assistance, please call us or use WhatsApp:</p>
                  <div className="flex flex-col gap-2">
                    <a
                      href="tel:+919876543210"
                      className="flex items-center gap-2 text-[var(--himalaya-black)] hover:text-[var(--himalaya-red)] transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      +91 98765 43210
                    </a>
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#25D366] hover:text-[#128C7E] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp Us
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - kept dark as final CTA */}
      <section className="py-24 bg-[var(--himalaya-navy)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h3 className="text-4xl font-display uppercase text-white mb-4">
              Need Immediate Assistance?
            </h3>
            <p className="text-xl text-white/70 mb-8">
              Our technical team is available to help you select the right products
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white"
              >
                <a href="tel:+919876543210">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-[var(--himalaya-gold)] text-[var(--himalaya-gold)] hover:bg-[var(--himalaya-gold)] hover:text-[var(--himalaya-black)]"
              >
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                  WhatsApp Chat
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
