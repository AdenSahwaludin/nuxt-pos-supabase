<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/kasir" class="text-gray-400 hover:text-gray-600">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </NuxtLink>
            <div>
              <h1 class="text-xl font-semibold text-gray-900">Point of Sale</h1>
              <p class="text-sm text-gray-500">Buat transaksi penjualan baru</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Kasir User</span>
            <NuxtLink
              to="/kasir"
              class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Kembali
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Product Search & Cart -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Product Search -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Cari Produk</h3>
            <div class="flex space-x-4">
              <div class="flex-1">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Scan barcode atau cari nama produk..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  @input="searchProducts"
                />
              </div>
              <button
                class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md transition-colors"
                @click="searchProducts"
              >
                Cari
              </button>
            </div>

            <!-- Search Results -->
            <div
              v-if="searchResults.length > 0"
              class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto"
            >
              <div
                v-for="product in searchResults"
                :key="product.id"
                class="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 cursor-pointer transition-colors"
                @click="addToCart(product)"
              >
                <h4 class="font-medium text-gray-900">{{ product.name }}</h4>
                <p class="text-sm text-gray-500">{{ product.barcode }}</p>
                <p class="text-lg font-semibold text-emerald-600">
                  {{ formatCurrency(product.price) }}
                </p>
                <p class="text-xs text-gray-400">Stok: {{ product.stock }}</p>
              </div>
            </div>
          </div>

          <!-- Shopping Cart -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Keranjang Belanja
            </h3>
            <div
              v-if="cart.length === 0"
              class="text-center py-8 text-gray-500"
            >
              Keranjang kosong. Silakan tambahkan produk.
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="(item, index) in cart"
                :key="`${item.id}-${index}`"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ item.name }}</h4>
                  <p class="text-sm text-gray-500">
                    {{ formatCurrency(item.price) }} x {{ item.quantity }}
                  </p>
                </div>
                <div class="flex items-center space-x-3">
                  <button
                    @click="updateQuantity(index, item.quantity - 1)"
                    class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <span class="w-8 text-center">{{ item.quantity }}</span>
                  <button
                    @click="updateQuantity(index, item.quantity + 1)"
                    class="w-8 h-8 rounded-full bg-emerald-200 hover:bg-emerald-300 flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                  <button
                    @click="removeFromCart(index)"
                    class="w-8 h-8 rounded-full bg-red-200 hover:bg-red-300 flex items-center justify-center transition-colors text-red-600"
                  >
                    ×
                  </button>
                </div>
                <div class="ml-4 text-right">
                  <p class="font-semibold text-gray-900">
                    {{ formatCurrency(item.price * item.quantity) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Checkout Panel -->
        <div class="space-y-6">
          <!-- Order Summary -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Ringkasan Pesanan
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">{{ formatCurrency(subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Pajak (10%)</span>
                <span class="font-medium">{{ formatCurrency(tax) }}</span>
              </div>
              <div class="border-t pt-3">
                <div class="flex justify-between">
                  <span class="text-lg font-semibold">Total</span>
                  <span class="text-lg font-semibold text-emerald-600">{{
                    formatCurrency(total)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Metode Pembayaran
            </h3>
            <div class="space-y-3">
              <label class="flex items-center">
                <input
                  v-model="paymentMethod"
                  type="radio"
                  value="cash"
                  class="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                />
                <span class="ml-3">Tunai</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="paymentMethod"
                  type="radio"
                  value="non-cash"
                  class="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                />
                <span class="ml-3">Non-Tunai</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="paymentMethod"
                  type="radio"
                  value="installment"
                  class="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                />
                <span class="ml-3">Cicilan</span>
              </label>
            </div>

            <!-- Cash Payment Amount -->
            <div v-if="paymentMethod === 'cash'" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Jumlah Bayar</label
              >
              <input
                v-model.number="cashAmount"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                :placeholder="total.toString()"
              />
              <div v-if="cashAmount && cashAmount >= total" class="mt-2">
                <p class="text-sm text-gray-600">
                  Kembalian:
                  <span class="font-semibold text-emerald-600">{{
                    formatCurrency(cashAmount - total)
                  }}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <button
              :disabled="
                cart.length === 0 ||
                (paymentMethod === 'cash' &&
                  (!cashAmount || cashAmount < total))
              "
              class="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-medium transition-colors"
              @click="processPayment"
            >
              Proses Pembayaran
            </button>
            <button
              class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md font-medium transition-colors"
              @click="clearCart"
            >
              Bersihkan Keranjang
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});

// Sample products data
const sampleProducts = [
  {
    id: "8999999999999",
    name: "Produk Contoh 1",
    barcode: "8999999999999",
    price: 50000,
    stock: 100,
  },
  {
    id: "8888888888888",
    name: "Elektronik Sample",
    barcode: "8888888888888",
    price: 120000,
    stock: 50,
  },
  {
    id: "7777777777777",
    name: "Sparepart ABC",
    barcode: "7777777777777",
    price: 75000,
    stock: 25,
  },
  {
    id: "6666666666666",
    name: "Produk Demo",
    barcode: "6666666666666",
    price: 25000,
    stock: 200,
  },
  {
    id: "5555555555555",
    name: "Sample Item",
    barcode: "5555555555555",
    price: 15000,
    stock: 150,
  },
];

// Reactive data
const searchQuery = ref("");
const searchResults = ref([]);
const cart = ref([]);
const paymentMethod = ref("cash");
const cashAmount = ref(null);

// Computed properties
const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const tax = computed(() => {
  return Math.round(subtotal.value * 0.1);
});

const total = computed(() => {
  return subtotal.value + tax.value;
});

// Methods
const searchProducts = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  const query = searchQuery.value.toLowerCase();
  searchResults.value = sampleProducts
    .filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.barcode.includes(query)
    )
    .slice(0, 10); // Limit to 10 results
};

const addToCart = (product) => {
  const existingItem = cart.value.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.value.push({
      ...product,
      quantity: 1,
    });
  }

  // Clear search
  searchQuery.value = "";
  searchResults.value = [];
};

const updateQuantity = (index, newQuantity) => {
  if (newQuantity <= 0) {
    removeFromCart(index);
  } else {
    cart.value[index].quantity = newQuantity;
  }
};

const removeFromCart = (index) => {
  cart.value.splice(index, 1);
};

const clearCart = () => {
  cart.value = [];
  cashAmount.value = null;
};

const processPayment = async () => {
  if (cart.value.length === 0) return;

  // Simple validation
  if (
    paymentMethod.value === "cash" &&
    (!cashAmount.value || cashAmount.value < total.value)
  ) {
    alert("Jumlah bayar tidak mencukupi");
    return;
  }

  // Simulate payment processing
  const confirmed = confirm(
    `Proses pembayaran ${formatCurrency(
      total.value
    )} dengan metode ${getPaymentMethodLabel(paymentMethod.value)}?`
  );

  if (confirmed) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Pembayaran berhasil diproses!");
    clearCart();

    // Redirect back to kasir dashboard
    await navigateTo("/kasir");
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const getPaymentMethodLabel = (method) => {
  const labels = {
    cash: "Tunai",
    "non-cash": "Non-Tunai",
    installment: "Cicilan",
  };
  return labels[method] || method;
};

// Auto-focus search input on mount
onMounted(() => {
  const searchInput = document.querySelector('input[type="text"]');
  if (searchInput) {
    searchInput.focus();
  }
});
</script>
