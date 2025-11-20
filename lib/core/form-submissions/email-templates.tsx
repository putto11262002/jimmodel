/**
 * Email templates for contact form notifications
 * Built with React Email components for professional email rendering
 */

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
  Font,
} from "@react-email/components";
/**
 * Contact form submission data for email notifications
 */
export interface ContactFormEmailData {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  submittedAt: Date;
}


/**
 * Contact form notification email template
 * Sent to admin recipients when a new contact form is submitted
 */
export function ContactFormNotificationEmail({
  formData,
}: {
  formData: ContactFormEmailData;
}) {
  const previewText = `New contact form submission from ${formData.name}: ${formData.subject}`;

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <title>{previewText}</title>
      </Head>
      <Preview>{previewText}</Preview>
      <Body>
        <Container>
          <Heading>New Contact Form Submission</Heading>
          <Text>
            You&apos;ve received a new contact form submission from your website.
          </Text>

          <Section>
            <Heading>Contact Information</Heading>

            <Text>
              <strong>Name:</strong> {formData.name}
            </Text>

            <Text>
              <strong>Email:</strong>{" "}
              <Link href={`mailto:${formData.email}`}>
                {formData.email}
              </Link>
            </Text>

            {formData.phone && (
              <Text>
                <strong>Phone:</strong>{" "}
                <Link href={`tel:${formData.phone}`}>
                  {formData.phone}
                </Link>
              </Text>
            )}

            <Text>
              <strong>Subject:</strong> {formData.subject}
            </Text>

            <Text>
              <strong>Submitted:</strong>{" "}
              {formData.submittedAt.toLocaleString()}
            </Text>
          </Section>

          <Hr />

          <Section>
            <Heading>Message</Heading>
            <Text>{formData.message}</Text>
          </Section>

          <Hr />

          <Section>
            <Text>
              This email was sent automatically from your website&apos;s contact form.
            </Text>
            <Text>
              You can reply directly to this email to contact the submitter.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default ContactFormNotificationEmail;