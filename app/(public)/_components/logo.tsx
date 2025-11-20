import { cn } from "@/lib/utils";
import Image from "next/image";
import Link, { type LinkProps } from "next/link";

interface LogoProps extends Omit<LinkProps, "href"> {
  href?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({
  href = "/",
  size = "md",
  showText = true,
  className = "",
  ...linkProps
}: LogoProps) {
  const sizeMap = {
    sm: { width: 28, height: 28 },
    md: { width: 32, height: 32 },
    lg: { width: 40, height: 40 },
  };

  const textSizeMap = {
    sm: "text-[28px]",
    md: "text-[32px]",
    lg: "text-[40px]",
  };

  const dimensions = sizeMap[size];
  const textSize = textSizeMap[size];

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 font-bold text-black dark:text-white group transition-opacity hover:opacity-80 ${className}`}
      title="J.I.M. Modeling Agency - Home"
      {...linkProps}
    >
      <p
        className={cn(
          "font-semibold text-foreground flex items-baseline gap-2 tracking-tight",
          textSize,
        )}
      >
        {/* Logo SVG Image */}
        <Image
          src="/logo.svg"
          alt="J.I.M. Modeling Agency Logo"
          width={dimensions.width}
          height={dimensions.height}
          priority={true}
        />
        {showText && <span className="hidden md:block">J.I.M.</span>}
      </p>
    </Link>
  );
}
