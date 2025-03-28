<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <img src="../assets/logo.svg" alt="Logo" class="logo" />
      <div class="product-info">
        <div class="product-name">IPSv2</div>
        <div class="product-version">v.27.3.0</div>
      </div>
    </div>
    <div class="sidebar-menu">
      <router-link to="/" class="menu-item" active-class="active">
        <i class="fas fa-tachometer-alt"></i>
        <span>Overview</span>
      </router-link>
      <router-link to="/players" class="menu-item" active-class="active">
        <i class="fas fa-desktop"></i>
        <span>Players</span>
      </router-link>
      <router-link to="/playlists" class="menu-item" active-class="active">
        <i class="fas fa-list"></i>
        <span>Playlists</span>
      </router-link>
      <router-link to="/content-library" class="menu-item" active-class="active">
        <i class="fas fa-photo-video"></i>
        <span>Content Library</span>
      </router-link>
      <router-link to="/schedules" class="menu-item" active-class="active">
        <i class="fas fa-calendar-alt"></i>
        <span>Schedules</span>
      </router-link>
      <router-link to="/reports" class="menu-item" active-class="active">
        <i class="fas fa-chart-bar"></i>
        <span>Reports</span>
      </router-link>
      <router-link to="/system" class="menu-item" active-class="active">
        <i class="fas fa-cog"></i>
        <span>System</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional script needed
</script>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  background-color: #1e293b;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #334155;
  z-index: 10;
}

.sidebar-header {
  padding: 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #334155;
}

.logo {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: 600;
  font-size: 16px;
}

.product-version {
  font-size: 12px;
  color: #94a3b8;
}

.sidebar-menu {
  padding: 16px 0;
  flex: 1;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s;
}

.menu-item:hover {
  background-color: #334155;
  color: #f8fafc;
}

.menu-item.active {
  background-color: #2563eb;
  color: #f8fafc;
}

.menu-item i {
  width: 20px;
  margin-right: 12px;
  text-align: center;
}
</style>
