CREATE TABLE "writing_curricula" (
	"id" text PRIMARY KEY NOT NULL,
	"language_code" text NOT NULL,
	"level_code" text NOT NULL,
	"title" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "writing_curricula_language_level_idx" ON "writing_curricula" USING btree ("language_code","level_code");
--> statement-breakpoint
ALTER TABLE "writing_curricula" ADD CONSTRAINT "writing_curricula_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE "writing_topics" (
	"id" text PRIMARY KEY NOT NULL,
	"curriculum_id" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "writing_topics_curriculum_slug_idx" ON "writing_topics" USING btree ("curriculum_id","slug");
--> statement-breakpoint
ALTER TABLE "writing_topics" ADD CONSTRAINT "writing_topics_curriculum_id_writing_curricula_id_fk" FOREIGN KEY ("curriculum_id") REFERENCES "public"."writing_curricula"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE "writing_lessons" (
	"id" text PRIMARY KEY NOT NULL,
	"topic_id" text NOT NULL,
	"curriculum_id" text NOT NULL,
	"language_code" text NOT NULL,
	"slug" text NOT NULL,
	"content_id" text NOT NULL,
	"title" text NOT NULL,
	"level_code" text NOT NULL,
	"sentence_count" integer DEFAULT 0 NOT NULL,
	"script_modes" jsonb,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "writing_lessons_topic_slug_idx" ON "writing_lessons" USING btree ("topic_id","slug");
--> statement-breakpoint
ALTER TABLE "writing_lessons" ADD CONSTRAINT "writing_lessons_topic_id_writing_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."writing_topics"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "writing_lessons" ADD CONSTRAINT "writing_lessons_curriculum_id_writing_curricula_id_fk" FOREIGN KEY ("curriculum_id") REFERENCES "public"."writing_curricula"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "writing_lessons" ADD CONSTRAINT "writing_lessons_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE "writing_sentences" (
	"id" text PRIMARY KEY NOT NULL,
	"lesson_id" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"prompt_vi" text NOT NULL,
	"target_default" text NOT NULL,
	"targets_by_mode" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"pronunciation_kind" text,
	"pronunciation" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "writing_sentences_lesson_sort_idx" ON "writing_sentences" USING btree ("lesson_id","sort_order");
--> statement-breakpoint
ALTER TABLE "writing_sentences" ADD CONSTRAINT "writing_sentences_lesson_id_writing_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."writing_lessons"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE "user_writing_lesson_progress" (
	"user_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"current_sentence_index" integer DEFAULT 0 NOT NULL,
	"done_sentence_indexes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"drafts" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"script_mode_id" text,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_writing_lesson_progress_user_id_lesson_id_pk" PRIMARY KEY("user_id","lesson_id")
);
--> statement-breakpoint
ALTER TABLE "user_writing_lesson_progress" ADD CONSTRAINT "user_writing_lesson_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_writing_lesson_progress" ADD CONSTRAINT "user_writing_lesson_progress_lesson_id_writing_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."writing_lessons"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "user_writing_lesson_progress_lesson_id_idx" ON "user_writing_lesson_progress" USING btree ("lesson_id");
