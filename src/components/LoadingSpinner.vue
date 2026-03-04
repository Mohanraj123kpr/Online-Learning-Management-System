<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const sizeClasses = {
  sm: 'size-4',
  md: 'size-8',
  lg: 'size-12',
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div
      :class="[
        'animate-spin rounded-full border-4 border-gray-200 border-t-blue-600',
        sizeClasses[size],
      ]"
    ></div>
  </div>
</template>
