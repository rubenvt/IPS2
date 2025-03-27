<template>
  <div class="main-content">
    <Header title="Content Library" />
    <div class="content-area">
      <div class="content-panel" style="width: 250px;">
        <div class="panel-header">
          <div class="panel-title">Folders</div>
          <div class="panel-actions">
            <button @click="showNewFolderModal = true"><i class="fas fa-plus"></i></button>
            <button><i class="fas fa-ellipsis-v"></i></button>
          </div>
        </div>
        <ul class="sidebar-menu">
          <li 
            v-for="folder in folders" 
            :key="folder.id" 
            class="sidebar-item" 
            :class="{ 'active': selectedFolderId === folder.id }"
            @click="selectFolder(folder.id)"
          >
            <i :class="folder.icon"></i>
            <span>{{ folder.name }}</span>
          </li>
        </ul>
      </div>
      <div class="content-panel">
        <div class="panel-header">
          <div class="panel-title">{{ currentFolderName }}</div>
          <div class="panel-actions">
            <button @click="showUploadModal = true"><i class="fas fa-upload"></i></button>
            <button><i class="fas fa-sort"></i></button>
            <button><i class="fas fa-th-large"></i></button>
            <button><i class="fas fa-list"></i></button>
          </div>
        </div>
        <SearchBar placeholder="Search content..." @search="searchContent" />
        <ListView 
          :items="filteredContent" 
          :selectedId="selectedContentId"
          @select="selectContent"
          @action="handleContentAction"
        />
      </div>
      <div class="detail-panel" v-if="selectedContent">
        <div class="detail-header">
          <div class="detail-title">{{ selectedContent.title }}</div>
          <div class="detail-subtitle">{{ selectedContent.subtitle }}</div>
        </div>
        <div class="detail-section">
          <div class="section-header">Preview</div>
          <div class="section-content preview-container">
            <div class="content-preview">
              <i :class="selectedContent.icon" v-if="selectedContent.icon.includes('image') || selectedContent.icon.includes('video')"></i>
              <div v-else>Preview not available</div>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <div class="section-header">Content Information</div>
          <div class="section-content">
            <div class="form-group">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" v-model="selectedContent.title" />
            </div>
            <div class="form-group">
              <label class="form-label">Type</label>
              <input type="text" class="form-control" :value="getContentType(selectedContent.icon)" disabled />
            </div>
            <div class="form-group">
              <label class="form-label">Size</label>
              <input type="text" class="form-control" :value="selectedContent.subtitle" disabled />
            </div>
            <div class="form-group">
              <label class="form-label">Tags</label>
              <input type="text" class="form-control" placeholder="Add tags separated by commas" />
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary">Cancel</button>
          <button class="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
    <Modal v-model="showUploadModal" title="Upload Content">
      <div class="form-group">
        <label class="form-label">Select Files</label>
        <input type="file" class="form-control" multiple />
      </div>
      <div class="form-group">
        <label class="form-label">Destination Folder</label>
        <select class="form-control">
          <option v-for="folder in folders" :key="folder.id" :value="folder.id">{{ folder.name }}</option>
        </select>
      </div>
      <template #footer>
        <button class="btn btn-secondary" @click="showUploadModal = false">Cancel</button>
        <button class="btn btn-primary" @click="uploadContent">Upload</button>
      </template>
    </Modal>
    <Modal v-model="showNewFolderModal" title="Create New Folder">
      <div class="form-group">
        <label class="form-label">Folder Name</label>
        <input type="text" class="form-control" v-model="newFolderName" />
      </div>
      <template #footer>
        <button class="btn btn-secondary" @click="showNewFolderModal = false">Cancel</button>
        <button class="btn btn-primary" @click="createNewFolder">Create</button>
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

// Folder structure
const folders = ref([
  { id: 1, name: 'All Content', icon: 'fas fa-folder-open' },
  { id: 2, name: 'Images', icon: 'fas fa-folder' },
  { id: 3, name: 'Logos', icon: 'fas fa-folder' },
  { id: 4, name: 'Backgrounds', icon: 'fas fa-folder' },
  { id: 5, name: 'Videos', icon: 'fas fa-folder' },
  { id: 6, name: 'Presentations', icon: 'fas fa-folder' },
  { id: 7, name: 'HTML Content', icon: 'fas fa-folder' }
])

const contentItems = ref([
  { 
    id: 1, 
    title: 'Company Logo.png', 
    subtitle: '1.2 MB', 
    icon: 'fas fa-image',
    folderId: 1,
    actions: [
      { name: 'preview', icon: 'fas fa-eye' },
      { name: 'download', icon: 'fas fa-download' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 2, 
    title: 'Product Demo.mp4', 
    subtitle: '24.5 MB', 
    icon: 'fas fa-video',
    folderId: 1,
    actions: [
      { name: 'preview', icon: 'fas fa-eye' },
      { name: 'download', icon: 'fas fa-download' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 3, 
    title: 'Quarterly Report.pptx', 
    subtitle: '5.8 MB', 
    icon: 'fas fa-file-powerpoint',
    folderId: 1,
    actions: [
      { name: 'preview', icon: 'fas fa-eye' },
      { name: 'download', icon: 'fas fa-download' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 4, 
    title: 'Welcome Banner.jpg', 
    subtitle: '3.4 MB', 
    icon: 'fas fa-image',
    folderId: 1,
    actions: [
      { name: 'preview', icon: 'fas fa-eye' },
      { name: 'download', icon: 'fas fa-download' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 5, 
    title: 'CEO Message.mp4', 
    subtitle: '45.2 MB', 
    icon: 'fas fa-video',
    folderId: 1,
    actions: [
      { name: 'preview', icon: 'fas fa-eye' },
      { name: 'download', icon: 'fas fa-download' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  },
  { 
    id: 6, 
    title: 'Interactive Menu.html', 
    subtitle: '0.8 MB', 
    icon: 'fas fa-code',
    folderId: 1,
    actions: [
      { name: 'preview', icon: 'fas fa-eye' },
      { name: 'download', icon: 'fas fa-download' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  }
])

const searchQuery = ref('')
const selectedContentId = ref<number | null>(null)
const selectedFolderId = ref(1) // Default to "All Content"
const showUploadModal = ref(false)
const showNewFolderModal = ref(false)
const newFolderName = ref('')

const currentFolderName = computed(() => {
  const folder = folders.value.find(f => f.id === selectedFolderId.value)
  return folder ? folder.name : 'All Content'
})

const filteredContent = computed(() => {
  let result = contentItems.value
  
  // Filter by folder if not "All Content"
  if (selectedFolderId.value !== 1) {
    result = result.filter(item => item.folderId === selectedFolderId.value)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.title.toLowerCase().includes(query)
    )
  }
  
  return result
})

const selectedContent = computed(() => {
  if (!selectedContentId.value) return null
  return contentItems.value.find(item => item.id === selectedContentId.value)
})

function searchContent(query: string) {
  searchQuery.value = query
}

function selectContent(id: number) {
  selectedContentId.value = id
}

function selectFolder(id: number) {
  selectedFolderId.value = id
  selectedContentId.value = null // Clear selected content when changing folders
}

function handleContentAction({ id, action }: { id: number, action: string }) {
  if (action === 'preview') {
    selectedContentId.value = id
  } else if (action === 'download') {
    alert('Downloading content...')
  } else if (action === 'delete') {
    if (confirm('Are you sure you want to delete this content?')) {
      contentItems.value = contentItems.value.filter(item => item.id !== id)
      if (selectedContentId.value === id) {
        selectedContentId.value = null
      }
    }
  }
}

function getContentType(icon: string) {
  if (icon.includes('image')) return 'Image'
  if (icon.includes('video')) return 'Video'
  if (icon.includes('powerpoint')) return 'Presentation'
  if (icon.includes('code')) return 'HTML'
  return 'Unknown'
}

function uploadContent() {
  alert('Content upload functionality would be implemented here')
  showUploadModal.value = false
}

function createNewFolder() {
  if (newFolderName.value.trim()) {
    const newId = Math.max(...folders.value.map(f => f.id)) + 1
    folders.value.push({
      id: newId,
      name: newFolderName.value.trim(),
      icon: 'fas fa-folder'
    })
    newFolderName.value = ''
    showNewFolderModal.value = false
    // Select the newly created folder
    selectedFolderId.value = newId
  }
}
</script>

<style scoped>
.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.content-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 180px;
}

.content-preview i {
  font-size: 64px;
  color: #999;
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
