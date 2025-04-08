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
          <li class="sidebar-item" :class="{ active: activeSection === 'storage' }" @click="activeSection = 'storage'">
            <i class="fas fa-database"></i>
            <span>Storage</span>
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
      
      <!-- Users Management Section -->
      <div class="content-panel" v-if="activeSection === 'users'">
        <div class="panel-header">
          <div class="panel-title">User Management</div>
          <div class="panel-actions">
            <button class="btn btn-primary" @click="openUserModal()">
              <i class="fas fa-plus"></i> Add User
            </button>
          </div>
        </div>
        <div class="panel-content">
          <div class="users-list">
            <table class="users-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>
                    <div class="user-info">
                      <div class="user-avatar" :style="{ backgroundColor: getUserColor(user.username) }">
                        {{ getUserInitials(user.username) }}
                      </div>
                      <span>{{ user.username }}</span>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="user-role" :class="getRoleClass(user.role)">
                      {{ user.role }}
                    </span>
                  </td>
                  <td>
                    <span class="user-status" :class="{ 'status-active': user.active, 'status-inactive': !user.active }">
                      {{ user.active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <div class="user-actions">
                      <button class="action-btn" @click="openUserModal(user)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="action-btn" @click="toggleUserStatus(user)">
                        <i :class="user.active ? 'fas fa-ban' : 'fas fa-check'"></i>
                      </button>
                      <button class="action-btn" @click="confirmDeleteUser(user)">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
      <div class="content-panel" v-if="activeSection !== 'general' && activeSection !== 'storage' && activeSection !== 'users'">
        <div class="panel-header">
          <div class="panel-title">{{ activeSection.charAt(0).toUpperCase() + activeSection.slice(1) }}</div>
        </div>
        <div class="panel-content">
          <p>This section is under development.</p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- User Edit Modal -->
  <Modal v-model="showUserModal" :title="editingUser ? 'Edit User' : 'Add New User'">
    <div class="user-form">
      <div class="form-group">
        <label class="form-label">Username</label>
        <input type="text" class="form-control" v-model="userForm.username" />
      </div>
      
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" v-model="userForm.email" />
      </div>
      
      <div class="form-group" v-if="!editingUser">
        <label class="form-label">Password</label>
        <input type="password" class="form-control" v-model="userForm.password" />
      </div>
      
      <div class="form-group" v-if="editingUser">
        <label class="form-label">Change Password</label>
        <input type="password" class="form-control" v-model="userForm.password" placeholder="Leave blank to keep current password" />
      </div>
      
      <div class="form-group">
        <label class="form-label">Role</label>
        <select class="form-control" v-model="userForm.role">
          <option value="Administrator">Administrator</option>
          <option value="Content Manager">Content Manager</option>
          <option value="Scheduler">Scheduler</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>
      
      <div class="form-group">
        <label class="form-label">Status</label>
        <div class="toggle-switch">
          <input type="checkbox" id="user-status" v-model="userForm.active" />
          <label for="user-status"></label>
          <span>{{ userForm.active ? 'Active' : 'Inactive' }}</span>
        </div>
      </div>
      
      <div class="section-header">Permissions</div>
      
      <div class="permissions-grid">
        <div class="permission-group">
          <div class="permission-header">Content</div>
          <div class="permission-item">
            <input type="checkbox" id="perm-content-view" v-model="userForm.permissions.content.view" />
            <label for="perm-content-view">View Content</label>
          </div>
          <div class="permission-item">
            <input type="checkbox" id="perm-content-create" v-model="userForm.permissions.content.create" />
            <label for="perm-content-create">Create Content</label>
          </div>
          <div class="permission-item">
            <input type="checkbox" id="perm-content-edit" v-model="userForm.permissions.content.edit" />
            <label for="perm-content-edit">Edit Content</label>
          </div>
          <div class="permission-item">
            <input type="checkbox" id="perm-content-delete" v-model="userForm.permissions.content.delete" />
            <label for="perm-content-delete">Delete Content</label>
          </div>
        </div>
        
        <div class="permission-group">
          <div class="permission-header">Playlists</div>
          <div class="permission-item">
            <input type="checkbox" id="perm-playlists-view" v-model="userForm.permissions.playlists.view" />
            <label for="perm-playlists-view">View Playlists</label>
          </div>
          <div class="permission-item">
            <input type="checkbox" id="perm-playlists-create" v-model="userForm.permissions.playlists.create" />
            <label for="perm-playlists-create">Create Playlists</label>
          </div>
          <div class="permission-item">
            <input type="checkbox" id="perm-playlists-edit" v-model="userForm.permissions.playlists.edit" />
            <label for="perm-playlists-edit">Edit Playlists</label>
          </div>
          <div class="permission-item">
            <input type="checkbox" id="perm-playlists-delete" v-model="userForm.permissions.playlists.delete" />
            <label for="perm-playlists-delete">Delete Playlists</label>
          </div>
        </div>
        
        <div class="permission-group">
          <div class="permission-header">Players</div>
          <div class="permission-item">
            <input type="checkbox" id="perm-players-view" v-model="userForm.permissions.players.view" />
            <label for="perm-players-view">View Players</label>
          </div>
          <div class="permission-item">
            <input type="checkbox" id="perm-players-create" v-model="userForm.permissions.players.create" />
            <label for="perm-players-create">Add Players</label>
          </div>
          <div class="permission-item">
            <input type="checkbox" id="perm-players-edit" v-model="userForm.permissions.players.edit" />
            <label for="perm-players-edit">Edit Players</label>
          </div>
          <div class="permission-item">
            <input type="checkbox" id="perm-players-delete" v-model="userForm.permissions.players.delete" />
            <label for="perm-players-delete">Delete Players</label>
          </div>
        </div>
        
        <div class="permission-group">
          <div class="permission-header">Schedules</div>
          <div class="permission-item">
            <input type="checkbox" id="perm-schedules-view" v-model="userForm.permissions.schedules.view" />
            <label for="perm-schedules-view">View Schedules</label>
          </div>
          <div class="permission-item">
            <input type="checkbox" id="perm-schedules-create" v-model="userForm.permissions.schedules.create" />
            <label for="perm-schedules-create">Create Schedules</label>
          </div>
          <div class="permission-item">
            <input type="checkbox" id="perm-schedules-edit" v-model="userForm.permissions.schedules.edit" />
            <label for="perm-schedules-edit">Edit Schedules</label>
          </div>
          <div class="permission-item">
            <input type="checkbox" id="perm-schedules-delete" v-model="userForm.permissions.schedules.delete" />
            <label for="perm-schedules-delete">Delete Schedules</label>
          </div>
        </div>
        
        <div class="permission-group">
          <div class="permission-header">System</div>
          <div class="permission-item">
            <input type="checkbox" id="perm-system-view" v-model="userForm.permissions.system.view" />
            <label for="perm-system-view">View Settings</label>
          </div>
          <div class="permission-item">
            <input type="checkbox" id="perm-system-edit" v-model="userForm.permissions.system.edit" />
            <label for="perm-system-edit">Edit Settings</label>
          </div>
          <div class="permission-item">
            <input type="checkbox" id="perm-system-users" v-model="userForm.permissions.system.users" />
            <label for="perm-system-users">Manage Users</label>
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <button class="btn btn-secondary" @click="showUserModal = false">Cancel</button>
      <button class="btn btn-primary" @click="saveUser">Save User</button>
    </template>
  </Modal>
  
  <!-- Delete Confirmation Modal -->
  <Modal v-model="showDeleteModal" title="Confirm Delete">
    <p>Are you sure you want to delete the user <strong>{{ userToDelete?.username }}</strong>?</p>
    <p>This action cannot be undone.</p>
    
    <template #footer>
      <button class="btn btn-secondary" @click="showDeleteModal = false">Cancel</button>
      <button class="btn btn-danger" @click="deleteUser">Delete User</button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import Header from '../components/Header.vue'
import Modal from '../components/Modal.vue'

// Active section
const activeSection = ref('users')

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

// User management
interface Permission {
  view: boolean;
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
  users?: boolean;
}

interface UserPermissions {
  content: Permission;
  playlists: Permission;
  players: Permission;
  schedules: Permission;
  system: Permission;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  active: boolean;
  lastLogin?: string;
  permissions: UserPermissions;
}

// Sample users
const users = ref<User[]>([
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'Administrator',
    active: true,
    lastLogin: '2023-06-15T09:30:00',
    permissions: {
      content: { view: true, create: true, edit: true, delete: true },
      playlists: { view: true, create: true, edit: true, delete: true },
      players: { view: true, create: true, edit: true, delete: true },
      schedules: { view: true, create: true, edit: true, delete: true },
      system: { view: true, edit: true, users: true }
    }
  },
  {
    id: 2,
    username: 'contentmanager',
    email: 'content@example.com',
    role: 'Content Manager',
    active: true,
    lastLogin: '2023-06-14T16:45:00',
    permissions: {
      content: { view: true, create: true, edit: true, delete: true },
      playlists: { view: true, create: true, edit: true, delete: true },
      players: { view: true, create: false, edit: false, delete: false },
      schedules: { view: true, create: false, edit: false, delete: false },
      system: { view: false, edit: false, users: false }
    }
  },
  {
    id: 3,
    username: 'scheduler',
    email: 'scheduler@example.com',
    role: 'Scheduler',
    active: true,
    lastLogin: '2023-06-15T08:20:00',
    permissions: {
      content: { view: true, create: false, edit: false, delete: false },
      playlists: { view: true, create: false, edit: false, delete: false },
      players: { view: true, create: false, edit: false, delete: false },
      schedules: { view: true, create: true, edit: true, delete: true },
      system: { view: false, edit: false, users: false }
    }
  },
  {
    id: 4,
    username: 'viewer',
    email: 'viewer@example.com',
    role: 'Viewer',
    active: false,
    lastLogin: '2023-06-10T14:30:00',
    permissions: {
      content: { view: true, create: false, edit: false, delete: false },
      playlists: { view: true, create: false, edit: false, delete: false },
      players: { view: true, create: false, edit: false, delete: false },
      schedules: { view: true, create: false, edit: false, delete: false },
      system: { view: false, edit: false, users: false }
    }
  }
]);

// User form and modal state
const showUserModal = ref(false);
const showDeleteModal = ref(false);
const editingUser = ref<User | null>(null);
const userToDelete = ref<User | null>(null);

// Default permissions template
const getDefaultPermissions = (): UserPermissions => ({
  content: { view: true, create: false, edit: false, delete: false },
  playlists: { view: true, create: false, edit: false, delete: false },
  players: { view: true, create: false, edit: false, delete: false },
  schedules: { view: true, create: false, edit: false, delete: false },
  system: { view: false, edit: false, users: false }
});

// User form
const userForm = reactive({
  id: 0,
  username: '',
  email: '',
  password: '',
  role: 'Viewer',
  active: true,
  permissions: getDefaultPermissions()
});

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

// User management methods
function getUserInitials(username: string): string {
  return username.substring(0, 2).toUpperCase();
}

function getUserColor(username: string): string {
  // Generate a deterministic color based on the username
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

function getRoleClass(role: string): string {
  switch (role) {
    case 'Administrator':
      return 'role-admin';
    case 'Content Manager':
      return 'role-content';
    case 'Scheduler':
      return 'role-scheduler';
    default:
      return 'role-viewer';
  }
}

function openUserModal(user?: User) {
  if (user) {
    // Edit existing user
    editingUser.value = user;
    userForm.id = user.id;
    userForm.username = user.username;
    userForm.email = user.email;
    userForm.password = ''; // Clear password field
    userForm.role = user.role;
    userForm.active = user.active;
    userForm.permissions = JSON.parse(JSON.stringify(user.permissions)); // Deep copy
  } else {
    // Create new user
    editingUser.value = null;
    userForm.id = 0;
    userForm.username = '';
    userForm.email = '';
    userForm.password = '';
    userForm.role = 'Viewer';
    userForm.active = true;
    userForm.permissions = getDefaultPermissions();
  }
  
  // Set permissions based on role
  updatePermissionsByRole();
  
  showUserModal.value = true;
}

function updatePermissionsByRole() {
  // This is a helper function to set default permissions based on role
  // In a real app, you might want to customize this further
  
  const allTrue = { view: true, create: true, edit: true, delete: true };
  const viewOnly = { view: true, create: false, edit: false, delete: false };
  
  switch (userForm.role) {
    case 'Administrator':
      userForm.permissions = {
        content: allTrue,
        playlists: allTrue,
        players: allTrue,
        schedules: allTrue,
        system: { view: true, edit: true, users: true }
      };
      break;
    case 'Content Manager':
      userForm.permissions = {
        content: allTrue,
        playlists: allTrue,
        players: viewOnly,
        schedules: viewOnly,
        system: { view: false, edit: false, users: false }
      };
      break;
    case 'Scheduler':
      userForm.permissions = {
        content: viewOnly,
        playlists: viewOnly,
        players: viewOnly,
        schedules: allTrue,
        system: { view: false, edit: false, users: false }
      };
      break;
    case 'Viewer':
      userForm.permissions = {
        content: viewOnly,
        playlists: viewOnly,
        players: viewOnly,
        schedules: viewOnly,
        system: { view: false, edit: false, users: false }
      };
      break;
  }
}

function saveUser() {
  if (!userForm.username || !userForm.email) {
    alert('Username and email are required!');
    return;
  }
  
  if (!editingUser.value && !userForm.password) {
    alert('Password is required for new users!');
    return;
  }
  
  if (editingUser.value) {
    // Update existing user
    const index = users.value.findIndex(u =>u => u.id === userForm.id);
    if (index !== -1) {
      // Keep the existing password if not changed
      const updatedUser = { ...userForm };
      if (!updatedUser.password) {
        delete updatedUser.password;
      }
      
      users.value[index] = {
        ...users.value[index],
        ...updatedUser
      };
    }
  } else {
    // Create new user
    const newId = Math.max(...users.value.map(u => u.id), 0) + 1;
    users.value.push({
      ...userForm,
      id: newId,
      lastLogin: undefined
    });
  }
  
  showUserModal.value = false;
}

function toggleUserStatus(user: User) {
  const index = users.value.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users.value[index].active = !users.value[index].active;
  }
}

function confirmDeleteUser(user: User) {
  userToDelete.value = user;
  showDeleteModal.value = true;
}

function deleteUser() {
  if (userToDelete.value) {
    users.value = users.value.filter(u => u.id !== userToDelete.value!.id);
    showDeleteModal.value = false;
    userToDelete.value = null;
  }
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

/* User Management Styles */
.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 500;
  color: #64748b;
}

.users-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  margin-right: 12px;
}

.user-role {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.role-admin {
  background-color: #e0f2fe;
  color: #0284c7;
}

.role-content {
  background-color: #dcfce7;
  color: #16a34a;
}

.role-scheduler {
  background-color: #fef3c7;
  color: #d97706;
}

.role-viewer {
  background-color: #f1f5f9;
  color: #64748b;
}

.user-status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-active {
  background-color: #dcfce7;
  color: #16a34a;
}

.status-inactive {
  background-color: #f1f5f9;
  color: #64748b;
}

.user-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

/* User Form Styles */
.user-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toggle-switch {
  display: flex;
  align-items: center;
}

.toggle-switch input {
  height: 0;
  width: 0;
  visibility: hidden;
  position: absolute;
}

.toggle-switch label {
  cursor: pointer;
  width: 48px;
  height: 24px;
  background: #e2e8f0;
  display: block;
  border-radius: 24px;
  position: relative;
  margin-right: 8px;
}

.toggle-switch label:after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 20px;
  transition: 0.3s;
}

.toggle-switch input:checked + label {
  background: #0284c7;
}

.toggle-switch input:checked + label:after {
  left: calc(100% - 2px);
  transform: translateX(-100%);
}

/* Permissions Grid */
.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.permission-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.permission-header {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.permission-item {
  display: flex;
  align-items: center;
}

.permission-item input {
  margin-right: 8px;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}
</style>
