<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import { useTheme as useVuetifyTheme } from 'vuetify'
import { useUserStore } from '@/stores/user'
import { watch, onMounted } from 'vue'

const route = useRoute()
const userStore = useUserStore()
const vuetifyTheme = useVuetifyTheme()

const showHeader = computed(() => {
  const headerlessRoutes = ['login', 'register']
  return !headerlessRoutes.includes(route.name as string)
})

// Sync user theme preference with Vuetify theme
function syncTheme() {
  // Default to light theme if no user is logged in
  if (!userStore.currentUser) {
    vuetifyTheme.global.name.value = 'light'
    return
  }

  const theme = userStore.currentUser.preferences?.theme || 'light'
  const effectiveTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme
  vuetifyTheme.global.name.value = effectiveTheme
}

onMounted(() => {
  syncTheme()

  // Watch for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', syncTheme)
})

watch(
  () => userStore.currentUser?.preferences?.theme,
  () => syncTheme(),
)
</script>

<template>
  <v-app>
    <AppHeader v-if="showHeader" />
    <v-main>
      <RouterView />
    </v-main>
    <ToastContainer />
  </v-app>
</template>
