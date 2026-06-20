import { pgTable, foreignKey, unique, pgPolicy, check, uuid, text, boolean, timestamp, integer, uniqueIndex, index, bigint, jsonb, pgSchema } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const kemenagWebsiteSchema = pgSchema("kemenag_website");

export const authSchema = pgSchema("auth");

export const users = authSchema.table("users", {
	id: uuid().primaryKey().notNull(),
	email: text(),
});





export const profiles = kemenagWebsiteSchema.table("profiles", {
	id: uuid().primaryKey().notNull(),
	full_name: text(),
	email: text(),
	role: text().default('editor').notNull(),
	unit_name: text(),
	avatar_url: text(),
	is_active: boolean().default(true).notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`).notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`).notNull(),
	failed_login_attempts: integer().default(0).notNull(),
	lockout_until: timestamp({ precision: 6, withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [users.id],
			name: "profiles_id_fkey"
		}).onDelete("cascade"),
	unique("profiles_email_key").on(table.email),
	pgPolicy("Users can read own profile", { as: "permissive", for: "select", to: ["authenticated"], using: sql`(auth.uid() = id)` }),
	pgPolicy("Users can update own profile", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("Users can insert own profile", { as: "permissive", for: "insert", to: ["authenticated"] }),
	check("profiles_role_check", sql`role = ANY (ARRAY['super_admin'::text, 'admin'::text, 'editor'::text, 'reviewer'::text])`),
]);

export const categories = kemenagWebsiteSchema.table("categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	type: text().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	description: text(),
	is_active: boolean().default(true).notNull(),
	sort_order: integer().default(0).notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`).notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`).notNull(),
}, (table) => [
	uniqueIndex("categories_type_slug_key").using("btree", table.type.asc().nullsLast().op("text_ops"), table.slug.asc().nullsLast().op("text_ops")),
	pgPolicy("Public can read active categories", { as: "permissive", for: "select", to: ["public"], using: sql`(is_active = true)` }),
	pgPolicy("Editors can manage categories", { as: "permissive", for: "all", to: ["authenticated"] }),
	check("categories_type_check", sql`type = ANY (ARRAY['news'::text, 'announcement'::text, 'document'::text, 'agenda'::text])`),
]);

export const news = kemenagWebsiteSchema.table("news", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	slug: text().notNull(),
	excerpt: text(),
	content: text(),
	featured_image_url: text(),
	category_id: uuid(),
	author_id: uuid(),
	status: text().default('draft').notNull(),
	published_at: timestamp({ withTimezone: true, mode: 'string' }),
	is_featured: boolean().default(false).notNull(),
	seo_title: text(),
	seo_description: text(),
	view_count: integer().default(0).notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`).notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.author_id],
			foreignColumns: [profiles.id],
			name: "news_author_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.category_id],
			foreignColumns: [categories.id],
			name: "news_category_id_fkey"
		}).onDelete("set null"),
	unique("news_slug_key").on(table.slug),
	index("idx_news_author_id").using("btree", table.author_id.asc().nullsLast().op("uuid_ops")),
	index("idx_news_category_id").using("btree", table.category_id.asc().nullsLast().op("uuid_ops")),
	pgPolicy("Public can read published news", { as: "permissive", for: "select", to: ["public"], using: sql`(status = 'published'::text)` }),
	pgPolicy("Editors can manage news", { as: "permissive", for: "all", to: ["authenticated"] }),
	check("news_status_check", sql`status = ANY (ARRAY['draft'::text, 'review'::text, 'published'::text, 'archived'::text])`),
]);

export const berita = kemenagWebsiteSchema.table("berita", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: text().notNull(),
	title: text().notNull(),
	excerpt: text().default('').notNull(),
	category: text().default('Umum').notNull(),
	content: text().notNull(),
	cover_image: text(),
	is_published: boolean().default(true).notNull(),
	published_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	author_id: uuid(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	views: bigint({ mode: "number" }).default(0).notNull(),
	cover_size_kb: integer().default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cover_size_bytes: bigint({ mode: "number" }).default(0).notNull(),
	reaction_bermanfaat: integer().default(0).notNull(),
	reaction_inspiratif: integer().default(0).notNull(),
	reaction_informatif: integer().default(0).notNull(),
}, (table) => [
	index("idx_berita_published_at").using("btree", table.published_at.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_berita_schedule").using("btree", table.is_published.asc().nullsLast().op("timestamptz_ops"), table.published_at.asc().nullsLast().op("bool_ops")).where(sql`((is_published = false) AND (published_at IS NOT NULL))`),
	index("idx_berita_slug").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.author_id],
			foreignColumns: [profiles.id],
			name: "berita_author_id_fkey"
		}).onDelete("set null"),
	unique("berita_slug_key").on(table.slug),
	index("idx_berita_author_id").using("btree", table.author_id.asc().nullsLast().op("uuid_ops")),
	pgPolicy("Berita published readable by anyone", { as: "permissive", for: "select", to: ["anon", "authenticated"], using: sql`(is_published = true)` }),
]);

export const dokumen = kemenagWebsiteSchema.table("dokumen", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: text().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	category: text().default('Dokumen').notNull(),
	file_label: text().default('PDF').notNull(),
	file_url: text(),
	is_external: boolean().default(false).notNull(),
	is_available: boolean().default(false).notNull(),
	is_published: boolean().default(true).notNull(),
	published_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	author_id: uuid(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.author_id],
			foreignColumns: [profiles.id],
			name: "dokumen_author_id_fkey"
		}).onDelete("set null"),
	unique("dokumen_slug_key").on(table.slug),
	index("idx_dokumen_author_id").using("btree", table.author_id.asc().nullsLast().op("uuid_ops")),
	pgPolicy("public read published dokumen", { as: "permissive", for: "select", to: ["anon", "authenticated"], using: sql`(is_published = true)` }),
]);

export const agenda = kemenagWebsiteSchema.table("agenda", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: text().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	category: text().default('Kegiatan').notNull(),
	status: text().default('Terjadwal').notNull(),
	location: text().default('').notNull(),
	start_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	end_at: timestamp({ withTimezone: true, mode: 'string' }),
	is_published: boolean().default(true).notNull(),
	author_id: uuid(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.author_id],
			foreignColumns: [profiles.id],
			name: "agenda_author_id_fkey"
		}).onDelete("set null"),
	unique("agenda_slug_key").on(table.slug),
	index("idx_agenda_author_id").using("btree", table.author_id.asc().nullsLast().op("uuid_ops")),
	pgPolicy("public read published agenda", { as: "permissive", for: "select", to: ["anon", "authenticated"], using: sql`(is_published = true)` }),
]);

export const admin_audit_log = kemenagWebsiteSchema.table("admin_audit_log", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	actor_id: uuid(),
	actor_email: text(),
	actor_role: text(),
	action: text().notNull(),
	entity: text().notNull(),
	entity_id: text(),
	summary: text(),
	before: jsonb(),
	after: jsonb(),
	metadata: jsonb(),
	ip_address: text(),
	user_agent: text(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_audit_actor").using("btree", table.actor_id.asc().nullsLast().op("uuid_ops")),
	index("idx_audit_created_at").using("btree", table.created_at.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_audit_entity").using("btree", table.entity.asc().nullsLast().op("text_ops")),
	pgPolicy("audit_select_admin", { as: "permissive", for: "select", to: ["authenticated"], using: sql`(EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (lower(p.role) = ANY (ARRAY['admin'::text, 'super_admin'::text])))))` }),
]);

export const documents = kemenagWebsiteSchema.table("documents", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	category: text().notNull(),
	title: text().notNull(),
	description: text(),
	file_url: text(),
	file_name: text(),
	is_published: boolean().default(true).notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_documents_category").using("btree", table.category.asc().nullsLast().op("text_ops"), table.created_at.desc().nullsFirst().op("text_ops")),
]);

export const report_documents = kemenagWebsiteSchema.table("report_documents", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	category_id: uuid().notNull(),
	title: text().notNull(),
	description: text(),
	year: integer(),
	file_name: text().notNull(),
	file_path: text().notNull(),
	file_url: text(),
	mime_type: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	file_size: bigint({ mode: "number" }),
	sort_order: integer().default(0).notNull(),
	is_published: boolean().default(true).notNull(),
	created_by: uuid(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	view_count: bigint({ mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	download_count: bigint({ mode: "number" }).default(0).notNull(),
}, (table) => [
	index("idx_report_documents_view_count").using("btree", table.view_count.desc().nullsFirst().op("int8_ops")),
	index("idx_report_documents_year").using("btree", table.year.desc().nullsFirst().op("int4_ops")),
	index("idx_report_documents_category_id").using("btree", table.category_id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.category_id],
			foreignColumns: [report_categories.id],
			name: "report_documents_category_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("admin_read_report_documents", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("admin_all_report_documents", { as: "permissive", for: "all", to: ["authenticated"] }),
]);

export const kontak_pesan = kemenagWebsiteSchema.table("kontak_pesan", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	nama: text().notNull(),
	whatsapp: text().notNull(),
	subjek: text(),
	pesan: text().notNull(),
	ip_address: text(),
	user_agent: text(),
	status: text().default('baru').notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_kontak_pesan_created_at").using("btree", table.created_at.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_kontak_pesan_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	pgPolicy("kontak_pesan_select_admin", { as: "permissive", for: "select", to: ["authenticated"], using: sql`(EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (lower(p.role) = ANY (ARRAY['admin'::text, 'super_admin'::text])))))` }),
]);

export const admin_users = kemenagWebsiteSchema.table("admin_users", {
	user_id: uuid().primaryKey().notNull(),
	full_name: text(),
	role: text().default('admin').notNull(),
	is_active: boolean().default(true).notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [users.id],
			name: "admin_users_user_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("admin_users_select_own", { as: "permissive", for: "select", to: ["authenticated"], using: sql`(auth.uid() = user_id)` }),
	pgPolicy("admin_users_update_own", { as: "permissive", for: "update", to: ["authenticated"] }),
	check("admin_users_role_check", sql`role = ANY (ARRAY['super_admin'::text, 'admin'::text, 'editor'::text])`),
]);

export const galeri = kemenagWebsiteSchema.table("galeri", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	image_url: text().notNull(),
	link_url: text(),
	source_type: text().default('berita').notNull(),
	source_id: text().notNull(),
	is_published: boolean().default(true).notNull(),
	published_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	image_size_kb: integer().default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	image_size_bytes: bigint({ mode: "number" }).default(0).notNull(),
}, (table) => [
	uniqueIndex("galeri_source_unique").using("btree", table.source_type.asc().nullsLast().op("text_ops"), table.source_id.asc().nullsLast().op("text_ops")),
	index("idx_galeri_source_type_source_id").using("btree", table.source_type.asc().nullsLast().op("text_ops"), table.source_id.asc().nullsLast().op("text_ops")),
]);

export const static_pages = kemenagWebsiteSchema.table("static_pages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: text().notNull(),
	title: text().notNull(),
	description: text(),
	content: text().notNull(),
	is_published: boolean().default(false).notNull(),
	author_id: uuid(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_static_pages_published").using("btree", table.is_published.asc().nullsLast().op("timestamptz_ops"), table.updated_at.desc().nullsFirst().op("timestamptz_ops")),
	foreignKey({
			columns: [table.author_id],
			foreignColumns: [users.id],
			name: "static_pages_author_id_fkey"
		}).onDelete("set null"),
	unique("static_pages_slug_key").on(table.slug),
	index("idx_static_pages_author_id").using("btree", table.author_id.asc().nullsLast().op("uuid_ops")),
	pgPolicy("static_pages_select_public", { as: "permissive", for: "select", to: ["anon", "authenticated"], using: sql`(is_published = true)` }),
	pgPolicy("static_pages_select_admin", { as: "permissive", for: "select", to: ["authenticated"] }),
]);

export const report_categories = kemenagWebsiteSchema.table("report_categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: text().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	intro: text().notNull(),
	sort_order: integer().default(0).notNull(),
	is_active: boolean().default(true).notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("report_categories_slug_key").on(table.slug),
	pgPolicy("admin_all_report_categories", { as: "permissive", for: "all", to: ["authenticated"], using: sql`true`, withCheck: sql`true`  }),
	pgPolicy("admin_read_report_categories", { as: "permissive", for: "select", to: ["authenticated"] }),
]);

export const editor_requests = kemenagWebsiteSchema.table("editor_requests", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	user_id: uuid().notNull(),
	full_name: text().notNull(),
	email: text().notNull(),
	unit_name: text(),
	status: text().default('pending').notNull(),
	requested_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	reviewed_at: timestamp({ withTimezone: true, mode: 'string' }),
	reviewed_by: uuid(),
	review_notes: text(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_editor_requests_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("idx_editor_requests_user_id").using("btree", table.user_id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.reviewed_by],
			foreignColumns: [profiles.id],
			name: "editor_requests_reviewed_by_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "editor_requests_user_id_fkey"
		}).onDelete("cascade"),
	unique("editor_requests_user_id_key").on(table.user_id),
	index("idx_editor_requests_reviewed_by").using("btree", table.reviewed_by.asc().nullsLast().op("uuid_ops")),
	check("editor_requests_status_check", sql`status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])`),
]);

export const user_permissions = kemenagWebsiteSchema.table("user_permissions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	user_id: uuid().notNull(),
	permission: text().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_user_permissions_user_id").using("btree", table.user_id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "user_permissions_user_id_fkey"
		}).onDelete("cascade"),
	unique("user_permissions_user_id_permissions_key").on(table.user_id, table.permission),
	unique("user_permissions_user_id_permission_key").on(table.user_id, table.permission),
]);

export const homepage_slides = kemenagWebsiteSchema.table("homepage_slides", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	caption: text().default('').notNull(),
	image_url: text().notNull(),
	is_published: boolean().default(true).notNull(),
	sort_order: integer().default(0).notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	category: text().default('utama').notNull(),
}, (table) => [
	index("idx_homepage_slides_order").using("btree", table.is_published.asc().nullsLast().op("int4_ops"), table.sort_order.asc().nullsLast().op("int4_ops"), table.updated_at.desc().nullsFirst().op("int4_ops")),
	index("idx_homepage_slides_updated_at").using("btree", table.updated_at.desc().nullsFirst().op("timestamptz_ops")),
	pgPolicy("homepage_slides_select_public", { as: "permissive", for: "select", to: ["anon", "authenticated"], using: sql`(is_published = true)` }),
	pgPolicy("homepage_slides_select_admin", { as: "permissive", for: "select", to: ["authenticated"] }),
]);

export const seksi = kemenagWebsiteSchema.table("seksi", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: text().notNull(),
	judul: text().notNull(),
	nama_kepala: text().notNull(),
	nip_kepala: text(),
	foto_kepala: text(),
	deskripsi: text().notNull(),
	created_at: timestamp({ precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: timestamp({ precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	foto_kepala_y: integer().default(50).notNull(),
}, (table) => [
	uniqueIndex("seksi_slug_key").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const testimonials = kemenagWebsiteSchema.table("testimonials", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	role: text().notNull(),
	content: text().notNull(),
	rating: integer().default(5).notNull(),
	avatar: text(),
	sort_order: integer().default(0).notNull(),
	is_active: boolean().default(true).notNull(),
	created_at: timestamp({ precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: timestamp({ precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	locale: text().default('id').notNull(),
});

export const pegawai_seksi = kemenagWebsiteSchema.table("pegawai_seksi", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	seksi_id: uuid().notNull(),
	nama: text().notNull(),
	nip: text(),
	jabatan: text().notNull(),
	foto: text(),
	sort_order: integer().default(0).notNull(),
	created_at: timestamp({ precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	foto_y: integer().default(50).notNull(),
}, (table) => [
	index("pegawai_seksi_seksi_id_idx").using("btree", table.seksi_id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.seksi_id],
			foreignColumns: [seksi.id],
			name: "pegawai_seksi_seksi_id_fkey"
		}).onDelete("cascade"),
]);

export const layanan_publik = kemenagWebsiteSchema.table("layanan_publik", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	items: jsonb().default([]).notNull(),
	sort_order: integer().default(0).notNull(),
	is_active: boolean().default(true).notNull(),
	created_at: timestamp({ precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: timestamp({ precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const siteSettings = kemenagWebsiteSchema.table("site_settings", {
  key: text("key").primaryKey().notNull(),
  value: jsonb("value").notNull().default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});

