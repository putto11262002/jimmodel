"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EditModelSidebarProps {
  modelId: string;
}

export function EditModelSidebar({ modelId }: EditModelSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Basic Information",
      href: `/admin/models/${modelId}/basic-info`,
    },
    {
      label: "Physical Attributes",
      href: `/admin/models/${modelId}/physical`,
    },
    {
      label: "Career Details",
      href: `/admin/models/${modelId}/career`,
    },
    {
      label: "Profile Image",
      href: `/admin/models/${modelId}/profile-image`,
    },
    {
      label: "Portfolio Images",
      href: `/admin/models/${modelId}/portfolio-images`,
    },
    {
      label: "Status & Publication",
      href: `/admin/models/${modelId}/status`,
    },
  ];

  return (
    <aside className="lg:w-80 shrink-0">
      <div className="sticky top-6 space-y-6">
        {/* Navigation */}
        <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "justify-start",
                    isActive && "bg-muted font-medium"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    {item.label}
                  </Link>
                </Button>
              );
            })}
        </nav>
      </div>
    </aside>
  );
}
