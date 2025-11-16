CREATE TABLE "form_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"subject" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"status" varchar(20) DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "form_submissions_status_idx" ON "form_submissions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "form_submissions_email_idx" ON "form_submissions" USING btree ("email");