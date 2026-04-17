import { describe, expect, it } from "vitest";
import {
  createLaporanAdminInitialState,
  EMPTY_DOC_FORM,
  laporanAdminReducer,
} from "../src/lib/laporan-admin";

describe("laporanAdminReducer", () => {
  const categories = [
    { slug: "laporan-a", title: "Laporan A" },
    { slug: "laporan-b", title: "Laporan B" },
  ];

  const initialCategory = {
    slug: "laporan-a",
    documents: [{ id: 1, title: "Dokumen Awal" }],
  };

  it("creates initial state from initial category", () => {
    const state = createLaporanAdminInitialState({
      initialCategory,
      categories,
    });

    expect(state.activeSlug).toBe("laporan-a");
    expect(state.docsBySlug).toEqual({
      "laporan-a": [{ id: 1, title: "Dokumen Awal" }],
    });
    expect(state.docForm).toEqual(EMPTY_DOC_FORM);
    expect(state.editForm).toEqual(EMPTY_DOC_FORM);
  });

  it("falls back to first category slug when initial category is absent", () => {
    const state = createLaporanAdminInitialState({
      initialCategory: null,
      categories,
    });

    expect(state.activeSlug).toBe("laporan-a");
    expect(state.docsBySlug).toEqual({});
  });

  it("handles SET_ACTIVE_SLUG", () => {
    const state = createLaporanAdminInitialState({
      initialCategory,
      categories,
    });

    const next = laporanAdminReducer(state, {
      type: "SET_ACTIVE_SLUG",
      payload: "laporan-b",
    });

    expect(next.activeSlug).toBe("laporan-b");
  });

  it("handles SET_DOCS_FOR_SLUG", () => {
    const state = createLaporanAdminInitialState({
      initialCategory,
      categories,
    });

    const next = laporanAdminReducer(state, {
      type: "SET_DOCS_FOR_SLUG",
      slug: "laporan-b",
      documents: [{ id: 2, title: "Dokumen B" }],
    });

    expect(next.docsBySlug["laporan-b"]).toEqual([
      { id: 2, title: "Dokumen B" },
    ]);
  });

  it("handles SET_DOC_FORM with object payload", () => {
    const state = createLaporanAdminInitialState({
      initialCategory,
      categories,
    });

    const next = laporanAdminReducer(state, {
      type: "SET_DOC_FORM",
      payload: {
        title: "Baru",
        description: "Desc",
        year: "2025",
        is_published: false,
      },
    });

    expect(next.docForm).toEqual({
      title: "Baru",
      description: "Desc",
      year: "2025",
      is_published: false,
    });
  });

  it("handles SET_DOC_FORM with updater function", () => {
    const state = createLaporanAdminInitialState({
      initialCategory,
      categories,
    });

    const next = laporanAdminReducer(state, {
      type: "SET_DOC_FORM",
      payload: (prev) => ({
        ...prev,
        title: "Updated via fn",
      }),
    });

    expect(next.docForm.title).toBe("Updated via fn");
  });

  it("handles RESET_DOC_FORM", () => {
    const dirtyState = {
      ...createLaporanAdminInitialState({
        initialCategory,
        categories,
      }),
      docForm: {
        title: "X",
        description: "Y",
        year: "2025",
        is_published: false,
      },
      selectedFile: { name: "file.pdf" },
    };

    const next = laporanAdminReducer(dirtyState, {
      type: "RESET_DOC_FORM",
    });

    expect(next.docForm).toEqual(EMPTY_DOC_FORM);
    expect(next.selectedFile).toBe(null);
  });

  it("handles SET_EDIT_FORM with object payload", () => {
    const state = createLaporanAdminInitialState({
      initialCategory,
      categories,
    });

    const next = laporanAdminReducer(state, {
      type: "SET_EDIT_FORM",
      payload: {
        title: "Edit",
        description: "Edit desc",
        year: "2024",
        is_published: true,
      },
    });

    expect(next.editForm.title).toBe("Edit");
    expect(next.editForm.year).toBe("2024");
  });

  it("handles SET_EDIT_FORM with updater function", () => {
    const state = createLaporanAdminInitialState({
      initialCategory,
      categories,
    });

    const next = laporanAdminReducer(state, {
      type: "SET_EDIT_FORM",
      payload: (prev) => ({
        ...prev,
        description: "Updated edit",
      }),
    });

    expect(next.editForm.description).toBe("Updated edit");
  });

  it("handles RESET_VIEW_STATE", () => {
    const dirtyState = {
      ...createLaporanAdminInitialState({
        initialCategory,
        categories,
      }),
      yearFilter: "2025",
      editingId: 99,
      actionFeedback: {
        type: "error",
        message: "Ada error",
      },
    };

    const next = laporanAdminReducer(dirtyState, {
      type: "RESET_VIEW_STATE",
    });

    expect(next.yearFilter).toBe("");
    expect(next.editingId).toBe(null);
    expect(next.actionFeedback).toEqual({
      type: "",
      message: "",
    });
  });

  it("returns same state on unknown action", () => {
    const state = createLaporanAdminInitialState({
      initialCategory,
      categories,
    });

    const next = laporanAdminReducer(state, {
      type: "UNKNOWN_ACTION",
    });

    expect(next).toEqual(state);
  });
});
