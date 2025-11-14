"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function About() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1, 1, 0.8],
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full py-20 sm:py-24 bg-white dark:bg-black overflow-hidden"
    >
      <motion.div
        style={{ opacity, scale }}
        className="relative max-w-4xl mx-auto px-6 sm:px-8 text-center"
      >
        {/* Large statement */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-8 leading-tight"
        >
          About J.I.M.
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed"
        >
          Born from a passion for discovering authentic talent, we've built a
          community where diversity thrives and creativity flourishes. Every
          face we represent tells a unique story, and every partnership we forge
          creates opportunities that transcend the ordinary.
        </motion.p>
      </motion.div>
    </section>
  );
}
