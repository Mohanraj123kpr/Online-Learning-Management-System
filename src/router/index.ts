import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('@/views/CourseCatalogView.vue'),
    },
    {
      path: '/my-learning',
      name: 'my-learning',
      component: () => import('@/views/MyLearningView.vue'),
    },
    {
      path: '/course/:id',
      name: 'course-detail',
      component: () => import('@/views/CourseDetailView.vue'),
    },
    {
      path: '/course/:courseId/lesson/:lessonId',
      name: 'lesson-viewer',
      component: () => import('@/views/LessonViewerView.vue'),
    },
    {
      path: '/certificates',
      name: 'certificates',
      component: () => import('@/views/CertificatesView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    {
      path: '/discussions',
      name: 'discussions',
      component: () => import('@/views/DiscussionsView.vue'),
    },
    {
      path: '/discussions/:id',
      name: 'discussion-detail',
      component: () => import('@/views/DiscussionDetailView.vue'),
    },
  ],
})

export default router
