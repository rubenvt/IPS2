import { reactive, readonly } from 'vue'

// Types
export interface PlaylistItem {
  id: number;
  title: string;
  duration: number; // Duration in seconds
  icon: string;
  contentId?: number; // Reference to the actual content item
}

export interface Playlist {
  id: number;
  title: string;
  description: string;
  icon: string;
  transition: string;
  items: PlaylistItem[];
}

export interface Player {
  id: number;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'warning';
  lastSeen: string;
  currentPlaylist?: number;
  group?: number;
  licenseKey?: string;
}

export interface ContentItem {
  id: number;
  title: string;
  type: 'image' | 'video' | 'html' | 'presentation';
  fileType: string;
  size: number; // Size in KB
  duration?: number; // Duration in seconds (for videos)
  url: string;
  thumbnail?: string;
  uploadDate: string;
  icon: string;
}

export interface Layout {
  id: number;
  name: string;
  description: string;
  zones: LayoutZone[];
}

export interface LayoutZone {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  playlistId?: number;
}

export interface Schedule {
  id: number;
  name: string;
  playlistId: number;
  playerIds: number[];
  startDate: string;
  endDate?: string;
  daysOfWeek: number[]; // 0-6, where 0 is Sunday
  startTime: string;
  endTime: string;
  priority: number;
  active: boolean;
}

export interface PlayerGroup {
  id: number;
  name: string;
  description: string;
  playerIds: number[];
  parentGroupId?: number;
}

// State interface
interface State {
  players: Player[];
  playlists: Playlist[];
  content: ContentItem[];
  layouts: Layout[];
  schedules: Schedule[];
  playerGroups: PlayerGroup[];
  systemSettings: Record<string, any>;
}

// Sample data
const samplePlaylists = [
  { 
    id: 1, 
    title: 'Company Announcements', 
    description: 'Important company updates and announcements',
    icon: 'fas fa-list',
    transition: 'fade',
    items: [
      { id: 101, title: 'Welcome Message.mp4', duration: 30, icon: 'fas fa-video', contentId: 5 },
      { id: 102, title: 'Company News.jpg', duration: 15, icon: 'fas fa-image', contentId: 4 },
      { id: 103, title: 'CEO Update.mp4', duration: 105, icon: 'fas fa-video', contentId: 5 }
    ]
  },
  { 
    id: 2, 
    title: 'Product Showcase', 
    description: 'Displays of our latest products and services',
    icon: 'fas fa-list',
    transition: 'slide',
    items: [
      { id: 201, title: 'Product A Demo.mp4', duration: 130, icon: 'fas fa-video', contentId: 2 },
      { id: 202, title: 'Product B Features.jpg', duration: 20, icon: 'fas fa-image', contentId: 1 }
    ]
  },
  { 
    id: 3, 
    title: 'Welcome Messages', 
    description: 'Greetings for visitors and new employees',
    icon: 'fas fa-list',
    transition: 'none',
    items: [
      { id: 301, title: 'Welcome to Our Company.mp4', duration: 45, icon: 'fas fa-video', contentId: 5 },
      { id: 302, title: 'Meet the Team.jpg', duration: 15, icon: 'fas fa-image', contentId: 4 }
    ]
  },
  { 
    id: 4, 
    title: 'Cafeteria Menu', 
    description: 'Daily and weekly food options',
    icon: 'fas fa-list',
    transition: 'fade',
    items: [
      { id: 401, title: 'Weekly Menu.jpg', duration: 20, icon: 'fas fa-image', contentId: 4 },
      { id: 402, title: 'Special Offers.jpg', duration: 15, icon: 'fas fa-image', contentId: 1 }
    ]
  },
  { 
    id: 5, 
    title: 'Event Calendar', 
    description: 'Upcoming company events and important dates',
    icon: 'fas fa-list',
    transition: 'slide',
    items: [
      { id: 501, title: 'Monthly Calendar.jpg', duration: 30, icon: 'fas fa-image', contentId: 4 },
      { id: 502, title: 'Event Highlights.mp4', duration: 80, icon: 'fas fa-video', contentId: 2 }
    ]
  },
  { 
    id: 6, 
    title: 'News Feed', 
    description: 'Industry news and updates',
    icon: 'fas fa-list',
    transition: 'none',
    items: [
      { id: 601, title: 'Industry News.jpg', duration: 20, icon: 'fas fa-image', contentId: 4 },
      { id: 602, title: 'Market Updates.jpg', duration: 20, icon: 'fas fa-image', contentId: 1 }
    ]
  }
];

const samplePlayers = [
  {
    id: 1,
    name: 'Lobby Display',
    location: 'Main Entrance',
    status: 'online' as const,
    lastSeen: '2023-06-15T09:30:00',
    currentPlaylist: 1,
    group: 1,
    licenseKey: 'ABCD-1234-EFGH-5678'
  },
  {
    id: 2,
    name: 'Cafeteria Screen',
    location: 'Cafeteria',
    status: 'online' as const,
    lastSeen: '2023-06-15T09:28:00',
    currentPlaylist: 4,
    group: 2,
    licenseKey: 'IJKL-9012-MNOP-3456'
  },
  {
    id: 3,
    name: 'Meeting Room A',
    location: 'Floor 2',
    status: 'offline' as const,
    lastSeen: '2023-06-14T17:45:00',
    currentPlaylist: 2,
    group: 3,
    licenseKey: 'QRST-7890-UVWX-1234'
  },
  {
    id: 4,
    name: 'Reception Display',
    location: 'Reception',
    status: 'warning' as const,
    lastSeen: '2023-06-15T08:15:00',
    currentPlaylist: 3,
    group: 1,
    licenseKey: 'YZAB-5678-CDEF-9012'
  },
  {
    id: 5,
    name: 'Executive Hallway',
    location: 'Floor 3',
    status: 'online' as const,
    lastSeen: '2023-06-15T09:29:00',
    currentPlaylist: 5,
    group: 4,
    licenseKey: 'GHIJ-3456-KLMN-7890'
  }
];

const sampleContent = [
  {
    id: 1,
    title: 'Company Logo.png',
    type: 'image' as const,
    fileType: 'png',
    size: 250,
    url: '/assets/company-logo.png',
    thumbnail: '/assets/thumbnails/company-logo.png',
    uploadDate: '2023-05-10T14:30:00',
    icon: 'fas fa-image'
  },
  {
    id: 2,
    title: 'Product Demo.mp4',
    type: 'video' as const,
    fileType: 'mp4',
    size: 15000,
    duration: 120,
    url: '/assets/product-demo.mp4',
    thumbnail: '/assets/thumbnails/product-demo.jpg',
    uploadDate: '2023-05-12T10:15:00',
    icon: 'fas fa-video'
  },
  {
    id: 3,
    title: 'Quarterly Report.pptx',
    type: 'presentation' as const,
    fileType: 'pptx',
    size: 5000,
    url: '/assets/quarterly-report.pptx',
    thumbnail: '/assets/thumbnails/quarterly-report.jpg',
    uploadDate: '2023-06-01T09:45:00',
    icon: 'fas fa-file-powerpoint'
  },
  {
    id: 4,
    title: 'Welcome Banner.jpg',
    type: 'image' as const,
    fileType: 'jpg',
    size: 500,
    url: '/assets/welcome-banner.jpg',
    thumbnail: '/assets/thumbnails/welcome-banner.jpg',
    uploadDate: '2023-05-20T11:30:00',
    icon: 'fas fa-image'
  },
  {
    id: 5,
    title: 'CEO Message.mp4',
    type: 'video' as const,
    fileType: 'mp4',
    size: 25000,
    duration: 180,
    url: '/assets/ceo-message.mp4',
    thumbnail: '/assets/thumbnails/ceo-message.jpg',
    uploadDate: '2023-06-05T15:20:00',
    icon: 'fas fa-video'
  },
  {
    id: 6,
    title: 'Interactive Menu.html',
    type: 'html' as const,
    fileType: 'html',
    size: 100,
    url: '/assets/interactive-menu.html',
    thumbnail: '/assets/thumbnails/interactive-menu.jpg',
    uploadDate: '2023-06-10T13:10:00',
    icon: 'fas fa-code'
  }
];

const sampleSchedules = [
  {
    id: 1,
    name: 'Morning Announcements',
    playlistId: 1,
    playerIds: [1, 4],
    startDate: '2023-06-01',
    daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
    startTime: '08:00',
    endTime: '12:00',
    priority: 10,
    active: true
  },
  {
    id: 2,
    name: 'Lunch Menu',
    playlistId: 4,
    playerIds: [2],
    startDate: '2023-06-01',
    daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
    startTime: '11:30',
    endTime: '14:00',
    priority: 20,
    active: true
  },
  {
    id: 3,
    name: 'Weekend Events',
    playlistId: 5,
    playerIds: [1, 2, 4, 5],
    startDate: '2023-06-01',
    daysOfWeek: [6, 0], // Saturday and Sunday
    startTime: '09:00',
    endTime: '18:00',
    priority: 5,
    active: true
  }
];

const samplePlayerGroups = [
  {
    id: 1,
    name: 'Public Areas',
    description: 'Displays in public-facing areas',
    playerIds: [1, 4]
  },
  {
    id: 2,
    name: 'Cafeteria',
    description: 'Displays in food service areas',
    playerIds: [2]
  },
  {
    id: 3,
    name: 'Meeting Rooms',
    description: 'Displays in meeting and conference rooms',
    playerIds: [3]
  },
  {
    id: 4,
    name: 'Executive Areas',
    description: 'Displays in executive areas',
    playerIds: [5],
    parentGroupId: 1
  }
];

// Create the initial state
const state = reactive<State>({
  players: samplePlayers,
  playlists: samplePlaylists,
  content: sampleContent,
  layouts: [],
  schedules: sampleSchedules,
  playerGroups: samplePlayerGroups,
  systemSettings: {
    storageLimit: 10000, // in MB
    storageUsed: 45850, // Sum of all content sizes
    maxPlayers: 100,
    licenseCount: 10,
    licenseUsed: 5
  }
});

// Actions to modify state
const actions = {
  // Player actions
  addPlayer(player: Player) {
    const newId = Math.max(...state.players.map(p => p.id), 0) + 1;
    state.players.push({ ...player, id: newId });
    state.systemSettings.licenseUsed += 1;
    return newId;
  },
  updatePlayer(id: number, data: Partial<Player>) {
    const index = state.players.findIndex(p => p.id === id);
    if (index !== -1) {
      state.players[index] = { ...state.players[index], ...data };
    }
  },
  removePlayer(id: number) {
    state.players = state.players.filter(p => p.id !== id);
    state.systemSettings.licenseUsed -= 1;
    
    // Remove player from groups
    state.playerGroups.forEach(group => {
      group.playerIds = group.playerIds.filter(playerId => playerId !== id);
    });
    
    // Remove player from schedules
    state.schedules.forEach(schedule => {
      schedule.playerIds = schedule.playerIds.filter(playerId => playerId !== id);
    });
  },
  
  // Playlist actions
  addPlaylist(playlist: Omit<Playlist, 'id'>) {
    const newId = Math.max(...state.playlists.map(p => p.id), 0) + 1;
    state.playlists.push({ ...playlist, id: newId });
    return newId;
  },
  updatePlaylist(id: number, data: Partial<Playlist>) {
    const index = state.playlists.findIndex(p => p.id === id);
    if (index !== -1) {
      state.playlists[index] = { ...state.playlists[index], ...data };
    }
  },
  removePlaylist(id: number) {
    state.playlists = state.playlists.filter(p => p.id !== id);
    
    // Update players that use this playlist
    state.players.forEach(player => {
      if (player.currentPlaylist === id) {
        player.currentPlaylist = undefined;
      }
    });
    
    // Update schedules that use this playlist
    state.schedules = state.schedules.filter(s => s.playlistId !== id);
  },
  
  // Content actions
  addContent(content: Omit<ContentItem, 'id'>) {
    const newId = Math.max(...state.content.map(c => c.id), 0) + 1;
    state.content.push({ ...content, id: newId });
    // Update storage used
    state.systemSettings.storageUsed += content.size || 0;
    return newId;
  },
  updateContent(id: number, data: Partial<ContentItem>) {
    const index = state.content.findIndex(c => c.id === id);
    if (index !== -1) {
      // If size is changing, update storage used
      if (data.size && data.size !== state.content[index].size) {
        state.systemSettings.storageUsed -= state.content[index].size || 0;
        state.systemSettings.storageUsed += data.size;
      }
      state.content[index] = { ...state.content[index], ...data };
    }
  },
  removeContent(id: number) {
    const content = state.content.find(c => c.id === id);
    if (content) {
      state.systemSettings.storageUsed -= content.size || 0;
    }
    state.content = state.content.filter(c => c.id !== id);
    
    // Remove content from playlists
    state.playlists.forEach(playlist => {
      playlist.items = playlist.items.filter(item => item.contentId !== id);
    });
  },
  
  // Schedule actions
  addSchedule(schedule: Omit<Schedule, 'id'>) {
    const newId = Math.max(...state.schedules.map(s => s.id), 0) + 1;
    state.schedules.push({ ...schedule, id: newId });
    return newId;
  },
  updateSchedule(id: number, data: Partial<Schedule>) {
    const index = state.schedules.findIndex(s => s.id === id);
    if (index !== -1) {
      state.schedules[index] = { ...state.schedules[index], ...data };
    }
  },
  removeSchedule(id: number) {
    state.schedules = state.schedules.filter(s => s.id !== id);
  },
  
  // Player Group actions
  addPlayerGroup(group: Omit<PlayerGroup, 'id'>) {
    const newId = Math.max(...state.playerGroups.map(g => g.id), 0) + 1;
    state.playerGroups.push({ ...group, id: newId });
    return newId;
  },
  updatePlayerGroup(id: number, data: Partial<PlayerGroup>) {
    const index = state.playerGroups.findIndex(g => g.id === id);
    if (index !== -1) {
      state.playerGroups[index] = { ...state.playerGroups[index], ...data };
    }
  },
  removePlayerGroup(id: number) {
    // Update child groups
    state.playerGroups.forEach(group => {
      if (group.parentGroupId === id) {
        group.parentGroupId = undefined;
      }
    });
    
    state.playerGroups = state.playerGroups.filter(g => g.id !== id);
  },
  
  // System settings
  updateSystemSettings(settings: Record<string, any>) {
    state.systemSettings = { ...state.systemSettings, ...settings };
  }
};

// Getters for computed values
const getters = {
  getPlayerById: (id: number) => {
    return state.players.find(p => p.id === id);
  },
  getPlaylistById: (id: number) => {
    return state.playlists.find(p => p.id === id);
  },
  getContentById: (id: number) => {
    return state.content.find(c => c.id === id);
  },
  getScheduleById: (id: number) => {
    return state.schedules.find(s => s.id === id);
  },
  getPlayerGroupById: (id: number) => {
    return state.playerGroups.find(g => g.id === id);
  },
  getStorageUsedPercentage: () => {
    return (state.systemSettings.storageUsed / state.systemSettings.storageLimit) * 100;
  },
  getActivePlayerCount: () => {
    return state.players.filter(p => p.status === 'online').length;
  },
  getLicenseUsedPercentage: () => {
    return (state.systemSettings.licenseUsed / state.systemSettings.licenseCount) * 100;
  },
  getSchedulesForPlayer: (playerId: number) => {
    return state.schedules.filter(schedule => 
      schedule.playerIds.includes(playerId) && schedule.active
    );
  },
  getSchedulesForPlaylist: (playlistId: number) => {
    return state.schedules.filter(schedule => 
      schedule.playlistId === playlistId && schedule.active
    );
  },
  getChildGroups: (groupId: number) => {
    return state.playerGroups.filter(group => group.parentGroupId === groupId);
  },
  getPlayersInGroup: (groupId: number) => {
    const group = state.playerGroups.find(g => g.id === groupId);
    if (!group) return [];
    return state.players.filter(player => group.playerIds.includes(player.id));
  },
  getPlaylistsWithContent: (contentId: number) => {
    return state.playlists.filter(playlist => 
      playlist.items.some(item => item.contentId === contentId)
    );
  }
};

// Export a store object with state, actions, and getters
export const store = {
  state: readonly(state), // Read-only state to prevent direct mutations
  ...actions,
  ...getters
};
