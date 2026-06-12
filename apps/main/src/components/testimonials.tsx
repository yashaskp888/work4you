"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "CEO, TechNova Solutions",
    content:
      "Work4You transformed our online presence completely. Their attention to detail and professional approach exceeded all expectations. Our new website has increased leads by 340%.",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "James Chen",
    role: "Founder, GreenLeaf Organics",
    content:
      "The e-commerce platform they built is absolutely stunning. Fast, secure, and beautifully designed. Our sales have doubled since launch. Highly recommend!",
    rating: 5,
    avatar: "JC",
  },
  {
    name: "Dr. Emily Watson",
    role: "Director, Metro Healthcare",
    content:
      "Professional, responsive, and incredibly skilled. Work4You delivered a complex healthcare portal on time and within budget. Their ongoing support is exceptional.",
    rating: 5,
    avatar: "EW",
  },
  {
    name: "Michael Rodriguez",
    role: "Marketing Head, Urban Realty",
    content:
      "From concept to launch, the team was transparent and collaborative. The website perfectly captures our brand identity. Best investment we've made this year.",
    rating: 5,
    avatar: "MR",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="section-padding bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="premium-card h-full relative overflow-hidden">
                <Quote className="absolute top-4 right-4 w-10 h-10 text-primary/10" />
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-sm text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
