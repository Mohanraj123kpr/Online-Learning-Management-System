<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const themeIcon = computed(() => {
  const theme = userStore.currentUser?.preferences?.theme || 'light'
  return theme === 'dark'
    ? 'mdi-weather-night'
    : theme === 'light'
      ? 'mdi-weather-sunny'
      : 'mdi-theme-light-dark'
})

const currentTheme = computed(() => {
  return userStore.currentUser?.preferences?.theme || 'light'
})

const themeOptions = [
  { title: 'Light', value: 'light', icon: 'mdi-weather-sunny' },
  { title: 'Dark', value: 'dark', icon: 'mdi-weather-night' },
  { title: 'System', value: 'system', icon: 'mdi-theme-light-dark' },
]

function setTheme(theme: 'light' | 'dark' | 'system') {
  if (userStore.currentUser) {
    userStore.updatePreferences({ theme })
  }
}
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn :icon="themeIcon" variant="text" size="small" v-bind="props" />
    </template>
    <v-list density="compact">
      <v-list-item
        v-for="option in themeOptions"
        :key="option.value"
        :prepend-icon="option.icon"
        :title="option.title"
        :active="currentTheme === option.value"
        @click="setTheme(option.value as 'light' | 'dark' | 'system')"
      />
    </v-list>
  </v-menu>
</template>
