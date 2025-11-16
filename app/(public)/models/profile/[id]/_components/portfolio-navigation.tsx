"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PortfolioNavigationProps {
  modelId: string;
  counts: {
    all: number;
    book: number;
    polaroid: number;
    composite: number;
  };
}

export function PortfolioNavigation({
  modelId,
  counts,
}: PortfolioNavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "All", href: `/models/profile/${modelId}`, count: counts.all },
    {
      label: "Book",
      href: `/models/profile/${modelId}/book`,
      count: counts.book,
    },
    {
      label: "Polaroid",
      href: `/models/profile/${modelId}/polaroid`,
      count: counts.polaroid,
    },
    {
      label: "Composite",
      href: `/models/profile/${modelId}/composite`,
      count: counts.composite,
    },
  ];

  return (
    <nav className="flex gap-2 border-b pb-4 mb-8 md:mb-10">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            scroll={false}
            className={cn(
              buttonVariants({ variant: isActive ? "outline" : "link" }),
              "font-medium",
            )}
          >
            <span>{item.label}</span>
            <span className="ml-1.5 text-xs text-muted-foreground">
              ({item.count})
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
