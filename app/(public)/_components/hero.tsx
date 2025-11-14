"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

const heroImages = [
  "/hero/1.webp",
  "/hero/2.webp",
  "/hero/3.webp",
  "/hero/4.webp",
];

export function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-auto md:h-[calc(100vh-theme(spacing.16))] bg-background overflow-hidden">
      {/* Main Container */}
      <div className="relative mx-auto container px-6 sm:px-8 lg:px-12 py-6">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center lg:py-0">
          {/* Left Column - Text Content */}
          <motion.div
            className="relative z-10 flex flex-col justify-center space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Small Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">
                J.I.M. Modeling Agency
              </p>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1 className="text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem] font-light leading-[0.9] tracking-[-0.03em] text-zinc-900 dark:text-white">
                Discover
                <br />
                Exceptional
                <br />
                <span className="italic font-serif">Talent</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-md"
            >
              <p className="text-base lg:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                Representing world-class models and talent. Bringing bold
                visions to life through unforgettable faces and exceptional
                professionals.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-6"
            >
              <button className="group relative inline-flex items-center gap-2 text-zinc-900 dark:text-white">
                <span className="text-sm font-medium uppercase tracking-[0.1em]">
                  View Portfolio
                </span>
                <div className="relative h-10 w-10 rounded-full border border-zinc-900 dark:border-white flex items-center justify-center transition-all duration-300 group-hover:bg-zinc-900 dark:group-hover:bg-white">
                  <ArrowUpRight className="h-4 w-4 transition-all duration-300 group-hover:text-white dark:group-hover:text-zinc-900" />
                </div>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex gap-12 pt-8 border-t border-zinc-200 dark:border-zinc-800"
            >
              <div>
                <p className="text-3xl font-light text-zinc-900 dark:text-white">
                  500+
                </p>
                <p className="text-xs uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400 mt-1">
                  Models
                </p>
              </div>
              <div>
                <p className="text-3xl font-light text-zinc-900 dark:text-white">
                  15
                </p>
                <p className="text-xs uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400 mt-1">
                  Years
                </p>
              </div>
              <div>
                <p className="text-3xl font-light text-zinc-900 dark:text-white">
                  50+
                </p>
                <p className="text-xs uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400 mt-1">
                  Countries
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Image Slideshow */}
          <motion.div
            className="relative h-[600px] lg:h-[85vh] lg:ml-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-zinc-100 dark:bg-zinc-900">
              <AnimatePresence initial={false} mode="sync">
                <motion.img
                  key={currentImageIndex}
                  src={heroImages[currentImageIndex]}
                  alt={`Featured model ${currentImageIndex + 1}`}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </AnimatePresence>

              {/* Overlay gradient for better text readability if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export { Hero as HeroV2 };
