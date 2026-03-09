import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useOrganizationStore } from './organization'
import { api } from '@/services/api'
import type { User } from '@/types/user'
import type { Organization, OrgMembership, OrgCourse } from '@/types/organization'

interface LoginCredentials {
  email: string
  password: string
}

interface AuthResponse {
  user: User
  organization?: Organization
  membership?: OrgMembership
  orgCourses?: OrgCourse[]
  token: string
}

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUserStore()
  const orgStore = useOrganizationStore()

  // State
  const isAuthenticated = ref(false)
  const authToken = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const hasOrgContext = computed(() => orgStore.isOrgContext)

  // Actions
  async function login(credentials: LoginCredentials): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      // Call backend API
      const response: any = await api.login(credentials.email, credentials.password)

      // Set auth token
      authToken.value = response.token
      localStorage.setItem('auth_token', response.token)

      // Set authentication state
      isAuthenticated.value = true

      // Load user profile
      await userStore.loadUserProfile()

      // Set organization context if user belongs to one
      if (response.organization && response.membership) {
        orgStore.setOrganization(response.organization, response.membership)

        // Load org courses
        if (response.org_courses) {
          orgStore.setOrgCourses(response.org_courses)
        }

        // Load tenant-specific course data
        const { useCoursesStore } = await import('./courses')
        const coursesStore = useCoursesStore()
        await coursesStore.loadCourses()
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    // Clear auth state
    isAuthenticated.value = false
    authToken.value = null
    localStorage.removeItem('auth_token')

    // Clear courses data
    const { useCoursesStore } = await import('./courses')
    const coursesStore = useCoursesStore()
    coursesStore.clearCourses()

    // Clear user and org context
    orgStore.clearOrganization()
    userStore.clearUser()
  }

  async function restoreSession(): Promise<boolean> {
    const token = localStorage.getItem('auth_token')
    if (!token) return false

    isLoading.value = true
    try {
      authToken.value = token
      isAuthenticated.value = true

      // Load user profile
      await userStore.loadUserProfile()

      // Get organization details
      try {
        const orgData: any = await api.getMyOrganization()
        if (orgData && userStore.currentUser) {
          orgStore.setOrganization(
            {
              id: orgData.id,
              name: orgData.name,
              slug: orgData.slug,
              logo: orgData.logo,
              domain: orgData.domain,
              plan: orgData.plan,
              settings: orgData.settings,
              createdAt: new Date(orgData.created_at),
            },
            {
              id: 'temp',
              userId: userStore.currentUser.id,
              organizationId: orgData.id,
              role: 'learner', // Will be updated from backend
              joinedAt: new Date(),
              active: true,
            },
          )
        }
      } catch (orgErr) {
        console.warn('Could not load organization:', orgErr)
      }

      return true
    } catch (err) {
      // Token invalid, clear it
      localStorage.removeItem('auth_token')
      authToken.value = null
      isAuthenticated.value = false
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function switchOrganization(_orgId: string): Promise<boolean> {
    // For users who belong to multiple orgs
    isLoading.value = true
    try {
      // TODO: Implement backend endpoint for switching orgs
      console.warn('Switch organization not yet implemented on backend')
      return false
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to switch organization'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    isAuthenticated,
    authToken,
    isLoading,
    error,

    // Getters
    hasOrgContext,

    // Actions
    login,
    logout,
    restoreSession,
    switchOrganization,
  }
})
