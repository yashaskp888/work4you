"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Projects Delivered", value: 100, suffix: "+" },
  { label: "Happy Clients", value: 50, suffix: "+" },
  { label: "Website Availability", value: 99.9, suffix: "%", decimal: true },
  { label: "Technical Support", display: "24×7" },
];

function AnimatedCounter({
  value,
  suffix,
  decimal,
}: {
  value: number;
  suffix: string;
  decimal?: boolean;
}) {
  const [count, setCount] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || animated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animated.current) return;
        animated.current = true;
        const duration = 1200;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const current = value * progress;
          setCount(current);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  const formatted = decimal ? count.toFixed(1) : Math.floor(count).toString();

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            By The Numbers
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            Trusted By <span className="gradient-text">Growing Businesses</span>
          </h2>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-teal-600/80 via-cyan-600/60 to-violet-600/80 p-px">
          <div className="rounded-[23px] bg-card/90 p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text">
                    {stat.display ? (
                      stat.display
                    ) : (
                      <AnimatedCounter
                        value={stat.value!}
                        suffix={stat.suffix!}
                        decimal={stat.decimal}
                      />
                    )}
                  </div>
                  <p className="mt-2 text-sm sm:text-base text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
