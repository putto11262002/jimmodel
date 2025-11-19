# Feature Enablement Brief

## 1. Summary
This brief covers the implementation of Resend SDK with React Email templates for email functionality in Next.js applications. The integration enables sending beautifully designed emails using React components while leveraging Resend's reliable delivery service.

**Dependencies:**
- `resend` - Official Resend SDK for Node.js
- `@react-email/components` - React Email component library
- Next.js API environment for server-side email sending

## 2. Key Concepts

### Resend Client
The Resend SDK provides a simple client for sending emails with API key authentication. The client handles HTTP requests to Resend's API and returns structured responses with success/error states.

**Source:** https://resend.com/docs/send-with-nodejs

### React Email Templates
React Email allows building email templates using React components instead of traditional HTML table-based layouts. Templates are rendered to HTML before sending via email services.

**Source:** https://react.email/docs/introduction

### Email Testing
Resend provides dedicated test email addresses to avoid deliverability issues during development and testing phases.

**Source:** https://resend.com/docs/knowledge-base/what-email-addresses-to-use-for-testing

### Error Handling
Resend uses standard HTTP status codes with structured error responses for different failure scenarios.

**Source:** https://resend.com/docs/api-reference/errors

## 3. APIs & Interfaces

### Resend Client Initialization
```typescript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');
```
**Source:** https://resend.com/docs/send-with-nodejs

### Send Email with HTML
```typescript
const { data, error } = await resend.emails.send({
  from: 'Acme <onboarding@resend.dev>',
  to: ['delivered@resend.dev'],
  subject: 'Hello World',
  html: '<strong>It works!</strong>',
});
```
**Source:** https://resend.com/docs/send-with-nodejs

### Send Email with React Template
```typescript
const { data, error } = await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: ['delivered@resend.dev'],
  subject: 'Hello World',
  react: YourEmailTemplate(),
});
```
**Source:** https://react.email/docs/integrations/resend

### React Email Component Example
```typescript
import { Heading } from '@react-email/components';

<Heading as="h2">Lorem ipsum</Heading>
```
**Source:** https://react.email/docs/components/heading

### Error Response Types
- **400 Bad Request:** `invalid_idempotency_key`, `validation_error`
- **401 Unauthorized:** `missing_api_key`, `restricted_api_key`
- **403 Forbidden:** `invalid_api_key`, `validation_error`
- **404 Not Found:** `not_found`
- **422 Unprocessable Entity:** Invalid parameters, missing fields
- **429 Too Many Requests:** Quota exceeded, rate limits
- **500 Internal Server Error:** Application errors

**Source:** https://resend.com/docs/api-reference/errors

### Authentication Header
```
Authorization: Bearer re_xxxxxxxxx
```
**Source:** https://resend.com/docs/api-reference/introduction

## 4. Implementation Steps

### Step 1: Install Dependencies
```bash
npm install resend @react-email/components -E
# or
pnpm add resend @react-email/components -E
```

### Step 2: Setup Environment Variables
Create `.env.local` with your Resend API key:
```
RESEND_API_KEY=re_your_actual_api_key_here
```

### Step 3: Initialize Resend Client
Create a utility file for the Resend client:
```typescript
// lib/resend.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;
```

### Step 4: Create Email Templates
Create React Email components in `emails/` directory:
```typescript
// emails/welcome.tsx
import { Html, Head, Body, Heading, Text, Button } from '@react-email/components';

export function WelcomeEmail({ userName }: { userName: string }) {
  return (
    <Html>
      <Head />
      <Body>
        <Heading>Welcome to our service!</Heading>
        <Text>Hello {userName},</Text>
        <Text>Thank you for joining us.</Text>
        <Button href="https://example.com">Get Started</Button>
      </Body>
    </Html>
  );
}
```

### Step 5: Create Email Service
Create a service for sending emails:
```typescript
// lib/core/email/types.ts
export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  template: React.ReactElement;
  from?: string;
}

// lib/core/email/service.ts
import resend from '@/lib/resend';
import { SendEmailOptions } from './types';

export async function sendEmail({ to, subject, template, from }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: from || 'onboarding@resend.dev',
      to: Array.isArray(to) ? to : [to],
      subject,
      react: template,
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
}
```

### Step 6: Create Server Action
Create a Next.js Server Action for email sending:
```typescript
// actions/email/validator.ts
import { z } from 'zod';

export const sendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  userName: z.string().min(1),
});

export type SendEmailInput = z.infer<typeof sendEmailSchema>;

// actions/email/action.ts
import { sendEmailSchema } from './validator';
import { sendEmail } from '@/lib/core/email/service';
import { WelcomeEmail } from '@/emails/welcome';
import { success, error } from '@/actions/utils';

export async function sendWelcomeEmail(input: SendEmailInput) {
  try {
    const { to, subject, userName } = sendEmailSchema.parse(input);

    await sendEmail({
      to,
      subject,
      template: WelcomeEmail({ userName }),
    });

    return success({ message: 'Welcome email sent successfully' });
  } catch (err) {
    return error('Failed to send welcome email');
  }
}
```

## 5. Minimal Example

```typescript
// app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import resend from '@/lib/resend';
import { WelcomeEmail } from '@/emails/welcome';

export async function POST(request: NextRequest) {
  try {
    const { to, userName } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [to],
      subject: 'Welcome!',
      react: WelcomeEmail({ userName }),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 6. Pitfalls & Notes

### Domain Verification
- You must verify your domain before sending emails from non-Resend addresses
- Use `@resend.dev` addresses for testing without domain verification
- **Source:** https://resend.com/docs/send-with-nodejs

### Test Email Addresses
- Use `delivered@resend.dev` for testing successful delivery
- Use `bounced@resend.dev` for testing bounce handling
- Never use `@example.com` or `@test.com` (causes bounces)
- **Source:** https://resend.com/docs/knowledge-base/what-email-addresses-to-use-for-testing

### Rate Limits
- Monitor response headers for rate limit information
- Implement exponential backoff for rate limit errors (429)
- **Source:** https://resend.com/docs/api-reference/errors

### Idempotency Keys
- Include idempotency keys for preventing duplicate emails
- Retry requests with valid idempotency keys on failures
- **Source:** https://resend.com/docs/api-reference/errors

### Environment Configuration
- Store API keys in environment variables, never commit to git
- Use different API keys for development and production
- Ensure HTTPS is enforced (automatically handled by Resend SDK)

### React Email Rendering
- Templates are rendered to HTML on the server before sending
- All React components must be serializable
- Use `@react-email/components` for consistent email rendering

## 7. Additional Reading

### Official Documentation
- **Resend Node.js Guide:** https://resend.com/docs/send-with-nodejs
- **React Email Introduction:** https://react.email/docs/introduction
- **React Email + Resend Integration:** https://react.email/docs/integrations/resend
- **Resend Error Handling:** https://resend.com/docs/api-reference/errors
- **Email Testing Best Practices:** https://resend.com/docs/knowledge-base/what-email-addresses-to-use-for-testing

### API References
- **Resend API Reference:** https://resend.com/docs/api-reference/introduction
- **React Email Components:** https://react.email/docs/components/heading

### Setup Tools
- **React Email CLI Setup:** `npx react-email@latest resend setup`
- **Component Installation:** `npm install @react-email/components -E`