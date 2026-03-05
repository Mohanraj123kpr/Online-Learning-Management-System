import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { mockCourses, mockUserProgress, mockNotes, mockCertificates } from '@/data/mockData'
import type { Course, Note, Certificate, Review } from '@/types'

export const useCoursesStore = defineStore('courses', () => {
  // State
  const courses = ref<Course[]>(mockCourses)
  const userProgress = ref(mockUserProgress)
  const notes = ref<Note[]>(mockNotes)
  const certificates = ref<Certificate[]>(mockCertificates)

  // Getters
  const enrolledCourses = computed(() => courses.value.filter((c) => c.enrolled))

  const completedCourses = computed(() => enrolledCourses.value.filter((c) => c.progress === 100))

  const inProgressCourses = computed(() =>
    enrolledCourses.value.filter((c) => c.progress && c.progress < 100),
  )

  const getCourseById = computed(() => (id: string) => {
    return courses.value.find((c) => c.id === id)
  })

  const overallProgress = computed(() => {
    if (enrolledCourses.value.length === 0) return 0
    return Math.round(
      enrolledCourses.value.reduce((sum, c) => sum + (c.progress || 0), 0) /
        enrolledCourses.value.length,
    )
  })

  // Actions
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
  }

  function deleteNote(noteId: string) {
    const index = notes.value.findIndex((n) => n.id === noteId)
    if (index !== -1) {
      notes.value.splice(index, 1)
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
    }
  }

  function markReviewHelpful(courseId: string, reviewId: string) {
    const course = courses.value.find((c) => c.id === courseId)
    if (course && course.reviews) {
      const review = course.reviews.find((r) => r.id === reviewId)
      if (review) {
        review.helpful++
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
        instructor: course.instructor,
      }
      certificates.value.push(cert)
      return cert
    }
    return null
  }

  return {
    courses,
    userProgress,
    notes,
    certificates,
    enrolledCourses,
    completedCourses,
    inProgressCourses,
    getCourseById,
    overallProgress,
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
