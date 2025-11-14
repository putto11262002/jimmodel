"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  BarChart3,
  Brain,
  Database,
  Globe,
  MessageSquare,
  Zap,
} from "lucide-react";
import { useRef } from "react";

const services = [
  {
    id: "web-dev",
    title: "Web Development",
    description:
      "Premium websites that combine stunning design with flawless performance. Built with modern frameworks and optimized for speed, accessibility, and conversion.",
    features: [
      "Responsive Design",
      "SEO Optimized",
      "Lightning Fast",
      "Accessible",
    ],
    gradient: "from-blue-500/20 via-cyan-500/20 to-transparent",
    glowColor: "bg-blue-500/30",
  },
  {
    id: "custom-apps",
    title: "Custom Web Apps",
    description:
      "Intelligent web applications powered by cutting-edge technology. From dashboards to SaaS platforms, we build scalable solutions that grow with your business.",
    features: [
      "AI Integration",
      "Real-time Data",
      "Scalable Architecture",
      "Cloud Native",
    ],
    gradient: "from-purple-500/20 via-pink-500/20 to-transparent",
    glowColor: "bg-purple-500/30",
  },
];

// Stacked Browsers (for Web Development)
function StackedBrowsers() {
  const browsers = [
    {
      name: "Portfolio",
      zIndex: 30,
      x: -20,
      y: 30,
      skeleton: (
        <div className="p-4 space-y-3 h-full">
          <div className="flex items-center justify-between pb-3 border-b border-foreground/10">
            <div className="h-3 w-24 rounded-full bg-foreground/15" />
            <div className="flex gap-2">
              <div className="h-2 w-12 rounded-full bg-foreground/10" />
              <div className="h-2 w-12 rounded-full bg-foreground/10" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-foreground/10"
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      name: "E-commerce",
      zIndex: 20,
      x: 0,
      y: 15,
      skeleton: (
        <div className="p-4 space-y-3 h-full">
          <div className="flex items-center justify-between pb-3 border-b border-foreground/10">
            <div className="h-3 w-20 rounded-full bg-foreground/15" />
            <div className="h-6 w-6 rounded-full bg-primary/20" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="aspect-square rounded-lg bg-foreground/10" />
                <div className="h-1.5 w-full rounded-full bg-foreground/8" />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      name: "Landing",
      zIndex: 10,
      x: 20,
      y: 0,
      skeleton: (
        <div className="p-4 space-y-3 h-full">
          <div className="flex items-center justify-between pb-3 border-b border-foreground/10">
            <div className="h-3 w-16 rounded-full bg-foreground/15" />
            <div className="flex gap-2">
              <div className="h-2 w-10 rounded-full bg-foreground/8" />
              <div className="h-2 w-12 rounded-full bg-foreground/8" />
            </div>
          </div>
          <div className="text-center py-6 space-y-2">
            <div className="h-5 w-2/3 mx-auto rounded-full bg-foreground/20" />
            <div className="h-2 w-1/2 mx-auto rounded-full bg-foreground/10" />
            <div className="h-6 w-24 mx-auto rounded-full bg-primary/25 mt-4" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {browsers.map((browser, index) => (
        <motion.div
          key={browser.name}
          className="absolute"
          style={{
            zIndex: browser.zIndex,
          }}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: index * 0.15,
            ease: "easeOut",
          }}
          viewport={{ once: true }}
          animate={{
            y: [0, -10, 0],
          }}
          whileHover={{
            scale: 1.05,
            zIndex: 40,
            transition: { duration: 0.2 },
          }}
        >
          <motion.div
            className="w-[360px] h-[260px] rounded-md shadow-2xl"
            style={{
              rotate: 0,
              x: browser.x,
              y: browser.y,
            }}
          >
            {/* Browser window */}
            <div className="h-full bg-white dark:bg-zinc-900 border border-foreground/10 rounded-md overflow-hidden shadow-lg">
              {/* Browser chrome */}
              <div className="h-8 bg-zinc-100 dark:bg-zinc-800 border-b border-foreground/10 flex items-center px-3 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
              </div>

              {/* Content */}
              <div className="h-[calc(100%-2rem)] bg-white dark:bg-zinc-900 overflow-hidden">
                {browser.skeleton}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

// Custom Web App Illustration with Connected Tech
function CustomAppIllustration() {
  const leftTechs = [
    {
      Icon: Brain,
      label: "AI Assistant",
      color: "bg-purple-400/30",
      lineColor: "#a78bfa",
      delay: 0,
    },
    {
      Icon: MessageSquare,
      label: "Live Chat",
      color: "bg-blue-400/30",
      lineColor: "#60a5fa",
      delay: 0.1,
    },
    {
      Icon: Database,
      label: "Database",
      color: "bg-yellow-400/30",
      lineColor: "#fbbf24",
      delay: 0.2,
    },
  ];

  const rightTechs = [
    {
      Icon: BarChart3,
      label: "Analytics",
      color: "bg-green-400/30",
      lineColor: "#4ade80",
      delay: 0.15,
    },
    {
      Icon: Globe,
      label: "API",
      color: "bg-cyan-400/30",
      lineColor: "#22d3ee",
      delay: 0.25,
    },
    {
      Icon: Zap,
      label: "Realtime",
      color: "bg-orange-400/30",
      lineColor: "#fb923c",
      delay: 0.35,
    },
  ];

  return (
    <div className="relative h-full w-full px-4">
      {/* Three Column Grid Layout */}
      <div className="grid grid-cols-[1fr_1.5fr_1fr] gap-4 items-center h-full">
        {/* Left Column - Tech Items */}
        <div className="flex flex-col justify-center gap-8">
          {leftTechs.map((tech, i) => (
            <motion.div
              key={`left-${i}`}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: tech.delay, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: tech.delay * 2,
                }}
                className="relative group"
              >
                <div
                  className={`absolute inset-0 ${tech.color} blur-xl opacity-30 rounded-2xl`}
                />
                <div className="relative px-3 py-2 rounded-xl bg-white/90 dark:bg-white/15 backdrop-blur-md border border-white/30 shadow-lg">
                  <div className="flex items-center gap-2">
                    <tech.Icon
                      className="w-4 h-4 text-foreground/70"
                      strokeWidth={2}
                    />
                    <span className="text-xs font-medium text-foreground/80 whitespace-nowrap">
                      {tech.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Center Column - Screen Skeleton (Largest) */}
        <div className="relative">
          {/* SVG for connection lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <defs>
              <linearGradient
                id="leftGradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#a78bfa", stopOpacity: 0.6 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#a78bfa", stopOpacity: 0.2 }}
                />
              </linearGradient>
              <linearGradient
                id="leftGradient2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#60a5fa", stopOpacity: 0.6 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#60a5fa", stopOpacity: 0.2 }}
                />
              </linearGradient>
              <linearGradient
                id="leftGradient3"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#fbbf24", stopOpacity: 0.6 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#fbbf24", stopOpacity: 0.2 }}
                />
              </linearGradient>
              <linearGradient
                id="rightGradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#4ade80", stopOpacity: 0.2 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#4ade80", stopOpacity: 0.6 }}
                />
              </linearGradient>
              <linearGradient
                id="rightGradient2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#22d3ee", stopOpacity: 0.2 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#22d3ee", stopOpacity: 0.6 }}
                />
              </linearGradient>
              <linearGradient
                id="rightGradient3"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#fb923c", stopOpacity: 0.2 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#fb923c", stopOpacity: 0.6 }}
                />
              </linearGradient>
            </defs>

            {/* Left side connections */}
            <motion.line
              x1="0"
              y1="20%"
              x2="50%"
              y2="35%"
              stroke="url(#leftGradient1)"
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            />
            <motion.line
              x1="0"
              y1="50%"
              x2="50%"
              y2="50%"
              stroke="url(#leftGradient2)"
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            />
            <motion.line
              x1="0"
              y1="80%"
              x2="50%"
              y2="65%"
              stroke="url(#leftGradient3)"
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            />

            {/* Right side connections */}
            <motion.line
              x1="50%"
              y1="35%"
              x2="100%"
              y2="20%"
              stroke="url(#rightGradient1)"
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              viewport={{ once: true }}
            />
            <motion.line
              x1="50%"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke="url(#rightGradient2)"
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              viewport={{ once: true }}
            />
            <motion.line
              x1="50%"
              y1="65%"
              x2="100%"
              y2="80%"
              stroke="url(#rightGradient3)"
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              viewport={{ once: true }}
            />
          </svg>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="bg-white/40 dark:bg-black/15 backdrop-blur-md rounded-2xl border-2 border-white/30 p-4 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-foreground/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-400/30" />
                  <div className="h-2 w-20 rounded-full bg-foreground/20" />
                </div>
                <div className="flex gap-1">
                  <div className="w-5 h-5 rounded-full bg-foreground/10" />
                  <div className="w-5 h-5 rounded-full bg-foreground/10" />
                </div>
              </div>

              {/* Main content */}
              <div className="mt-3 space-y-3">
                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "bg-purple-400/20",
                    "bg-blue-400/20",
                    "bg-green-400/20",
                  ].map((color, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-lg ${color} space-y-1`}
                    >
                      <div className="h-1.5 w-10 rounded-full bg-foreground/30" />
                      <div className="h-2.5 w-7 rounded-full bg-foreground/40" />
                    </div>
                  ))}
                </div>

                {/* Chart area */}
                <div className="h-16 rounded-lg bg-foreground/5 p-2">
                  <div className="h-full flex items-end gap-0.5">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-purple-400/30 rounded-t"
                      />
                    ))}
                  </div>
                </div>

                {/* Table rows */}
                <div className="space-y-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-1">
                      <div className="h-1.5 flex-1 rounded-full bg-foreground/10" />
                      <div className="h-1.5 flex-1 rounded-full bg-foreground/10" />
                      <div className="h-1.5 flex-1 rounded-full bg-foreground/10" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-purple-500/20 blur-2xl -z-10 rounded-2xl" />
          </motion.div>
        </div>

        {/* Right Column - Tech Items */}
        <div className="flex flex-col justify-center gap-8">
          {rightTechs.map((tech, i) => (
            <motion.div
              key={`right-${i}`}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: tech.delay, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: tech.delay * 2,
                }}
                className="relative group"
              >
                <div
                  className={`absolute inset-0 ${tech.color} blur-xl opacity-30 rounded-2xl`}
                />
                <div className="relative px-3 py-2 rounded-xl bg-white/90 dark:bg-white/15 backdrop-blur-md border border-white/30 shadow-lg">
                  <div className="flex items-center gap-2">
                    <tech.Icon
                      className="w-4 h-4 text-foreground/70"
                      strokeWidth={2}
                    />
                    <span className="text-xs font-medium text-foreground/80 whitespace-nowrap">
                      {tech.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Service card component
function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const isReversed = index % 2 !== 0;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} className="relative py-24 md:py-32">
      {/* Ambient gradient glow */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial ${service.gradient} blur-3xl opacity-50`}
        />
      </motion.div>

      {/* Content grid */}
      <div
        className={`relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center ${
          isReversed ? "md:grid-flow-dense" : ""
        }`}
      >
        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className={`space-y-6 ${isReversed ? "md:col-start-2" : ""}`}
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-white/20">
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-foreground/70">
                Service {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight"
          >
            {service.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-base lg:text-lg leading-relaxed text-foreground/70 max-w-xl"
          >
            {service.description}
          </motion.p>

          {/* Features list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-3 pt-4"
          >
            {service.features.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                viewport={{ once: true }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-sm border border-white/20 text-sm font-medium text-foreground/80"
              >
                {feature}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Illustration/Visual */}
        <motion.div
          style={{ y }}
          className={`relative ${isReversed ? "md:col-start-1 md:row-start-1" : ""}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative h-[400px] md:h-[500px] flex items-center justify-center"
          >
            {index === 0 ? <StackedBrowsers /> : <CustomAppIllustration />}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 sm:py-32 bg-white dark:bg-black overflow-hidden"
    >
      {/* Section container */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20 md:mb-32 space-y-4"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
            What We Build
          </h2>
          <p className="text-base lg:text-lg text-foreground/60 max-w-2xl mx-auto">
            Premium digital solutions designed to elevate your brand and drive
            measurable results
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="space-y-0">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
