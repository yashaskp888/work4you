import { Eye, Users, Rocket, LineChart } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: Eye,
    title: "First Impressions Matter",
    desc: "Your website is often the first touchpoint for customers. We craft polished experiences that build trust from the very first visit.",
  },
  {
    icon: Users,
    title: "Built for Your Audience",
    desc: "Every layout, color, and feature is chosen to resonate with your target customers and reflect your brand identity.",
  },
  {
    icon: Rocket,
    title: "Growth-Ready Platforms",
    desc: "We build websites that scale with your business — whether you're launching a startup or expanding an enterprise.",
  },
  {
    icon: LineChart,
    title: "Results That Matter",
    desc: "Beyond aesthetics, we focus on quality delivery, high-yield assets, and client growth to help you succeed.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="why-us" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(45,212,191,0.06),transparent_70%)]" />
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Why Businesses Choose Work4You
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
            More Than Just a Website —{" "}
            <span className="gradient-text">We Build Your Digital Identity</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-balance">
            In today&apos;s competitive world, your website is often the first impression customers
            have of your business. At Work4You, we create modern, secure, and high-performing
            digital experiences that help businesses establish credibility, attract customers, and
            accelerate growth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <div className="premium-card p-6 h-full text-center sm:text-left group cursor-default transition-all duration-500 hover:shadow-primary/5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto sm:mx-0 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                  <benefit.icon className="w-5 h-5 text-primary group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-300">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-muted-foreground/90">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
