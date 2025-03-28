<template>
  <div class="main-content">
    <Header title="Content Library" />
    <div class="content-area">
      <div class="content-panel" style="width: 250px;">
        <div class="panel-header">
          <div class="panel-title">Folders</div>
          <div class="panel-actions">
            <button><i class="fas fa-plus"></i></button>
            <button><i class="fas fa-ellipsis-v"></i></button>
          </div>
        </div>
        <ul class="sidebar-menu">
          <li class="sidebar-item active">
            <i class="fas fa-folder-open"></i>
            <span>All Content</span>
          </li>
          <li class="sidebar-item">
            <i class="fas fa-folder"></i>
            <span>Images</span>
          </li>
          <li class="sidebar-item">
            <i class="fas fa-folder"></i>
            <span>Logos</span>
          </li>
          <li class="sidebar-item">
            <i class="fas fa-folder"></i>
            <span>Backgrounds</span>
          </li>
          <li class="sidebar-item">
            <i class="fas fa-folder"></i>
            <span>Videos</span>
          </li>
          <li class="sidebar-item">
            <i class="fas fa-folder"></i>
            <span>Presentations</span>
          </li>
          <li class="sidebar-item">
            <i class="fas fa-folder"></i>
            <span>HTML Content</span>
          </li>
        </ul>
      </div>
      <div class="content-panel">
        <div class="panel-header">
          <div class="panel-title">All Content</div>
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
              <input type="text" class="form-control" :value="selectedContent.title" disabled />
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
              <label class="form-label">Upload Date</label>
              <input type="text" class="form-control" :value="selectedContent.uploadDate || 'Not available'" disabled />
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary">Close</button>
        </div>
      </div>
    </div>
    <Modal v-model="showUploadModal" title="Upload Content">
      <div class="form-group">
        <label class="form-label">Select Files</label>
        <input 
          type="file" 
          class="form-control" 
          ref="fileInput"
          multiple 
          @change="validateFiles"
        />
        <div class="file-types-info">
          <small>Supported file types: JPG, PNG, GIF, MP4, WebM</small>
        </div>
        <div v-if="fileError" class="file-error-message">
          {{ fileError }}
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Destination Folder</label>
        <select class="form-control">
          <option value="all">All Content</option>
          <option value="images">Images</option>
          <option value="videos">Videos</option>
        </select>
      </div>
      <template #footer>
        <button class="btn btn-secondary" @click="cancelUpload">Cancel</button>
        <button class="btn btn-primary" @click="uploadContent" :disabled="!isValidUpload">Upload</button>
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

// Supported file types
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const SUPPORTED_FILE_TYPES = [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES];

const contentItems = ref([
  { 
    id: 1, 
    title: 'Company Logo.png', 
    subtitle: '1.2 MB', 
    icon: 'fas fa-image',
    uploadDate: '2023-05-15',
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
    uploadDate: '2023-06-02',
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
    uploadDate: '2023-04-10',
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
    uploadDate: '2023-05-22',
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
    uploadDate: '2023-06-15',
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
    uploadDate: '2023-03-28',
    actions: [
      { name: 'preview', icon: 'fas fa-eye' },
      { name: 'download', icon: 'fas fa-download' },
      { name: 'delete', icon: 'fas fa-trash' }
    ]
  }
])

const searchQuery = ref('')
const selectedContentId = ref<number | null>(null)
const showUploadModal = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFiles = ref<File[]>([])
const fileError = ref('')
const isValidUpload = ref(false)

const filteredContent = computed(() => {
  if (!searchQuery.value) return contentItems.value
  const query = searchQuery.value.toLowerCase()
  return contentItems.value.filter(item => 
    item.title.toLowerCase().includes(query)
  )
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

function validateFiles(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    fileError.value = '';
    isValidUpload.value = false;
    return;
  }

  const files = Array.from(input.files);
  const invalidFiles = files.filter(file => !SUPPORTED_FILE_TYPES.includes(file.type));
  
  if (invalidFiles.length > 0) {
    const invalidFileNames = invalidFiles.map(file => file.name).join(', ');
    fileError.value = `Unsupported file type(s): ${invalidFileNames}. Only JPG, PNG, GIF, MP4, and WebM files are supported.`;
    isValidUpload.value = false;
  } else {
    fileError.value = '';
    selectedFiles.value = files;
    isValidUpload.value = true;
  }
}

function cancelUpload() {
  showUploadModal.value = false;
  fileError.value = '';
  selectedFiles.value = [];
  isValidUpload.value = false;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

function uploadContent() {
  if (!isValidUpload.value || selectedFiles.value.length === 0) {
    return;
  }

  // Simulate file upload
  const newItems = selectedFiles.value.map((file, index) => {
    const id = Math.max(...contentItems.value.map(item => item.id)) + index + 1;
    const fileIcon = getFileIcon(file.type);
    
    return {
      id,
      title: file.name,
      subtitle: formatFileSize(file.size),
      icon: fileIcon,
      uploadDate: new Date().toISOString().split('T')[0],
      actions: [
        { name: 'preview', icon: 'fas fa-eye' },
        { name: 'download', icon: 'fas fa-download' },
        { name: 'delete', icon: 'fas fa-trash' }
      ]
    };
  });

  contentItems.value = [...contentItems.value, ...newItems];
  
  // Reset upload state
  cancelUpload();
  showUploadModal.value = false;
  
  alert(`Successfully uploaded ${newItems.length} file(s)`);
}

function getFileIcon(mimeType: string): string {
  if (SUPPORTED_IMAGE_TYPES.includes(mimeType)) {
    return 'fas fa-image';
  } else if (SUPPORTED_VIDEO_TYPES.includes(mimeType)) {
    return 'fas fa-video';
  }
  return 'fas fa-file';
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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

.file-types-info {
  margin-top: 4px;
  color: #64748b;
}

.file-error-message {
  margin-top: 8px;
  color: #ef4444;
  font-size: 14px;
  padding: 8px;
  background-color: #fee2e2;
  border-radius: 4px;
}
</style>
