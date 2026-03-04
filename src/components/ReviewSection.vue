<script setup lang="ts">
import { ref, computed } from 'vue'
import { Star, ThumbsUp } from 'lucide-vue-next'
import type { Review } from '@/types'

interface Props {
  courseId: string
  reviews: Review[]
  averageRating: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  addReview: [rating: number, comment: string]
  markHelpful: [reviewId: string]
}>()

const showReviewForm = ref(false)
const newRating = ref(0)
const newComment = ref('')
const hoverRating = ref(0)

const sortedReviews = computed(() => {
  return [...props.reviews].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
})

const ratingDistribution = computed(() => {
  const dist = [0, 0, 0, 0, 0]
  props.reviews.forEach((r) => {
    dist[r.rating - 1]++
  })
  return dist.reverse()
})

function submitReview() {
  if (newRating.value > 0 && newComment.value.trim()) {
    emit('addReview', newRating.value, newComment.value.trim())
    newRating.value = 0
    newComment.value = ''
    showReviewForm.value = false
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Rating Overview -->
    <div class="rounded-lg border bg-white p-6 shadow-sm">
      <h3 class="mb-4 text-xl font-semibold">Student Reviews</h3>

      <div class="grid gap-6 md:grid-cols-2">
        <!-- Average Rating -->
        <div class="text-center">
          <div class="mb-2 text-5xl font-bold">{{ averageRating.toFixed(1) }}</div>
          <div class="mb-2 flex justify-center gap-1">
            <Star
              v-for="i in 5"
              :key="i"
              :class="[
                'size-5',
                i <= Math.round(averageRating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300',
              ]"
            />
          </div>
          <p class="text-sm text-gray-600">{{ reviews.length }} reviews</p>
        </div>

        <!-- Rating Distribution -->
        <div class="space-y-2">
          <div
            v-for="(count, index) in ratingDistribution"
            :key="index"
            class="flex items-center gap-2"
          >
            <span class="text-sm">{{ 5 - index }}</span>
            <Star class="size-4 fill-yellow-400 text-yellow-400" />
            <div class="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
              <div
                class="h-full bg-yellow-400"
                :style="{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }"
              ></div>
            </div>
            <span class="w-8 text-sm text-gray-600">{{ count }}</span>
          </div>
        </div>
      </div>

      <!-- Add Review Button -->
      <button
        v-if="!showReviewForm"
        @click="showReviewForm = true"
        class="mt-6 w-full rounded-md border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-blue-600 hover:text-blue-600"
      >
        Write a Review
      </button>

      <!-- Review Form -->
      <div v-else class="mt-6 space-y-4 rounded-lg border bg-gray-50 p-4">
        <div>
          <label class="mb-2 block text-sm font-medium">Your Rating</label>
          <div class="flex gap-2">
            <button
              v-for="i in 5"
              :key="i"
              @click="newRating = i"
              @mouseenter="hoverRating = i"
              @mouseleave="hoverRating = 0"
              class="transition-transform hover:scale-110"
            >
              <Star
                :class="[
                  'size-8',
                  i <= (hoverRating || newRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300',
                ]"
              />
            </button>
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">Your Review</label>
          <textarea
            v-model="newComment"
            placeholder="Share your experience with this course..."
            rows="4"
            class="w-full resize-none rounded-md border p-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          ></textarea>
        </div>

        <div class="flex gap-3">
          <button
            @click="submitReview"
            :disabled="!newRating || !newComment.trim()"
            class="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit Review
          </button>
          <button
            @click="showReviewForm = false"
            class="rounded-md border px-6 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Reviews List -->
    <div class="space-y-4">
      <div
        v-for="review in sortedReviews"
        :key="review.id"
        class="rounded-lg border bg-white p-6 shadow-sm"
      >
        <div class="mb-4 flex items-start justify-between">
          <div class="flex gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-full bg-blue-600 text-white"
            >
              <img
                v-if="review.userAvatar"
                :src="review.userAvatar"
                :alt="review.userName"
                class="size-10 rounded-full object-cover"
              />
              <span v-else class="font-medium">{{ review.userName[0] }}</span>
            </div>
            <div>
              <h4 class="font-semibold">{{ review.userName }}</h4>
              <div class="flex items-center gap-2">
                <div class="flex gap-1">
                  <Star
                    v-for="i in 5"
                    :key="i"
                    :class="[
                      'size-4',
                      i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300',
                    ]"
                  />
                </div>
                <span class="text-sm text-gray-600">{{ formatDate(review.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <p class="mb-4 text-gray-700">{{ review.comment }}</p>

        <button
          @click="emit('markHelpful', review.id)"
          class="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-blue-600"
        >
          <ThumbsUp class="size-4" />
          Helpful ({{ review.helpful }})
        </button>
      </div>
    </div>
  </div>
</template>
