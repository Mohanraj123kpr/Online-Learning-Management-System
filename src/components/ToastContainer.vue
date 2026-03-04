<script setup lang="ts">
import { ref, watch } from 'vue'
import VButton from '@/components/ui/VButton.vue'

// Simple toast state management
const toasts = ref<Array<{ id: number; message: string; type: string }>>([])
let toastId = 0

// Expose method to add toasts
function addToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const id = toastId++
  toasts.value.push({ id, message, type })

  setTimeout(() => {
    removeToast(id)
  }, 3000)
}

function removeToast(id: number) {
  const index = toasts.value.findIndex((t) => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Make addToast available globally
if (typeof window !== 'undefined') {
  ;(window as any).__addToast = addToast
}

function getColor(type: string) {
  const colors = {
    success: 'success',
    error: 'error',
    info: 'info',
    warning: 'warning',
  }
  return colors[type as keyof typeof colors] || 'info'
}
</script>

<template>
  <div class="toast-container">
    <v-snackbar
      v-for="toast in toasts"
      :key="toast.id"
      :model-value="true"
      :color="getColor(toast.type)"
      location="top right"
      :timeout="3000"
      @update:model-value="removeToast(toast.id)"
    >
      {{ toast.message }}
      <template v-slot:actions>
        <VButton :icon="true" size="small" variant="text" @click="removeToast(toast.id)">
          <v-icon>mdi-close</v-icon>
        </VButton>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 16px;
  z-index: 9999;
}
</style>
