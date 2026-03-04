<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import type { UserPreferences } from '@/types/user'

interface Props {
  preferences: UserPreferences
}

defineProps<Props>()

const emit = defineEmits<{
  update: [updates: Partial<UserPreferences>]
}>()

function updatePreference(key: keyof UserPreferences, value: any) {
  emit('update', { [key]: value })
}
</script>

<template>
  <BaseCard title="Learning Preferences" subtitle="Customize your learning experience">
    <div class="space-y-6">
      <!-- Video Settings -->
      <div class="space-y-4">
        <h4 class="font-medium text-gray-900 dark:text-white">Video Settings</h4>

        <BaseSwitch
          :model-value="preferences.autoPlayVideos"
          @update:model-value="updatePreference('autoPlayVideos', $event)"
          label="Auto-play Videos"
          description="Automatically play the next video in a course"
        />

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Video Quality</label>
          <select
            :value="preferences.videoQuality"
            @change="updatePreference('videoQuality', ($event.target as HTMLSelectElement).value)"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="auto">Auto</option>
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
          </select>
        </div>
      </div>

      <!-- Language & Theme -->
      <div class="space-y-4 border-t border-gray-200 pt-6 dark:border-gray-700">
        <h4 class="font-medium text-gray-900 dark:text-white">Appearance</h4>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
          <ThemeToggle />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
          <select
            :value="preferences.language"
            @change="updatePreference('language', ($event.target as HTMLSelectElement).value)"
            class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
