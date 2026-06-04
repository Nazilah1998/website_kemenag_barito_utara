CREATE INDEX "idx_agenda_author_id" ON "agenda" USING btree ("author_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_berita_author_id" ON "berita" USING btree ("author_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_dokumen_author_id" ON "dokumen" USING btree ("author_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_editor_requests_reviewed_by" ON "editor_requests" USING btree ("reviewed_by" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_news_author_id" ON "news" USING btree ("author_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_news_category_id" ON "news" USING btree ("category_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_report_documents_category_id" ON "report_documents" USING btree ("category_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_static_pages_author_id" ON "static_pages" USING btree ("author_id" uuid_ops);