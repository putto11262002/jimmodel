"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FEATURED_MODELS = [
  {
    id: 1,
    name: "Sarah Anderson",
    category: "Runway & Editorial",
  },
  {
    id: 2,
    name: "Marcus Chen",
    category: "Commercial & Fashion",
  },
  {
    id: 3,
    name: "Elena Rossi",
    category: "High Fashion",
  },
  {
    id: 4,
    name: "Alex Thompson",
    category: "Commercial & Lifestyle",
  },
  {
    id: 5,
    name: "Victoria Park",
    category: "Fashion & Editorials",
  },
  {
    id: 6,
    name: "James Wright",
    category: "Commercial & Lifestyle",
  },
];

export function FeaturedModelsCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Only run client-side to avoid prerender issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + FEATURED_MODELS.length) % FEATURED_MODELS.length);
  };

  // Auto-advance carousel every 6 seconds
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Get visible cards (current + 2 more for preview)
  const visibleCards = [current, (current + 1) % FEATURED_MODELS.length];

  // Show skeleton during SSR
  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="aspect-[3/4] rounded bg-gradient-to-br from-muted to-muted/80" />
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-20 bg-muted/50 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Main Slide */}
        <div className="relative aspect-[3/4] overflow-hidden rounded">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
              }}
              className="absolute inset-0"
            >
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center relative">
                {/* Placeholder Image */}
                <div className="text-muted-foreground text-sm">
                  Model Image
                </div>

                {/* Text Overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black via-black/50 to-transparent"
                >
                  <h3 className="text-white font-bold text-3xl mb-2">
                    {FEATURED_MODELS[current].name}
                  </h3>
                  <p className="text-white/80 text-lg">
                    {FEATURED_MODELS[current].category}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Side Panel with Next Models */}
        <div className="space-y-4">
          {/* Current Model Info */}
          <motion.div
            key={`info-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <p className="text-muted-foreground text-sm uppercase tracking-wide mb-2">
              Featured Model
            </p>
            <h3 className="text-3xl font-bold text-foreground mb-2">
              {FEATURED_MODELS[current].name}
            </h3>
            <p className="text-lg text-muted-foreground">
              {FEATURED_MODELS[current].category}
            </p>
          </motion.div>

          {/* Upcoming Models Preview */}
          <div className="space-y-3">
            {visibleCards.map((cardIdx, idx) => {
              if (cardIdx === current) return null; // Skip current
              return (
                <motion.div
                  key={FEATURED_MODELS[cardIdx].id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (idx + 1) }}
                  onClick={() => {
                    const diff = cardIdx - current;
                    setDirection(diff > 0 ? 1 : -1);
                    setCurrent(cardIdx);
                  }}
                  className="p-4 rounded bg-muted cursor-pointer transition-all hover:bg-muted/80 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 rounded bg-gradient-to-br from-muted to-muted/80 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground group-hover:text-muted-foreground transition-colors">
                        {FEATURED_MODELS[cardIdx].name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {FEATURED_MODELS[cardIdx].category}
                      </p>
                    </div>
                    <div className="text-muted-foreground group-hover:translate-x-1 transition-transform">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-4 pt-8">
            <button
              onClick={() => paginate(-1)}
              className="flex items-center justify-center w-12 h-12 rounded-full border border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
              aria-label="Previous model"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => paginate(1)}
              className="flex items-center justify-center w-12 h-12 rounded-full border border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
              aria-label="Next model"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Slide Indicator */}
          <div className="flex gap-2 pt-4">
            {FEATURED_MODELS.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  const diff = idx - current;
                  setDirection(diff > 0 ? 1 : -1);
                  setCurrent(idx);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === current
                    ? "bg-primary w-8"
                    : "bg-muted w-2"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
