<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useToast } from '@/composables/useToast'

const userStore = useUserStore()
const { success } = useToast()

const activeTab = ref('profile')

// Profile form
const profileForm = ref({
  name: userStore.currentUser.name,
  email: userStore.currentUser.email,
  bio: userStore.currentUser.bio,
  location: userStore.currentUser.location,
  website: userStore.currentUser.website,
})

// Notification preferences
const notifications = ref({
  email: userStore.currentUser.preferences.emailNotifications,
  push: userStore.currentUser.preferences.pushNotifications,
  sms: false,
  newsletter: userStore.currentUser.preferences.weeklyDigest,
})

// Learning goals
const newGoal = ref('')

function handleSaveProfile() {
  userStore.updateProfile(profileForm.value)
  success('Profile updated successfully! ✅')
}

function handleSaveNotifications() {
  userStore.updatePreferences({
    emailNotifications: notifications.value.email,
    pushNotifications: notifications.value.push,
    weeklyDigest: notifications.value.newsletter,
  })
  success('Notification preferences saved! 🔔')
}

function addGoal() {
  if (!newGoal.value.trim()) return

  userStore.addLearningGoal({
    title: newGoal.value,
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    progress: 0,
    completed: false,
  })

  newGoal.value = ''
  success('Goal added! 🎯')
}

function removeGoal(goalId: string) {
  userStore.deleteLearningGoal(goalId)
  success('Goal removed')
}

function toggleGoalComplete(goalId: string) {
  const goal = userStore.learningGoals.find((g) => g.id === goalId)
  if (goal) {
    userStore.updateLearningGoal(goalId, { completed: !goal.completed })
  }
}
</script>

<template>
  <v-container fluid>
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-text class="pa-6">
            <v-row align="center">
              <v-col cols="12" sm="auto" class="text-center text-sm-left">
                <v-avatar size="80" color="primary">
                  <v-img v-if="userStore.currentUser.avatar" :src="userStore.currentUser.avatar" />
                  <span v-else class="text-h4">{{ userStore.userInitials }}</span>
                </v-avatar>
              </v-col>
              <v-col cols="12" sm class="text-center text-sm-left">
                <h1 class="text-h4 font-weight-bold mb-2">{{ userStore.currentUser.name }}</h1>
                <p class="text-body-1 text-medium-emphasis mb-3">
                  {{ userStore.currentUser.email }}
                </p>
                <div class="d-flex flex-wrap gap-2 justify-center justify-sm-start">
                  <v-chip size="small" prepend-icon="mdi-book-open-variant">
                    {{ userStore.currentUser.stats.coursesEnrolled }} Courses
                  </v-chip>
                  <v-chip size="small" prepend-icon="mdi-certificate">
                    {{ userStore.currentUser.stats.coursesCompleted }} Completed
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabs -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-tabs v-model="activeTab" color="primary" show-arrows>
            <v-tab value="profile">
              <v-icon>mdi-account</v-icon>
              <span class="d-none d-sm-inline ml-2">Profile</span>
            </v-tab>
            <v-tab value="notifications">
              <v-icon>mdi-bell</v-icon>
              <span class="d-none d-sm-inline ml-2">Notifications</span>
            </v-tab>
            <v-tab value="goals">
              <v-icon>mdi-target</v-icon>
              <span class="d-none d-sm-inline ml-2">Learning Goals</span>
            </v-tab>
            <v-tab value="preferences">
              <v-icon>mdi-cog</v-icon>
              <span class="d-none d-sm-inline ml-2">Preferences</span>
            </v-tab>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tab Content -->
    <v-window v-model="activeTab">
      <!-- Profile Tab -->
      <v-window-item value="profile">
        <v-row class="mt-4">
          <v-col cols="12" lg="8">
            <v-card elevation="2">
              <v-card-title class="text-h5 font-weight-bold pa-6 bg-surface">
                Edit Profile
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-6">
                <v-form @submit.prevent="handleSaveProfile">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileForm.name"
                        label="Full Name"
                        prepend-inner-icon="mdi-account"
                        variant="outlined"
                        density="comfortable"
                        hide-details="auto"
                        clearable
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileForm.email"
                        label="Email"
                        type="email"
                        prepend-inner-icon="mdi-email"
                        variant="outlined"
                        density="comfortable"
                        hide-details="auto"
                        clearable
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="profileForm.bio"
                        label="Bio"
                        variant="outlined"
                        rows="3"
                        density="comfortable"
                        hide-details="auto"
                        auto-grow
                        no-resize
                        clearable
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileForm.location"
                        label="Location"
                        prepend-inner-icon="mdi-map-marker"
                        variant="outlined"
                        density="comfortable"
                        hide-details="auto"
                        clearable
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileForm.website"
                        label="Website"
                        prepend-inner-icon="mdi-web"
                        variant="outlined"
                        density="comfortable"
                        hide-details="auto"
                        clearable
                      />
                    </v-col>
                  </v-row>

                  <v-btn
                    type="submit"
                    color="primary"
                    class="mt-6"
                    size="large"
                    elevation="0"
                    @click="handleSaveProfile"
                  >
                    Save Changes
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Notifications Tab -->
      <v-window-item value="notifications">
        <v-row class="mt-4">
          <v-col cols="12" lg="8">
            <v-card>
              <v-card-title>Notification Preferences</v-card-title>
              <v-card-text>
                <v-list lines="two">
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-email</v-icon>
                    </template>
                    <v-list-item-title>Email Notifications</v-list-item-title>
                    <v-list-item-subtitle>Receive updates via email</v-list-item-subtitle>
                    <template v-slot:append>
                      <v-switch v-model="notifications.email" color="primary" hide-details inset />
                    </template>
                  </v-list-item>

                  <v-divider />

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-bell</v-icon>
                    </template>
                    <v-list-item-title>Push Notifications</v-list-item-title>
                    <v-list-item-subtitle>Get notified about course updates</v-list-item-subtitle>
                    <template v-slot:append>
                      <v-switch v-model="notifications.push" color="primary" hide-details inset />
                    </template>
                  </v-list-item>

                  <v-divider />

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-message</v-icon>
                    </template>
                    <v-list-item-title>SMS Notifications</v-list-item-title>
                    <v-list-item-subtitle>Receive important updates via SMS</v-list-item-subtitle>
                    <template v-slot:append>
                      <v-switch v-model="notifications.sms" color="primary" hide-details inset />
                    </template>
                  </v-list-item>

                  <v-divider />

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-newspaper</v-icon>
                    </template>
                    <v-list-item-title>Newsletter</v-list-item-title>
                    <v-list-item-subtitle>Weekly learning tips and updates</v-list-item-subtitle>
                    <template v-slot:append>
                      <v-switch
                        v-model="notifications.newsletter"
                        color="primary"
                        hide-details
                        inset
                      />
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-divider />
              <v-card-actions class="pa-6">
                <v-btn color="primary" class="px-8" height="44" @click="handleSaveNotifications">
                  Save Preferences
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Learning Goals Tab -->
      <v-window-item value="goals">
        <v-row class="mt-4">
          <v-col cols="12" lg="8">
            <v-card class="mb-4">
              <v-card-title>Add New Goal</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="8">
                    <v-text-field
                      v-model="newGoal"
                      label="What do you want to achieve?"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      @keyup.enter="addGoal"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-btn
                      color="primary"
                      block
                      size="large"
                      @click="addGoal"
                      :disabled="!newGoal.trim()"
                    >
                      Add Goal
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-card>
              <v-card-title>Your Learning Goals</v-card-title>
              <v-card-text>
                <v-list v-if="userStore.learningGoals.length > 0" lines="two">
                  <template v-for="(goal, index) in userStore.learningGoals" :key="goal.id">
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-checkbox
                          :model-value="goal.completed"
                          @update:model-value="toggleGoalComplete(goal.id)"
                          color="success"
                          hide-details
                        />
                      </template>
                      <v-list-item-title
                        :class="{
                          'text-decoration-line-through text-medium-emphasis': goal.completed,
                        }"
                      >
                        {{ goal.title }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <v-progress-linear
                          :model-value="goal.progress"
                          color="primary"
                          height="6"
                          rounded
                          class="mt-2"
                        />
                        <span class="text-caption">Progress: {{ goal.progress }}%</span>
                      </v-list-item-subtitle>
                      <template v-slot:append>
                        <v-btn
                          icon
                          variant="text"
                          color="error"
                          size="small"
                          @click="removeGoal(goal.id)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                    </v-list-item>
                    <v-divider v-if="index < userStore.learningGoals.length - 1" />
                  </template>
                </v-list>
                <v-alert v-else type="info" variant="tonal" class="mt-4">
                  No learning goals yet. Add your first goal above!
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Preferences Tab -->
      <v-window-item value="preferences">
        <v-row class="mt-4">
          <v-col cols="12" lg="8">
            <v-card>
              <v-card-title>Display Preferences</v-card-title>
              <v-card-text>
                <v-list lines="two">
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-theme-light-dark</v-icon>
                    </template>
                    <v-list-item-title>Theme</v-list-item-title>
                    <v-list-item-subtitle>Choose your preferred theme</v-list-item-subtitle>
                    <template v-slot:append>
                      <v-chip color="primary" variant="tonal">
                        {{ userStore.currentUser.preferences.theme }}
                      </v-chip>
                    </template>
                  </v-list-item>

                  <v-divider />

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-translate</v-icon>
                    </template>
                    <v-list-item-title>Language</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ userStore.currentUser.preferences.language }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<style scoped>
/* Ensure proper Vuetify styling */
:deep(.v-field__prepend-inner) {
  padding-top: 8px;
}

:deep(.v-field__clearable) {
  padding-top: 8px;
}

/* Fix textarea clear button alignment */
:deep(.v-textarea .v-field__clearable) {
  align-self: flex-start;
  margin-top: 12px;
}

/* Ensure buttons have proper styling */
.v-btn {
  text-transform: none;
  letter-spacing: normal;
}
</style>
