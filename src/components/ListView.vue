<template>
  <div class="list-view">
    <div v-if="items.length === 0" class="empty-state">
      No items found
    </div>
    <div v-else class="list-items">
      <div 
        v-for="item in items" 
        :key="item.id" 
        class="list-item"
        :class="{ 'selected': selectedId === item.id }"
        @click="$emit('select', item.id)"
      >
        <div class="item-icon">
          <i :class="item.icon"></i>
        </div>
        <div class="item-content">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-subtitle">{{ item.subtitle }}</div>
        </div>
        <div class="item-actions">
          <button 
            v-for="action in item.actions" 
            :key="action.name"
            class="item-action"
            @click.stop="$emit('action', { id: item.id, action: action.name })"
          >
            <i :class="action.icon"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{
    id: number
    title: string
    subtitle: string
    icon: string
    actions: Array<{
      name: string
      icon: string
    }>
  }>
  selectedId: number | null
}>()

defineEmits(['select', 'action'])
</script>

<style scoped>
.list-view {
  flex: 1;
  overflow-y: auto;
}

.list-items {
  display: flex;
  flex-direction: column;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background-color 0.2s;
}

.list-item:hover {
  background-color: #f8fafc;
}

.list-item.selected {
  background-color: #e0f2fe;
}

.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #64748b;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-subtitle {
  font-size: 12px;
  color: #64748b;
}

.item-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.list-item:hover .item-actions {
  opacity: 1;
}

.item-action {
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

.item-action:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}
</style>
