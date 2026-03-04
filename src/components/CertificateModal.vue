<script setup lang="ts">
import { X, Download, Award } from 'lucide-vue-next'
import type { Certificate } from '@/types'

interface Props {
  certificate: Certificate
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function downloadCertificate() {
  // In a real app, this would generate and download a PDF
  alert('Certificate download functionality would be implemented here')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="emit('close')"
      >
        <div class="relative w-full max-w-4xl rounded-lg bg-white shadow-xl">
          <!-- Close Button -->
          <button
            @click="emit('close')"
            class="absolute right-4 top-4 z-10 rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <X class="size-5" />
          </button>

          <!-- Certificate Content -->
          <div class="p-8">
            <div
              class="relative overflow-hidden rounded-lg border-8 border-double border-blue-600 bg-gradient-to-br from-blue-50 to-white p-12"
            >
              <!-- Decorative Elements -->
              <div class="absolute left-4 top-4 size-16 rounded-full bg-blue-100 opacity-50"></div>
              <div
                class="absolute bottom-4 right-4 size-20 rounded-full bg-blue-100 opacity-50"
              ></div>

              <!-- Certificate Content -->
              <div class="relative space-y-6 text-center">
                <!-- Icon -->
                <div class="flex justify-center">
                  <div class="rounded-full bg-blue-600 p-4">
                    <Award class="size-12 text-white" />
                  </div>
                </div>

                <!-- Title -->
                <div>
                  <h2 class="mb-2 text-4xl font-bold text-gray-900">Certificate of Completion</h2>
                  <p class="text-gray-600">This certifies that</p>
                </div>

                <!-- Student Name -->
                <div class="py-4">
                  <h3 class="text-3xl font-bold text-blue-600">{{ certificate.studentName }}</h3>
                </div>

                <!-- Course Info -->
                <div class="space-y-2">
                  <p class="text-gray-600">has successfully completed the course</p>
                  <h4 class="text-2xl font-semibold text-gray-900">
                    {{ certificate.courseName }}
                  </h4>
                </div>

                <!-- Date and Instructor -->
                <div class="flex items-center justify-between border-t pt-6">
                  <div class="text-left">
                    <p class="text-sm text-gray-600">Completion Date</p>
                    <p class="font-semibold">{{ formatDate(certificate.completionDate) }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-600">Instructor</p>
                    <p class="font-semibold">{{ certificate.instructor }}</p>
                  </div>
                </div>

                <!-- Certificate ID -->
                <div class="border-t pt-4">
                  <p class="text-xs text-gray-500">Certificate ID: {{ certificate.id }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex justify-center gap-4">
              <button
                @click="downloadCertificate"
                class="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Download class="size-5" />
                Download Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>
