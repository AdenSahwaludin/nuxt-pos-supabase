# Fitur Import/Export Produk CSV

## Overview

Fitur ini memungkinkan admin untuk mengimpor produk dari file CSV dan mengekspor data produk ke format CSV.

## Fitur Export

### 1. Export Semua Produk

- **Button**: "Export" di header page
- **Fungsi**: Mengekspor semua produk yang ada dalam database
- **Format File**: `produk_export_YYYY-MM-DD.csv`

### 2. Export Produk Terpilih

- **Button**: "Export Terpilih" di bulk actions (muncul saat ada produk yang dipilih)
- **Fungsi**: Mengekspor hanya produk yang dipilih dengan checkbox
- **Format File**: `produk_selected_YYYY-MM-DD.csv`

### 3. Download Template

- **Button**: "Unduh Template CSV" di modal import
- **Fungsi**: Mengunduh template CSV dengan contoh data
- **Format File**: `template_import_produk.csv`

## Format CSV

### Kolom yang Digunakan:

1. **id_produk** (wajib) - Barcode EAN-13 (13 digit angka)
2. **nama** (wajib) - Nama produk
3. **nomor_bpom** (opsional) - Nomor registrasi BPOM
4. **kategori_id** (wajib) - ID kategori (harus sudah ada di sistem)
5. **harga** (wajib) - Harga produk (angka)
6. **stok** (wajib) - Jumlah stok (angka)
7. **batas_stok** (opsional) - Batas minimum stok (default: 5)
8. **unit** (opsional) - Satuan produk (default: "pcs")
9. **gambar** (opsional) - URL gambar produk

### Contoh Data CSV:

```csv
id_produk,nama,nomor_bpom,kategori_id,harga,stok,batas_stok,unit,gambar
"1234567890123","Contoh Produk 1","MD 224510107023",1,15000,100,10,"pcs",""
"1234567890124","Contoh Produk 2","MD 224510107024",2,25000,50,5,"box",""
```

## Fitur Import

### Cara Menggunakan:

1. Klik button "Import" di header page
2. Modal import akan terbuka
3. Unduh template CSV jika diperlukan
4. Siapkan file CSV sesuai format
5. Pilih file CSV untuk diupload
6. Klik "Import Sekarang"

### Validasi Import:

- **Format File**: Hanya menerima file .csv
- **Header**: Harus sesuai format yang ditentukan
- **Barcode**: Harus 13 digit angka (EAN-13)
- **Duplikasi**: Tidak boleh ada barcode yang sudah ada
- **Kategori**: ID kategori harus sudah ada di sistem
- **Field Wajib**: id_produk, nama, kategori_id, harga, stok

### Hasil Import:

- Menampilkan jumlah total data yang diproses
- Menampilkan jumlah data yang berhasil diimport
- Menampilkan jumlah data yang gagal
- Menampilkan detail error untuk setiap kegagalan

## Error Handling

### Error yang Mungkin Terjadi:

1. **Format File Salah**: "Hanya file CSV yang diperbolehkan"
2. **Header Tidak Lengkap**: "Header yang diperlukan tidak ditemukan: [list]"
3. **Field Wajib Kosong**: "Field wajib tidak lengkap (id_produk, nama, kategori_id)"
4. **Format Barcode Salah**: "Barcode harus 13 digit angka"
5. **Duplikasi Barcode**: "Barcode [xxxx] sudah ada"
6. **Database Error**: Detail error dari Supabase

## Technical Notes

### CSV Parser

- Menggunakan custom parser yang mendukung quoted values
- Menangani koma dalam nilai yang dikutip
- Mendukung escape characters

### Database Operations

- Menggunakan Supabase client untuk insert data
- Validasi duplikasi dengan query `maybeSingle()`
- Batch processing untuk efisiensi

### File Download

- Menggunakan Blob API untuk generate file
- Automatic download dengan `createObjectURL()`
- Proper cleanup setelah download

## Security & Performance

### Security:

- Validasi tipe file di frontend
- Sanitasi input data
- Menggunakan parameterized queries

### Performance:

- Streaming CSV parsing untuk file besar
- Batch insert operations
- Progress tracking untuk user feedback

## Usage Examples

### Export All Products:

```javascript
const exportProduk = () => {
  // Export semua produk ke CSV
};
```

### Import from CSV:

```javascript
const importFromCSV = async () => {
  // Parse CSV dan import ke database
};
```
