"use client";

import { Separator } from "@/components/ui/separator";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const typewriterWords = ["Excellence", "Talent", "Innovation", "Success"];
const locations = ["Thailand", "USA", "Europe", "Brazil", "Canada", "Global"];

export function TrustIndicators() {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [locationIndex, setLocationIndex] = useState(0);
  const [yearsDisplay, setYearsDisplay] = useState(0);
  const [modelsDisplay, setModelsDisplay] = useState(0);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const yearsCount = useMotionValue(0);
  const modelsCount = useMotionValue(0);

  const yearsSpring = useSpring(yearsCount, { duration: 2000 });
  const modelsSpring = useSpring(modelsCount, { duration: 2000 });

  // Typewriter effect
  useEffect(() => {
    const currentWord = typewriterWords[wordIndex];

    if (currentIndex < currentWord.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentWord[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedText("");
        setCurrentIndex(0);
        setWordIndex((prev) => (prev + 1) % typewriterWords.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, wordIndex]);

  // Subscribe to motion values and update display state
  useEffect(() => {
    const unsubscribeYears = yearsSpring.on("change", (latest) => {
      setYearsDisplay(Math.round(latest));
    });
    const unsubscribeModels = modelsSpring.on("change", (latest) => {
      setModelsDisplay(Math.round(latest));
    });

    return () => {
      unsubscribeYears();
      unsubscribeModels();
    };
  }, [yearsSpring, modelsSpring]);

  // Number counting animation
  useEffect(() => {
    if (isInView) {
      yearsCount.set(40);
      modelsCount.set(500);
    }
  }, [isInView, yearsCount, modelsCount]);

  // Location rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setLocationIndex((prev) => (prev + 1) % locations.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full py-20 bg-background overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Mission & Stats */}
          <div className="space-y-12 text-center">
            {/* Mission Statement */}
            <div>
              <p className="text-xs lg:text-base uppercase tracking-[0.15em] text-muted-foreground mb-2">
                Our Mission
              </p>
              <div className=" h-[3.5rem] lg:h-auto">
                <h2 className="text-xl sm:text-4xl lg:text-5xl font-light leading-tight text-foreground mb-4">
                  Connecting exceptional talent with global opportunities
                  through{" "}
                  <span className="relative inline-block">
                    <span className="text-foreground font-medium italic">
                      {displayedText}
                    </span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="inline-block w-0.5 h-[0.9em] bg-foreground ml-0.5 align-middle"
                    />
                  </span>
                </h2>
              </div>
            </div>
            <Separator />

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
              <div>
                <p className="text-2xl sm:text-4xl lg:text-5xl font-light text-foreground mb-1 sm:mb-2">
                  {yearsDisplay}+
                </p>
                <p className="text-[0.625rem] sm:text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Years of Excellence
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl lg:text-5xl font-light text-foreground mb-1 sm:mb-2">
                  {modelsDisplay}+
                </p>
                <p className="text-[0.625rem] sm:text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Professional Models
                </p>
              </div>
              <div>
                <motion.p
                  key={locationIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl sm:text-4xl lg:text-5xl font-light text-foreground mb-1 sm:mb-2"
                >
                  {locations[locationIndex]}
                </motion.p>
                <p className="text-[0.625rem] sm:text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Network Reach
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
