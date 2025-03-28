<template>
  <div class="slide-panel-container" :class="{ 'open': modelValue }">
    <div class="slide-panel-backdrop" @click="close"></div>
    <div class="slide-panel">
      <div class="slide-panel-header">
        <h3 class="slide-panel-title">{{ title }}</h3>
        <button class="slide-panel-close" @click="close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="slide-panel-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.slide-panel-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  visibility: hidden;
  pointer-events: none;
}

.slide-panel-container.open {
  visibility: visible;
  pointer-events: auto;
}

.slide-panel-backdrop {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.slide-panel-container.open .slide-panel-backdrop {
  opacity: 1;
}

.slide-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 500px;
  max-width: 90vw;
  background-color: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.slide-panel-container.open .slide-panel {
  transform: translateX(0);
}

.slide-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.slide-panel-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.slide-panel-close {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.slide-panel-close:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.slide-panel-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
</style>
