// src/lib/laporan-admin.js

export const EMPTY_DOC_FORM = {
  title: "",
  description: "",
  year: String(new Date().getFullYear()),
  is_published: true,
};

export const ITEMS_PER_PAGE = 4;

export function normalizeCategoryMap(categories = []) {
  if (!Array.isArray(categories)) return {};

  return categories.reduce((acc, category) => {
    if (!category?.slug) return acc;

    acc[category.slug] = Array.isArray(category.documents)
      ? category.documents
      : [];

    return acc;
  }, {});
}

export function normalizeDocUrl(doc) {
  return String(doc?.file_url || doc?.href || "").trim();
}

export function formatBytes(size) {
  const bytes = Number(size || 0);

  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function replaceDocumentInList(list = [], nextDocument) {
  if (!nextDocument?.id) return list;

  return list.map((item) =>
    item.id === nextDocument.id ? nextDocument : item,
  );
}

export function removeDocumentFromList(list = [], id) {
  return list.filter((item) => item.id !== id);
}

export function prependDocumentToList(list = [], document) {
  if (!document?.id) return list;
  return [document, ...list];
}

export function createLaporanAdminInitialState({
  initialCategory,
  categories = [],
}) {
  const initialSlug = initialCategory?.slug || categories?.[0]?.slug || "";

  return {
    activeSlug: initialSlug,
    docsBySlug: normalizeCategoryMap(categories),
    loadingSlug: null,

    docForm: { ...EMPTY_DOC_FORM },
    selectedFile: null,
    savingDocument: false,

    uploadFeedback: {
      type: "",
      message: "",
    },

    actionFeedback: {
      type: "",
      message: "",
    },

    yearFilter: "",
    currentPage: 1,

    editingId: null,
    editForm: { ...EMPTY_DOC_FORM },
    editFile: null,

    publishingId: null,
    savingEditId: null,
    deletingId: null,
  };
}

export function laporanAdminReducer(state, action) {
  switch (action.type) {
    case "SET_ACTIVE_SLUG":
      return {
        ...state,
        activeSlug: action.payload,
      };

    case "SET_DOCS_FOR_SLUG":
      return {
        ...state,
        docsBySlug: {
          ...state.docsBySlug,
          [action.slug]: Array.isArray(action.documents)
            ? action.documents
            : [],
        },
      };

    case "SET_LOADING_SLUG":
      return {
        ...state,
        loadingSlug: action.payload,
      };

    case "SET_DOC_FORM":
      return {
        ...state,
        docForm:
          typeof action.payload === "function"
            ? action.payload(state.docForm)
            : { ...state.docForm, ...action.payload },
      };

    case "RESET_DOC_FORM":
      return {
        ...state,
        docForm: { ...EMPTY_DOC_FORM },
        selectedFile: null,
      };

    case "SET_SELECTED_FILE":
      return {
        ...state,
        selectedFile: action.payload,
      };

    case "SET_SAVING_DOCUMENT":
      return {
        ...state,
        savingDocument: action.payload,
      };

    case "SET_UPLOAD_FEEDBACK":
      return {
        ...state,
        uploadFeedback: action.payload,
      };

    case "SET_ACTION_FEEDBACK":
      return {
        ...state,
        actionFeedback: action.payload,
      };

    case "SET_YEAR_FILTER":
      return {
        ...state,
        yearFilter: action.payload,
        currentPage: 1,
      };

    case "SET_CURRENT_PAGE":
      return {
        ...state,
        currentPage: action.payload,
      };

    case "START_EDIT":
      return {
        ...state,
        editingId: action.payload?.id || null,
        editFile: null,
        editForm: {
          title: action.payload?.title || "",
          description: action.payload?.description || "",
          year: String(action.payload?.year || ""),
          is_published: Boolean(action.payload?.is_published),
        },
      };

    case "CANCEL_EDIT":
      return {
        ...state,
        editingId: null,
        editFile: null,
        editForm: { ...EMPTY_DOC_FORM },
      };

    case "SET_EDIT_FORM":
      return {
        ...state,
        editForm:
          typeof action.payload === "function"
            ? action.payload(state.editForm)
            : { ...state.editForm, ...action.payload },
      };

    case "SET_EDIT_FILE":
      return {
        ...state,
        editFile: action.payload,
      };

    case "SET_PUBLISHING_ID":
      return {
        ...state,
        publishingId: action.payload,
      };

    case "SET_SAVING_EDIT_ID":
      return {
        ...state,
        savingEditId: action.payload,
      };

    case "SET_DELETING_ID":
      return {
        ...state,
        deletingId: action.payload,
      };

    case "RESET_VIEW_STATE":
      return {
        ...state,
        yearFilter: "",
        currentPage: 1,
        editingId: null,
        editFile: null,
        actionFeedback: { type: "", message: "" },
      };

    default:
      return state;
  }
}
