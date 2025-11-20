import { CtaButton } from "@/components/ui/cta-button";

export function DualCta() {
  return (
    <section className="relative w-full py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* For Talent - Primary/Prominent */}
          <div
            className="relative group overflow-hidden rounded-3xl bg-background p-8 lg:p-12 min-h-[400px] flex flex-col justify-between border border-border"
          >
            <div className="relative z-10">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground mb-4">
                For Talent
              </p>
              <h3 className="text-4xl sm:text-5xl font-light text-foreground mb-6">
                Join Our
                <br />
                Agency
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-md">
                Start your modeling career with Thailand&apos;s premier agency.
                We discover and develop exceptional talent.
              </p>
            </div>

            <CtaButton href="/contact" className="relative z-10 self-start">
              Apply Now
            </CtaButton>
          </div>

          {/* For Clients - Secondary/Subtle */}
          <div
            className="relative group overflow-hidden rounded-3xl bg-background p-8 lg:p-12 min-h-[400px] flex flex-col justify-between border border-border"
          >
            <div className="relative z-10">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground mb-4">
                For Clients
              </p>
              <h3 className="text-4xl sm:text-5xl font-light text-foreground mb-6">
                Book
                <br />
                Talent
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-md">
                Access our diverse roster of professional models. Find the
                perfect talent for your next project.
              </p>
            </div>

            <CtaButton href="/contact" className="relative z-10 self-start">
              Contact Us
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
