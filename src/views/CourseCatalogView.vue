<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import VCourseCard from '@/components/ui/VCourseCard.vue'

const router = useRouter()
const coursesStore = useCoursesStore()

const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedLevel = ref('All')

const categories = computed(() => ['All', ...new Set(coursesStore.courses.map((c) => c.category))])
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']

const filteredCourses = computed(() => {
  return coursesStore.courses.filter((course) => {
    const matchesSearch =
      searchQuery.value === '' ||
      course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesCategory =
      selectedCategory.value === 'All' || course.category === selectedCategory.value

    const matchesLevel = selectedLevel.value === 'All' || course.level === selectedLevel.value

    return matchesSearch && matchesCategory && matchesLevel
  })
})

function handleCourseClick(courseId: string) {
  router.push(`/course/${courseId}`)
}

function handleEnroll(courseId: string) {
  coursesStore.enrollInCourse(courseId)
}
</script>

<template>
  <v-container fluid>
    <!-- Header -->
    <v-row class="mb-6">
      <v-col>
        <h1 class="text-h3 font-weight-bold mb-2">Course Catalog</h1>
        <p class="text-body-1 text-medium-emphasis">
          Explore our wide range of courses and start learning today
        </p>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-row>
              <!-- Search -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchQuery"
                  label="Search courses"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  clearable
                />
              </v-col>

              <!-- Category Filter -->
              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="selectedCategory"
                  :items="categories"
                  label="Category"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                />
              </v-col>

              <!-- Level Filter -->
              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="selectedLevel"
                  :items="levels"
                  label="Level"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Results Count -->
    <v-row>
      <v-col>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Showing {{ filteredCourses.length }} course{{ filteredCourses.length !== 1 ? 's' : '' }}
        </p>
      </v-col>
    </v-row>

    <!-- Courses Grid -->
    <v-row>
      <v-col v-for="course in filteredCourses" :key="course.id" cols="12" sm="6" md="4" lg="3">
        <VCourseCard
          :course="course"
          :enrolled="course.enrolled"
          @click="handleCourseClick(course.id)"
          @enroll="handleEnroll(course.id)"
        />
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-if="filteredCourses.length === 0">
      <v-col cols="12">
        <v-card class="text-center pa-12">
          <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-magnify</v-icon>
          <h3 class="text-h5 mb-2">No courses found</h3>
          <p class="text-body-1 text-medium-emphasis mb-4">Try adjusting your search or filters</p>
          <v-btn
            color="primary"
            @click="
              () => {
                searchQuery = ''
                selectedCategory = 'All'
                selectedLevel = 'All'
              }
            "
          >
            Clear Filters
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
