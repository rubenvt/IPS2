<template>
  <div class="search-bar">
    <i class="fas fa-search search-icon"></i>
    <input 
      type="text" 
      class="search-input" 
      :placeholder="placeholder" 
      v-model="query"
      @input="onInput"
    />
    <button v-if="query" class="clear-button" @click="clearSearch">
      <i class="fas fa-times"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  placeholder: string
}>()

const emit = defineEmits(['search'])

const query = ref('')

function onInput() {
  emit('search', query.value)
}

function clearSearch() {
  query.value = ''
  emit('search', '')
}
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  background-color: #f1f5f9;
  border-radius: 6px;
  padding: 0 12px;
  margin: 16px;
  position: relative;
}

.search-icon {
  color: #64748b;
  margin-right: 8px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px 0;
  font-size: 14px;
  color: #1e293b;
}

.search-input:focus {
  outline: none;
}

.search-input::placeholder {
  color: #94a3b8;
}

.clear-button {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-button:hover {
  color: #1e293b;
}
</style>
