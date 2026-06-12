import { CheckCircle2, Target, Lightbulb, Heart } from "lucide-react";

const reasons = [
  {
    title: "Tailored Solutions",
    desc: "Every website is designed specifically for your business requirements.",
  },
  {
    title: "Modern Technology",
    desc: "Built using the latest tools and frameworks for speed, scalability, and performance.",
  },
  {
    title: "Ongoing Support",
    desc: "We don't just deliver projects—we partner with you for long-term success.",
  },
  {
    title: "Security First",
    desc: "Protecting your business with secure and reliable solutions.",
  },
  {
    title: "Professional Design",
    desc: "Creating visually stunning experiences that leave lasting impressions.",
  },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "Empower businesses with digital platforms that drive credibility, engagement, and measurable growth.",
  },
  {
    icon: Lightbulb,
    title: "Our Approach",
    desc: "We listen first, design thoughtfully, and build with modern technology — delivering solutions that last.",
  },
  {
    icon: Heart,
    title: "Our Promise",
    desc: "Transparent communication, on-time delivery, and dedicated support long after your website goes live.",
  },
];

export function AboutUs() {
  return (
    <section id="about" className="section-padding bg-muted/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16">
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              About Us
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Building Websites That{" "}
              <span className="gradient-text">Build Businesses</span>
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                At Work4You, we believe a website is more than just a digital platform—it&apos;s
                the foundation of your brand&apos;s online identity.
              </p>
              <p>
                Our mission is to help organizations and businesses succeed through innovative
                design, modern technologies, and reliable website management.
              </p>
              <p>
                Whether you&apos;re a startup, a small business, or an established enterprise, we
                deliver solutions that grow with your ambitions.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">Why Work4You?</h3>
            <div className="space-y-4">
              {reasons.map((reason) => (
                <div
                  key={reason.title}
                  className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card/40 hover:border-primary/30 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{reason.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {reason.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value) => (
            <div key={value.title} className="premium-card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
