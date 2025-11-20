import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { type ComponentProps } from "react";

const ctaButtonVariants = cva(
  "group inline-flex items-center gap-2.5 rounded-full font-medium transition-all duration-300 hover:opacity-90",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline:
          "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
      },
      size: {
        default:
          "px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base hover:gap-4 sm:hover:gap-5",
        sm: "px-4 py-2 text-xs hover:gap-3.5 border-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface CtaButtonProps
  extends Omit<ComponentProps<typeof Link>, "className">,
    VariantProps<typeof ctaButtonVariants> {
  children: React.ReactNode;
  /**
   * Optional additional classes to apply to the button
   */
  className?: string;
}

/**
 * A reusable call-to-action button component with consistent styling
 * and responsive design. Used across hero and CTA sections.
 *
 * Features:
 * - Responsive padding and icon sizing
 * - Animated arrow that moves on hover
 * - Rounded pill shape with primary color scheme
 * - Smooth transitions
 * - Size variants: default, sm
 * - Variant types: default, outline
 */
export function CtaButton({
  children,
  className,
  variant,
  size,
  ...props
}: CtaButtonProps) {
  const iconSize = size === "sm" ? "w-4 h-4" : "w-4 h-4 sm:w-5 sm:h-5";

  return (
    <Link
      {...props}
      className={cn(ctaButtonVariants({ variant, size }), className)}
    >
      <span>{children}</span>
      <ArrowRight
        className={cn(iconSize, "transition-transform duration-300")}
      />
    </Link>
  );
}
