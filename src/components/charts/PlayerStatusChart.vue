<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

// Register required components for doughnut chart
Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

const props = defineProps<{
  online: number;
  offline: number;
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const createChart = () => {
  if (!chartCanvas.value) return;
  
  // Destroy existing chart if it exists
  if (chart) {
    chart.destroy();
  }
  
  chart = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: {
      labels: ['Online', 'Offline'],
      datasets: [
        {
          data: [props.online, props.offline],
          backgroundColor: ['#10b981', '#ef4444'],
          borderColor: ['#10b981', '#ef4444'],
          borderWidth: 1,
          hoverOffset: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 15
          }
        }
      },
      cutout: '70%'
    }
  });
};

onMounted(() => {
  createChart();
});

watch([() => props.online, () => props.offline], () => {
  createChart();
});
</script>

<style scoped>
.chart-container {
  height: 180px;
  position: relative;
}
</style>
