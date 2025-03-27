<template>
  <div class="main-content">
    <Header title="Layouts" />
    <div class="content-area">
      <div class="content-panel">
        <div class="panel-header">
          <div class="panel-title">Layouts</div>
          <div class="panel-actions">
            <button @click="showAddLayout = true"><i class="fas fa-plus"></i></button>
            <button><i class="fas fa-filter"></i></button>
            <button><i class="fas fa-ellipsis-v"></i></button>
          </div>
        </div>
        <SearchBar placeholder="Search layouts..." @search="searchLayouts" />
        <ListView 
          :items="filteredLayouts" 
          :selectedId="selectedLayoutId"
          @select="selectLayout"
          @action="handleLayoutAction"
        />
      </div>
      <div class="detail-panel" v-if="selectedLayout">
        <div class="detail-header">
          <div class="detail-title">{{ selectedLayout.title }}</div>
          <div class="detail-subtitle">{{ selectedLayout.subtitle }}</div>
        </div>
        <div class="detail-section">
          <div class="section-header">Layout Preview</div>
          <div class="section-content layout-preview">
            <div class="layout-canvas">
              <div class="layout-zone" v-for="(zone, index) in layoutZones" :key="index" :style="zone.style">
                {{ zone.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <div class="section-header">Layout Settings</div>
          <div class="section-content">
            <div class="form-group">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" v-model="selectedLayout.title" />
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea class="form-control" v-model="selectedLayout.subtitle"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Resolution</label>
              <select class="form-control">
                <option value="1920x1080">1920x1080 (Full HD)</option>
                <option value="1280x720">1280x720 (HD)</option>
                <option value="3840x2160">3840x2160 (4K)</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <div class="section-header">Zones</div>
          <div class="section-content">
            <ul class="zones-list">
              <li v-for="(zone, index) in layoutZones" :key="index" class="zone-item">
                <div class="zone-header">
                  <div class="zone-name">{{ zone.name }}</div>
                  <div class="zone-actions">
                    <button><i class="fas fa-edit"></i></button>
                    <button><i class="fas fa-trash"></i></button>
                  </div>
                </div>
                <div class="zone-details">
                  <div class="zone-detail">
                    <span class="zone-detail-label">Position:</span>
                    <span class="zone-detail-value">{{ zone.position }}</span>
                  </div>
                  <div class="zone-detail">
                    <span class="zone-detail-label">Size:</span>
                    <span class="zone-detail-value">{{ zone.size }}</span>
                  </div>
                </div>
              </li>
            </ul>
            <button class="btn btn-secondary mt-3">
              <i class="fas fa-plus"></i> Add Zone
            </button>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary">Cancel</button>
          <button class="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
    <Modal v-model="showAddLayout" title="Add New Layout">
      <div class="form-group">
        <label class="form-label">Layout Name</label>
        <input type="text" class="form-control" v-model="newLayoutName" />
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-control" v-model="newLayoutDescription"></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Template</label>
        <select class="form-control" v-model="newLayoutTemplate">
          <option value="blank">Blank</option>
          <option value="fullscreen">Fullscreen</option>
          <option value="split">Split Screen</option>
          <option value="zones">Multi-Zone</option>
        </select>
      </div>
      <template #footer>
        <button class="btn btn-secondary" @click="showAddLayout = false">Cancel</button>
        <button class="btn btn-primary" @click="addLayout">Add Layout</button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Header from '../components/Header.vue'
import SearchBar from '../components/SearchBar.vue'
import ListView from '../components/ListView.vue'
import Modal from '../components/Modal.vue'

const layouts = ref([
  { 
    id: 1, 
    title: 'Fullscreen', 
    subtitle: '1920x1080', 
    icon: 'fas fa-th-large',
    actions: [
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'duplicate', icon: 'fas fa-copy' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 2, 
    title: 'Split Screen', 
    subtitle: '1920x1080', 
    icon: 'fas fa-th-large',
    actions: [
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'duplicate', icon: 'fas fa-copy' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 3, 
    title: 'L-Bar', 
    subtitle: '1920x1080', 
    icon: 'fas fa-th-large',
    actions: [
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'duplicate', icon: 'fas fa-copy' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 4, 
    title: 'Multi-Zone', 
    subtitle: '1920x1080', 
    icon: 'fas fa-th-large',
    actions: [
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'duplicate', icon: 'fas fa-copy' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  }
])

const layoutZones = ref([
  { 
    name: 'Main Content', 
    position: 'X: 0, Y: 0', 
    size: 'W: 1920px, H: 880px',
    style: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '80%',
      backgroundColor: 'rgba(52, 152, 219, 0.3)',
      border: '1px dashed #3498db',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
  { 
    name: 'Ticker', 
    position: 'X: 0, Y: 880', 
    size: 'W: 1920px, H: 200px',
    style: {
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '100%',
      height: '20%',
      backgroundColor: 'rgba(231, 76, 60, 0.3)',
      border: '1px dashed #e74c3c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }
])

const searchQuery = ref('')
const selectedLayoutId = ref<number | null>(null)
const showAddLayout = ref(false)
const newLayoutName = ref('')
const newLayoutDescription = ref('')
const newLayoutTemplate = ref('blank')

const filteredLayouts = computed(() => {
  if (!searchQuery.value) return layouts.value
  const query = searchQuery.value.toLowerCase()
  return layouts.value.filter(layout => 
    layout.title.toLowerCase().includes(query) || 
    layout.subtitle.toLowerCase().includes(query)
  )
})

const selectedLayout = computed(() => {
  if (!selectedLayoutId.value) return null
  return layouts.value.find(layout => layout.id === selectedLayoutId.value)
})

function searchLayouts(query: string) {
  searchQuery.value = query
}

function selectLayout(id: number) {
  selectedLayoutId.value = id
}

function handleLayoutAction({ id, action }: { id: number, action: string }) {
  if (action === 'edit') {
    selectedLayoutId.value = id
  } else if (action === 'duplicate') {
    const layoutToDuplicate = layouts.value.find(layout => layout.id === id)
    if (layoutToDuplicate) {
      const newId = Math.max(...layouts.value.map(l => l.id)) + 1
      layouts.value.push({
        ...layoutToDuplicate,
        id: newId,
        title: `${layoutToDuplicate.title} (Copy)`
      })
    }
  } else if (action === 'delete') {
    if (confirm('Are you sure you want to delete this layout?')) {
      layouts.value = layouts.value.filter(layout => layout.id !== id)
      if (selectedLayoutId.value === id) {
        selectedLayoutId.value = null
      }
    }
  }
}

function addLayout() {
  if (newLayoutName.value) {
    const newId = Math.max(...layouts.value.map(l => l.id)) + 1
    layouts.value.push({
      id: newId,
      title: newLayoutName.value,
      subtitle: '1920x1080',
      icon: 'fas fa-th-large',
      actions: [
        { name: 'edit', icon: 'fas fa-edit' },
        { name: 'duplicate', icon: 'fas fa-copy' },
        { name: 'delete', icon: 'fas fa-trash' }
      ]
    })
    newLayoutName.value = ''
    newLayoutDescription.value = ''
    newLayoutTemplate.value = 'blank'
    showAddLayout.value = false
  }
}
</script>

<style scoped>
.layout-preview {
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 10px;
  min-height: 300px;
}

.layout-canvas {
  background-color: #fff;
  width: 100%;
  height: 280px;
  position: relative;
  border: 1px solid #ddd;
}

.zones-list {
  list-style: none;
  padding: 0;
}

.zone-item {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 10px;
  overflow: hidden;
}

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.zone-name {
  font-weight: 500;
}

.zone-actions {
  display: flex;
}

.zone-actions button {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  margin-left: 5px;
}

.zone-details {
  padding: 10px;
}

.zone-detail {
  display: flex;
  margin-bottom: 5px;
}

.zone-detail-label {
  width: 80px;
  font-weight: 500;
}

.mt-3 {
  margin-top: 15px;
}
</style>
