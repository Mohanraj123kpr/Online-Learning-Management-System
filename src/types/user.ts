export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  title?: string
  location?: string
  website?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
  }
  preferences: UserPreferences
  stats: UserStats
  createdAt: Date
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  emailNotifications: boolean
  pushNotifications: boolean
  courseUpdates: boolean
  weeklyDigest: boolean
  marketingEmails: boolean
  autoPlayVideos: boolean
  videoQuality: 'auto' | '720p' | '1080p'
}

export interface UserStats {
  coursesEnrolled: number
  coursesCompleted: number
  totalHoursLearned: number
  certificatesEarned: number
  currentStreak: number
  longestStreak: number
}

export interface LearningGoal {
  id: string
  title: string
  targetDate: Date
  progress: number
  completed: boolean
}
