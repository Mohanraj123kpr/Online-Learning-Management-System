# Admin Dashboard - Complete Implementation

## Overview

The Admin Dashboard is a role-protected interface that allows organization admins to manage their learning platform. Only users with `admin` or `owner` roles can access it.

## Features

### 1. Employee Management

- View all employees in the organization
- Search and filter employees
- Invite new employees via email
- Assign roles (learner, instructor, admin)
- Assign departments
- Remove employees
- View employee status (active/inactive)

### 2. Course Assignment

- Assign courses to employees
- Three assignment modes:
  - **All Employees**: Course visible to everyone
  - **Specific Departments**: Assign to entire departments
  - **Specific Users**: Assign to individual employees
- Mark courses as mandatory with due dates
- Unassign courses
- View all course assignments

### 3. Analytics Dashboard

- Organization-wide statistics:
  - Total employees
  - Active learners
  - Courses assigned
  - Average completion rate
- Top performing courses with completion rates
- Department-level progress tracking
- Visual progress indicators

### 4. Organization Settings

- Update organization name
- Configure email domain for auto-join
- View current plan (starter/professional/enterprise)
- Toggle self-enrollment
- Toggle approval requirements
- Custom branding settings (plan-dependent)

## Access Control

### Route Protection

```typescript
// In router/index.ts
{
  path: '/admin',
  name: 'admin',
  component: () => import('@/views/AdminDashboardView.vue'),
  meta: { requiresAuth: true, requiresAdmin: true },
}
```

### Navigation Guard

```typescript
router.beforeEach(async (to, from, next) => {
  const requiresAdmin = to.meta.requiresAdmin === true

  if (requiresAdmin && !orgStore.isAdmin) {
    // Redirect non-admins to dashboard
    next({ name: 'dashboard' })
  }
})
```

### UI Visibility

The "Admin" menu item in the header only appears for admin/owner roles:

```vue
<!-- In AppHeader.vue -->
<template v-if="orgStore.isAdmin">
  <v-btn to="/admin">Admin</v-btn>
</template>
```

## Testing

### Test as Admin

1. Login with: `admin@acme.com` / `password`
2. You'll see "Admin" in the header navigation
3. Click "Admin" to access the dashboard
4. All features are available

### Test as Learner

1. Login with: `learner@acme.com` / `password`
2. No "Admin" menu item in header
3. Trying to navigate to `/admin` redirects to dashboard
4. Role badge shows "learner" instead of "admin"

### Test as Instructor

1. Login with: `instructor@acme.com` / `password`
2. No "Admin" menu item (instructors can't access admin panel)
3. Role badge shows "instructor"

## Role Hierarchy

```
owner (highest)
  ↓
admin
  ↓
instructor
  ↓
learner (lowest)
```

### Permissions by Role

| Feature                | Owner | Admin | Instructor | Learner |
| ---------------------- | ----- | ----- | ---------- | ------- |
| Access Admin Dashboard | ✅    | ✅    | ❌         | ❌      |
| Manage Employees       | ✅    | ✅    | ❌         | ❌      |
| Assign Courses         | ✅    | ✅    | ❌         | ❌      |
| View Analytics         | ✅    | ✅    | ❌         | ❌      |
| Org Settings           | ✅    | ✅    | ❌         | ❌      |
| Create Courses         | ✅    | ✅    | ✅         | ❌      |
| Take Courses           | ✅    | ✅    | ✅         | ✅      |

## Data Flow

### Employee Invitation

```
Admin clicks "Invite Employee"
  ↓
Fill form (email, name, role, department)
  ↓
Click "Send Invite"
  ↓
Backend sends invitation email
  ↓
Employee clicks link, creates account
  ↓
Auto-joins organization
```

### Course Assignment

```
Admin clicks "Assign Course"
  ↓
Select course from dropdown
  ↓
Choose assignment type (all/specific)
  ↓
Select departments (if specific)
  ↓
Mark as mandatory (optional)
  ↓
Set due date (if mandatory)
  ↓
Click "Assign Course"
  ↓
Backend creates OrgCourse record
  ↓
Employees see course in their catalog
```

## Backend Integration

### API Endpoints Needed

```typescript
// Employee Management
POST   /api/admin/employees/invite
GET    /api/admin/employees
PATCH  /api/admin/employees/:id
DELETE /api/admin/employees/:id

// Course Assignment
POST   /api/admin/courses/assign
GET    /api/admin/courses/assignments
PATCH  /api/admin/courses/assignments/:id
DELETE /api/admin/courses/assignments/:id

// Analytics
GET    /api/admin/analytics/overview
GET    /api/admin/analytics/courses
GET    /api/admin/analytics/departments

// Settings
GET    /api/admin/settings
PATCH  /api/admin/settings
```

### Request/Response Examples

#### Invite Employee

```typescript
// POST /api/admin/employees/invite
{
  "email": "newuser@acme.com",
  "name": "New User",
  "role": "learner",
  "department": "Engineering"
}

// Response
{
  "success": true,
  "invitationId": "inv-123",
  "message": "Invitation sent successfully"
}
```

#### Assign Course

```typescript
// POST /api/admin/courses/assign
{
  "courseId": "course-1",
  "assignedTo": "specific",
  "assignedDepartments": ["Engineering", "Design"],
  "mandatory": true,
  "dueDate": "2024-12-31"
}

// Response
{
  "success": true,
  "assignmentId": "oc-456",
  "affectedUsers": 15
}
```

## UI Components

### Stats Cards

- Display key metrics at a glance
- Color-coded icons for visual distinction
- Real-time updates

### Data Tables

- Sortable columns
- Search functionality
- Pagination
- Action buttons (edit, delete)
- Responsive design

### Dialogs

- Modal forms for inviting employees
- Course assignment wizard
- Confirmation dialogs for destructive actions

### Analytics Visualizations

- Progress circles for completion rates
- Progress bars for department tracking
- Color-coded indicators (green/yellow/red)

## Security Considerations

1. **Role Verification**: Backend must verify user role on every admin API call
2. **Token Validation**: JWT token contains organizationId and role
3. **Data Isolation**: Admins can only manage their own organization
4. **Audit Logging**: Track all admin actions (who did what, when)
5. **Rate Limiting**: Prevent abuse of invite/assignment endpoints

## Future Enhancements

### Phase 1 (Current)

- ✅ Employee management
- ✅ Course assignment
- ✅ Basic analytics
- ✅ Organization settings

### Phase 2

- Bulk operations (import CSV, bulk assign)
- Advanced analytics (charts, trends, forecasts)
- Custom reports and exports
- Email templates customization

### Phase 3

- Learning paths (sequential course requirements)
- Certifications and badges
- Gamification (leaderboards, points)
- Integration with HR systems

### Phase 4

- AI-powered recommendations
- Automated course assignments based on role
- Predictive analytics (who's at risk of not completing)
- Custom dashboards per admin

## Files Created

- ✅ `src/views/AdminDashboardView.vue` - Main admin interface
- ✅ Updated `src/router/index.ts` - Added admin route with guard
- ✅ Updated `src/stores/auth.ts` - Role-based mock login
- ✅ Updated `src/views/LoginView.vue` - Multiple test credentials

## Summary

The admin dashboard provides a complete management interface for organization admins. It's properly protected with role-based access control, includes all essential features for managing a learning platform, and is ready to connect to a backend API. Non-admin users are completely blocked from accessing it, both at the route level and UI level.
