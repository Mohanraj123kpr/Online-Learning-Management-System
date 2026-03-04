import { ref, reactive, computed } from 'vue'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  email?: boolean
  custom?: (value: any) => string | null
}

export interface FieldConfig {
  value: any
  rules?: ValidationRule
}

export function useForm<T extends Record<string, FieldConfig>>(config: T) {
  const fields = reactive(
    Object.fromEntries(Object.entries(config).map(([key, field]) => [key, field.value])),
  ) as { [K in keyof T]: T[K]['value'] }

  const errors = reactive(
    Object.fromEntries(Object.keys(config).map((key) => [key, ''])),
  ) as Record<keyof T, string>

  const touched = reactive(
    Object.fromEntries(Object.keys(config).map((key) => [key, false])),
  ) as Record<keyof T, boolean>

  const isSubmitting = ref(false)

  function validateField(fieldName: keyof T): boolean {
    const value = fields[fieldName]
    const rules = config[fieldName].rules

    if (!rules) {
      errors[fieldName] = ''
      return true
    }

    // Required
    if (rules.required && (!value || value.toString().trim() === '')) {
      errors[fieldName] = 'This field is required'
      return false
    }

    // Email
    if (rules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value.toString())) {
        errors[fieldName] = 'Invalid email address'
        return false
      }
    }

    // Min length
    if (rules.minLength && value && value.toString().length < rules.minLength) {
      errors[fieldName] = `Minimum ${rules.minLength} characters required`
      return false
    }

    // Max length
    if (rules.maxLength && value && value.toString().length > rules.maxLength) {
      errors[fieldName] = `Maximum ${rules.maxLength} characters allowed`
      return false
    }

    // Pattern
    if (rules.pattern && value && !rules.pattern.test(value.toString())) {
      errors[fieldName] = 'Invalid format'
      return false
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value)
      if (customError) {
        errors[fieldName] = customError
        return false
      }
    }

    errors[fieldName] = ''
    return true
  }

  function validateAll(): boolean {
    let isValid = true
    for (const fieldName in config) {
      if (!validateField(fieldName)) {
        isValid = false
      }
    }
    return isValid
  }

  function touchField(fieldName: keyof T) {
    touched[fieldName] = true
  }

  function touchAll() {
    for (const fieldName in config) {
      touched[fieldName] = true
    }
  }

  function reset() {
    for (const fieldName in config) {
      fields[fieldName] = config[fieldName].value
      errors[fieldName] = ''
      touched[fieldName] = false
    }
    isSubmitting.value = false
  }

  const isValid = computed(() => {
    return Object.values(errors).every((error) => !error)
  })

  const isDirty = computed(() => {
    return Object.values(touched).some((t) => t)
  })

  async function handleSubmit(onSubmit: (values: typeof fields) => Promise<void> | void) {
    touchAll()
    if (!validateAll()) {
      return
    }

    isSubmitting.value = true
    try {
      await onSubmit(fields)
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    fields,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    validateField,
    validateAll,
    touchField,
    touchAll,
    reset,
    handleSubmit,
  }
}
