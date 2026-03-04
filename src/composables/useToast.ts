import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast() {
  const addToast = (message: string, type: Toast['type'] = 'info') => {
    // Use global toast function if available
    if (typeof window !== 'undefined' && (window as any).__addToast) {
      ;(window as any).__addToast(message, type)
    }
  }

  const success = (message: string) => addToast(message, 'success')
  const error = (message: string) => addToast(message, 'error')
  const info = (message: string) => addToast(message, 'info')
  const warning = (message: string) => addToast(message, 'warning')

  return {
    toasts,
    addToast,
    success,
    error,
    info,
    warning,
  }
}
