<script setup lang="ts">
import { computed } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps<{
  data: number[];
  labels: string[];
}>();

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Pemberian Makan',
      data: props.data,
      borderColor: '#F6AD55',
      backgroundColor: (context: any) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(246, 173, 85, 0.4)');
        gradient.addColorStop(1, 'rgba(246, 173, 85, 0.0)');
        return gradient;
      },
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 10,
      pointBackgroundColor: '#ED8936',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 4,
    },
  ],
}));

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }, // Clean look
        tooltip: {
            backgroundColor: '#FFFFFF',
            titleColor: '#2D3748',
            bodyColor: '#718096',
            borderColor: '#E2E8F0',
            borderWidth: 1,
            padding: 16,
            cornerRadius: 12,
            displayColors: false,
            titleFont: { size: 14, weight: 'bold' as const, family: 'Inter' },
            bodyFont: { size: 13, family: 'Inter' },
        }
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: '#CBD5E0', font: { family: 'Inter' } },
        },
        y: {
            grid: { color: '#F7FAFC', borderDash: [8, 8] },
            ticks: { color: '#CBD5E0', font: { family: 'Inter' }, stepSize: 1 },
            beginAtZero: true,
        },
    }
};
</script>

<template>
  <div class="w-full h-[360px]">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
