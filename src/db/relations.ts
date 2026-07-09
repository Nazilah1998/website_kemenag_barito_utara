import { relations } from "drizzle-orm/relations";

import { users, news, categories, berita, dokumen, agenda, report_categories, report_documents, admin_users, static_pages, seksi, pegawai_seksi } from "./schema";

export const usersRelations = relations(users, ({many}) => ({
	admin_users: many(admin_users),
	static_pages: many(static_pages),
}));

export const newsRelations = relations(news, ({one}) => ({
	category: one(categories, {
		fields: [news.category_id],
		references: [categories.id]
	}),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	news: many(news),
}));

export const beritaRelations = relations(berita, ({one}) => ({
}));

export const dokumenRelations = relations(dokumen, ({one}) => ({
}));

export const agendaRelations = relations(agenda, ({one}) => ({
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



export const seksiRelations = relations(seksi, ({many}) => ({
	pegawai_seksis: many(pegawai_seksi),
}));

export const pegawai_seksiRelations = relations(pegawai_seksi, ({one}) => ({
	seksi: one(seksi, {
		fields: [pegawai_seksi.seksi_id],
		references: [seksi.id]
	}),
}));
