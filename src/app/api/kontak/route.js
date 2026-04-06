export async function POST(request) {
  const body = await request.json();
  const { nama, email, pesan } = body;

  if (!nama || !email || !pesan) {
    return Response.json(
      { message: "Semua field wajib diisi." },
      { status: 400 }
    );
  }

  // Tahap awal: log ke server.
  // Tahap lanjut: simpan ke database / kirim email notifikasi.
  console.log("Pesan masuk:", body);

  return Response.json({
    message: "Pesan berhasil dikirim. Terima kasih.",
  });
}