'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle, Package, MapPin, Phone, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { fetchCategories } from '@/lib/api';
import type { Category } from '@/lib/types';
import { analytics } from '@/lib/analytics';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const bulkOrderSchema = z.object({
  // Step 1
  productCategory: z.string().min(1, 'Please select a product category'),
  specificProduct: z.string().optional(),
  quantity: z.string().min(1, 'Please enter quantity'),
  // Step 2
  deliveryState: z.string().min(1, 'Please select delivery state'),
  deliveryCity: z.string().min(1, 'Please enter delivery city'),
  pincode: z.string().min(6, 'Please enter valid pincode'),
  // Step 3
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().min(2, 'Company name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  additionalNotes: z.string().optional(),
});

type BulkOrderFormData = z.infer<typeof bulkOrderSchema>;

export default function BulkOrder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const totalSteps = 3;

  useEffect(() => {
    fetchCategories().then((cats) => {
      setCategories(cats);
      setLoadingCategories(false);
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<BulkOrderFormData>({
    resolver: zodResolver(bulkOrderSchema),
  });

  const quantity = watch('quantity');

  // Calculate estimated lead time based on quantity
  const calculateLeadTime = (qty: string) => {
    const numQty = parseInt(qty) || 0;
    if (numQty <= 100) return '7-10 days';
    if (numQty <= 500) return '2-3 weeks';
    if (numQty <= 1000) return '4-6 weeks';
    return '6-8 weeks';
  };

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ['productCategory', 'quantity'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['deliveryState', 'deliveryCity', 'pincode'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: BulkOrderFormData) => {
    try {
      await addDoc(collection(db, 'bulk_order_inquiries'), {
        product_name: data.specificProduct || data.productCategory,
        quantity: data.quantity,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        state: data.deliveryState,
        city: data.deliveryCity,
        pincode: data.pincode,
        notes: data.additionalNotes || '',
        status: 'new',
        created_at: serverTimestamp(),
      });
    } catch (err) {
      console.error('Failed to submit bulk order:', err);
    }
    analytics.bulkOrderSubmit(data.productCategory, data.quantity);
    setIsSubmitted(true);
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto px-4 text-center"
        >
          <div className="w-24 h-24 bg-[var(--himalaya-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-16 h-16 text-[var(--himalaya-gold)]" />
          </div>
          <h1 className="text-5xl md:text-6xl font-display uppercase text-[var(--himalaya-black)] mb-6">
            Order Received!
          </h1>
          <p className="text-xl text-[var(--himalaya-smoke)] mb-8">
            Thank you for your bulk order request. Our team will contact you within 24 hours with a detailed quotation and delivery timeline.
          </p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(1);
            }}
            size="lg"
            className="bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white"
          >
            Submit Another Order
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <Image
          src="/hero4.jpg"
          alt="Bulk order hero"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-display uppercase text-white mb-4">
              Bulk Order Request
            </h1>
            <p className="text-xl text-white/70">
              Get competitive pricing for large volume orders. Minimum order: 50 units
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="py-8 bg-[var(--himalaya-card)] border-b border-[var(--border)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className={`w-5 h-5 ${currentStep >= 1 ? 'text-[var(--himalaya-red)]' : 'text-[var(--himalaya-smoke)]'}`} />
                <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-[var(--himalaya-black)]' : 'text-[var(--himalaya-smoke)]'}`}>
                  Product Selection
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className={`w-5 h-5 ${currentStep >= 2 ? 'text-[var(--himalaya-red)]' : 'text-[var(--himalaya-smoke)]'}`} />
                <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-[var(--himalaya-black)]' : 'text-[var(--himalaya-smoke)]'}`}>
                  Delivery Location
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className={`w-5 h-5 ${currentStep >= 3 ? 'text-[var(--himalaya-red)]' : 'text-[var(--himalaya-smoke)]'}`} />
                <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-[var(--himalaya-black)]' : 'text-[var(--himalaya-smoke)]'}`}>
                  Contact Details
                </span>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </section>

      {/* Form Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {/* Step 1: Product Selection */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg p-8"
                  >
                    <h2 className="text-3xl font-display uppercase text-[var(--himalaya-black)] mb-8">
                      Step 1: Select Product & Quantity
                    </h2>

                    <div className="space-y-6">
                      {/* Product Category */}
                      <div>
                        <Label htmlFor="productCategory" className="text-gray-700">
                          Product Category *
                        </Label>
                        {loadingCategories ? (
                          <div className="mt-2 h-10 rounded-md border border-gray-200 bg-slate-100 animate-pulse" />
                        ) : (
                          <Select onValueChange={(value) => setValue('productCategory', value)}>
                            <SelectTrigger className="mt-2 bg-white border-gray-200 text-gray-900">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200">
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.slug}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {errors.productCategory && (
                          <p className="text-[var(--himalaya-red)] text-sm mt-1">
                            {errors.productCategory.message}
                          </p>
                        )}
                      </div>

                      {/* Specific Product (optional) */}
                      <div>
                        <Label htmlFor="specificProduct" className="text-gray-700">
                          Specific Product (Optional)
                        </Label>
                        <Input
                          id="specificProduct"
                          {...register('specificProduct')}
                          className="mt-2 bg-white border-gray-200 text-gray-900"
                          placeholder="e.g., Round Manhole Cover D400"
                        />
                      </div>

                      {/* Quantity */}
                      <div>
                        <Label htmlFor="quantity" className="text-gray-700">
                          Quantity (Units) *
                        </Label>
                        <Input
                          id="quantity"
                          type="number"
                          {...register('quantity')}
                          className="mt-2 bg-white border-gray-200 text-gray-900"
                          placeholder="Minimum 50 units"
                          min="50"
                        />
                        {errors.quantity && (
                          <p className="text-[var(--himalaya-red)] text-sm mt-1">
                            {errors.quantity.message}
                          </p>
                        )}
                        {quantity && parseInt(quantity) >= 50 && (
                          <p className="text-[var(--himalaya-gold)] text-sm mt-2">
                            Estimated lead time: {calculateLeadTime(quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Delivery Location */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg p-8"
                  >
                    <h2 className="text-3xl font-display uppercase text-[var(--himalaya-black)] mb-8">
                      Step 2: Delivery Location
                    </h2>

                    <div className="space-y-6">
                      {/* State */}
                      <div>
                        <Label htmlFor="deliveryState" className="text-gray-700">
                          State *
                        </Label>
                        <Select onValueChange={(value) => setValue('deliveryState', value)}>
                          <SelectTrigger className="mt-2 bg-white border-gray-200 text-gray-900">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200">
                            <SelectItem value="gujarat">Gujarat</SelectItem>
                            <SelectItem value="maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="rajasthan">Rajasthan</SelectItem>
                            <SelectItem value="mp">Madhya Pradesh</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.deliveryState && (
                          <p className="text-[var(--himalaya-red)] text-sm mt-1">
                            {errors.deliveryState.message}
                          </p>
                        )}
                      </div>

                      {/* City */}
                      <div>
                        <Label htmlFor="deliveryCity" className="text-gray-700">
                          City *
                        </Label>
                        <Input
                          id="deliveryCity"
                          {...register('deliveryCity')}
                          className="mt-2 bg-white border-gray-200 text-gray-900"
                          placeholder="Enter city name"
                        />
                        {errors.deliveryCity && (
                          <p className="text-[var(--himalaya-red)] text-sm mt-1">
                            {errors.deliveryCity.message}
                          </p>
                        )}
                      </div>

                      {/* Pincode */}
                      <div>
                        <Label htmlFor="pincode" className="text-gray-700">
                          Pincode *
                        </Label>
                        <Input
                          id="pincode"
                          {...register('pincode')}
                          className="mt-2 bg-white border-gray-200 text-gray-900"
                          placeholder="Enter 6-digit pincode"
                          maxLength={6}
                        />
                        {errors.pincode && (
                          <p className="text-[var(--himalaya-red)] text-sm mt-1">
                            {errors.pincode.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Contact Details */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg p-8"
                  >
                    <h2 className="text-3xl font-display uppercase text-[var(--himalaya-black)] mb-8">
                      Step 3: Contact Information
                    </h2>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                          <Label htmlFor="name" className="text-gray-700">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            {...register('name')}
                            className="mt-2 bg-white border-gray-200 text-gray-900"
                            placeholder="John Doe"
                          />
                          {errors.name && (
                            <p className="text-[var(--himalaya-red)] text-sm mt-1">
                              {errors.name.message}
                            </p>
                          )}
                        </div>

                        {/* Company */}
                        <div>
                          <Label htmlFor="company" className="text-gray-700">
                            Company Name *
                          </Label>
                          <Input
                            id="company"
                            {...register('company')}
                            className="mt-2 bg-white border-gray-200 text-gray-900"
                            placeholder="Your Company"
                          />
                          {errors.company && (
                            <p className="text-[var(--himalaya-red)] text-sm mt-1">
                              {errors.company.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email */}
                        <div>
                          <Label htmlFor="email" className="text-gray-700">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            {...register('email')}
                            className="mt-2 bg-white border-gray-200 text-gray-900"
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
                          <Label htmlFor="phone" className="text-gray-700">
                            Phone Number *
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            {...register('phone')}
                            className="mt-2 bg-white border-gray-200 text-gray-900"
                            placeholder="+91 98765 43210"
                          />
                          {errors.phone && (
                            <p className="text-[var(--himalaya-red)] text-sm mt-1">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Additional Notes */}
                      <div>
                        <Label htmlFor="additionalNotes" className="text-gray-700">
                          Additional Notes (Optional)
                        </Label>
                        <Textarea
                          id="additionalNotes"
                          {...register('additionalNotes')}
                          className="mt-2 bg-white border-gray-200 text-gray-900 min-h-[120px]"
                          placeholder="Any specific requirements or questions..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  variant="outline"
                  size="lg"
                  className="border-2 border-[var(--border)] text-[var(--himalaya-black)] disabled:opacity-50"
                >
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    size="lg"
                    className="bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white"
                  >
                    Next Step
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-[var(--himalaya-gold)] hover:bg-[var(--himalaya-gold)]/90 text-[var(--himalaya-black)]"
                  >
                    Submit Order Request
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Trust Signals - kept dark as final CTA */}
      <section className="py-16 bg-[var(--himalaya-navy)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-display text-[var(--himalaya-gold)] mb-2">50+</div>
              <div className="text-white/70">Minimum Order</div>
            </div>
            <div>
              <div className="text-4xl font-display text-[var(--himalaya-gold)] mb-2">24hrs</div>
              <div className="text-white/70">Quote Response Time</div>
            </div>
            <div>
              <div className="text-4xl font-display text-[var(--himalaya-gold)] mb-2">25+</div>
              <div className="text-white/70">Cities Serviceable</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
