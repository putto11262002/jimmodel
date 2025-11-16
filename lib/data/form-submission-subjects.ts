export const FORM_SUBMISSION_SUBJECTS = [
  "Model Application / Join Our Agency",
  "Book a Model / Client Inquiry",
  "General Question",
  "Partnership / Collaboration",
  "Media / Press Inquiry",
  "Current Model Support",
  "Other",
] as const;

export type FormSubmissionSubject = (typeof FORM_SUBMISSION_SUBJECTS)[number];
