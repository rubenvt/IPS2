<template>
  <div class="main-content">
    <Header title="System" />
    <div class="content-area">
      <div class="content-panel" style="width: 250px;">
        <div class="panel-header">
          <div class="panel-title">Settings</div>
        </div>
        <ul class="sidebar-menu">
          <li 
            v-for="setting in settings" 
            :key="setting.id" 
            class="sidebar-item" 
            :class="{ active: selectedSettingId === setting.id }"
            @click="selectedSettingId = setting.id"
          >
            <i :class="setting.icon"></i>
            <span>{{ setting.title }}</span>
          </li>
        </ul>
      </div>
      <div class="content-panel">
        <div class="panel-header">
          <div class="panel-title">{{ currentSettingTitle }}</div>
        </div>
        <div class="settings-content">
          <div v-if="selectedSettingId === 'general'" class="settings-section">
            <h3>General Settings</h3>
            <div class="form-group">
              <label class="form-label">System Name</label>
              <input type="text" class="form-control" value="ProCon Digital Signage" />
            </div>
            <div class="form-group">
              <label class="form-label">Default Language</label>
              <select class="form-control">
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="es">Spanish</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Time Zone</label>
              <select class="form-control">
                <option value="utc">UTC</option>
                <option value="est">Eastern Time (ET)</option>
                <option value="cst">Central Time (CT)</option>
                <option value="mst">Mountain Time (MT)</option>
                <option value="pst">Pacific Time (PT)</option>
              </select>
            </div>
          </div>
          <div v-else-if="selectedSettingId === 'users'" class="settings-section">
            <h3>User Management</h3>
            <div class="user-list">
              <div class="user-item" v-for="user in users" :key="user.id">
                <div class="user-avatar">{{ user.initials }}</div>
                <div class="user-info">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-role">{{ user.role }}</div>
                </div>
                <div class="user-actions">
                  <button class="btn-sm">Edit</button>
                  <button class="btn-sm">Delete</button>
                </div>
              </div>
            </div>
            <button class="btn btn-primary mt-4">Add New User</button>
          </div>
          <div v-else-if="selectedSettingId === 'network'" class="settings-section">
            <h3>Network Configuration</h3>
            <div class="form-group">
              <label class="form-label">Server Address</label>
              <input type="text" class="form-control" value="https://signage.example.com" />
            </div>
            <div class="form-group">
              <label class="form-label">API Key</label>
              <div class="api-key-field">
                <input type="password" class="form-control" value="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                <button class="btn-sm">Show</button>
                <button class="btn-sm">Copy</button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Connection Status</label>
              <div class="status-indicator">
                <span class="status-dot online"></span>
                <span>Connected</span>
              </div>
            </div>
          </div>
          <div v-else class="settings-empty">
            <i class="fas fa-cog fa-3x"></i>
            <p>Select a setting from the menu</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Header from '../components/Header.vue'

const settings = ref([
  { id: 'general', title: 'General', icon: 'fas fa-sliders-h' },
  { id: 'users', title: 'User Management', icon: 'fas fa-users' },
  { id: 'network', title: 'Network', icon: 'fas fa-network-wired' },
  { id: 'storage', title: 'Storage', icon: 'fas fa-hdd' },
  { id: 'security', title: 'Security', icon: 'fas fa-shield-alt' },
  { id: 'updates', title: 'Updates', icon: 'fas fa-sync' },
  { id: 'logs', title: 'System Logs', icon: 'fas fa-clipboard-list' }
])

const users = ref([
  { id: 1, name: 'John Smith', role: 'Administrator', initials: 'JS' },
  { id: 2, name: 'Sarah Johnson', role: 'Content Manager', initials: 'SJ' },
  { id: 3, name: 'Michael Brown', role: 'Viewer', initials: 'MB' }
])

const selectedSettingId = ref('general')

const currentSettingTitle = computed(() => {
  const setting = settings.value.find(s => s.id === selectedSettingId.value)
  return setting ? setting.title : ''
})
</script>

<style scoped>
.settings-content {
  padding: 20px;
}

.settings-section {
  max-width: 600px;
}

.settings-section h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 500;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  margin-right: 12px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 500;
  color: #1e293b;
}

.user-role {
  font-size: 12px;
  color: #64748b;
}

.user-actions {
  display: flex;
  gap: 8px;
}

.api-key-field {
  display: flex;
  gap: 8px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-dot.online {
  background-color: #22c55e;
}

.status-dot.offline {
  background-color: #ef4444;
}

.mt-4 {
  margin-top: 16px;
}

.settings-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  color: #999;
}

.settings-empty i {
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
