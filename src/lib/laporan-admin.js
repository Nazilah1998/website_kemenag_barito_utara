export const EMPTY_DOC_FORM = {
  title: "",
  description: "",
  year: "",
  is_published: true,
};

export function normalizeCategoryMap(category) {
  if (!category?.slug) return {};
  return {
    [category.slug]: Array.isArray(category.documents)
      ? category.documents
      : [],
  };
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

export function replaceDocumentInList(list = [], id, nextDocument) {
  return list.map((item) => (item.id === id ? nextDocument : item));
}

export function removeDocumentFromList(list = [], id) {
  return list.filter((item) => item.id !== id);
}

export function prependDocumentToList(list = [], document) {
  return [document, ...list];
}

export function createLaporanAdminInitialState({
  initialCategory,
  categories = [],
}) {
  const initialSlug = initialCategory?.slug || categories?.[0]?.slug || "";

  return {
    activeSlug: initialSlug,
    docsBySlug: normalizeCategoryMap(initialCategory),
    loadingSlug: null,

    docForm: EMPTY_DOC_FORM,
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
    editingId: null,
    editForm: EMPTY_DOC_FORM,

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
          [action.slug]: action.documents,
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
            : action.payload,
      };

    case "RESET_DOC_FORM":
      return {
        ...state,
        docForm: EMPTY_DOC_FORM,
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
      };

    case "SET_EDITING_ID":
      return {
        ...state,
        editingId: action.payload,
      };

    case "SET_EDIT_FORM":
      return {
        ...state,
        editForm:
          typeof action.payload === "function"
            ? action.payload(state.editForm)
            : action.payload,
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
        editingId: null,
        actionFeedback: { type: "", message: "" },
      };

    default:
      return state;
  }
}
