CREATE TABLE "vocab_curricula" (
	"id" text PRIMARY KEY NOT NULL,
	"language_code" text NOT NULL,
	"level_code" text NOT NULL,
	"title" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocab_topics" (
	"id" text PRIMARY KEY NOT NULL,
	"curriculum_id" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocab_lessons" (
	"id" text PRIMARY KEY NOT NULL,
	"topic_id" text NOT NULL,
	"curriculum_id" text NOT NULL,
	"language_code" text NOT NULL,
	"slug" text NOT NULL,
	"story_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"word_count" integer DEFAULT 0 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"next_story_id" text,
	"next_story_title" text,
	"is_published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocab_words" (
	"id" text PRIMARY KEY NOT NULL,
	"lesson_id" text NOT NULL,
	"slug" text NOT NULL,
	"term" text NOT NULL,
	"ipa" text,
	"part_of_speech" text NOT NULL,
	"meaning_vi" text NOT NULL,
	"definition" text NOT NULL,
	"example" text NOT NULL,
	"example_vi" text NOT NULL,
	"collocations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"distractors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_vocab_weak_items" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"vocabulary_word_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"target_lesson_id" text,
	"weak_source" text NOT NULL,
	"review_flashcard_required" boolean DEFAULT true NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" text NOT NULL,
	"cleared_at" text
);
--> statement-breakpoint
ALTER TABLE "vocab_curricula" ADD CONSTRAINT "vocab_curricula_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "vocab_topics" ADD CONSTRAINT "vocab_topics_curriculum_id_vocab_curricula_id_fk" FOREIGN KEY ("curriculum_id") REFERENCES "public"."vocab_curricula"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "vocab_lessons" ADD CONSTRAINT "vocab_lessons_topic_id_vocab_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."vocab_topics"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "vocab_lessons" ADD CONSTRAINT "vocab_lessons_curriculum_id_vocab_curricula_id_fk" FOREIGN KEY ("curriculum_id") REFERENCES "public"."vocab_curricula"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "vocab_lessons" ADD CONSTRAINT "vocab_lessons_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "vocab_words" ADD CONSTRAINT "vocab_words_lesson_id_vocab_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."vocab_lessons"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_vocab_weak_items" ADD CONSTRAINT "user_vocab_weak_items_vocabulary_word_id_vocab_words_id_fk" FOREIGN KEY ("vocabulary_word_id") REFERENCES "public"."vocab_words"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_vocab_weak_items" ADD CONSTRAINT "user_vocab_weak_items_lesson_id_vocab_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."vocab_lessons"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_vocab_weak_items" ADD CONSTRAINT "user_vocab_weak_items_target_lesson_id_vocab_lessons_id_fk" FOREIGN KEY ("target_lesson_id") REFERENCES "public"."vocab_lessons"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_vocab_weak_items" ADD CONSTRAINT "user_vocab_weak_items_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "vocab_curricula_language_level_idx" ON "vocab_curricula" USING btree ("language_code","level_code");
--> statement-breakpoint
CREATE UNIQUE INDEX "vocab_topics_curriculum_slug_idx" ON "vocab_topics" USING btree ("curriculum_id","slug");
--> statement-breakpoint
CREATE UNIQUE INDEX "vocab_lessons_topic_slug_idx" ON "vocab_lessons" USING btree ("topic_id","slug");
--> statement-breakpoint
CREATE UNIQUE INDEX "vocab_words_lesson_slug_idx" ON "vocab_words" USING btree ("lesson_id","slug");
--> statement-breakpoint
CREATE INDEX "user_vocab_weak_items_user_lesson_idx" ON "user_vocab_weak_items" USING btree ("user_id","lesson_id","status");
