<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Trash2, Clock } from 'lucide-vue-next'
import type { Note } from '@/types'

interface Props {
  courseId: string
  lessonId: string
  notes: Note[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  addNote: [content: string, timestamp: number]
  deleteNote: [noteId: string]
}>()

const newNoteContent = ref('')
const currentTimestamp = ref(0)

const lessonNotes = computed(() => {
  return props.notes
    .filter((n) => n.courseId === props.courseId && n.lessonId === props.lessonId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
})

function addNote() {
  if (newNoteContent.value.trim()) {
    emit('addNote', newNoteContent.value.trim(), currentTimestamp.value)
    newNoteContent.value = ''
  }
}

function deleteNote(noteId: string) {
  emit('deleteNote', noteId)
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

defineExpose({
  setCurrentTimestamp: (time: number) => {
    currentTimestamp.value = time
  },
})
</script>

<template>
  <div class="flex h-full flex-col rounded-lg border bg-white shadow-sm">
    <!-- Header -->
    <div class="border-b p-4">
      <h3 class="text-lg font-semibold">Lesson Notes</h3>
      <p class="text-sm text-gray-600">{{ lessonNotes.length }} notes</p>
    </div>

    <!-- Notes List -->
    <div class="flex-1 space-y-3 overflow-y-auto p-4">
      <div
        v-if="lessonNotes.length === 0"
        class="flex h-full items-center justify-center text-center text-gray-500"
      >
        <div>
          <p class="mb-2 text-sm">No notes yet</p>
          <p class="text-xs">Add notes to remember important points</p>
        </div>
      </div>

      <div
        v-for="note in lessonNotes"
        :key="note.id"
        class="group rounded-lg border bg-gray-50 p-3 transition-colors hover:bg-gray-100"
      >
        <div class="mb-2 flex items-start justify-between gap-2">
          <div class="flex items-center gap-2 text-xs text-gray-600">
            <Clock class="size-3" />
            <span>{{ formatTime(note.timestamp) }}</span>
            <span>•</span>
            <span>{{ formatDate(note.createdAt) }}</span>
          </div>
          <button
            @click="deleteNote(note.id)"
            class="opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Trash2 class="size-4 text-red-600 hover:text-red-700" />
          </button>
        </div>
        <p class="text-sm">{{ note.content }}</p>
      </div>
    </div>

    <!-- Add Note Form -->
    <div class="border-t p-4">
      <div class="space-y-2">
        <textarea
          v-model="newNoteContent"
          placeholder="Add a note at current timestamp..."
          rows="3"
          class="w-full resize-none rounded-md border p-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          @keydown.ctrl.enter="addNote"
        ></textarea>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500">Ctrl+Enter to save</span>
          <button
            @click="addNote"
            :disabled="!newNoteContent.trim()"
            class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus class="size-4" />
            Add Note
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
