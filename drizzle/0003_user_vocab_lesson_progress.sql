CREATE TABLE "user_vocab_lesson_progress" (
	"user_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"current_step" text DEFAULT 'overview' NOT NULL,
	"mastered_count" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_vocab_lesson_progress_user_id_lesson_id_pk" PRIMARY KEY("user_id","lesson_id")
);
--> statement-breakpoint
ALTER TABLE "user_vocab_lesson_progress" ADD CONSTRAINT "user_vocab_lesson_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_vocab_lesson_progress" ADD CONSTRAINT "user_vocab_lesson_progress_lesson_id_vocab_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."vocab_lessons"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "user_vocab_lesson_progress_lesson_id_idx" ON "user_vocab_lesson_progress" USING btree ("lesson_id");
