<script setup lang="ts">
import { ref } from 'vue'
import { useCoursesStore } from '@/stores/courses'
import CertificateModal from '@/components/CertificateModal.vue'
import VButton from '@/components/ui/VButton.vue'
import type { Certificate } from '@/types'

const coursesStore = useCoursesStore()
const selectedCertificate = ref<Certificate | null>(null)
const showCertificateModal = ref(false)

function handleViewCertificate(certificate: Certificate) {
  selectedCertificate.value = certificate
  showCertificateModal.value = true
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
  <v-container fluid>
    <!-- Header -->
    <v-row class="mb-6">
      <v-col>
        <h1 class="text-h3 font-weight-bold mb-2">My Certificates</h1>
        <p class="text-body-1 text-medium-emphasis">
          View and download your course completion certificates
        </p>
      </v-col>
    </v-row>

    <!-- Certificates Grid -->
    <v-row v-if="coursesStore.certificates.length > 0">
      <v-col
        v-for="certificate in coursesStore.certificates"
        :key="certificate.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card hover @click="handleViewCertificate(certificate)">
          <div class="certificate-preview pa-6">
            <v-icon size="64" color="warning" class="mb-4">mdi-certificate</v-icon>
            <h3 class="text-h6 font-weight-bold mb-2">{{ certificate.courseName }}</h3>
            <p class="text-body-2 text-medium-emphasis mb-2">
              Completed on {{ formatDate(certificate.completionDate) }}
            </p>
            <p class="text-body-2">
              <v-icon size="small" class="mr-1">mdi-account</v-icon>
              {{ certificate.instructor }}
            </p>
          </div>

          <v-divider />

          <v-card-actions>
            <VButton
              variant="text"
              prepend-icon="mdi-eye"
              @click.stop="handleViewCertificate(certificate)"
            >
              View
            </VButton>
            <VButton variant="text" prepend-icon="mdi-download"> Download </VButton>
            <VButton variant="text" prepend-icon="mdi-share-variant"> Share </VButton>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else>
      <v-col cols="12">
        <v-card class="text-center pa-12">
          <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-certificate-outline</v-icon>
          <h3 class="text-h5 mb-2">No certificates yet</h3>
          <p class="text-body-1 text-medium-emphasis mb-4">
            Complete a course to earn your first certificate
          </p>
          <VButton to="/my-learning">View My Courses</VButton>
        </v-card>
      </v-col>
    </v-row>

    <!-- Certificate Modal -->
    <CertificateModal
      v-if="selectedCertificate"
      :show="showCertificateModal"
      :certificate="selectedCertificate"
      @close="showCertificateModal = false"
    />
  </v-container>
</template>

<style scoped>
.certificate-preview {
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
