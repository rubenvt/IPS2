<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import { store } from '../../store';

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

// Watch for changes in content
watch(() => store.state.content, () => {
  updateChartData();
}, { deep: true });

function updateChartData() {
  if (chart) {
    // Group content by type and calculate total size
    const contentByType = store.state.content.reduce((acc: Record<string, number>, item: any) => {
      const type = item.type || 'unknown';
      acc[type] = (acc[type] || 0) + (item.size || 0);
      return acc;
    }, {});
    
    // Update chart data
    chart.data.labels = Object.keys(contentByType);
    chart.data.datasets[0].data = Object.values(contentByType);
    chart.update();
  }
}

onMounted(() => {
  if (chartCanvas.value) {
    // Sample initial data
    const initialData = {
      labels: ['Images', 'Videos', 'Other'],
      data: [250, 500, 50]
    };
    
    chart = new Chart(chartCanvas.value, {
      type: 'bar',
      data: {
        labels: initialData.labels,
        datasets: [{
          label: 'Storage Used (MB)',
          data: initialData.data,
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Size (MB)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Content Type'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Content Usage by Type'
          }
        }
      }
    });
  }
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
