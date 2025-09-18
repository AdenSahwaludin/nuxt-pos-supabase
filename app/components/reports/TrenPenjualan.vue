<template>
  <div class="space-y-6">
    <!-- Chart Controls -->
    <div class="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg p-6 border border-slate-200">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <div class="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900 ml-3">📈 Tren Penjualan</h3>
        </div>
        <div class="flex gap-2">
          <button
            v-for="period in ['daily', 'weekly', 'monthly']"
            :key="period"
            @click="selectedPeriod = period"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200',
              selectedPeriod === period
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
            ]"
          >
            {{ period === 'daily' ? '📅 Harian' : period === 'weekly' ? '📆 Mingguan' : '🗓️ Bulanan' }}
          </button>
        </div>
      </div>

      <!-- Chart Options -->
      <div class="flex items-center gap-6 mb-6">
        <label class="flex items-center cursor-pointer group">
          <input
            v-model="showMovingAverage"
            type="checkbox"
            class="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
          />
          <span class="ml-3 text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">📊 Tampilkan Moving Average</span>
        </label>
        
        <label class="flex items-center cursor-pointer group">
          <input
            v-model="dualAxis"
            type="checkbox"
            class="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
          />
          <span class="ml-3 text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">⚡ Grafik Dual Axis</span>
        </label>
      </div>

      <!-- Chart Placeholder -->
      <div class="h-80 bg-gray-50 rounded-lg flex items-center justify-center relative">
        <div v-if="loading" class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p class="text-gray-500">Memuat data tren...</p>
        </div>
        
        <div v-else-if="chartData.length === 0" class="text-center">
          <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <p class="text-gray-500">Tidak ada data untuk periode ini</p>
        </div>

        <div v-else class="w-full h-full flex items-center justify-center">
          <!-- Chart implementation would go here -->
          <div class="text-center">
            <svg class="w-16 h-16 mx-auto text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <p class="text-gray-700 font-medium">{{ chartData.length }} data points tersedia</p>
            <p class="text-gray-500 text-sm">
              {{ selectedPeriod === 'daily' ? 'Per hari' : selectedPeriod === 'weekly' ? 'Per minggu' : 'Per bulan' }}
            </p>
          </div>
        </div>

        <!-- Clickable overlay for drilldown -->
        <div 
          v-if="chartData.length > 0"
          class="absolute inset-0 cursor-pointer opacity-0 hover:opacity-10 hover:bg-blue-500 transition-opacity"
          @click="drilldownToChart"
          title="Klik untuk melihat detail transaksi"
        ></div>
      </div>
    </div>

    <!-- Summary Table -->
    <div class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-lg p-6 border border-slate-200">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <div class="p-3 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900 ml-3">📊 Ringkasan Data</h3>
        </div>
        <button
          @click="exportSummary"
          class="px-4 py-2 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-all duration-200 hover:shadow-md"
        >
          📥 Ekspor Tabel
        </button>
      </div>

      <div class="overflow-x-auto rounded-xl">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gradient-to-r from-slate-100 to-slate-200">
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider rounded-tl-xl">
                📅 Periode
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                🛒 Jumlah Transaksi
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                💰 Total Omzet
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                💳 Rata-rata/Transaksi
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                📦 Total Item
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                📈 Pertumbuhan
              </th>
              <th class="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider rounded-tr-xl">
                ⚡ Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr
              v-for="(item, index) in summaryData"
              :key="item.period"
              :class="[
                'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer',
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              ]"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm shadow-sm mr-3">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ formatPeriod(item.period) }}</p>
                    <p class="text-xs text-gray-500">{{ new Date(item.period).toLocaleDateString('id-ID', { weekday: 'short' }) }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-sm font-bold text-gray-900">{{ formatNumber(item.transaksi) }}</span>
                  <span class="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">transaksi</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-green-700">{{ formatCurrency(item.omzet) }}</div>
                <div class="text-xs text-gray-500">revenue</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-purple-700">{{ formatCurrency(item.avgPerTransaction) }}</div>
                <div class="text-xs text-gray-500">per transaksi</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-sm font-bold text-gray-900">{{ formatNumber(item.totalItems) }}</span>
                  <span class="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">item</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="item.growth !== null && item.growth !== undefined"
                  :class="[
                    'inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold shadow-sm',
                    (item.growth || 0) >= 0 
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
                      : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
                  ]"
                >
                  <svg
                    v-if="(item.growth || 0) >= 0"
                    class="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <svg
                    v-else
                    class="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  {{ (item.growth || 0) >= 0 ? '+' : '' }}{{ Math.abs(item.growth || 0).toFixed(1) }}%
                </span>
                <span v-else class="px-3 py-2 text-xs text-gray-400 bg-gray-100 rounded-xl font-medium">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button
                  @click="drilldownToPeriod(item.period)"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 hover:shadow-md border border-blue-200"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  Detail
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination for summary if needed -->
      <div v-if="summaryData.length > 10" class="mt-6 flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
        <div class="text-sm font-medium text-slate-700">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Menampilkan {{ Math.min(10, summaryData.length) }} dari {{ summaryData.length }} periode
          </span>
        </div>
        <div class="flex gap-2">
          <button class="px-4 py-2 text-sm font-medium bg-white text-slate-600 rounded-lg hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow">
            ← Sebelumnya
          </button>
          <button class="px-4 py-2 text-sm font-medium bg-white text-slate-600 rounded-lg hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow">
            Selanjutnya →
          </button>
        </div>
      </div>
    </div>

    <!-- Key Insights -->
    <div class="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg p-6 border border-slate-200">
      <div class="flex items-center mb-6">
        <div class="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-slate-900 ml-3">💡 Insight Tren</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Highest Day -->
        <div class="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          <div class="flex items-center">
            <div class="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-semibold text-green-700 mb-1">🏆 Hari Terbaik</p>
              <p class="text-lg font-bold text-green-900 group-hover:text-green-800 transition-colors">{{ bestDay.date }}</p>
              <p class="text-xs text-green-600 mt-1">{{ formatCurrency(bestDay.omzet) }}</p>
            </div>
          </div>
        </div>

        <!-- Growth Trend -->
        <div class="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          <div class="flex items-center">
            <div class="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-semibold text-blue-700 mb-1">📈 Tren Pertumbuhan</p>
              <p class="text-lg font-bold text-blue-900 group-hover:text-blue-800 transition-colors">
                {{ overallGrowth >= 0 ? '+' : '' }}{{ overallGrowth.toFixed(1) }}%
              </p>
              <p class="text-xs text-blue-600 mt-1">vs periode sebelumnya</p>
            </div>
          </div>
        </div>

        <!-- Average per Period -->
        <div class="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          <div class="flex items-center">
            <div class="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-semibold text-purple-700 mb-1">📊 Rata-rata per {{ selectedPeriod === 'daily' ? 'Hari' : selectedPeriod === 'weekly' ? 'Minggu' : 'Bulan' }}</p>
              <p class="text-lg font-bold text-purple-900 group-hover:text-purple-800 transition-colors">{{ formatCurrency(averagePerPeriod) }}</p>
              <p class="text-xs text-purple-600 mt-1">{{ formatNumber(avgTransactionsPerPeriod) }} transaksi</p>
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
interface ChartDataPoint {
  period: string;
  date: Date;
  omzet: number;
  transaksi: number;
  totalItems: number;
  avgPerTransaction: number;
  movingAverage?: number;
  growth?: number;
}

// Reactive data
const loading = ref(false);
const selectedPeriod = ref('daily');
const showMovingAverage = ref(false);
const dualAxis = ref(true);

const chartData = ref<ChartDataPoint[]>([]);
const summaryData = computed(() => chartData.value.slice(0, 10)); // Show top 10 in table

// Computed insights
const bestDay = computed(() => {
  if (chartData.value.length === 0) return { date: '-', omzet: 0 };
  
  const best = chartData.value.reduce((max, current) => 
    current.omzet > max.omzet ? current : max
  );
  
  return {
    date: formatPeriod(best.period),
    omzet: best.omzet
  };
});

const overallGrowth = computed(() => {
  if (chartData.value.length < 2) return 0;
  
  const recent = chartData.value.slice(-7); // Last 7 periods
  const previous = chartData.value.slice(-14, -7); // Previous 7 periods
  
  if (previous.length === 0) return 0;
  
  const recentTotal = recent.reduce((sum, item) => sum + item.omzet, 0);
  const previousTotal = previous.reduce((sum, item) => sum + item.omzet, 0);
  
  return previousTotal > 0 ? ((recentTotal - previousTotal) / previousTotal) * 100 : 0;
});

const averagePerPeriod = computed(() => {
  if (chartData.value.length === 0) return 0;
  return chartData.value.reduce((sum, item) => sum + item.omzet, 0) / chartData.value.length;
});

const avgTransactionsPerPeriod = computed(() => {
  if (chartData.value.length === 0) return 0;
  return chartData.value.reduce((sum, item) => sum + item.transaksi, 0) / chartData.value.length;
});

// Methods
const fetchTrendData = async () => {
  loading.value = true;
  try {
    const supabase = useSupabase();
    
    // Build query with filters
    let query = supabase.from('sbs.transaksi').select('tanggal, total, total_item');
    
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

    const { data, error } = await query.order('tanggal');
    
    if (error) throw error;

    const transactions = data || [];
    
    // Group data by selected period
    const groupedData = groupTransactionsByPeriod(transactions);
    
    // Calculate moving averages and growth
    calculateMovingAveragesAndGrowth(groupedData);
    
    chartData.value = groupedData;

  } catch (error) {
    console.error('Error fetching trend data:', error);
    const toast = useToast();
    toast.error('Gagal memuat data tren');
  } finally {
    loading.value = false;
  }
};

const groupTransactionsByPeriod = (transactions: any[]): ChartDataPoint[] => {
  const groups = new Map<string, any[]>();
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.tanggal);
    let key: string;
    
    switch (selectedPeriod.value) {
      case 'daily':
        key = date.toISOString().substring(0, 10);
        break;
      case 'weekly':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().substring(0, 10);
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = date.toISOString().substring(0, 10);
    }
    
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(transaction);
  });
  
  return Array.from(groups.entries())
    .map(([period, periodTransactions]) => {
      const omzet = periodTransactions.reduce((sum, t) => sum + Number(t.total), 0);
      const transaksi = periodTransactions.length;
      const totalItems = periodTransactions.reduce((sum, t) => sum + Number(t.total_item), 0);
      
      return {
        period,
        date: new Date(period),
        omzet,
        transaksi,
        totalItems,
        avgPerTransaction: transaksi > 0 ? omzet / transaksi : 0
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

const calculateMovingAveragesAndGrowth = (data: ChartDataPoint[]) => {
  const windowSize = 7; // 7-period moving average
  
  data.forEach((item, index) => {
    // Calculate moving average
    if (showMovingAverage.value && index >= windowSize - 1) {
      const window = data.slice(index - windowSize + 1, index + 1);
      item.movingAverage = window.reduce((sum, w) => sum + w.omzet, 0) / windowSize;
    }
    
    // Calculate growth compared to previous period
    if (index > 0) {
      const previous = data[index - 1];
      if (previous) {
        item.growth = previous.omzet > 0 ? ((item.omzet - previous.omzet) / previous.omzet) * 100 : 0;
      }
    }
  });
};

const drilldownToChart = () => {
  // Drilldown to transaction list with current filters
  emit('drilldown', props.filters);
};

const drilldownToPeriod = (period: string) => {
  const filters = { ...props.filters };
  
  // Set specific date range for the period
  const date = new Date(period);
  
  switch (selectedPeriod.value) {
    case 'daily':
      filters.dateFrom = period;
      filters.dateTo = period;
      break;
    case 'weekly':
      const weekEnd = new Date(date);
      weekEnd.setDate(date.getDate() + 6);
      filters.dateFrom = period;
      filters.dateTo = weekEnd.toISOString().split('T')[0];
      break;
    case 'monthly':
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      filters.dateFrom = monthStart.toISOString().split('T')[0];
      filters.dateTo = monthEnd.toISOString().split('T')[0];
      break;
  }
  
  emit('drilldown', filters);
};

const exportSummary = () => {
  const toast = useToast();
  toast.info('Fitur ekspor tabel akan segera tersedia');
  // TODO: Implement table export
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

const formatPeriod = (period: string): string => {
  const date = new Date(period);
  
  switch (selectedPeriod.value) {
    case 'daily':
      return date.toLocaleDateString('id-ID', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    case 'weekly':
      const weekEnd = new Date(date);
      weekEnd.setDate(date.getDate() + 6);
      return `${date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}`;
    case 'monthly':
      return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
    default:
      return period;
  }
};

// Watchers
watch(() => props.filters, fetchTrendData, { deep: true });
watch(selectedPeriod, fetchTrendData);

// Lifecycle
onMounted(() => {
  fetchTrendData();
});
</script>