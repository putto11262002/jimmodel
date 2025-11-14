"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type NavItem } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";

interface DesktopNavProps {
  items: NavItem[];
  className?: string;
}

export function DesktopNav({ items, className }: DesktopNavProps) {
  return (
    <nav className={cn("hidden md:flex items-center gap-1", className)}>
      {items.map((item) => {
        // If the item has children, render a dropdown
        if (item.children && item.children.length > 0) {
          return (
            <DropdownMenu key={item.label}>
              <DropdownMenuTrigger className="group flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors focus:outline-none rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900">
                {item.label}
                <ChevronDown className="size-3.5 group-data-[state=open]:rotate-180 transition-transform" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-64 p-2 border-zinc-200 dark:border-zinc-800"
                sideOffset={8}
              >
                {item.children.map((child) => (
                  <DropdownMenuItem key={child.href} asChild>
                    <Link
                      href={child.href}
                      className="flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-md cursor-pointer"
                    >
                      <span className="font-medium text-black dark:text-white">
                        {child.label}
                      </span>
                      {child.description && (
                        <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-snug">
                          {child.description}
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        // Otherwise, render a simple link
        return (
          <Link
            key={item.href}
            href={item.href}
            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
