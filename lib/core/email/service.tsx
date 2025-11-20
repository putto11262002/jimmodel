/**
 * Email service wrapper for Resend SDK
 * Platform-independent infrastructure layer for email operations
 * Provides a simple abstraction over Resend functionality
 */

import { Resend } from "resend";

/**
 * Send email input with common email fields
 */
export interface SendEmailInput {
  to: string | string[];
  subject: string;
  from?: string;
  replyTo?: string;
  react?: React.ReactNode;
  html?: string;
  text?: string;
}

/**
 * Email sending result
 */
export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Initialize email configuration from environment variables
 */
function getEmailConfig(): string | undefined {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "RESEND_API_KEY environment variable not set. Email functionality will be disabled.",
    );
    return undefined;
  }

  return apiKey;
}

/**
 * Initialize Resend client with API key
 * Returns null if API key is not configured
 */
function getResendClient(): Resend | null {
  const apiKey = getEmailConfig();
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

/**
 * Send email using Resend SDK
 * This is a non-blocking operation - errors are logged but don't throw
 *
 * @param input - Email sending parameters
 * @returns Promise<EmailSendResult> - Result of email sending operation
 */
export async function sendEmail(
  input: SendEmailInput,
): Promise<EmailSendResult> {
  const resend = getResendClient();

  // Skip email sending if Resend is not configured
  if (!resend) {
    console.log("Email sending skipped: RESEND_API_KEY not configured");
    return {
      success: false,
      error: "Email service not configured",
    };
  }

  // Validate required inputs
  if (!input.from) {
    return {
      success: false,
      error: "From email address is required",
    };
  }

  if (!input.react && !input.html && !input.text) {
    return {
      success: false,
      error: "Email content is required (react, html, or text)",
    };
  }

  try {
    // Prepare email options - use all inputs as provided by calling service
    const emailOptions = {
      from: input.from,
      to: input.to,
      subject: input.subject,
      react: input.react,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo,
    };

    // Send email using Resend
    const { data, error } = await resend.emails.send(emailOptions);

    if (error) {
      console.error("Failed to send email:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log(
      `Email sent successfully to ${Array.isArray(input.to) ? input.to.join(", ") : input.to}`,
    );

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Check if email service is properly configured
 */
export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

