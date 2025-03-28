<template>
  <div class="main-content">
    <Header title="Playlists" />
    <div class="content-area">
      <div class="content-panel">
        <div class="panel-header">
          <div class="panel-title">Playlists</div>
          <div class="panel-actions">
            <button @click="showAddPlaylist = true"><i class="fas fa-plus"></i></button>
            <button><i class="fas fa-filter"></i></button>
            <button><i class="fas fa-ellipsis-v"></i></button>
          </div>
        </div>
        <SearchBar placeholder="Search playlists..." @search="searchPlaylists" />
        <ListView 
          :items="filteredPlaylists" 
          :selectedId="selectedPlaylistId"
          @select="selectPlaylist"
          @action="handlePlaylistAction"
        />
      </div>
      <div class="detail-panel" v-if="selectedPlaylist">
        <div class="detail-header">
          <div class="detail-title">{{ selectedPlaylist.title }}</div>
          <div class="detail-subtitle">{{ selectedPlaylist.items.length }} items</div>
        </div>
        <div class="detail-section">
          <div class="section-header">Playlist Information</div>
          <div class="section-content">
            <div class="form-group">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" v-model="selectedPlaylist.title" />
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea class="form-control" v-model="selectedPlaylist.description"></textarea>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <div class="section-header">
            <div>Content Items</div>
            <button class="btn-sm" @click="showAddContentModal = true">Add Content</button>
          </div>
          <div class="section-content">
            <draggable 
              v-model="selectedPlaylist.items" 
              item-key="id"
              class="playlist-items"
              handle=".drag-handle"
            >
              <template #item="{element}">
                <div class="playlist-item">
                  <div class="item-drag">
                    <i class="fas fa-grip-lines drag-handle"></i>
                  </div>
                  <div class="item-icon">
                    <i :class="element.icon"></i>
                  </div>
                  <div class="item-details">
                    <div class="item-title">{{ element.title }}</div>
                    <div class="item-duration">{{ element.duration }}</div>
                  </div>
                  <div class="item-actions">
                    <button @click="removeContentItem(element.id)"><i class="fas fa-times"></i></button>
                  </div>
                </div>
              </template>
            </draggable>
            <div v-if="selectedPlaylist.items.length === 0" class="empty-state">
              No content items in this playlist. Click "Add Content" to add items.
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary">Cancel</button>
          <button class="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
    <Modal v-model="showAddPlaylist" title="Add New Playlist">
      <div class="form-group">
        <label class="form-label">Playlist Name</label>
        <input type="text" class="form-control" v-model="newPlaylistName" />
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-control" v-model="newPlaylistDescription"></textarea>
      </div>
      <template #footer>
        <button class="btn btn-secondary" @click="showAddPlaylist = false">Cancel</button>
        <button class="btn btn-primary" @click="addPlaylist">Add Playlist</button>
      </template>
    </Modal>
    <Modal v-model="showAddContentModal" title="Add Content to Playlist">
      <div class="form-group">
        <label class="form-label">Select Content</label>
        <div class="content-selection">
          <div v-for="item in availableContent" :key="item.id" class="content-option">
            <input 
              type="checkbox" 
              :id="`content-${item.id}`" 
              :value="item.id" 
              v-model="selectedContentIds"
            />
            <label :for="`content-${item.id}`" class="content-label">
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </label>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-secondary" @click="showAddContentModal = false">Cancel</button>
        <button class="btn btn-primary" @click="addContentToPlaylist">Add Selected</button>
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
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const playlists = ref([
  { 
    id: 1, 
    title: 'Company Announcements', 
    description: 'Important company updates and announcements',
    icon: 'fas fa-list',
    items: [
      { id: 101, title: 'Welcome Message.mp4', duration: '0:30', icon: 'fas fa-video' },
      { id: 102, title: 'Company News.jpg', duration: '0:15', icon: 'fas fa-image' },
      { id: 103, title: 'CEO Update.mp4', duration: '1:45', icon: 'fas fa-video' }
    ],
    actions: [
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 2, 
    title: 'Product Showcase', 
    description: 'Displays of our latest products and services',
    icon: 'fas fa-list',
    items: [
      { id: 201, title: 'Product A Demo.mp4', duration: '2:10', icon: 'fas fa-video' },
      { id: 202, title: 'Product B Features.jpg', duration: '0:20', icon: 'fas fa-image' }
    ],
    actions: [
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 3, 
    title: 'Welcome Messages', 
    description: 'Greetings for visitors and new employees',
    icon: 'fas fa-list',
    items: [
      { id: 301, title: 'Welcome to Our Company.mp4', duration: '0:45', icon: 'fas fa-video' },
      { id: 302, title: 'Meet the Team.jpg', duration: '0:15', icon: 'fas fa-image' }
    ],
    actions: [
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 4, 
    title: 'Cafeteria Menu', 
    description: 'Daily and weekly food options',
    icon: 'fas fa-list',
    items: [
      { id: 401, title: 'Weekly Menu.jpg', duration: '0:20', icon: 'fas fa-image' },
      { id: 402, title: 'Special Offers.jpg', duration: '0:15', icon: 'fas fa-image' }
    ],
    actions: [
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 5, 
    title: 'Event Calendar', 
    description: 'Upcoming company events and important dates',
    icon: 'fas fa-list',
    items: [
      { id: 501, title: 'Monthly Calendar.jpg', duration: '0:30', icon: 'fas fa-image' },
      { id: 502, title: 'Event Highlights.mp4', duration: '1:20', icon: 'fas fa-video' }
    ],
    actions: [
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 6, 
    title: 'News Feed', 
    description: 'Industry news and updates',
    icon: 'fas fa-list',
    items: [
      { id: 601, title: 'Industry News.jpg', duration: '0:20', icon: 'fas fa-image' },
      { id: 602, title: 'Market Updates.jpg', duration: '0:20', icon: 'fas fa-image' }
    ],
    actions: [
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  }
])

const availableContent = ref([
  { id: 1, title: 'Company Logo.png', icon: 'fas fa-image' },
  { id: 2, title: 'Product Demo.mp4', icon: 'fas fa-video' },
  { id: 3, title: 'Quarterly Report.pptx', icon: 'fas fa-file-powerpoint' },
  { id: 4, title: 'Welcome Banner.jpg', icon: 'fas fa-image' },
  { id: 5, title: 'CEO Message.mp4', icon: 'fas fa-video' },
  { id: 6, title: 'Interactive Menu.html', icon: 'fas fa-code' }
])

const searchQuery = ref('')
const selectedPlaylistId = ref<number | null>(null)
const showAddPlaylist = ref(false)
const showAddContentModal = ref(false)
const newPlaylistName = ref('')
const newPlaylistDescription = ref('')
const selectedContentIds = ref<number[]>([])

const filteredPlaylists = computed(() => {
  if (!searchQuery.value) return playlists.value
  const query = searchQuery.value.toLowerCase()
  return playlists.value.filter(playlist => 
    playlist.title.toLowerCase().includes(query) || 
    playlist.description.toLowerCase().includes(query)
  )
})

const selectedPlaylist = computed(() => {
  if (!selectedPlaylistId.value) return null
  return playlists.value.find(playlist => playlist.id === selectedPlaylistId.value)
})

function searchPlaylists(query: string) {
  searchQuery.value = query
}

function selectPlaylist(id: number) {
  selectedPlaylistId.value = id
}

function handlePlaylistAction({ id, action }: { id: number, action: string }) {
  if (action === 'edit') {
    selectedPlaylistId.value = id
  } else if (action === 'delete') {
    if (confirm('Are you sure you want to delete this playlist?')) {
      playlists.value = playlists.value.filter(playlist => playlist.id !== id)
      if (selectedPlaylistId.value === id) {
        selectedPlaylistId.value = null
      }
    }
  }
}

function addPlaylist() {
  if (newPlaylistName.value) {
    const newId = Math.max(...playlists.value.map(p => p.id)) + 1
    playlists.value.push({
      id: newId,
      title: newPlaylistName.value,
      description: newPlaylistDescription.value,
      icon: 'fas fa-list',
      items: [],
      actions: [
        { name: 'edit', icon: 'fas fa-edit' },
        { name: 'delete', icon: 'fas fa-trash' }
      ]
    })
    newPlaylistName.value = ''
    newPlaylistDescription.value = ''
    showAddPlaylist.value = false
  }
}

function addContentToPlaylist() {
  if (selectedPlaylist.value && selectedContentIds.value.length > 0) {
    const newItems = selectedContentIds.value.map(id => {
      const content = availableContent.value.find(c => c.id === id)
      if (content) {
        return {
          id: Date.now() + id, // Generate a unique ID
          title: content.title,
          duration: '0:20', // Default duration
          icon: content.icon
        }
      }
      return null
    }).filter(item => item !== null) as any[]
    
    selectedPlaylist.value.items = [...selectedPlaylist.value.items, ...newItems]
    selectedContentIds.value = []
    showAddContentModal.value = false
  }
}

function removeContentItem(itemId: number) {
  if (selectedPlaylist.value) {
    selectedPlaylist.value.items = selectedPlaylist.value.items.filter(item => item.id !== itemId)
  }
}
</script>

<style scoped>
.playlist-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.playlist-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  transition: all 0.2s;
}

.playlist-item:hover {
  background-color: #f1f5f9;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.item-drag {
  margin-right: 10px;
}

.drag-handle {
  cursor: grab;
  color: #94a3b8;
}

.item-icon {
  margin-right: 12px;
  font-size: 18px;
  color: #64748b;
  width: 24px;
  text-align: center;
}

.item-details {
  flex: 1;
}

.item-title {
  font-weight: 500;
  color: #1e293b;
}

.item-duration {
  font-size: 12px;
  color: #64748b;
}

.item-actions button {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-actions button:hover {
  color: #ef4444;
  background-color: #fee2e2;
}

.empty-state {
  padding: 24px;
  text-align: center;
  color: #64748b;
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
}

.content-selection {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px;
}

.content-option {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s;
}

.content-option:hover {
  background-color: #f8fafc;
}

.content-option:last-child {
  border-bottom: none;
}

.content-label {
  display: flex;
  align-items: center;
  margin-left: 8px;
  cursor: pointer;
  color: #1e293b;
}

.content-label i {
  margin-right: 8px;
  color: #64748b;
}

.section-content {
  padding: 8px 0;
}
</style>
