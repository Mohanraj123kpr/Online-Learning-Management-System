<script setup lang="ts">
interface Props {
  variant?: 'flat' | 'text' | 'outlined' | 'tonal' | 'plain'
  color?: string
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  icon?: string
  prependIcon?: string
  appendIcon?: string
  block?: boolean
  disabled?: boolean
  loading?: boolean
  to?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'flat',
  color: 'primary',
  size: 'default',
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
    :icon="icon"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :block="block"
    :disabled="disabled"
    :loading="loading"
    :to="to"
  >
    <slot />
  </v-btn>
</template>
