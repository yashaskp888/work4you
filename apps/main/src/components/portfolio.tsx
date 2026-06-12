"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "FinFlow Dashboard",
    category: "FinTech",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    color: "from-blue-600/80 to-indigo-600/80",
  },
  {
    title: "Luxe Commerce",
    category: "E-Commerce",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    color: "from-purple-600/80 to-pink-600/80",
  },
  {
    title: "HealthCare Plus",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80",
    color: "from-emerald-600/80 to-teal-600/80",
  },
  {
    title: "TechStart Platform",
    category: "SaaS",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    color: "from-orange-600/80 to-amber-600/80",
  },
  {
    title: "Urban Realty",
    category: "Real Estate",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    color: "from-rose-600/80 to-red-600/80",
  },
  {
    title: "EduLearn Portal",
    category: "Education",
    image: "https://images.unsplash.com/photo-1501504905252-473a47e081f8?w=800&q=80",
    color: "from-violet-600/80 to-purple-600/80",
  },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Portfolio
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Explore our latest work — crafted with precision and passion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${project.color} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="text-xs font-medium text-white/80 uppercase tracking-wider mb-1">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {project.title}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
              </div>
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-2xl transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
