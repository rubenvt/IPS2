<template>
  <div class="slide-panel" :class="{ open: modelValue }">
    <div class="slide-panel-header">
      <div class="slide-panel-title">{{ title }}</div>
      <button class="slide-panel-close" @click="$emit('update:modelValue', false)">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="slide-panel-body">
      <slot></slot>
    </div>
    <div class="slide-panel-footer">
      <slot name="footer">
        <button class="btn btn-secondary" @click="$emit('update:modelValue', false)">Cancel</button>
        <button class="btn btn-primary" @click="$emit('save')">Save</button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title: string
}>()

defineEmits(['update:modelValue', 'save'])
</script>
