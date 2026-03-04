<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockCourses } from '@/data/mockData'
import CourseCard from '@/components/CourseCard.vue'

const activeTab = ref('all')

const enrolledCourses = computed(() => mockCourses.filter((c) => c.enrolled))
const completedCourses = computed(() => enrolledCourses.value.filter((c) => c.progress === 100))
const inProgressCourses = computed(() =>
  enrolledCourses.value.filter((c) => c.progress && c.progress < 100),
)

const overallProgress = computed(() => {
  if (enrolledCourses.value.length === 0) return 0
  return Math.round(
    enrolledCourses.value.reduce((sum, c) => sum + (c.progress || 0), 0) /
      enrolledCourses.value.length,
  )
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold">My Learning</h1>
      <p class="text-gray-600">Track your progress and continue learning</p>
    </div>

    <!-- Overall Progress -->
    <div v-if="enrolledCourses.length > 0" class="rounded-lg border bg-white p-6 shadow-sm">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold">Overall Progress</h3>
            <p class="text-sm text-gray-600">
              {{ enrolledCourses.length }}
              {{ enrolledCourses.length === 1 ? 'course' : 'courses' }} enrolled
            </p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold">{{ overallProgress }}%</p>
            <p class="text-sm text-gray-600">Complete</p>
          </div>
        </div>
        <div class="h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            class="h-full bg-blue-600 transition-all"
            :style="{ width: `${overallProgress}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Course Tabs -->
    <div class="w-full">
      <!-- Tab List -->
      <div class="border-b border-gray-200">
        <div class="flex gap-8">
          <button
            :class="[
              'border-b-2 px-1 py-4 text-sm font-medium transition-colors',
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            ]"
            @click="activeTab = 'all'"
          >
            All Courses ({{ enrolledCourses.length }})
          </button>
          <button
            :class="[
              'border-b-2 px-1 py-4 text-sm font-medium transition-colors',
              activeTab === 'in-progress'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            ]"
            @click="activeTab = 'in-progress'"
          >
            In Progress ({{ inProgressCourses.length }})
          </button>
          <button
            :class="[
              'border-b-2 px-1 py-4 text-sm font-medium transition-colors',
              activeTab === 'completed'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            ]"
            @click="activeTab = 'completed'"
          >
            Completed ({{ completedCourses.length }})
          </button>
        </div>
      </div>

      <!-- Tab Content: All Courses -->
      <div v-if="activeTab === 'all'" class="mt-6">
        <div v-if="enrolledCourses.length > 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CourseCard
            v-for="course in enrolledCourses"
            :key="course.id"
            :course="course"
            :show-progress="true"
          />
        </div>
        <div v-else class="flex flex-col items-center justify-center py-16">
          <p class="text-lg text-gray-600">No enrolled courses yet</p>
          <p class="text-sm text-gray-500">Start learning by browsing our catalog</p>
        </div>
      </div>

      <!-- Tab Content: In Progress -->
      <div v-if="activeTab === 'in-progress'" class="mt-6">
        <div v-if="inProgressCourses.length > 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CourseCard
            v-for="course in inProgressCourses"
            :key="course.id"
            :course="course"
            :show-progress="true"
          />
        </div>
        <div v-else class="flex flex-col items-center justify-center py-16">
          <p class="text-lg text-gray-600">No courses in progress</p>
        </div>
      </div>

      <!-- Tab Content: Completed -->
      <div v-if="activeTab === 'completed'" class="mt-6">
        <div v-if="completedCourses.length > 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CourseCard
            v-for="course in completedCourses"
            :key="course.id"
            :course="course"
            :show-progress="true"
          />
        </div>
        <div v-else class="flex flex-col items-center justify-center py-16">
          <p class="text-lg text-gray-600">No completed courses yet</p>
          <p class="text-sm text-gray-500">Keep learning to earn certificates</p>
        </div>
      </div>
    </div>
  </div>
</template>
