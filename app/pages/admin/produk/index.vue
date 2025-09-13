<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manajemen Produk</h1>
        <p class="text-gray-600 mt-1">
          Kelola inventori dan daftar produk sistem Point of Sale
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="showImportModal = true"
          class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Upload :size="20" />
          <span>Import</span>
        </button>
        <button
          @click="exportProduk"
          class="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-sm"
        >
          <Download :size="20" />
          <span>Export</span>
        </button>
        <button
          @click="showCreateModal = true"
          class="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus :size="20" />
          <span>Tambah Produk</span>
        </button>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Cari Produk
          </label>
          <div class="relative">
            <Search
              :size="20"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari berdasarkan nama, barcode EAN-13, atau nomor BPOM..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <!-- Category Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <select
            v-model="filters.kategori"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @change="onFilterChange"
          >
            <option value="">Semua Kategori</option>
            <option
              v-for="kat in kategoriList"
              :key="kat.id_kategori"
              :value="kat.id_kategori"
            >
              {{ kat.nama }}
            </option>
          </select>
        </div>

        <!-- Stock Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Status Stok
          </label>
          <select
            v-model="filters.stockStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @change="onFilterChange"
          >
            <option value="">Semua Status</option>
            <option value="available">Tersedia</option>
            <option value="low">Stok Rendah</option>
            <option value="empty">Habis</option>
          </select>
        </div>

        <!-- Price Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Rentang Harga
          </label>
          <select
            v-model="filters.priceRange"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @change="onFilterChange"
          >
            <option value="">Semua Harga</option>
            <option value="0-50000">< Rp 50.000</option>
            <option value="50000-100000">Rp 50.000 - 100.000</option>
            <option value="100000-500000">Rp 100.000 - 500.000</option>
            <option value="500000-">> Rp 500.000</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Produk</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <Package :size="24" class="text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Stok Rendah</p>
            <p class="text-2xl font-bold text-orange-600">
              {{ stats.lowStock }}
            </p>
          </div>
          <div class="p-3 bg-orange-100 rounded-lg">
            <AlertTriangle :size="24" class="text-orange-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Stok Habis</p>
            <p class="text-2xl font-bold text-red-600">
              {{ stats.outOfStock }}
            </p>
          </div>
          <div class="p-3 bg-red-100 rounded-lg">
            <XCircle :size="24" class="text-red-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Nilai</p>
            <p class="text-2xl font-bold text-emerald-600">
              {{ formatCurrency(stats.totalValue) }}
            </p>
          </div>
          <div class="p-3 bg-emerald-100 rounded-lg">
            <Coins :size="24" class="text-emerald-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div
      v-if="selectedProdukList.length > 0"
      class="bg-blue-50 border border-blue-200 rounded-xl p-4"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <span class="text-sm font-medium text-blue-800">
            {{ selectedProdukList.length }} produk dipilih
          </span>
          <button
            @click="clearSelection"
            class="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Batal pilih
          </button>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="bulkExport"
            class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Export Terpilih
          </button>
          <button
            @click="bulkDelete"
            class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Hapus Terpilih
          </button>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <!-- Table Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Daftar Produk</h2>
          <div class="flex items-center space-x-4 text-sm text-gray-600">
            <span
              >{{ pagination.from }}-{{ pagination.to }} dari
              {{ pagination.total }}</span
            >
            <select
              v-model="pagination.perPage"
              class="px-3 py-1 border border-gray-300 rounded text-sm"
              @change="loadProduk"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table Content -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortByColumn('id_produk')"
              >
                <div class="flex items-center space-x-1">
                  <span>Barcode EAN-13</span>
                  <component
                    :is="getSortIcon('id_produk')"
                    :size="14"
                    class="text-gray-400"
                  />
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortByColumn('nama')"
              >
                <div class="flex items-center space-x-1">
                  <span>Nama Produk</span>
                  <component
                    :is="getSortIcon('nama')"
                    :size="14"
                    class="text-gray-400"
                  />
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortByColumn('kategori')"
              >
                <div class="flex items-center space-x-1">
                  <span>Kategori</span>
                  <component
                    :is="getSortIcon('kategori')"
                    :size="14"
                    class="text-gray-400"
                  />
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortByColumn('harga')"
              >
                <div class="flex items-center space-x-1">
                  <span>Harga</span>
                  <component
                    :is="getSortIcon('harga')"
                    :size="14"
                    class="text-gray-400"
                  />
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortByColumn('stok')"
              >
                <div class="flex items-center space-x-1">
                  <span>Stok</span>
                  <component
                    :is="getSortIcon('stok')"
                    :size="14"
                    class="text-gray-400"
                  />
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortByColumn('stok')"
              >
                <div class="flex items-center space-x-1">
                  <span>Status</span>
                  <component
                    :is="getSortIcon('stok')"
                    :size="14"
                    class="text-gray-400"
                  />
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortByColumn('updated_at')"
              >
                <div class="flex items-center space-x-1">
                  <span>Terakhir Diperbarui</span>
                  <component
                    :is="getSortIcon('updated_at')"
                    :size="14"
                    class="text-gray-400"
                  />
                </div>
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loading Skeleton -->
            <tr v-if="loading" v-for="i in 5" :key="i">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-4 w-4 rounded"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-4 rounded w-20"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-4 rounded w-32"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-4 rounded w-24"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-4 rounded w-20"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-4 rounded w-16"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-6 rounded w-20"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="animate-pulse bg-gray-200 h-4 rounded w-24"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center space-x-2">
                  <div class="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
                  <div class="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
                  <div class="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr
              v-else-if="produkList.length > 0"
              v-for="produk in produkList.filter((p) => p && p.id)"
              :key="produk?.id || Math.random()"
              class="hover:bg-gray-50"
              :class="{ 'bg-blue-50': selectedProdukIds.includes(produk.id) }"
            >
              <!-- Checkbox -->
              <td class="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  :checked="selectedProdukIds.includes(produk.id)"
                  @change="toggleSelect(produk.id)"
                  class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </td>

              <!-- ID/SKU Produk -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-semibold text-sm mr-3"
                  >
                    {{ getProdukInitials(produk) }}
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ produk?.id_produk || "-" }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ produk?.nomor_bpom || "No BPOM" }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Nama Produk -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ produk?.nama || "-" }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ produk?.unit || "pcs" }}
                </div>
              </td>

              <!-- Kategori -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                >
                  {{ produk?.kategori_nama || "-" }}
                </span>
              </td>

              <!-- Harga -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(produk?.harga) }}
              </td>

              <!-- Stok -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-medium text-gray-900">
                    {{ produk?.stok || 0 }}
                  </span>
                  <button
                    @click="quickStockAdjustment(produk)"
                    class="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                    title="Adjust Stok"
                  >
                    <Edit2 :size="14" />
                  </button>
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStockStatusClass(produk)"
                >
                  {{ getStockStatusText(produk) }}
                </span>
              </td>

              <!-- Terakhir Diperbarui -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(produk?.updated_at) }}
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="viewProduk(produk)"
                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Lihat Detail"
                  >
                    <Eye :size="16" />
                  </button>
                  <button
                    @click="editProduk(produk)"
                    class="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit :size="16" />
                  </button>
                  <button
                    @click="deleteProduk(produk)"
                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else>
              <td colspan="9" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div
                    class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
                  >
                    <Package :size="32" class="text-gray-400" />
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">
                    Tidak ada produk
                  </h3>
                  <p class="text-gray-500 mb-4">
                    Belum ada data produk yang sesuai dengan filter.
                  </p>
                  <button
                    @click="showCreateModal = true"
                    class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Plus :size="16" class="mr-2" />
                    Tambah Produk Pertama
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="produkList.length > 0"
        class="px-6 py-4 border-t border-gray-200"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Menampilkan {{ pagination.from }} - {{ pagination.to }} dari
            {{ pagination.total }} produk
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="changePage(pagination.currentPage - 1)"
              :disabled="pagination.currentPage <= 1"
              class="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft :size="16" />
            </button>

            <template v-for="page in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="changePage(page)"
                class="px-3 py-2 border rounded-lg text-sm"
                :class="
                  page === pagination.currentPage
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-gray-300 hover:bg-gray-50'
                "
              >
                {{ page }}
              </button>
              <span v-else class="px-3 py-2 text-gray-500">...</span>
            </template>

            <button
              @click="changePage(pagination.currentPage + 1)"
              :disabled="pagination.currentPage >= pagination.totalPages"
              class="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ProdukCreateModal
      v-if="showCreateModal"
      :kategoriList="kategoriList"
      @close="showCreateModal = false"
      @created="handleProdukCreated"
    />

    <ProdukEditModal
      v-if="showEditModal && selectedProduk"
      :produk="selectedProduk"
      :kategoriList="kategoriList"
      @close="showEditModal = false"
      @updated="handleProdukUpdated"
    />

    <ProdukDetailModal
      v-if="showDetailModal && selectedProduk"
      :produk="selectedProduk"
      @close="showDetailModal = false"
      @edit="editProduk"
    />

    <ConfirmDeleteModal
      v-if="showDeleteModal && produkToDelete"
      entityType="Produk"
      :itemName="produkToDelete.nama"
      :itemDetails="produkToDelete"
      :isLoading="isDeleting"
      @confirm="confirmDeleteProduk"
      @cancel="cancelDeleteProduk"
    />

    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="fixed inset-0 modal-backdrop transition-opacity"
        @click="showImportModal = false"
      ></div>
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-xl shadow-xl max-w-2xl w-full">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <Upload :size="24" class="text-blue-500 mr-3" />
                Import Produk dari CSV
              </h3>
              <button
                @click="showImportModal = false"
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X :size="20" class="text-gray-500" />
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- Instructions -->
            <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 class="font-medium text-blue-900 mb-2">Panduan Import:</h4>
              <ul class="text-sm text-blue-800 space-y-1">
                <li>• File harus berformat CSV dengan header yang sesuai</li>
                <li>• Barcode harus 13 digit angka (EAN-13)</li>
                <li>• Kategori ID harus sudah ada di sistem</li>
                <li>• Unduh template untuk format yang benar</li>
              </ul>
            </div>

            <!-- Template Download -->
            <div class="mb-6">
              <button
                @click="downloadTemplate"
                class="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download :size="16" />
                <span>Unduh Template CSV</span>
              </button>
            </div>

            <!-- File Upload -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Pilih File CSV
              </label>
              <input
                type="file"
                accept=".csv"
                @change="handleFileUpload"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg"
              />
              <p class="mt-1 text-sm text-gray-500">
                Maksimal ukuran file: 5MB
              </p>
            </div>

            <!-- Import Results -->
            <div v-if="importResults.total > 0" class="mb-6">
              <h4 class="font-medium text-gray-900 mb-3">Hasil Import:</h4>
              <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-gray-900">
                    {{ importResults.total }}
                  </div>
                  <div class="text-sm text-gray-600">Total</div>
                </div>
                <div class="text-center p-3 bg-green-50 rounded-lg">
                  <div class="text-2xl font-bold text-green-600">
                    {{ importResults.success }}
                  </div>
                  <div class="text-sm text-green-600">Berhasil</div>
                </div>
                <div class="text-center p-3 bg-red-50 rounded-lg">
                  <div class="text-2xl font-bold text-red-600">
                    {{ importResults.failed }}
                  </div>
                  <div class="text-sm text-red-600">Gagal</div>
                </div>
              </div>

              <!-- Error Details -->
              <div
                v-if="importResults.errors.length > 0"
                class="max-h-32 overflow-y-auto"
              >
                <h5 class="font-medium text-red-900 mb-2">Error Details:</h5>
                <div class="space-y-1">
                  <div
                    v-for="(error, index) in importResults.errors"
                    :key="index"
                    class="text-sm text-red-700 bg-red-50 p-2 rounded"
                  >
                    {{ error }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl"
          >
            <div class="flex justify-end space-x-3">
              <button
                @click="showImportModal = false"
                class="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                :disabled="isImporting"
              >
                Tutup
              </button>
              <button
                @click="importFromCSV"
                :disabled="!importFile || isImporting"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span
                  v-if="isImporting"
                  class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></span>
                <Upload v-else :size="16" />
                <span>{{
                  isImporting ? "Mengimport..." : "Import Sekarang"
                }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Stock Adjustment Modal -->
  <div v-if="showStockModal" class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="fixed inset-0 modal-backdrop transition-opacity"
      @click="showStockModal = false"
    ></div>
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Adjust Stok</h3>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Produk: {{ stockAdjustment.produk?.nama }}
            </label>
            <p class="text-sm text-gray-500">
              Stok saat ini: {{ stockAdjustment.produk?.stok || 0 }}
            </p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Stok Baru
            </label>
            <input
              v-model.number="stockAdjustment.newStock"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Catatan (Opsional)
            </label>
            <textarea
              v-model="stockAdjustment.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Alasan perubahan stok..."
            ></textarea>
          </div>
          <div class="flex justify-end space-x-3">
            <button
              @click="showStockModal = false"
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              @click="updateStock"
              :disabled="stockAdjustment.newStock < 0"
              class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Stok
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted, watch } from "vue";
import { supabase } from "~~/lib/supabaseClient";
import {
  Plus,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit,
  Edit2,
  Trash2,
  Package,
  AlertTriangle,
  XCircle,
  Coins,
  Upload,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-vue-next";
import { useToast } from "~~/composables/useToast";

// Page meta
definePageMeta({
  layout: "admin",
  middleware: ["role"],
  auth: true,
  requiredRole: "admin",
});

// Types
interface Produk {
  idx?: number;
  id: string;
  id_produk: string;
  nama: string;
  gambar?: string;
  nomor_bpom?: string;
  kategori_id: number;
  kategori_nama?: string;
  harga: number;
  biaya_produk?: number;
  stok: number;
  batas_stok?: number;
  unit?: string;
  pack_unit?: string;
  pack_size?: number;
  harga_pack?: number;
  qty_tier1?: number;
  harga_tier1?: number;
  harga_tier_qty?: number;
  harga_tier_pack?: number;
  created_at: string;
  updated_at: string;
}

interface Kategori {
  id_kategori: number;
  nama: string;
}

// Reactive state
const loading = ref(false);
const searchQuery = ref("");
const allProduk = ref<Produk[]>([]);
const kategoriList = ref<Kategori[]>([]);
const selectedProduk = ref<Produk | null>(null);
const selectedProdukIds = ref<string[]>([]);

// Modal states
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDetailModal = ref(false);
const showDeleteModal = ref(false);
const showImportModal = ref(false);
const showStockModal = ref(false);
const produkToDelete = ref<Produk | null>(null);
const isDeleting = ref(false);

// Stock adjustment
const stockAdjustment = reactive({
  produk: null as Produk | null,
  newStock: 0,
  notes: "",
});

// Prevent background scroll when modals open
watch(
  [
    showCreateModal,
    showEditModal,
    showDetailModal,
    showDeleteModal,
    showStockModal,
  ],
  ([create, edit, detail, deleteModal, stock]) => {
    document.body.style.overflow =
      create || edit || detail || deleteModal || stock ? "hidden" : "";
  }
);

// Filters
const filters = reactive({
  kategori: "",
  stockStatus: "",
  priceRange: "",
});

// Sorting
const sortBy = ref("updated_at");
const sortDirection = ref<"asc" | "desc">("desc");

// Pagination
const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  total: 0,
  totalPages: 0,
  from: 0,
  to: 0,
});

// Computed properties
const filteredProduk = computed(() => {
  let result = [...allProduk.value];

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(
      (produk) =>
        produk.nama?.toLowerCase().includes(query) ||
        produk.id_produk?.toLowerCase().includes(query) ||
        produk.nomor_bpom?.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (filters.kategori) {
    result = result.filter((produk) => produk.kategori_id === filters.kategori);
  }

  // Apply stock status filter
  if (filters.stockStatus) {
    result = result.filter((produk) => {
      const stockStatus = getStockStatus(produk);
      return stockStatus === filters.stockStatus;
    });
  }

  // Apply price range filter
  if (filters.priceRange) {
    const [min, max] = filters.priceRange.split("-").map(Number);
    result = result.filter((produk) => {
      if (max) {
        return produk.harga >= min && produk.harga <= max;
      } else {
        return produk.harga >= min;
      }
    });
  }

  return result;
});

const produkList = computed(() => {
  let result = [...filteredProduk.value];

  // Apply sorting
  result.sort((a, b) => {
    let aVal = a[sortBy.value] || "";
    let bVal = b[sortBy.value] || "";

    // Handle special sorting cases
    if (sortBy.value === "kategori") {
      aVal = a.kategori_nama || a.kategori || "";
      bVal = b.kategori_nama || b.kategori || "";
    }

    let comparison = 0;
    if (typeof aVal === "string" && typeof bVal === "string") {
      comparison = aVal.localeCompare(bVal);
    } else if (typeof aVal === "number" && typeof bVal === "number") {
      comparison = aVal - bVal;
    } else {
      comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    }

    return sortDirection.value === "asc" ? comparison : -comparison;
  });

  // Update pagination totals
  pagination.total = result.length;
  pagination.totalPages = Math.ceil(result.length / pagination.perPage);
  pagination.from = (pagination.currentPage - 1) * pagination.perPage + 1;
  pagination.to = Math.min(
    pagination.currentPage * pagination.perPage,
    result.length
  );

  // Apply pagination
  const start = (pagination.currentPage - 1) * pagination.perPage;
  const end = start + pagination.perPage;
  result = result.slice(start, end);

  // Add index for display
  return result.map((produk, index) => ({
    ...produk,
    idx: start + index + 1,
  }));
});

// Stats computed properties
const stats = computed(() => {
  const total = allProduk.value.length;
  const lowStock = allProduk.value.filter(
    (p) => getStockStatus(p) === "low"
  ).length;
  const outOfStock = allProduk.value.filter(
    (p) => getStockStatus(p) === "empty"
  ).length;
  const totalValue = allProduk.value.reduce(
    (sum, p) => sum + p.harga * p.stok,
    0
  );

  return {
    total,
    lowStock,
    outOfStock,
    totalValue,
  };
});

const visiblePages = computed(() => {
  const pages = [];
  const totalPages = pagination.totalPages;
  const current = pagination.currentPage;

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (current >= totalPages - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    }
  }

  return pages;
});

// Selection computed properties
const selectedProdukList = computed(() => selectedProdukIds.value);
const isAllSelected = computed(
  () =>
    produkList.value.length > 0 &&
    produkList.value.every((p) => selectedProdukIds.value.includes(p.id))
);

// Methods
const loadProduk = async () => {
  loading.value = true;
  console.log("🔄 Loading produk data from database...");

  try {
    // Query produk with kategori join
    const { data: produkData, error } = await supabase
      .schema("sbs")
      .from("produk")
      .select(
        `
        *,
        kategori:id_kategori (
          id_kategori,
          nama
        )
      `
      )
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("❌ Supabase query error:", error);
      throw error;
    }

    console.log("📝 Database data received:", produkData);

    if (produkData && produkData.length > 0) {
      const transformedData: Produk[] = produkData.map((item: any) => ({
        id: item.id_produk, // Use id_produk as the id
        id_produk: item.id_produk,
        nama: item.nama,
        gambar: item.gambar,
        nomor_bpom: item.nomor_bpom,
        kategori_id: item.id_kategori,
        kategori_nama: item.kategori?.nama || "Tanpa Kategori",
        harga: item.harga || 0,
        biaya_produk: item.biaya_produk || 0,
        stok: item.stok || 0,
        batas_stok: item.batas_stok || 5,
        unit: item.unit || "pcs",
        pack_unit: item.pack_unit,
        pack_size: item.pack_size,
        harga_pack: item.harga_pack,
        qty_tier1: item.qty_tier1,
        harga_tier1: item.harga_tier1,
        harga_tier_qty: item.harga_tier_qty,
        harga_tier_pack: item.harga_tier_pack,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      console.log("✅ Transformed data:", transformedData);
      allProduk.value = transformedData;
    } else {
      console.log("📭 No produk data found");
      allProduk.value = [];
    }
  } catch (error: any) {
    console.error("❌ Error loading produk:", error);
    const toast = useToast();
    toast.error(error.message || "Gagal memuat data produk");
    allProduk.value = [];
  } finally {
    loading.value = false;
  }
};

const loadKategori = async () => {
  try {
    const { data: kategoriData, error } = await supabase
      .schema("sbs")
      .from("kategori")
      .select("id_kategori, nama")
      .order("nama");

    if (error) throw error;

    kategoriList.value = kategoriData || [];
  } catch (error: any) {
    console.error("❌ Error loading kategori:", error);
  }
};

// Modal handlers
const viewProduk = (produk: Produk) => {
  selectedProduk.value = produk;
  showDetailModal.value = true;
};

const editProduk = (produk: Produk) => {
  selectedProduk.value = produk;
  showEditModal.value = true;
};

const deleteProduk = (produk: Produk) => {
  produkToDelete.value = produk;
  showDeleteModal.value = true;
};

const confirmDeleteProduk = async () => {
  if (!produkToDelete.value) return;

  const produk = produkToDelete.value;
  isDeleting.value = true;

  try {
    const { error } = await supabase
      .schema("sbs")
      .from("produk")
      .delete()
      .eq("id_produk", produk.id_produk);

    if (error) throw new Error(`Gagal hapus produk: ${error.message}`);

    const toast = useToast();
    toast.success(`Produk "${produk.nama}" berhasil dihapus`);

    showDeleteModal.value = false;
    produkToDelete.value = null;
    loadProduk();
  } catch (error: any) {
    console.error("❌ Error deleting produk:", error);
    const toast = useToast();
    toast.error(error.message || "Gagal menghapus produk");
  } finally {
    isDeleting.value = false;
  }
};

const cancelDeleteProduk = () => {
  showDeleteModal.value = false;
  produkToDelete.value = null;
  isDeleting.value = false;
};

// Handle modal events
const handleProdukCreated = (newProduk: Produk) => {
  allProduk.value.unshift(newProduk);
  showCreateModal.value = false;
  const toast = useToast();
  toast.success(`Produk "${newProduk.nama}" berhasil ditambahkan`);
  loadProduk();
};

const handleProdukUpdated = (updatedProduk: Produk) => {
  // Find by id_produk since that's the consistent identifier
  const index = allProduk.value.findIndex(
    (p) => p.id_produk === updatedProduk.id_produk
  );
  if (index !== -1) {
    allProduk.value[index] = updatedProduk;
    console.log("✅ Produk updated in list:", updatedProduk.id_produk);
  } else {
    console.warn(
      "⚠️ Produk not found in list for update:",
      updatedProduk.id_produk
    );
    // Refresh the entire list if specific update fails
    loadProduk();
  }
  showEditModal.value = false;
  const toast = useToast();
  toast.success(`Produk "${updatedProduk.nama}" berhasil diperbarui`);
};

// Utility functions
const getProdukInitials = (produk: Produk) => {
  if (!produk) return "?";

  if (produk.id_produk) {
    return produk.id_produk.substring(0, 2).toUpperCase();
  }

  if (produk.nama) {
    return produk.nama.charAt(0).toUpperCase();
  }

  return "?";
};

const getStockStatus = (produk: Produk) => {
  if (produk.stok <= 0) return "empty";
  if (produk.stok <= (produk.batas_stok || 5)) return "low";
  return "available";
};

const getStockStatusClass = (produk: Produk) => {
  const status = getStockStatus(produk);
  switch (status) {
    case "empty":
      return "bg-red-100 text-red-800";
    case "low":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-emerald-100 text-emerald-800";
  }
};

const getStockStatusText = (produk: Produk) => {
  const status = getStockStatus(produk);
  switch (status) {
    case "empty":
      return "Habis";
    case "low":
      return "Stok Rendah";
    default:
      return "Tersedia";
  }
};

const formatCurrency = (amount: number) => {
  if (!amount) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return dateString;
  }
};

// Sorting functions
const sortByColumn = (field: string) => {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = field;
    sortDirection.value = "asc";
  }
  pagination.currentPage = 1;
};

const getSortIcon = (field: string) => {
  if (sortBy.value !== field) return ArrowUpDown;
  return sortDirection.value === "asc" ? ArrowUp : ArrowDown;
};

// Filter functions
const onFilterChange = () => {
  pagination.currentPage = 1;
};

// Pagination functions
const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.totalPages) {
    pagination.currentPage = page;
  }
};

// Selection functions
const toggleSelect = (produkId: string) => {
  const index = selectedProdukIds.value.indexOf(produkId);
  if (index > -1) {
    selectedProdukIds.value.splice(index, 1);
  } else {
    selectedProdukIds.value.push(produkId);
  }
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedProdukIds.value = [];
  } else {
    selectedProdukIds.value = produkList.value.map((p) => p.id);
  }
};

const clearSelection = () => {
  selectedProdukIds.value = [];
};

// Stock adjustment functions
const quickStockAdjustment = (produk: Produk) => {
  stockAdjustment.produk = produk;
  stockAdjustment.newStock = produk.stok;
  stockAdjustment.notes = "";
  showStockModal.value = true;
};

const updateStock = async () => {
  if (!stockAdjustment.produk) return;

  try {
    const { error } = await supabase
      .schema("sbs")
      .from("produk")
      .update({
        stok: stockAdjustment.newStock,
        updated_at: new Date().toISOString(),
      })
      .eq("id_produk", stockAdjustment.produk.id_produk);

    if (error) throw error;

    const toast = useToast();
    toast.success(`Stok ${stockAdjustment.produk.nama} berhasil diperbarui`);

    showStockModal.value = false;
    loadProduk();
  } catch (error: any) {
    console.error("❌ Error updating stock:", error);
    const toast = useToast();
    toast.error("Gagal memperbarui stok");
  }
};

// Import/Export state
const importFile = ref<File | null>(null);
const isImporting = ref(false);
const importResults = ref({
  total: 0,
  success: 0,
  failed: 0,
  errors: [] as string[],
});

// Export/Import functions
const exportProduk = () => {
  try {
    const csvHeaders = [
      "id_produk",
      "nama",
      "nomor_bpom",
      "kategori_id",
      "harga",
      "stok",
      "batas_stok",
      "unit",
      "gambar",
    ];

    let csvContent = csvHeaders.join(",") + "\n";

    // Add all products to CSV
    allProduk.value.forEach((produk) => {
      const row = [
        `"${produk.id_produk || ""}"`,
        `"${produk.nama || ""}"`,
        `"${produk.nomor_bpom || ""}"`,
        produk.kategori_id || "",
        produk.harga || 0,
        produk.stok || 0,
        produk.batas_stok || 5,
        `"${produk.unit || "pcs"}"`,
        `"${produk.gambar || ""}"`,
      ];
      csvContent += row.join(",") + "\n";
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `produk_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const toast = useToast();
    toast.success(`${allProduk.value.length} produk berhasil diekspor ke CSV`);
  } catch (error) {
    console.error("❌ Export error:", error);
    const toast = useToast();
    toast.error("Gagal mengekspor data produk");
  }
};

const bulkExport = () => {
  try {
    const selectedProducts = allProduk.value.filter((p) =>
      selectedProdukIds.value.includes(p.id)
    );

    if (selectedProducts.length === 0) {
      const toast = useToast();
      toast.warning("Pilih produk yang ingin diekspor");
      return;
    }

    const csvHeaders = [
      "id_produk",
      "nama",
      "nomor_bpom",
      "kategori_id",
      "harga",
      "stok",
      "batas_stok",
      "unit",
      "gambar",
    ];

    let csvContent = csvHeaders.join(",") + "\n";

    selectedProducts.forEach((produk) => {
      const row = [
        `"${produk.id_produk || ""}"`,
        `"${produk.nama || ""}"`,
        `"${produk.nomor_bpom || ""}"`,
        produk.kategori_id || "",
        produk.harga || 0,
        produk.stok || 0,
        produk.batas_stok || 5,
        `"${produk.unit || "pcs"}"`,
        `"${produk.gambar || ""}"`,
      ];
      csvContent += row.join(",") + "\n";
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `produk_selected_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const toast = useToast();
    toast.success(
      `${selectedProducts.length} produk terpilih berhasil diekspor ke CSV`
    );
  } catch (error) {
    console.error("❌ Bulk export error:", error);
    const toast = useToast();
    toast.error("Gagal mengekspor produk terpilih");
  }
};

const downloadTemplate = () => {
  try {
    const csvHeaders = [
      "id_produk",
      "nama",
      "nomor_bpom",
      "kategori_id",
      "harga",
      "stok",
      "batas_stok",
      "unit",
      "gambar",
    ];

    // Add sample data
    const sampleData = [
      [
        '"1234567890123"',
        '"Contoh Produk 1"',
        '"MD 224510107023"',
        "1",
        "15000",
        "100",
        "10",
        '"pcs"',
        '""',
      ],
      [
        '"1234567890124"',
        '"Contoh Produk 2"',
        '"MD 224510107024"',
        "2",
        "25000",
        "50",
        "5",
        '"box"',
        '""',
      ],
    ];

    let csvContent = csvHeaders.join(",") + "\n";
    sampleData.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "template_import_produk.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const toast = useToast();
    toast.success("Template import CSV berhasil diunduh");
  } catch (error) {
    console.error("❌ Template download error:", error);
    const toast = useToast();
    toast.error("Gagal mengunduh template");
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      const toast = useToast();
      toast.error("Hanya file CSV yang diperbolehkan");
      return;
    }
    importFile.value = file;
  }
};

const parseCSV = (text: string): string[][] => {
  const result: string[][] = [];
  const lines = text.split("\n");

  for (const line of lines) {
    if (line.trim() === "") continue;

    const row: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        row.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    row.push(current.trim());
    result.push(row);
  }

  return result;
};

const importFromCSV = async () => {
  if (!importFile.value) {
    const toast = useToast();
    toast.error("Pilih file CSV untuk diimport");
    return;
  }

  isImporting.value = true;
  importResults.value = { total: 0, success: 0, failed: 0, errors: [] };

  try {
    const text = await importFile.value.text();
    const rows = parseCSV(text);

    if (rows.length < 2) {
      throw new Error("File CSV harus memiliki header dan minimal 1 data");
    }

    const headers = rows[0].map((h) => h.replace(/"/g, "").toLowerCase());
    const dataRows = rows.slice(1);

    importResults.value.total = dataRows.length;

    // Validate headers
    const requiredHeaders = [
      "id_produk",
      "nama",
      "kategori_id",
      "harga",
      "stok",
    ];
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));

    if (missingHeaders.length > 0) {
      throw new Error(
        `Header yang diperlukan tidak ditemukan: ${missingHeaders.join(", ")}`
      );
    }

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];

      try {
        // Map CSV row to product object
        const produkData: any = {};

        headers.forEach((header, index) => {
          let value = row[index]?.replace(/"/g, "") || "";

          switch (header) {
            case "id_produk":
              produkData.id_produk = value.trim();
              break;
            case "nama":
              produkData.nama = value.trim();
              break;
            case "nomor_bpom":
              produkData.nomor_bpom = value.trim() || null;
              break;
            case "kategori_id":
              produkData.id_kategori = parseInt(value) || null;
              break;
            case "harga":
              produkData.harga = parseFloat(value) || 0;
              break;
            case "stok":
              produkData.stok = parseInt(value) || 0;
              break;
            case "batas_stok":
              produkData.batas_stok = parseInt(value) || 5;
              break;
            case "unit":
              produkData.unit = value.trim() || "pcs";
              break;
            case "gambar":
              produkData.gambar = value.trim() || null;
              break;
          }
        });

        // Validate required fields
        if (
          !produkData.id_produk ||
          !produkData.nama ||
          !produkData.id_kategori
        ) {
          throw new Error(
            `Baris ${
              i + 2
            }: Field wajib tidak lengkap (id_produk, nama, kategori_id)`
          );
        }

        // Validate barcode format (EAN-13)
        if (!/^\d{13}$/.test(produkData.id_produk)) {
          throw new Error(`Baris ${i + 2}: Barcode harus 13 digit angka`);
        }

        // Check if product already exists
        const { data: existingProduk, error: checkError } = await supabase
          .schema("sbs")
          .from("produk")
          .select("id_produk")
          .eq("id_produk", produkData.id_produk)
          .maybeSingle();

        if (checkError) {
          throw new Error(
            `Baris ${i + 2}: Gagal memeriksa duplikasi - ${checkError.message}`
          );
        }

        if (existingProduk) {
          throw new Error(
            `Baris ${i + 2}: Barcode ${produkData.id_produk} sudah ada`
          );
        }

        // Insert product
        const { error: insertError } = await supabase
          .schema("sbs")
          .from("produk")
          .insert([produkData]);

        if (insertError) {
          throw new Error(`Baris ${i + 2}: ${insertError.message}`);
        }

        importResults.value.success++;
      } catch (error: any) {
        importResults.value.failed++;
        importResults.value.errors.push(error.message);
      }
    }

    const toast = useToast();
    if (importResults.value.success > 0) {
      toast.success(`${importResults.value.success} produk berhasil diimport`);
      loadProduk(); // Reload data
    }

    if (importResults.value.failed > 0) {
      toast.warning(`${importResults.value.failed} produk gagal diimport`);
    }
  } catch (error: any) {
    console.error("❌ Import error:", error);
    const toast = useToast();
    toast.error(error.message || "Gagal mengimport file CSV");
  } finally {
    isImporting.value = false;
  }
};

const bulkDelete = () => {
  const toast = useToast();
  toast.info("Fitur bulk delete akan segera tersedia");
};

// Lifecycle
onMounted(() => {
  // Reset modal states on page load
  showCreateModal.value = false;
  showEditModal.value = false;
  showDetailModal.value = false;
  showDeleteModal.value = false;
  showStockModal.value = false;
  selectedProduk.value = null;
  produkToDelete.value = null;
  isDeleting.value = false;
  selectedProdukIds.value = [];

  loadKategori();
  loadProduk();
});
</script>

<style scoped>
/* Table hover effects */
tbody tr:hover {
  background-color: rgb(249 250 251);
}

/* Loading skeleton animation */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
