import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminLaporanCategoryManager from "../src/components/admin/AdminLaporanCategoryManager";

vi.mock("../src/lib/laporan-api", () => ({
    fetchCategoryDocuments: vi.fn(),
    uploadLaporanDocument: vi.fn(),
    updateLaporanDocument: vi.fn(),
    deleteLaporanDocument: vi.fn(),
}));

describe("AdminLaporanCategoryManager", () => {
    const categories = [
        {
            id: "1",
            slug: "laporan-tahunan",
            title: "Laporan Tahunan",
            description: "Kumpulan laporan tahunan",
        },
        {
            id: "2",
            slug: "laporan-kinerja",
            title: "Laporan Kinerja",
            description: "Dokumen laporan kinerja",
        },
    ];

    const category = {
        id: "1",
        slug: "laporan-tahunan",
        title: "Laporan Tahunan",
        description: "Kumpulan laporan tahunan",
        documents: [
            {
                id: 101,
                title: "Laporan 2025",
                description: "Deskripsi laporan 2025",
                year: "2025",
                is_published: true,
                file_size: 2048,
                file_url: "https://example.com/laporan-2025.pdf",
            },
        ],
    };

    it("renders category panel, upload panel, and document list", () => {
        render(
            <AdminLaporanCategoryManager
                category={category}
                categories={categories}
            />,
        );

        expect(screen.getByText("Pilih Kategori")).toBeInTheDocument();
        expect(screen.getByText("Upload Dokumen PDF")).toBeInTheDocument();
        expect(screen.getByText("Daftar Dokumen")).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /laporan tahunan/i }),
        ).toBeInTheDocument();

        expect(screen.getByText("Laporan 2025")).toBeInTheDocument();
        expect(screen.getByText("Deskripsi laporan 2025")).toBeInTheDocument();
    });

    it("shows upload button and category switch buttons", () => {
        render(
            <AdminLaporanCategoryManager
                category={category}
                categories={categories}
            />,
        );

        expect(
            screen.getByRole("button", { name: /upload dokumen/i }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /laporan tahunan/i }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /laporan kinerja/i }),
        ).toBeInTheDocument();
    });
});