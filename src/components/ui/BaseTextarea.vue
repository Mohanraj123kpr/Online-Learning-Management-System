<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  rows: 4,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      @input="handleInput"
      :class="[
        'w-full resize-none rounded-md border px-3 py-2 text-sm transition-colors',
        'focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600',
        'dark:bg-gray-700 dark:text-white dark:placeholder-gray-400',
        error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
        disabled ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800' : '',
      ]"
    ></textarea>
    <p v-if="error" class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
  </div>
</template>
