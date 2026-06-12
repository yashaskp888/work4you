import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    emoji: "🌐",
    title: "Custom Website Development",
    description: "Professional websites tailored to your organization's vision and goals.",
    details: [
      "Unique designs aligned with your brand",
      "Mobile-first responsive layouts",
      "Fast, modern frameworks (React, Next.js)",
      "Content management made easy",
    ],
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    emoji: "⚙",
    title: "Website Management & Maintenance",
    description: "Continuous monitoring, updates, backups, and technical support.",
    details: [
      "Regular security patches & updates",
      "Automated backups & uptime monitoring",
      "Content updates on demand",
      "Dedicated technical support team",
    ],
    gradient: "from-violet-500 to-purple-500",
  },
  {
    emoji: "🏢",
    title: "Corporate & Industry Websites",
    description: "Scalable digital solutions built for enterprises and growing companies.",
    details: [
      "Multi-page corporate portals",
      "Industry-specific features",
      "Team & department sections",
      "Integration with business tools",
    ],
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    emoji: "🛒",
    title: "E-Commerce Solutions",
    description: "Powerful online stores designed to maximize sales and customer engagement.",
    details: [
      "Product catalogs & inventory",
      "Secure payment gateways",
      "Order tracking & notifications",
      "Conversion-optimized checkout",
    ],
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    emoji: "🏡",
    title: "Real Estate & Plot Sales / Construction & Developers",
    description: "Premium residential & commercial plots, end-to-end building construction, and layout development.",
    details: [
      "Prime residential, commercial, & agricultural plots",
      "Modern residential & commercial building construction",
      "Custom architectural planning & layout design",
      "Hassle-free registry & verified legal clearances",
    ],
    gradient: "from-amber-500 to-emerald-600",
  },
  {
    emoji: "🔒",
    title: "Secure Hosting & Deployment",
    description: "Reliable infrastructure with enhanced security and uptime.",
    details: [
      "SSL certificates & HTTPS",
      "DDoS protection & firewalls",
      "99.9% uptime guarantee",
      "Scalable cloud infrastructure",
    ],
    gradient: "from-rose-500 to-pink-500",
  },
];

export function Services() {
  return (
    <section id="services" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Solutions Designed for{" "}
            <span className="gradient-text">Every Business</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Whether you need a brand-new website, an online store, or full ongoing management —
            Work4You delivers end-to-end digital solutions tailored to your goals and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <Card className="premium-card h-full group overflow-hidden transition-all duration-500 hover:shadow-primary/5">
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md`}
                  >
                    <span className="text-xl">{service.emoji}</span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed mb-4">
                    {service.description}
                  </CardDescription>
                  <ul className="space-y-3">
                    {service.details.map((detail) => (
                      <li key={detail} className="text-sm text-muted-foreground flex items-start gap-2.5">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors duration-300">
                          <Check className="w-3 h-3" />
                        </span>
                        <span className="leading-tight">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
