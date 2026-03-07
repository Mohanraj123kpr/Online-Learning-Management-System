/**
 * Multi-tenant Organization Model
 *
 * Architecture overview:
 * - Organization (tenant) is the top-level entity
 * - Users belong to an organization with a specific role
 * - Courses are scoped to an organization
 * - Admins assign courses to employees or make them org-wide
 */

export type OrgRole = 'owner' | 'admin' | 'instructor' | 'learner'

export type OrgPlan = 'starter' | 'professional' | 'enterprise'

export interface Organization {
  id: string
  name: string
  slug: string // URL-friendly identifier, e.g. "acme-corp"
  logo?: string
  domain?: string // e.g. "acme.com" — for auto-joining via email domain
  plan: OrgPlan
  settings: OrgSettings
  createdAt: Date
}

export interface OrgSettings {
  maxUsers: number
  maxCourses: number
  allowSelfEnrollment: boolean // can employees browse & enroll themselves?
  requireApproval: boolean // does enrollment need admin approval?
  customBranding: boolean // white-label support
  ssoEnabled: boolean
  brandColors?: {
    primary: string
    secondary: string
  }
}

export interface OrgMembership {
  id: string
  userId: string
  organizationId: string
  role: OrgRole
  department?: string
  joinedAt: Date
  active: boolean
}

/**
 * Links a course to an organization.
 * Controls visibility and assignment within the tenant.
 */
export interface OrgCourse {
  id: string
  organizationId: string
  courseId: string
  assignedTo: 'all' | 'specific' // available to all employees or specific ones
  assignedUserIds?: string[] // only if assignedTo === 'specific'
  assignedDepartments?: string[] // alternative: assign by department
  mandatory: boolean // required training vs optional
  dueDate?: Date // deadline for mandatory courses
  addedBy: string // admin userId who added it
  addedAt: Date
}

/**
 * Tracks per-org analytics and usage
 */
export interface OrgAnalytics {
  organizationId: string
  totalEmployees: number
  activelearners: number
  coursesAssigned: number
  averageCompletion: number
  topCourses: { courseId: string; completionRate: number }[]
}
