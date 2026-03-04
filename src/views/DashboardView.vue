<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import VCourseCard from '@/components/ui/VCourseCard.vue'
import VStatsCard from '@/components/ui/VStatsCard.vue'
import ProgressChart from '@/components/ProgressChart.vue'

const router = useRouter()
const coursesStore = useCoursesStore()

const enrolledCourses = computed(() => coursesStore.enrolledCourses)

const stats = computed(() => [
  {
    title: 'Courses Enrolled',
    value: enrolledCourses.value.length,
    icon: 'mdi-book-open-variant',
    color: 'primary',
  },
  {
    title: 'Hours Learned',
    value: '24',
    icon: 'mdi-clock-outline',
    color: 'success',
  },
  {
    title: 'Avg. Progress',
    value: `${coursesStore.overallProgress}%`,
    icon: 'mdi-trending-up',
    color: 'secondary',
  },
  {
    title: 'Certificates',
    value: coursesStore.completedCourses.length,
    icon: 'mdi-certificate',
    color: 'warning',
  },
])

const progressData = computed(() =>
  enrolledCourses.value.map((course) => ({
    name: course.title.split(' ').slice(0, 2).join(' '),
    progress: course.progress || 0,
  })),
)

const recommendedCourses = computed(() =>
  coursesStore.courses.filter((c) => !c.enrolled).slice(0, 3),
)

function handleCourseClick(courseId: string) {
  router.push(`/course/${courseId}`)
}

function handleContinue(courseId: string) {
  const course = coursesStore.getCourseById(courseId)
  if (course?.currentLesson) {
    router.push(`/course/${courseId}/lesson/${course.currentLesson}`)
  } else {
    router.push(`/course/${courseId}`)
  }
}
</script>

<template>
  <v-container fluid>
    <!-- Welcome Section -->
    <v-row class="mb-6">
      <v-col>
        <h1 class="text-h3 font-weight-bold mb-2">Welcome back!</h1>
        <p class="text-body-1 text-medium-emphasis">Continue your learning journey</p>
      </v-col>
    </v-row>

    <!-- Stats Grid -->
    <v-row>
      <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" lg="3">
        <VStatsCard :title="stat.title" :value="stat.value" :icon="stat.icon" :color="stat.color" />
      </v-col>
    </v-row>

    <!-- Progress Chart -->
    <v-row v-if="enrolledCourses.length > 0">
      <v-col cols="12">
        <v-card>
          <v-card-title>Your Progress</v-card-title>
          <v-card-text>
            <ProgressChart :data="progressData" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Continue Learning -->
    <v-row v-if="enrolledCourses.length > 0" class="mt-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-h5 font-weight-bold">Continue Learning</h2>
          <v-btn variant="text" color="primary" to="/my-learning">View all</v-btn>
        </div>
      </v-col>
      <v-col v-for="course in enrolledCourses" :key="course.id" cols="12" sm="6" lg="4">
        <VCourseCard
          :course="course"
          :enrolled="true"
          @click="handleCourseClick(course.id)"
          @continue="handleContinue(course.id)"
        />
      </v-col>
    </v-row>

    <!-- Recommended Courses -->
    <v-row class="mt-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-h5 font-weight-bold">Recommended for You</h2>
          <v-btn variant="text" color="primary" to="/catalog">Browse all</v-btn>
        </div>
      </v-col>
      <v-col v-for="course in recommendedCourses" :key="course.id" cols="12" sm="6" lg="4">
        <VCourseCard
          :course="course"
          @click="handleCourseClick(course.id)"
          @enroll="coursesStore.enrollInCourse(course.id)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
