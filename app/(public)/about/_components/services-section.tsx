"use client";

import { useEffect, useRef, useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { Award, Globe, LucideIcon, Camera, Images } from "lucide-react";


// ============================================================================
// ServiceCard Component
// ============================================================================

/**
 * A service item card with animated entry and icon display.
 *
 * Features:
 * - Icon selection from predefined Lucide React icons
 * - Foreground color outline icon container
 * - Ref forwarding for connector line animation
 *
 * @example
 * <ServiceCard
 *   ref={cardRef}
 *   iconName="Award"
 *   title="Model Representation"
 *   description="Full-service talent representation..."
 *   index={0}
 * />
 */
interface ServiceCardProps {
  /** Icon name to display (must be in iconMap) */
  iconName: "Award" | "Globe" | "Camera" | "Images";
  /** Service title */
  title: string;
  /** Service description */
  description: string;
  /** Card index for staggered animation delay */
  index: number;
}

const iconMap: Record<string, LucideIcon> = {
  Award,
  Globe,
  Camera,
  Images,
};

const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ iconName, title, description, index }, ref) => {
    const Icon = iconMap[iconName];

    return (
      <div className="flex gap-6">
        <div className="flex-shrink-0">
          <div
            ref={ref}
            className="flex items-center justify-center h-12 w-12 rounded-lg border"
          >
            <Icon className="w-6 h-6 text-foreground" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    );
  },
);

ServiceCard.displayName = "ServiceCard";

// ============================================================================
// ServiceCardsConnector Component
// ============================================================================

interface ServiceCardsConnectorProps {
  /** Array of refs pointing to the service card elements */
  cardRefs: React.RefObject<HTMLDivElement | null>[];
  /** Ref to the container holding the cards */
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Draws animated connector lines between service cards.
 *
 * Features:
 * - Vertical lines connecting icon bottom border to next icon top border
 * - Lines animate from top to bottom on scroll using pathLength
 * - Solid foreground color
 * - Animates once using Framer Motion's pathLength
 *
 * @example
 * <ServiceCardsConnector cardRefs={[ref1, ref2, ref3, ref4]} containerRef={containerRef} />
 */
function ServiceCardsConnector({
  cardRefs,
  containerRef,
}: ServiceCardsConnectorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pathSegments, setPathSegments] = useState<string[]>([]);
  const [viewBox, setViewBox] = useState("0 0 100 100");

  useEffect(() => {
    const updateConnector = () => {
      if (!containerRef.current) return;

      // Get container's position and dimensions
      const containerRect = containerRef.current.getBoundingClientRect();

      // Get icon positions (top and bottom borders)
      const iconBorders = cardRefs
        .map((ref) => {
          if (!ref.current) return null;

          // ref.current already points to the icon container div
          const rect = ref.current.getBoundingClientRect();
          const x = rect.left - containerRect.left + rect.width / 2;
          const topY = rect.top - containerRect.top; // Top border
          const bottomY = rect.bottom - containerRect.top; // Bottom border

          return { x, topY, bottomY };
        })
        .filter((pos) => pos !== null) as Array<{
        x: number;
        topY: number;
        bottomY: number;
      }>;

      if (iconBorders.length < 2) return;

      // Build individual path segments (one per connector line)
      const segments: string[] = [];

      // Connect each icon's bottom to the next icon's top
      for (let i = 0; i < iconBorders.length - 1; i++) {
        const currentIcon = iconBorders[i];
        const nextIcon = iconBorders[i + 1];

        // Line from current icon bottom center to next icon top center
        const segment = `M ${currentIcon.x} ${currentIcon.bottomY} L ${nextIcon.x} ${nextIcon.topY}`;
        segments.push(segment);
      }

      setPathSegments(segments);

      // Set viewBox to match the full container dimensions
      // This prevents coordinate scaling issues
      setViewBox(`0 0 ${containerRect.width} ${containerRect.height}`);
    };

    const timeoutId = setTimeout(updateConnector, 300);
    window.addEventListener("resize", updateConnector);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateConnector);
    };
  }, [cardRefs, containerRef]);

  if (pathSegments.length === 0) return null;

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ overflow: "visible" }}
    >
      {pathSegments.map((pathData, index) => (
        <motion.path
          key={index}
          d={pathData}
          fill="none"
          stroke="currentColor"
          className="text-border"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{
            duration: 0.6,
            delay: index * 0.4,
            ease: "easeInOut",
          }}
          viewport={{ once: true, margin: "-100px" }}
        />
      ))}
    </svg>
  );
}

// ============================================================================
// ServicesSection Main Component
// ============================================================================

export function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const services = [
    {
      iconName: "Award" as const,
      title: "Professional Model Representation",
      description:
        "Full-service representation for men, women, kids, seniors, and diverse talent. We handle bookings, contracts, and portfolio development with professionalism and care.",
    },
    {
      iconName: "Globe" as const,
      title: "International Talent Scouting",
      description:
        "Our network spans 5 continents. We discover emerging talent and connect them with opportunities that match their unique strengths and aspirations.",
    },
    {
      iconName: "Camera" as const,
      title: "Casting & Booking Services",
      description:
        "Expert casting solutions for fashion brands, advertising agencies, TV productions, and media companies. Seamless booking processes from inquiry to final placement.",
    },
    {
      iconName: "Images" as const,
      title: "Portfolio & Composite Services",
      description:
        "Professional portfolio management, polaroid photography, and composite card creation—everything your model needs to succeed in the industry.",
    },
  ];

  return (
    <section className="w-full py-16 lg:py-24 px-6 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-light mb-16">
          What We Offer
        </h2>

        <div ref={containerRef} className="relative space-y-8">
          <ServiceCardsConnector cardRefs={cardRefs} containerRef={containerRef} />

          {services.map((service, idx) => (
            <ServiceCard
              key={idx}
              ref={cardRefs[idx]}
              iconName={service.iconName}
              title={service.title}
              description={service.description}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
