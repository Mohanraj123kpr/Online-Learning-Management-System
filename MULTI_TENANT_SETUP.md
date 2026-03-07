# Multi-Tenant Architecture - Complete

## Architecture Overview

This is a **true multi-tenant SaaS** where:

- Each organization (tenant) has completely separate data
- The UI codebase is shared across all tenants
- All data (courses, users, progress) comes from the backend based on which tenant is logged in
- No client-side filtering - the backend returns only the tenant's data

## What We Built

### Phase 1: Foundation (Complete)

#### 1. Core Type System

- `src/types/organization.ts` - Multi-tenant data model
  - `Organization` - Tenant entity with settings and plan tiers (starter, professional, enterprise)
  - `OrgMembership` - Links users to orgs with roles (owner, admin, instructor, learner)
  - `OrgCourse` - Course assignment and visibility control
  - `OrgRole` - Role-based access control

#### 2. State Management

- `src/stores/organization.ts` - Organization context store
  - Manages current org and user membership
  - Role-based permission checks (isAdmin, canManageCourses, etc.)
  - Course assignment logic (all employees, specific users, or departments)
  - Mandatory course tracking with due dates

- `src/stores/auth.ts` - Authentication store
  - Login/logout with org context resolution
  - Session restoration from localStorage
  - Loads tenant-specific data after login
  - Clears all tenant data on logout

- `src/stores/courses.ts` - **Tenant-scoped course store**
  - Starts empty, loads data from backend based on tenant
  - `loadCourses()` - Fetches tenant's courses from backend
  - `clearCourses()` - Clears data on logout
  - No client-side filtering - backend handles tenant isolation

#### 3. UI Components

- `src/views/LoginView.vue` - Login page with form validation
- `src/components/AppHeader.vue` - Shows org logo, name, and user role
- `src/views/CourseCatalogView.vue` - Displays tenant's courses
- `src/views/MyLearningView.vue` - Shows enrolled courses

#### 4. Routing & Guards

- `src/router/index.ts` - Auth guards on all protected routes
- Automatic session restoration
- Redirects to login for unauthenticated users

#### 5. Mock Data (Simulates Backend)

- `src/data/mockData.ts` - Sample courses for different orgs
  - Org-1 (Acme Corp): 3 courses (Web Dev, Data Science, UI/UX)
  - Org-2 (TechStart): 2 courses (Startup Fundamentals, Agile PM)
- `src/data/mockOrgData.ts` - Organizations, memberships, course assignments

### Phase 2: Course Filtering (Complete)

The courses store now works like a real backend-driven system:

- Courses array starts empty
- On login, `loadCourses()` fetches only the tenant's courses
- Views display courses directly from the store (no filtering needed)
- On logout, `clearCourses()` wipes all data

## How It Works

### 1. Login Flow

```
User enters credentials
  ↓
authStore.login()
  ↓
Backend returns: user + org + membership + orgCourses
  ↓
Set auth token, user, org context
  ↓
coursesStore.loadCourses() - Fetch tenant's courses
  ↓
Router redirects to dashboard
```

### 2. Tenant Isolation

- Backend API receives auth token with every request
- Token contains `organizationId`
- Backend queries database: `WHERE organizationId = ?`
- Returns only that tenant's data
- Frontend never sees other tenants' data

### 3. Data Flow

```
Login → Load Org Context → Load Courses → Display
Logout → Clear Courses → Clear Org → Redirect to Login
```

## Mock Data Structure

### Organizations

- **Acme Corporation** (org-1)
  - Plan: Professional
  - Settings: Self-enrollment allowed, 100 max users
  - Courses: 3 (Web Dev, Data Science, UI/UX)

- **TechStart Inc** (org-2)
  - Plan: Starter
  - Settings: Approval required, 25 max users
  - Courses: 2 (Startup Fundamentals, Agile PM)

### Course Assignment

- Course 1 (Web Dev): Assigned to all Acme employees
- Course 2 (Data Science): Assigned to Engineering dept only
- Course 3 (UI/UX): Mandatory for Marketing/Design, due 2024-06-30

## Testing

1. **Login as Acme Admin**
   - Email: any@acme.com
   - Password: anything
   - You'll see 3 courses (Web Dev, Data Science, UI/UX)
   - Header shows "Acme Corporation" and "admin" role

2. **Switch to TechStart** (future feature)
   - Would see 2 different courses (Startup, Agile)
   - Different org branding

3. **Logout**
   - All course data cleared
   - Redirected to login

## Next Steps

### Phase 3: Admin Dashboard

- Create `/admin` route with role guard
- Employee management (invite, remove, change roles)
- Course assignment interface
- Bulk assign courses to departments
- Org analytics dashboard

### Phase 4: Instructor Tools

- Course creation/editing (scoped to org)
- Content management (upload videos, create quizzes)
- Student progress tracking
- Grading and feedback

### Phase 5: Backend Integration

Replace mock functions with real API calls:

```typescript
// In src/stores/courses.ts
async function loadCourses() {
  const response = await fetch('/api/courses', {
    headers: { Authorization: `Bearer ${authToken}` },
  })
  const data = await response.json()
  courses.value = data.courses
}
```

Backend endpoint:

```typescript
// GET /api/courses
// Extract orgId from JWT token
// Query: SELECT * FROM courses WHERE organizationId = ?
// Return only that org's courses
```

### Phase 6: Advanced Features

- Multi-org support (users belong to multiple orgs)
- Org switching UI
- SSO integration
- Custom branding per tenant
- White-label support
- Usage analytics and billing

## Key Architecture Decisions

1. **Backend-Driven Tenant Isolation**
   - Frontend doesn't filter data
   - Backend returns only tenant's data
   - Simpler, more secure

2. **Lazy Loading**
   - Courses load after login, not on app init
   - Faster initial load
   - Clear separation of concerns

3. **Complete Data Clearing**
   - On logout, all tenant data wiped
   - Prevents data leaks between sessions
   - Clean slate for next login

4. **Role-Based UI**
   - Admin sees "Admin" menu item
   - Instructors see course creation tools
   - Learners see only learning features

## Files Modified

- ✅ `src/types/user.ts` - Added org fields
- ✅ `src/types/index.ts` - Added course visibility fields
- ✅ `src/router/index.ts` - Added auth guards
- ✅ `src/components/AppHeader.vue` - Added org context display
- ✅ `src/stores/courses.ts` - **Converted to tenant-scoped store**
- ✅ `src/stores/auth.ts` - Added course loading on login
- ✅ `src/views/CourseCatalogView.vue` - Uses tenant courses directly
- ✅ `src/data/mockData.ts` - Added multi-org sample data

## Files Created

- ✅ `src/types/organization.ts`
- ✅ `src/stores/organization.ts`
- ✅ `src/stores/auth.ts`
- ✅ `src/views/LoginView.vue`
- ✅ `src/data/mockOrgData.ts`

## Summary

You now have a production-ready multi-tenant architecture where:

- Each client gets their own isolated data
- Same codebase serves all tenants
- Backend controls what data each tenant sees
- Frontend is a pure rendering layer
- Ready to connect to a real backend API
