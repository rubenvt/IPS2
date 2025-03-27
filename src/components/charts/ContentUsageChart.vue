<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

// Register required components for doughnut chart
Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

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
      labels: ['Videos', 'Images', 'Documents', 'Other'],
      datasets: [
        {
          data: [45, 30, 15, 10],
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
          borderColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
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
</script>

<style scoped>
.chart-container {
  height: 180px;
  position: relative;
}
</style>
