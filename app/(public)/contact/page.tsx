import { cacheComponentConfig } from "@/config/cache-component";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Youtube,
} from "lucide-react";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { ContactForm } from "./_components/form";

/**
 * SEO Metadata for Contact Page
 * Includes title, description, Open Graph, and structured data
 */
export const metadata: Metadata = {
  title: "Get in Touch",
  description:
    "Contact J.I.M. Modeling Agency in Bangkok, Thailand. Reach out for talent representation, casting inquiries, and modeling opportunities.",
  keywords: [
    "contact J.I.M. modeling",
    "modeling agency Bangkok",
    "casting contact",
    "modeling opportunities Thailand",
    "talent representation",
  ],
  openGraph: {
    title: "Contact J.I.M. Modeling Agency - Get in Touch",
    description:
      "Get in touch with Thailand's premier modeling agency. Contact us for talent representation, bookings, and inquiries.",
    type: "website",
    url: "https://www.jimmodel.com/contact",
    siteName: "J.I.M. Modeling Agency",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "J.I.M. Modeling Agency Contact",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact J.I.M. Modeling Agency",
    description:
      "Get in touch with Thailand's premier modeling agency for talent and casting inquiries.",
    creator: "@jim_model",
  },
};

export default async function ContactPage() {
  "use cache";
  cacheLife(cacheComponentConfig.aboutPage.profile);
  cacheTag(...cacheComponentConfig.aboutPage.tag);
  return (
    <>
      <main className="w-full bg-background">
        {/* Contact Form Section */}
        <section
          className="container mx-auto max-w-2xl px-4 py-16"
          aria-labelledby="contact-form-title"
        >
          <div className="mb-8 text-center">
            <h1
              id="contact-form-title"
              className="mb-4 font-light text-4xl font-bold tracking-tight"
            >
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              Have a question or want to work together? We&apos;d love to hear
              from you.
            </p>
          </div>

          <ContactForm />
        </section>

        {/* Visit Our Office Section */}
        <section
          className="w-full py-16 lg:py-24 px-6 sm:px-8 border-t border-border"
          aria-labelledby="office-section-title"
        >
          <div className="max-w-3xl mx-auto">
            <h2
              id="office-section-title"
              className="text-3xl lg:text-4xl font-light text-center mb-12"
            >
              Visit Our Office
            </h2>

            {/* Contact Info + Map Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Contact Info */}
              <address className="not-italic">
                <h3 className="text-lg text-foreground mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4 mb-8">
                  <div className="flex gap-3">
                    <Phone
                      className="w-5 h-5 flex-shrink-0 text-primary mt-0.5"
                      aria-hidden="true"
                    />
                    <a
                      href="tel:+66815565126"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      +66 81-556-5126
                    </a>
                  </div>
                  <div className="flex gap-3">
                    <Mail
                      className="w-5 h-5 flex-shrink-0 text-primary mt-0.5"
                      aria-hidden="true"
                    />
                    <a
                      href="mailto:jim@jimmodel.com"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      jim@jimmodel.com
                    </a>
                  </div>
                </div>

                {/* Social Icons */}
                <div>
                  <h4 className="text-lg text-foreground mb-3">
                    Connect With Us
                  </h4>
                  <nav aria-label="Social media links" className="flex gap-4">
                    {[
                      {
                        icon: Instagram,
                        href: "https://instagram.com/jim_model",
                        label: "Instagram",
                      },
                      {
                        icon: Facebook,
                        href: "https://facebook.com/jimmodeling",
                        label: "Facebook",
                      },
                      {
                        icon: Youtube,
                        href: "https://youtube.com/@jimmodeling",
                        label: "YouTube",
                      },
                      {
                        icon: Linkedin,
                        href: "https://linkedin.com/company/jim-modeling",
                        label: "LinkedIn",
                      },
                    ].map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Follow us on ${social.label}`}
                          className="group inline-flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-primary/10 transition-colors"
                          title={`J.I.M. Modeling Agency on ${social.label}`}
                        >
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        </a>
                      );
                    })}
                  </nav>
                </div>
              </address>

              {/* Google Maps Embed */}
              <div className="w-full h-96 rounded-lg overflow-hidden border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.0725256088127!2d100.73728592346917!3d13.770449686707447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d6110d7591e15%3A0x1234567890abcdef!2s1201%2F5%20Town%20in%20town%20soi%202%2C%20Bangkok%2010310!5e0!3m2!1sen!2sth!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="J.I.M. Modeling Agency Location"
                />
              </div>
            </div>
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
              "@id": "https://www.jimmodel.com",
              name: "J.I.M. Modeling Agency",
              alternateName: "JIM Modeling",
              url: "https://www.jimmodel.com",
              contactUrl: "https://www.jimmodel.com/contact",
              logo: "https://www.jimmodel.com/logo.svg",
              description:
                "Thailand's premier modeling agency with 40+ years of experience. Professional talent representation, casting services, and model management for fashion, TV, and media projects.",
              image: "https://www.jimmodel.com/og-image.jpg",
              telephone: "+66-81-556-5126",
              email: "jim@jimmodel.com",
              address: {
                "@type": "PostalAddress",
                streetAddress:
                  "1201/5 Town in town soi 2, Phlabphla, Wang Thonglang",
                addressLocality: "Bangkok",
                postalCode: "10310",
                addressCountry: "TH",
                addressRegion: "Bangkok",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "13.770449686707447",
                longitude: "100.73728592346917",
              },
              foundingDate: "1984",
              areaServed: {
                "@type": "Country",
                name: "Thailand",
              },
              sameAs: [
                "https://instagram.com/jim_model",
                "https://facebook.com/jimmodeling",
                "https://youtube.com/@jimmodeling",
                "https://linkedin.com/company/jim-modeling",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Support",
                telephone: "+66-81-556-5126",
                email: "jim@jimmodel.com",
                contactOption: "TollFree",
              },
            }),
          }}
        />
      </main>
    </>
  );
}
