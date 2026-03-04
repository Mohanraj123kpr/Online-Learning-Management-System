<script setup lang="ts">
import { computed } from 'vue'
import { useCoursesStore } from '@/stores/courses'
import CourseCard from '@/components/CourseCard.vue'
import ProgressChart from '@/components/ProgressChart.vue'
import { BookOpen, TrendingUp, Award, Clock } from 'lucide-vue-next'

const coursesStore = useCoursesStore()

const enrolledCourses = computed(() => coursesStore.enrolledCourses)

const stats = computed(() => [
  {
    title: 'Courses Enrolled',
    value: enrolledCourses.value.length,
    icon: BookOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Hours Learned',
    value: '24',
    icon: Clock,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Avg. Progress',
    value: `${coursesStore.overallProgress}%`,
    icon: TrendingUp,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Certificates',
    value: coursesStore.completedCourses.length,
    icon: Award,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
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
</script>

<template>
  <div class="space-y-8">
    <!-- Welcome Section -->
    <div>
      <h1 class="text-3xl font-bold">Welcome back!</h1>
      <p class="text-gray-600">Continue your learning journey</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in stats" :key="stat.title" class="rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-center gap-4">
          <div
            :class="[
              'flex size-12 shrink-0 items-center justify-center rounded-full',
              stat.bgColor,
            ]"
          >
            <component :is="stat.icon" :class="['size-6', stat.color]" />
          </div>
          <div>
            <p class="text-sm text-gray-600">{{ stat.title }}</p>
            <p class="text-2xl font-bold">{{ stat.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Chart -->
    <div v-if="enrolledCourses.length > 0" class="rounded-lg border bg-white p-6 shadow-sm">
      <h2 class="mb-4 text-xl font-semibold">Your Progress</h2>
      <ProgressChart :data="progressData" />
    </div>

    <!-- Continue Learning -->
    <div v-if="enrolledCourses.length > 0">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-2xl font-bold">Continue Learning</h2>
        <RouterLink to="/my-learning" class="text-sm text-blue-600 hover:underline">
          View all
        </RouterLink>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CourseCard
          v-for="course in enrolledCourses"
          :key="course.id"
          :course="course"
          :show-progress="true"
        />
      </div>
    </div>

    <!-- Recommended Courses -->
    <div>
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-2xl font-bold">Recommended for You</h2>
        <RouterLink to="/catalog" class="text-sm text-blue-600 hover:underline">
          Browse all
        </RouterLink>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CourseCard v-for="course in recommendedCourses" :key="course.id" :course="course" />
      </div>
    </div>
  </div>
</template>
