<template>
  <div class="space-y-8">
    <!-- KPI Cards with Enhanced Design -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Total Omzet -->
      <div 
        @click="drilldownToTransactions('omzet')"
        class="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-200"
      >
        <div class="flex items-center">
          <div class="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-semibold text-blue-700 mb-1">💰 Total Omzet</p>
            <p class="text-2xl font-bold text-blue-900 group-hover:text-blue-800 transition-colors">{{ formatCurrency(kpiData.totalOmzet) }}</p>
            <p class="text-xs text-blue-600 mt-1">{{ kpiData.totalTransaksi }} transaksi</p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-blue-200">
          <div class="flex items-center justify-between text-xs text-blue-600">
            <span>Klik untuk detail</span>
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- AOV (Average Order Value) -->
      <div 
        @click="drilldownToTransactions('aov')"
        class="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-200"
      >
        <div class="flex items-center">
          <div class="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-semibold text-green-700 mb-1">📊 AOV (Rata-rata)</p>
            <p class="text-2xl font-bold text-green-900 group-hover:text-green-800 transition-colors">{{ formatCurrency(kpiData.avgOrderValue) }}</p>
            <p class="text-xs text-green-600 mt-1">per transaksi</p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-green-200">
          <div class="flex items-center justify-between text-xs text-green-600">
            <span>Klik untuk detail</span>
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Item Terjual -->
      <div 
        @click="drilldownToTransactions('items')"
        class="group bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-yellow-200"
      >
        <div class="flex items-center">
          <div class="p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-semibold text-yellow-700 mb-1">📦 Total Item Terjual</p>
            <p class="text-2xl font-bold text-yellow-900 group-hover:text-yellow-800 transition-colors">{{ formatNumber(kpiData.totalItems) }}</p>
            <p class="text-xs text-yellow-600 mt-1">{{ (kpiData.totalItems / kpiData.totalTransaksi || 0).toFixed(1) }} item/transaksi</p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-yellow-200">
          <div class="flex items-center justify-between text-xs text-yellow-600">
            <span>Klik untuk detail</span>
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Net Sales -->
      <div 
        @click="drilldownToTransactions('net')"
        class="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-200"
      >
        <div class="flex items-center">
          <div class="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-semibold text-purple-700 mb-1">📈 Net Sales</p>
            <p class="text-2xl font-bold text-purple-900 group-hover:text-purple-800 transition-colors">{{ formatCurrency(kpiData.netSales) }}</p>
            <p class="text-xs text-purple-600 mt-1">setelah diskon & biaya</p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-purple-200">
          <div class="flex items-center justify-between text-xs text-purple-600">
            <span>Klik untuk detail</span>
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional KPI Row -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <!-- Total Diskon -->
      <div class="group bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg p-6 border border-red-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <div class="flex items-center">
          <div class="p-4 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-semibold text-red-700 mb-1">🏷️ Total Diskon</p>
            <p class="text-2xl font-bold text-red-900 group-hover:text-red-800 transition-colors">{{ formatCurrency(kpiData.totalDiskon) }}</p>
            <p class="text-xs text-red-600 mt-1">{{ ((kpiData.totalDiskon / kpiData.totalOmzet) * 100 || 0).toFixed(1) }}% dari omzet</p>
          </div>
        </div>
      </div>

      <!-- Total Pajak -->
      <div class="group bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl shadow-lg p-6 border border-indigo-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <div class="flex items-center">
          <div class="p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-semibold text-indigo-700 mb-1">📊 Total Pajak</p>
            <p class="text-2xl font-bold text-indigo-900 group-hover:text-indigo-800 transition-colors">{{ formatCurrency(kpiData.totalPajak) }}</p>
            <p class="text-xs text-indigo-600 mt-1">{{ ((kpiData.totalPajak / kpiData.totalOmzet) * 100 || 0).toFixed(1) }}% dari omzet</p>
          </div>
        </div>
      </div>

      <!-- Biaya Pengiriman -->
      <div class="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg p-6 border border-orange-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <div class="flex items-center">
          <div class="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-semibold text-orange-700 mb-1">🚚 Biaya Pengiriman</p>
            <p class="text-2xl font-bold text-orange-900 group-hover:text-orange-800 transition-colors">{{ formatCurrency(kpiData.totalBiayaPengiriman) }}</p>
            <p class="text-xs text-orange-600 mt-1">{{ kpiData.transaksiDenganOngkir }} transaksi</p>
          </div>
        </div>
      </div>

      <!-- Status Overview -->
      <div class="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-lg p-6 border border-emerald-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <div class="flex items-center">
          <div class="p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-semibold text-emerald-700 mb-1">✅ Status Pembayaran</p>
            <div class="flex flex-wrap gap-2 mt-2">
              <span class="px-3 py-1 text-xs font-semibold bg-white text-emerald-700 rounded-full border border-emerald-200 shadow-sm">
                💰 Paid: {{ kpiData.statusBreakdown.PAID || 0 }}
              </span>
              <span class="px-3 py-1 text-xs font-semibold bg-white text-amber-700 rounded-full border border-amber-200 shadow-sm">
                ⏳ Pending: {{ kpiData.statusBreakdown.PENDING || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Period Summary Chart -->
    <div class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-lg p-6 border border-slate-200 mb-8">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <div class="p-3 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900 ml-3">📊 Ringkasan per Periode</h3>
        </div>
        <div class="flex gap-2">
          <button
            v-for="groupBy in ['daily', 'weekly', 'monthly']"
            :key="groupBy"
            @click="chartGroupBy = groupBy"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200',
              chartGroupBy === groupBy
                ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
            ]"
          >
            {{ groupBy === 'daily' ? '📅 Harian' : groupBy === 'weekly' ? '📆 Mingguan' : '🗓️ Bulanan' }}
          </button>
        </div>
      </div>

      <!-- Chart placeholder - will be replaced with actual chart component -->
      <div class="h-64 bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center border border-slate-200">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full mb-4">
            <svg class="w-8 h-8 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <p class="text-slate-600 font-medium">Grafik tren akan ditampilkan di sini</p>
          <p class="text-sm text-slate-500">{{ chartData.length }} data points tersedia</p>
        </div>
      </div>
    </div>

    <!-- Top Performers -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Top Payment Methods -->
      <div class="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl shadow-lg p-6 border border-teal-200">
        <div class="flex items-center mb-6">
          <div class="p-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-teal-900 ml-3">💳 Metode Bayar Terpopuler</h3>
        </div>
        <div class="space-y-4">
          <div
            v-for="(method, index) in topPaymentMethods"
            :key="method.metode"
            class="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-teal-100"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {{ index + 1 }}
              </div>
              <div class="ml-3">
                <p class="font-semibold text-teal-900">{{ method.metode }}</p>
                <p class="text-sm text-teal-600">{{ method.jumlah }} transaksi</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-teal-800">{{ formatCurrency(method.omzet) }}</p>
              <p class="text-xs text-teal-600">revenue</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Cashiers -->
      <div class="bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl shadow-lg p-6 border border-rose-200">
        <div class="flex items-center mb-6">
          <div class="p-3 bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-rose-900 ml-3">👑 Kasir Terbaik</h3>
        </div>
        <div class="space-y-4">
          <div
            v-for="(kasir, index) in topCashiers"
            :key="kasir.id_kasir"
            class="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-rose-100"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gradient-to-r from-rose-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {{ kasir.nama.charAt(0) }}
              </div>
              <div class="ml-3">
                <p class="font-semibold text-rose-900">{{ kasir.nama }}</p>
                <p class="text-sm text-rose-600">{{ kasir.transaksi }} transaksi</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-rose-800">{{ formatCurrency(kasir.omzet) }}</p>
              <p class="text-xs text-rose-600">revenue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useSupabase } from '~~/composables/useSupabase';
import { useToast } from '~~/composables/useToast';

// Props
const props = defineProps<{
  filters: any;
}>();

// Emits
const emit = defineEmits<{
  drilldown: [filters: any];
}>();

// Types
interface KPIData {
  totalOmzet: number;
  totalTransaksi: number;
  avgOrderValue: number;
  totalItems: number;
  totalDiskon: number;
  totalPajak: number;
  totalBiayaPengiriman: number;
  netSales: number;
  transaksiDenganOngkir: number;
  statusBreakdown: Record<string, number>;
}

interface PaymentMethodData {
  metode: string;
  omzet: number;
  jumlah: number;
}

interface CashierData {
  id_kasir: string;
  nama: string;
  omzet: number;
  transaksi: number;
}

// Reactive data
const loading = ref(false);
const chartGroupBy = ref('daily');

const kpiData = ref<KPIData>({
  totalOmzet: 0,
  totalTransaksi: 0,
  avgOrderValue: 0,
  totalItems: 0,
  totalDiskon: 0,
  totalPajak: 0,
  totalBiayaPengiriman: 0,
  netSales: 0,
  transaksiDenganOngkir: 0,
  statusBreakdown: {}
});

const chartData = ref<any[]>([]);
const topPaymentMethods = ref<PaymentMethodData[]>([]);
const topCashiers = ref<CashierData[]>([]);

// Methods
const fetchKPIData = async () => {
  loading.value = true;
  try {
    const supabase = useSupabase();
    
    // Build query with filters
    let query = supabase.from('sbs.transaksi').select('*');
    
    // Apply filters
    if (props.filters.dateFrom) {
      query = query.gte('tanggal', props.filters.dateFrom);
    }
    if (props.filters.dateTo) {
      const endDate = new Date(props.filters.dateTo);
      endDate.setDate(endDate.getDate() + 1);
      query = query.lt('tanggal', endDate.toISOString());
    }
    if (props.filters.kasir) {
      query = query.eq('id_kasir', props.filters.kasir);
    }
    if (props.filters.metodeBayar) {
      query = query.eq('metode_bayar', props.filters.metodeBayar);
    }
    if (props.filters.status) {
      query = query.eq('status_pembayaran', props.filters.status);
    }

    const { data, error } = await query;
    
    if (error) throw error;

    const transactions = data || [];
    
    // Calculate KPIs
    const totalOmzet = transactions.reduce((sum, t) => sum + Number(t.total), 0);
    const totalTransaksi = transactions.length;
    const totalItems = transactions.reduce((sum, t) => sum + Number(t.total_item), 0);
    const totalDiskon = transactions.reduce((sum, t) => sum + Number(t.diskon), 0);
    const totalPajak = transactions.reduce((sum, t) => sum + Number(t.pajak), 0);
    const totalBiayaPengiriman = transactions.reduce((sum, t) => sum + Number(t.biaya_pengiriman), 0);
    
    // Count status breakdown
    const statusBreakdown: Record<string, number> = {};
    transactions.forEach(t => {
      statusBreakdown[t.status_pembayaran] = (statusBreakdown[t.status_pembayaran] || 0) + 1;
    });

    kpiData.value = {
      totalOmzet,
      totalTransaksi,
      avgOrderValue: totalTransaksi > 0 ? totalOmzet / totalTransaksi : 0,
      totalItems,
      totalDiskon,
      totalPajak,
      totalBiayaPengiriman,
      netSales: totalOmzet - totalDiskon + totalPajak + totalBiayaPengiriman,
      transaksiDenganOngkir: transactions.filter(t => Number(t.biaya_pengiriman) > 0).length,
      statusBreakdown
    };

    // Calculate top payment methods
    const paymentMap = new Map<string, { omzet: number; jumlah: number }>();
    transactions.forEach(t => {
      const existing = paymentMap.get(t.metode_bayar) || { omzet: 0, jumlah: 0 };
      paymentMap.set(t.metode_bayar, {
        omzet: existing.omzet + Number(t.total),
        jumlah: existing.jumlah + 1
      });
    });

    topPaymentMethods.value = Array.from(paymentMap.entries())
      .map(([metode, data]) => ({ metode, ...data }))
      .sort((a, b) => b.omzet - a.omzet)
      .slice(0, 5);

    // Fetch cashier names and calculate top cashiers
    await fetchTopCashiers(transactions);

  } catch (error) {
    console.error('Error fetching KPI data:', error);
    const toast = useToast();
    toast.error('Gagal memuat data KPI');
  } finally {
    loading.value = false;
  }
};

const fetchTopCashiers = async (transactions: any[]) => {
  try {
    const supabase = useSupabase();
    
    // Get unique kasir IDs
    const kasirIds = Array.from(new Set(transactions.map(t => t.id_kasir)));
    
    if (kasirIds.length === 0) {
      topCashiers.value = [];
      return;
    }

    // Fetch kasir names
    const { data: kasirData, error } = await supabase
      .from('sbs.pengguna')
      .select('id_pengguna, nama')
      .in('id_pengguna', kasirIds);

    if (error) throw error;

    const kasirMap = new Map(kasirData?.map(k => [k.id_pengguna, k.nama]) || []);

    // Calculate cashier performance
    const cashierMap = new Map<string, { omzet: number; transaksi: number }>();
    transactions.forEach(t => {
      const existing = cashierMap.get(t.id_kasir) || { omzet: 0, transaksi: 0 };
      cashierMap.set(t.id_kasir, {
        omzet: existing.omzet + Number(t.total),
        transaksi: existing.transaksi + 1
      });
    });

    topCashiers.value = Array.from(cashierMap.entries())
      .map(([id_kasir, data]) => ({
        id_kasir,
        nama: kasirMap.get(id_kasir) || 'Unknown',
        ...data
      }))
      .sort((a, b) => b.omzet - a.omzet)
      .slice(0, 5);

  } catch (error) {
    console.error('Error fetching top cashiers:', error);
  }
};

const drilldownToTransactions = (type: string) => {
  const filters = { ...props.filters };
  
  // Add specific filters based on KPI type
  switch (type) {
    case 'omzet':
      filters.sortBy = 'total';
      filters.sortOrder = 'desc';
      break;
    case 'aov':
      // Could add minimum transaction amount filter
      break;
    case 'items':
      filters.sortBy = 'total_item';
      filters.sortOrder = 'desc';
      break;
    case 'net':
      filters.status = 'PAID';
      break;
  }

  emit('drilldown', filters);
};

// Utility methods
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num);
};

// Watchers
watch(() => props.filters, fetchKPIData, { deep: true });

// Lifecycle
onMounted(() => {
  fetchKPIData();
});
</script>