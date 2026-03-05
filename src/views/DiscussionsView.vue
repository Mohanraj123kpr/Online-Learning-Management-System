<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDiscussionsStore } from '@/stores/discussions'
import { useCoursesStore } from '@/stores/courses'
import { useUserStore } from '@/stores/user'
import { useToast } from '@/composables/useToast'
import VButton from '@/components/ui/VButton.vue'
import VTextField from '@/components/ui/VTextField.vue'
import type { DiscussionFilter, DiscussionSort } from '@/types/discussion'

const router = useRouter()
const discussionsStore = useDiscussionsStore()
const coursesStore = useCoursesStore()
const userStore = useUserStore()
const { success } = useToast()

const searchQuery = ref('')
const showNewDiscussionDialog = ref(false)

// New discussion form
const newDiscussion = ref({
  title: '',
  content: '',
  category: 'question' as 'question' | 'discussion' | 'announcement',
  courseId: '',
  tags: '',
})

const categoryOptions = [
  { title: 'Question', value: 'question' },
  { title: 'Discussion', value: 'discussion' },
  { title: 'Announcement', value: 'announcement' },
]

const courseOptions = computed(() =>
  coursesStore.courses.map((c) => ({ title: c.title, value: c.id })),
)

const isFormValid = computed(
  () =>
    newDiscussion.value.title.trim() &&
    newDiscussion.value.content.trim() &&
    newDiscussion.value.courseId,
)

function resetForm() {
  newDiscussion.value = {
    title: '',
    content: '',
    category: 'question',
    courseId: '',
    tags: '',
  }
}

function closeDialog() {
  showNewDiscussionDialog.value = false
  resetForm()
}

function handleCreateDiscussion() {
  if (!isFormValid.value) return

  const tags = newDiscussion.value.tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  discussionsStore.createDiscussion({
    courseId: newDiscussion.value.courseId,
    userId: userStore.currentUser.id,
    userName: userStore.currentUser.name,
    userAvatar: userStore.currentUser.avatar,
    title: newDiscussion.value.title,
    content: newDiscussion.value.content,
    category: newDiscussion.value.category,
    tags,
    isResolved: false,
    isPinned: false,
  })

  showNewDiscussionDialog.value = false
  resetForm()
  success('Discussion created! 🎉')
}

const filters: { value: DiscussionFilter; label: string; icon: string }[] = [
  { value: 'all', label: 'All Posts', icon: 'mdi-forum' },
  { value: 'questions', label: 'Questions', icon: 'mdi-help-circle' },
  { value: 'discussions', label: 'Discussions', icon: 'mdi-comment-multiple' },
  { value: 'unresolved', label: 'Unanswered', icon: 'mdi-alert-circle' },
  { value: 'resolved', label: 'Resolved', icon: 'mdi-check-circle' },
  { value: 'my-posts', label: 'My Posts', icon: 'mdi-account' },
]

const sorts: { value: DiscussionSort; label: string }[] = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'unanswered', label: 'Unanswered First' },
]

const displayedDiscussions = computed(() => {
  let discussions = discussionsStore.filteredDiscussions

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    discussions = discussions.filter(
      (d) =>
        d.title.toLowerCase().includes(query) ||
        d.content.toLowerCase().includes(query) ||
        d.tags.some((t) => t.toLowerCase().includes(query)),
    )
  }

  return discussions
})

function handleDiscussionClick(discussionId: string) {
  router.push(`/discussions/${discussionId}`)
}

function handleVote(discussionId: string, value: 1 | -1) {
  discussionsStore.voteDiscussion(discussionId, value)
}

function getCategoryColor(category: string) {
  const colors = {
    question: 'info',
    discussion: 'default',
    announcement: 'warning',
  }
  return colors[category as keyof typeof colors] || 'default'
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}
</script>

<template>
  <v-container fluid>
    <!-- Header -->
    <v-row class="mb-6">
      <v-col>
        <div class="d-flex align-center justify-space-between flex-wrap gap-4">
          <div>
            <h1 class="text-h3 font-weight-bold mb-2">Discussions</h1>
            <p class="text-body-1 text-medium-emphasis">Ask questions and share knowledge</p>
          </div>
          <VButton size="large" prepend-icon="mdi-plus" @click="showNewDiscussionDialog = true">
            New Discussion
          </VButton>
        </div>
      </v-col>
    </v-row>

    <!-- Search and Filters -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <!-- Search -->
            <VTextField
              v-model="searchQuery"
              label="Search discussions"
              prepend-inner-icon="mdi-magnify"
              density="comfortable"
              hide-details
              clearable
              class="mb-4"
            />

            <!-- Filter Chips -->
            <div class="mb-4">
              <p class="text-body-2 font-weight-medium mb-2">Filter:</p>
              <v-chip-group
                :model-value="discussionsStore.currentFilter"
                @update:model-value="discussionsStore.setFilter($event as DiscussionFilter)"
                mandatory
                selected-class="text-primary"
              >
                <v-chip
                  v-for="filter in filters"
                  :key="filter.value"
                  :value="filter.value"
                  :prepend-icon="filter.icon"
                  variant="outlined"
                >
                  {{ filter.label }}
                </v-chip>
              </v-chip-group>
            </div>

            <!-- Sort -->
            <div class="d-flex align-center gap-2">
              <span class="text-body-2 font-weight-medium">Sort by:</span>
              <v-select
                :model-value="discussionsStore.currentSort"
                @update:model-value="discussionsStore.setSort($event as DiscussionSort)"
                :items="sorts"
                item-title="label"
                item-value="value"
                variant="outlined"
                density="compact"
                hide-details
                style="max-width: 200px"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Discussions List -->
    <v-row>
      <v-col cols="12">
        <v-card
          v-for="discussion in displayedDiscussions"
          :key="discussion.id"
          class="mb-4"
          hover
          @click="handleDiscussionClick(discussion.id)"
        >
          <v-card-text>
            <v-row>
              <!-- Vote Section -->
              <v-col cols="auto" class="d-flex flex-column align-center">
                <VButton
                  :icon="true"
                  size="small"
                  variant="text"
                  color="grey-darken-1"
                  @click.stop="handleVote(discussion.id, 1)"
                >
                  <v-icon>mdi-chevron-up</v-icon>
                </VButton>
                <span class="text-h6 font-weight-bold my-1">{{ discussion.votes }}</span>
                <VButton
                  :icon="true"
                  size="small"
                  variant="text"
                  color="grey-darken-1"
                  @click.stop="handleVote(discussion.id, -1)"
                >
                  <v-icon>mdi-chevron-down</v-icon>
                </VButton>
              </v-col>

              <!-- Content -->
              <v-col>
                <!-- Header -->
                <div class="d-flex align-center gap-2 mb-2">
                  <v-chip size="small" :color="getCategoryColor(discussion.category)">
                    {{ discussion.category }}
                  </v-chip>
                  <v-icon v-if="discussion.isPinned" size="small" color="primary"> mdi-pin </v-icon>
                  <v-icon v-if="discussion.isResolved" size="small" color="success">
                    mdi-check-circle
                  </v-icon>
                </div>

                <!-- Title -->
                <h3 class="text-h6 mb-2">{{ discussion.title }}</h3>

                <!-- Content Preview -->
                <p class="text-body-2 text-medium-emphasis mb-3 text-truncate-2">
                  {{ discussion.content }}
                </p>

                <!-- Tags -->
                <div v-if="discussion.tags.length" class="mb-3">
                  <v-chip
                    v-for="tag in discussion.tags"
                    :key="tag"
                    size="small"
                    variant="outlined"
                    class="mr-2"
                  >
                    #{{ tag }}
                  </v-chip>
                </div>

                <!-- Footer -->
                <div
                  class="d-flex align-center justify-space-between text-body-2 text-medium-emphasis"
                >
                  <div class="d-flex align-center gap-4">
                    <div class="d-flex align-center gap-2">
                      <v-avatar size="24">
                        <v-img v-if="discussion.userAvatar" :src="discussion.userAvatar" />
                        <span v-else>{{ discussion.userName[0] }}</span>
                      </v-avatar>
                      <span>{{ discussion.userName }}</span>
                    </div>
                    <span>{{ formatTimeAgo(discussion.createdAt) }}</span>
                  </div>

                  <div class="d-flex align-center gap-4">
                    <div class="d-flex align-center gap-1">
                      <v-icon size="small">mdi-comment</v-icon>
                      <span>{{ discussion.replies.length }}</span>
                    </div>
                    <div class="d-flex align-center gap-1">
                      <v-icon size="small">mdi-eye</v-icon>
                      <span>{{ discussion.views }}</span>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Empty State -->
        <v-card v-if="displayedDiscussions.length === 0" class="text-center pa-12">
          <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-forum-outline</v-icon>
          <h3 class="text-h5 mb-2">No discussions found</h3>
          <p class="text-body-1 text-medium-emphasis mb-4">Be the first to start a discussion!</p>
          <VButton size="large" prepend-icon="mdi-plus" @click="showNewDiscussionDialog = true">
            Start a Discussion
          </VButton>
        </v-card>
      </v-col>
    </v-row>

    <!-- New Discussion Dialog -->
    <v-dialog v-model="showNewDiscussionDialog" max-width="700" persistent>
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between pa-6 pb-2">
          <span class="text-h5 font-weight-bold">New Discussion</span>
          <v-btn icon="mdi-close" variant="text" size="small" @click="closeDialog" />
        </v-card-title>

        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12">
              <VTextField
                v-model="newDiscussion.title"
                label="Title"
                placeholder="What's your question or topic?"
                prepend-inner-icon="mdi-format-title"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                v-model="newDiscussion.category"
                :items="categoryOptions"
                item-title="title"
                item-value="value"
                label="Category"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-tag"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                v-model="newDiscussion.courseId"
                :items="courseOptions"
                item-title="title"
                item-value="value"
                label="Course"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-book-open-variant"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="newDiscussion.content"
                label="Content"
                placeholder="Describe your question or topic in detail..."
                variant="outlined"
                density="comfortable"
                rows="5"
                auto-grow
              />
            </v-col>

            <v-col cols="12">
              <VTextField
                v-model="newDiscussion.tags"
                label="Tags"
                placeholder="e.g. react, javascript, css (comma separated)"
                prepend-inner-icon="mdi-pound"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-6">
          <v-spacer />
          <VButton variant="outlined" color="grey-darken-1" @click="closeDialog"> Cancel </VButton>
          <VButton :disabled="!isFormValid" @click="handleCreateDiscussion">
            Post Discussion
          </VButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
