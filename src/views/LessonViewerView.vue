<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import { useToast } from '@/composables/useToast'
import VideoPlayer from '@/components/VideoPlayer.vue'
import QuizComponent from '@/components/QuizComponent.vue'
import NotesPanel from '@/components/NotesPanel.vue'
import CertificateModal from '@/components/CertificateModal.vue'
import { ChevronLeft, ChevronRight, CheckCircle2, Award } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()
const { success } = useToast()

const courseId = route.params.courseId as string
const lessonId = route.params.lessonId as string

const activeTab = ref('lesson')
const videoPlayerRef = ref<InstanceType<typeof VideoPlayer> | null>(null)
const notesPanelRef = ref<InstanceType<typeof NotesPanel> | null>(null)
const showCertificateModal = ref(false)
const earnedCertificate = ref<any>(null)

const course = computed(() => coursesStore.getCourseById(courseId))

const allLessons = computed(() => {
  if (!course.value) return []
  return course.value.modules.flatMap((m) =>
    m.lessons.map((l: any) => ({ ...l, moduleTitle: m.title })),
  )
})

const currentLessonIndex = computed(() => allLessons.value.findIndex((l: any) => l.id === lessonId))

const currentLesson = computed(() => allLessons.value[currentLessonIndex.value])

const previousLesson = computed(() =>
  currentLessonIndex.value > 0 ? allLessons.value[currentLessonIndex.value - 1] : null,
)

const nextLesson = computed(() =>
  currentLessonIndex.value < allLessons.value.length - 1
    ? allLessons.value[currentLessonIndex.value + 1]
    : null,
)

const completedCount = computed(() => allLessons.value.filter((l: any) => l.completed).length)

const progressPercentage = computed(() =>
  Math.round((completedCount.value / allLessons.value.length) * 100),
)

const lessonNotes = computed(() => coursesStore.getNotesByLesson(courseId, lessonId))

const handleMarkComplete = () => {
  coursesStore.updateProgress(courseId, lessonId)
  success('Lesson marked as complete! 🎉')

  // Check if course is now 100% complete
  if (course.value && course.value.progress === 100) {
    const cert = coursesStore.generateCertificate(courseId)
    if (cert) {
      earnedCertificate.value = cert
      showCertificateModal.value = true
      success('Congratulations! You earned a certificate! 🎓')
    }
  }

  setTimeout(() => {
    if (nextLesson.value) {
      router.push(`/course/${courseId}/lesson/${nextLesson.value.id}`)
    } else {
      router.push(`/course/${courseId}`)
    }
  }, 500)
}

const handleQuizComplete = (score: number) => {
  if (score >= 70) {
    handleMarkComplete()
  } else {
    success('Try again to pass the quiz (70% required)')
  }
}

const handleAddNote = (content: string, timestamp: number) => {
  coursesStore.addNote(courseId, lessonId, content, timestamp)
  success('Note added! 📝')
}

const handleDeleteNote = (noteId: string) => {
  coursesStore.deleteNote(noteId)
  success('Note deleted')
}
</script>

<template>
  <!-- Course Not Found -->
  <div v-if="!course" class="flex min-h-[400px] items-center justify-center">
    <div class="text-center">
      <h2 class="text-2xl font-bold">Course not found</h2>
      <RouterLink to="/catalog">
        <button class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Browse Courses
        </button>
      </RouterLink>
    </div>
  </div>

  <!-- Lesson Not Found -->
  <div v-else-if="!currentLesson" class="flex min-h-[400px] items-center justify-center">
    <div class="text-center">
      <h2 class="text-2xl font-bold">Lesson not found</h2>
      <RouterLink :to="`/course/${courseId}`">
        <button class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Back to Course
        </button>
      </RouterLink>
    </div>
  </div>

  <!-- Lesson Content -->
  <div v-else class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <RouterLink :to="`/course/${courseId}`">
        <button
          class="flex items-center gap-2 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <ChevronLeft class="size-4" />
          Back to Course
        </button>
      </RouterLink>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">
          Lesson {{ currentLessonIndex + 1 }} of {{ allLessons.length }}
        </span>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Main Content -->
      <div class="space-y-6 lg:col-span-2">
        <!-- Video/Content Area -->
        <div class="overflow-hidden rounded-lg border bg-white shadow-sm">
          <!-- Video Type -->
          <div v-if="currentLesson.type === 'video' && currentLesson.videoUrl">
            <VideoPlayer ref="videoPlayerRef" :video-url="currentLesson.videoUrl" />
          </div>

          <!-- Reading Type -->
          <div
            v-else-if="currentLesson.type === 'reading'"
            class="flex aspect-video items-center justify-center bg-gray-50 p-8"
          >
            <div class="max-w-2xl text-center">
              <p class="text-lg text-gray-600">Reading material would be displayed here</p>
            </div>
          </div>

          <!-- Quiz Type -->
          <div v-else-if="currentLesson.type === 'quiz'" class="p-8">
            <QuizComponent
              v-if="currentLesson.quizQuestions"
              :questions="currentLesson.quizQuestions"
              @complete="handleQuizComplete"
            />
            <div v-else class="flex aspect-video items-center justify-center bg-gray-50">
              <p class="text-gray-600">No quiz questions available</p>
            </div>
          </div>
        </div>

        <!-- Lesson Details -->
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <div class="mb-4 space-y-2">
            <p class="text-sm text-gray-600">{{ currentLesson.moduleTitle }}</p>
            <h2 class="text-xl font-semibold">{{ currentLesson.title }}</h2>
          </div>

          <!-- Tabs -->
          <div class="w-full">
            <div class="border-b border-gray-200">
              <div class="flex gap-8">
                <button
                  :class="[
                    'border-b-2 px-1 py-4 text-sm font-medium transition-colors',
                    activeTab === 'lesson'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  ]"
                  @click="activeTab = 'lesson'"
                >
                  Overview
                </button>
                <button
                  :class="[
                    'border-b-2 px-1 py-4 text-sm font-medium transition-colors',
                    activeTab === 'notes'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  ]"
                  @click="activeTab = 'notes'"
                >
                  Notes
                </button>
                <button
                  :class="[
                    'border-b-2 px-1 py-4 text-sm font-medium transition-colors',
                    activeTab === 'resources'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  ]"
                  @click="activeTab = 'resources'"
                >
                  Resources
                </button>
              </div>
            </div>

            <!-- Tab Content: Overview -->
            <div v-if="activeTab === 'lesson'" class="mt-4 space-y-4">
              <p class="text-gray-600">{{ currentLesson.description }}</p>
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <span>Duration: {{ currentLesson.duration }} minutes</span>
                <span>•</span>
                <span>Type: {{ currentLesson.type }}</span>
              </div>
            </div>

            <!-- Tab Content: Notes -->
            <div v-if="activeTab === 'notes'" class="mt-4">
              <NotesPanel
                ref="notesPanelRef"
                :course-id="courseId"
                :lesson-id="lessonId"
                :notes="lessonNotes"
                @add-note="handleAddNote"
                @delete-note="handleDeleteNote"
              />
            </div>

            <!-- Tab Content: Resources -->
            <div v-if="activeTab === 'resources'" class="mt-4">
              <div class="space-y-2">
                <p class="text-sm text-gray-600">
                  Downloadable resources and additional materials would be listed here
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex items-center justify-between">
          <RouterLink v-if="previousLesson" :to="`/course/${courseId}/lesson/${previousLesson.id}`">
            <button
              class="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ChevronLeft class="size-4" />
              Previous
            </button>
          </RouterLink>
          <div v-else></div>

          <div class="flex gap-3">
            <button
              v-if="!currentLesson.completed"
              class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              @click="handleMarkComplete"
            >
              Mark as Complete
            </button>
            <RouterLink v-if="nextLesson" :to="`/course/${courseId}/lesson/${nextLesson.id}`">
              <button
                class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Next
                <ChevronRight class="size-4" />
              </button>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Sidebar - Course Progress -->
      <div>
        <div class="sticky top-24 rounded-lg border bg-white shadow-sm">
          <div class="border-b p-6">
            <h3 class="mb-4 text-base font-semibold">Course Progress</h3>
            <div class="space-y-2">
              <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  class="h-full bg-blue-600 transition-all"
                  :style="{ width: `${progressPercentage}%` }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">
                {{ completedCount }} of {{ allLessons.length }} lessons completed
              </p>
            </div>
          </div>
          <div class="max-h-[500px] space-y-2 overflow-y-auto p-4">
            <RouterLink
              v-for="(lesson, index) in allLessons"
              :key="lesson.id"
              :to="`/course/${courseId}/lesson/${lesson.id}`"
              :class="[
                'flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50',
                lesson.id === lessonId ? 'bg-blue-50' : '',
              ]"
            >
              <div class="shrink-0">
                <CheckCircle2 v-if="lesson.completed" class="size-5 text-green-600" />
                <div
                  v-else
                  class="flex size-5 items-center justify-center rounded-full border-2 border-gray-300 text-xs"
                >
                  {{ index + 1 }}
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <p :class="['line-clamp-2 text-sm', lesson.id === lessonId ? 'font-medium' : '']">
                  {{ lesson.title }}
                </p>
                <p class="text-xs text-gray-500">{{ lesson.duration }} min</p>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Certificate Modal -->
    <CertificateModal
      v-if="earnedCertificate"
      :certificate="earnedCertificate"
      :is-open="showCertificateModal"
      @close="showCertificateModal = false"
    />
  </div>
</template>
