import { Metadata } from "next";

import { ServicesSection } from "@/app/(public)/about/_components/services-section";
import { cacheComponentConfig } from "@/config/cache-component";
import { cacheLife, cacheTag } from "next/cache";

export const metadata: Metadata = {
  title: "About J.I.M.",
  description:
    "Discover J.I.M. Modeling Agency's 40-year journey. From founder's vision to Asia's premier talent management partner.",
  keywords: [
    "J.I.M. Modeling Agency Story",
    "modeling agency Bangkok",
    "talent transformation",
    "modeling industry leader",
    "Sukumaporn S Jim",
  ],
  openGraph: {
    title: "About J.I.M.",
    description:
      "Discover J.I.M. Modeling Agency's 40-year journey. From founder's vision to Asia's premier talent management partner.",
    type: "website",
    locale: "en_US",
  },
};

export default async function AboutPage() {
  "use cache";
  cacheLife(cacheComponentConfig.aboutPage.profile);
  cacheTag(...cacheComponentConfig.aboutPage.tag);
  return (
    <>
      <main className="w-full bg-background">
        {/* Minimal Hero */}
        <section className="w-full py-12 lg:py-20 px-6 sm:px-8 border-b border-border">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-semibold text-primary mb-4 uppercase tracking-wide">
              Since 1984
            </p>
            <h1 className="text-4xl lg:text-5xl font-light leading-tight mb-4">
              Talent Meets Opportunity
            </h1>
            <p className="text-lg text-muted-foreground">
              The story of J.I.M. Modeling Agency and how we became Asia&apos;s
              most trusted partner in talent management and discovery.
            </p>
          </div>
        </section>

        {/* Founder's Vision - Narrative Section */}
        <section className="w-full py-16 lg:py-24 px-6 sm:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Founded on a Vision
            </h2>

            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                In 1984, Sukumaporn S. (Jim) envisioned something revolutionary
                for the modeling industry in Asia. At a time when talent
                management was fragmented and opportunities were limited, Jim
                established J.I.M. Modeling Agency with a simple but powerful
                philosophy:{" "}
                <span className="text-foreground font-semibold italic">
                  &quot;Create lasting relationships and services tailored to
                  meet individual needs.&quot;
                </span>
              </p>

              <p>
                This wasn&apos;t just about finding models or booking shoots. It
                was about transforming lives—opening doors for Thai talent to
                compete on the global stage while bringing world-class
                international models to Asian markets. What started as a local
                agency quickly evolved into a continental operation with
                scouting networks spanning Asia, North America, and Europe.
              </p>

              <p>
                Over four decades, J.I.M. has cultivated relationships with
                major international brands, prestigious production houses, and
                emerging talent worldwide. We&apos;ve built a reputation not
                just for finding beautiful faces, but for identifying and
                nurturing genuine talent with potential to transform careers.
              </p>

              <p>
                Today, with 40+ years of industry experience and a portfolio of
                500+ models, J.I.M. Modeling Agency stands as Thailand&apos;s
                premier talent management company—trusted by clients,
                representing models, and transforming the industry one
                opportunity at a time.
              </p>
            </div>
          </div>
        </section>

        {/* Services Showcase with Connector */}
        <ServicesSection />

        {/* Global Presence Section */}
        <section className="w-full py-16 lg:py-24 px-6 sm:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-light mb-8">
              Global Reach, Local Touch
            </h2>

            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                Based in Bangkok, our headquarters serves as the nerve center of
                a continental operation. With representatives and scouting
                partners across Asia, Canada, the USA, Europe, and Brazil, we
                bring a truly global perspective to local opportunities.
              </p>

              <p>
                <span className="text-foreground font-semibold">
                  Bangkok HQ:
                </span>{" "}
                Managing our continental operations and talent portfolio
              </p>

              <p>
                <span className="text-foreground font-semibold">
                  Asia Network:
                </span>{" "}
                Discovering local talent and understanding regional markets
              </p>

              <p>
                <span className="text-foreground font-semibold">
                  Western Presence:
                </span>{" "}
                Connecting clients and creating international opportunities
              </p>

              <p>
                <span className="text-foreground font-semibold">
                  Local Expertise:
                </span>{" "}
                Deep understanding of markets from Bangkok to São Paulo
              </p>
            </div>
          </div>
        </section>

        {/* Impact & Legacy */}
        <section className="w-full py-16 lg:py-24 px-6 sm:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-light text-center mb-12">
              The J.I.M. Impact
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-5xl font-light text-primary mb-2">40+</div>
                <p className="text-sm text-muted-foreground">
                  Years of Excellence & Trust
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-light text-primary mb-2">
                  500+
                </div>
                <p className="text-sm text-muted-foreground">
                  Talented Models Managed
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-light text-primary mb-2">
                  1000+
                </div>
                <p className="text-sm text-muted-foreground">
                  Successful Placements Yearly
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-light text-primary mb-2">5</div>
                <p className="text-sm text-muted-foreground">
                  Continental Scouting Network
                </p>
              </div>
            </div>

            <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto mt-12">
              From transforming individual careers to shaping industry
              standards, J.I.M. Modeling Agency has left an indelible mark on
              the global modeling landscape.
            </p>
          </div>
        </section>

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "J.I.M. Modeling Agency",
              url: "https://jimmodel.com",
              logo: "https://jimmodel.com/logo.svg",
              image: "https://jimmodel.com/hero/1.jpg",
              description:
                "Thailand's premier modeling agency with 40+ years of experience. Connecting talent with global opportunities.",
              telephone: "+66-81-556-5126",
              email: "jim@jimmodel.com",
              address: {
                "@type": "PostalAddress",
                streetAddress:
                  "1201/5 Town in town soi 2, Phlabphla, Wang Thonglang",
                addressLocality: "Bangkok",
                postalCode: "10310",
                addressCountry: "TH",
              },
              foundingDate: "1984",
              areaServed: [
                "TH",
                "US",
                "CA",
                "GB",
                "FR",
                "BR",
                "JP",
                "SG",
                "MY",
              ],
              sameAs: [
                "https://facebook.com/jimmodeling",
                "https://instagram.com/jim_model",
              ],
              priceRange: "$",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5",
                bestRating: "5",
                worstRating: "1",
                ratingCount: "42",
              },
            }),
          }}
        />
      </main>
    </>
  );
}
