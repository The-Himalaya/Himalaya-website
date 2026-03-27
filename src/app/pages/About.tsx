import { motion } from 'motion/react';
import { Factory, Users, TrendingUp, Award, CheckCircle, Target, Lightbulb, Zap } from 'lucide-react';
import { ProcessStep } from '../components/shared/ProcessStep';
import { StatCounter } from '../components/shared/StatCounter';

export default function About() {
  const timeline = [
    { year: 2004, event: 'Company Founded', description: 'The Himalaya established in Ahmedabad' },
    { year: 2005, event: '50-Set Capacity', description: 'Initial production facility commissioned' },
    { year: 2008, event: 'IS Certification', description: 'First IS:12592 certification achieved' },
    { year: 2012, event: 'Expansion', description: 'Production capacity doubled to 100 sets/month' },
    { year: 2015, event: 'ISO 9001:2015', description: 'Quality management system certification' },
    { year: 2018, event: 'Metro Projects', description: 'First major metro railway supply contract' },
    { year: 2022, event: 'Smart Cities', description: 'Partnership with 10+ smart city projects' },
    { year: 2024, event: '5000+ Projects', description: 'Milestone achievement across India' },
  ];

  const manufacturingSteps = [
    {
      icon: Target,
      title: 'Design & Engineering',
      description: 'CAD-based design optimized for load distribution and material efficiency',
    },
    {
      icon: Factory,
      title: 'Mold Preparation',
      description: 'Precision molds prepared with release agents for perfect replication',
    },
    {
      icon: Lightbulb,
      title: 'Material Layering',
      description: 'Glass fiber and resin layers applied in controlled environment',
    },
    {
      icon: Zap,
      title: 'Curing Process',
      description: 'Temperature-controlled curing ensures optimal strength properties',
    },
    {
      icon: CheckCircle,
      title: 'Quality Testing',
      description: 'Load testing, dimensional checks, and IS standard compliance verification',
    },
  ];

  const comparisonData = [
    { feature: 'Weight', himalaya: '70% lighter', generic: 'Heavy (60-80kg)' },
    { feature: 'Corrosion Resistance', himalaya: '100% corrosion-free', generic: 'Rusts over time' },
    { feature: 'Load Certification', himalaya: 'IS:12592 tested', generic: 'Often uncertified' },
    { feature: 'Scrap Value', himalaya: 'Zero (anti-theft)', generic: 'High (theft prone)' },
    { feature: 'Installation', himalaya: 'Single person', generic: 'Requires 2-3 people' },
    { feature: 'Lifespan', himalaya: '25+ years', generic: '10-15 years' },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-32" style={{ background: 'linear-gradient(135deg, #014871 0%, #D7EDE2 100%)' }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-6xl md:text-7xl font-display uppercase text-white mb-6">
              About The Himalaya
            </h1>
            <p className="text-xl md:text-2xl text-white/70 leading-relaxed">
              Since 2004, we've been engineering world-class infrastructure products that stand the test of time, weather, and India's toughest conditions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[var(--himalaya-navy)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <StatCounter end={20} label="Years of Excellence" suffix="+" />
            <StatCounter end={5000} label="Projects Delivered" suffix="+" />
            <StatCounter end={25} label="Cities Covered" suffix="+" />
            <StatCounter end={100} label="Production Capacity/Month" suffix="" />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-display uppercase text-[var(--himalaya-black)] mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-[var(--himalaya-smoke)]">
              Two decades of innovation and growth
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative flex items-center gap-8 mb-12 last:mb-0"
              >
                {/* Timeline line */}
                {index !== timeline.length - 1 && (
                  <div className="absolute left-[52px] md:left-1/2 top-16 w-0.5 h-full bg-gradient-to-b from-[var(--himalaya-red)] to-transparent" />
                )}

                {/* Content */}
                <div className={`flex items-center gap-8 w-full ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Year badge */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[var(--himalaya-red)] flex items-center justify-center border-4 border-slate-100 relative z-10">
                      <span className="text-2xl md:text-3xl font-display text-white">{item.year}</span>
                    </div>
                  </div>

                  {/* Event card */}
                  <div className="flex-1 bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg p-6">
                    <h3 className="text-2xl font-display uppercase text-[var(--himalaya-black)] mb-2">
                      {item.event}
                    </h3>
                    <p className="text-[var(--himalaya-smoke)]">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Himalaya Comparison */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-display uppercase text-[var(--himalaya-black)] mb-4">
              Why Choose Himalaya?
            </h2>
            <p className="text-xl text-[var(--himalaya-smoke)]">
              The difference is in the details
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-3 bg-slate-100 border-b border-[var(--border)]">
                <div className="p-6 text-center">
                  <span className="text-sm uppercase tracking-wider text-[var(--himalaya-smoke)]">Feature</span>
                </div>
                <div className="p-6 text-center border-x border-[var(--border)]">
                  <span className="text-sm uppercase tracking-wider text-[var(--himalaya-red)] font-medium">The Himalaya</span>
                </div>
                <div className="p-6 text-center">
                  <span className="text-sm uppercase tracking-wider text-[var(--himalaya-smoke)]">Generic Suppliers</span>
                </div>
              </div>

              {/* Rows */}
              {comparisonData.map((row, index) => (
                <motion.div
                  key={row.feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="grid grid-cols-3 border-b border-[var(--border)] last:border-b-0"
                >
                  <div className="p-6 flex items-center">
                    <span className="text-[var(--himalaya-black)] font-medium">{row.feature}</span>
                  </div>
                  <div className="p-6 flex items-center justify-center border-x border-[var(--border)] bg-[var(--himalaya-red)]/5">
                    <CheckCircle className="w-5 h-5 text-[var(--himalaya-red)] mr-2" />
                    <span className="text-[var(--himalaya-black)]">{row.himalaya}</span>
                  </div>
                  <div className="p-6 flex items-center justify-center">
                    <span className="text-[var(--himalaya-smoke)]">{row.generic}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing Process */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-display uppercase text-[var(--himalaya-black)] mb-4">
              Manufacturing Excellence
            </h2>
            <p className="text-xl text-[var(--himalaya-smoke)]">
              Every product follows our rigorous 5-stage quality process
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-8">
            {manufacturingSteps.map((step, index) => (
              <ProcessStep
                key={index}
                number={index + 1}
                {...step}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-display uppercase text-[var(--himalaya-black)] mb-4">
              Our Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Award,
                title: 'Quality First',
                description: 'Every product undergoes rigorous testing and quality checks before delivery',
              },
              {
                icon: Users,
                title: 'Customer Focus',
                description: 'We build long-term partnerships by delivering on our commitments',
              },
              {
                icon: TrendingUp,
                title: 'Continuous Innovation',
                description: 'Investing in R&D to develop next-generation infrastructure solutions',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg p-8 text-center group hover:border-[var(--himalaya-red)] transition-colors"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-[var(--himalaya-red)]/10 rounded-full flex items-center justify-center group-hover:bg-[var(--himalaya-red)] transition-colors">
                  <value.icon className="w-8 h-8 text-[var(--himalaya-red)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-display uppercase text-[var(--himalaya-black)] mb-3">
                  {value.title}
                </h3>
                <p className="text-[var(--himalaya-smoke)]">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-[var(--himalaya-navy)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-[var(--himalaya-card)] border-2 border-[var(--himalaya-gold)]/30 rounded-lg p-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-3xl md:text-4xl font-display uppercase text-[var(--himalaya-black)] mb-6">
                Company Registration Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <p className="text-sm text-[var(--himalaya-smoke)] mb-1">GST Number</p>
                  <p className="text-lg text-[var(--himalaya-black)] font-mono">24AAAAA0000A1Z5</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--himalaya-smoke)] mb-1">Registration Year</p>
                  <p className="text-lg text-[var(--himalaya-black)]">2004</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--himalaya-smoke)] mb-1">Location</p>
                  <p className="text-lg text-[var(--himalaya-black)]">Ahmedabad, Gujarat</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--himalaya-smoke)] mb-1">Legal Status</p>
                  <p className="text-lg text-[var(--himalaya-black)]">Private Limited Company</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
