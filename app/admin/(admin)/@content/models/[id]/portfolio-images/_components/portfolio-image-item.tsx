"use client";

import Image from "next/image";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PortfolioImageItemProps {
  image: {
    id: string;
    url: string;
    type?: string | null;
  };
  index: number;
  isDragging: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function PortfolioImageItem({
  image,
  index,
  isDragging,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDelete,
  isDeleting,
}: PortfolioImageItemProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-lg border bg-muted/20 transition-all",
        "hover:border-primary/50 hover:shadow-md",
        "cursor-move",
        isDragging && "opacity-50 scale-95"
      )}
    >
      {/* Image */}
      <Image
        src={image.url}
        alt={`Portfolio image ${index + 1}`}
        fill
        className="object-cover"
      />

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />

      {/* Index badge */}
      <div className="absolute top-2 left-2 z-10">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-medium shadow-sm">
          {index + 1}
        </div>
      </div>

      {/* Type badge */}
      {image.type && (
        <div className="absolute bottom-2 left-2 z-10">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm shadow-sm">
            {image.type.charAt(0).toUpperCase() + image.type.slice(1)}
          </Badge>
        </div>
      )}

      {/* Delete button */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="destructive"
          className="h-8 w-8 shadow-sm"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
