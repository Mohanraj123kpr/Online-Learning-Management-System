import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/services/api'
import type { User, UserPreferences, LearningGoal } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // State - loaded from backend
  const currentUser = ref<User | null>(null)
  const learningGoals = ref<LearningGoal[]>([])
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!currentUser.value)
  const userInitials = computed(() => {
    if (!currentUser.value) return ''
    return currentUser.value.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  })

  // Actions
  async function loadUserProfile() {
    isLoading.value = true
    try {
      const data: any = await api.getCurrentUser()
      currentUser.value = {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar || undefined,
        bio: data.bio || '',
        title: data.title || '',
        location: data.location || '',
        website: data.website || '',
        socialLinks: data.social_links || {},
        preferences: {
          theme: data.preferences?.theme || 'light',
          language: data.preferences?.language || 'en',
          emailNotifications: data.preferences?.emailNotifications ?? true,
          pushNotifications: data.preferences?.pushNotifications ?? true,
          courseUpdates: data.preferences?.courseUpdates ?? true,
          weeklyDigest: data.preferences?.weeklyDigest ?? true,
          marketingEmails: data.preferences?.marketingEmails ?? false,
          autoPlayVideos: data.preferences?.autoPlayVideos ?? true,
          videoQuality: data.preferences?.videoQuality || 'auto',
        },
        stats: {
          coursesEnrolled: data.stats?.coursesEnrolled || 0,
          coursesCompleted: data.stats?.coursesCompleted || 0,
          totalHoursLearned: data.stats?.totalHoursLearned || 0,
          certificatesEarned: data.stats?.certificatesEarned || 0,
          currentStreak: data.stats?.currentStreak || 0,
          longestStreak: data.stats?.longestStreak || 0,
        },
        createdAt: new Date(data.created_at),
      }
    } catch (error) {
      console.error('Failed to load user profile:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function updateProfile(updates: Partial<User>) {
    if (!currentUser.value) return

    isLoading.value = true
    try {
      const data: any = await api.updateUserProfile({
        name: updates.name,
        avatar: updates.avatar,
        bio: updates.bio,
        title: updates.title,
        location: updates.location,
        website: updates.website,
        social_links: updates.socialLinks,
      })

      // Update local state
      currentUser.value = {
        ...currentUser.value,
        name: data.name,
        email: data.email,
        avatar: data.avatar || undefined,
        bio: data.bio || '',
        title: data.title || '',
        location: data.location || '',
        website: data.website || '',
        socialLinks: data.social_links || {},
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function updatePreferences(updates: Partial<UserPreferences>) {
    if (!currentUser.value) return

    isLoading.value = true
    try {
      const response: any = await api.updateUserPreferences(updates)

      // Update local state
      currentUser.value.preferences = {
        ...currentUser.value.preferences,
        ...response.preferences,
      }
    } catch (error) {
      console.error('Failed to update preferences:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  function updateAvatar(avatarUrl: string) {
    if (currentUser.value) {
      currentUser.value.avatar = avatarUrl
      // Call updateProfile to persist
      updateProfile({ avatar: avatarUrl })
    }
  }

  function addLearningGoal(goal: Omit<LearningGoal, 'id'>) {
    const newGoal: LearningGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
    }
    learningGoals.value.push(newGoal)

    // TODO: Call backend API to persist goal
  }

  function updateLearningGoal(goalId: string, updates: Partial<LearningGoal>) {
    const index = learningGoals.value.findIndex((g) => g.id === goalId)
    if (index !== -1) {
      learningGoals.value[index] = {
        ...learningGoals.value[index],
        ...updates,
      } as LearningGoal

      // TODO: Call backend API to update goal
    }
  }

  function deleteLearningGoal(goalId: string) {
    const index = learningGoals.value.findIndex((g) => g.id === goalId)
    if (index !== -1) {
      learningGoals.value.splice(index, 1)

      // TODO: Call backend API to delete goal
    }
  }

  function clearUser() {
    currentUser.value = null
    learningGoals.value = []
  }

  return {
    currentUser,
    learningGoals,
    isAuthenticated,
    userInitials,
    isLoading,
    loadUserProfile,
    updateProfile,
    updatePreferences,
    updateAvatar,
    addLearningGoal,
    updateLearningGoal,
    deleteLearningGoal,
    clearUser,
  }
})
