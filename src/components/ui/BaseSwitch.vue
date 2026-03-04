<script setup lang="ts">
interface Props {
  modelValue: boolean
  label?: string
  description?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function toggle() {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <div class="flex items-center justify-between">
    <div v-if="label || description" class="flex-1">
      <label v-if="label" class="block text-sm font-medium text-gray-700">
        {{ label }}
      </label>
      <p v-if="description" class="text-sm text-gray-500">{{ description }}</p>
    </div>
    <button
      type="button"
      @click="toggle"
      :disabled="disabled"
      :class="[
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        modelValue ? 'bg-blue-600' : 'bg-gray-200',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      ]"
    >
      <span
        :class="[
          'inline-block size-4 transform rounded-full bg-white transition-transform',
          modelValue ? 'translate-x-6' : 'translate-x-1',
        ]"
      ></span>
    </button>
  </div>
</template>
