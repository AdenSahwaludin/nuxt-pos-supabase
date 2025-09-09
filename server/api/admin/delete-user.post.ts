export default defineEventHandler(async (event) => {
  const db = event.context.supabase;
  const admin = event.context.supabaseAdmin;
  const body = await readBody<{
    id_pengguna?: string;
    kode?: string;
    email?: string;
    auth_uid?: string;
    user_id?: string;
    hard?: boolean;
  }>(event);

  // ---- 0) Validasi minimal input
  if (
    !body.id_pengguna &&
    !body.kode &&
    !body.email &&
    !body.auth_uid &&
    !body.user_id
  ) {
    throw createError({
      statusCode: 422,
      statusMessage:
        "Harus kirim salah satu identifier: id_pengguna | kode | email | auth_uid | user_id",
    });
  }

  // ---- 1) Resolve data pengguna (tabel app)
  // prioritas pencarian pakai identifier yang ada
  let pengguna: any | null = null;
  const tryFindPengguna = async () => {
    let q = db.schema("sbs").from("pengguna").select("*").limit(1);
    if (body.id_pengguna) q = q.eq("id_pengguna", body.id_pengguna);
    else if (body.kode) q = q.eq("kode", body.kode);
    else if (body.user_id) q = q.eq("user_id", body.user_id);
    else if (body.email) q = q.eq("email", body.email);

    const { data, error } = await q;
    if (error)
      throw createError({
        statusCode: 500,
        statusMessage: `Error finding pengguna: ${error.message}`,
      });
    pengguna = data?.[0] ?? null;
  };
  await tryFindPengguna();

  // ---- 2) Resolve auth UID
  let authUid = body.auth_uid || pengguna?.user_id || null;

  // kalau belum ada authUid tapi ada email → coba cari via Admin API (opsional)
  if (!authUid && body.email && admin) {
    try {
      // listUsers tidak ada filter email; untuk basis kecil OK
      const page1 = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      if (!page1.error) {
        authUid =
          page1.data.users.find((u: any) => u.email === body.email)?.id || null;
      }
    } catch (error) {
      console.warn("Failed to search auth users by email:", error);
    }
  }

  // ---- 3) Hapus di tabel aplikasi dulu (pakai admin jika ada biar lolos RLS)
  let deletedPengguna = false;
  if (pengguna) {
    const clientForTable = admin ?? db;
    const { error: eDel } = await clientForTable
      .schema("sbs")
      .from("pengguna")
      .delete()
      .eq("id_pengguna", pengguna.id_pengguna);

    if (eDel)
      throw createError({
        statusCode: 500,
        statusMessage: `Delete pengguna failed: ${eDel.message}`,
      });
    deletedPengguna = true;
  }

  // ---- 4) Hapus di Auth (kalau service role tersedia & ada UID)
  let deletedAuth = false;
  let warn: string | undefined;
  if (admin && authUid) {
    const deleteOptions =
      body.hard === false ? { shouldSoftDelete: true } : undefined;
    const { error: eAuth } = await admin.auth.admin.deleteUser(
      authUid,
      deleteOptions
    );
    if (eAuth) {
      warn = `Auth delete failed: ${eAuth.message}`;
    } else {
      deletedAuth = true;
    }
  } else if (!admin && authUid) {
    warn = "SERVICE ROLE missing: Auth user mungkin masih ada";
  } else if (!authUid) {
    warn = "Auth UID tidak ditemukan: user mungkin tidak ada di auth.users";
  }

  // ---- 5) Balikan hasil
  return {
    success: true,
    deleted: { pengguna: deletedPengguna, auth: deletedAuth },
    warning: warn,
    meta: {
      id_pengguna: pengguna?.id_pengguna ?? body.id_pengguna ?? null,
      auth_uid: authUid ?? null,
      email: body.email ?? pengguna?.email ?? null,
    },
  };
});
