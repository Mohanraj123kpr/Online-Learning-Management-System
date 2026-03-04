<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
})

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}
</script>

<template>
  <div
    class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
  >
    <div
      v-if="title || subtitle || $slots.header"
      :class="['border-b border-gray-200 dark:border-gray-700', paddingClasses[padding]]"
    >
      <slot name="header">
        <h3 v-if="title" class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="text-sm text-gray-600 dark:text-gray-400">{{ subtitle }}</p>
      </slot>
    </div>
    <div :class="paddingClasses[padding]">
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      :class="['border-t border-gray-200 dark:border-gray-700', paddingClasses[padding]]"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
