<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { useOrganizationStore } from '@/stores/organization'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import VButton from '@/components/ui/VButton.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()
const orgStore = useOrganizationStore()
const drawer = ref(false)
const profileMenu = ref(false)

const navItems = computed(() => {
  const items = [
    { title: 'Dashboard', icon: 'mdi-view-dashboard', path: '/' },
    { title: 'Browse Courses', icon: 'mdi-magnify', path: '/catalog' },
    { title: 'My Learning', icon: 'mdi-book-open-variant', path: '/my-learning' },
    { title: 'Certificates', icon: 'mdi-certificate', path: '/certificates' },
    { title: 'Discussions', icon: 'mdi-forum', path: '/discussions' },
  ]

  // Add admin menu items if user has admin role
  if (orgStore.isAdmin) {
    items.push({ title: 'Admin', icon: 'mdi-shield-account', path: '/admin' })
  }

  return items
})

const isActive = (path: string) => route.path === path

function navigateToProfile() {
  router.push('/profile')
  profileMenu.value = false
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
  profileMenu.value = false
}
</script>

<template>
  <v-app-bar elevation="1" color="surface">
    <!-- Mobile Menu Button -->
    <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none" />

    <!-- Logo -->
    <v-app-bar-title>
      <router-link to="/" class="d-flex align-center text-decoration-none">
        <v-avatar v-if="orgStore.currentOrg?.logo" size="40" class="mr-2">
          <v-img :src="orgStore.currentOrg.logo" />
        </v-avatar>
        <v-avatar v-else color="primary" size="40" class="mr-2">
          <v-icon>mdi-school</v-icon>
        </v-avatar>
        <div class="d-flex flex-column">
          <span class="text-h6 font-weight-bold">
            {{ orgStore.currentOrg?.name || 'LearnHub' }}
          </span>
          <span v-if="orgStore.currentOrg" class="text-caption text-grey">
            {{ orgStore.userRole }}
          </span>
        </div>
      </router-link>
    </v-app-bar-title>

    <!-- Desktop Navigation -->
    <template v-slot:append>
      <div class="d-none d-md-flex align-center">
        <VButton
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :color="isActive(item.path) ? 'primary' : undefined"
          :variant="isActive(item.path) ? 'flat' : 'text'"
          class="mx-1"
        >
          <v-icon start>{{ item.icon }}</v-icon>
          {{ item.title }}
        </VButton>
      </div>

      <!-- Search -->
      <v-text-field
        density="compact"
        variant="outlined"
        placeholder="Search courses..."
        prepend-inner-icon="mdi-magnify"
        hide-details
        class="mx-4 d-none d-lg-flex"
        style="max-width: 300px"
      />

      <!-- Theme Toggle -->
      <ThemeToggle />

      <!-- Profile Menu -->
      <v-menu v-model="profileMenu" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn icon variant="text" v-bind="props">
            <v-avatar size="36">
              <v-img v-if="userStore.currentUser?.avatar" :src="userStore.currentUser.avatar" />
              <span v-else>{{ userStore.userInitials }}</span>
            </v-avatar>
          </v-btn>
        </template>

        <v-card min-width="250">
          <v-list>
            <v-list-item
              v-if="userStore.currentUser"
              :prepend-avatar="userStore.currentUser.avatar"
              :title="userStore.currentUser.name"
              :subtitle="userStore.currentUser.email"
            />
          </v-list>

          <v-divider />

          <v-list density="compact">
            <v-list-item prepend-icon="mdi-account" title="Profile" @click="navigateToProfile" />
            <v-list-item prepend-icon="mdi-cog" title="Settings" @click="navigateToProfile" />
          </v-list>

          <v-divider />

          <v-list density="compact">
            <v-list-item
              prepend-icon="mdi-logout"
              title="Logout"
              @click="handleLogout"
              base-color="error"
            />
          </v-list>
        </v-card>
      </v-menu>
    </template>
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer v-model="drawer" temporary>
    <v-list>
      <v-list-item
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :active="isActive(item.path)"
        :prepend-icon="item.icon"
        :title="item.title"
        @click="drawer = false"
      />
    </v-list>
  </v-navigation-drawer>
</template>
