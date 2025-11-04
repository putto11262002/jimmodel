CREATE TABLE "model_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_id" uuid NOT NULL,
	"viewer_identifier" varchar(255) NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text
);
--> statement-breakpoint
ALTER TABLE "model_views" ADD CONSTRAINT "model_views_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "model_views_model_idx" ON "model_views" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "model_views_viewed_at_idx" ON "model_views" USING btree ("viewed_at");--> statement-breakpoint
CREATE INDEX "model_views_viewer_idx" ON "model_views" USING btree ("viewer_identifier");--> statement-breakpoint
CREATE INDEX "model_views_model_viewer_idx" ON "model_views" USING btree ("model_id","viewer_identifier");