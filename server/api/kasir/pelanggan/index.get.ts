// @ts-nocheck
export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  try {
    switch (method) {
      case "GET":
        return await handleGet(event);
      case "POST":
        return await handlePost(event);
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

async function handleGet(event: any) {
  try {
    const supabase = useSupabaseServiceRole();

    // Get all pelanggan with pagination support
    const query = getQuery(event);
    const { page = "1", limit = "50", search, status } = query;

    let queryBuilder = supabase
      .from("pelanggan")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    // Apply search filter
    if (search) {
      queryBuilder = queryBuilder.or(
        `nama.ilike.%${search}%,email.ilike.%${search}%,telepon.ilike.%${search}%,id_pelanggan.ilike.%${search}%`
      );
    }

    // Apply status filter
    if (status) {
      queryBuilder = queryBuilder.eq("status", status);
    }

    // Apply pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;
    queryBuilder = queryBuilder.range(from, to);

    const { data, error, count } = await queryBuilder;

    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message,
      });
    }

    return {
      success: true,
      data: data || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
      },
    };
  } catch (error: any) {
    throw error;
  }
}

async function handlePost(event: any) {
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

    // Generate ID if not provided
    if (!body.id_pelanggan) {
      body.id_pelanggan = await generatePelangganId(supabase);
    }

    // Validate phone number (only digits)
    if (body.telepon && !/^\d+$/.test(body.telepon)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Nomor telepon hanya boleh berisi angka",
      });
    }

    // Set default status
    if (!body.status) {
      body.status = "aktif";
    }

    // Check if ID already exists
    const { data: existingPelanggan } = await supabase
      .from("pelanggan")
      .select("id_pelanggan")
      .eq("id_pelanggan", body.id_pelanggan)
      .single();

    if (existingPelanggan) {
      // Generate new ID if exists
      body.id_pelanggan = await generatePelangganId(supabase);
    }

    // Insert new pelanggan
    const { data, error } = await supabase
      .from("pelanggan")
      .insert([
        {
          id_pelanggan: body.id_pelanggan,
          nama: body.nama.trim(),
          email: body.email?.trim() || null,
          telepon: body.telepon?.trim() || null,
          alamat: body.alamat?.trim() || null,
          status: body.status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
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
      message: "Pelanggan berhasil ditambahkan",
    };
  } catch (error: any) {
    throw error;
  }
}

async function generatePelangganId(supabase: any) {
  try {
    // Get the latest pelanggan to determine next ID
    const { data, error } = await supabase
      .from("pelanggan")
      .select("id_pelanggan")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" error
      throw error;
    }

    let nextNumber = 1;
    if (data?.id_pelanggan) {
      // Extract number from ID (format: P001, P002, etc.)
      const match = data.id_pelanggan.match(/P(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    // Format as P001, P002, etc.
    return `P${nextNumber.toString().padStart(3, "0")}`;
  } catch (error) {
    // Fallback to timestamp-based ID
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `P${randomNum}`;
  }
}
