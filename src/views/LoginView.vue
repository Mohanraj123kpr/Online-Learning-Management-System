<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-card-title class="text-h5 text-center pa-6">
            <div class="w-full">
              <h1 class="text-2xl font-bold">Welcome Back</h1>
              <p class="text-sm text-gray-600 mt-2">Sign in to your learning platform</p>
            </div>
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                :error-messages="emailError"
                required
              />

              <v-text-field
                v-model="password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                :error-messages="passwordError"
                required
              />

              <v-alert v-if="authStore.error" type="error" class="mb-4">
                {{ authStore.error }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="authStore.isLoading"
                class="mb-4"
              >
                Sign In
              </v-btn>

              <div class="text-center">
                <a href="#" class="text-sm text-primary">Forgot password?</a>
              </div>
            </v-form>
          </v-card-text>

          <v-divider />

          <v-card-text class="text-center">
            <p class="text-sm text-gray-600 mb-4">
              Don't have an organization account?
              <router-link to="/register" class="text-primary font-medium hover:underline">
                Register your organization
              </router-link>
            </p>
            <v-divider class="my-4" />
            <p class="text-sm text-gray-600">
              Demo credentials: <br />
              <strong>Admin:</strong>
              <code class="bg-gray-100 px-2 py-1 rounded">admin@acme.com</code> /
              <code class="bg-gray-100 px-2 py-1 rounded">password</code><br />
              <strong>Learner:</strong>
              <code class="bg-gray-100 px-2 py-1 rounded">learner@acme.com</code> /
              <code class="bg-gray-100 px-2 py-1 rounded">password</code>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
  // Reset errors
  emailError.value = ''
  passwordError.value = ''

  // Basic validation
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
