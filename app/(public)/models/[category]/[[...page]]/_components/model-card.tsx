import type { Model, ModelImage } from "@/db/schema";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ModelCardProps {
  model: Model & {
    images: ModelImage[];
  };
  className?: string;
}

export function ModelCard({ model, className }: ModelCardProps) {
  // Use profile image or first portfolio image as fallback
  const imageUrl = model.profileImageURL || model.images[0]?.url;
  const hasImage = Boolean(imageUrl);

  // Display name: use nickname if available, otherwise use full name
  const displayName = model.nickName || model.name;

  // Determine status badge: local takes priority over inTown, show "Out of Town" as default
  const statusBadge = model.local
    ? "Local"
    : model.inTown
      ? "In Town"
      : "Out of Town";

  return (
    <Link
      href={`/models/profile/${model.id}`}
      className={`group relative block rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 ${className || ""}`}
    >
      {/* Image Container - Full Card */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        {hasImage ? (
          <Image
            src={imageUrl}
            alt={displayName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="w-20 h-20 text-muted-foreground/30" strokeWidth={1.5} />
          </div>
        )}

        {/* Status Badge Overlay */}
        <div className="absolute top-3 right-3 z-10 hidden md:block">
          <span className="px-3 py-1.5 text-xs font-semibold bg-primary/95 text-primary-foreground rounded-full backdrop-blur-sm shadow-lg">
            {statusBadge}
          </span>
        </div>

        {/* Bottom Gradient Overlay with Name */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-16 pb-4 px-4">
          <h3 className="text-lg font-semibold text-white drop-shadow-lg group-hover:scale-105 transition-transform origin-bottom-left">
            {displayName}
          </h3>
        </div>
      </div>
    </Link>
  );
}
