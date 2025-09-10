-- Sample data untuk testing halaman produk
-- Pastikan kategori sudah ada
INSERT INTO sbs.kategori (nama) VALUES 
('Elektronik'),
('Makanan & Minuman'), 
('Pakaian'),
('Buku & Alat Tulis'),
('Kesehatan')
ON CONFLICT (nama) DO NOTHING;

-- Sample produk
INSERT INTO sbs.produk (
  id_produk, 
  nama, 
  harga, 
  stok, 
  batas_stok, 
  unit, 
  id_kategori,
  gambar,
  nomor_bpom
) VALUES 
('PROD001', 'Smartphone Samsung A54', 4500000, 15, 5, 'pcs', 1, 'https://example.com/samsung-a54.jpg', 'BPOM001'),
('PROD002', 'Laptop Asus VivoBook', 8500000, 8, 3, 'pcs', 1, null, 'BPOM002'),
('PROD003', 'Indomie Goreng', 3500, 100, 20, 'pcs', 2, null, 'BPOM003'),
('PROD004', 'Kaos Polos Hitam', 75000, 50, 10, 'pcs', 3, null, null),
('PROD005', 'Buku Tulis 58 Lembar', 5000, 200, 50, 'pcs', 4, null, null),
('PROD006', 'Vitamin C 1000mg', 45000, 30, 10, 'botol', 5, null, 'BPOM006')
ON CONFLICT (id_produk) DO NOTHING;
