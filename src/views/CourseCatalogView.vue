<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockCourses } from '@/data/mockData'
import CourseCard from '@/components/CourseCard.vue'
import { Search } from 'lucide-vue-next'

const searchQuery = ref('')
const categoryFilter = ref('all')
const levelFilter = ref('all')

const categories = computed(() => [
  'all',
  ...Array.from(new Set(mockCourses.map((c) => c.category))),
])
const levels = ['all', 'Beginner', 'Intermediate', 'Advanced']

const filteredCourses = computed(() => {
  return mockCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory =
      categoryFilter.value === 'all' || course.category === categoryFilter.value
    const matchesLevel = levelFilter.value === 'all' || course.level === levelFilter.value

    return matchesSearch && matchesCategory && matchesLevel
  })
})

const clearFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = 'all'
  levelFilter.value = 'all'
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold">Browse Courses</h1>
      <p class="text-gray-600">Explore our wide range of courses</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="relative flex-1 lg:max-w-md">
        <Search class="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search courses..."
          class="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div class="flex gap-4">
        <select
          v-model="categoryFilter"
          class="w-40 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option v-for="category in categories" :key="category" :value="category">
            {{ category === 'all' ? 'All Categories' : category }}
          </option>
        </select>

        <select
          v-model="levelFilter"
          class="w-40 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option v-for="level in levels" :key="level" :value="level">
            {{ level === 'all' ? 'All Levels' : level }}
          </option>
        </select>
      </div>
    </div>

    <!-- Results Count -->
    <div class="text-gray-600">
      {{ filteredCourses.length }} {{ filteredCourses.length === 1 ? 'course' : 'courses' }} found
    </div>

    <!-- Course Grid -->
    <div v-if="filteredCourses.length > 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <CourseCard v-for="course in filteredCourses" :key="course.id" :course="course" />
    </div>

    <!-- No Results -->
    <div v-else class="flex flex-col items-center justify-center py-16">
      <p class="text-lg text-gray-600">No courses found</p>
      <p class="text-sm text-gray-500">Try adjusting your filters</p>
      <button
        class="mt-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        @click="clearFilters"
      >
        Clear Filters
      </button>
    </div>
  </div>
</template>
