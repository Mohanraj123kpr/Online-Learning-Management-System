<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import VCourseCard from '@/components/ui/VCourseCard.vue'

const router = useRouter()
const coursesStore = useCoursesStore()

const activeTab = ref('in-progress')

const inProgressCourses = computed(() =>
  coursesStore.enrolledCourses.filter((c) => (c.progress || 0) < 100),
)

const completedCourses = computed(() => coursesStore.completedCourses)

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
    <!-- Header -->
    <v-row class="mb-6">
      <v-col>
        <h1 class="text-h3 font-weight-bold mb-2">My Learning</h1>
        <p class="text-body-1 text-medium-emphasis">Track your progress and continue learning</p>
      </v-col>
    </v-row>

    <!-- Tabs -->
    <v-row>
      <v-col cols="12">
        <v-tabs v-model="activeTab" color="primary">
          <v-tab value="in-progress">
            In Progress
            <v-chip size="small" class="ml-2">{{ inProgressCourses.length }}</v-chip>
          </v-tab>
          <v-tab value="completed">
            Completed
            <v-chip size="small" class="ml-2">{{ completedCourses.length }}</v-chip>
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <!-- Tab Content -->
    <v-window v-model="activeTab">
      <!-- In Progress -->
      <v-window-item value="in-progress">
        <v-row class="mt-4">
          <v-col
            v-for="course in inProgressCourses"
            :key="course.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <VCourseCard
              :course="course"
              :enrolled="true"
              @click="handleCourseClick(course.id)"
              @continue="handleContinue(course.id)"
            />
          </v-col>
        </v-row>

        <!-- Empty State -->
        <v-row v-if="inProgressCourses.length === 0">
          <v-col cols="12">
            <v-card class="text-center pa-12">
              <v-icon size="64" color="grey-lighten-1" class="mb-4"> mdi-book-open-variant </v-icon>
              <h3 class="text-h5 mb-2">No courses in progress</h3>
              <p class="text-body-1 text-medium-emphasis mb-4">
                Start learning by enrolling in a course
              </p>
              <v-btn color="primary" to="/catalog">Browse Courses</v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Completed -->
      <v-window-item value="completed">
        <v-row class="mt-4">
          <v-col v-for="course in completedCourses" :key="course.id" cols="12" sm="6" md="4" lg="3">
            <VCourseCard :course="course" :enrolled="true" @click="handleCourseClick(course.id)" />
          </v-col>
        </v-row>

        <!-- Empty State -->
        <v-row v-if="completedCourses.length === 0">
          <v-col cols="12">
            <v-card class="text-center pa-12">
              <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-certificate</v-icon>
              <h3 class="text-h5 mb-2">No completed courses yet</h3>
              <p class="text-body-1 text-medium-emphasis mb-4">
                Complete your first course to earn a certificate
              </p>
              <v-btn color="primary" to="/my-learning">View In Progress</v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>
  </v-container>
</template>
