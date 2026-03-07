<template>
  <v-container fluid>
    <!-- Header -->
    <v-row class="mb-6">
      <v-col>
        <h1 class="text-h3 font-weight-bold mb-2">Admin Dashboard</h1>
        <p class="text-body-1 text-medium-emphasis">Manage your organization's learning platform</p>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">Total Employees</p>
                <h2 class="text-h4 font-weight-bold">{{ stats.totalEmployees }}</h2>
              </div>
              <v-avatar color="primary" size="56">
                <v-icon size="32">mdi-account-group</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">Active Learners</p>
                <h2 class="text-h4 font-weight-bold">{{ stats.activeLearners }}</h2>
              </div>
              <v-avatar color="success" size="56">
                <v-icon size="32">mdi-school</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">Courses Assigned</p>
                <h2 class="text-h4 font-weight-bold">{{ stats.coursesAssigned }}</h2>
              </div>
              <v-avatar color="info" size="56">
                <v-icon size="32">mdi-book-open-variant</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">Avg Completion</p>
                <h2 class="text-h4 font-weight-bold">{{ stats.avgCompletion }}%</h2>
              </div>
              <v-avatar color="warning" size="56">
                <v-icon size="32">mdi-chart-line</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabs -->
    <v-row>
      <v-col cols="12">
        <v-tabs v-model="activeTab" color="primary">
          <v-tab value="employees">
            <v-icon start>mdi-account-group</v-icon>
            Employees
          </v-tab>
          <v-tab value="courses">
            <v-icon start>mdi-book-multiple</v-icon>
            Course Management
          </v-tab>
          <v-tab value="analytics">
            <v-icon start>mdi-chart-box</v-icon>
            Analytics
          </v-tab>
          <v-tab value="settings">
            <v-icon start>mdi-cog</v-icon>
            Organization Settings
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <!-- Tab Content -->
    <v-window v-model="activeTab" class="mt-4">
      <!-- Employees Tab -->
      <v-window-item value="employees">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <span>Employee Management</span>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="showInviteDialog = true">
              Invite Employee
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-text-field
              v-model="employeeSearch"
              prepend-inner-icon="mdi-magnify"
              label="Search employees"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-4"
            />

            <v-data-table
              :headers="employeeHeaders"
              :items="filteredEmployees"
              :search="employeeSearch"
              :items-per-page="10"
            >
              <template v-slot:item.name="{ item }">
                <div class="d-flex align-center py-2">
                  <v-avatar size="40" class="mr-3">
                    <v-img v-if="item.avatar" :src="item.avatar" />
                    <span v-else>{{ getInitials(item.name) }}</span>
                  </v-avatar>
                  <div>
                    <div class="font-weight-medium">{{ item.name }}</div>
                    <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
                  </div>
                </div>
              </template>

              <template v-slot:item.role="{ item }">
                <v-chip :color="getRoleColor(item.role)" size="small">
                  {{ item.role }}
                </v-chip>
              </template>

              <template v-slot:item.status="{ item }">
                <v-chip :color="item.active ? 'success' : 'error'" size="small">
                  {{ item.active ? 'Active' : 'Inactive' }}
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn icon="mdi-pencil" size="small" variant="text" @click="editEmployee(item)" />
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="confirmDeleteEmployee(item)"
                />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Course Management Tab -->
      <v-window-item value="courses">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <span>Course Assignments</span>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="showAssignCourseDialog = true">
              Assign Course
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="courseAssignmentHeaders"
              :items="orgStore.orgCourses"
              :items-per-page="10"
            >
              <template v-slot:item.courseName="{ item }">
                <div class="font-weight-medium">{{ getCourseTitle(item.courseId) }}</div>
              </template>

              <template v-slot:item.assignedTo="{ item }">
                <v-chip v-if="item.assignedTo === 'all'" color="primary" size="small">
                  All Employees
                </v-chip>
                <div v-else>
                  <v-chip
                    v-if="item.assignedUserIds && item.assignedUserIds.length > 0"
                    size="small"
                    class="mr-1"
                  >
                    {{ item.assignedUserIds.length }} Users
                  </v-chip>
                  <v-chip
                    v-if="item.assignedDepartments && item.assignedDepartments.length > 0"
                    size="small"
                  >
                    {{ item.assignedDepartments.join(', ') }}
                  </v-chip>
                </div>
              </template>

              <template v-slot:item.mandatory="{ item }">
                <v-chip :color="item.mandatory ? 'error' : 'default'" size="small">
                  {{ item.mandatory ? 'Required' : 'Optional' }}
                </v-chip>
              </template>

              <template v-slot:item.dueDate="{ item }">
                <span v-if="item.dueDate">{{ formatDate(item.dueDate) }}</span>
                <span v-else class="text-medium-emphasis">No deadline</span>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="editCourseAssignment(item)"
                />
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="unassignCourse(item.id)"
                />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Analytics Tab -->
      <v-window-item value="analytics">
        <v-row>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Top Performing Courses</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="course in topCourses"
                    :key="course.courseId"
                    :title="getCourseTitle(course.courseId)"
                    :subtitle="`${course.completionRate}% completion rate`"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="primary">
                        <v-icon>mdi-trophy</v-icon>
                      </v-avatar>
                    </template>
                    <template v-slot:append>
                      <v-progress-circular
                        :model-value="course.completionRate"
                        :color="getCompletionColor(course.completionRate)"
                        size="48"
                      >
                        {{ course.completionRate }}%
                      </v-progress-circular>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Department Progress</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="dept in departmentProgress"
                    :key="dept.name"
                    :title="dept.name"
                    :subtitle="`${dept.activeUsers} active learners`"
                  >
                    <template v-slot:append>
                      <div class="text-right">
                        <div class="text-h6">{{ dept.avgProgress }}%</div>
                        <v-progress-linear
                          :model-value="dept.avgProgress"
                          :color="getCompletionColor(dept.avgProgress)"
                          height="6"
                          class="mt-1"
                          style="width: 100px"
                        />
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Settings Tab -->
      <v-window-item value="settings">
        <v-card>
          <v-card-title>Organization Settings</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="orgSettings.name"
                  label="Organization Name"
                  variant="outlined"
                  prepend-inner-icon="mdi-domain"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="orgSettings.domain"
                  label="Email Domain"
                  variant="outlined"
                  prepend-inner-icon="mdi-email"
                  hint="Employees with this domain can auto-join"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="orgSettings.plan"
                  :items="['starter', 'professional', 'enterprise']"
                  label="Plan"
                  variant="outlined"
                  prepend-inner-icon="mdi-package-variant"
                  disabled
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="orgSettings.maxUsers"
                  label="Max Users"
                  type="number"
                  variant="outlined"
                  prepend-inner-icon="mdi-account-multiple"
                  disabled
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="orgSettings.allowSelfEnrollment"
                  label="Allow employees to self-enroll in courses"
                  color="primary"
                  hide-details
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="orgSettings.requireApproval"
                  label="Require admin approval for course enrollment"
                  color="primary"
                  hide-details
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="orgSettings.customBranding"
                  label="Enable custom branding"
                  color="primary"
                  hide-details
                  disabled
                />
              </v-col>
              <v-col cols="12">
                <v-btn color="primary" size="large" @click="saveSettings">
                  <v-icon start>mdi-content-save</v-icon>
                  Save Settings
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Invite Employee Dialog -->
    <v-dialog v-model="showInviteDialog" max-width="600">
      <v-card>
        <v-card-title>Invite Employee</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="inviteForm.email"
            label="Email Address"
            type="email"
            variant="outlined"
            prepend-inner-icon="mdi-email"
            class="mb-4"
          />
          <v-text-field
            v-model="inviteForm.name"
            label="Full Name"
            variant="outlined"
            prepend-inner-icon="mdi-account"
            class="mb-4"
          />
          <v-select
            v-model="inviteForm.role"
            :items="['learner', 'instructor', 'admin']"
            label="Role"
            variant="outlined"
            prepend-inner-icon="mdi-shield-account"
            class="mb-4"
          />
          <v-text-field
            v-model="inviteForm.department"
            label="Department"
            variant="outlined"
            prepend-inner-icon="mdi-office-building"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showInviteDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="sendInvite">Send Invite</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Assign Course Dialog -->
    <v-dialog v-model="showAssignCourseDialog" max-width="600">
      <v-card>
        <v-card-title>Assign Course</v-card-title>
        <v-card-text>
          <v-select
            v-model="assignCourseForm.courseId"
            :items="availableCourses"
            item-title="title"
            item-value="id"
            label="Select Course"
            variant="outlined"
            prepend-inner-icon="mdi-book"
            class="mb-4"
          />
          <v-radio-group v-model="assignCourseForm.assignedTo" class="mb-4">
            <v-radio label="All Employees" value="all" />
            <v-radio label="Specific Users/Departments" value="specific" />
          </v-radio-group>
          <v-combobox
            v-if="assignCourseForm.assignedTo === 'specific'"
            v-model="assignCourseForm.departments"
            :items="departments"
            label="Departments"
            variant="outlined"
            multiple
            chips
            class="mb-4"
          />
          <v-switch
            v-model="assignCourseForm.mandatory"
            label="Make this course mandatory"
            color="primary"
            class="mb-4"
          />
          <v-text-field
            v-if="assignCourseForm.mandatory"
            v-model="assignCourseForm.dueDate"
            label="Due Date"
            type="date"
            variant="outlined"
            prepend-inner-icon="mdi-calendar"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showAssignCourseDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="assignCourse">Assign Course</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useOrganizationStore } from '@/stores/organization'
import { useCoursesStore } from '@/stores/courses'
import { useToast } from '@/composables/useToast'

const orgStore = useOrganizationStore()
const coursesStore = useCoursesStore()
const toast = useToast()

const activeTab = ref('employees')
const employeeSearch = ref('')
const showInviteDialog = ref(false)
const showAssignCourseDialog = ref(false)

// Mock employees data
const employees = ref([
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@acme.com',
    role: 'admin',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?w=200',
    active: true,
    joinedAt: new Date('2024-01-15'),
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane.smith@acme.com',
    role: 'learner',
    department: 'Marketing',
    avatar: '',
    active: true,
    joinedAt: new Date('2024-02-01'),
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    email: 'mike.j@acme.com',
    role: 'instructor',
    department: 'Training',
    avatar: '',
    active: true,
    joinedAt: new Date('2023-12-01'),
  },
  {
    id: 'user-4',
    name: 'Sarah Williams',
    email: 'sarah.w@acme.com',
    role: 'learner',
    department: 'Engineering',
    avatar: '',
    active: true,
    joinedAt: new Date('2024-03-10'),
  },
])

const stats = ref({
  totalEmployees: 4,
  activeLearners: 3,
  coursesAssigned: 3,
  avgCompletion: 42,
})

const topCourses = ref([
  { courseId: '1', completionRate: 65 },
  { courseId: '2', completionRate: 45 },
  { courseId: '3', completionRate: 30 },
])

const departmentProgress = ref([
  { name: 'Engineering', activeUsers: 2, avgProgress: 55 },
  { name: 'Marketing', activeUsers: 1, avgProgress: 30 },
  { name: 'Training', activeUsers: 1, avgProgress: 80 },
])

const departments = ['Engineering', 'Marketing', 'Sales', 'Training', 'HR', 'Design']

const orgSettings = ref({
  name: orgStore.currentOrg?.name || '',
  domain: orgStore.currentOrg?.domain || '',
  plan: orgStore.currentOrg?.plan || 'professional',
  maxUsers: orgStore.currentOrg?.settings.maxUsers || 100,
  allowSelfEnrollment: orgStore.currentOrg?.settings.allowSelfEnrollment || true,
  requireApproval: orgStore.currentOrg?.settings.requireApproval || false,
  customBranding: orgStore.currentOrg?.settings.customBranding || true,
})

const inviteForm = ref({
  email: '',
  name: '',
  role: 'learner',
  department: '',
})

const assignCourseForm = ref({
  courseId: '',
  assignedTo: 'all',
  departments: [],
  mandatory: false,
  dueDate: '',
})

const employeeHeaders = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Department', key: 'department', sortable: true },
  { title: 'Role', key: 'role', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]

const courseAssignmentHeaders = [
  { title: 'Course', key: 'courseName', sortable: true },
  { title: 'Assigned To', key: 'assignedTo', sortable: false },
  { title: 'Type', key: 'mandatory', sortable: true },
  { title: 'Due Date', key: 'dueDate', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]

const filteredEmployees = computed(() => {
  if (!employeeSearch.value) return employees.value
  const search = employeeSearch.value.toLowerCase()
  return employees.value.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search) ||
      emp.email.toLowerCase().includes(search) ||
      emp.department.toLowerCase().includes(search),
  )
})

const availableCourses = computed(() => coursesStore.courses)

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function getRoleColor(role: string) {
  const colors: Record<string, string> = {
    owner: 'purple',
    admin: 'primary',
    instructor: 'info',
    learner: 'default',
  }
  return colors[role] || 'default'
}

function getCourseTitle(courseId: string) {
  const course = coursesStore.courses.find((c) => c.id === courseId)
  return course?.title || 'Unknown Course'
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString()
}

function getCompletionColor(rate: number) {
  if (rate >= 70) return 'success'
  if (rate >= 40) return 'warning'
  return 'error'
}

function editEmployee(employee: any) {
  toast.info(`Edit employee: ${employee.name}`)
  // TODO: Implement edit dialog
}

function confirmDeleteEmployee(employee: any) {
  if (confirm(`Are you sure you want to remove ${employee.name}?`)) {
    const index = employees.value.findIndex((e) => e.id === employee.id)
    if (index !== -1) {
      employees.value.splice(index, 1)
      stats.value.totalEmployees--
      toast.success(`${employee.name} removed successfully`)
    }
  }
}

function sendInvite() {
  // TODO: Call backend API to send invite
  employees.value.push({
    id: `user-${Date.now()}`,
    name: inviteForm.value.name,
    email: inviteForm.value.email,
    role: inviteForm.value.role as any,
    department: inviteForm.value.department,
    avatar: '',
    active: false,
    joinedAt: new Date(),
  })

  stats.value.totalEmployees++
  toast.success(`Invitation sent to ${inviteForm.value.email}`)

  showInviteDialog.value = false
  inviteForm.value = { email: '', name: '', role: 'learner', department: '' }
}

function assignCourse() {
  if (!assignCourseForm.value.courseId) {
    toast.error('Please select a course')
    return
  }

  orgStore.assignCourse({
    organizationId: orgStore.currentOrg!.id,
    courseId: assignCourseForm.value.courseId,
    assignedTo: assignCourseForm.value.assignedTo as 'all' | 'specific',
    assignedDepartments:
      assignCourseForm.value.assignedTo === 'specific'
        ? assignCourseForm.value.departments
        : undefined,
    mandatory: assignCourseForm.value.mandatory,
    dueDate: assignCourseForm.value.dueDate ? new Date(assignCourseForm.value.dueDate) : undefined,
    addedBy: 'user-1',
  })

  stats.value.coursesAssigned++
  toast.success('Course assigned successfully')

  showAssignCourseDialog.value = false
  assignCourseForm.value = {
    courseId: '',
    assignedTo: 'all',
    departments: [],
    mandatory: false,
    dueDate: '',
  }
}

function editCourseAssignment(assignment: any) {
  toast.info('Edit course assignment')
  // TODO: Implement edit dialog
}

function unassignCourse(assignmentId: string) {
  if (confirm('Are you sure you want to unassign this course?')) {
    orgStore.unassignCourse(assignmentId)
    stats.value.coursesAssigned--
    toast.success('Course unassigned successfully')
  }
}

function saveSettings() {
  // TODO: Call backend API to save settings
  toast.success('Settings saved successfully')
}

onMounted(() => {
  // Load admin data
  // TODO: Fetch from backend
})
</script>
