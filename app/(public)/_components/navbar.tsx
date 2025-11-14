"use client";

import { publicNavigation } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DesktopNav } from "./desktop-nav";
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
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-black dark:text-white group"
        >
          <span className="font-heading tracking-tight">J.I.M.</span>
        </Link>

        {/* Desktop Navigation */}
        <DesktopNav items={publicNavigation} />

        {/* Mobile Navigation */}
        <MobileNav items={publicNavigation} />
      </div>
    </header>
  );
}
