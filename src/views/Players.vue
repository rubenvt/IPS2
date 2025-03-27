<template>
  <div class="main-content">
    <Header title="Players" />
    <div class="content-area">
      <div class="content-panel">
        <div class="panel-header">
          <div class="panel-title">Players</div>
          <div class="panel-actions">
            <button @click="showAddPlayer = true"><i class="fas fa-plus"></i></button>
            <button><i class="fas fa-filter"></i></button>
            <button><i class="fas fa-ellipsis-v"></i></button>
          </div>
        </div>
        <SearchBar placeholder="Search players..." @search="searchPlayers" />
        <ListView 
          :items="filteredPlayers" 
          :selectedId="selectedPlayerId"
          @select="selectPlayer"
          @action="handlePlayerAction"
        />
      </div>
      <div class="detail-panel" v-if="selectedPlayer">
        <div class="detail-header">
          <div class="detail-title">{{ selectedPlayer.title }}</div>
          <div class="detail-subtitle">{{ selectedPlayer.subtitle }}</div>
        </div>
        <div class="detail-section">
          <div class="section-header">Player Information</div>
          <div class="section-content">
            <div class="form-group">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" v-model="selectedPlayer.title" />
            </div>
            <div class="form-group">
              <label class="form-label">Location</label>
              <input type="text" class="form-control" v-model="selectedPlayer.subtitle" />
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-control">
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <div class="section-header">Assigned Playlists</div>
          <div class="section-content">
            <div class="form-group">
              <label class="form-label">Select Playlists</label>
              <div class="playlist-selector">
                <div v-for="playlist in playlists" :key="playlist.id" class="playlist-option">
                  <input 
                    type="checkbox" 
                    :id="`playlist-${playlist.id}`" 
                    :value="playlist.id" 
                    v-model="selectedPlayer.assignedPlaylists"
                  />
                  <label :for="`playlist-${playlist.id}`">{{ playlist.title }}</label>
                </div>
              </div>
            </div>
            <!-- Removed playlist reordering functionality -->
          </div>
        </div>
        <div class="detail-section">
          <div class="section-header">Current Content</div>
          <div class="section-content">
            <p>Currently playing: {{ getCurrentPlaylist() }}</p>
            <p>Next scheduled: {{ getNextPlaylist() }}</p>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary">Cancel</button>
          <button class="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
    <Modal v-model="showAddPlayer" title="Add New Player">
      <div class="form-group">
        <label class="form-label">Player Name</label>
        <input type="text" class="form-control" v-model="newPlayerName" />
      </div>
      <div class="form-group">
        <label class="form-label">Location</label>
        <input type="text" class="form-control" v-model="newPlayerLocation" />
      </div>
      <template #footer>
        <button class="btn btn-secondary" @click="showAddPlayer = false">Cancel</button>
        <button class="btn btn-primary" @click="addPlayer">Add Player</button>
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

const playlists = ref([
  { id: 1, title: 'Company Announcements' },
  { id: 2, title: 'Product Showcase' },
  { id: 3, title: 'Welcome Messages' },
  { id: 4, title: 'Cafeteria Menu' },
  { id: 5, title: 'Event Calendar' },
  { id: 6, title: 'News Feed' }
])

const players = ref([
  { 
    id: 1, 
    title: 'Lobby Display', 
    subtitle: 'Main Entrance', 
    icon: 'fas fa-desktop',
    assignedPlaylists: [1, 3],
    actions: [
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 2, 
    title: 'Conference Room A', 
    subtitle: 'Second Floor', 
    icon: 'fas fa-desktop',
    assignedPlaylists: [2],
    actions: [
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 3, 
    title: 'Cafeteria Display', 
    subtitle: 'First Floor', 
    icon: 'fas fa-desktop',
    assignedPlaylists: [4, 6],
    actions: [
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 4, 
    title: 'Reception Area', 
    subtitle: 'Main Entrance', 
    icon: 'fas fa-desktop',
    assignedPlaylists: [1, 5],
    actions: [
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 5, 
    title: 'Executive Suite', 
    subtitle: 'Third Floor', 
    icon: 'fas fa-desktop',
    assignedPlaylists: [2, 3],
    actions: [
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 6, 
    title: 'Sales Department', 
    subtitle: 'Second Floor', 
    icon: 'fas fa-desktop',
    assignedPlaylists: [6],
    actions: [
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 7, 
    title: 'Marketing Display', 
    subtitle: 'First Floor', 
    icon: 'fas fa-desktop',
    assignedPlaylists: [5, 2],
    actions: [
      { name: 'edit', icon: 'fas fa-edit' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  }
])

const searchQuery = ref('')
const selectedPlayerId = ref<number | null>(null)
const showAddPlayer = ref(false)
const newPlayerName = ref('')
const newPlayerLocation = ref('')

const filteredPlayers = computed(() => {
  if (!searchQuery.value) return players.value
  const query = searchQuery.value.toLowerCase()
  return players.value.filter(player => 
    player.title.toLowerCase().includes(query) || 
    player.subtitle.toLowerCase().includes(query)
  )
})

const selectedPlayer = computed(() => {
  if (!selectedPlayerId.value) return null
  return players.value.find(player => player.id === selectedPlayerId.value)
})

function searchPlayers(query: string) {
  searchQuery.value = query
}

function selectPlayer(id: number) {
  selectedPlayerId.value = id
}

function handlePlayerAction({ id, action }: { id: number, action: string }) {
  if (action === 'edit') {
    selectedPlayerId.value = id
  } else if (action === 'delete') {
    if (confirm('Are you sure you want to delete this player?')) {
      players.value = players.value.filter(player => player.id !== id)
      if (selectedPlayerId.value === id) {
        selectedPlayerId.value = null
      }
    }
  }
}

function addPlayer() {
  if (newPlayerName.value) {
    const newId = Math.max(...players.value.map(p => p.id)) + 1
    players.value.push({
      id: newId,
      title: newPlayerName.value,
      subtitle: newPlayerLocation.value,
      icon: 'fas fa-desktop',
      assignedPlaylists: [],
      actions: [
        { name: 'edit', icon: 'fas fa-edit' },
        { name: 'delete', icon: 'fas fa-trash' }
      ]
    })
    newPlayerName.value = ''
    newPlayerLocation.value = ''
    showAddPlayer.value = false
  }
}

function getPlaylistTitle(id: number) {
  const playlist = playlists.value.find(p => p.id === id)
  return playlist ? playlist.title : 'Unknown Playlist'
}

function getCurrentPlaylist() {
  if (!selectedPlayer.value || !selectedPlayer.value.assignedPlaylists || selectedPlayer.value.assignedPlaylists.length === 0) {
    return 'No playlist assigned'
  }
  return getPlaylistTitle(selectedPlayer.value.assignedPlaylists[0])
}

function getNextPlaylist() {
  if (!selectedPlayer.value || !selectedPlayer.value.assignedPlaylists || selectedPlayer.value.assignedPlaylists.length <= 1) {
    return 'None'
  }
  return getPlaylistTitle(selectedPlayer.value.assignedPlaylists[1])
}
</script>

<style scoped>
.playlist-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.playlist-option {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
