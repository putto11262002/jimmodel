"use client";

import { motion } from "framer-motion";

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    jobName: "Vogue Editorial Series",
    description: "High fashion editorial shoot featuring emerging talent from Paris Fashion Week",
    size: "large",
  },
  {
    id: 2,
    jobName: "Nike Campaign 2024",
    description: "Commercial lifestyle campaign showcasing athletic wear",
    size: "medium",
  },
  {
    id: 3,
    jobName: "Luxury Brand Lookbook",
    description: "Premium fashion lookbook for Italian luxury brand",
    size: "medium",
  },
  {
    id: 4,
    jobName: "Runway Show Coverage",
    description: "Milan Fashion Week runway documentation",
    size: "small",
  },
  {
    id: 5,
    jobName: "Magazine Cover Shoot",
    description: "Cover story production for international fashion magazine",
    size: "tall",
  },
  {
    id: 6,
    jobName: "Beauty Brand Partnership",
    description: "Cosmetics brand campaign featuring diverse talent",
    size: "small",
  },
  {
    id: 7,
    jobName: "Luxury Watch Campaign",
    description: "High-end timepiece advertising with refined aesthetic",
    size: "medium",
  },
  {
    id: 8,
    jobName: "Social Media Content",
    description: "Monthly content production for major fashion brands",
    size: "medium",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function Portfolio() {
  return (
    <section className="relative w-full min-h-screen py-24 sm:py-32 px-6 sm:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-foreground">
            Our Work
          </h2>
          <p className="mt-4 text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
            Showcasing exceptional campaigns and collaborations that define excellence
          </p>
        </motion.div>

        {/* Asymmetric Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[280px]"
        >
          {PORTFOLIO_ITEMS.map((item, index) => {
            const sizeClasses: Record<string, string> = {
              large: "md:col-span-2 md:row-span-2",
              tall: "lg:row-span-2",
              medium: "md:col-span-1",
              small: "md:col-span-1",
            };

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={`group relative overflow-hidden rounded-lg bg-card border border-border ${sizeClasses[item.size]} cursor-pointer`}
              >
                {/* Background Image */}
                <img
                  src={`https://picsum.photos/seed/portfolio${item.id}/800/800`}
                  alt={item.jobName}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Background placeholder (fallback) */}
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div
                  className={`absolute inset-0 flex flex-col justify-end p-6 ${
                    item.size === "small" || item.size === "medium"
                      ? ""
                      : "translate-y-4 group-hover:translate-y-0"
                  } transition-transform duration-300`}
                >
                  {/* Job number badge */}
                  <div className="absolute top-4 right-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                      <span className="text-xs font-bold text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Text content */}
                  <div
                    className={`${
                      item.size === "small" || item.size === "medium"
                        ? "opacity-0 group-hover:opacity-100"
                        : ""
                    } transition-opacity duration-300`}
                  >
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                      {item.jobName}
                    </h3>
                    <p
                      className={`text-white/80 text-sm leading-relaxed ${
                        item.size === "large" ? "max-w-md" : ""
                      }`}
                    >
                      {item.description}
                    </p>

                    {/* View Work link */}
                    <div className="mt-4 inline-flex items-center gap-2 text-primary-foreground text-sm font-medium">
                      <span>View Work</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
