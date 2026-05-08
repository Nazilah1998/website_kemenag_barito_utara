"use client";

import React, { useEffect } from "react";
import { useMessages } from "./pesan/hooks/useMessages";
import MessageFilters from "./pesan/components/MessageFilters";
import MessageTable from "./pesan/components/MessageTable";
import MessageCard from "./pesan/components/MessageCard";
import MessageDetailModal from "./pesan/components/MessageDetailModal";

export default function AdminPesanManager() {
    const {
        loading,
        selectedMsg,
        setSelectedMsg,
        toast,
        confirmData,
        setConfirmData,
        filterSubjek,
        setFilterSubjek,
        filterStatus,
        setFilterStatus,
        updateStatus,
        deleteMessage,
        filteredMessages
    } = useMessages();

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (selectedMsg || confirmData) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [selectedMsg, confirmData]);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-2xl border-4 border-slate-100 border-t-emerald-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Sinkronisasi Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Controls */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700 dark:text-emerald-400">Monitoring</p>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Kotak Masuk</h1>
                    <p className="mt-4 text-xs font-bold text-slate-500 dark:text-slate-400 max-w-md">Kelola pesan dan pengaduan masyarakat secara sistematis dan terstruktur.</p>
                </div>

                {/* Filters - Adaptive */}
                <MessageFilters
                    filterSubjek={filterSubjek}
                    setFilterSubjek={setFilterSubjek}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                />
            </div>

            {/* Main Content Area */}
            {filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-100 bg-white/50 py-32 dark:border-white/5">
                    <div className="mb-6 rounded-3xl bg-slate-50 p-6 dark:bg-white/5">
                        <svg className="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Arsip Kosong</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <MessageTable
                        messages={filteredMessages}
                        onOpen={setSelectedMsg}
                        onDelete={deleteMessage}
                    />

                    {/* Mobile Card View */}
                    <div className="grid gap-4 lg:hidden">
                        {filteredMessages.map((msg, idx) => (
                            <MessageCard
                                key={msg.id}
                                msg={msg}
                                idx={idx}
                                onOpen={setSelectedMsg}
                                onDelete={deleteMessage}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Detail Modal */}
            <MessageDetailModal
                msg={selectedMsg}
                onClose={() => setSelectedMsg(null)}
                onUpdateStatus={updateStatus}
            />

            {/* Notifications & Confirm */}
            {toast && (
                <div className="fixed bottom-10 left-1/2 z-[300] -translate-x-1/2 animate-in slide-in-from-bottom-12 duration-500">
                    <div className={`flex items-center gap-4 rounded-[1.5rem] border-2 px-8 py-5 shadow-2xl backdrop-blur-xl ${toast.type === "success"
                        ? "border-emerald-500/20 bg-white/90 text-emerald-900 dark:bg-slate-900/90 dark:text-emerald-400"
                        : "border-rose-500/20 bg-white/90 text-rose-900 dark:bg-slate-900/90 dark:text-rose-400"
                        }`}>
                        <div className={`h-2.5 w-2.5 rounded-full animate-pulse ${toast.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`} />
                        <p className="text-[10px] font-black uppercase tracking-widest">{toast.message}</p>
                    </div>
                </div>
            )}

            {confirmData && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setConfirmData(null)} />
                    <div className="relative w-full max-w-sm overflow-hidden rounded-[3rem] border-2 border-white bg-white p-10 shadow-2xl animate-in zoom-in duration-300 dark:border-white/5 dark:bg-slate-900">
                        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 dark:bg-rose-900/30">
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 className="text-center text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">Hapus Permanen?</h3>
                        <p className="mt-4 text-center text-xs font-bold text-slate-500 leading-relaxed px-4">{confirmData.message}</p>

                        <div className="mt-10 flex flex-col gap-3">
                            <button onClick={confirmData.onConfirm} className="h-14 w-full rounded-2xl bg-rose-600 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-rose-600/20 hover:bg-rose-700">Ya, Hapus Data</button>
                            <button onClick={() => setConfirmData(null)} className="h-14 w-full rounded-2xl bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:bg-white/5">Batalkan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
