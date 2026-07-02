"use client";

import React, { useState, useEffect } from "react";
import { Calculator, Coins, Scale, AlertCircle, Info, ChevronRight, Calculator as CalcIcon } from "lucide-react";

export default function ZakatWarisCalculator() {
  const [activeTab, setActiveTab] = useState("zakat");

  // --- State Zakat ---
  const [zakatType, setZakatType] = useState("profesi");
  const [hargaEmas, setHargaEmas] = useState(1300000);
  const [pendapatan, setPendapatan] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [tabungan, setTabungan] = useState(0);
  const [investasi, setInvestasi] = useState(0);
  const [aset, setAset] = useState(0);

  const nisab = hargaEmas * 85;
  const nisabPerBulan = nisab / 12;

  // --- State Waris ---
  const [hartaWaris, setHartaWaris] = useState(0);
  const [biayaJenazah, setBiayaJenazah] = useState(0);
  const [utang, setUtang] = useState(0);
  const [wasiat, setWasiat] = useState(0);
  const [heirs, setHeirs] = useState({
    pasangan: "none", // none, suami, istri
    ayah: false,
    ibu: false,
    anakLaki: 0,
    anakPerempuan: 0,
  });

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const handleNumberInput = (setter) => (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setter(Number(val));
  };

  const renderZakat = () => {
    let isWajib = false;
    let zakatTotal = 0;
    let totalHarta = 0;
    let threshold = nisab;

    if (zakatType === "profesi") {
      totalHarta = pendapatan + bonus;
      threshold = nisabPerBulan;
      if (totalHarta >= threshold) {
        isWajib = true;
        zakatTotal = totalHarta * 0.025;
      }
    } else {
      totalHarta = tabungan + investasi + aset;
      threshold = nisab;
      if (totalHarta >= threshold) {
        isWajib = true;
        zakatTotal = totalHarta * 0.025;
      }
    }

    return (
      <div className="animate-fade-in-up space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-500" />
              Pengaturan Dasar
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Harga Emas Saat Ini (Per Gram)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">Rp</span>
                  <input
                    type="text"
                    value={hargaEmas.toLocaleString("id-ID")}
                    onChange={handleNumberInput(setHargaEmas)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-700 dark:text-slate-200 font-medium"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">Nisab Zakat (85 gr): <strong className="text-emerald-600 dark:text-emerald-400">{formatRupiah(nisab)}</strong></p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Jenis Zakat</label>
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => setZakatType("profesi")}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${zakatType === "profesi" ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                  >
                    Penghasilan (Profesi)
                  </button>
                  <button
                    onClick={() => setZakatType("maal")}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${zakatType === "maal" ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                  >
                    Harta (Maal)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-500" />
              {zakatType === "profesi" ? "Input Pendapatan" : "Input Harta"}
            </h3>
            
            {zakatType === "profesi" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Pendapatan Per Bulan</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">Rp</span>
                    <input
                      type="text"
                      value={pendapatan.toLocaleString("id-ID")}
                      onChange={handleNumberInput(setPendapatan)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-700 dark:text-slate-200 font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Bonus / THR (Opsional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">Rp</span>
                    <input
                      type="text"
                      value={bonus.toLocaleString("id-ID")}
                      onChange={handleNumberInput(setBonus)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-700 dark:text-slate-200 font-medium"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Tabungan / Deposito (1 Tahun)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">Rp</span>
                    <input
                      type="text"
                      value={tabungan.toLocaleString("id-ID")}
                      onChange={handleNumberInput(setTabungan)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-700 dark:text-slate-200 font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Nilai Emas / Logam Mulia</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">Rp</span>
                    <input
                      type="text"
                      value={investasi.toLocaleString("id-ID")}
                      onChange={handleNumberInput(setInvestasi)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-700 dark:text-slate-200 font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Aset Lancar Lainnya</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">Rp</span>
                    <input
                      type="text"
                      value={aset.toLocaleString("id-ID")}
                      onChange={handleNumberInput(setAset)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-700 dark:text-slate-200 font-medium"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hasil Zakat */}
        <div className={`rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 ${isWajib ? "bg-emerald-600 text-white shadow-xl shadow-emerald-900/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
          <div className="flex-1">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-2 opacity-80">Hasil Perhitungan</h4>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isWajib ? "bg-white animate-pulse" : "bg-slate-300"}`}></div>
              <p className={`text-xl font-black ${isWajib ? "text-white" : "text-slate-700 dark:text-slate-300"}`}>
                {isWajib ? "Wajib Menunaikan Zakat" : "Belum Wajib Zakat (Di Bawah Nisab)"}
              </p>
            </div>
            <p className="mt-2 text-sm opacity-90">
              Total {zakatType === "profesi" ? "pendapatan per bulan" : "harta Anda"} adalah {formatRupiah(totalHarta)} <br/>
              Batas Nisab: {formatRupiah(threshold)}
            </p>
          </div>
          
          <div className={`w-full md:w-auto p-5 rounded-xl text-center md:text-right ${isWajib ? "bg-emerald-700/50" : "bg-slate-200/50 dark:bg-slate-700/50"}`}>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Total Zakat (2,5%)</p>
            <p className={`text-3xl md:text-4xl font-black tracking-tight ${isWajib ? "text-amber-300" : "text-slate-400"}`}>
              {formatRupiah(zakatTotal)}
            </p>
            {zakatType === "profesi" && isWajib && (
              <p className="text-[10px] mt-2 opacity-80 font-medium">*Dikeluarkan setiap menerima gaji</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderWaris = () => {
    // Basic Faraid Simulation
    const hartaBersih = hartaWaris - biayaJenazah - utang - wasiat;
    
    // Simplification for basic demonstration
    let suami = 0, istri = 0, bapak = 0, ibu = 0, anakLakiTotal = 0, anakPerempuanTotal = 0;
    
    const adaAnak = heirs.anakLaki > 0 || heirs.anakPerempuan > 0;
    
    // Furudh (Fixed shares)
    if (heirs.pasangan === "suami") {
      suami = adaAnak ? 1/4 : 1/2;
    } else if (heirs.pasangan === "istri") {
      istri = adaAnak ? 1/8 : 1/4;
    }
    
    if (heirs.ayah) {
      bapak = 1/6; // Asumsi ada anak
    }
    
    if (heirs.ibu) {
      ibu = adaAnak ? 1/6 : 1/3; // Simplified
    }
    
    const totalFurudh = suami + istri + bapak + ibu;
    const sisaAshabah = Math.max(0, 1 - totalFurudh);
    
    // Ashabah distribution
    let porsiLaki = 0;
    let porsiPerempuan = 0;
    
    if (heirs.anakLaki > 0 && heirs.anakPerempuan > 0) {
      const totalBagianAnak = (heirs.anakLaki * 2) + heirs.anakPerempuan;
      porsiLaki = (2 / totalBagianAnak) * sisaAshabah;
      porsiPerempuan = (1 / totalBagianAnak) * sisaAshabah;
    } else if (heirs.anakLaki > 0) {
      porsiLaki = sisaAshabah / heirs.anakLaki;
    } else if (heirs.anakPerempuan > 0) {
      // Simplified: If only girls, they get 1/2 or 2/3 as furudh, rest is rad/ashabah. 
      // For this basic simulator, we will just give them the remainder.
      porsiPerempuan = sisaAshabah / heirs.anakPerempuan;
    }

    return (
      <div className="animate-fade-in-up space-y-6">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-400">
            <strong className="block mb-1">Perhatian: Simulasi Dasar</strong>
            Hasil perhitungan ini adalah <strong>simulasi dasar</strong> (Hanya Ahli Waris Utama/Dzawil Furudh) dan <strong>bukan fatwa sah</strong>. 
            Hukum Faraid sangat kompleks dan dipengaruhi oleh banyak faktor penangkal (Hijab). Untuk pembagian riil, mohon berkonsultasi langsung ke <strong>KUA atau Pengadilan Agama</strong> setempat.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-500" />
                Harta Peninggalan
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Total Harta Warisan</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">Rp</span>
                    <input type="text" value={hartaWaris.toLocaleString("id-ID")} onChange={handleNumberInput(setHartaWaris)} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 dark:text-slate-200 font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Biaya Jenazah</label>
                    <input type="text" value={biayaJenazah.toLocaleString("id-ID")} onChange={handleNumberInput(setBiayaJenazah)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 dark:text-slate-200 font-medium text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Utang Almarhum</label>
                    <input type="text" value={utang.toLocaleString("id-ID")} onChange={handleNumberInput(setUtang)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 dark:text-slate-200 font-medium text-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-500" />
                Ahli Waris (Keluarga Inti)
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Pasangan Hidup</label>
                  <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <button onClick={() => setHeirs({...heirs, pasangan: "none"})} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${heirs.pasangan === "none" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm" : "text-slate-500"}`}>Tidak Ada</button>
                    <button onClick={() => setHeirs({...heirs, pasangan: "suami"})} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${heirs.pasangan === "suami" ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-500"}`}>Suami</button>
                    <button onClick={() => setHeirs({...heirs, pasangan: "istri"})} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${heirs.pasangan === "istri" ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-500"}`}>Istri</button>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <input type="checkbox" checked={heirs.ayah} onChange={(e) => setHeirs({...heirs, ayah: e.target.checked})} className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
                    Bapak Masih Hidup
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <input type="checkbox" checked={heirs.ibu} onChange={(e) => setHeirs({...heirs, ibu: e.target.checked})} className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
                    Ibu Masih Hidup
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Jumlah Anak Laki-Laki</label>
                    <input type="number" min="0" value={heirs.anakLaki} onChange={(e) => setHeirs({...heirs, anakLaki: parseInt(e.target.value)||0})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 dark:text-slate-200 font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Jumlah Anak Perempuan</label>
                    <input type="number" min="0" value={heirs.anakPerempuan} onChange={(e) => setHeirs({...heirs, anakPerempuan: parseInt(e.target.value)||0})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 dark:text-slate-200 font-bold" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-900/5 dark:bg-emerald-900/10 rounded-2xl p-5 md:p-6 border border-emerald-100 dark:border-emerald-900/30 flex flex-col h-full">
            <h3 className="font-black text-emerald-800 dark:text-emerald-400 text-lg mb-6 border-b border-emerald-200 dark:border-emerald-800/50 pb-4">
              Hasil Simulasi Pembagian
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center bg-white/60 dark:bg-slate-900/50 p-3 rounded-lg">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Harta Bersih</span>
                <span className="text-lg font-black text-slate-800 dark:text-slate-200">{formatRupiah(Math.max(0, hartaBersih))}</span>
              </div>
            </div>

            {hartaBersih > 0 ? (
              <div className="space-y-3 flex-1">
                {heirs.pasangan === "suami" && (
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Suami (1 orang)</p>
                      <p className="text-xs text-slate-500">Porsi: {suami === 1/4 ? "1/4" : "1/2"}</p>
                    </div>
                    <p className="font-black text-emerald-600 dark:text-emerald-400 text-lg">{formatRupiah(hartaBersih * suami)}</p>
                  </div>
                )}
                
                {heirs.pasangan === "istri" && (
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Istri</p>
                      <p className="text-xs text-slate-500">Porsi: {istri === 1/8 ? "1/8" : "1/4"}</p>
                    </div>
                    <p className="font-black text-emerald-600 dark:text-emerald-400 text-lg">{formatRupiah(hartaBersih * istri)}</p>
                  </div>
                )}

                {heirs.ayah && (
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Ayah</p>
                      <p className="text-xs text-slate-500">Porsi: 1/6</p>
                    </div>
                    <p className="font-black text-emerald-600 dark:text-emerald-400 text-lg">{formatRupiah(hartaBersih * bapak)}</p>
                  </div>
                )}

                {heirs.ibu && (
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Ibu</p>
                      <p className="text-xs text-slate-500">Porsi: {ibu === 1/6 ? "1/6" : "1/3"}</p>
                    </div>
                    <p className="font-black text-emerald-600 dark:text-emerald-400 text-lg">{formatRupiah(hartaBersih * ibu)}</p>
                  </div>
                )}

                {heirs.anakLaki > 0 && (
                  <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-800/50">
                    <div>
                      <p className="font-bold text-emerald-800 dark:text-emerald-300">Anak Laki-Laki ({heirs.anakLaki} orang)</p>
                      <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">Porsi Ashabah (2 Bagian)</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-emerald-700 dark:text-emerald-400 text-lg">{formatRupiah(hartaBersih * porsiLaki * heirs.anakLaki)}</p>
                      <p className="text-[10px] text-emerald-600/70 font-bold">{formatRupiah(hartaBersih * porsiLaki)} / orang</p>
                    </div>
                  </div>
                )}

                {heirs.anakPerempuan > 0 && (
                  <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-800/50">
                    <div>
                      <p className="font-bold text-emerald-800 dark:text-emerald-300">Anak Perempuan ({heirs.anakPerempuan} orang)</p>
                      <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">Porsi Ashabah (1 Bagian)</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-emerald-700 dark:text-emerald-400 text-lg">{formatRupiah(hartaBersih * porsiPerempuan * heirs.anakPerempuan)}</p>
                      <p className="text-[10px] text-emerald-600/70 font-bold">{formatRupiah(hartaBersih * porsiPerempuan)} / orang</p>
                    </div>
                  </div>
                )}

                {sisaAshabah > 0 && heirs.anakLaki === 0 && heirs.anakPerempuan === 0 && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                    <p className="text-xs text-slate-500 font-medium">Masih ada sisa harta ashabah sebesar <strong>{formatRupiah(hartaBersih * sisaAshabah)}</strong> yang berhak diberikan kepada saudara/kerabat lain (jika tidak terhijab).</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-50 py-10">
                <Info className="w-12 h-12 mb-3 text-slate-400" />
                <p className="text-sm font-medium text-center text-slate-500">Harta bersih tidak mencukupi atau masih Rp 0.<br/>Silakan isi data di sebelah kiri.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto">
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-2 mb-8 bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/5 backdrop-blur-md w-full sm:w-auto sm:inline-flex mx-auto justify-center">
        <button
          onClick={() => setActiveTab("zakat")}
          className={`flex flex-1 sm:flex-none justify-center items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-black text-sm md:text-base tracking-tight transition-all duration-300 ${
            activeTab === "zakat"
              ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-900/10"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Coins className="w-5 h-5" />
          Kalkulator Zakat
        </button>
        <button
          onClick={() => setActiveTab("waris")}
          className={`flex flex-1 sm:flex-none justify-center items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-black text-sm md:text-base tracking-tight transition-all duration-300 ${
            activeTab === "waris"
              ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-500 shadow-lg shadow-amber-900/10"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Scale className="w-5 h-5" />
          Simulasi Waris (Faraid)
        </button>
      </div>

      {/* Content */}
      <div className="relative w-full">
        {activeTab === "zakat" ? renderZakat() : renderWaris()}
      </div>
    </div>
  );
}
