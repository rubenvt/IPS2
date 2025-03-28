<template>
  <div class="overview-page">
    <h1>Dashboard Overview</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Players</h3>
        <div class="stat-value">{{ store.state.players.length }}</div>
        <div class="stat-detail">{{ activePlayerCount }} active</div>
      </div>
      
      <div class="stat-card">
        <h3>Playlists</h3>
        <div class="stat-value">{{ store.state.playlists.length }}</div>
        <div class="stat-detail">{{ activePlaylists }} active</div>
      </div>
      
      <div class="stat-card">
        <h3>Content Items</h3>
        <div class="stat-value">{{ store.state.content.length }}</div>
        <div class="stat-detail">{{ storageUsed }} MB used</div>
      </div>
      
      <div class="stat-card">
        <h3>Storage</h3>
        <div class="stat-value">{{ storagePercentage }}%</div>
        <div class="stat-detail">{{ storageUsed }} / {{ storageLimit }} MB</div>
      </div>
    </div>
    
    <div class="charts-grid">
      <div class="chart-card">
        <PlayerStatusChart />
      </div>
      
      <div class="chart-card">
        <ContentUsageChart />
      </div>
    </div>
    
    <div class="recent-activity">
      <h2>Recent Activity</h2>
      <div class="activity-list">
        <div class="activity-item" v-for="(activity, index) in recentActivities" :key="index">
          <div class="activity-icon">
            <i :class="activity.icon"></i>
          </div>
          <div class="activity-details">
            <div class="activity-title">{{ activity.title }}</div>
            <div class="activity-time">{{ activity.time }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import PlayerStatusChart from '../components/charts/PlayerStatusChart.vue';
import ContentUsageChart from '../components/charts/ContentUsageChart.vue';
import { store } from '../store';

// Computed properties
const activePlayerCount = computed(() => {
  return store.state.players.filter(p => p.status === 'active').length || 0;
});

const activePlaylists = computed(() => {
  return store.state.playlists.filter(p => p.active).length || 0;
});

const storageUsed = computed(() => {
  return store.state.systemSettings.storageUsed || 0;
});

const storageLimit = computed(() => {
  return store.state.systemSettings.storageLimit || 10000;
});

const storagePercentage = computed(() => {
  return Math.round((storageUsed.value / storageLimit.value) * 100);
});

// Sample recent activities
const recentActivities = ref([
  {
    title: 'New content uploaded: Summer Promotion',
    time: '10 minutes ago',
    icon: 'fas fa-upload'
  },
  {
    title: 'Player #103 went offline',
    time: '25 minutes ago',
    icon: 'fas fa-exclamation-triangle'
  },
  {
    title: 'Playlist "Holiday Special" updated',
    time: '1 hour ago',
    icon: 'fas fa-list'
  },
  {
    title: 'New player registered: Lobby Display',
    time: '3 hours ago',
    icon: 'fas fa-tv'
  }
]);
</script>

<style scoped>
.overview-page {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 10px 0;
  color: #2c3e50;
}

.stat-detail {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.recent-activity {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.activity-list {
  margin-top: 15px;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f5ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: #3498db;
}

.activity-title {
  font-weight: 500;
  margin-bottom: 5px;
}

.activity-time {
  font-size: 0.8rem;
  color: #7f8c8d;
}
</style>
