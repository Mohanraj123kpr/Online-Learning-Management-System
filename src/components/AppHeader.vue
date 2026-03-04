<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { BookOpen, Home, GraduationCap, Search, User, Menu, X } from 'lucide-vue-next'

const route = useRoute()
const mobileMenuOpen = ref(false)

const isActive = (path: string) => route.path === path
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-white">
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2">
          <div class="flex size-10 items-center justify-center rounded-lg bg-blue-600">
            <GraduationCap class="size-6 text-white" />
          </div>
          <span class="text-xl font-bold">LearnHub</span>
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
          <div class="flex size-9 items-center justify-center rounded-full bg-gray-200">
            <img
              src="https://images.unsplash.com/photo-1629507208649-70919ca33793?w=100"
              alt="User"
              class="size-9 rounded-full object-cover"
            />
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
        </div>
      </nav>
    </Transition>
  </header>
</template>
