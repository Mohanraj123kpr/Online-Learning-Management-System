<script setup lang="ts">
import { Camera } from 'lucide-vue-next'
import type { User } from '@/types/user'

interface Props {
  user: User
}

defineProps<Props>()

const emit = defineEmits<{
  uploadAvatar: []
}>()
</script>

<template>
  <div class="relative">
    <!-- Cover Image -->
    <div class="h-32 rounded-t-lg bg-gradient-to-r from-blue-500 to-purple-600"></div>

    <!-- Profile Info -->
    <div class="px-6 pb-6">
      <div class="relative -mt-16 mb-4">
        <!-- Avatar -->
        <div class="relative inline-block">
          <img
            v-if="user.avatar"
            :src="user.avatar"
            :alt="user.name"
            class="size-32 rounded-full border-4 border-white object-cover shadow-lg"
          />
          <div
            v-else
            class="flex size-32 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-3xl font-bold text-white shadow-lg"
          >
            {{ user.name[0] }}
          </div>

          <!-- Upload Button -->
          <button
            @click="emit('uploadAvatar')"
            class="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-lg transition-colors hover:bg-gray-100"
          >
            <Camera class="size-5 text-gray-700" />
          </button>
        </div>
      </div>

      <!-- User Info -->
      <div>
        <h1 class="text-2xl font-bold">{{ user.name }}</h1>
        <p v-if="user.title" class="text-gray-600">{{ user.title }}</p>
        <p v-if="user.location" class="mt-1 text-sm text-gray-500">{{ user.location }}</p>
        <p v-if="user.bio" class="mt-3 text-gray-700">{{ user.bio }}</p>
      </div>

      <!-- Stats -->
      <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ user.stats.coursesEnrolled }}</div>
          <div class="text-sm text-gray-600">Courses</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ user.stats.coursesCompleted }}</div>
          <div class="text-sm text-gray-600">Completed</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">{{ user.stats.totalHoursLearned }}</div>
          <div class="text-sm text-gray-600">Hours</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-amber-600">{{ user.stats.certificatesEarned }}</div>
          <div class="text-sm text-gray-600">Certificates</div>
        </div>
      </div>
    </div>
  </div>
</template>
