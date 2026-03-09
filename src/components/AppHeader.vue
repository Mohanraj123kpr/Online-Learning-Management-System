<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { useOrganizationStore } from '@/stores/organization'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()
const orgStore = useOrganizationStore()
const drawer = ref(false)
const profileMenu = ref(false)
const moreMenu = ref(false)
const searchQuery = ref('')

// Primary navigation - most used features
const primaryNavItems = computed(() => [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', path: '/', exact: true },
  { title: 'Courses', icon: 'mdi-book-open-page-variant', path: '/catalog' },
  { title: 'My Learning', icon: 'mdi-school', path: '/my-learning' },
])

// Secondary navigation - less frequently used
const secondaryNavItems = computed(() => {
  const items = [
    { title: 'Certificates', icon: 'mdi-certificate', path: '/certificates' },
    { title: 'Discussions', icon: 'mdi-forum', path: '/discussions' },
  ]

  if (orgStore.isAdmin) {
    items.push({ title: 'Admin Dashboard', icon: 'mdi-shield-crown', path: '/admin' })
  }

  return items
})

const isActive = (path: string, exact = false) => {
  if (exact) return route.path === path
  return route.path.startsWith(path)
}

function navigateToProfile() {
  router.push('/profile')
  profileMenu.value = false
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
  profileMenu.value = false
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/catalog', query: { q: searchQuery.value } })
  }
}
</script>

<template>
  <v-app-bar elevation="0" height="64" class="border-b">
    <v-container fluid class="d-flex align-center px-4">
      <!-- Mobile Menu -->
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-lg-none" />

      <!-- Logo & Brand -->
      <router-link to="/" class="d-flex align-center text-decoration-none mr-6">
        <!-- Show logo if available -->
        <v-avatar
          v-if="orgStore.currentOrg?.logo"
          :image="orgStore.currentOrg.logo"
          size="36"
          class="mr-2"
        />
        <!-- Fallback icon if no logo -->
        <v-avatar v-else color="primary" size="36" class="mr-2">
          <v-icon color="white" size="20">mdi-school</v-icon>
        </v-avatar>
        <!-- Organization name (always show on desktop) -->
        <div class="d-none d-md-block">
          <div
            class="text-subtitle-1 font-weight-bold text-high-emphasis text-truncate"
            style="max-width: 180px"
          >
            {{ orgStore.currentOrg?.name || 'LearnHub' }}
          </div>
        </div>
      </router-link>

      <!-- Primary Navigation (Desktop) -->
      <div class="d-none d-lg-flex align-center">
        <v-btn
          v-for="item in primaryNavItems"
          :key="item.path"
          :to="item.path"
          :color="isActive(item.path, item.exact) ? 'primary' : undefined"
          :variant="isActive(item.path, item.exact) ? 'flat' : 'text'"
          class="mx-1 text-none"
          size="default"
        >
          <v-icon :icon="item.icon" size="20" start />
          {{ item.title }}
        </v-btn>

        <!-- More Menu -->
        <v-menu v-model="moreMenu" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn variant="text" v-bind="props" class="mx-1 text-none">
              <v-icon icon="mdi-dots-horizontal" size="20" start />
              More
            </v-btn>
          </template>

          <v-list density="compact" min-width="200">
            <v-list-item
              v-for="item in secondaryNavItems"
              :key="item.path"
              :to="item.path"
              :prepend-icon="item.icon"
              :title="item.title"
              @click="moreMenu = false"
            />
          </v-list>
        </v-menu>
      </div>

      <v-spacer />

      <!-- Search -->
      <div class="d-none d-sm-flex mx-2" style="max-width: 280px; width: 100%">
        <v-text-field
          v-model="searchQuery"
          density="compact"
          variant="solo"
          placeholder="Search..."
          prepend-inner-icon="mdi-magnify"
          hide-details
          single-line
          flat
          bg-color="surface-variant"
          @keyup.enter="handleSearch"
        />
      </div>

      <!-- Actions -->
      <div class="d-flex align-center">
        <!-- Search (Mobile) -->
        <v-btn icon variant="text" size="small" class="d-sm-none">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <!-- Theme Toggle -->
        <ThemeToggle class="mx-1" />

        <!-- Notifications -->
        <v-btn icon variant="text" size="small" class="mx-1">
          <v-badge color="error" content="3" floating>
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>

        <!-- Profile Menu -->
        <v-menu v-model="profileMenu" location="bottom end" offset="12">
          <template v-slot:activator="{ props }">
            <v-btn icon variant="text" v-bind="props" class="ml-1">
              <v-avatar size="32">
                <v-img v-if="userStore.currentUser?.avatar" :src="userStore.currentUser.avatar" />
                <span v-else class="text-caption">{{ userStore.userInitials }}</span>
              </v-avatar>
            </v-btn>
          </template>

          <v-card min-width="260" elevation="8">
            <!-- User Info -->
            <v-card-text class="pa-4">
              <div class="d-flex align-center mb-3">
                <v-avatar size="48" class="mr-3">
                  <v-img v-if="userStore.currentUser?.avatar" :src="userStore.currentUser.avatar" />
                  <span v-else class="text-h6">{{ userStore.userInitials }}</span>
                </v-avatar>
                <div class="flex-grow-1 text-truncate">
                  <div class="text-subtitle-2 font-weight-bold text-truncate">
                    {{ userStore.currentUser?.name }}
                  </div>
                  <div class="text-caption text-medium-emphasis text-truncate">
                    {{ userStore.currentUser?.email }}
                  </div>
                </div>
              </div>

              <!-- Organization Info -->
              <v-chip
                v-if="orgStore.currentOrg"
                size="small"
                :color="orgStore.isAdmin ? 'primary' : 'default'"
                variant="tonal"
                class="mb-2"
              >
                <v-icon start size="16">mdi-domain</v-icon>
                {{ orgStore.userRole }}
              </v-chip>
            </v-card-text>

            <v-divider />

            <!-- Menu Items -->
            <v-list density="compact" class="py-1">
              <v-list-item
                prepend-icon="mdi-account-outline"
                title="My Profile"
                @click="navigateToProfile"
              />
              <v-list-item
                prepend-icon="mdi-cog-outline"
                title="Settings"
                @click="navigateToProfile"
              />
              <v-list-item prepend-icon="mdi-help-circle-outline" title="Help & Support" />
            </v-list>

            <v-divider />

            <!-- Logout -->
            <v-list density="compact" class="py-1">
              <v-list-item
                prepend-icon="mdi-logout"
                title="Logout"
                @click="handleLogout"
                base-color="error"
              />
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-container>
  </v-app-bar>

  <!-- Mobile Drawer -->
  <v-navigation-drawer v-model="drawer" temporary location="left" width="280">
    <!-- Drawer Header -->
    <div class="pa-4 border-b">
      <div class="d-flex align-center mb-3">
        <v-avatar
          v-if="orgStore.currentOrg?.logo"
          :image="orgStore.currentOrg.logo"
          size="40"
          class="mr-3"
        />
        <v-avatar v-else color="primary" size="40" class="mr-3">
          <v-icon color="white">mdi-school</v-icon>
        </v-avatar>
        <div class="flex-grow-1">
          <div class="text-subtitle-2 font-weight-bold">
            {{ orgStore.currentOrg?.name || 'LearnHub' }}
          </div>
          <v-chip size="x-small" :color="orgStore.isAdmin ? 'primary' : 'default'">
            {{ orgStore.userRole }}
          </v-chip>
        </div>
      </div>

      <!-- Mobile Search -->
      <v-text-field
        v-model="searchQuery"
        density="compact"
        variant="outlined"
        placeholder="Search..."
        prepend-inner-icon="mdi-magnify"
        hide-details
        @keyup.enter="handleSearch"
      />
    </div>

    <!-- All Navigation Items -->
    <v-list density="comfortable" class="py-2">
      <v-list-subheader>MAIN MENU</v-list-subheader>
      <v-list-item
        v-for="item in primaryNavItems"
        :key="item.path"
        :to="item.path"
        :active="isActive(item.path, item.exact)"
        :prepend-icon="item.icon"
        :title="item.title"
        @click="drawer = false"
      />

      <v-divider class="my-2" />

      <v-list-subheader>MORE</v-list-subheader>
      <v-list-item
        v-for="item in secondaryNavItems"
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

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
