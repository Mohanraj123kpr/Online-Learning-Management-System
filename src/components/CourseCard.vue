<script setup lang="ts">
import { computed } from 'vue'
import { BookOpen, Clock, Users, Star } from 'lucide-vue-next'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorImage: string
  thumbnail: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: number
  enrolledStudents: number
  rating: number
  modules: any[]
  price?: number
  enrolled?: boolean
  progress?: number
}

interface Props {
  course: Course
  showProgress?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showProgress: false,
})

const instructorInitial = computed(() => props.course.instructor[0])
</script>

<template>
  <div
    class="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-lg"
  >
    <!-- Thumbnail -->
    <RouterLink :to="`/course/${course.id}`">
      <div class="relative aspect-video overflow-hidden">
        <img
          :src="course.thumbnail"
          :alt="course.title"
          class="size-full object-cover transition-transform hover:scale-105"
        />
        <span
          class="absolute right-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white"
        >
          {{ course.level }}
        </span>
      </div>
    </RouterLink>

    <!-- Content -->
    <div class="p-4 space-y-3">
      <!-- Category and Rating -->
      <div class="flex items-center justify-between">
        <span class="rounded-full border px-3 py-1 text-xs font-medium">
          {{ course.category }}
        </span>
        <div class="flex items-center gap-1">
          <Star class="size-4 fill-yellow-400 text-yellow-400" />
          <span class="text-sm font-medium">{{ course.rating }}</span>
        </div>
      </div>

      <!-- Title -->
      <RouterLink :to="`/course/${course.id}`">
        <h3 class="line-clamp-2 text-lg font-semibold hover:text-blue-600">
          {{ course.title }}
        </h3>
      </RouterLink>

      <!-- Description -->
      <p class="line-clamp-2 text-sm text-gray-600">
        {{ course.description }}
      </p>

      <!-- Instructor -->
      <div class="flex items-center gap-2">
        <div class="flex size-8 items-center justify-center rounded-full bg-gray-200">
          <img
            v-if="course.instructorImage"
            :src="course.instructorImage"
            :alt="course.instructor"
            class="size-8 rounded-full object-cover"
          />
          <span v-else class="text-sm font-medium">{{ instructorInitial }}</span>
        </div>
        <span class="text-sm text-gray-600">{{ course.instructor }}</span>
      </div>

      <!-- Stats -->
      <div class="flex items-center justify-between text-sm text-gray-500">
        <div class="flex items-center gap-1">
          <Clock class="size-4" />
          <span>{{ course.duration }}h</span>
        </div>
        <div class="flex items-center gap-1">
          <Users class="size-4" />
          <span>{{ course.enrolledStudents.toLocaleString() }}</span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div v-if="showProgress && course.enrolled" class="space-y-1">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">Progress</span>
          <span class="font-medium">{{ course.progress }}%</span>
        </div>
        <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            class="h-full bg-blue-600 transition-all"
            :style="{ width: `${course.progress}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Footer Button -->
    <div class="border-t p-4">
      <RouterLink :to="`/course/${course.id}`" class="block">
        <button
          :class="[
            'w-full rounded-md px-4 py-2 text-sm font-medium transition-colors',
            course.enrolled
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
          ]"
        >
          {{ course.enrolled ? 'Continue Learning' : 'View Course' }}
        </button>
      </RouterLink>
    </div>
  </div>
</template>
