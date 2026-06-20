import { relations } from "drizzle-orm/relations";

import { users, profiles, news, categories, berita, dokumen, agenda, report_categories, report_documents, admin_users, static_pages, editor_requests, user_permissions, seksi, pegawai_seksi } from "./schema";

export const profilesRelations = relations(profiles, ({one, many}) => ({
	users: one(users, {
		fields: [profiles.id],
		references: [users.id]
	}),
	news: many(news),
	beritas: many(berita),
	dokumen: many(dokumen),
	agenda: many(agenda),
	editor_requests_reviewed_by: many(editor_requests, {
		relationName: "editor_requests_reviewed_by_profiles_id"
	}),
	editor_requests_user_id: many(editor_requests, {
		relationName: "editor_requests_user_id_profiles_id"
	}),
	user_permissions: many(user_permissions),
}));

export const usersRelations = relations(users, ({many}) => ({
	profiles: many(profiles),
	admin_users: many(admin_users),
	static_pages: many(static_pages),
}));

export const newsRelations = relations(news, ({one}) => ({
	profile: one(profiles, {
		fields: [news.author_id],
		references: [profiles.id]
	}),
	category: one(categories, {
		fields: [news.category_id],
		references: [categories.id]
	}),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	news: many(news),
}));

export const beritaRelations = relations(berita, ({one}) => ({
	profile: one(profiles, {
		fields: [berita.author_id],
		references: [profiles.id]
	}),
}));

export const dokumenRelations = relations(dokumen, ({one}) => ({
	profile: one(profiles, {
		fields: [dokumen.author_id],
		references: [profiles.id]
	}),
}));

export const agendaRelations = relations(agenda, ({one}) => ({
	profile: one(profiles, {
		fields: [agenda.author_id],
		references: [profiles.id]
	}),
}));

export const report_documentsRelations = relations(report_documents, ({one}) => ({
	report_category: one(report_categories, {
		fields: [report_documents.category_id],
		references: [report_categories.id]
	}),
}));

export const report_categoriesRelations = relations(report_categories, ({many}) => ({
	report_documents: many(report_documents),
}));

export const admin_usersRelations = relations(admin_users, ({one}) => ({
	users: one(users, {
		fields: [admin_users.user_id],
		references: [users.id]
	}),
}));

export const static_pagesRelations = relations(static_pages, ({one}) => ({
	users: one(users, {
		fields: [static_pages.author_id],
		references: [users.id]
	}),
}));

export const editor_requestsRelations = relations(editor_requests, ({one}) => ({
	profile_reviewed_by: one(profiles, {
		fields: [editor_requests.reviewed_by],
		references: [profiles.id],
		relationName: "editor_requests_reviewed_by_profiles_id"
	}),
	profile_user_id: one(profiles, {
		fields: [editor_requests.user_id],
		references: [profiles.id],
		relationName: "editor_requests_user_id_profiles_id"
	}),
}));

export const user_permissionsRelations = relations(user_permissions, ({one}) => ({
	profile: one(profiles, {
		fields: [user_permissions.user_id],
		references: [profiles.id]
	}),
}));

export const seksiRelations = relations(seksi, ({many}) => ({
	pegawai_seksis: many(pegawai_seksi),
}));

export const pegawai_seksiRelations = relations(pegawai_seksi, ({one}) => ({
	seksi: one(seksi, {
		fields: [pegawai_seksi.seksi_id],
		references: [seksi.id]
	}),
}));
