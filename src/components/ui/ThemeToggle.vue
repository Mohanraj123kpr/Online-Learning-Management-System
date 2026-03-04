<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { Sun, Moon, Monitor } from 'lucide-vue-next'

const userStore = useUserStore()

const currentTheme = computed(() => userStore.currentUser.preferences.theme)

const themes = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
] as const

function setTheme(theme: 'light' | 'dark' | 'system') {
  userStore.updatePreferences({ theme })
}
</script>

<template>
  <div
    class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800"
  >
    <button
      v-for="theme in themes"
      :key="theme.value"
      @click="setTheme(theme.value)"
      :class="[
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        currentTheme === theme.value
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700',
      ]"
      :title="theme.label"
    >
      <component :is="theme.icon" class="size-4" />
      <span class="hidden sm:inline">{{ theme.label }}</span>
    </button>
  </div>
</template>
