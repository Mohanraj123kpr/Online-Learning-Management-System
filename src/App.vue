<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import { useTheme as useVuetifyTheme } from 'vuetify'
import { useUserStore } from '@/stores/user'
import { watch, onMounted } from 'vue'

const userStore = useUserStore()
const vuetifyTheme = useVuetifyTheme()

// Sync user theme preference with Vuetify theme
function syncTheme() {
  const theme = userStore.currentUser.preferences.theme
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
  () => userStore.currentUser.preferences.theme,
  () => syncTheme(),
)
</script>

<template>
  <v-app>
    <AppHeader />
    <v-main>
      <RouterView />
    </v-main>
    <ToastContainer />
  </v-app>
</template>
