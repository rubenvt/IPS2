<template>
  <div class="main-content">
    <Header title="Overview" />
    <div class="content-area">
      <div class="dashboard-grid">
        <!-- Status Cards -->
        <div class="panel status-panel">
          <div class="panel-header">
            <div class="panel-title">System Status</div>
          </div>
          <div class="dashboard-content">
            <div class="dashboard-card">
              <div class="card-title">Players</div>
              <div class="card-value">7</div>
              <div class="card-subtitle">5 online, 2 offline</div>
            </div>
            <div class="dashboard-card">
              <div class="card-title">Playlists</div>
              <div class="card-value">12</div>
              <div class="card-subtitle">3 active</div>
            </div>
            <div class="dashboard-card">
              <div class="card-title">Content Items</div>
              <div class="card-value">45</div>
              <div class="card-subtitle">12 GB total</div>
            </div>
          </div>
        </div>

        <!-- Warnings Panel -->
        <div class="panel warnings-panel">
          <div class="panel-header">
            <div class="panel-title">Alerts</div>
          </div>
          <div class="warnings-content">
            <WarningCard 
              type="error" 
              title="Player Offline" 
              message="Player 'Lobby Display' has been offline for 2 days." 
            />
            <WarningCard 
              type="error" 
              title="Player Offline" 
              message="Player 'Cafeteria Screen' has been offline for 5 hours." 
            />
            <WarningCard 
              type="warning" 
              title="License Expiring" 
              message="Your Pro license will expire in 15 days." 
            />
          </div>
        </div>

        <!-- Player Status Chart -->
        <div class="panel chart-panel">
          <div class="panel-header">
            <div class="panel-title">Player Status</div>
          </div>
          <div class="chart-content">
            <PlayerStatusChart :online="5" :offline="2" />
          </div>
        </div>

        <!-- Content Usage Chart -->
        <div class="panel chart-panel">
          <div class="panel-header">
            <div class="panel-title">Content Distribution</div>
          </div>
          <div class="chart-content">
            <ContentUsageChart />
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="panel activity-panel">
          <div class="panel-header">
            <div class="panel-title">Recent Activity</div>
          </div>
          <div class="activity-content">
            <div class="activity-item">
              <div class="activity-icon"><i class="fas fa-upload"></i></div>
              <div class="activity-details">
                <div class="activity-text">New content uploaded: <strong>Summer Promotion.mp4</strong></div>
                <div class="activity-time">Today, 10:23 AM</div>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon"><i class="fas fa-desktop"></i></div>
              <div class="activity-details">
                <div class="activity-text">Player <strong>Reception Screen</strong> came online</div>
                <div class="activity-time">Today, 9:15 AM</div>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon"><i class="fas fa-list"></i></div>
              <div class="activity-details">
                <div class="activity-text">Playlist <strong>Holiday Special</strong> updated</div>
                <div class="activity-time">Yesterday, 4:30 PM</div>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon"><i class="fas fa-desktop"></i></div>
              <div class="activity-details">
                <div class="activity-text">Player <strong>Cafeteria Screen</strong> went offline</div>
                <div class="activity-time">Yesterday, 2:45 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '../components/Header.vue';
import WarningCard from '../components/WarningCard.vue';
import PlayerStatusChart from '../components/charts/PlayerStatusChart.vue';
import ContentUsageChart from '../components/charts/ContentUsageChart.vue';
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(min-content, max-content);
  gap: 20px;
  padding: 20px;
}

.panel {
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.status-panel {
  grid-column: span 3;
}

.warnings-panel {
  grid-column: span 3;
}

.chart-panel {
  grid-column: span 1;
}

.activity-panel {
  grid-column: span 3;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.panel-title {
  font-weight: 600;
  font-size: 16px;
  color: #1e293b;
}

.dashboard-content {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.dashboard-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.card-title {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 10px;
}

.card-value {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #1e293b;
}

.card-subtitle {
  font-size: 13px;
  color: #64748b;
}

.warnings-content {
  padding: 16px;
}

.chart-content {
  padding: 16px;
}

.activity-content {
  padding: 0;
}

.activity-item {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #dbeafe;
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.activity-details {
  flex: 1;
}

.activity-text {
  font-size: 14px;
  margin-bottom: 4px;
  color: #1e293b;
}

.activity-time {
  font-size: 12px;
  color: #64748b;
}
</style>
