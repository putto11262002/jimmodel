"use client";

import type { Model, ModelImage } from "@/db/schema";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface FeaturedModelsProps {
  models: (Model & { images: ModelImage[] })[];
}

export function FeaturedModels({ models }: FeaturedModelsProps) {
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const topRow = topRowRef.current;
    const bottomRow = bottomRowRef.current;
    if (!topRow || !bottomRow) return;

    let topAnimationFrameId: number;
    let bottomAnimationFrameId: number;
    let topScrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    // Get the width of one set of cards for each row
    const topFirstChild = topRow.firstElementChild as HTMLElement;
    const bottomFirstChild = bottomRow.firstElementChild as HTMLElement;
    if (!topFirstChild || !bottomFirstChild) return;
    const topCardSetWidth = topFirstChild.offsetWidth;
    const bottomCardSetWidth = bottomFirstChild.offsetWidth;

    // Start bottom row offset to the left by one card set width
    // This ensures there's content on the right to scroll into view
    let bottomScrollPosition = -bottomCardSetWidth;

    // Top row animation (scrolls right to left)
    const animateTopRow = () => {
      topScrollPosition += scrollSpeed;

      if (topScrollPosition >= topCardSetWidth) {
        topScrollPosition = topScrollPosition - topCardSetWidth;
      }

      if (topRow) {
        topRow.style.transform = `translateX(-${topScrollPosition}px)`;
      }

      topAnimationFrameId = requestAnimationFrame(animateTopRow);
    };

    // Bottom row animation (scrolls left to right - opposite direction)
    const animateBottomRow = () => {
      bottomScrollPosition += scrollSpeed;

      // When we've scrolled back to 0, reset to -bottomCardSetWidth to loop seamlessly
      if (bottomScrollPosition >= 0) {
        bottomScrollPosition = -bottomCardSetWidth;
      }

      if (bottomRow) {
        // Apply the position (negative values move content left, showing right side)
        bottomRow.style.transform = `translateX(${bottomScrollPosition}px)`;
      }

      bottomAnimationFrameId = requestAnimationFrame(animateBottomRow);
    };

    topAnimationFrameId = requestAnimationFrame(animateTopRow);
    bottomAnimationFrameId = requestAnimationFrame(animateBottomRow);

    // Pause on hover for top row
    const handleTopMouseEnter = () => cancelAnimationFrame(topAnimationFrameId);
    const handleTopMouseLeave = () => {
      topAnimationFrameId = requestAnimationFrame(animateTopRow);
    };

    // Pause on hover for bottom row
    const handleBottomMouseEnter = () =>
      cancelAnimationFrame(bottomAnimationFrameId);
    const handleBottomMouseLeave = () => {
      bottomAnimationFrameId = requestAnimationFrame(animateBottomRow);
    };

    topRow.addEventListener("mouseenter", handleTopMouseEnter);
    topRow.addEventListener("mouseleave", handleTopMouseLeave);
    bottomRow.addEventListener("mouseenter", handleBottomMouseEnter);
    bottomRow.addEventListener("mouseleave", handleBottomMouseLeave);

    return () => {
      cancelAnimationFrame(topAnimationFrameId);
      cancelAnimationFrame(bottomAnimationFrameId);
      topRow.removeEventListener("mouseenter", handleTopMouseEnter);
      topRow.removeEventListener("mouseleave", handleTopMouseLeave);
      bottomRow.removeEventListener("mouseenter", handleBottomMouseEnter);
      bottomRow.removeEventListener("mouseleave", handleBottomMouseLeave);
    };
  }, []);

  // Don't render if no models
  if (!models || models.length === 0) {
    return null;
  }

  // Split models into two rows
  const midpoint = Math.ceil(models.length / 2);
  const topRowModels = models.slice(0, midpoint);
  const bottomRowModels = models.slice(midpoint);

  // Create model cards for a specific row
  const createModelCards = (modelList: typeof models, copyIndex: number, rowIndex: number) =>
    modelList.map((model) => {
      // Get profile image or first portfolio image as fallback
      const imageUrl = model.profileImageURL || model.images[0]?.url;
      const displayName = model.nickName || model.name;

      return (
        <motion.div
          key={`${model.id}-${copyIndex}-row${rowIndex}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: rowIndex * 0.1 }}
          viewport={{ once: true }}
          className="group relative inline-block w-48 flex-shrink-0"
        >
          {/* Card Container - Narrower width */}
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/80 aspect-[3/4] transition-transform duration-300 group-hover:scale-105">
            {/* Model Image */}
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={displayName}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                No Image
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

            {/* Text Overlay - Enhanced gradient */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="font-heading text-white font-bold text-base whitespace-normal">
                {displayName}
              </h3>
              <p className="text-white/80 text-xs whitespace-normal capitalize">
                {model.category}
              </p>
            </div>

            {/* Always Visible Name (Mobile Friendly) - Enhanced gradient */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent sm:opacity-0 sm:group-hover:opacity-0">
              <p className="font-heading text-white font-semibold text-sm whitespace-normal">
                {displayName}
              </p>
            </div>
          </div>
        </motion.div>
      );
    });

  return (
    <section className="relative w-full py-20 sm:py-28 bg-background overflow-hidden">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12 sm:mb-16 px-6"
      >
        <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
          Featured Talents
        </h2>
        <p className="mt-4 text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
          Discover our exceptional models making waves in the industry
        </p>
      </motion.div>

      <div className="space-y-6 relative grid">
        {/* Top Row - Scrolls Right to Left */}
        <div className="overflow-hidden whitespace-nowrap">
          <div
            ref={topRowRef}
            className="inline-flex gap-4 px-6 will-change-transform"
          >
            {/* Render three copies for seamless infinite scroll */}
            <div className="inline-flex gap-4">{createModelCards(topRowModels, 0, 0)}</div>
            <div className="inline-flex gap-4">{createModelCards(topRowModels, 1, 0)}</div>
            <div className="inline-flex gap-4">{createModelCards(topRowModels, 2, 0)}</div>
          </div>
        </div>

        {/* Bottom Row - Scrolls Left to Right */}
        <div className="relative">
          <div className="overflow-hidden whitespace-nowrap">
            <div
              ref={bottomRowRef}
              className="inline-flex gap-4 px-6 will-change-transform"
            >
              {/* Render three copies for seamless infinite scroll */}
              <div className="inline-flex gap-4">{createModelCards(bottomRowModels, 0, 1)}</div>
              <div className="inline-flex gap-4">{createModelCards(bottomRowModels, 1, 1)}</div>
              <div className="inline-flex gap-4">{createModelCards(bottomRowModels, 2, 1)}</div>
            </div>
          </div>
        </div>

        {/* Enhanced Gradient Fade Edges for Top Row */}
        <div className="absolute top-0 left-0 bottom-0 w-40 sm:w-[30%] bg-gradient-to-r from-20% from-background via-70% via-background/80 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-40 sm:w-[30%] bg-gradient-to-l from-20% from-background via-70% via-background/80 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
