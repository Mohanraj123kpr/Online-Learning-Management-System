import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useOrganizationStore } from './organization'
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
      // TODO: Replace with actual API call
      const response = await mockLogin(credentials)

      // Set auth token
      authToken.value = response.token
      localStorage.setItem('auth_token', response.token)

      // Set user in user store
      userStore.currentUser = response.user
      isAuthenticated.value = true

      // Set organization context if user belongs to one
      if (response.organization && response.membership) {
        orgStore.setOrganization(response.organization, response.membership)

        // Load org courses
        if (response.orgCourses) {
          orgStore.setOrgCourses(response.orgCourses)
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

    // Reset user to guest state
    userStore.currentUser = null as any
  }

  async function restoreSession(): Promise<boolean> {
    const token = localStorage.getItem('auth_token')
    if (!token) return false

    isLoading.value = true
    try {
      // TODO: Replace with actual API call to validate token
      const response = await mockValidateToken(token)

      authToken.value = token
      userStore.currentUser = response.user
      isAuthenticated.value = true

      if (response.organization && response.membership) {
        orgStore.setOrganization(response.organization, response.membership)

        if (response.orgCourses) {
          orgStore.setOrgCourses(response.orgCourses)
        }
      }

      return true
    } catch (err) {
      // Token invalid, clear it
      localStorage.removeItem('auth_token')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function switchOrganization(orgId: string): Promise<boolean> {
    // For users who belong to multiple orgs
    isLoading.value = true
    try {
      // TODO: Replace with actual API call
      const response = await mockSwitchOrg(orgId)

      if (response.organization && response.membership) {
        orgStore.setOrganization(response.organization, response.membership)
        return true
      }
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

// Mock API functions - replace these with actual API calls
async function mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock validation
  if (!credentials.email || !credentials.password) {
    throw new Error('Invalid credentials')
  }

  // Import mock data
  const { mockOrganizations, mockOrgMemberships, mockOrgCourses } =
    await import('@/data/mockOrgData')

  // Determine role based on email
  let role: 'admin' | 'learner' | 'instructor' = 'admin'
  let userId = 'user-1'
  let membershipId = 'mem-1'

  if (credentials.email.includes('learner') || credentials.email.includes('jane')) {
    role = 'learner'
    userId = 'user-2'
    membershipId = 'mem-2'
  } else if (credentials.email.includes('instructor')) {
    role = 'instructor'
    userId = 'user-3'
    membershipId = 'mem-3'
  }

  // Return mock response
  return {
    user: {
      id: userId,
      name: role === 'admin' ? 'John Doe' : role === 'learner' ? 'Jane Smith' : 'Mike Johnson',
      email: credentials.email,
      avatar:
        role === 'admin'
          ? 'https://images.unsplash.com/photo-1629507208649-70919ca33793?w=200'
          : '',
      organizationId: 'org-1',
      orgRole: role,
      department: role === 'admin' ? 'Engineering' : role === 'learner' ? 'Marketing' : 'Training',
      preferences: {
        theme: 'light',
        language: 'en',
        emailNotifications: true,
        pushNotifications: true,
        courseUpdates: true,
        weeklyDigest: true,
        marketingEmails: false,
        autoPlayVideos: true,
        videoQuality: 'auto',
      },
      stats: {
        coursesEnrolled: 5,
        coursesCompleted: 2,
        totalHoursLearned: 48,
        certificatesEarned: 2,
        currentStreak: 7,
        longestStreak: 15,
      },
      createdAt: new Date('2024-01-15'),
    },
    organization: mockOrganizations[0],
    membership: {
      ...mockOrgMemberships.find((m) => m.id === membershipId)!,
      role,
    },
    orgCourses: mockOrgCourses.filter((oc) => oc.organizationId === 'org-1'),
    token: 'mock-jwt-token-' + Date.now(),
  }
}

async function mockValidateToken(token: string): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  // For now, just return the same mock data
  return mockLogin({ email: 'john.doe@acme.com', password: 'mock' })
}

async function mockSwitchOrg(orgId: string): Promise<Partial<AuthResponse>> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Mock switching to a different org
  return {
    organization: {
      id: orgId,
      name: 'Different Corp',
      slug: 'different-corp',
      plan: 'starter',
      settings: {
        maxUsers: 25,
        maxCourses: 10,
        allowSelfEnrollment: false,
        requireApproval: true,
        customBranding: false,
        ssoEnabled: false,
      },
      createdAt: new Date('2024-01-01'),
    },
    membership: {
      id: 'mem-2',
      userId: 'user-1',
      organizationId: orgId,
      role: 'learner',
      joinedAt: new Date('2024-02-01'),
      active: true,
    },
  }
}
