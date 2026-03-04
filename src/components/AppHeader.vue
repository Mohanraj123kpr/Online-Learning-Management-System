<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  BookOpen,
  Home,
  GraduationCap,
  Search,
  Award,
  Menu,
  X,
  User,
  Settings,
  LogOut,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const mobileMenuOpen = ref(false)
const profileMenuOpen = ref(false)
const profileMenuRef = ref<HTMLElement | null>(null)

const isActive = (path: string) => route.path === path

function navigateToProfile() {
  router.push('/profile')
  profileMenuOpen.value = false
}

function handleLogout() {
  // In a real app, this would handle logout
  profileMenuOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (profileMenuRef.value && !profileMenuRef.value.contains(event.target as Node)) {
    profileMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2">
          <div class="flex size-10 items-center justify-center rounded-lg bg-blue-600">
            <GraduationCap class="size-6 text-white" />
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">LearnHub</span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <nav class="hidden items-center gap-2 md:flex">
          <RouterLink to="/">
            <button
              :class="[
                'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                isActive('/') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              <Home class="size-4" />
              <span>Dashboard</span>
            </button>
          </RouterLink>

          <RouterLink to="/catalog">
            <button
              :class="[
                'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                isActive('/catalog') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              <Search class="size-4" />
              <span>Browse Courses</span>
            </button>
          </RouterLink>

          <RouterLink to="/my-learning">
            <button
              :class="[
                'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                isActive('/my-learning')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              <BookOpen class="size-4" />
              <span>My Learning</span>
            </button>
          </RouterLink>

          <RouterLink to="/certificates">
            <button
              :class="[
                'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                isActive('/certificates')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              <Award class="size-4" />
              <span>Certificates</span>
            </button>
          </RouterLink>
        </nav>

        <!-- Search and Profile -->
        <div class="flex items-center gap-4">
          <!-- Desktop Search -->
          <div class="relative hidden lg:block">
            <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search courses..."
              class="w-64 rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <!-- Profile Avatar -->
          <div ref="profileMenuRef" class="relative">
            <button
              @click.stop="profileMenuOpen = !profileMenuOpen"
              class="flex size-9 items-center justify-center rounded-full bg-gray-200 transition-opacity hover:opacity-80"
            >
              <img
                v-if="userStore.currentUser.avatar"
                :src="userStore.currentUser.avatar"
                :alt="userStore.currentUser.name"
                class="size-9 rounded-full object-cover"
              />
              <span v-else class="text-sm font-medium">{{ userStore.userInitials }}</span>
            </button>

            <!-- Profile Dropdown -->
            <Transition
              enter-active-class="transition-all duration-200"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition-all duration-150"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="profileMenuOpen"
                @click.stop
                class="absolute right-0 top-12 z-50 w-56 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <div class="border-b border-gray-200 p-4 dark:border-gray-700">
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ userStore.currentUser.name }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ userStore.currentUser.email }}
                  </p>
                </div>
                <div class="p-2">
                  <button
                    @click="navigateToProfile"
                    class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <User class="size-4" />
                    Profile
                  </button>
                  <button
                    @click="navigateToProfile"
                    class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Settings class="size-4" />
                    Settings
                  </button>
                </div>
                <div class="border-t border-gray-200 p-2 dark:border-gray-700">
                  <button
                    @click="handleLogout"
                    class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut class="size-4" />
                    Logout
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Mobile Menu Button -->
          <button
            class="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <Menu v-if="!mobileMenuOpen" class="size-5" />
            <X v-else class="size-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav v-if="mobileMenuOpen" class="border-t bg-white px-4 py-4 md:hidden">
        <div class="flex flex-col gap-2">
          <RouterLink to="/" @click="mobileMenuOpen = false">
            <button
              :class="[
                'flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                isActive('/') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              <Home class="size-4" />
              <span>Dashboard</span>
            </button>
          </RouterLink>

          <RouterLink to="/catalog" @click="mobileMenuOpen = false">
            <button
              :class="[
                'flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                isActive('/catalog') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              <Search class="size-4" />
              <span>Browse Courses</span>
            </button>
          </RouterLink>

          <RouterLink to="/my-learning" @click="mobileMenuOpen = false">
            <button
              :class="[
                'flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                isActive('/my-learning')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              <BookOpen class="size-4" />
              <span>My Learning</span>
            </button>
          </RouterLink>

          <RouterLink to="/certificates" @click="mobileMenuOpen = false">
            <button
              :class="[
                'flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                isActive('/certificates')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              <Award class="size-4" />
              <span>Certificates</span>
            </button>
          </RouterLink>
        </div>
      </nav>
    </Transition>
  </header>
</template>
