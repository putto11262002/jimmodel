"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitContactFormSchema, type SubmitContactFormInput } from "@/actions/form-submissions/validator";
import { submitContactForm } from "@/actions/form-submissions/action";
import { FORM_SUBMISSION_SUBJECTS } from "@/lib/data/form-submission-subjects";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Mail, MapPin, Phone, Instagram, Facebook, Linkedin, Youtube } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SubmitContactFormInput>({
    resolver: zodResolver(submitContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  async function onSubmit(values: SubmitContactFormInput) {
    setIsSubmitting(true);

    try {
      const result = await submitContactForm(values);

      if (result.success) {
        router.push("/contact/success");
      } else {
        toast.error("Failed to send message", {
          description: result.error.message,
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred", {
        description: "Please try again later.",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <main className="w-full bg-background">
        {/* Contact Form Section */}
        <div className="container mx-auto max-w-2xl px-4 py-16">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Get in Touch</h1>
            <p className="text-lg text-muted-foreground">
              Have a question or want to work together? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-8 shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a subject category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FORM_SUBMISSION_SUBJECTS.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us more about your inquiry..."
                          className="min-h-[150px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Visit Our Office Section */}
        <section className="w-full py-16 lg:py-24 px-6 sm:px-8 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl lg:text-4xl font-serif font-light text-center mb-12">
                Visit Our Office
              </h2>
            </motion.div>

            {/* Contact Info + Map Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4 mb-8">
                  <p className="flex gap-3">
                    <MapPin className="w-5 h-5 flex-shrink-0 text-primary mt-0.5" />
                    <span className="text-muted-foreground">
                      1201/5 Town in town soi 2, Phlabphla, Wang Thonglang,
                      Bangkok, 10310, Thailand
                    </span>
                  </p>
                  <p className="flex gap-3">
                    <Phone className="w-5 h-5 flex-shrink-0 text-primary mt-0.5" />
                    <a
                      href="tel:+66815565126"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      +66 81-556-5126
                    </a>
                  </p>
                  <p className="flex gap-3">
                    <Mail className="w-5 h-5 flex-shrink-0 text-primary mt-0.5" />
                    <a
                      href="mailto:jim@jimmodel.com"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      jim@jimmodel.com
                    </a>
                  </p>
                </div>

                {/* Social Icons */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">
                    Connect With Us
                  </p>
                  <div className="flex gap-4">
                    {[
                      { icon: Instagram, href: "https://instagram.com/jim_model", label: "Instagram" },
                      { icon: Facebook, href: "https://facebook.com/jimmodeling", label: "Facebook" },
                      { icon: Youtube, href: "https://youtube.com/@jimmodeling", label: "YouTube" },
                      { icon: Linkedin, href: "https://linkedin.com/company/jim-modeling", label: "LinkedIn" },
                    ].map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Follow us on ${social.label}`}
                          className="group inline-flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/50 text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>

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
              name: "J.I.M. Modeling Agency",
              url: "https://jimmodel.com",
              logo: "https://jimmodel.com/logo.svg",
              description:
                "Thailand's premier modeling agency with 40+ years of experience. Contact for talent representation and bookings.",
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
            }),
          }}
        />
      </main>
    </>
  );
}
