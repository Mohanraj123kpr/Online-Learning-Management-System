import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Organization, OrgMembership, OrgCourse, OrgAnalytics } from '@/types/organization'

export const useOrganizationStore = defineStore('organization', () => {
  // State
  const currentOrg = ref<Organization | null>(null)
  const userMembership = ref<OrgMembership | null>(null)
  const orgCourses = ref<OrgCourse[]>([])
  const analytics = ref<OrgAnalytics | null>(null)

  // Getters
  const isOrgContext = computed(() => !!currentOrg.value)

  const userRole = computed(() => userMembership.value?.role || null)

  const isOwner = computed(() => userRole.value === 'owner')
  const isAdmin = computed(() => userRole.value === 'admin' || userRole.value === 'owner')
  const isInstructor = computed(() => userRole.value === 'instructor' || isAdmin.value)

  const canManageCourses = computed(() => isAdmin.value)
  const canManageUsers = computed(() => isAdmin.value)
  const canCreateCourses = computed(() => isInstructor.value)

  // Get courses assigned to current user
  const assignedCourseIds = computed(() => {
    if (!userMembership.value) return []

    return orgCourses.value
      .filter((oc) => {
        // All employees get 'all' courses
        if (oc.assignedTo === 'all') return true

        // Check specific user assignment
        if (oc.assignedUserIds?.includes(userMembership.value!.userId)) return true

        // Check department assignment
        if (
          userMembership.value!.department &&
          oc.assignedDepartments?.includes(userMembership.value!.department)
        ) {
          return true
        }

        return false
      })
      .map((oc) => oc.courseId)
  })

  const mandatoryCourses = computed(() =>
    orgCourses.value.filter((oc) => oc.mandatory && assignedCourseIds.value.includes(oc.courseId)),
  )

  // Actions
  function setOrganization(org: Organization, membership: OrgMembership) {
    currentOrg.value = org
    userMembership.value = membership
  }

  function clearOrganization() {
    currentOrg.value = null
    userMembership.value = null
    orgCourses.value = []
    analytics.value = null
  }

  function setOrgCourses(courses: OrgCourse[]) {
    orgCourses.value = courses
  }

  function assignCourse(courseAssignment: Omit<OrgCourse, 'id' | 'addedAt'>) {
    const newAssignment: OrgCourse = {
      ...courseAssignment,
      id: `oc-${Date.now()}`,
      addedAt: new Date(),
    }
    orgCourses.value.push(newAssignment)
  }

  function unassignCourse(orgCourseId: string) {
    const index = orgCourses.value.findIndex((oc) => oc.id === orgCourseId)
    if (index !== -1) {
      orgCourses.value.splice(index, 1)
    }
  }

  function updateCourseAssignment(orgCourseId: string, updates: Partial<OrgCourse>) {
    const index = orgCourses.value.findIndex((oc) => oc.id === orgCourseId)
    if (index !== -1) {
      orgCourses.value[index] = { ...orgCourses.value[index], ...updates } as OrgCourse
    }
  }

  function setAnalytics(data: OrgAnalytics) {
    analytics.value = data
  }

  function isCourseAssignedToUser(courseId: string, userId?: string): boolean {
    const targetUserId = userId || userMembership.value?.userId
    if (!targetUserId) return false

    return assignedCourseIds.value.includes(courseId)
  }

  return {
    // State
    currentOrg,
    userMembership,
    orgCourses,
    analytics,

    // Getters
    isOrgContext,
    userRole,
    isOwner,
    isAdmin,
    isInstructor,
    canManageCourses,
    canManageUsers,
    canCreateCourses,
    assignedCourseIds,
    mandatoryCourses,

    // Actions
    setOrganization,
    clearOrganization,
    setOrgCourses,
    assignCourse,
    unassignCourse,
    updateCourseAssignment,
    setAnalytics,
    isCourseAssignedToUser,
  }
})
