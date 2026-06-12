import { FolderOpen, Monitor, Shield, Headphones, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequestButton } from "@/components/request-button";

const highlights = [
  { icon: Monitor, label: "Responsive Design" },
  { icon: Shield, label: "Secure & Reliable" },
  { icon: TrendingUp, label: "Growth Driven" },
  { icon: Headphones, label: "24/7 Support" },
];

export function Hero() {
  return (
    <section className="relative min-h-[85dvh] flex items-center justify-center overflow-hidden pt-[4.25rem] sm:pt-20 px-1">
      {/* Glowing Mesh Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Floating Ambient Orbs */}
      <div className="absolute top-[-10%] left-[10%] w-[350px] h-[350px] rounded-full bg-primary/15 blur-[120px] mix-blend-screen animate-float pointer-events-none" />
      <div className="absolute bottom-[5%] right-[5%] w-[400px] h-[400px] rounded-full bg-accent/12 blur-[130px] mix-blend-screen animate-float-delayed pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs sm:text-sm text-primary mb-4 sm:mb-6">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Premium Web Development & Digital Solutions
        </span>

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance max-w-5xl mx-auto leading-[1.15] sm:leading-[1.1]">
          Transforming Businesses Into{" "}
          <span className="gradient-text">Powerful Digital Experiences</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
          We help organizations, industries, and growing businesses establish a strong online
          presence with premium websites, scalable solutions, and end-to-end website management
          services.
        </p>

        <p className="mt-4 text-base sm:text-lg text-muted-foreground/80 max-w-2xl mx-auto text-balance">
          From concept to continuous maintenance, we ensure your digital presence reflects the
          excellence of your brand.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto px-2 sm:px-0">
          <RequestButton className="w-full sm:w-auto" size="lg" />
          <Button variant="outline" size="lg" className="w-full sm:w-auto min-h-[44px]" asChild>
            <a href="#services">
              <FolderOpen className="mr-2 w-4 h-4" />
              Explore Our Services
            </a>
          </Button>
        </div>

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 bg-card/30 hover:scale-[1.04] hover:border-primary/40 hover:bg-card/50 transition-all duration-300 shadow-sm hover:shadow-primary/5 hover:shadow-lg cursor-default group"
            >
              <item.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xs sm:text-sm text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
