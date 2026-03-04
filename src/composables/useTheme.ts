import { watch } from 'vue'
import { useUserStore } from '@/stores/user'

export function useTheme() {
  const userStore = useUserStore()

  function applyTheme(theme: 'light' | 'dark' | 'system') {
    const root = document.documentElement

    // Remove dark class first
    root.classList.remove('dark')

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        root.classList.add('dark')
      }
    } else if (theme === 'dark') {
      root.classList.add('dark')
    }
    // For 'light' theme, dark class is already removed above
  }

  // Apply theme immediately when composable is called
  const initialTheme = userStore.currentUser.preferences.theme
  applyTheme(initialTheme)

  // Watch for theme preference changes
  watch(
    () => userStore.currentUser.preferences.theme,
    (newTheme) => {
      applyTheme(newTheme)
    },
  )

  // Watch for system theme changes when in system mode
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = () => {
    if (userStore.currentUser.preferences.theme === 'system') {
      applyTheme('system')
    }
  }
  mediaQuery.addEventListener('change', handleSystemThemeChange)

  return {
    applyTheme,
  }
}
