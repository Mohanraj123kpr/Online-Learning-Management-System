<script setup lang="ts">
import { ref } from 'vue'
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  ClipboardCheck,
  ChevronDown,
} from 'lucide-vue-next'

interface Lesson {
  id: string
  title: string
  description: string
  duration: number
  type: 'video' | 'reading' | 'quiz'
  completed?: boolean
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

interface Props {
  modules: Module[]
  courseId: string
  currentLessonId?: string
}

const props = defineProps<Props>()

const openModules = ref<string[]>(props.modules.map((m) => m.id))

const toggleModule = (moduleId: string) => {
  const index = openModules.value.indexOf(moduleId)
  if (index > -1) {
    openModules.value.splice(index, 1)
  } else {
    openModules.value.push(moduleId)
  }
}

const getLessonIcon = (type: string, completed?: boolean) => {
  if (completed) return CheckCircle2
  switch (type) {
    case 'video':
      return PlayCircle
    case 'reading':
      return FileText
    case 'quiz':
      return ClipboardCheck
    default:
      return Circle
  }
}
</script>

<template>
  <div class="w-full space-y-2">
    <div v-for="(module, index) in modules" :key="module.id" class="border-b">
      <button
        class="flex w-full items-center justify-between py-4 text-left transition-all hover:underline"
        @click="toggleModule(module.id)"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium"
          >
            {{ index + 1 }}
          </div>
          <span class="font-medium">{{ module.title }}</span>
        </div>
        <ChevronDown
          :class="[
            'size-5 transition-transform',
            openModules.includes(module.id) ? 'rotate-180' : '',
          ]"
        />
      </button>

      <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-screen"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 max-h-screen"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-if="openModules.includes(module.id)" class="ml-11 space-y-1 pb-4">
          <RouterLink
            v-for="lesson in module.lessons"
            :key="lesson.id"
            :to="`/course/${courseId}/lesson/${lesson.id}`"
            :class="[
              'flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50',
              currentLessonId === lesson.id ? 'bg-blue-50' : '',
            ]"
          >
            <component
              :is="getLessonIcon(lesson.type, lesson.completed)"
              :class="['size-5', lesson.completed ? 'text-green-600' : 'text-gray-400']"
            />
            <div class="flex-1">
              <div class="font-medium">{{ lesson.title }}</div>
              <div class="text-sm text-gray-500">{{ lesson.duration }} min • {{ lesson.type }}</div>
            </div>
          </RouterLink>
        </div>
      </Transition>
    </div>
  </div>
</template>
