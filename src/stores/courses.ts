import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/services/api'
import type { Course, Note, Certificate, Review, UserProgress } from '@/types'
import { useOrganizationStore } from './organization'

export const useCoursesStore = defineStore('courses', () => {
  const orgStore = useOrganizationStore()

  // State - all data comes from backend based on tenant
  const courses = ref<Course[]>([])
  const userProgress = ref<UserProgress[]>([])
  const notes = ref<Note[]>([])
  const certificates = ref<Certificate[]>([])
  const isLoading = ref(false)

  // Getters - no filtering needed, backend returns only tenant's data
  const enrolledCourses = computed(() => courses.value.filter((c) => c.enrolled))

  const completedCourses = computed(() => enrolledCourses.value.filter((c) => c.progress === 100))

  const inProgressCourses = computed(() =>
    enrolledCourses.value.filter((c) => c.progress && c.progress < 100),
  )

  const getCourseById = computed(() => (id: string) => {
    return courses.value.find((c) => c.id === id)
  })

  // Get mandatory courses with metadata from org store
  const mandatoryCourses = computed(() => {
    if (!orgStore.isOrgContext) return []

    return orgStore.mandatoryCourses
      .map((oc) => {
        const course = courses.value.find((c) => c.id === oc.courseId)
        if (!course) return null

        return {
          ...course,
          dueDate: oc.dueDate,
          mandatory: true,
        }
      })
      .filter(Boolean)
  })

  const overallProgress = computed(() => {
    if (enrolledCourses.value.length === 0) return 0
    return Math.round(
      enrolledCourses.value.reduce((sum, c) => sum + (c.progress || 0), 0) /
        enrolledCourses.value.length,
    )
  })

  // Actions - all interact with backend
  async function loadCourses() {
    if (!orgStore.currentOrg) return

    isLoading.value = true
    try {
      // Call backend API
      const data = await api.getCourses()

      // Backend might return array directly or object with courses property
      if (Array.isArray(data)) {
        courses.value = data
      } else {
        courses.value = data.courses || []
        userProgress.value = data.userProgress || []
        notes.value = data.notes || []
        certificates.value = data.certificates || []
      }
    } catch (error) {
      console.error('Failed to load courses:', error)
      // Fallback to mock data for development
      const mockData = await import('@/data/mockData')
      courses.value = mockData.mockCourses.filter(
        (c) => c.organizationId === orgStore.currentOrg?.id,
      )
      userProgress.value = mockData.mockUserProgress
      notes.value = mockData.mockNotes
      certificates.value = mockData.mockCertificates
    } finally {
      isLoading.value = false
    }
  }

  function clearCourses() {
    courses.value = []
    userProgress.value = []
    notes.value = []
    certificates.value = []
  }

  function enrollInCourse(courseId: string) {
    const course = courses.value.find((c) => c.id === courseId)
    if (course) {
      course.enrolled = true
      course.progress = 0
      userProgress.value.push({
        courseId,
        completedLessons: [],
        progress: 0,
      })

      // Call backend API
      api.enrollInCourse(courseId).catch((error) => {
        console.error('Failed to enroll in course:', error)
        // Revert on error
        course.enrolled = false
        const index = userProgress.value.findIndex((p) => p.courseId === courseId)
        if (index !== -1) {
          userProgress.value.splice(index, 1)
        }
      })
    }
  }

  function updateProgress(courseId: string, lessonId: string) {
    const course = courses.value.find((c) => c.id === courseId)
    if (!course) return

    const progress = userProgress.value.find((p) => p.courseId === courseId)
    if (!progress) return

    // Mark lesson as completed
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId)
    }

    // Calculate progress percentage
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
    const completedCount = progress.completedLessons.length
    progress.progress = Math.round((completedCount / totalLessons) * 100)
    course.progress = progress.progress

    // Mark lesson as completed in course data
    course.modules.forEach((module) => {
      module.lessons.forEach((lesson: any) => {
        if (lesson.id === lessonId) {
          lesson.completed = true
        }
      })
    })

    // Call backend API
    api.updateCourseProgress(courseId, lessonId, progress.progress).catch((error) => {
      console.error('Failed to update progress:', error)
    })
  }

  function isLessonCompleted(courseId: string, lessonId: string): boolean {
    const progress = userProgress.value.find((p) => p.courseId === courseId)
    return progress ? progress.completedLessons.includes(lessonId) : false
  }

  // Video Progress Actions
  function saveVideoTimestamp(courseId: string, lessonId: string, timestamp: number) {
    const progress = userProgress.value.find((p) => p.courseId === courseId)
    if (progress) {
      if (!progress.videoTimestamps) {
        progress.videoTimestamps = {}
      }
      progress.videoTimestamps[lessonId] = timestamp
      progress.lastAccessedLesson = lessonId

      // TODO: Call backend API to persist timestamp
    }
  }

  function getVideoTimestamp(courseId: string, lessonId: string): number {
    const progress = userProgress.value.find((p) => p.courseId === courseId)
    return progress?.videoTimestamps?.[lessonId] ?? 0
  }

  // Notes Actions
  function addNote(courseId: string, lessonId: string, content: string, timestamp: number) {
    const note: Note = {
      id: `note-${Date.now()}`,
      courseId,
      lessonId,
      content,
      timestamp,
      createdAt: new Date(),
    }
    notes.value.push(note)

    // TODO: Call backend API to persist note
  }

  function deleteNote(noteId: string) {
    const index = notes.value.findIndex((n) => n.id === noteId)
    if (index !== -1) {
      notes.value.splice(index, 1)

      // TODO: Call backend API to delete note
    }
  }

  function getNotesByLesson(courseId: string, lessonId: string) {
    return notes.value.filter((n) => n.courseId === courseId && n.lessonId === lessonId)
  }

  // Bookmark Actions
  function toggleBookmark(courseId: string) {
    const course = courses.value.find((c) => c.id === courseId)
    if (course) {
      course.bookmarked = !course.bookmarked

      // TODO: Call backend API to persist bookmark
    }
  }

  // Review Actions
  function addReview(courseId: string, rating: number, comment: string) {
    const course = courses.value.find((c) => c.id === courseId)
    if (course) {
      if (!course.reviews) {
        course.reviews = []
      }
      const review: Review = {
        id: `review-${Date.now()}`,
        courseId,
        userId: 'current-user',
        userName: 'Current User',
        rating,
        comment,
        createdAt: new Date(),
        helpful: 0,
      }
      course.reviews.push(review)

      // Recalculate average rating
      const avgRating = course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
      course.rating = Math.round(avgRating * 10) / 10

      // TODO: Call backend API to persist review
    }
  }

  function markReviewHelpful(courseId: string, reviewId: string) {
    const course = courses.value.find((c) => c.id === courseId)
    if (course && course.reviews) {
      const review = course.reviews.find((r) => r.id === reviewId)
      if (review) {
        review.helpful++

        // TODO: Call backend API to persist helpful count
      }
    }
  }

  // Certificate Actions
  function generateCertificate(courseId: string) {
    const course = courses.value.find((c) => c.id === courseId)
    if (course && course.progress === 100) {
      const cert: Certificate = {
        id: `cert-${Date.now()}`,
        courseId,
        courseName: course.title,
        studentName: 'Current User',
        completionDate: new Date(),
        instructor: course.instructor.name,
      }
      certificates.value.push(cert)

      // TODO: Call backend API to generate certificate
      return cert
    }
    return null
  }

  return {
    courses,
    userProgress,
    notes,
    certificates,
    isLoading,
    enrolledCourses,
    completedCourses,
    inProgressCourses,
    mandatoryCourses,
    getCourseById,
    overallProgress,
    loadCourses,
    clearCourses,
    enrollInCourse,
    updateProgress,
    isLessonCompleted,
    saveVideoTimestamp,
    getVideoTimestamp,
    addNote,
    deleteNote,
    getNotesByLesson,
    toggleBookmark,
    addReview,
    markReviewHelpful,
    generateCertificate,
  }
})
