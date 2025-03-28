<template>
  <div class="main-content">
    <Header title="System Settings" />
    <div class="content-area">
      <div class="content-panel" style="width: 250px;">
        <div class="panel-header">
          <div class="panel-title">Settings</div>
        </div>
        <ul class="sidebar-menu">
          <li class="sidebar-item" :class="{ active: activeSection === 'general' }" @click="activeSection = 'general'">
            <i class="fas fa-cog"></i>
            <span>General</span>
          </li>
          <li class="sidebar-item" :class="{ active: activeSection === 'users' }" @click="activeSection = 'users'">
            <i class="fas fa-users"></i>
            <span>Users</span>
          </li>
          <li class="sidebar-item" :class="{ active: activeSection === 'network' }" @click="activeSection = 'network'">
            <i class="fas fa-network-wired"></i>
            <span>Network</span>
          </li>
          <li class="sidebar-item" :class="{ active: activeSection === 'storage' }" @click="activeSection = 'storage'">
            <i class="fas fa-database"></i>
            <span>Storage</span>
          </li>
          <li class="sidebar-item" :class="{ active: activeSection === 'backup' }" @click="activeSection = 'backup'">
            <i class="fas fa-save"></i>
            <span>Backup</span>
          </li>
          <li class="sidebar-item" :class="{ active: activeSection === 'updates' }" @click="activeSection = 'updates'">
            <i class="fas fa-sync"></i>
            <span>Updates</span>
          </li>
        </ul>
      </div>
      
      <!-- General Settings Section -->
      <div class="content-panel" v-if="activeSection === 'general'">
        <div class="panel-header">
          <div class="panel-title">General Settings</div>
        </div>
        <div class="panel-content">
          <div class="form-group">
            <label class="form-label">System Name</label>
            <input type="text" class="form-control" value="ProCon Digital Signage" />
          </div>
          <div class="form-group">
            <label class="form-label">Time Zone</label>
            <select class="form-control">
              <option>UTC</option>
              <option>America/New_York</option>
              <option>Europe/London</option>
              <option>Asia/Tokyo</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Default Language</label>
            <select class="form-control">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div class="form-actions">
            <button class="btn btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
      
      <!-- Storage Management Section -->
      <div class="content-panel" v-if="activeSection === 'storage'">
        <div class="panel-header">
          <div class="panel-title">Storage Management</div>
        </div>
        <div class="panel-content">
          <!-- Storage Overview -->
          <div class="storage-overview">
            <div class="storage-quota-card">
              <div class="quota-title">Total Storage</div>
              <div class="quota-value">{{ formatSize(totalStorage) }}</div>
              <div class="quota-progress">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: `${(usedStorage / totalStorage) * 100}%`, backgroundColor: getStorageColor() }"
                  ></div>
                </div>
                <div class="progress-text">
                  {{ formatSize(usedStorage) }} used ({{ Math.round((usedStorage / totalStorage) * 100) }}%)
                </div>
              </div>
              <div class="quota-warning" v-if="storageWarning">
                <i class="fas fa-exclamation-triangle"></i>
                {{ storageWarning }}
              </div>
            </div>
          </div>
          
          <!-- Storage by Content Type -->
          <div class="section-header">Storage by Content Type</div>
          <div class="storage-type-breakdown">
            <div class="storage-type-card">
              <div class="type-icon"><i class="fas fa-image"></i></div>
              <div class="type-details">
                <div class="type-title">Images</div>
                <div class="type-value">{{ formatSize(imageStorage) }}</div>
                <div class="type-progress">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{ width: `${(imageStorage / usedStorage) * 100}%`, backgroundColor: '#4ade80' }"
                    ></div>
                  </div>
                  <div class="progress-text">{{ Math.round((imageStorage / usedStorage) * 100) }}% of used storage</div>
                </div>
              </div>
            </div>
            
            <div class="storage-type-card">
              <div class="type-icon"><i class="fas fa-video"></i></div>
              <div class="type-details">
                <div class="type-title">Videos</div>
                <div class="type-value">{{ formatSize(videoStorage) }}</div>
                <div class="type-progress">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{ width: `${(videoStorage / usedStorage) * 100}%`, backgroundColor: '#3b82f6' }"
                    ></div>
                  </div>
                  <div class="progress-text">{{ Math.round((videoStorage / usedStorage) * 100) }}% of used storage</div>
                </div>
              </div>
            </div>
            
            <div class="storage-type-card">
              <div class="type-icon"><i class="fas fa-file-alt"></i></div>
              <div class="type-details">
                <div class="type-title">Other</div>
                <div class="type-value">{{ formatSize(otherStorage) }}</div>
                <div class="type-progress">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{ width: `${(otherStorage / usedStorage) * 100}%`, backgroundColor: '#a855f7' }"
                    ></div>
                  </div>
                  <div class="progress-text">{{ Math.round((otherStorage / usedStorage) * 100) }}% of used storage</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Storage Settings -->
          <div class="section-header">Storage Settings</div>
          <div class="form-group">
            <label class="form-label">Storage Quota</label>
            <div class="input-group">
              <input 
                type="number" 
                class="form-control" 
                v-model="quotaValue" 
                @input="updateQuota"
              />
              <select class="form-control" v-model="quotaUnit" @change="updateQuota">
                <option value="GB">GB</option>
                <option value="TB">TB</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Warning Thresholds</label>
            <div class="threshold-controls">
              <div class="threshold-item">
                <input type="checkbox" id="threshold80" v-model="thresholds.t80" />
                <label for="threshold80">80% Warning</label>
              </div>
              <div class="threshold-item">
                <input type="checkbox" id="threshold90" v-model="thresholds.t90" />
                <label for="threshold90">90% Warning</label>
              </div>
              <div class="threshold-item">
                <input type="checkbox" id="threshold95" v-model="thresholds.t95" />
                <label for="threshold95">95% Warning</label>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button class="btn btn-primary" @click="saveStorageSettings">Save Settings</button>
          </div>
        </div>
      </div>
      
      <!-- Other sections would go here -->
      <div class="content-panel" v-if="activeSection !== 'general' && activeSection !== 'storage'">
        <div class="panel-header">
          <div class="panel-title">{{ activeSection.charAt(0).toUpperCase() + activeSection.slice(1) }}</div>
        </div>
        <div class="panel-content">
          <p>This section is under development.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Header from '../components/Header.vue'

// Active section
const activeSection = ref('storage')

// Storage data
const totalStorage = ref(1024 * 1024 * 1024 * 100) // 100 GB
const usedStorage = ref(1024 * 1024 * 1024 * 78) // 78 GB
const imageStorage = ref(1024 * 1024 * 1024 * 18) // 18 GB
const videoStorage = ref(1024 * 1024 * 1024 * 58) // 58 GB
const otherStorage = ref(1024 * 1024 * 1024 * 2) // 2 GB

// Storage settings
const quotaValue = ref(100)
const quotaUnit = ref('GB')
const thresholds = ref({
  t80: true,
  t90: true,
  t95: true
})

// Computed properties
const storageWarning = computed(() => {
  const usagePercentage = (usedStorage.value / totalStorage.value) * 100
  if (usagePercentage >= 95 && thresholds.value.t95) {
    return 'Critical: Storage is at 95% capacity. Urgent action required.'
  } else if (usagePercentage >= 90 && thresholds.value.t90) {
    return 'Warning: Storage is at 90% capacity. Consider removing unused content.'
  } else if (usagePercentage >= 80 && thresholds.value.t80) {
    return 'Notice: Storage is at 80% capacity.'
  }
  return null
})

// Methods
function formatSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getStorageColor(): string {
  const usagePercentage = (usedStorage.value / totalStorage.value) * 100
  if (usagePercentage >= 95) {
    return '#ef4444' // Red
  } else if (usagePercentage >= 90) {
    return '#f97316' // Orange
  } else if (usagePercentage >= 80) {
    return '#eab308' // Yellow
  }
  return '#22c55e' // Green
}

function updateQuota() {
  const multiplier = quotaUnit.value === 'GB' ? 1024 * 1024 * 1024 : 1024 * 1024 * 1024 * 1024
  totalStorage.value = quotaValue.value * multiplier
}

function saveStorageSettings() {
  // In a real application, this would save to a backend
  alert('Storage settings saved successfully!')
}
</script>

<style scoped>
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

.section-header {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 24px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.storage-overview {
  margin-bottom: 24px;
}

.storage-quota-card {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.quota-title {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 4px;
}

.quota-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 12px;
}

.quota-progress {
  margin-bottom: 12px;
}

.progress-bar {
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: #64748b;
}

.quota-warning {
  background-color: #fef2f2;
  color: #b91c1c;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.quota-warning i {
  margin-right: 8px;
}

.storage-type-breakdown {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.storage-type-card {
  display: flex;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.type-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: #e0f2fe;
  border-radius: 8px;
  margin-right: 16px;
}

.type-icon i {
  font-size: 24px;
  color: #0284c7;
}

.type-details {
  flex: 1;
}

.type-title {
  font-size: 1rem;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
}

.type-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.threshold-controls {
  display: flex;
  gap: 16px;
}

.threshold-item {
  display: flex;
  align-items: center;
}

.threshold-item input {
  margin-right: 8px;
}

.input-group {
  display: flex;
}

.input-group .form-control:first-child {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.input-group .form-control:last-child {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  width: 80px;
}
</style>
