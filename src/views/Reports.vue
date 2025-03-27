<template>
  <div class="main-content">
    <Header title="Reports" />
    <div class="content-area">
      <div class="content-panel" style="width: 250px;">
        <div class="panel-header">
          <div class="panel-title">Report Types</div>
        </div>
        <ul class="sidebar-menu">
          <li 
            v-for="report in reportTypes" 
            :key="report.id" 
            class="sidebar-item" 
            :class="{ active: selectedReportId === report.id }"
            @click="selectedReportId = report.id"
          >
            <i :class="report.icon"></i>
            <span>{{ report.title }}</span>
          </li>
        </ul>
      </div>
      <div class="content-panel">
        <div class="panel-header">
          <div class="panel-title">{{ currentReportTitle }}</div>
          <div class="panel-actions">
            <button><i class="fas fa-download"></i></button>
            <button><i class="fas fa-print"></i></button>
            <button><i class="fas fa-sync"></i></button>
          </div>
        </div>
        <div class="report-filters">
          <div class="filter-group">
            <label>Date Range</label>
            <div class="filter-controls">
              <input type="date" class="form-control" />
              <span class="filter-separator">to</span>
              <input type="date" class="form-control" />
            </div>
          </div>
          <div class="filter-group">
            <label>Players</label>
            <select class="form-control">
              <option value="all">All Players</option>
              <option value="lobby">Lobby Display</option>
              <option value="conference">Conference Room A</option>
              <option value="cafeteria">Cafeteria Display</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Content</label>
            <select class="form-control">
              <option value="all">All Content</option>
              <option value="announcements">Company Announcements</option>
              <option value="products">Product Showcase</option>
              <option value="menu">Cafeteria Menu</option>
            </select>
          </div>
          <button class="btn btn-primary">Apply Filters</button>
        </div>
        <div class="report-content">
          <div v-if="selectedReportId === 'player-status'" class="report-chart">
            <h3>Player Status Overview</h3>
            <div class="chart-container">
              <div class="chart-placeholder">
                <div class="chart-bar" style="height: 70%;">
                  <div class="chart-label">Online</div>
                </div>
                <div class="chart-bar" style="height: 20%;">
                  <div class="chart-label">Offline</div>
                </div>
                <div class="chart-bar" style="height: 10%;">
                  <div class="chart-label">Error</div>
                </div>
              </div>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-color" style="background-color: #2ecc71;"></div>
                <div class="legend-label">Online: 5 players (70%)</div>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: #e74c3c;"></div>
                <div class="legend-label">Offline: 2 players (20%)</div>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: #f39c12;"></div>
                <div class="legend-label">Error: 1 player (10%)</div>
              </div>
            </div>
          </div>
          <div v-else-if="selectedReportId === 'content-usage'" class="report-chart">
            <h3>Content Usage Statistics</h3>
            <div class="chart-container">
              <div class="chart-placeholder">
                <div class="chart-bar" style="height: 45%;">
                  <div class="chart-label">Announcements</div>
                </div>
                <div class="chart-bar" style="height: 30%;">
                  <div class="chart-label">Products</div>
                </div>
                <div class="chart-bar" style="height: 15%;">
                  <div class="chart-label">Menu</div>
                </div>
                <div class="chart-bar" style="height: 10%;">
                  <div class="chart-label">Welcome</div>
                </div>
              </div>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-color" style="background-color: #3498db;"></div>
                <div class="legend-label">Company Announcements: 45%</div>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: #9b59b6;"></div>
                <div class="legend-label">Product Showcase: 30%</div>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: #2ecc71;"></div>
                <div class="legend-label">Cafeteria Menu: 15%</div>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: #f39c12;"></div>
                <div class="legend-label">Welcome Presentation: 10%</div>
              </div>
            </div>
          </div>
          <div v-else class="report-empty">
            <i class="fas fa-chart-bar fa-3x"></i>
            <p>Select a report type from the menu</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Header from '../components/Header.vue'

const reportTypes = ref([
  { id: 'player-status', title: 'Player Status', icon: 'fas fa-desktop' },
  { id: 'content-usage', title: 'Content Usage', icon: 'fas fa-chart-pie' },
  { id: 'playback-history', title: 'Playback History', icon: 'fas fa-history' },
  { id: 'system-performance', title: 'System Performance', icon: 'fas fa-tachometer-alt' },
  { id: 'user-activity', title: 'User Activity', icon: 'fas fa-users' }
])

const selectedReportId = ref('player-status')

const currentReportTitle = computed(() => {
  const report = reportTypes.value.find(r => r.id === selectedReportId.value)
  return report ? report.title : ''
})
</script>

<style scoped>
.report-filters {
  padding: 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-size: 12px;
  margin-bottom: 5px;
  font-weight: 500;
}

.filter-controls {
  display: flex;
  align-items: center;
}

.filter-separator {
  margin: 0 10px;
}

.report-content {
  padding: 20px;
}

.report-chart {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.report-chart h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 500;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: 20px;
}

.chart-placeholder {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
}

.chart-bar {
  width: 60px;
  background-color: #3498db;
  position: relative;
  display: flex;
  justify-content: center;
}

.chart-bar:nth-child(1) {
  background-color: #2ecc71;
}

.chart-bar:nth-child(2) {
  background-color: #e74c3c;
}

.chart-bar:nth-child(3) {
  background-color: #f39c12;
}

.chart-bar:nth-child(4) {
  background-color: #9b59b6;
}

.chart-label {
  position: absolute;
  bottom: -25px;
  font-size: 12px;
  text-align: center;
  width: 100%;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 30px;
}

.legend-item {
  display: flex;
  align-items: center;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 8px;
}

.report-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  color: #999;
}

.report-empty i {
  margin-bottom: 15px;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #1e293b;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sidebar-item:hover {
  background-color: #f1f5f9;
}

.sidebar-item.active {
  background-color: #e0f2fe;
  color: #0284c7;
}

.sidebar-item i {
  margin-right: 12px;
  width: 20px;
  text-align: center;
}
</style>
