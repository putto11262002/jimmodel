import { CtaButton } from "@/components/ui/cta-button";
import Image from "next/image";

const heroImages = [
  "/hero/509270285_10096218013796300_6333237355584759474_n.jpg",
  "/hero/480101855_9246047398813370_8644541145928922797_n.jpg",
  "/hero/484551615_1206312098170555_8969046673892271429_n.jpg",
  "/hero/484237616_1206312421503856_4704248756636433823_n.jpg",
  "/hero/494445993_1249517910516640_6100732190923273952_n.jpg",
  "/hero/509270285_10096218013796300_6333237355584759474_n.jpg", // Placeholder - replace with new image
];

export function Hero() {
  return (
    <section className="relative w-full bg-background overflow-hidden flex items-center py-8 lg:py-20">
      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="relative z-10 flex flex-col justify-center items-center lg:items-start">
            {/* Main Heading */}
            <div className="text-center lg:text-left mb-2 lg:mb-6">
              <h1 className="text-3xl md:text-4xl lg:text-[5.5rem] font-light leading-[0.9] tracking-tight text-foreground">
                Discover
                <br className="md:hidden" /> Exceptional
                <br className="md:hidden" />{" "}
                <span className="italic font-serif">Talent</span>
              </h1>
            </div>

            {/* Description */}
            <div className="max-w-sm lg:max-w-md text-center lg:text-left mb-6 lg:mb-12">
              <p className="text-xs md:text-base lg:text-lg leading-relaxed text-muted-foreground">
                Thailand&apos;s premier modeling agency. 40+ years connecting
                talent with global opportunities.
              </p>
            </div>

            {/* CTA Button */}
            <div className="lg:hidden">
              <CtaButton href="/models" size="sm">
                View Talents
              </CtaButton>
            </div>
            <div className="hidden lg:block">
              <CtaButton href="/models">View Talents</CtaButton>
            </div>
          </div>

          {/* Right Column - Bento Box Grid */}
          <div className="relative aspect-square w-full">
            {/* Bento Grid Layout - 6 columns, 6 rows - WITH GAPS */}
            <div className="grid grid-cols-6 grid-rows-6 gap-3 h-full w-full">
              {/* Image 1: Large square (top-left) - 3 cols, 4 rows */}
              <div className="col-span-3 row-span-4 relative overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={"/hero/1.jpg"}
                  alt="Featured model 1"
                  fill
                  className="object-cover object-center"
                  preload
                  quality={90}
                  sizes="(max-width: 768px) 50vw, 30vw"
                />
              </div>

              {/* Image 3: Top-right rectangle - 3 cols, 2 rows (expanded) */}
              <div className="col-span-3 row-span-2 relative overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={"/hero/7.jpg"}
                  alt="Featured model 2"
                  fill
                  className="object-cover object-center"
                  preload
                  quality={90}
                  sizes="(max-width: 768px) 50vw, 30vw"
                />
              </div>

              {/* Image 5: Middle-right rectangle - 3 cols, 2 rows (expanded) */}
              <div className="col-span-3 row-span-2 relative overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={"/hero/4.jpg"}
                  alt="Featured model 3"
                  fill
                  className="object-cover object-center"
                  preload
                  quality={90}
                  sizes="(max-width: 768px) 50vw, 30vw"
                />
              </div>

              {/* Image 6+7: Combined bottom-left - 2 cols, 2 rows */}
              <div className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={"/hero/3.jpg"}
                  alt="Featured model 4"
                  fill
                  className="object-cover object-center"
                  preload
                  quality={90}
                  sizes="(max-width: 768px) 30vw, 20vw"
                />
              </div>

              {/* Image 8: Wide rectangle (bottom-right) - 4 cols, 2 rows */}
              <div className="col-span-4 row-span-2 relative overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={"/hero/5.jpg"}
                  alt="Featured model 5"
                  fill
                  className="object-cover object-center"
                  preload
                  quality={90}
                  sizes="(max-width: 768px) 60vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
