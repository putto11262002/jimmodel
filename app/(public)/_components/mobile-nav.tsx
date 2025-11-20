"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { type NavItem } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "./logo";

interface MobileNavProps {
  items: NavItem[];
  className?: string;
}

export function MobileNav({ items, className }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const handleLinkClick = () => {
    setOpen(false);
    setExpandedItems(new Set());
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className={cn(
            "md:hidden p-2 -mr-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors",
            className,
          )}
          aria-label="Open navigation menu"
        >
          <Menu className="size-6" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md border-zinc-200 dark:border-zinc-800 p-0"
      >
        <SheetHeader className="px-6 py-6 border-b border-zinc-200 dark:border-zinc-800 space-y-0">
          <SheetTitle asChild>
            <Logo size="md" showText={true} onClick={handleLinkClick} />
          </SheetTitle>
        </SheetHeader>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4">
          {items.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.has(item.label);

            return (
              <div key={item.label} className="flex flex-col">
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.label)}
                      className="flex items-center justify-between w-full px-4 py-3.5 text-base font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                    >
                      <span>{item.label}</span>
                      <ChevronRight
                        className={cn(
                          "size-4 text-zinc-600 dark:text-zinc-400 transition-transform duration-200",
                          isExpanded && "rotate-90",
                        )}
                      />
                    </button>
                    {isExpanded && (
                      <div className="flex flex-col gap-0.5 mt-1 ml-2 pl-4 border-l-2 border-zinc-200 dark:border-zinc-800">
                        {item.children!.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={handleLinkClick}
                            className="flex flex-col gap-1 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                          >
                            <span className="text-sm font-medium text-black dark:text-white">
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {child.description}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className="flex items-center px-4 py-3.5 text-base font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
