"use client";

import { motion } from "framer-motion";

export function Cta() {
  return (
    <section className="relative w-full min-h-[50vh] py-20 sm:py-24 px-6 sm:px-8 bg-muted/20 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://picsum.photos/seed/cta-bg/1920/1080"
          alt=""
          className="w-full h-full object-cover opacity-20 dark:opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-muted/50" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6"
        >
          Ready to Join Us?
        </motion.h2>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-lg sm:text-xl text-foreground/70 mb-12 max-w-2xl mx-auto"
        >
          Whether you're a model looking for representation or a brand seeking talent, let's connect
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <button className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-foreground text-background font-medium transition-transform hover:scale-105 active:scale-95">
            Get Started
          </button>
        </motion.div>
      </div>
    </section>
  );
}
