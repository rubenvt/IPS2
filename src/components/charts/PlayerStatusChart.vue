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

// Sample data - in a real app, this would come from the store
const chartData = ref({
  active: 12,
  offline: 3,
  maintenance: 2
});

// Watch for changes in player status
watch(() => store.state.players, () => {
  updateChartData();
}, { deep: true });

function updateChartData() {
  // In a real implementation, calculate these values from store.state.players
  const active = store.state.players.filter(p => p.status === 'active').length || chartData.value.active;
  const offline = store.state.players.filter(p => p.status === 'offline').length || chartData.value.offline;
  const maintenance = store.state.players.filter(p => p.status === 'maintenance').length || chartData.value.maintenance;
  
  chartData.value = { active, offline, maintenance };
  
  if (chart) {
    chart.data.datasets[0].data = [active, offline, maintenance];
    chart.update();
  }
}

onMounted(() => {
  if (chartCanvas.value) {
    chart = new Chart(chartCanvas.value, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Offline', 'Maintenance'],
        datasets: [{
          data: [chartData.value.active, chartData.value.offline, chartData.value.maintenance],
          backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Player Status'
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
