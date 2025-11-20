"use client";

import { submitContactForm } from "@/actions/form-submissions/action";
import {
  submitContactFormSchema,
  type SubmitContactFormInput,
} from "@/actions/form-submissions/validator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FORM_SUBMISSION_SUBJECTS } from "@/lib/data/form-submission-subjects";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

/**
 * ContactForm Component
 *
 * Client-side form component for contact submissions.
 * Handles form validation, submission, and user feedback.
 */
export function ContactForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

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
      setIsSubmitting(false);

      if (result.success) {
        setError(false);
        router.push("/contact/success");
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border bg-card p-8 shadow-sm">
      <Alert variant={"destructive"} className="mb-4" hidden={!error}>
        <AlertCircleIcon />
        <AlertTitle>Unable to process your submission</AlertTitle>
        <AlertDescription className="">
          <p>
            Please contact us at{" "}
            <a className="inline" href="mailto:jim@jimmodel.com">
              jim@jimmodel.com
            </a>{" "}
            for assistance.
          </p>
        </AlertDescription>
      </Alert>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">
                  Name <span aria-label="required">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    autoComplete="name"
                    required
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
                <FormLabel htmlFor="email">
                  Email <span aria-label="required">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    autoComplete="email"
                    required
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
                <FormLabel htmlFor="phone">Phone (optional)</FormLabel>
                <FormControl>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+66 81-556-5126"
                    autoComplete="tel"
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
                <FormLabel htmlFor="subject">
                  Subject <span aria-label="required">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger id="subject" className="w-full">
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
                <FormLabel htmlFor="message">
                  Message <span aria-label="required">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-[150px] resize-none"
                    required
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
  );
}
