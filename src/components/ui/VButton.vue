<script setup lang="ts">
interface Props {
  variant?: 'flat' | 'text' | 'outlined' | 'tonal' | 'plain'
  color?: string
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  icon?: boolean | string
  prependIcon?: string
  appendIcon?: string
  block?: boolean
  disabled?: boolean
  loading?: boolean
  to?: string
  height?: string | number
  minWidth?: string | number
}

withDefaults(defineProps<Props>(), {
  variant: 'flat',
  color: 'primary',
  size: 'default',
  icon: undefined,
  block: false,
  disabled: false,
  loading: false,
})
</script>

<template>
  <v-btn
    :variant="variant"
    :color="color"
    :size="size"
    :icon="icon ?? false"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :block="block"
    :disabled="disabled"
    :loading="loading"
    :to="to"
    :height="height"
    :min-width="minWidth"
  >
    <slot />
  </v-btn>
</template>
