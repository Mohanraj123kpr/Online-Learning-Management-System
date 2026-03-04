<script setup lang="ts">
interface Props {
  modelValue: string | number
  type?: string
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      @input="handleInput"
      :class="[
        'w-full rounded-md border px-3 py-2 text-sm transition-colors',
        'focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600',
        'dark:bg-gray-700 dark:text-white dark:placeholder-gray-400',
        error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
        disabled ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800' : '',
      ]"
    />
    <p v-if="error" class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
  </div>
</template>
