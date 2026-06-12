import {
  Stethoscope,
  GraduationCap,
  UtensilsCrossed,
  Factory,
  Store,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";

const industries = [
  {
    icon: Briefcase,
    name: "Startups & SMEs",
    desc: "Launch your brand online with affordable, professional websites that grow with you.",
  },
  {
    icon: Factory,
    name: "Manufacturing & Industry",
    desc: "Showcase products, capabilities, and certifications with robust corporate portals.",
  },
  {
    icon: Store,
    name: "Retail & E-Commerce",
    desc: "Sell online with beautiful storefronts, secure payments, and inventory management.",
  },
  {
    icon: Stethoscope,
    name: "Healthcare & Wellness",
    desc: "Build trust with clean, accessible sites for clinics, practices, and health services.",
  },
  {
    icon: GraduationCap,
    name: "Education & Training",
    desc: "Engage students and parents with informative, easy-to-navigate educational platforms.",
  },
  {
    icon: UtensilsCrossed,
    name: "Hospitality & Food",
    desc: "Attract diners and guests with menus, bookings, galleries, and location features.",
  },
];

export function Industries() {
  return (
    <section id="industries" className="section-padding bg-muted/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Who We Serve
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Websites for <span className="gradient-text">Every Industry</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Work4You works with organizations across sectors — understanding each industry&apos;s
            unique needs to deliver websites that connect with the right audience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, i) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex gap-4 p-5 h-full rounded-2xl border border-border/50 bg-card/40 hover:border-primary/30 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <industry.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{industry.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{industry.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
