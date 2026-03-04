export interface Lesson {
  id: string
  title: string
  description: string
  duration: number
  type: 'video' | 'reading' | 'quiz'
  videoUrl?: string
  content?: string
  completed?: boolean
  quizQuestions?: QuizQuestion[]
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: {
    name: string
    avatar: string
  }
  thumbnail: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  studentsEnrolled: number
  rating: number
  modules: Module[]
  price?: number
  enrolled?: boolean
  progress?: number
  bookmarked?: boolean
  reviews?: Review[]
  currentLesson?: string
}

export interface UserProgress {
  courseId: string
  completedLessons: string[]
  lastAccessedLesson?: string
  progress: number
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface Note {
  id: string
  courseId: string
  lessonId: string
  content: string
  timestamp: number
  createdAt: Date
}

export interface Certificate {
  id: string
  courseId: string
  courseName: string
  studentName: string
  completionDate: Date
  instructor: string
}

export interface Review {
  id: string
  courseId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  createdAt: Date
  helpful: number
}
