"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navigationSections = [
  {
    title: "Foundation",
    items: [
      { name: "Colors", href: "/design-system/colors" },
      { name: "Typography", href: "/design-system/typography", soon: true },
      { name: "Spacing", href: "/design-system/spacing", soon: true },
      { name: "Shadows", href: "/design-system/shadows", soon: true },
    ],
  },
  {
    title: "Components",
    items: [
      { name: "Buttons", href: "/design-system/buttons" },
      { name: "Forms", href: "/design-system/forms", soon: true },
      { name: "Cards", href: "/design-system/cards", soon: true },
      { name: "Dialogs", href: "/design-system/dialogs", soon: true },
      { name: "Navigation", href: "/design-system/navigation", soon: true },
    ],
  },
  {
    title: "Patterns",
    items: [
      { name: "Layouts", href: "/design-system/layouts", soon: true },
      {
        name: "Data Display",
        href: "/design-system/data-display",
        soon: true,
      },
      { name: "Feedback", href: "/design-system/feedback", soon: true },
      {
        name: "Forms & Validation",
        href: "/design-system/forms-validation",
        soon: true,
      },
    ],
  },
  {
    title: "Guidelines",
    items: [
      {
        name: "Accessibility",
        href: "/design-system/accessibility",
        soon: true,
      },
      {
        name: "Best Practices",
        href: "/design-system/best-practices",
        soon: true,
      },
      {
        name: "Code Standards",
        href: "/design-system/code-standards",
        soon: true,
      },
    ],
  },
];

function DesignSystemSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link href="/design-system/buttons" className="block">
          <h1 className="text-lg font-bold">Design System</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Components & Guidelines
          </p>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {navigationSections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    {item.soon ? (
                      <SidebarMenuButton disabled className="cursor-not-allowed">
                        <span>{item.name}</span>
                        <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
                          Soon
                        </span>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                      >
                        <Link href={item.href}>{item.name}</Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DesignSystemSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
