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
          <div class="detail-subtitle">{{ selectedPlaylist.items.length }} items • {{ formatTotalDuration(selectedPlaylist.items) }} total duration</div>
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
            <div class="form-group">
              <label class="form-label">Default Transition</label>
              <select class="form-control" v-model="selectedPlaylist.transition">
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="none">None</option>
              </select>
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
              <template #item="{element, index}">
                <div class="playlist-item">
                  <div class="item-drag">
                    <i class="fas fa-grip-lines drag-handle"></i>
                  </div>
                  <div class="item-icon">
                    <i :class="element.icon"></i>
                  </div>
                  <div class="item-details">
                    <div class="item-title">{{ element.title }}</div>
                    <div class="item-duration">
                      <div class="duration-display">
                        <span>{{ formatDuration(element.duration) }}</span>
                        <button class="edit-duration-btn" @click="editItemDuration(index)">
                          <i class="fas fa-pencil-alt"></i>
                        </button>
                      </div>
                    </div>
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
        <div class="detail-section" v-if="playlistSchedules.length > 0">
          <div class="section-header">Active Schedules</div>
          <div class="section-content">
            <div class="schedule-list">
              <div 
                v-for="schedule in playlistSchedules" 
                :key="schedule.id"
                class="schedule-item"
                @click="navigateToSchedule(schedule.id)"
              >
                <div class="schedule-icon">
                  <i class="fas fa-calendar-alt"></i>
                </div>
                <div class="schedule-details">
                  <div class="schedule-name">{{ schedule.name }}</div>
                  <div class="schedule-info">
                    {{ formatScheduleDays(schedule.daysOfWeek) }} • 
                    {{ formatTimeRange(schedule.startTime, schedule.endTime) }}
                  </div>
                </div>
                <div class="schedule-players">
                  {{ schedule.playerIds.length }} players
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary">Cancel</button>
          <button class="btn btn-primary" @click="savePlaylist">Save Changes</button>
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
      <div class="form-group">
        <label class="form-label">Default Transition</label>
        <select class="form-control" v-model="newPlaylistTransition">
          <option value="fade">Fade</option>
          <option value="slide">Slide</option>
          <option value="none">None</option>
        </select>
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
          <div v-for="item in availableContentItems" :key="item.id" class="content-option">
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
      <div class="form-group">
        <label class="form-label">Default Duration (seconds)</label>
        <input 
          type="number" 
          class="form-control" 
          v-model="defaultDuration" 
          min="1" 
          max="300"
        />
        <small class="form-text">Default duration for all selected items. You can adjust individual durations later.</small>
      </div>
      <template #footer>
        <button class="btn btn-secondary" @click="showAddContentModal = false">Cancel</button>
        <button class="btn btn-primary" @click="addContentToPlaylist">Add Selected</button>
      </template>
    </Modal>
    <Modal v-model="showDurationModal" title="Edit Duration">
      <div class="form-group">
        <label class="form-label">Content Item</label>
        <input type="text" class="form-control" :value="editingItem ? editingItem.title : ''" disabled />
      </div>
      <div class="form-group">
        <label class="form-label">Duration</label>
        <div class="duration-input-group">
          <input 
            type="number" 
            class="form-control" 
            v-model="editingDuration.minutes" 
            min="0" 
            max="59"
          />
          <span class="duration-separator">:</span>
          <input 
            type="number" 
            class="form-control" 
            v-model="editingDuration.seconds" 
            min="0" 
            max="59"
          />
        </div>
        <small class="form-text">Minutes : Seconds</small>
      </div>
      <template #footer>
        <button class="btn btn-secondary" @click="showDurationModal = false">Cancel</button>
        <button class="btn btn-primary" @click="saveDuration">Save</button>
      </template>
    </Modal>
    <SlidePanel v-model="showPreviewPanel" title="Playlist Preview">
      <div class="preview-container">
        <div class="preview-header">
          <h3>{{ selectedPlaylist ? selectedPlaylist.title : 'Playlist' }}</h3>
          <div class="preview-controls">
            <button class="preview-control-btn" @click="prevPreviewItem" :disabled="currentPreviewIndex <= 0">
              <i class="fas fa-step-backward"></i>
            </button>
            <button class="preview-control-btn" @click="togglePreviewPlayback">
              <i :class="isPreviewPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
            </button>
            <button class="preview-control-btn" @click="nextPreviewItem" :disabled="!selectedPlaylist || currentPreviewIndex >= selectedPlaylist.items.length - 1">
              <i class="fas fa-step-forward"></i>
            </button>
          </div>
        </div>
        <div class="preview-content">
          <div v-if="currentPreviewItem" class="preview-item">
            <div class="preview-item-icon">
              <i :class="currentPreviewItem.icon"></i>
            </div>
            <div class="preview-item-title">{{ currentPreviewItem.title }}</div>
          </div>
          <div v-else class="preview-empty">
            No items to preview
          </div>
        </div>
        <div class="preview-progress" v-if="currentPreviewItem">
          <div class="preview-progress-bar">
            <div 
              class="preview-progress-fill" 
              :style="{ width: `${previewProgress}%` }"
            ></div>
          </div>
          <div class="preview-time">
            {{ formatDuration(previewElapsed) }} / {{ formatDuration(currentPreviewItem.duration) }}
          </div>
        </div>
        <div class="preview-playlist">
          <div class="preview-playlist-header">Playlist Items</div>
          <div class="preview-playlist-items">
            <div 
              v-for="(item, index) in selectedPlaylist ? selectedPlaylist.items : []" 
              :key="item.id"
              class="preview-playlist-item"
              :class="{ 'active': index === currentPreviewIndex }"
              @click="jumpToPreviewItem(index)"
            >
              <div class="preview-item-icon small">
                <i :class="item.icon"></i>
              </div>
              <div class="preview-item-info">
                <div class="preview-item-title small">{{ item.title }}</div>
                <div class="preview-item-duration">{{ formatDuration(item.duration) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlidePanel>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import SearchBar from '../components/SearchBar.vue'
import ListView from '../components/ListView.vue'
import Modal from '../components/Modal.vue'
import SlidePanel from '../components/SlidePanel.vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { store, PlaylistItem, Playlist } from '../store'

const router = useRouter()

// State variables
const searchQuery = ref('')
const selectedPlaylistId = ref<number | null>(null)
const showAddPlaylist = ref(false)
const showAddContentModal = ref(false)
const showDurationModal = ref(false)
const showPreviewPanel = ref(false)
const newPlaylistName = ref('')
const newPlaylistDescription = ref('')
const newPlaylistTransition = ref('fade')
const selectedContentIds = ref<number[]>([])
const defaultDuration = ref(15)
const editingItemIndex = ref<number | null>(null)
const editingDuration = ref<{ minutes: number; seconds: number }>({ minutes: 0, seconds: 0 })

// Preview state
const currentPreviewIndex = ref(0)
const isPreviewPlaying = ref(false)
const previewElapsed = ref(0)
const previewProgress = ref(0)
const previewInterval = ref<number | null>(null)

// Computed properties
const playlists = computed(() => {
  return store.state.playlists.map(playlist => ({
    id: playlist.id,
    title: playlist.title,
    subtitle: `${playlist.items.length} items • ${formatTotalDuration(playlist.items)}`,
    icon: playlist.icon,
    actions: [
      { name: 'preview', icon: 'fas fa-eye' },
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  }))
})

const filteredPlaylists = computed(() => {
  if (!searchQuery.value) return playlists.value
  const query = searchQuery.value.toLowerCase()
  return playlists.value.filter(playlist => 
    playlist.title.toLowerCase().includes(query) || 
    playlist.subtitle.toLowerCase().includes(query)
  )
})

const selectedPlaylist = computed(() => {
  if (!selectedPlaylistId.value) return null
  return store.state.playlists.find(playlist => playlist.id === selectedPlaylistId.value)
})

const availableContentItems = computed(() => {
  return store.state.content.map(item => ({
    id: item.id,
    title: item.title,
    icon: item.icon,
    type: item.type,
    duration: item.duration
  }))
})

const editingItem = computed(() => {
  if (editingItemIndex.value === null || !selectedPlaylist.value) return null
  return selectedPlaylist.value.items[editingItemIndex.value]
})

const currentPreviewItem = computed(() => {
  if (!selectedPlaylist.value || selectedPlaylist.value.items.length === 0) return null
  return selectedPlaylist.value.items[currentPreviewIndex.value]
})

const playlistSchedules = computed(() => {
  if (!selectedPlaylistId.value) return []
  return store.getSchedulesForPlaylist(selectedPlaylistId.value)
})

// Methods
function searchPlaylists(query: string) {
  searchQuery.value = query
}

function selectPlaylist(id: number) {
  selectedPlaylistId.value = id
  // Reset preview state when selecting a new playlist
  resetPreview()
}

function handlePlaylistAction({ id, action }: { id: number, action: string }) {
  if (action === 'preview') {
    selectedPlaylistId.value = id
    showPreviewPanel.value = true
    resetPreview()
  } else if (action === 'edit') {
    selectedPlaylistId.value = id
  } else if (action === 'delete') {
    if (confirm('Are you sure you want to delete this playlist?')) {
      store.removePlaylist(id)
      if (selectedPlaylistId.value === id) {
        selectedPlaylistId.value = null
      }
    }
  }
}

function addPlaylist() {
  if (newPlaylistName.value) {
    const newPlaylist: Omit<Playlist, 'id'> = {
      title: newPlaylistName.value,
      description: newPlaylistDescription.value,
      transition: newPlaylistTransition.value,
      icon: 'fas fa-list',
      items: []
    }
    
    const newId = store.addPlaylist(newPlaylist)
    newPlaylistName.value = ''
    newPlaylistDescription.value = ''
    newPlaylistTransition.value = 'fade'
    showAddPlaylist.value = false
    selectedPlaylistId.value = newId
  }
}

function addContentToPlaylist() {
  if (selectedPlaylist.value && selectedContentIds.value.length > 0) {
    const newItems = selectedContentIds.value.map(id => {
      const content = store.getContentById(id)
      if (content) {
        return {
          id: Date.now() + id, // Generate a unique ID
          title: content.title,
          duration: content.duration || defaultDuration.value, // Use content duration if available, otherwise default
          icon: content.icon,
          contentId: content.id
        }
      }
      return null
    }).filter(item => item !== null) as PlaylistItem[]
    
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

function editItemDuration(index: number) {
  if (selectedPlaylist.value) {
    editingItemIndex.value = index
    const duration = selectedPlaylist.value.items[index].duration
    editingDuration.value = {
      minutes: Math.floor(duration / 60),
      seconds: duration % 60
    }
    showDurationModal.value = true
  }
}

function saveDuration() {
  if (selectedPlaylist.value && editingItemIndex.value !== null) {
    const totalSeconds = (editingDuration.value.minutes * 60) + editingDuration.value.seconds
    selectedPlaylist.value.items[editingItemIndex.value].duration = totalSeconds > 0 ? totalSeconds : 1
    showDurationModal.value = false
    editingItemIndex.value = null
  }
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatTotalDuration(items: PlaylistItem[]): string {
  const totalSeconds = items.reduce((total, item) => total + item.duration, 0)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime} - ${endTime}`
}

function formatScheduleDays(days: number[]): string {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  if (days.length === 7) return 'Every day'
  if (days.length === 5 && days.includes(1) && days.includes(2) && days.includes(3) && days.includes(4) && days.includes(5)) return 'Weekdays'
  if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekends'
  return days.map(day => daysOfWeek[day]).join(', ')
}

function savePlaylist() {
  if (selectedPlaylist.value) {
    store.updatePlaylist(selectedPlaylist.value.id, selectedPlaylist.value)
    alert('Playlist saved successfully!')
  }
}

function navigateToSchedule(scheduleId: number) {
  router.push({ name: 'Schedules', query: { id: scheduleId.toString() } })
}

// Preview functionality
function resetPreview() {
  currentPreviewIndex.value = 0
  isPreviewPlaying.value = false
  previewElapsed.value = 0
  previewProgress.value = 0
  stopPreviewTimer()
}

function togglePreviewPlayback() {
  if (!selectedPlaylist.value || selectedPlaylist.value.items.length === 0) return
  
  isPreviewPlaying.value = !isPreviewPlaying.value
  
  if (isPreviewPlaying.value) {
    startPreviewTimer()
  } else {
    stopPreviewTimer()
  }
}

function startPreviewTimer() {
  if (previewInterval.value) clearInterval(previewInterval.value)
  
  previewInterval.value = setInterval(() => {
    if (!currentPreviewItem.value) return
    
    previewElapsed.value++
    previewProgress.value = (previewElapsed.value / currentPreviewItem.value.duration) * 100
    
    if (previewElapsed.value >= currentPreviewItem.value.duration) {
      nextPreviewItem()
    }
  }, 1000) as unknown as number
}

function stopPreviewTimer() {
  if (previewInterval.value) {
    clearInterval(previewInterval.value)
    previewInterval.value = null
  }
}

function prevPreviewItem() {
  if (currentPreviewIndex.value > 0) {
    currentPreviewIndex.value--
    previewElapsed.value = 0
    previewProgress.value = 0
    
    if (isPreviewPlaying.value) {
      stopPreviewTimer()
      startPreviewTimer()
    }
  }
}

function nextPreviewItem() {
  if (selectedPlaylist.value && currentPreviewIndex.value < selectedPlaylist.value.items.length - 1) {
    currentPreviewIndex.value++
    previewElapsed.value = 0
    previewProgress.value = 0
    
    if (isPreviewPlaying.value) {
      stopPreviewTimer()
      startPreviewTimer()
    }
  } else {
    // End of playlist
    isPreviewPlaying.value = false
    stopPreviewTimer()
  }
}

function jumpToPreviewItem(index: number) {
  if (selectedPlaylist.value && index >= 0 && index < selectedPlaylist.value.items.length) {
    currentPreviewIndex.value = index
    previewElapsed.value = 0
    previewProgress.value = 0
    
    if (isPreviewPlaying.value) {
      stopPreviewTimer()
      startPreviewTimer()
    }
  }
}

// Clean up interval when component is unmounted
watch(showPreviewPanel, (newValue) => {
  if (!newValue) {
    isPreviewPlaying.value = false
    stopPreviewTimer()
  }
})

// Reset selected content IDs when opening the add content modal
watch(showAddContentModal, (newValue) => {
  if (newValue) {
    selectedContentIds.value = []
  }
})
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

.duration-display {
  display: flex;
  align-items: center;
}

.edit-duration-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 2px 4px;
  margin-left: 4px;
  border-radius: 2px;
  font-size: 10px;
}

.edit-duration-btn:hover {
  color: #3b82f6;
  background-color: #eff6ff;
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

.duration-input-group {
  display: flex;
  align-items: center;
}

.duration-separator {
  margin: 0 8px;
  font-weight: bold;
}

.preview-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.preview-controls {
  display: flex;
  gap: 8px;
}

.preview-control-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f1f5f9;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.preview-control-btn:hover:not(:disabled) {
  background-color: #e2e8f0;
}

.preview-control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.preview-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0f172a;
  padding: 24px;
  min-height: 200px;
}

.preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.preview-item-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.preview-item-title {
  font-size: 18px;
}

.preview-empty {
  color: #94a3b8;
}

.preview-progress {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.preview-progress-bar {
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.preview-progress-fill {
  height: 100%;
  background-color: #3b82f6;
  border-radius: 3px;
  transition: width 0.1s linear;
}

.preview-time {
  font-size: 12px;
  color: #64748b;
  text-align: right;
}

.preview-playlist {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.preview-playlist-header {
  font-weight: 600;
  margin-bottom: 12px;
  color: #1e293b;
}

.preview-playlist-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-playlist-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.preview-playlist-item:hover {
  background-color: #f1f5f9;
}

.preview-playlist-item.active {
  background-color: #eff6ff;
}

.preview-item-icon.small {
  font-size: 24px;
  margin-right: 12px;
  margin-bottom: 0;
  color: #64748b;
}

.preview-item-info {
  flex: 1;
}

.preview-item-title.small {
  font-size: 14px;
  color: #1e293b;
}

.preview-item-duration {
  font-size: 12px;
  color: #64748b;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.schedule-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.schedule-item:hover {
  background-color: #f1f5f9;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.schedule-icon {
  margin-right: 12px;
  font-size: 18px;
  color: #3b82f6;
  width: 24px;
  text-align: center;
}

.schedule-details {
  flex: 1;
}

.schedule-name {
  font-weight: 500;
  color: #1e293b;
}

.schedule-info {
  font-size: 12px;
  color: #64748b;
}

.schedule-players {
  font-size: 12px;
  color: #64748b;
  background-color: #e2e8f0;
  padding: 4px 8px;
  border-radius: 12px;
}
</style>
