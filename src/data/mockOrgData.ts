import type { Organization, OrgMembership, OrgCourse } from '@/types/organization'

export const mockOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    logo: 'https://via.placeholder.com/150/3b82f6/ffffff?text=ACME',
    domain: 'acme.com',
    plan: 'professional',
    settings: {
      maxUsers: 100,
      maxCourses: 50,
      allowSelfEnrollment: true,
      requireApproval: false,
      customBranding: true,
      ssoEnabled: false,
    },
    createdAt: new Date('2023-06-01'),
  },
  {
    id: 'org-2',
    name: 'TechStart Inc',
    slug: 'techstart',
    logo: 'https://via.placeholder.com/150/10b981/ffffff?text=TS',
    domain: 'techstart.io',
    plan: 'starter',
    settings: {
      maxUsers: 25,
      maxCourses: 10,
      allowSelfEnrollment: false,
      requireApproval: true,
      customBranding: false,
      ssoEnabled: false,
    },
    createdAt: new Date('2024-01-15'),
  },
]

export const mockOrgMemberships: OrgMembership[] = [
  {
    id: 'mem-1',
    userId: 'user-1',
    organizationId: 'org-1',
    role: 'admin',
    department: 'Engineering',
    joinedAt: new Date('2024-01-15'),
    active: true,
  },
  {
    id: 'mem-2',
    userId: 'user-2',
    organizationId: 'org-1',
    role: 'learner',
    department: 'Marketing',
    joinedAt: new Date('2024-02-01'),
    active: true,
  },
  {
    id: 'mem-3',
    userId: 'user-3',
    organizationId: 'org-1',
    role: 'instructor',
    department: 'Training',
    joinedAt: new Date('2023-12-01'),
    active: true,
  },
]

export const mockOrgCourses: OrgCourse[] = [
  {
    id: 'oc-1',
    organizationId: 'org-1',
    courseId: '1', // Web Development Bootcamp
    assignedTo: 'all',
    mandatory: false,
    addedBy: 'user-1',
    addedAt: new Date('2024-01-20'),
  },
  {
    id: 'oc-2',
    organizationId: 'org-1',
    courseId: '2', // Data Science
    assignedTo: 'specific',
    assignedUserIds: ['user-1'],
    assignedDepartments: ['Engineering'],
    mandatory: false,
    addedBy: 'user-1',
    addedAt: new Date('2024-02-01'),
  },
  {
    id: 'oc-3',
    organizationId: 'org-1',
    courseId: '3', // UI/UX Design
    assignedTo: 'specific',
    assignedDepartments: ['Marketing', 'Design'],
    mandatory: true,
    dueDate: new Date('2024-06-30'),
    addedBy: 'user-1',
    addedAt: new Date('2024-02-15'),
  },
]
