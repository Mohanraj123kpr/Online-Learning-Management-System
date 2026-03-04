<script setup lang="ts">
import type { Course } from '@/types'
import VButton from '@/components/ui/VButton.vue'

interface Props {
  course: Course
  enrolled?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  click: []
  enroll: []
  continue: []
}>()
</script>

<template>
  <v-card hover @click="emit('click')" class="h-100">
    <v-img :src="course.thumbnail" height="200" cover>
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="primary" />
        </v-row>
      </template>
    </v-img>

    <v-card-text>
      <div class="d-flex align-center mb-2">
        <v-chip size="small" color="primary" variant="flat" class="mr-2">
          {{ course.category }}
        </v-chip>
        <v-chip
          size="small"
          :color="
            course.level === 'Beginner'
              ? 'success'
              : course.level === 'Intermediate'
                ? 'warning'
                : 'error'
          "
          variant="outlined"
        >
          {{ course.level }}
        </v-chip>
      </div>

      <h3 class="text-h6 mb-2">{{ course.title }}</h3>
      <p class="text-body-2 text-medium-emphasis mb-3">{{ course.description }}</p>

      <div class="d-flex align-center mb-2">
        <v-avatar size="24" class="mr-2">
          <v-img :src="course.instructor.avatar" />
        </v-avatar>
        <span class="text-body-2">{{ course.instructor.name }}</span>
      </div>

      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon size="small" class="mr-1">mdi-star</v-icon>
          <span class="text-body-2 font-weight-bold mr-1">{{ course.rating }}</span>
          <span class="text-body-2 text-medium-emphasis">({{ course.studentsEnrolled }})</span>
        </div>
        <div class="d-flex align-center text-body-2 text-medium-emphasis">
          <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
          {{ course.duration }}
        </div>
      </div>

      <v-progress-linear
        v-if="enrolled && course.progress !== undefined"
        :model-value="course.progress"
        color="primary"
        height="6"
        rounded
        class="mt-3"
      />
    </v-card-text>

    <v-card-actions>
      <VButton v-if="!enrolled" variant="flat" block @click.stop="emit('enroll')">
        Enroll Now
      </VButton>
      <VButton v-else variant="flat" block @click.stop="emit('continue')">
        Continue Learning
      </VButton>
    </v-card-actions>
  </v-card>
</template>
