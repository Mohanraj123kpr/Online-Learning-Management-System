<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useToast } from '@/composables/useToast'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import ProfileEditForm from '@/components/profile/ProfileEditForm.vue'
import SettingsNotifications from '@/components/profile/SettingsNotifications.vue'
import SettingsPreferences from '@/components/profile/SettingsPreferences.vue'
import { User, Settings, Bell, Sliders } from 'lucide-vue-next'
import type { User as UserType, UserPreferences } from '@/types/user'

const userStore = useUserStore()
const { success } = useToast()

const activeTab = ref<'profile' | 'settings'>('profile')
const settingsTab = ref<'notifications' | 'preferences'>('notifications')
const isEditing = ref(false)

function handleUploadAvatar() {
  // In a real app, this would open a file picker
  success('Avatar upload functionality would be implemented here')
}

function handleSaveProfile(updates: Partial<UserType>) {
  userStore.updateProfile(updates)
  isEditing.value = false
  success('Profile updated successfully! ✨')
}

function handleUpdatePreferences(updates: Partial<UserPreferences>) {
  userStore.updatePreferences(updates)
  success('Preferences updated! ⚙️')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
    <div class="mx-auto max-w-6xl">
      <!-- Tabs -->
      <div
        class="mb-6 flex gap-4 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        <button
          @click="activeTab = 'profile'"
          :class="[
            'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
            activeTab === 'profile'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
          ]"
        >
          <User class="size-4" />
          Profile
        </button>
        <button
          @click="activeTab = 'settings'"
          :class="[
            'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
            activeTab === 'settings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
          ]"
        >
          <Settings class="size-4" />
          Settings
        </button>
      </div>

      <!-- Profile Tab -->
      <div v-if="activeTab === 'profile'" class="space-y-6">
        <!-- Profile Header -->
        <BaseCard padding="none">
          <ProfileHeader :user="userStore.currentUser" @upload-avatar="handleUploadAvatar" />
        </BaseCard>

        <!-- Edit Profile -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Profile Information</h3>
              <BaseButton v-if="!isEditing" variant="outline" size="sm" @click="isEditing = true">
                Edit Profile
              </BaseButton>
            </div>
          </template>

          <div v-if="!isEditing" class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                <p class="mt-1 text-gray-900 dark:text-gray-100">
                  {{ userStore.currentUser.email }}
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Title</label>
                <p class="mt-1 text-gray-900 dark:text-gray-100">
                  {{ userStore.currentUser.title || 'Not set' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Location</label>
                <p class="mt-1 text-gray-900 dark:text-gray-100">
                  {{ userStore.currentUser.location || 'Not set' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Website</label>
                <p class="mt-1">
                  <a
                    v-if="userStore.currentUser.website"
                    :href="userStore.currentUser.website"
                    target="_blank"
                    class="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {{ userStore.currentUser.website }}
                  </a>
                  <span v-else class="text-gray-900 dark:text-gray-100">Not set</span>
                </p>
              </div>
            </div>
          </div>

          <ProfileEditForm
            v-else
            :user="userStore.currentUser"
            @save="handleSaveProfile"
            @cancel="isEditing = false"
          />
        </BaseCard>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'" class="space-y-6">
        <!-- Settings Sub-tabs -->
        <div
          class="flex gap-2 rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800"
        >
          <button
            @click="settingsTab = 'notifications'"
            :class="[
              'flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
              settingsTab === 'notifications'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700',
            ]"
          >
            <Bell class="size-4" />
            Notifications
          </button>
          <button
            @click="settingsTab = 'preferences'"
            :class="[
              'flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
              settingsTab === 'preferences'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700',
            ]"
          >
            <Sliders class="size-4" />
            Preferences
          </button>
        </div>

        <!-- Notifications Settings -->
        <SettingsNotifications
          v-if="settingsTab === 'notifications'"
          :preferences="userStore.currentUser.preferences"
          @update="handleUpdatePreferences"
        />

        <!-- Preferences Settings -->
        <SettingsPreferences
          v-if="settingsTab === 'preferences'"
          :preferences="userStore.currentUser.preferences"
          @update="handleUpdatePreferences"
        />
      </div>
    </div>
  </div>
</template>
