// Utility functions untuk cetak struk thermal printer
export interface TransaksiStruk {
  nomor_transaksi: string;
  tanggal_transaksi: string;
  total_bayar: number;
  total_item: number;
  subtotal: number;
  diskon_nominal: number;
  pajak_nominal: number;
  biaya_tambahan: number;
  metode_bayar: string;
  pelanggan?: {
    nama: string;
    telepon: string;
  };
  nama_pelanggan_manual?: string;
  telepon_pelanggan_manual?: string;
  kasir?: {
    nama: string;
  };
  items: Array<{
    nama_produk: string;
    harga_satuan: number;
    jumlah: number;
    subtotal_item: number;
  }>;
}

export class StrukPrinter {
  private static readonly CHAR_WIDTH = 32; // Lebar karakter untuk thermal printer 58mm

  /**
   * Generate struk dalam format text untuk thermal printer
   */
  static generateStrukText(transaksi: TransaksiStruk): string {
    let struk = "";

    // Header toko
    struk += this.centerText("CAP DAUN KAYU PUTIH") + "\n";
    struk += this.centerText("Jl. Contoh No. 123") + "\n";
    struk += this.centerText("Telp: 0821-xxxx-xxxx") + "\n";
    struk += this.separator() + "\n";

    // Info transaksi
    struk +=
      this.leftRightText("No. Transaksi", transaksi.nomor_transaksi) + "\n";
    struk +=
      this.leftRightText(
        "Tanggal",
        this.formatDateTime(transaksi.tanggal_transaksi)
      ) + "\n";

    // Info pelanggan (jika ada)
    const namaPelanggan =
      transaksi.pelanggan?.nama || transaksi.nama_pelanggan_manual;
    if (namaPelanggan && namaPelanggan !== "-") {
      struk += this.leftRightText("Pelanggan", namaPelanggan) + "\n";
    }

    // Info kasir
    if (transaksi.kasir?.nama) {
      struk += this.leftRightText("Kasir", transaksi.kasir.nama) + "\n";
    }

    struk += this.separator() + "\n";

    // Header item
    struk +=
      this.padText("Item", 20) +
      this.padText("Qty", 4) +
      this.padText("Total", 8) +
      "\n";
    struk += this.separator("-") + "\n";

    // Daftar item
    for (const item of transaksi.items) {
      // Nama produk (bisa panjang, jadi potong jika perlu)
      const namaProduk =
        item.nama_produk.length > 19
          ? item.nama_produk.substring(0, 16) + "..."
          : item.nama_produk;

      struk +=
        this.padText(namaProduk, 20) +
        this.padText(item.jumlah.toString(), 4) +
        this.padText(this.formatCurrency(item.subtotal_item), 8) +
        "\n";

      // Harga satuan di baris kedua jika perlu
      if (item.jumlah > 1) {
        struk +=
          this.padText(`  @ ${this.formatCurrency(item.harga_satuan)}`, 20) +
          "\n";
      }
    }

    struk += this.separator("-") + "\n";

    // Summary
    struk +=
      this.leftRightText("Subtotal", this.formatCurrency(transaksi.subtotal)) +
      "\n";

    if (transaksi.diskon_nominal > 0) {
      struk +=
        this.leftRightText(
          "Diskon",
          `-${this.formatCurrency(transaksi.diskon_nominal)}`
        ) + "\n";
    }

    if (transaksi.pajak_nominal > 0) {
      struk +=
        this.leftRightText(
          "Pajak",
          this.formatCurrency(transaksi.pajak_nominal)
        ) + "\n";
    }

    if (transaksi.biaya_tambahan > 0) {
      struk +=
        this.leftRightText(
          "Biaya Tambahan",
          this.formatCurrency(transaksi.biaya_tambahan)
        ) + "\n";
    }

    struk += this.separator() + "\n";
    struk +=
      this.leftRightText(
        "TOTAL",
        this.formatCurrency(transaksi.total_bayar),
        true
      ) + "\n";
    struk += this.leftRightText("Pembayaran", transaksi.metode_bayar) + "\n";
    struk += this.separator() + "\n";

    // Footer
    struk += this.centerText("TERIMA KASIH") + "\n";
    struk += this.centerText("Barang yang sudah dibeli") + "\n";
    struk += this.centerText("tidak dapat dikembalikan") + "\n";
    struk += "\n\n\n"; // Extra space untuk potong kertas

    return struk;
  }

  /**
   * Print struk ke thermal printer via web browser
   */
  static async printStruk(transaksi: TransaksiStruk): Promise<void> {
    const strukText = this.generateStrukText(transaksi);

    // Buat window baru untuk print
    const printWindow = window.open("", "_blank", "width=300,height=600");

    if (!printWindow) {
      throw new Error(
        "Gagal membuka window printer. Pastikan popup tidak diblokir."
      );
    }

    // CSS untuk thermal printer
    const printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Struk - ${transaksi.nomor_transaksi}</title>
        <style>
          @page {
            size: 58mm auto;
            margin: 0;
          }
          
          body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.2;
            margin: 0;
            padding: 2mm;
            width: 54mm;
            background: white;
          }
          
          .struk-content {
            white-space: pre-line;
            word-wrap: break-word;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="struk-content">${strukText}</div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 1000);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();
  }

  /**
   * Download struk sebagai file text
   */
  static downloadStruk(transaksi: TransaksiStruk): void {
    const strukText = this.generateStrukText(transaksi);
    const blob = new Blob([strukText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `struk-${transaksi.nomor_transaksi}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  // Helper methods
  private static centerText(text: string): string {
    const padding = Math.max(
      0,
      Math.floor((this.CHAR_WIDTH - text.length) / 2)
    );
    return " ".repeat(padding) + text;
  }

  private static leftRightText(
    left: string,
    right: string,
    bold = false
  ): string {
    const maxLeftLength = this.CHAR_WIDTH - right.length - 1;
    const leftText =
      left.length > maxLeftLength
        ? left.substring(0, maxLeftLength - 3) + "..."
        : left;
    const padding = this.CHAR_WIDTH - leftText.length - right.length;

    let result = leftText + " ".repeat(Math.max(1, padding)) + right;

    if (bold) {
      // Untuk thermal printer yang support ESC/POS commands
      result = "\x1B\x45\x01" + result + "\x1B\x45\x00"; // Bold on/off
    }

    return result;
  }

  private static padText(text: string, width: number): string {
    if (text.length >= width) {
      return text.substring(0, width);
    }
    return text + " ".repeat(width - text.length);
  }

  private static separator(char = "="): string {
    return char.repeat(this.CHAR_WIDTH);
  }

  private static formatCurrency(amount: number): string {
    // Format compact untuk struk (tanpa Rp, pakai ribu dengan k)
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1) + "jt";
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 0) + "k";
    }
    return amount.toString();
  }

  private static formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

// ESC/POS Commands untuk thermal printer (opsional untuk advanced features)
export class ESCPOSCommands {
  // Font commands
  static readonly FONT_A = "\x1B\x4D\x00"; // Font A (12x24)
  static readonly FONT_B = "\x1B\x4D\x01"; // Font B (9x17)

  // Style commands
  static readonly BOLD_ON = "\x1B\x45\x01";
  static readonly BOLD_OFF = "\x1B\x45\x00";
  static readonly UNDERLINE_ON = "\x1B\x2D\x01";
  static readonly UNDERLINE_OFF = "\x1B\x2D\x00";

  // Alignment
  static readonly ALIGN_LEFT = "\x1B\x61\x00";
  static readonly ALIGN_CENTER = "\x1B\x61\x01";
  static readonly ALIGN_RIGHT = "\x1B\x61\x02";

  // Text size
  static readonly SIZE_NORMAL = "\x1D\x21\x00";
  static readonly SIZE_DOUBLE_HEIGHT = "\x1D\x21\x01";
  static readonly SIZE_DOUBLE_WIDTH = "\x1D\x21\x10";
  static readonly SIZE_DOUBLE_BOTH = "\x1D\x21\x11";

  // Feed and cut
  static readonly LINE_FEED = "\x0A";
  static readonly FORM_FEED = "\x0C";
  static readonly CUT_PAPER = "\x1D\x56\x00";
  static readonly CUT_PAPER_PARTIAL = "\x1D\x56\x01";

  // Barcode (untuk QR code atau barcode jika diperlukan)
  static qrCode(data: string): string {
    // QR Code command untuk ESC/POS
    const dataLength = data.length;
    return (
      "\x1D\x28\x6B\x04\x00\x31\x41\x32\x00" + // QR Code model
      "\x1D\x28\x6B\x03\x00\x31\x43\x08" + // QR Code size
      "\x1D\x28\x6B\x03\x00\x31\x45\x30" + // QR Code error correction
      `\x1D\x28\x6B${String.fromCharCode(
        dataLength + 3,
        0
      )}\x31\x50\x30${data}` + // QR Code data
      "\x1D\x28\x6B\x03\x00\x31\x51\x30"
    ); // Print QR Code
  }
}
