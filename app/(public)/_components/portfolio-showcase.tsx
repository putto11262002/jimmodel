"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

// Fashion Portfolio - Hero left layout
function FashionPortfolio() {
  return (
    <div className="grid grid-cols-2 grid-rows-3 gap-4 h-full w-full">
      <div className="relative overflow-hidden rounded-2xl bg-muted col-span-1 row-span-2">
        <Image
          src="/portfolio/fashion/1.jpg"
          alt="Fashion portfolio showcase 1"
          fill
          className="object-cover object-center"
          quality={90}
        />
      </div>
      <div className="relative overflow-hidden rounded-2xl bg-muted col-span-1 row-span-2">
        <Image
          src="/portfolio/fashion/4.jpg"
          alt="Fashion portfolio showcase 2"
          fill
          className="object-cover object-center"
          quality={90}
        />
      </div>
      <div className="relative overflow-hidden rounded-2xl bg-muted col-span-1 row-span-1">
        <Image
          src="/portfolio/fashion/2.jpg"
          alt="Fashion portfolio showcase 3"
          fill
          className="object-cover object-center"
          quality={90}
        />
      </div>
      <div className="relative overflow-hidden rounded-2xl bg-muted col-span-1 row-span-1">
        <Image
          src="/portfolio/fashion/3.jpg"
          alt="Fashion portfolio showcase 4"
          fill
          className="object-cover object-center"
          quality={90}
        />
      </div>
    </div>
  );
}

// Advertising Portfolio - Asymmetric Balance Layout
function AdvertisingPortfolio() {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full w-full">
      {/* Image 1 - Portrait (left column, full height) */}
      <div className="relative overflow-hidden rounded-2xl bg-muted col-span-1 row-span-2">
        <Image
          src="/portfolio/commercial/4.jpg"
          alt="Advertising campaign portrait 1"
          fill
          className="object-cover object-center"
          quality={90}
        />
      </div>

      {/* Image 2 - Hero (right column, top) */}
      <div className="relative overflow-hidden rounded-2xl bg-muted col-span-1 row-span-1">
        <Image
          src="/portfolio/commercial/2.jpg"
          alt="Featured advertising campaign"
          fill
          className="object-cover object-center"
          quality={90}
        />
      </div>

      {/* Image 3 - Landscape (right column, bottom) */}
      <div className="relative overflow-hidden rounded-2xl bg-muted col-span-1 row-span-1">
        <Image
          src="/portfolio/commercial/6.jpg"
          alt="Advertising campaign landscape"
          fill
          className="object-cover object-center"
          quality={90}
        />
      </div>
    </div>
  );
}

// Editorial Portfolio - Hero top layout
function EditorialPortfolio() {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-4 h-full w-full">
      <div className="relative overflow-hidden rounded-2xl bg-muted col-span-2 row-span-2">
        <Image
          src="/portfolio/editorial/3.jpg"
          alt="Fashion 3"
          fill
          className="Editorial portfolio showcase 3"
          quality={90}
        />
      </div>
      <div className="relative overflow-hidden rounded-2xl bg-muted col-span-1 row-span-1">
        <Image
          src="/portfolio/editorial/2.jpg"
          alt="Editorial portfolio Showcase 2"
          fill
          className="object-cover object-center"
          quality={90}
        />
      </div>
      <div className="relative overflow-hidden rounded-2xl bg-muted col-span-1 row-span-1">
        <Image
          src="/portfolio/editorial/1.jpg"
          alt="Editorial Portfolio Showcase 1"
          fill
          className="object-cover object-center"
          quality={90}
        />
      </div>
    </div>
  );
}

// TV & Media Productions - Video showcase with two rows one cell each
function TVMediaPortfolio() {
  return (
    <div className="grid grid-cols-1 grid-rows-2 gap-4 h-full w-full">
      {/* Row 1 - Video 1 */}
      <div className="relative overflow-hidden rounded-2xl bg-muted col-span-1 row-span-1">
        <video
          src="/portfolio/tv/1_optimised.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
      {/* Row 2 - Video 2 */}
      <div className="relative overflow-hidden rounded-2xl bg-muted col-span-1 row-span-1">
        <video
          src="/portfolio/tv/2_optimised.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

// Work types with their portfolio components
const workTypes: Array<{
  id: string;
  title: string;
  description: string;
  component: React.ComponentType;
}> = [
  {
    id: "fashion",
    title: "Fashion",
    description:
      "Fashion brands, fashion shows, and fashion photography capturing the latest trends",
    component: FashionPortfolio,
  },
  {
    id: "advertising",
    title: "Advertising & Commercials",
    description:
      "Print advertisements and commercial campaigns for brands that make an impact",
    component: AdvertisingPortfolio,
  },
  {
    id: "editorial",
    title: "Editorial & Print Work",
    description:
      "Magazine shoots, editorial photography, and print media storytelling",
    component: EditorialPortfolio,
  },
  {
    id: "tv-media",
    title: "TV & Media Productions",
    description:
      "Television shows, media content, and production work bringing stories to life",
    component: TVMediaPortfolio,
  },
];

export function PortfolioShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Pre-calculate all transforms at the top level (hooks must be called unconditionally)
  const transforms = workTypes.map((work, workIdx) => {
    const start = workIdx / workTypes.length;
    const end = (workIdx + 1) / workTypes.length;
    const extendedStart = Math.max(0, start - 0.1);
    const extendedEnd = Math.min(1, end + 0.1);
    const isLastImage = workIdx === workTypes.length - 1;

    // Y transform
    let y;
    if (workIdx === 0) {
      y = useTransform(scrollYProgress, [start, extendedEnd], ["0%", "-120%"]);
    } else if (isLastImage) {
      y = useTransform(
        scrollYProgress,
        [extendedStart, start + (end - start) * 0.5, end],
        ["120%", "0%", "0%"],
      );
    } else {
      y = useTransform(
        scrollYProgress,
        [extendedStart, start + (end - start) * 0.5, extendedEnd],
        ["120%", "0%", "-120%"],
      );
    }

    // Opacity transform with fade in at 30% and fade out at 70% of viewport
    let opacity;
    if (workIdx === 0) {
      // First item: starts visible, fades out at 70%
      opacity = useTransform(
        scrollYProgress,
        [
          start,
          start + (end - start) * 0.3, // Fully visible at 30%
          end - (end - start) * 0.3, // Start fade out at 70%
          extendedEnd,
        ],
        [1, 1, 1, 0],
      );
    } else if (isLastImage) {
      // Last item: fades in at 30%, stays visible
      opacity = useTransform(
        scrollYProgress,
        [
          extendedStart,
          start + (end - start) * 0.3, // Fully visible at 30%
          end,
        ],
        [0, 1, 1],
      );
    } else {
      // Middle items: fade in at 30%, visible until 70%, then fade out
      opacity = useTransform(
        scrollYProgress,
        [
          extendedStart,
          start + (end - start) * 0.3, // Fully visible at 30%
          end - (end - start) * 0.3, // Start fade out at 70%
          extendedEnd,
        ],
        [0, 1, 1, 0],
      );
    }

    return { y, opacity };
  });

  // Pre-calculate text opacity transforms
  const textTransforms = workTypes.map((work, idx) => {
    const start = idx / workTypes.length;
    const end = (idx + 1) / workTypes.length;
    const isLastItem = idx === workTypes.length - 1;

    let input;
    let output;

    if (idx === 0) {
      input = [start, start + 0.001, end - 0.001, end];
      output = [1, 1, 1, 0];
    } else if (isLastItem) {
      input = [start, start + 0.001, end];
      output = [0, 1, 1];
    } else {
      input = [start, start + 0.001, end - 0.001, end];
      output = [0, 1, 1, 0];
    }

    return useTransform(scrollYProgress, input, output);
  });

  return (
    <section className="py-16">
      {/* Portfolio Section Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
          Where Vision Meets Talent
        </h2>
        <p className="mt-4 text-base lg:text-lg leading-relaxed text-muted-foreground max-w-3xl">
          Discover the campaigns, productions, and moments that define our
          expertise across fashion, advertising, television, and editorial media
        </p>
      </div>
      <div
        ref={containerRef}
        className="w-full h-[calc(500vh-(theme(space.16)*5))]"
      >
        {/* <div className="mb-12 md:mb-16"> */}
        {/*   <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-zinc-900 dark:text-white"> */}
        {/*     Our Work */}
        {/*   </h2> */}
        {/* </div> */}
        {/* Fixed Container - stays on screen */}
        <div className="sticky top-16 left-0 h-[calc(100vh-theme(space.16))] z-10 flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex items-center justify-center">
            {/* Two Column Layout */}
            <div className="grid grid-cols-5 items-center gap-12 lg:gap-16 w-full h-full">
              {/* Left Column - Absolute positioned images (3/5) */}
              <div className="h-full col-span-3 overflow-hidden relative">
                {workTypes.map((work, workIdx) => {
                  // Use pre-calculated transforms
                  const { y, opacity } = transforms[workIdx];
                  const PortfolioComponent = work.component;

                  return (
                    <motion.div
                      key={work.id}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square"
                      style={{ opacity, y }}
                    >
                      <PortfolioComponent />
                    </motion.div>
                  );
                })}
              </div>

              {/* Right Column - Fade In/Out Text (2/5) */}
              <div className="col-span-2 flex flex-col justify-center relative h-[60vh] lg:h-[75vh]">
                {workTypes.map((work, idx) => {
                  // Use pre-calculated text opacity transform
                  const opacity = textTransforms[idx];

                  return (
                    <motion.div
                      key={work.id}
                      style={{ opacity }}
                      className="absolute inset-0 flex flex-col justify-center space-y-8"
                    >
                      {/* Title */}
                      <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-none">
                        {work.title}
                      </h3>

                      {/* Description */}
                      <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                        {work.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
