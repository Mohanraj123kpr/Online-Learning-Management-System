<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import { useTheme } from '@/composables/useTheme'

// Initialize theme - this will apply immediately
useTheme()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <AppHeader />
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
    <ToastContainer />
  </div>
</template>
