export function CTASection() {
  return (
    <section id="contact" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-cyan-600 to-violet-700" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Ready To Take Your Business Online?
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Join organizations and businesses that trust Work4You to deliver premium digital
              experiences — from stunning design to reliable long-term management.
            </p>
            <p className="mt-4 text-lg text-white/90 font-medium">
              Let&apos;s Build Something Extraordinary Together.
            </p>
            <p className="mt-6 text-sm text-white/70 max-w-xl mx-auto">
              Use the <strong className="text-white">Let&apos;s Get Started</strong> button at the
              top of the page to share your project details and begin your project.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
