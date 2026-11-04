CREATE TABLE "languages" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"native_name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" smallint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listening_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"language_code" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"description_vi" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"lesson_count" integer DEFAULT 0 NOT NULL,
	"levels" text[] DEFAULT '{}' NOT NULL,
	"cover" jsonb,
	"is_published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listening_lessons" (
	"id" text PRIMARY KEY NOT NULL,
	"section_id" text NOT NULL,
	"category_id" text NOT NULL,
	"language_code" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"level_code" text NOT NULL,
	"display_order" integer NOT NULL,
	"sentence_count" integer DEFAULT 0 NOT NULL,
	"duration_ms" integer,
	"stars" smallint DEFAULT 0 NOT NULL,
	"template_type" text DEFAULT 'audio' NOT NULL,
	"audio_storage_key" text,
	"audio_public_path" text,
	"metadata" jsonb,
	"path" text,
	"dictation_grading_defaults" jsonb,
	"is_published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listening_sections" (
	"id" text PRIMARY KEY NOT NULL,
	"category_id" text NOT NULL,
	"section_number" integer NOT NULL,
	"title" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"access" text DEFAULT 'full' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listening_sentences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" text NOT NULL,
	"position" integer NOT NULL,
	"start_ms" integer NOT NULL,
	"end_ms" integer NOT NULL,
	"transcript" text NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "proficiency_levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"language_code" text NOT NULL,
	"code" text NOT NULL,
	"framework" text NOT NULL,
	"sort_order" smallint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "listening_categories" ADD CONSTRAINT "listening_categories_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listening_lessons" ADD CONSTRAINT "listening_lessons_section_id_listening_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."listening_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listening_lessons" ADD CONSTRAINT "listening_lessons_category_id_listening_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."listening_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listening_lessons" ADD CONSTRAINT "listening_lessons_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listening_sections" ADD CONSTRAINT "listening_sections_category_id_listening_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."listening_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listening_sentences" ADD CONSTRAINT "listening_sentences_lesson_id_listening_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."listening_lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proficiency_levels" ADD CONSTRAINT "proficiency_levels_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "listening_categories_language_slug_idx" ON "listening_categories" USING btree ("language_code","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "listening_lessons_section_slug_idx" ON "listening_lessons" USING btree ("section_id","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "listening_sections_category_number_idx" ON "listening_sections" USING btree ("category_id","section_number");--> statement-breakpoint
CREATE UNIQUE INDEX "listening_sentences_lesson_position_idx" ON "listening_sentences" USING btree ("lesson_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "proficiency_levels_language_code_idx" ON "proficiency_levels" USING btree ("language_code","code");