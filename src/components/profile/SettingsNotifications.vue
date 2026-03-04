<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'
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
  <BaseCard title="Notification Preferences" subtitle="Manage how you receive notifications">
    <div class="space-y-6">
      <!-- Email Notifications -->
      <div class="space-y-4">
        <h4 class="font-medium text-gray-900 dark:text-white">Email Notifications</h4>

        <BaseSwitch
          :model-value="preferences.emailNotifications"
          @update:model-value="updatePreference('emailNotifications', $event)"
          label="Email Notifications"
          description="Receive notifications via email"
        />

        <BaseSwitch
          :model-value="preferences.courseUpdates"
          @update:model-value="updatePreference('courseUpdates', $event)"
          label="Course Updates"
          description="Get notified about new lessons and course updates"
        />

        <BaseSwitch
          :model-value="preferences.weeklyDigest"
          @update:model-value="updatePreference('weeklyDigest', $event)"
          label="Weekly Digest"
          description="Receive a weekly summary of your learning progress"
        />

        <BaseSwitch
          :model-value="preferences.marketingEmails"
          @update:model-value="updatePreference('marketingEmails', $event)"
          label="Marketing Emails"
          description="Receive promotional emails and special offers"
        />
      </div>

      <!-- Push Notifications -->
      <div class="space-y-4 border-t border-gray-200 pt-6 dark:border-gray-700">
        <h4 class="font-medium text-gray-900 dark:text-white">Push Notifications</h4>

        <BaseSwitch
          :model-value="preferences.pushNotifications"
          @update:model-value="updatePreference('pushNotifications', $event)"
          label="Push Notifications"
          description="Receive push notifications in your browser"
        />
      </div>
    </div>
  </BaseCard>
</template>
