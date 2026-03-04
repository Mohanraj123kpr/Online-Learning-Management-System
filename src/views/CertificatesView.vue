<script setup lang="ts">
import { ref, computed } from 'vue'
import { Award, Download, Eye } from 'lucide-vue-next'
import { useCoursesStore } from '@/stores/courses'
import CertificateModal from '@/components/CertificateModal.vue'
import type { Certificate } from '@/types'

const coursesStore = useCoursesStore()

const selectedCertificate = ref<Certificate | null>(null)
const showModal = ref(false)

const certificates = computed(() => coursesStore.certificates)

function viewCertificate(cert: Certificate) {
  selectedCertificate.value = cert
  showModal.value = true
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mx-auto max-w-6xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="mb-2 text-3xl font-bold">My Certificates</h1>
        <p class="text-gray-600">View and download your course completion certificates</p>
      </div>

      <!-- Empty State -->
      <div
        v-if="certificates.length === 0"
        class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white py-16"
      >
        <Award class="mb-4 size-16 text-gray-400" />
        <h3 class="mb-2 text-xl font-semibold">No Certificates Yet</h3>
        <p class="text-gray-600">Complete courses to earn certificates</p>
      </div>

      <!-- Certificates Grid -->
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="cert in certificates"
          :key="cert.id"
          class="group overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-lg"
        >
          <!-- Certificate Preview -->
          <div
            class="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6"
          >
            <div class="text-center">
              <Award class="mx-auto mb-3 size-12 text-blue-600" />
              <h3 class="mb-1 text-lg font-semibold">{{ cert.courseName }}</h3>
              <p class="text-sm text-gray-600">Certificate of Completion</p>
            </div>

            <!-- Hover Overlay -->
            <div
              class="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <button
                @click="viewCertificate(cert)"
                class="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
              >
                <Eye class="size-4" />
                View
              </button>
            </div>
          </div>

          <!-- Certificate Info -->
          <div class="p-4">
            <div class="mb-3 space-y-1">
              <p class="text-sm text-gray-600">
                <span class="font-medium">Instructor:</span> {{ cert.instructor }}
              </p>
              <p class="text-sm text-gray-600">
                <span class="font-medium">Completed:</span> {{ formatDate(cert.completionDate) }}
              </p>
            </div>

            <button
              @click="viewCertificate(cert)"
              class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Download class="mr-2 inline size-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Certificate Modal -->
    <CertificateModal
      v-if="selectedCertificate"
      :certificate="selectedCertificate"
      :is-open="showModal"
      @close="showModal = false"
    />
  </div>
</template>
