// @ts-nocheck
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID pelanggan is required",
    });
  }

  try {
    switch (method) {
      case "GET":
        return await handleGet(event, id);
      case "PUT":
        return await handlePut(event, id);
      case "DELETE":
        return await handleDelete(event, id);
      default:
        throw createError({
          statusCode: 405,
          statusMessage: "Method Not Allowed",
        });
    }
  } catch (error: any) {
    console.error("Pelanggan API Error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal Server Error",
    });
  }
});

async function handleGet(event: any, id: string) {
  try {
    const supabase = useSupabaseServiceRole();

    const { data, error } = await supabase
      .from("pelanggan")
      .select("*")
      .eq("id_pelanggan", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw createError({
          statusCode: 404,
          statusMessage: "Pelanggan not found",
        });
      }
      throw createError({
        statusCode: 400,
        statusMessage: error.message,
      });
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    throw error;
  }
}

async function handlePut(event: any, id: string) {
  try {
    const supabase = useSupabaseServiceRole();
    const body = await readBody(event);

    // Validate required fields
    if (!body.nama) {
      throw createError({
        statusCode: 400,
        statusMessage: "Nama is required",
      });
    }

    // Validate phone number (only digits)
    if (body.telepon && !/^\d+$/.test(body.telepon)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Nomor telepon hanya boleh berisi angka",
      });
    }

    // Check if pelanggan exists
    const { data: existingPelanggan } = await supabase
      .from("pelanggan")
      .select("id_pelanggan")
      .eq("id_pelanggan", id)
      .single();

    if (!existingPelanggan) {
      throw createError({
        statusCode: 404,
        statusMessage: "Pelanggan not found",
      });
    }

    // Update pelanggan
    const { data, error } = await supabase
      .from("pelanggan")
      .update({
        nama: body.nama.trim(),
        email: body.email?.trim() || null,
        telepon: body.telepon?.trim() || null,
        alamat: body.alamat?.trim() || null,
        status: body.status || "aktif",
        updated_at: new Date().toISOString(),
      })
      .eq("id_pelanggan", id)
      .select()
      .single();

    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message,
      });
    }

    return {
      success: true,
      data,
      message: "Pelanggan berhasil diperbarui",
    };
  } catch (error: any) {
    throw error;
  }
}

async function handleDelete(event: any, id: string) {
  try {
    const supabase = useSupabaseServiceRole();

    // Check if pelanggan exists
    const { data: existingPelanggan } = await supabase
      .from("pelanggan")
      .select("id_pelanggan")
      .eq("id_pelanggan", id)
      .single();

    if (!existingPelanggan) {
      throw createError({
        statusCode: 404,
        statusMessage: "Pelanggan not found",
      });
    }

    // Check if pelanggan has transactions
    const { data: transactions } = await supabase
      .from("transaksi")
      .select("id_transaksi")
      .eq("id_pelanggan", id)
      .limit(1);

    if (transactions && transactions.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Tidak dapat menghapus pelanggan yang memiliki riwayat transaksi",
      });
    }

    // Delete pelanggan
    const { error } = await supabase
      .from("pelanggan")
      .delete()
      .eq("id_pelanggan", id);

    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message,
      });
    }

    return {
      success: true,
      message: "Pelanggan berhasil dihapus",
    };
  } catch (error: any) {
    throw error;
  }
}
