import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const kota = searchParams.get("kota") || "2203";
    
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const date = String(d.getDate()).padStart(2, "0");

    const res = await fetch(
      `https://api.myquran.com/v2/sholat/jadwal/${kota}/${year}/${month}/${date}`,
      { cache: "no-store" }
    );
    
    if (!res.ok) {
      throw new Error(`MyQuran API responded with status ${res.status}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Sholat Proxy Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil jadwal sholat" },
      { status: 500 }
    );
  }
}
