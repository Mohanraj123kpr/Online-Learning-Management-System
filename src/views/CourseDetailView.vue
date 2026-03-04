<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import { useToast } from '@/composables/useToast'
import LessonList from '@/components/LessonList.vue'
import ReviewSection from '@/components/ReviewSection.vue'

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

function handleEnroll() {
  if (!course.value) return
  coursesStore.enrollInCourse(course.value.id)
  success(`Successfully enrolled in ${course.value.title}! 🎓`)

  setTimeout(() => {
    if (course.value?.modules[0]?.lessons[0]) {
      router.push(`/course/${course.value.id}/lesson/${course.value.modules[0].lessons[0].id}`)
    }
  }, 1000)
}
</script>

<template>
  <v-container fluid>
    <!-- Not Found -->
    <v-row v-if="!course">
      <v-col cols="12">
        <v-card class="text-center pa-12">
          <h2 class="text-h4 mb-4">Course not found</h2>
          <v-btn color="primary" to="/catalog">Browse Courses</v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Course Content -->
    <div v-else>
      <!-- Back Button -->
      <v-btn variant="text" prepend-icon="mdi-chevron-left" to="/catalog" class="mb-4">
        Back to Catalog
      </v-btn>

      <v-row>
        <!-- Main Content -->
        <v-col cols="12" lg="8">
          <!-- Course Header -->
          <v-card class="mb-6">
            <v-img :src="course.thumbnail" height="300" cover />
            <v-card-text>
              <div class="d-flex gap-2 mb-3">
                <v-chip color="primary" size="small">{{ course.category }}</v-chip>
                <v-chip
                  :color="
                    course.level === 'Beginner'
                      ? 'success'
                      : course.level === 'Intermediate'
                        ? 'warning'
                        : 'error'
                  "
                  size="small"
                  variant="outlined"
                >
                  {{ course.level }}
                </v-chip>
              </div>

              <h1 class="text-h3 font-weight-bold mb-3">{{ course.title }}</h1>
              <p class="text-h6 text-medium-emphasis mb-4">{{ course.description }}</p>

              <v-row class="text-body-2">
                <v-col cols="auto">
                  <v-icon size="small" class="mr-1">mdi-star</v-icon>
                  <span class="font-weight-bold">{{ course.rating }}</span>
                </v-col>
                <v-col cols="auto">
                  <v-icon size="small" class="mr-1">mdi-account-group</v-icon>
                  {{ course.studentsEnrolled?.toLocaleString() }} students
                </v-col>
                <v-col cols="auto">
                  <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
                  {{ course.duration }}
                </v-col>
                <v-col cols="auto">
                  <v-icon size="small" class="mr-1">mdi-book-open-variant</v-icon>
                  {{ totalLessons }} lessons
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Instructor -->
          <v-card class="mb-6">
            <v-card-title>Instructor</v-card-title>
            <v-card-text>
              <div class="d-flex align-center gap-4">
                <v-avatar size="64">
                  <v-img v-if="course.instructor?.avatar" :src="course.instructor.avatar" />
                  <span v-else>{{ course.instructor?.name?.[0] || 'I' }}</span>
                </v-avatar>
                <div>
                  <p class="text-h6">{{ course.instructor?.name || course.instructor }}</p>
                  <p class="text-body-2 text-medium-emphasis">Expert Instructor</p>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Curriculum -->
          <v-card class="mb-6">
            <v-card-title>Course Curriculum</v-card-title>
            <v-card-subtitle>
              {{ course.modules.length }} modules • {{ totalLessons }} lessons
            </v-card-subtitle>
            <v-card-text>
              <LessonList :modules="course.modules" :course-id="course.id" />
            </v-card-text>
          </v-card>

          <!-- What You'll Learn -->
          <v-card class="mb-6">
            <v-card-title>What You'll Learn</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <div class="d-flex align-start gap-2 mb-3">
                    <v-icon color="success">mdi-check-circle</v-icon>
                    <span>Master core concepts and best practices</span>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="d-flex align-start gap-2 mb-3">
                    <v-icon color="success">mdi-check-circle</v-icon>
                    <span>Build real-world projects from scratch</span>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="d-flex align-start gap-2 mb-3">
                    <v-icon color="success">mdi-check-circle</v-icon>
                    <span>Get hands-on experience with industry tools</span>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="d-flex align-start gap-2 mb-3">
                    <v-icon color="success">mdi-check-circle</v-icon>
                    <span>Receive certificate upon completion</span>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Reviews -->
          <ReviewSection
            :course-id="course.id"
            :reviews="course.reviews || []"
            :average-rating="course.rating"
            @add-review="handleAddReview"
            @mark-helpful="handleMarkHelpful"
          />
        </v-col>

        <!-- Sidebar -->
        <v-col cols="12" lg="4">
          <v-card class="sticky-top">
            <v-card-text>
              <!-- Enrolled State -->
              <div v-if="course.enrolled">
                <div class="mb-4">
                  <div class="d-flex justify-space-between text-body-2 mb-2">
                    <span>Your Progress</span>
                    <span class="font-weight-bold">{{ course.progress }}%</span>
                  </div>
                  <v-progress-linear
                    :model-value="course.progress"
                    color="primary"
                    height="8"
                    rounded
                  />
                  <p class="text-caption text-medium-emphasis mt-2">
                    {{ completedLessons }} of {{ totalLessons }} lessons completed
                  </p>
                </div>

                <v-btn
                  v-if="firstIncompleteLesson"
                  color="primary"
                  size="large"
                  block
                  prepend-icon="mdi-play"
                  :to="`/course/${course.id}/lesson/${firstIncompleteLesson.id}`"
                >
                  Continue Learning
                </v-btn>
              </div>

              <!-- Not Enrolled State -->
              <div v-else>
                <div class="text-center mb-4">
                  <p class="text-h3 font-weight-bold">${{ course.price || 49.99 }}</p>
                  <p class="text-caption text-medium-emphasis">One-time payment</p>
                </div>

                <v-btn color="primary" size="large" block @click="handleEnroll"> Enroll Now </v-btn>

                <p class="text-center text-caption text-medium-emphasis mt-2">
                  30-day money-back guarantee
                </p>
              </div>

              <v-divider class="my-4" />

              <!-- Course Includes -->
              <div>
                <p class="text-body-2 font-weight-medium mb-3">This course includes:</p>
                <v-list density="compact">
                  <v-list-item prepend-icon="mdi-clock-outline">
                    <v-list-item-title class="text-body-2">
                      {{ course.duration }} on-demand video
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-book-open-variant">
                    <v-list-item-title class="text-body-2">
                      {{ totalLessons }} lessons
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-certificate">
                    <v-list-item-title class="text-body-2">
                      Certificate of completion
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
.sticky-top {
  position: sticky;
  top: 80px;
}
</style>
