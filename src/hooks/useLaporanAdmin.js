// src/hooks/useLaporanAdmin.js
"use client";

import { useEffect, useMemo, useReducer, useRef } from "react";
import {
  createLaporanAdminInitialState,
  laporanAdminReducer,
  prependDocumentToList,
  removeDocumentFromList,
  replaceDocumentInList,
  ITEMS_PER_PAGE,
} from "@/lib/laporan-admin";
import {
  fetchCategoryDocuments,
  uploadLaporanDocument,
  updateLaporanDocument,
  updateLaporanDocumentWithFile,
  deleteLaporanDocument,
} from "@/lib/laporan-api";

const FEEDBACK_TIMEOUT = 3500;

function buildInitialDocsBySlug(categories = []) {
  return (categories || []).reduce((acc, category) => {
    const slug = category?.slug;
    if (!slug) return acc;

    acc[slug] = Array.isArray(category.documents) ? category.documents : [];
    return acc;
  }, {});
}

function createInitialState({ initialCategory, categories }) {
  const baseState = createLaporanAdminInitialState({
    initialCategory,
    categories,
  });

  const initialSlug = initialCategory?.slug || categories?.[0]?.slug || "";

  const docsBySlug = buildInitialDocsBySlug(categories);

  if (initialCategory?.slug) {
    docsBySlug[initialCategory.slug] = Array.isArray(initialCategory.documents)
      ? initialCategory.documents
      : [];
  }

  return {
    ...baseState,
    activeSlug: initialSlug,
    docsBySlug,
  };
}

export function useLaporanAdmin({ initialCategory, categories = [] }) {
  const uploadTimerRef = useRef(null);
  const actionTimerRef = useRef(null);

  const [state, dispatch] = useReducer(
    laporanAdminReducer,
    { initialCategory, categories },
    createInitialState,
  );

  const activeCategory = useMemo(() => {
    return (
      categories.find((item) => item.slug === state.activeSlug) ||
      initialCategory ||
      null
    );
  }, [categories, initialCategory, state.activeSlug]);

  const allDocuments = useMemo(() => {
    if (!activeCategory?.slug) return [];
    const docs = state.docsBySlug?.[activeCategory.slug];
    return Array.isArray(docs) ? docs : [];
  }, [activeCategory, state.docsBySlug]);

  const yearOptions = useMemo(() => {
    const years = Array.from(
      new Set(
        allDocuments
          .map((doc) => String(doc?.year || "").trim())
          .filter(Boolean),
      ),
    );
    return years.sort((a, b) => Number(b) - Number(a));
  }, [allDocuments]);

  const filteredDocuments = useMemo(() => {
    if (!state.yearFilter) return allDocuments;

    return allDocuments.filter(
      (doc) => String(doc?.year || "") === String(state.yearFilter),
    );
  }, [allDocuments, state.yearFilter]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE));
  }, [filteredDocuments]);

  const paginatedDocuments = useMemo(() => {
    const safePage = Math.min(state.currentPage, totalPages);
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredDocuments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDocuments, state.currentPage, totalPages]);

  useEffect(() => {
    if (state.currentPage > totalPages) {
      dispatch({ type: "SET_CURRENT_PAGE", payload: totalPages });
    }
  }, [state.currentPage, totalPages]);

  useEffect(() => {
    if (!state.uploadFeedback?.message) return;

    if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);

    uploadTimerRef.current = setTimeout(() => {
      dispatch({
        type: "SET_UPLOAD_FEEDBACK",
        payload: { type: "", message: "" },
      });
    }, FEEDBACK_TIMEOUT);

    return () => {
      if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);
    };
  }, [state.uploadFeedback]);

  useEffect(() => {
    if (!state.actionFeedback?.message) return;

    if (actionTimerRef.current) clearTimeout(actionTimerRef.current);

    actionTimerRef.current = setTimeout(() => {
      dispatch({
        type: "SET_ACTION_FEEDBACK",
        payload: { type: "", message: "" },
      });
    }, FEEDBACK_TIMEOUT);

    return () => {
      if (actionTimerRef.current) clearTimeout(actionTimerRef.current);
    };
  }, [state.actionFeedback]);

  function setDocForm(payload) {
    dispatch({ type: "SET_DOC_FORM", payload });
  }

  function setSelectedFile(file) {
    dispatch({ type: "SET_SELECTED_FILE", payload: file });
  }

  function setYearFilter(value) {
    dispatch({ type: "SET_YEAR_FILTER", payload: value });
  }

  function setCurrentPage(page) {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  }

  function setEditForm(payload) {
    dispatch({ type: "SET_EDIT_FORM", payload });
  }

  function setEditFile(file) {
    dispatch({ type: "SET_EDIT_FILE", payload: file });
  }

  function resetForm() {
    dispatch({ type: "RESET_DOC_FORM" });
    const fileInput = document.getElementById("pdf-upload-input");
    if (fileInput) fileInput.value = "";
  }

  async function handleSwitchCategory(slug) {
    if (!slug || slug === state.activeSlug) return;

    dispatch({ type: "SET_ACTIVE_SLUG", payload: slug });
    dispatch({ type: "RESET_VIEW_STATE" });

    const cachedDocs = state.docsBySlug?.[slug];
    if (Array.isArray(cachedDocs)) {
      dispatch({ type: "SET_LOADING_SLUG", payload: null });
      return;
    }

    dispatch({ type: "SET_LOADING_SLUG", payload: slug });

    try {
      const docs = await fetchCategoryDocuments(slug);

      dispatch({
        type: "SET_DOCS_FOR_SLUG",
        slug,
        documents: Array.isArray(docs) ? docs : [],
      });
    } catch (error) {
      dispatch({
        type: "SET_DOCS_FOR_SLUG",
        slug,
        documents: [],
      });

      dispatch({
        type: "SET_ACTION_FEEDBACK",
        payload: {
          type: "error",
          message: error?.message || "Gagal memuat dokumen kategori.",
        },
      });
    } finally {
      dispatch({ type: "SET_LOADING_SLUG", payload: null });
    }
  }

  async function handleUpload(event) {
    event.preventDefault();

    if (!activeCategory?.id || !activeCategory?.slug) {
      dispatch({
        type: "SET_UPLOAD_FEEDBACK",
        payload: {
          type: "error",
          message: "Kategori aktif tidak ditemukan.",
        },
      });
      return;
    }

    if (!state.docForm.title.trim()) {
      dispatch({
        type: "SET_UPLOAD_FEEDBACK",
        payload: {
          type: "error",
          message: "Judul dokumen wajib diisi.",
        },
      });
      return;
    }

    if (!state.selectedFile) {
      dispatch({
        type: "SET_UPLOAD_FEEDBACK",
        payload: {
          type: "error",
          message: "Pilih file PDF yang ingin diupload.",
        },
      });
      return;
    }

    dispatch({ type: "SET_SAVING_DOCUMENT", payload: true });
    dispatch({
      type: "SET_UPLOAD_FEEDBACK",
      payload: { type: "", message: "" },
    });

    try {
      const json = await uploadLaporanDocument({
        file: state.selectedFile,
        categoryId: activeCategory.id,
        categorySlug: activeCategory.slug,
        title: state.docForm.title.trim(),
        description: state.docForm.description.trim(),
        year: state.docForm.year,
        is_published: state.docForm.is_published,
      });

      if (json?.document) {
        dispatch({
          type: "SET_DOCS_FOR_SLUG",
          slug: activeCategory.slug,
          documents: prependDocumentToList(
            state.docsBySlug?.[activeCategory.slug] || [],
            json.document,
          ),
        });
      }

      resetForm();

      dispatch({
        type: "SET_UPLOAD_FEEDBACK",
        payload: {
          type: "success",
          message: json?.message || "Dokumen berhasil diupload.",
        },
      });

      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
    } catch (error) {
      dispatch({
        type: "SET_UPLOAD_FEEDBACK",
        payload: {
          type: "error",
          message: error?.message || "Upload dokumen gagal.",
        },
      });
    } finally {
      dispatch({ type: "SET_SAVING_DOCUMENT", payload: false });
    }
  }

  function startEdit(doc) {
    dispatch({ type: "START_EDIT", payload: doc });
  }

  function cancelEdit() {
    dispatch({ type: "CANCEL_EDIT" });

    const fileInput = document.getElementById(
      `pdf-edit-input-${state.editingId}`,
    );
    if (fileInput) fileInput.value = "";
  }

  async function saveEdit(id) {
    if (!id || !activeCategory?.slug) return;

    dispatch({ type: "SET_SAVING_EDIT_ID", payload: id });

    try {
      const payload = {
        title: state.editForm.title.trim(),
        description: state.editForm.description.trim(),
        year: state.editForm.year,
        is_published: state.editForm.is_published,
        file: state.editFile,
      };

      const json = state.editFile
        ? await updateLaporanDocumentWithFile(id, payload)
        : await updateLaporanDocument(id, payload);

      if (json?.document) {
        dispatch({
          type: "SET_DOCS_FOR_SLUG",
          slug: activeCategory.slug,
          documents: replaceDocumentInList(
            state.docsBySlug?.[activeCategory.slug] || [],
            json.document,
          ),
        });
      }

      dispatch({
        type: "SET_ACTION_FEEDBACK",
        payload: {
          type: "success",
          message: json?.message || "Dokumen berhasil diperbarui.",
        },
      });

      dispatch({ type: "CANCEL_EDIT" });
    } catch (error) {
      dispatch({
        type: "SET_ACTION_FEEDBACK",
        payload: {
          type: "error",
          message: error?.message || "Gagal memperbarui dokumen.",
        },
      });
    } finally {
      dispatch({ type: "SET_SAVING_EDIT_ID", payload: null });
    }
  }

  async function togglePublish(doc) {
    if (!doc?.id || !activeCategory?.slug) return;

    dispatch({ type: "SET_PUBLISHING_ID", payload: doc.id });

    try {
      const json = await updateLaporanDocument(doc.id, {
        title: doc.title,
        description: doc.description || "",
        year: doc.year,
        is_published: !doc.is_published,
      });

      if (json?.document) {
        dispatch({
          type: "SET_DOCS_FOR_SLUG",
          slug: activeCategory.slug,
          documents: replaceDocumentInList(
            state.docsBySlug?.[activeCategory.slug] || [],
            json.document,
          ),
        });
      }

      dispatch({
        type: "SET_ACTION_FEEDBACK",
        payload: {
          type: "success",
          message: json?.message || "Status publikasi berhasil diperbarui.",
        },
      });
    } catch (error) {
      dispatch({
        type: "SET_ACTION_FEEDBACK",
        payload: {
          type: "error",
          message: error?.message || "Gagal mengubah status publikasi.",
        },
      });
    } finally {
      dispatch({ type: "SET_PUBLISHING_ID", payload: null });
    }
  }

  function handleDeleteRequest(id) {
    if (!id) return;
    dispatch({ type: "SET_ID_TO_DELETE", payload: id });
    dispatch({ type: "SET_SHOW_DELETE_MODAL", payload: true });
  }

  function handleCancelDelete() {
    dispatch({ type: "SET_ID_TO_DELETE", payload: null });
    dispatch({ type: "SET_SHOW_DELETE_MODAL", payload: false });
  }

  async function handleConfirmDelete() {
    const id = state.idToDelete;
    if (!id || !activeCategory?.slug) return;

    dispatch({ type: "SET_DELETING_ID", payload: id });

    try {
      const json = await deleteLaporanDocument(id);

      const nextDocuments = removeDocumentFromList(
        state.docsBySlug?.[activeCategory.slug] || [],
        id,
      );

      dispatch({
        type: "SET_DOCS_FOR_SLUG",
        slug: activeCategory.slug,
        documents: nextDocuments,
      });

      dispatch({
        type: "SET_ACTION_FEEDBACK",
        payload: {
          type: "success",
          message: json?.message || "Dokumen berhasil dihapus.",
        },
      });

      dispatch({ type: "SET_SHOW_DELETE_MODAL", payload: false });
      dispatch({ type: "SET_ID_TO_DELETE", payload: null });
    } catch (error) {
      dispatch({
        type: "SET_ACTION_FEEDBACK",
        payload: {
          type: "error",
          message: error?.message || "Gagal menghapus dokumen.",
        },
      });
    } finally {
      dispatch({ type: "SET_DELETING_ID", payload: null });
    }
  }

  return {
    activeSlug: state.activeSlug,
    activeCategory,
    loadingSlug: state.loadingSlug,

    docForm: state.docForm,
    selectedFile: state.selectedFile,
    savingDocument: state.savingDocument,
    uploadFeedback: state.uploadFeedback,

    actionFeedback: state.actionFeedback,

    yearFilter: state.yearFilter,
    setYearFilter,

    currentPage: state.currentPage,
    totalPages,
    paginatedDocuments,
    filteredDocuments,
    yearOptions,
    setCurrentPage,

    editingId: state.editingId,
    editForm: state.editForm,
    editFile: state.editFile,
    setEditForm,
    setEditFile,

    publishingId: state.publishingId,
    savingEditId: state.savingEditId,
    deletingId: state.deletingId,

    showDeleteModal: state.showDeleteModal,

    handleSwitchCategory,
    setDocForm,
    setSelectedFile,
    resetForm,
    handleUpload,
    startEdit,
    cancelEdit,
    saveEdit,
    togglePublish,
    deleteDocument: handleDeleteRequest,
    handleConfirmDelete,
    handleCancelDelete,
  };
}
