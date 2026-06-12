import { motion } from "framer-motion";

const steps = [
  {
    step: "1",
    title: "Understand Your Requirements",
    desc: "We carefully analyze your business goals and requirements.",
    detail:
      "We start with a detailed consultation — learning about your brand, audience, competitors, and goals to define a clear project roadmap.",
  },
  {
    step: "2",
    title: "Design & Development",
    desc: "Our team crafts modern, responsive, and engaging digital experiences.",
    detail:
      "Our designers and developers collaborate to create wireframes, visual designs, and a fully functional website built with modern technology.",
  },
  {
    step: "3",
    title: "Launch & Optimization",
    desc: "We deploy, optimize, and ensure everything performs flawlessly.",
    detail:
      "Before go-live, we test across devices, optimize speed and SEO, configure hosting, and ensure a smooth, error-free launch.",
  },
  {
    step: "4",
    title: "Continuous Support",
    desc: "We manage and maintain your website for long-term success.",
    detail:
      "After launch, we provide ongoing updates, security monitoring, backups, content changes, and technical support — keeping your site at its best.",
  },
];

export function Process() {
  return (
    <section id="process" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Our Process
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            How We Bring Your Vision{" "}
            <span className="gradient-text">To Life</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A proven four-step process that takes you from initial idea to a live, high-performing
            website — with support that continues long after launch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="relative group h-full"
            >
              <div className="premium-card p-6 h-full transition-all duration-500 hover:shadow-primary/5">
                <div className="relative mb-5 w-10 h-10 shrink-0">
                  <span className="absolute -inset-1 rounded-full bg-primary/30 animate-pulse duration-1000" />
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-violet-500 flex items-center justify-center text-sm font-bold text-white shadow-md">
                    {step.step}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3 transition-colors duration-300 group-hover:text-muted-foreground/90">{step.desc}</p>
                <p className="text-xs text-muted-foreground/70 leading-relaxed border-t border-border/50 pt-3">
                  {step.detail}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-[2.75rem] -right-3 w-6 h-[2px] bg-gradient-to-r from-teal-500 to-violet-500 opacity-60 shadow-[0_0_6px_rgba(45,212,191,0.3)]" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
