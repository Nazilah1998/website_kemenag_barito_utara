"use client";

import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import Image from "next/image";
import { siteInfo } from "@/data/site";

export default function BarcodePage() {
  const portalUrl = siteInfo.siteUrl || "https://baritoutara.kemenag.go.id";

  const downloadQRCode = () => {
    const qrCanvas = document.getElementById("qr-code-canvas");
    if (!qrCanvas) return;

    const padding = 20; // adding slightly more padding to match visual look
    const border = 2;
    const borderRadius = 16; // rounded-2xl look
    const size = qrCanvas.width;

    const canvas = document.createElement("canvas");
    canvas.width = size + padding * 2;
    canvas.height = size + padding * 2;
    const ctx = canvas.getContext("2d");

    // Draw rounded rectangle
    const x = border / 2;
    const y = border / 2;
    const w = canvas.width - border;
    const h = canvas.height - border;
    const r = borderRadius;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    // Fill background
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Draw border
    ctx.lineWidth = border;
    ctx.strokeStyle = "#e2e8f0"; // slate-200 for a slightly more visible border
    ctx.stroke();

    // Draw QR Code in center
    ctx.drawImage(qrCanvas, padding, padding);

    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "QR-Code-Portal-Kemenag.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full flex flex-col items-center justify-center text-center p-10 bg-white border-2 border-slate-200 rounded-3xl shadow-xl">
        <Image
          src={siteInfo.logoSrc}
          alt="Logo Kemenag"
          width={100}
          height={100}
          className="mb-6 object-contain"
          unoptimized
        />
        <h1 className="text-xl md:text-2xl font-black mb-1 uppercase text-emerald-800">
          Kementerian Agama
        </h1>
        <h2 className="text-lg md:text-xl font-bold mb-8 uppercase text-emerald-700">
          Kabupaten Barito Utara
        </h2>

        <div className="bg-white p-4 rounded-xl border-2 border-slate-100 shadow-sm mb-8 inline-block">
          <QRCodeCanvas
            id="qr-code-canvas"
            value={portalUrl}
            size={250}
            level="H"
            fgColor="#000000"
            imageSettings={{
              src: "/assets/icons/kemenag-512.png",
              height: 50,
              width: 50,
              excavate: true,
            }}
          />
        </div>

        <p className="text-xl font-bold text-slate-800 mb-2">
          Scan QR Code
        </p>
        <p className="text-sm font-medium text-slate-500 mb-8 max-w-[250px]">
          Akses Portal Layanan Digital Kemenag Barito Utara
        </p>

        <button
          onClick={downloadQRCode}
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30"
        >
          Unduh PNG
        </button>
      </div>
    </div>
  );
}
