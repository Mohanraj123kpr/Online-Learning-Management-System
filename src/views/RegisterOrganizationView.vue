<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
  >
    <div class="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Start Your Learning Journey
        </h1>
        <p class="text-gray-600 dark:text-gray-400">Create your organization account in minutes</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Organization Details -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Organization Details</h2>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Organization Name *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Acme Corporation"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              @input="generateSlug"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slug (URL identifier) *
            </label>
            <div class="flex items-center gap-2">
              <span class="text-gray-500 dark:text-gray-400">yourdomain.com/</span>
              <input
                v-model="form.slug"
                type="text"
                required
                pattern="[a-z0-9-]+"
                placeholder="acme-corp"
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Only lowercase letters, numbers, and hyphens
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Domain *
            </label>
            <input
              v-model="form.domain"
              type="text"
              required
              placeholder="acme.com"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Logo URL (optional)
            </label>
            <input
              v-model="form.logo"
              type="url"
              placeholder="https://example.com/logo.png"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <!-- Admin Details -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Admin Account</h2>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Name *
            </label>
            <input
              v-model="form.admin_name"
              type="text"
              required
              placeholder="John Doe"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address *
            </label>
            <input
              v-model="form.admin_email"
              type="email"
              required
              placeholder="admin@acme.com"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password *
            </label>
            <input
              v-model="form.admin_password"
              type="password"
              required
              minlength="8"
              placeholder="Minimum 8 characters"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <!-- Plan Selection -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Choose Your Plan</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="plan in plans"
              :key="plan.value"
              @click="form.plan = plan.value"
              :class="[
                'border-2 rounded-lg p-4 cursor-pointer transition-all',
                form.plan === plan.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-300',
              ]"
            >
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                {{ plan.name }}
              </h3>
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {{ plan.price }}
              </p>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>{{ plan.users }} users</li>
                <li>{{ plan.courses }} courses</li>
                <li v-if="plan.branding">Custom branding</li>
                <li v-if="plan.sso">SSO enabled</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
        </div>

        <!-- Success Message -->
        <div
          v-if="success"
          class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
        >
          <p class="text-green-600 dark:text-green-400 text-sm font-medium mb-2">
            Organization registered successfully!
          </p>
          <p class="text-green-600 dark:text-green-400 text-sm">Redirecting to login...</p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {{ loading ? 'Creating Organization...' : 'Create Organization' }}
        </button>

        <!-- Login Link -->
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?
          <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'

const router = useRouter()

const form = ref({
  name: '',
  slug: '',
  domain: '',
  logo: '',
  admin_name: '',
  admin_email: '',
  admin_password: '',
  plan: 'starter',
})

const plans = [
  {
    value: 'starter',
    name: 'Starter',
    price: 'Free',
    users: '25',
    courses: '10',
    branding: false,
    sso: false,
  },
  {
    value: 'professional',
    name: 'Professional',
    price: '$299/mo',
    users: '100',
    courses: '50',
    branding: true,
    sso: false,
  },
  {
    value: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    users: 'Unlimited',
    courses: 'Unlimited',
    branding: true,
    sso: true,
  },
]

const loading = ref(false)
const error = ref('')
const success = ref(false)

function generateSlug() {
  if (!form.value.slug) {
    form.value.slug = form.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }
}

async function handleSubmit() {
  loading.value = true
  error.value = ''
  success.value = false

  try {
    const data = await api.registerOrganization(form.value)

    success.value = true

    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push({
        path: '/login',
        query: { email: form.value.admin_email },
      })
    }, 2000)
  } catch (err: any) {
    error.value = err.message || 'Failed to register organization'
  } finally {
    loading.value = false
  }
}
</script>
