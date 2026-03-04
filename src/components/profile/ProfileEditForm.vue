<script setup lang="ts">
import { useForm } from '@/composables/useForm'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { User } from '@/types/user'

interface Props {
  user: User
}

const props = defineProps<Props>()

const emit = defineEmits<{
  save: [updates: Partial<User>]
  cancel: []
}>()

const { fields, errors, touched, isSubmitting, handleSubmit, touchField, validateField } = useForm({
  name: {
    value: props.user.name,
    rules: { required: true, minLength: 2 },
  },
  email: {
    value: props.user.email,
    rules: { required: true, email: true },
  },
  title: {
    value: props.user.title || '',
  },
  location: {
    value: props.user.location || '',
  },
  website: {
    value: props.user.website || '',
  },
  bio: {
    value: props.user.bio || '',
    rules: { maxLength: 500 },
  },
  twitter: {
    value: props.user.socialLinks?.twitter || '',
  },
  linkedin: {
    value: props.user.socialLinks?.linkedin || '',
  },
  github: {
    value: props.user.socialLinks?.github || '',
  },
})

async function onSubmit() {
  await handleSubmit(async (values) => {
    emit('save', {
      name: values.name,
      email: values.email,
      title: values.title,
      location: values.location,
      website: values.website,
      bio: values.bio,
      socialLinks: {
        twitter: values.twitter,
        linkedin: values.linkedin,
        github: values.github,
      },
    })
  })
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <!-- Basic Info -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Basic Information</h3>

      <BaseInput
        v-model="fields.name"
        label="Full Name"
        required
        :error="touched.name ? errors.name : ''"
        @blur="(touchField('name'), validateField('name'))"
      />

      <BaseInput
        v-model="fields.email"
        type="email"
        label="Email"
        required
        :error="touched.email ? errors.email : ''"
        @blur="(touchField('email'), validateField('email'))"
      />

      <BaseInput v-model="fields.title" label="Title" placeholder="e.g. Full Stack Developer" />

      <BaseInput v-model="fields.location" label="Location" placeholder="e.g. San Francisco, CA" />

      <BaseInput
        v-model="fields.website"
        type="url"
        label="Website"
        placeholder="https://yourwebsite.com"
      />

      <BaseTextarea
        v-model="fields.bio"
        label="Bio"
        placeholder="Tell us about yourself..."
        :rows="4"
        :error="touched.bio ? errors.bio : ''"
        @blur="(touchField('bio'), validateField('bio'))"
      />
    </div>

    <!-- Social Links -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Social Links</h3>

      <BaseInput v-model="fields.twitter" label="Twitter" placeholder="username" />

      <BaseInput v-model="fields.linkedin" label="LinkedIn" placeholder="username" />

      <BaseInput v-model="fields.github" label="GitHub" placeholder="username" />
    </div>

    <!-- Actions -->
    <div class="flex gap-3">
      <BaseButton type="submit" :loading="isSubmitting"> Save Changes </BaseButton>
      <BaseButton type="button" variant="outline" @click="emit('cancel')"> Cancel </BaseButton>
    </div>
  </form>
</template>
