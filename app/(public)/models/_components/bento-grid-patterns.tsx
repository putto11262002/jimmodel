import Image from "next/image";
import type { ModelImage } from "@/lib/core/models/types";

interface BentoImageProps {
  image?: ModelImage & { modelName?: string };
  alt: string;
}

function BentoImageItem({ image, alt }: BentoImageProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-muted w-full h-full">
      {image?.url ? (
        <Image
          src={image.url}
          alt={alt}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 1024px) 50vw, 40vw"
          quality={85}
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

// Pattern 1 - Female (Hero-inspired): grid-cols-6 grid-rows-6
export function Pattern1Female({ images }: { images: (ModelImage & { modelName?: string })[] }) {
  return (
    <div className="hidden lg:grid grid-cols-6 grid-rows-6 gap-3 h-full w-full">
      {/* Large left - col-span-3 row-span-4 */}
      <div className="col-span-3 row-span-4">
        <BentoImageItem image={images[0]} alt={images[0]?.modelName || "Model"} />
      </div>

      {/* Top right - col-span-3 row-span-2 */}
      <div className="col-span-3 row-span-2">
        <BentoImageItem image={images[1]} alt={images[1]?.modelName || "Model"} />
      </div>

      {/* Middle right - col-span-3 row-span-2 */}
      <div className="col-span-3 row-span-2">
        <BentoImageItem image={images[2]} alt={images[2]?.modelName || "Model"} />
      </div>

      {/* Bottom left - col-span-2 row-span-2 */}
      <div className="col-span-2 row-span-2">
        <BentoImageItem image={images[3]} alt={images[3]?.modelName || "Model"} />
      </div>

      {/* Bottom wide - col-span-4 row-span-2 */}
      <div className="col-span-4 row-span-2">
        <BentoImageItem image={images[4]} alt={images[4]?.modelName || "Model"} />
      </div>
    </div>
  );
}

// Mobile fallback for Pattern 1
export function Pattern1FeatureMobile({ images }: { images: (ModelImage & { modelName?: string })[] }) {
  return (
    <div className="lg:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4">
      {images.slice(0, 4).map((image, idx) => (
        <div
          key={idx}
          className="flex-shrink-0 w-32 h-48 snap-start"
        >
          <BentoImageItem image={image} alt={image.modelName || "Model"} />
        </div>
      ))}
    </div>
  );
}

// Pattern 2 - Male: grid-cols-2 grid-rows-3
export function Pattern2Male({ images }: { images: (ModelImage & { modelName?: string })[] }) {
  return (
    <div className="hidden lg:grid grid-cols-2 grid-rows-3 gap-3 h-full w-full">
      {/* Left portrait - col-span-1 row-span-2 */}
      <div className="col-span-1 row-span-2">
        <BentoImageItem image={images[0]} alt={images[0]?.modelName || "Model"} />
      </div>

      {/* Right portrait - col-span-1 row-span-2 */}
      <div className="col-span-1 row-span-2">
        <BentoImageItem image={images[1]} alt={images[1]?.modelName || "Model"} />
      </div>

      {/* Bottom left - col-span-1 row-span-1 */}
      <div className="col-span-1 row-span-1">
        <BentoImageItem image={images[2]} alt={images[2]?.modelName || "Model"} />
      </div>

      {/* Bottom right - col-span-1 row-span-1 */}
      <div className="col-span-1 row-span-1">
        <BentoImageItem image={images[3]} alt={images[3]?.modelName || "Model"} />
      </div>
    </div>
  );
}

// Mobile fallback for Pattern 2
export function Pattern2MaleMobile({ images }: { images: (ModelImage & { modelName?: string })[] }) {
  return (
    <div className="lg:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4">
      {images.slice(0, 4).map((image, idx) => (
        <div
          key={idx}
          className="flex-shrink-0 w-32 h-48 snap-start"
        >
          <BentoImageItem image={image} alt={image.modelName || "Model"} />
        </div>
      ))}
    </div>
  );
}

// Pattern 3 - Non-Binary: grid-cols-3 grid-rows-2
export function Pattern3NonBinary({ images }: { images: (ModelImage & { modelName?: string })[] }) {
  return (
    <div className="hidden lg:grid grid-cols-3 grid-rows-2 gap-3 h-full w-full">
      {/* Large hero left - col-span-2 row-span-2 */}
      <div className="col-span-2 row-span-2">
        <BentoImageItem image={images[0]} alt={images[0]?.modelName || "Model"} />
      </div>

      {/* Top right - col-span-1 row-span-1 */}
      <div className="col-span-1 row-span-1">
        <BentoImageItem image={images[1]} alt={images[1]?.modelName || "Model"} />
      </div>

      {/* Bottom right - col-span-1 row-span-1 */}
      <div className="col-span-1 row-span-1">
        <BentoImageItem image={images[2]} alt={images[2]?.modelName || "Model"} />
      </div>
    </div>
  );
}

// Mobile fallback for Pattern 3
export function Pattern3NonBinaryMobile({ images }: { images: (ModelImage & { modelName?: string })[] }) {
  return (
    <div className="lg:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4">
      {images.slice(0, 3).map((image, idx) => (
        <div
          key={idx}
          className="flex-shrink-0 w-32 h-48 snap-start"
        >
          <BentoImageItem image={image} alt={image.modelName || "Model"} />
        </div>
      ))}
    </div>
  );
}

// Pattern 4 - Kids (Playful Grid): grid-cols-4 grid-rows-4
export function Pattern4Kids({ images }: { images: (ModelImage & { modelName?: string })[] }) {
  return (
    <div className="hidden lg:grid grid-cols-4 grid-rows-4 gap-3 h-full w-full">
      {/* Top left - col-span-2 row-span-2 */}
      <div className="col-span-2 row-span-2">
        <BentoImageItem image={images[0]} alt={images[0]?.modelName || "Model"} />
      </div>

      {/* Top right - col-span-2 row-span-2 */}
      <div className="col-span-2 row-span-2">
        <BentoImageItem image={images[1]} alt={images[1]?.modelName || "Model"} />
      </div>

      {/* Bottom left - col-span-2 row-span-2 */}
      <div className="col-span-2 row-span-2">
        <BentoImageItem image={images[2]} alt={images[2]?.modelName || "Model"} />
      </div>

      {/* Bottom right - col-span-2 row-span-2 */}
      <div className="col-span-2 row-span-2">
        <BentoImageItem image={images[3]} alt={images[3]?.modelName || "Model"} />
      </div>
    </div>
  );
}

// Mobile fallback for Pattern 4
export function Pattern4KidsMobile({ images }: { images: (ModelImage & { modelName?: string })[] }) {
  return (
    <div className="lg:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4">
      {images.slice(0, 4).map((image, idx) => (
        <div
          key={idx}
          className="flex-shrink-0 w-32 h-48 snap-start"
        >
          <BentoImageItem image={image} alt={image.modelName || "Model"} />
        </div>
      ))}
    </div>
  );
}

// Pattern 5 - Seniors (Asymmetric Balance): grid-cols-3 grid-rows-3
export function Pattern5Seniors({ images }: { images: (ModelImage & { modelName?: string })[] }) {
  return (
    <div className="hidden lg:grid grid-cols-3 grid-rows-3 gap-3 h-full w-full">
      {/* Left tall - col-span-2 row-span-3 */}
      <div className="col-span-2 row-span-3">
        <BentoImageItem image={images[0]} alt={images[0]?.modelName || "Model"} />
      </div>

      {/* Top right - col-span-1 row-span-1 */}
      <div className="col-span-1 row-span-1">
        <BentoImageItem image={images[1]} alt={images[1]?.modelName || "Model"} />
      </div>

      {/* Middle right - col-span-1 row-span-1 */}
      <div className="col-span-1 row-span-1">
        <BentoImageItem image={images[2]} alt={images[2]?.modelName || "Model"} />
      </div>

      {/* Bottom right - col-span-1 row-span-1 */}
      <div className="col-span-1 row-span-1">
        <BentoImageItem image={images[3]} alt={images[3]?.modelName || "Model"} />
      </div>
    </div>
  );
}

// Mobile fallback for Pattern 5
export function Pattern5SeniorsMobile({ images }: { images: (ModelImage & { modelName?: string })[] }) {
  return (
    <div className="lg:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4">
      {images.slice(0, 4).map((image, idx) => (
        <div
          key={idx}
          className="flex-shrink-0 w-32 h-48 snap-start"
        >
          <BentoImageItem image={image} alt={image.modelName || "Model"} />
        </div>
      ))}
    </div>
  );
}
