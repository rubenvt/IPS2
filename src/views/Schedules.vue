<template>
  <div class="main-content">
    <Header title="Schedules" />
    <div class="content-area">
      <div class="content-panel">
        <div class="panel-header">
          <div class="panel-title">Schedules</div>
          <div class="panel-actions">
            <button @click="showAddSchedule = true"><i class="fas fa-plus"></i></button>
            <button><i class="fas fa-filter"></i></button>
            <button><i class="fas fa-ellipsis-v"></i></button>
          </div>
        </div>
        <SearchBar placeholder="Search schedules..." @search="searchSchedules" />
        <ListView 
          :items="filteredSchedules" 
          :selectedId="selectedScheduleId"
          @select="selectSchedule"
          @action="handleScheduleAction"
        />
      </div>
      <div class="detail-panel" v-if="selectedSchedule">
        <div class="detail-header">
          <div class="detail-title">{{ selectedSchedule.name }}</div>
          <div class="detail-subtitle">
            {{ getPlaylistName(selectedSchedule.playlistId) }} • 
            {{ selectedSchedule.playerIds.length }} players
          </div>
        </div>
        <div class="detail-section">
          <div class="section-header">Schedule Information</div>
          <div class="section-content">
            <div class="form-group">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" v-model="selectedSchedule.name" />
            </div>
            <div class="form-group">
              <label class="form-label">Playlist</label>
              <select class="form-control" v-model="selectedSchedule.playlistId">
                <option v-for="playlist in playlists" :key="playlist.id" :value="playlist.id">
                  {{ playlist.title }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Priority</label>
              <input 
                type="number" 
                class="form-control" 
                v-model="selectedSchedule.priority" 
                min="1" 
                max="100"
              />
              <small class="form-text">Higher priority schedules take precedence when overlapping</small>
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  id="schedule-active" 
                  v-model="selectedSchedule.active"
                />
                <label for="schedule-active">{{ selectedSchedule.active ? 'Active' : 'Inactive' }}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <div class="section-header">Time Settings</div>
          <div class="section-content">
            <div class="form-group">
              <label class="form-label">Start Date</label>
              <input type="date" class="form-control" v-model="selectedSchedule.startDate" />
            </div>
            <div class="form-group">
              <label class="form-label">End Date (Optional)</label>
              <input type="date" class="form-control" v-model="selectedSchedule.endDate" />
            </div>
            <div class="form-group">
              <label class="form-label">Days of Week</label>
              <div class="days-of-week">
                <div 
                  v-for="(day, index) in daysOfWeek" 
                  :key="index"
                  class="day-toggle"
                  :class="{ 'active': isDaySelected(index) }"
                  @click="toggleDay(index)"
                >
                  {{ day.substr(0, 1) }}
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Start Time</label>
              <input type="time" class="form-control" v-model="selectedSchedule.startTime" />
            </div>
            <div class="form-group">
              <label class="form-label">End Time</label>
              <input type="time" class="form-control" v-model="selectedSchedule.endTime" />
            </div>
          </div>
        </div>
        <div class="detail-section">
          <div class="section-header">
            <div>Assigned Players</div>
            <button class="btn-sm" @click="showAssignPlayersModal = true">Assign Players</button>
          </div>
          <div class="section-content">
            <div class="assigned-players">
              <div 
                v-for="playerId in selectedSchedule.playerIds" 
                :key="playerId"
                class="assigned-player"
              >
                <div class="player-icon">
                  <i class="fas fa-desktop"></i>
                </div>
                <div class="player-name">{{ getPlayerName(playerId) }}</div>
                <button 
                  class="remove-player-btn"
                  @click="removePlayerFromSchedule(playerId)"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div v-if="selectedSchedule.playerIds.length === 0" class="empty-state">
              No players assigned to this schedule. Click "Assign Players" to add players.
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary">Cancel</button>
          <button class="btn btn-primary" @click="saveSchedule">Save Changes</button>
        </div>
      </div>
    </div>
    <Modal v-model="showAddSchedule" title="Add New Schedule">
      <div class="form-group">
        <label class="form-label">Schedule Name</label>
        <input type="text" class="form-control" v-model="newScheduleName" />
      </div>
      <div class="form-group">
        <label class="form-label">Playlist</label>
        <select class="form-control" v-model="newSchedulePlaylistId">
          <option v-for="playlist in playlists" :key="playlist.id" :value="playlist.id">
            {{ playlist.title }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Start Date</label>
        <input type="date" class="form-control" v-model="newScheduleStartDate" />
      </div>
      <template #footer>
        <button class="btn btn-secondary" @click="showAddSchedule = false">Cancel</button>
        <button class="btn btn-primary" @click="addSchedule">Add Schedule</button>
      </template>
    </Modal>
    <Modal v-model="showAssignPlayersModal" title="Assign Players to Schedule">
      <div class="form-group">
        <label class="form-label">Select Players</label>
        <div class="player-selection">
          <div v-for="player in availablePlayers" :key="player.id" class="player-option">
            <input 
              type="checkbox" 
              :id="`player-${player.id}`" 
              :value="player.id" 
              v-model="selectedPlayerIds"
            />
            <label :for="`player-${player.id}`" class="player-label">
              <i class="fas fa-desktop"></i>
              <span>{{ player.name }}</span>
              <span class="player-location">{{ player.location }}</span>
            </label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Select Player Groups</label>
        <div class="group-selection">
          <div v-for="group in playerGroups" :key="group.id" class="group-option">
            <input 
              type="checkbox" 
              :id="`group-${group.id}`" 
              :value="group.id" 
              v-model="selectedGroupIds"
            />
            <label :for="`group-${group.id}`" class="group-label">
              <i class="fas fa-folder"></i>
              <span>{{ group.name }}</span>
              <span class="group-count">{{ group.playerIds.length }} players</span>
            </label>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-secondary" @click="showAssignPlayersModal = false">Cancel</button>
        <button class="btn btn-primary" @click="assignPlayersToSchedule">Assign Selected</button>
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
import { store, Schedule, Player, PlayerGroup } from '../store'

// State variables
const searchQuery = ref('')
const selectedScheduleId = ref<number | null>(null)
const showAddSchedule = ref(false)
const showAssignPlayersModal = ref(false)
const newScheduleName = ref('')
const newSchedulePlaylistId = ref<number | null>(null)
const newScheduleStartDate = ref('')
const selectedPlayerIds = ref<number[]>([])
const selectedGroupIds = ref<number[]>([])
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Computed properties
const schedules = computed(() => {
  return store.state.schedules.map(schedule => ({
    id: schedule.id,
    title: schedule.name,
    subtitle: `${getPlaylistName(schedule.playlistId)} • ${formatTimeRange(schedule.startTime, schedule.endTime)}`,
    icon: 'fas fa-calendar-alt',
    actions: [
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'duplicate', icon: 'fas fa-copy' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  }))
})

const filteredSchedules = computed(() => {
  if (!searchQuery.value) return schedules.value
  const query = searchQuery.value.toLowerCase()
  return schedules.value.filter(schedule => 
    schedule.title.toLowerCase().includes(query) || 
    schedule.subtitle.toLowerCase().includes(query)
  )
})

const selectedSchedule = computed(() => {
  if (!selectedScheduleId.value) return null
  return store.state.schedules.find(schedule => schedule.id === selectedScheduleId.value)
})

const playlists = computed(() => {
  return store.state.playlists
})

const players = computed(() => {
  return store.state.players
})

const playerGroups = computed(() => {
  return store.state.playerGroups
})

const availablePlayers = computed(() => {
  return players.value.filter(player => 
    !selectedSchedule.value?.playerIds.includes(player.id)
  )
})

// Methods
function searchSchedules(query: string) {
  searchQuery.value = query
}

function selectSchedule(id: number) {
  selectedScheduleId.value = id
}

function handleScheduleAction({ id, action }: { id: number, action: string }) {
  if (action === 'edit') {
    selectedScheduleId.value = id
  } else if (action === 'duplicate') {
    duplicateSchedule(id)
  } else if (action === 'delete') {
    if (confirm('Are you sure you want to delete this schedule?')) {
      store.removeSchedule(id)
      if (selectedScheduleId.value === id) {
        selectedScheduleId.value = null
      }
    }
  }
}

function duplicateSchedule(id: number) {
  const schedule = store.getScheduleById(id)
  if (schedule) {
    const newSchedule: Omit<Schedule, 'id'> = {
      ...schedule,
      name: `${schedule.name} (Copy)`,
    }
    const newId = store.addSchedule(newSchedule)
    selectedScheduleId.value = newId
  }
}

function addSchedule() {
  if (newScheduleName.value && newSchedulePlaylistId.value && newScheduleStartDate.value) {
    const newSchedule: Omit<Schedule, 'id'> = {
      name: newScheduleName.value,
      playlistId: newSchedulePlaylistId.value,
      playerIds: [],
      startDate: newScheduleStartDate.value,
      daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday by default
      startTime: '09:00',
      endTime: '17:00',
      priority: 10,
      active: true
    }
    const newId = store.addSchedule(newSchedule)
    newScheduleName.value = ''
    newSchedulePlaylistId.value = null
    newScheduleStartDate.value = ''
    showAddSchedule.value = false
    selectedScheduleId.value = newId
  }
}

function saveSchedule() {
  if (selectedSchedule.value) {
    store.updateSchedule(selectedSchedule.value.id, selectedSchedule.value)
    alert('Schedule saved successfully!')
  }
}

function getPlaylistName(playlistId: number): string {
  const playlist = store.getPlaylistById(playlistId)
  return playlist ? playlist.title : 'Unknown Playlist'
}

function getPlayerName(playerId: number): string {
  const player = store.getPlayerById(playerId)
  return player ? player.name : 'Unknown Player'
}

function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime} - ${endTime}`
}

function isDaySelected(dayIndex: number): boolean {
  return selectedSchedule.value?.daysOfWeek.includes(dayIndex) || false
}

function toggleDay(dayIndex: number) {
  if (!selectedSchedule.value) return
  
  const index = selectedSchedule.value.daysOfWeek.indexOf(dayIndex)
  if (index === -1) {
    selectedSchedule.value.daysOfWeek.push(dayIndex)
  } else {
    selectedSchedule.value.daysOfWeek.splice(index, 1)
  }
}

function removePlayerFromSchedule(playerId: number) {
  if (!selectedSchedule.value) return
  
  selectedSchedule.value.playerIds = selectedSchedule.value.playerIds.filter(id => id !== playerId)
}

function assignPlayersToSchedule() {
  if (!selectedSchedule.value) return
  
  // Add individual players
  const newPlayerIds = [...selectedSchedule.value.playerIds]
  
  selectedPlayerIds.value.forEach(playerId => {
    if (!newPlayerIds.includes(playerId)) {
      newPlayerIds.push(playerId)
    }
  })
  
  // Add players from groups
  selectedGroupIds.value.forEach(groupId => {
    const group = store.getPlayerGroupById(groupId)
    if (group) {
      group.playerIds.forEach(playerId => {
        if (!newPlayerIds.includes(playerId)) {
          newPlayerIds.push(playerId)
        }
      })
    }
  })
  
  selectedSchedule.value.playerIds = newPlayerIds
  selectedPlayerIds.value = []
  selectedGroupIds.value = []
  showAssignPlayersModal.value = false
}
</script>

<style scoped>
.days-of-week {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.day-toggle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 600;
  color: #64748b;
  transition: all 0.2s;
}

.day-toggle.active {
  background-color: #3b82f6;
  color: white;
}

.toggle-switch {
  position: relative;
  display: inline-block;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch label {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 16px;
  background-color: #e2e8f0;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-switch input:checked + label {
  background-color: #10b981;
  color: white;
}

.assigned-players {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.assigned-player {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  transition: all 0.2s;
}

.assigned-player:hover {
  background-color: #f1f5f9;
}

.player-icon {
  margin-right: 12px;
  font-size: 18px;
  color: #64748b;
  width: 24px;
  text-align: center;
}

.player-name {
  flex: 1;
  font-weight: 500;
  color: #1e293b;
}

.remove-player-btn {
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

.remove-player-btn:hover {
  color: #ef4444;
  background-color: #fee2e2;
}

.player-selection, .group-selection {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px;
}

.player-option, .group-option {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s;
}

.player-option:hover, .group-option:hover {
  background-color: #f8fafc;
}

.player-option:last-child, .group-option:last-child {
  border-bottom: none;
}

.player-label, .group-label {
  display: flex;
  align-items: center;
  margin-left: 8px;
  cursor: pointer;
  color: #1e293b;
  flex: 1;
}

.player-label i, .group-label i {
  margin-right: 8px;
  color: #64748b;
}

.player-location, .group-count {
  margin-left: auto;
  font-size: 12px;
  color: #64748b;
}
</style>
