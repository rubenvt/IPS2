<template>
  <div class="warning-card" :class="typeClass">
    <div class="warning-icon">
      <i :class="iconClass"></i>
    </div>
    <div class="warning-content">
      <div class="warning-title">{{ title }}</div>
      <div class="warning-message">{{ message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
}>();

const typeClass = computed(() => `warning-card--${props.type}`);

const iconClass = computed(() => {
  switch (props.type) {
    case 'error':
      return 'fas fa-exclamation-circle';
    case 'warning':
      return 'fas fa-exclamation-triangle';
    case 'info':
      return 'fas fa-info-circle';
    default:
      return 'fas fa-info-circle';
  }
});
</script>

<style scoped>
.warning-card {
  display: flex;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 12px;
  border-left: 4px solid;
}

.warning-card--error {
  background-color: #fee2e2;
  border-left-color: #ef4444;
}

.warning-card--warning {
  background-color: #fef3c7;
  border-left-color: #f59e0b;
}

.warning-card--info {
  background-color: #dbeafe;
  border-left-color: #3b82f6;
}

.warning-icon {
  margin-right: 16px;
  display: flex;
  align-items: center;
  font-size: 20px;
}

.warning-card--error .warning-icon {
  color: #ef4444;
}

.warning-card--warning .warning-icon {
  color: #f59e0b;
}

.warning-card--info .warning-icon {
  color: #3b82f6;
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 14px;
}

.warning-message {
  font-size: 13px;
  color: #4b5563;
}
</style>
