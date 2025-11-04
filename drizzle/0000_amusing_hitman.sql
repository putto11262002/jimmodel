CREATE TABLE "model_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_id" uuid NOT NULL,
	"url" text NOT NULL,
	"type" text,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "models" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"nick_name" varchar(100),
	"gender" varchar(20) NOT NULL,
	"date_of_birth" date,
	"nationality" varchar(100),
	"ethnicity" varchar(100),
	"talents" text[],
	"bio" text,
	"experiences" text[],
	"local" boolean DEFAULT false NOT NULL,
	"in_town" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"category" varchar(20) NOT NULL,
	"height" numeric(5, 2),
	"weight" numeric(5, 2),
	"hips" numeric(5, 2),
	"hair_color" text,
	"eye_color" text,
	"profile_image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "model_images" ADD CONSTRAINT "model_images_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "model_images_model_idx" ON "model_images" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "model_images_type_idx" ON "model_images" USING btree ("type");--> statement-breakpoint
CREATE INDEX "model_images_order_idx" ON "model_images" USING btree ("order");--> statement-breakpoint
CREATE INDEX "models_category_idx" ON "models" USING btree ("category");--> statement-breakpoint
CREATE INDEX "models_published_idx" ON "models" USING btree ("published");--> statement-breakpoint
CREATE INDEX "models_local_idx" ON "models" USING btree ("local");--> statement-breakpoint
CREATE INDEX "models_in_town_idx" ON "models" USING btree ("in_town");