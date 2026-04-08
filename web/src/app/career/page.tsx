"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import {
  Briefcase,
  MapPin,
  Clock,
  TrendingUp,
  Users,
  Target,
  Heart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchJobOpenings } from "@/lib/api";
import type { JobOpening } from "@/lib/types";
import { JobOpeningSkeleton } from "@/components/shared/skeletons";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const applicationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone number required"),
  position: z.string().min(1, "Please select a position"),
  experience: z.enum(["fresher", "experienced", "expert", "professional"]),
  coverLetter: z.string().optional(),
  resume: z.any().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function Career() {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobOpenings().then((jobs) => {
      setJobOpenings(jobs);
      setLoading(false);
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    let resumeUrl = "";
    let resumeName = "";

    const fileList = data.resume as FileList | undefined;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      resumeName = file.name;
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `resumes/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        resumeUrl = await getDownloadURL(storageRef);
      } catch (err) {
        console.warn("Resume upload skipped (Storage unavailable):", err);
      }
    }

    try {
      await addDoc(collection(db, "job_details", "main", "applications"), {
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        experience: data.experience,
        cover_letter: data.coverLetter || "",
        resume_url: resumeUrl,
        resume_name: resumeName,
        status: "new",
        created_at: serverTimestamp(),
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error("Failed to submit application:", err);
      setSubmitError("Failed to submit your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whyWorkWithUs = [
    {
      icon: TrendingUp,
      title: "Growth Opportunities",
      description: "Fast-track career progression in a rapidly growing company",
    },
    {
      icon: Users,
      title: "Team Culture",
      description: "Collaborative environment with experienced professionals",
    },
    {
      icon: Target,
      title: "Impact",
      description: "Work on projects that shape India's infrastructure",
    },
    {
      icon: Heart,
      title: "Work-Life Balance",
      description: "Competitive benefits and supportive work culture",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <Image
          src="/office.jpg"
          alt="Himalaya office"
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
            <h1 className="text-6xl md:text-7xl font-display uppercase text-white mb-6">
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl text-white/70">
              Build your career while building India's infrastructure
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-display uppercase text-[var(--himalaya-black)] mb-4">
              Why The Himalaya?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {whyWorkWithUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg p-6 text-center group hover:border-[var(--himalaya-red)] transition-colors"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-[var(--himalaya-red)]/10 rounded-full flex items-center justify-center group-hover:bg-[var(--himalaya-red)] transition-colors">
                  <item.icon className="w-8 h-8 text-[var(--himalaya-red)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-display uppercase text-[var(--himalaya-black)] mb-3">
                  {item.title}
                </h3>
                <p className="text-[var(--himalaya-smoke)]">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-display uppercase text-[var(--himalaya-black)] mb-4">
              Current Openings
            </h2>
            <p className="text-xl text-[var(--himalaya-smoke)]">
              {jobOpenings.length} positions available
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {loading ? (
              [...Array(3)].map((_, i) => <JobOpeningSkeleton key={i} />)
            ) : jobOpenings.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedJob(expandedJob === job.id ? null : job.id)
                  }
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-2xl font-display uppercase text-[var(--himalaya-black)] mb-3">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-[var(--himalaya-smoke)]">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </div>
                    </div>
                  </div>
                  {expandedJob === job.id ? (
                    <ChevronUp className="w-6 h-6 text-[var(--himalaya-red)]" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-[var(--himalaya-smoke)]" />
                  )}
                </button>

                {expandedJob === job.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[var(--border)] p-6"
                  >
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-[var(--himalaya-black)] mb-2">
                        Experience Required
                      </h4>
                      <p className="text-[var(--himalaya-smoke)]">
                        {job.experience}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-[var(--himalaya-black)] mb-2">
                        Job Description
                      </h4>
                      <p className="text-[var(--himalaya-smoke)]">
                        {job.description}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-[var(--himalaya-black)] mb-3">
                        Requirements
                      </h4>
                      <ul className="space-y-2">
                        {job.requirements.map((req, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-[var(--himalaya-smoke)]"
                          >
                            <span className="text-[var(--himalaya-red)] mt-1">
                              •
                            </span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      onClick={() => {
                        setValue("position", job.title);
                        document
                          .getElementById("application-form")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white"
                    >
                      Apply for this position
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-5xl font-display uppercase text-[var(--himalaya-black)] mb-4">
                Apply Now
              </h2>
              <p className="text-xl text-[var(--himalaya-smoke)]">
                Submit your application and we'll get back to you soon
              </p>
            </motion.div>

            {!isSubmitted ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit(onSubmit)}
                className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg p-8 space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className="mt-2 bg-white border-gray-200 text-gray-900"
                    />
                    {errors.name && (
                      <p className="text-[var(--himalaya-red)] text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="mt-2 bg-white border-gray-200 text-gray-900"
                    />
                    {errors.email && (
                      <p className="text-[var(--himalaya-red)] text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-700">
                      Phone *
                    </Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      className="mt-2 bg-white border-gray-200 text-gray-900"
                    />
                    {errors.phone && (
                      <p className="text-[var(--himalaya-red)] text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="position" className="text-gray-700">
                      Position *
                    </Label>
                    <Input
                      id="position"
                      {...register("position")}
                      className="mt-2 bg-white border-gray-200 text-gray-900"
                    />
                    {errors.position && (
                      <p className="text-[var(--himalaya-red)] text-sm mt-1">
                        {errors.position.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700">Experience Level *</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue(
                        "experience",
                        value as ApplicationFormData["experience"],
                      )
                    }
                  >
                    <SelectTrigger className="mt-2 bg-white border-gray-200 text-gray-900">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="fresher">Fresher</SelectItem>
                      <SelectItem value="experienced">
                        Experienced (1 – 2 yrs)
                      </SelectItem>
                      <SelectItem value="expert">
                        Expert (3 – 5 years)
                      </SelectItem>
                      <SelectItem value="professional">
                        Professional (5+ years)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.experience && (
                    <p className="text-[var(--himalaya-red)] text-sm mt-1">
                      {errors.experience.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="resume" className="text-gray-700">
                    Attach Resume
                  </Label>
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    {...register("resume")}
                    className="mt-2 bg-white border-gray-200 text-gray-900 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-[var(--himalaya-red)]/10 file:text-[var(--himalaya-red)] hover:file:bg-[var(--himalaya-red)]/20"
                  />
                  <p className="text-xs text-[var(--himalaya-smoke)] mt-1">
                    PDF, DOC or DOCX (optional)
                  </p>
                </div>

                <div>
                  <Label htmlFor="coverLetter" className="text-gray-700">
                    Cover Letter (Optional)
                  </Label>
                  <Textarea
                    id="coverLetter"
                    {...register("coverLetter")}
                    className="mt-2 bg-white border-gray-200 text-gray-900 min-h-[150px]"
                    placeholder="Tell us why you'd be a great fit..."
                  />
                  {errors.coverLetter && (
                    <p className="text-[var(--himalaya-red)] text-sm mt-1">
                      {errors.coverLetter.message}
                    </p>
                  )}
                </div>

                {submitError && (
                  <p className="text-[var(--himalaya-red)] text-sm text-center">
                    {submitError}
                  </p>
                )}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[var(--himalaya-card)] border-2 border-[var(--himalaya-gold)] rounded-lg p-12 text-center"
              >
                <div className="w-20 h-20 bg-[var(--himalaya-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-[var(--himalaya-gold)]" />
                </div>
                <h3 className="text-3xl font-display uppercase text-[var(--himalaya-black)] mb-4">
                  Application Submitted!
                </h3>
                <p className="text-[var(--himalaya-smoke)]">
                  Thank you for your interest. We'll review your application and
                  get back to you soon.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
