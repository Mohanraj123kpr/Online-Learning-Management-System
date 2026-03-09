<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
  >
    <div class="max-w-md w-full">
      <!-- Branding -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4"
        >
          <v-icon size="36" color="white">mdi-school</v-icon>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">LearnHub</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Multi-tenant Learning Platform</p>
      </div>

      <!-- Login Card -->
      <v-card class="rounded-xl" elevation="8">
        <v-card-text class="pa-8">
          <h2 class="text-xl font-semibold text-center mb-1">Welcome back</h2>
          <p class="text-sm text-gray-500 text-center mb-6">
            Sign in to continue to your dashboard
          </p>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              density="comfortable"
              :error-messages="emailError"
              class="mb-1"
              required
            />

            <v-text-field
              v-model="password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              density="comfortable"
              :error-messages="passwordError"
              class="mb-1"
              required
            />

            <div class="d-flex justify-end mb-4">
              <a href="#" class="text-sm text-primary text-decoration-none">Forgot password?</a>
            </div>

            <v-alert
              v-if="authStore.error"
              type="error"
              variant="tonal"
              class="mb-4"
              density="compact"
            >
              {{ authStore.error }}
            </v-alert>

            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              :loading="authStore.isLoading"
              class="mb-4 text-none rounded-lg"
              elevation="0"
            >
              Sign In
            </v-btn>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-text class="text-center pa-6">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Don't have an organization account?
            <router-link to="/register" class="text-primary font-medium text-decoration-none">
              Register here
            </router-link>
          </p>
        </v-card-text>
      </v-card>

      <!-- Demo Credentials -->
      <v-card class="rounded-xl mt-4" variant="tonal" color="info">
        <v-card-text class="pa-4">
          <p class="text-xs font-medium mb-2 text-center">Demo Credentials</p>
          <div class="d-flex flex-column gap-1 text-xs text-center">
            <span>
              <strong>Admin:</strong>
              <code class="bg-white/20 px-1 rounded">admin@acme.com</code> /
              <code class="bg-white/20 px-1 rounded">password</code>
            </span>
            <span>
              <strong>Learner:</strong>
              <code class="bg-white/20 px-1 rounded">learner@acme.com</code> /
              <code class="bg-white/20 px-1 rounded">password</code>
            </span>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const emailError = ref('')
const passwordError = ref('')

async function handleLogin() {
  emailError.value = ''
  passwordError.value = ''

  if (!email.value) {
    emailError.value = 'Email is required'
    return
  }
  if (!password.value) {
    passwordError.value = 'Password is required'
    return
  }

  const success = await authStore.login({
    email: email.value,
    password: password.value,
  })

  if (success) {
    router.push('/')
  }
}
</script>
