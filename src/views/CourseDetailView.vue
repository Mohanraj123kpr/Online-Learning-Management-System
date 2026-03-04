<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import { useToast } from '@/composables/useToast'
import LessonList from '@/components/LessonList.vue'
import ReviewSection from '@/components/ReviewSection.vue'
import { Clock, Users, Star, BookOpen, Award, ChevronLeft, Play } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()
const { success } = useToast()

const courseId = route.params.id as string

const course = computed(() => coursesStore.getCourseById(courseId))

const totalLessons = computed(() => {
  if (!course.value) return 0
  return course.value.modules.reduce((sum, m) => sum + m.lessons.length, 0)
})

const completedLessons = computed(() => {
  if (!course.value) return 0
  return course.value.modules.reduce(
    (sum, m) => sum + m.lessons.filter((l: any) => l.completed).length,
    0,
  )
})

const firstIncompleteLesson = computed(() => {
  if (!course.value) return null
  return course.value.modules
    .flatMap((m) => m.lessons.map((l: any) => ({ ...l, moduleId: m.id })))
    .find((l: any) => !l.completed)
})

const activeTab = computed(() => 'curriculum')

function handleAddReview(rating: number, comment: string) {
  if (course.value) {
    coursesStore.addReview(course.value.id, rating, comment)
    success('Review submitted successfully! 🌟')
  }
}

function handleMarkHelpful(reviewId: string) {
  if (course.value) {
    coursesStore.markReviewHelpful(course.value.id, reviewId)
  }
}

function handleEnrollSafely() {
  const currentCourse = course.value
  if (!currentCourse) return

  coursesStore.enrollInCourse(currentCourse.id)
  success(`Successfully enrolled in ${currentCourse.title}! 🎓`)

  // Navigate to first lesson after a short delay
  setTimeout(() => {
    const firstModule = currentCourse.modules[0]
    if (firstModule && firstModule.lessons.length > 0) {
      const firstLesson = firstModule.lessons[0]
      if (firstLesson) {
        router.push(`/course/${currentCourse.id}/lesson/${firstLesson.id}`)
      }
    }
  }, 1000)
}
</script>

<template>
  <div v-if="!course" class="flex min-h-[400px] items-center justify-center">
    <div class="text-center">
      <h2 class="text-2xl font-bold">Course not found</h2>
      <RouterLink to="/catalog">
        <button class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Browse Courses
        </button>
      </RouterLink>
    </div>
  </div>

  <div v-else class="space-y-8">
    <!-- Back Button -->
    <RouterLink to="/catalog">
      <button class="flex items-center gap-2 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100">
        <ChevronLeft class="size-4" />
        Back to Catalog
      </button>
    </RouterLink>

    <!-- Course Header -->
    <div class="grid gap-8 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <div>
          <div class="mb-4 flex items-center gap-3">
            <span class="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
              {{ course.category }}
            </span>
            <span class="rounded-full border px-3 py-1 text-xs font-medium">
              {{ course.level }}
            </span>
          </div>
          <h1 class="mb-3 text-4xl font-bold">{{ course.title }}</h1>
          <p class="text-lg text-gray-600">{{ course.description }}</p>
        </div>

        <div class="flex flex-wrap items-center gap-6 text-gray-600">
          <div class="flex items-center gap-2">
            <Star class="size-5 fill-yellow-400 text-yellow-400" />
            <span class="font-medium">{{ course.rating }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Users class="size-5" />
            <span>{{ course.enrolledStudents.toLocaleString() }} students</span>
          </div>
          <div class="flex items-center gap-2">
            <Clock class="size-5" />
            <span>{{ course.duration }} hours</span>
          </div>
          <div class="flex items-center gap-2">
            <BookOpen class="size-5" />
            <span>{{ totalLessons }} lessons</span>
          </div>
        </div>

        <!-- Instructor -->
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <h3 class="mb-4 text-xl font-semibold">Instructor</h3>
          <div class="flex items-center gap-4">
            <div class="flex size-16 items-center justify-center rounded-full bg-gray-200">
              <img
                v-if="course.instructorImage"
                :src="course.instructorImage"
                :alt="course.instructor"
                class="size-16 rounded-full object-cover"
              />
              <span v-else class="text-xl font-medium">{{ course.instructor[0] }}</span>
            </div>
            <div>
              <p class="text-lg font-medium">{{ course.instructor }}</p>
              <p class="text-gray-600">Expert Instructor</p>
            </div>
          </div>
        </div>

        <!-- Course Curriculum -->
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <h3 class="mb-2 text-xl font-semibold">Course Curriculum</h3>
          <p class="mb-4 text-sm text-gray-600">
            {{ course.modules.length }} modules • {{ totalLessons }} lessons
          </p>
          <LessonList :modules="course.modules" :course-id="course.id" />
        </div>

        <!-- What You'll Learn -->
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <h3 class="mb-4 text-xl font-semibold">What You'll Learn</h3>
          <ul class="grid gap-3 sm:grid-cols-2">
            <li class="flex items-start gap-2">
              <Award class="size-5 shrink-0 text-green-600" />
              <span>Master core concepts and best practices</span>
            </li>
            <li class="flex items-start gap-2">
              <Award class="size-5 shrink-0 text-green-600" />
              <span>Build real-world projects from scratch</span>
            </li>
            <li class="flex items-start gap-2">
              <Award class="size-5 shrink-0 text-green-600" />
              <span>Get hands-on experience with industry tools</span>
            </li>
            <li class="flex items-start gap-2">
              <Award class="size-5 shrink-0 text-green-600" />
              <span>Receive certificate upon completion</span>
            </li>
          </ul>
        </div>

        <!-- Reviews Section -->
        <ReviewSection
          :course-id="course.id"
          :reviews="course.reviews || []"
          :average-rating="course.rating"
          @add-review="handleAddReview"
          @mark-helpful="handleMarkHelpful"
        />
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <div class="sticky top-24 rounded-lg border bg-white shadow-sm">
          <div class="aspect-video overflow-hidden rounded-t-lg">
            <img :src="course.thumbnail" :alt="course.title" class="size-full object-cover" />
          </div>
          <div class="space-y-4 p-6">
            <div v-if="course.enrolled">
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Your Progress</span>
                  <span class="font-medium">{{ course.progress }}%</span>
                </div>
                <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    class="h-full bg-blue-600 transition-all"
                    :style="{ width: `${course.progress}%` }"
                  ></div>
                </div>
                <p class="text-sm text-gray-600">
                  {{ completedLessons }} of {{ totalLessons }} lessons completed
                </p>
              </div>
              <RouterLink
                v-if="firstIncompleteLesson"
                :to="`/course/${course.id}/lesson/${firstIncompleteLesson.id}`"
              >
                <button
                  class="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <Play class="size-4" />
                  Continue Learning
                </button>
              </RouterLink>
            </div>
            <div v-else>
              <div class="text-center">
                <p class="text-3xl font-bold">${{ course.price || 49.99 }}</p>
                <p class="text-sm text-gray-600">One-time payment</p>
              </div>
              <button
                class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                @click="handleEnrollSafely"
              >
                Enroll Now
              </button>
              <p class="text-center text-sm text-gray-600">30-day money-back guarantee</p>
            </div>

            <div class="space-y-3 border-t pt-4">
              <p class="text-sm font-medium">This course includes:</p>
              <ul class="space-y-2 text-sm text-gray-600">
                <li class="flex items-center gap-2">
                  <Clock class="size-4" />
                  {{ course.duration }} hours on-demand video
                </li>
                <li class="flex items-center gap-2">
                  <BookOpen class="size-4" />
                  {{ totalLessons }} lessons
                </li>
                <li class="flex items-center gap-2">
                  <Award class="size-4" />
                  Certificate of completion
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
