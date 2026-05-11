"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

// ─── Inline SVG Icons ───────────────────────────────────────────────────────
const IconBot = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);
const IconX = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconSend = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const IconChevronDown = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconSparkle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
  </svg>
);
const IconTrash = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

// ─── Quick Action Buttons ────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  "Siapa Kepala Kemenag?",
  "Layanan apa saja?",
  "Jam buka kantor?",
  "Persyaratan daftar haji?",
  "Berapa biaya nikah?",
  "Layanan sertifikasi halal?",
  "Lokasi & Kontak kantor?",
  "Syarat pindah madrasah?",
];

// ─── Format time ─────────────────────────────────────────────────────────────
const formatTime = (date) =>
  date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

// ─── Typing Indicator ────────────────────────────────────────────────────────
const TypingDots = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "4px 0",
    }}
  >
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#10b981",
          display: "inline-block",
          animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }}
      />
    ))}
    <style>{`
      @keyframes typingBounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-6px); opacity: 1; }
      }
      @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95) translateY(8px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes pulseGreen {
        0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
        50% { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
      }
    `}</style>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Halo! Saya Asisten Virtual Kemenag Barito Utara 👋\nAda yang bisa saya bantu hari ini?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(
        () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = async (text) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMsg = { role: "user", content: messageText, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setShowQuickActions(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await res.json();

      if (data.error) {
        // Tampilkan pesan error dari server langsung (termasuk pesan rate-limit yang ramah)
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error, time: new Date() },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content, time: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Maaf, koneksi terganggu. Silakan coba lagi atau hubungi kami via WhatsApp.",
          time: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Halo! Saya Asisten Virtual Kemenag Barito Utara 👋\nAda yang bisa saya bantu hari ini?",
        time: new Date(),
      },
    ]);
    setShowQuickActions(true);
    setInput("");
    setShowResetConfirm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };
  const handleQuickAction = (text) => sendMessage(text);

  // ─── FAB Button ──────────────────────────────────────────────────────────
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Buka Chat Asisten"
        className="ai-fab-button"
        style={{
          position: "fixed",
          zIndex: 9999,
          background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
          border: "none",
          borderRadius: "50%",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            "0 4px 24px rgba(5,150,105,0.45), 0 2px 8px rgba(0,0,0,0.2)",
          transition: "transform 0.2s, box-shadow 0.2s",
          animation: "pulseGreen 2.5s ease-in-out infinite",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.animation = "none";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.animation =
            "pulseGreen 2.5s ease-in-out infinite";
        }}
      >
        <Image
          src="/kemenag-512.png"
          alt="Kemenag"
          width={40}
          height={40}
          style={{
            width: "65%",
            height: "65%",
            objectFit: "contain",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 14,
            height: 14,
            background: "#ef4444",
            borderRadius: "50%",
            border: "2px solid #fff",
          }}
        />
        <style>{`
          .ai-fab-button {
            bottom: 28px; right: 28px;
            width: 60px; height: 60px;
          }
          @media (max-width: 768px) {
            .ai-fab-button {
              bottom: 20px; right: 20px;
              width: 52px; height: 52px;
            }
          }
          @keyframes pulseGreen { 0%,100%{box-shadow:0 4px 24px rgba(5,150,105,0.45),0 2px 8px rgba(0,0,0,0.2)}50%{box-shadow:0 4px 32px rgba(5,150,105,0.7),0 2px 12px rgba(0,0,0,0.25)} }
        `}</style>
      </button>
    );
  }

  // ─── Chat Window ─────────────────────────────────────────────────────────
  return (
    <div
      className="ai-chat-window"
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 9999,
        background: "rgba(10, 15, 25, 0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: 28,
        boxShadow:
          "0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* ── Custom Reset Confirmation Modal ──────────────── */}
      {showResetConfirm && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            animation: "fadeSlideIn 0.2s ease",
          }}
        >
          <div
            style={{
              background: "#1a2234",
              borderRadius: 20,
              padding: "24px 20px",
              width: "100%",
              maxWidth: 300,
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                background: "rgba(239,68,68,0.15)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                color: "#ef4444",
              }}
            >
              <IconTrash />
            </div>
            <h3
              style={{
                color: "#fff",
                fontSize: 17,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Hapus Riwayat?
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 13,
                lineHeight: 1.5,
                marginBottom: 20,
              }}
            >
              Seluruh percakapan Anda akan dihapus dan tidak dapat dikembalikan.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowResetConfirm(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Batal
              </button>
              <button
                onClick={handleReset}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 12,
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Header ─────────────────────────────────────────── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #065f46 0%, #059669 60%, #10b981 100%)",
          padding: "18px 20px 16px",
          position: "relative",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            background: "rgba(255,255,255,0.06)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: 60,
            width: 80,
            height: 80,
            background: "rgba(255,255,255,0.04)",
            borderRadius: "50%",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Avatar */}
            <div
              style={{
                width: 44,
                height: 44,
                background: "rgba(255,255,255,0.15)",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1.5px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                flexShrink: 0,
              }}
            >
              <Image
                src="/kemenag-512.png"
                alt="Logo"
                width={32}
                height={32}
                style={{ width: "70%", height: "70%", objectFit: "contain" }}
              />
            </div>
            <div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: "-0.2px",
                }}
              >
                Asisten Kemenag
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 3,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    background: "#86efac",
                    borderRadius: "50%",
                    display: "inline-block",
                    boxShadow: "0 0 6px #86efac",
                  }}
                />
                <span
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: 11.5,
                    fontWeight: 500,
                  }}
                >
                  Online • Siap Membantu
                </span>
              </div>
            </div>
          </div>
          {/* Action buttons */}
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setShowResetConfirm(true)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                border: "none",
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.22)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
              }
              title="Hapus Riwayat"
              aria-label="Hapus Riwayat"
            >
              <IconTrash />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                border: "none",
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.22)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
              }
              aria-label="Tutup"
            >
              <IconChevronDown />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                border: "none",
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(239,68,68,0.3)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
              }
              aria-label="Tutup"
            >
              <IconX />
            </button>
          </div>
        </div>
      </div>

      {/* ── Messages ───────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "16px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.1) transparent",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: msg.role === "user" ? "flex-end" : "flex-start",
              animation: "fadeSlideIn 0.3s ease",
            }}
          >
            <div
              style={{
                maxWidth: "82%",
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg, #059669, #10b981)"
                    : "rgba(255,255,255,0.07)",
                border:
                  msg.role === "user"
                    ? "none"
                    : "1px solid rgba(255,255,255,0.09)",
                borderRadius:
                  msg.role === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                padding: "11px 14px",
                color: "#fff",
                fontSize: 13.5,
                lineHeight: 1.55,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                boxShadow:
                  msg.role === "user"
                    ? "0 4px 16px rgba(5,150,105,0.3)"
                    : "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              {msg.content}
            </div>
            <span
              style={{
                fontSize: 10.5,
                color: "rgba(255,255,255,0.3)",
                marginTop: 4,
                paddingLeft: 4,
                paddingRight: 4,
              }}
            >
              {formatTime(msg.time)}
            </span>
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              animation: "fadeSlideIn 0.3s ease",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "18px 18px 18px 4px",
                padding: "10px 14px",
              }}
            >
              <TypingDots />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {showQuickActions && messages.length === 1 && (
          <div style={{ animation: "fadeSlideIn 0.4s ease 0.2s both" }}>
            <p
              style={{
                fontSize: 11.5,
                color: "rgba(255,255,255,0.35)",
                marginBottom: 8,
                paddingLeft: 2,
              }}
            >
              Pertanyaan Populer:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {QUICK_ACTIONS.map((qa) => (
                <button
                  key={qa}
                  onClick={() => handleQuickAction(qa)}
                  style={{
                    background: "rgba(16,185,129,0.1)",
                    border: "1px solid rgba(16,185,129,0.25)",
                    borderRadius: 20,
                    padding: "6px 12px",
                    color: "#6ee7b7",
                    fontSize: 12,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(16,185,129,0.2)";
                    e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(16,185,129,0.1)";
                    e.currentTarget.style.borderColor = "rgba(16,185,129,0.25)";
                  }}
                >
                  {qa}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ──────────────────────────────────────────── */}
      <div
        style={{
          padding: "12px 14px 16px",
          background: "rgba(255,255,255,0.03)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            padding: "8px 8px 8px 16px",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
          }
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pesan..."
            disabled={isLoading}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: 13.5,
              fontFamily: "inherit",
              caretColor: "#10b981",
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              border: "none",
              background:
                input.trim() && !isLoading
                  ? "linear-gradient(135deg, #059669, #10b981)"
                  : "rgba(255,255,255,0.08)",
              color:
                input.trim() && !isLoading ? "#fff" : "rgba(255,255,255,0.25)",
              cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              flexShrink: 0,
              boxShadow:
                input.trim() && !isLoading
                  ? "0 2px 12px rgba(5,150,105,0.4)"
                  : "none",
            }}
          >
            <IconSend />
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            fontSize: 10,
            color: "rgba(255,255,255,0.18)",
            marginTop: 8,
            letterSpacing: "0.3px",
          }}
        >
          Kecerdasan Buatan Terpadu (100 Model AI) · Kemenag Barito Utara
        </p>
      </div>

      <style>{`
        .ai-chat-window {
          width: 440px;
          height: 700px;
        }
        @media (max-width: 1024px) {
          .ai-chat-window {
            width: 400px;
            height: 650px;
            bottom: 24px;
            right: 24px;
          }
        }
        @media (max-width: 768px) {
          .ai-chat-window {
            width: 380px;
            height: 600px;
            bottom: 20px;
            right: 20px;
            border-radius: 24px;
          }
        }
        @media (max-width: 480px) {
          .ai-chat-window {
            left: 12px;
            right: 12px;
            width: auto;
            height: min(650px, calc(100vh - 100px));
            bottom: 12px;
            border-radius: 24px;
          }
        }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.92) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes typingBounce { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-5px);opacity:1} }
      `}</style>
    </div>
  );
};

export default ChatWidget;
