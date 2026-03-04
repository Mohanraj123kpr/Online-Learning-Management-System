<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDiscussionsStore } from '@/stores/discussions'
import { useUserStore } from '@/stores/user'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const discussionsStore = useDiscussionsStore()
const userStore = useUserStore()
const { success } = useToast()

const discussionId = route.params.id as string
const replyContent = ref('')

const discussion = computed(() => discussionsStore.getDiscussionById(discussionId))

onMounted(() => {
  if (discussion.value) {
    discussionsStore.incrementViews(discussionId)
  }
})

function handleVote(value: 1 | -1) {
  discussionsStore.voteDiscussion(discussionId, value)
}

function handleReplyVote(replyId: string, value: 1 | -1) {
  discussionsStore.voteReply(discussionId, replyId, value)
}

function handleSubmitReply() {
  if (!replyContent.value.trim()) return

  discussionsStore.addReply(discussionId, {
    discussionId,
    userId: userStore.currentUser.id,
    userName: userStore.currentUser.name,
    userAvatar: userStore.currentUser.avatar,
    content: replyContent.value,
    isInstructorReply: false,
    isBestAnswer: false,
  })

  replyContent.value = ''
  success('Reply posted! 💬')
}

function handleMarkBestAnswer(replyId: string) {
  discussionsStore.markAsBestAnswer(discussionId, replyId)
  success('Marked as best answer! ✅')
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function getCategoryColor(category: string) {
  const colors = {
    question: 'info',
    discussion: 'default',
    announcement: 'warning',
  }
  return colors[category as keyof typeof colors] || 'default'
}
</script>

<template>
  <v-container fluid>
    <!-- Back Button -->
    <v-btn
      variant="text"
      prepend-icon="mdi-chevron-left"
      @click="router.back()"
      class="mb-4"
      color="grey-darken-1"
    >
      Back to Discussions
    </v-btn>

    <!-- Not Found -->
    <v-card v-if="!discussion" class="text-center pa-12">
      <h2 class="text-h4 mb-4">Discussion not found</h2>
      <p class="text-body-1 text-medium-emphasis">
        This discussion may have been deleted or doesn't exist
      </p>
    </v-card>

    <!-- Discussion Content -->
    <div v-else>
      <!-- Main Discussion -->
      <v-card class="mb-6">
        <v-card-text>
          <v-row>
            <!-- Vote Section -->
            <v-col cols="auto" class="d-flex flex-column align-center">
              <v-btn icon size="small" variant="text" color="grey-darken-1" @click="handleVote(1)">
                <v-icon>mdi-chevron-up</v-icon>
              </v-btn>
              <span class="text-h5 font-weight-bold my-2">{{ discussion.votes }}</span>
              <v-btn icon size="small" variant="text" color="grey-darken-1" @click="handleVote(-1)">
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </v-col>

            <!-- Content -->
            <v-col>
              <!-- Header -->
              <div class="d-flex align-center gap-2 mb-3">
                <v-chip size="small" :color="getCategoryColor(discussion.category)">
                  {{ discussion.category }}
                </v-chip>
                <v-chip
                  v-if="discussion.isResolved"
                  size="small"
                  color="success"
                  prepend-icon="mdi-check-circle"
                >
                  Resolved
                </v-chip>
              </div>

              <!-- Title -->
              <h1 class="text-h4 font-weight-bold mb-4">{{ discussion.title }}</h1>

              <!-- Meta -->
              <div class="d-flex align-center gap-4 text-body-2 text-medium-emphasis mb-4">
                <div class="d-flex align-center gap-2">
                  <v-avatar size="32">
                    <v-img v-if="discussion.userAvatar" :src="discussion.userAvatar" />
                    <span v-else>{{ discussion.userName[0] }}</span>
                  </v-avatar>
                  <span class="font-weight-medium">{{ discussion.userName }}</span>
                </div>
                <span>{{ formatDate(discussion.createdAt) }}</span>
                <span>{{ discussion.views }} views</span>
              </div>

              <!-- Content -->
              <p class="text-body-1 mb-4">{{ discussion.content }}</p>

              <!-- Tags -->
              <div v-if="discussion.tags.length" class="d-flex flex-wrap gap-2">
                <v-chip v-for="tag in discussion.tags" :key="tag" size="small" variant="outlined">
                  #{{ tag }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Replies Section -->
      <v-card class="mb-6">
        <v-card-title>
          {{ discussion.replies.length }}
          {{ discussion.replies.length === 1 ? 'Reply' : 'Replies' }}
        </v-card-title>

        <v-card-text>
          <!-- Replies List -->
          <div v-for="reply in discussion.replies" :key="reply.id" class="mb-4">
            <v-card
              :color="reply.isBestAnswer ? 'success-lighten-5' : undefined"
              :variant="reply.isBestAnswer ? 'tonal' : 'outlined'"
            >
              <v-card-text>
                <v-row>
                  <!-- Vote Section -->
                  <v-col cols="auto" class="d-flex flex-column align-center">
                    <v-btn
                      icon
                      size="x-small"
                      variant="text"
                      color="grey-darken-1"
                      @click="handleReplyVote(reply.id, 1)"
                    >
                      <v-icon size="small">mdi-chevron-up</v-icon>
                    </v-btn>
                    <span class="text-body-1 font-weight-bold my-1">{{ reply.votes }}</span>
                    <v-btn
                      icon
                      size="x-small"
                      variant="text"
                      color="grey-darken-1"
                      @click="handleReplyVote(reply.id, -1)"
                    >
                      <v-icon size="small">mdi-chevron-down</v-icon>
                    </v-btn>
                  </v-col>

                  <!-- Content -->
                  <v-col>
                    <!-- Header -->
                    <div class="d-flex align-center justify-space-between mb-2">
                      <div class="d-flex align-center gap-2">
                        <v-avatar size="28">
                          <v-img v-if="reply.userAvatar" :src="reply.userAvatar" />
                          <span v-else>{{ reply.userName[0] }}</span>
                        </v-avatar>
                        <span class="font-weight-medium">{{ reply.userName }}</span>
                        <v-chip v-if="reply.isInstructorReply" size="x-small" color="info">
                          Instructor
                        </v-chip>
                        <v-chip
                          v-if="reply.isBestAnswer"
                          size="x-small"
                          color="success"
                          prepend-icon="mdi-trophy"
                        >
                          Best Answer
                        </v-chip>
                      </div>
                      <span class="text-caption text-medium-emphasis">
                        {{ formatDate(reply.createdAt) }}
                      </span>
                    </div>

                    <!-- Reply Content -->
                    <p class="text-body-1 mb-3">{{ reply.content }}</p>

                    <!-- Actions -->
                    <div v-if="!reply.isBestAnswer && !discussion.isResolved">
                      <v-btn
                        size="small"
                        variant="text"
                        color="primary"
                        @click="handleMarkBestAnswer(reply.id)"
                      >
                        Mark as best answer
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </div>

          <!-- No Replies -->
          <v-alert v-if="discussion.replies.length === 0" type="info" variant="tonal">
            No replies yet. Be the first to reply!
          </v-alert>
        </v-card-text>
      </v-card>

      <!-- Reply Form -->
      <v-card>
        <v-card-title>Your Reply</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="replyContent"
            label="Write your reply..."
            variant="outlined"
            rows="4"
            class="mb-4"
          />
          <v-btn
            color="primary"
            size="large"
            :disabled="!replyContent.trim()"
            @click="handleSubmitReply"
          >
            Post Reply
          </v-btn>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>
