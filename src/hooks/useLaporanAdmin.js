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

function createInitialState({ initialCategory, categories }) {
  const baseState = createLaporanAdminInitialState({
    initialCategory,
    categories,
  });

  return {
    ...baseState,
    totalPages: 1,
    totalItems: 0,
    availableYears: [],
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

  const paginatedDocuments = useMemo(() => {
    if (!activeCategory?.slug) return [];
    const docs = state.docsBySlug?.[activeCategory.slug];
    return Array.isArray(docs) ? docs : [];
  }, [activeCategory, state.docsBySlug]);

  // Data Fetching logic for Pagination & Filtering
  useEffect(() => {
    const slug = state.activeSlug;
    if (!slug) return;

    const controller = new AbortController();

    async function loadData() {
      dispatch({ type: "SET_LOADING_SLUG", payload: slug });

      try {
        const data = await fetchCategoryDocuments(slug, state.currentPage, ITEMS_PER_PAGE, state.yearFilter);
        
        // Since API returns categories array with documents attached:
        const cat = data?.categories?.find(c => c.slug === slug);
        
        dispatch({
          type: "SET_DOCS_FOR_SLUG",
          slug,
          documents: Array.isArray(cat?.documents) ? cat.documents : [],
        });

        dispatch({
          type: "SET_PAGINATION_DATA",
          payload: data?.pagination || { totalPages: 1, total: 0 }
        });

        dispatch({
          type: "SET_AVAILABLE_YEARS",
          payload: data?.availableYears || []
        });

      } catch (error) {
        if (error?.name === "AbortError") return;
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
        if (!controller.signal.aborted) {
          dispatch({ type: "SET_LOADING_SLUG", payload: null });
        }
      }
    }

    loadData();

    return () => controller.abort();
  }, [state.activeSlug, state.currentPage, state.yearFilter]);


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

  function setSelectedFiles(files) {
    dispatch({ type: "SET_SELECTED_FILES", payload: files });
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
    // Effect will handle the fetching automatically!
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

    if (!state.selectedFiles || state.selectedFiles.length === 0) {
      dispatch({
        type: "SET_UPLOAD_FEEDBACK",
        payload: {
          type: "error",
          message: "Pilih setidaknya satu file PDF yang ingin diupload.",
        },
      });
      return;
    }

    if (state.selectedFiles.length === 1 && !state.docForm.title.trim()) {
      dispatch({
        type: "SET_UPLOAD_FEEDBACK",
        payload: {
          type: "error",
          message: "Judul dokumen wajib diisi.",
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
        files: state.selectedFiles,
        categoryId: activeCategory.id,
        categorySlug: activeCategory.slug,
        title: state.docForm.title.trim(),
        description: state.docForm.description.trim(),
        year: state.docForm.year,
        is_published: state.docForm.is_published,
      });

      // Refetch page 1 to ensure UI shows exactly 10 latest
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      
      // If we are already on page 1, effect might not trigger refetch if other dependencies didn't change, 
      // but in this case, actually it's better to force fetch or manually prepend.
      // Manually prepend to be safe:
      if (json?.documents) {
        let currentDocs = state.docsBySlug?.[activeCategory.slug] || [];
        json.documents.forEach(doc => {
           currentDocs = prependDocumentToList(currentDocs, doc);
        });
        // slice to limit
        currentDocs = currentDocs.slice(0, ITEMS_PER_PAGE);
        
        dispatch({
          type: "SET_DOCS_FOR_SLUG",
          slug: activeCategory.slug,
          documents: currentDocs,
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
      
      // Ideally trigger a re-fetch here if we want exactly ITEMS_PER_PAGE docs shown, 
      // but for simplicity client removal works for now.
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
    selectedFiles: state.selectedFiles, // updated
    savingDocument: state.savingDocument,
    uploadFeedback: state.uploadFeedback,

    actionFeedback: state.actionFeedback,

    yearFilter: state.yearFilter,
    setYearFilter,

    currentPage: state.currentPage,
    totalPages: state.totalPages,
    paginatedDocuments,
    filteredDocuments: paginatedDocuments, // mapped for legacy UI compatibility
    yearOptions: state.availableYears, // mapped from server
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
    setSelectedFiles,
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
