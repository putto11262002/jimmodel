"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PortfolioImageGrid } from "./portfolio-image-grid";
import type { getModel } from "@/lib/core/models/service";

type Model = Awaited<ReturnType<typeof getModel>>;
type PortfolioImage = Model["images"][number];

type ImageType = "all" | "book" | "polaroid" | "composite";

interface PortfolioTabsProps {
  images: PortfolioImage[];
  modelName: string;
  counts: {
    all: number;
    book: number;
    polaroid: number;
    composite: number;
  };
}

export function PortfolioTabs({
  images,
  modelName,
  counts,
}: PortfolioTabsProps) {
  const [activeTab, setActiveTab] = useState<ImageType>("all");

  const tabs = [
    { label: "All", value: "all" as ImageType, count: counts.all },
    { label: "Book", value: "book" as ImageType, count: counts.book },
    {
      label: "Polaroid",
      value: "polaroid" as ImageType,
      count: counts.polaroid,
    },
    {
      label: "Composite",
      value: "composite" as ImageType,
      count: counts.composite,
    },
  ];

  // Filter images based on active tab
  const filteredImages =
    activeTab === "all"
      ? images
      : images.filter((img) => img.type === activeTab);

  const activeTab_obj = tabs.find((t) => t.value === activeTab);

  return (
    <div>
      {/* Mobile Dropdown */}
      <div className="mb-6 md:hidden">
        <Select value={activeTab} onValueChange={(value) => setActiveTab(value as ImageType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {tabs.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                {tab.label} ({tab.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Tab Navigation */}
      <div className="hidden md:block overflow-x-auto">
        <nav className="flex gap-2 border-b pb-4 mb-8 md:mb-10 whitespace-nowrap">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;

            return (
              <Button
                key={tab.value}
                variant={isActive ? "outline" : "link"}
                onClick={() => setActiveTab(tab.value)}
                className="font-medium flex-shrink-0"
              >
                <span>{tab.label}</span>
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({tab.count})
                </span>
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Image Grid */}
      <div className="min-h-[400px]">
        <PortfolioImageGrid
          images={filteredImages}
          modelName={modelName}
          imageType={activeTab === "all" ? undefined : activeTab}
        />
      </div>
    </div>
  );
}
