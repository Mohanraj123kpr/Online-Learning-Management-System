<script setup lang="ts">
interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: string
  variant?:
    | 'outlined'
    | 'filled'
    | 'underlined'
    | 'solo'
    | 'solo-inverted'
    | 'solo-filled'
    | 'plain'
  density?: 'default' | 'comfortable' | 'compact'
  prependInnerIcon?: string
  appendInnerIcon?: string
  hideDetails?: boolean | 'auto'
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  hint?: string
  persistentHint?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'outlined',
  density: 'comfortable',
  type: 'text',
  hideDetails: false,
  disabled: false,
  readonly: false,
  clearable: false,
  persistentHint: false,
})

defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>

<template>
  <v-text-field
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder"
    :type="type"
    :variant="variant"
    :density="density"
    :prepend-inner-icon="prependInnerIcon"
    :append-inner-icon="appendInnerIcon"
    :hide-details="hideDetails"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="clearable"
    :hint="hint"
    :persistent-hint="persistentHint"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
