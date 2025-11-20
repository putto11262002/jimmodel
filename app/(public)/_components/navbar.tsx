"use client";

import { publicNavigation } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";
import { DesktopNav } from "./desktop-nav";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/60",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6 sm:px-8">
        {/* Logo / Brand */}
        <Logo size="md" showText={false} />

        {/* Desktop Navigation */}
        <DesktopNav items={publicNavigation} />

        {/* Mobile Navigation */}
        <MobileNav items={publicNavigation} />
      </div>
    </header>
  );
}
