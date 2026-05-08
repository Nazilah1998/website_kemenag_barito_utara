"use client";

import React from "react";
import { useKontakForm } from "@/hooks/useKontakForm";
import { KontakFormHeader, KontakFormActions, KontakFormStatus } from "./components/KontakFormUI";
import { KontakFormFields } from "./components/KontakFormFields";

export default function KontakForm() {
  const {
    form,
    loading,
    result,
    onChange,
    onSubmit,
    getFieldError,
  } = useKontakForm();

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      noValidate
    >
      <KontakFormHeader />

      <KontakFormFields
        form={form}
        onChange={onChange}
        getFieldError={getFieldError}
      />

      <KontakFormActions loading={loading} />

      <KontakFormStatus result={result} />
    </form>
  );
}
