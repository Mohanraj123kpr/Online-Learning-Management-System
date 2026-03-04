<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  icon: string
  color?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  color: 'primary',
})
</script>

<template>
  <v-card>
    <v-card-text>
      <div class="d-flex align-center justify-space-between">
        <div>
          <p class="text-body-2 text-medium-emphasis mb-1">{{ title }}</p>
          <h2 class="text-h4 font-weight-bold">{{ value }}</h2>
          <p v-if="subtitle" class="text-caption text-medium-emphasis mt-1">{{ subtitle }}</p>
        </div>
        <v-avatar :color="color" size="56" variant="tonal">
          <v-icon size="32">{{ icon }}</v-icon>
        </v-avatar>
      </div>
    </v-card-text>
  </v-card>
</template>
