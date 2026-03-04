import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, UserPreferences, LearningGoal } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User>({
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?w=200',
    bio: 'Passionate learner and technology enthusiast',
    title: 'Full Stack Developer',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    socialLinks: {
      twitter: 'johndoe',
      linkedin: 'johndoe',
      github: 'johndoe',
    },
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
  })

  const learningGoals = ref<LearningGoal[]>([
    {
      id: 'goal-1',
      title: 'Complete Web Development Bootcamp',
      targetDate: new Date('2024-06-30'),
      progress: 45,
      completed: false,
    },
    {
      id: 'goal-2',
      title: 'Master React & Vue.js',
      targetDate: new Date('2024-08-15'),
      progress: 30,
      completed: false,
    },
  ])

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
  function updateProfile(updates: Partial<User>) {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...updates }
    }
  }

  function updatePreferences(updates: Partial<UserPreferences>) {
    if (currentUser.value) {
      currentUser.value.preferences = { ...currentUser.value.preferences, ...updates }
    }
  }

  function updateAvatar(avatarUrl: string) {
    if (currentUser.value) {
      currentUser.value.avatar = avatarUrl
    }
  }

  function addLearningGoal(goal: Omit<LearningGoal, 'id'>) {
    const newGoal: LearningGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
    }
    learningGoals.value.push(newGoal)
  }

  function updateLearningGoal(goalId: string, updates: Partial<LearningGoal>) {
    const index = learningGoals.value.findIndex((g) => g.id === goalId)
    if (index !== -1) {
      learningGoals.value[index] = {
        ...learningGoals.value[index],
        ...updates,
      } as LearningGoal
    }
  }

  function deleteLearningGoal(goalId: string) {
    const index = learningGoals.value.findIndex((g) => g.id === goalId)
    if (index !== -1) {
      learningGoals.value.splice(index, 1)
    }
  }

  return {
    currentUser,
    learningGoals,
    isAuthenticated,
    userInitials,
    updateProfile,
    updatePreferences,
    updateAvatar,
    addLearningGoal,
    updateLearningGoal,
    deleteLearningGoal,
  }
})
