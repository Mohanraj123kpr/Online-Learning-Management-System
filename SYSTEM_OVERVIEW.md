# Multi-Tenant LMS - System Overview

## What We've Built

A complete multi-tenant Learning Management System where multiple organizations can use the same platform with isolated data, custom branding, and role-based access control.

## Key Features

### 1. Multi-Tenancy

- Each organization has isolated data
- Shared codebase, separate data per tenant
- Custom branding (logo, colors)
- Plan-based feature limits

### 2. Tenant Onboarding

- Self-service organization registration
- Automatic admin account creation
- Plan selection (Starter/Professional/Enterprise)
- Instant activation

### 3. Authentication & Authorization

- JWT-based authentication
- Role-based access control (Owner, Admin, Instructor, Learner)
- Session management
- Secure password hashing with bcrypt

### 4. Admin Dashboard

- User management (invite, remove)
- Course assignment (all users, specific users, departments)
- Analytics and reporting
- Organization settings

### 5. Course Management

- Course catalog
- Progress tracking
- Certificates
- Quizzes and assessments

## Architecture

### Backend (FastAPI + PostgreSQL)

```
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.py              # Login, logout
│   │   │   ├── organizations.py     # Tenant onboarding
│   │   │   ├── admin.py             # Admin operations
│   │   │   ├── courses.py           # Course management
│   │   │   └── users.py             # User management
│   │   └── deps.py                  # Dependencies (auth, db)
│   ├── core/
│   │   ├── config.py                # Settings
│   │   ├── database.py              # DB connection
│   │   └── security.py              # JWT, password hashing
│   ├── models/
│   │   ├── user.py                  # User model
│   │   ├── organization.py          # Org, membership models
│   │   └── course.py                # Course model
│   └── main.py                      # FastAPI app
├── scripts/
│   └── seed_db.py                   # Database seeding
└── requirements.txt                 # Python dependencies
```

### Frontend (Vue 3 + TypeScript)

```
src/
├── views/
│   ├── RegisterOrganizationView.vue # Tenant registration
│   ├── LoginView.vue                # Login page
│   ├── DashboardView.vue            # Main dashboard
│   ├── AdminDashboardView.vue       # Admin panel
│   └── ...
├── stores/
│   ├── auth.ts                      # Auth state
│   ├── organization.ts              # Org state
│   └── courses.ts                   # Course state
├── components/
│   └── ...
└── router/
    └── index.ts                     # Route guards
```

## Database Schema

### Core Tables

- `organizations` - Tenant data
- `users` - User accounts
- `org_memberships` - Links users to organizations with roles
- `courses` - Course content
- `org_courses` - Course assignments per organization

### Relationships

```
Organization (1) ──→ (N) OrgMembership ←── (N) User
     │
     └──→ (N) OrgCourse ←── (N) Course
```

## How Tenant Onboarding Works

### Step 1: Registration

1. User visits `/register`
2. Fills out organization details:
   - Organization name, slug, domain
   - Admin name, email, password
   - Plan selection
3. Backend creates:
   - Organization record
   - Admin user account
   - Owner membership

### Step 2: First Login

1. Admin logs in with credentials
2. Receives JWT token with org_id
3. Redirected to dashboard

### Step 3: Setup

1. Customize branding
2. Invite team members
3. Assign courses
4. Configure settings

## API Endpoints

### Public Endpoints

- `POST /api/organizations/register` - Register new organization
- `POST /api/auth/login` - Login

### Protected Endpoints (Require JWT)

- `GET /api/organizations/my-organization` - Get org details
- `PUT /api/organizations/my-organization` - Update org
- `POST /api/organizations/my-organization/upgrade` - Upgrade plan
- `POST /api/admin/invite-user` - Invite user (Admin/Owner)
- `POST /api/admin/assign-course` - Assign course (Admin/Owner)
- `GET /api/courses` - List courses
- `GET /api/users/me` - Get current user

## Subscription Plans

| Feature         | Starter | Professional | Enterprise |
| --------------- | ------- | ------------ | ---------- |
| Max Users       | 25      | 100          | Unlimited  |
| Max Courses     | 10      | 50           | Unlimited  |
| Self Enrollment | ❌      | ✅           | ✅         |
| Custom Branding | ❌      | ✅           | ✅         |
| SSO             | ❌      | ❌           | ✅         |
| Price           | Free    | $299/mo      | Custom     |

## User Roles

### Owner

- Full control over organization
- Can upgrade/downgrade plans
- Can delete organization

### Admin

- Manage users (invite, remove)
- Assign courses
- View analytics

### Instructor

- Create and manage courses
- View learner progress

### Learner

- Enroll in assigned courses
- View own progress

## Security

### Data Isolation

- All queries filtered by `organization_id`
- JWT token includes `org_id`
- No cross-tenant data access

### Authentication

- Passwords hashed with bcrypt
- JWT tokens expire after 30 minutes
- Secure session management

### Authorization

- Role-based access control
- Route guards on frontend
- API endpoint protection

## Getting Started

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
# 1. Create PostgreSQL database: lms_db
# 2. Update .env with database credentials

# Seed database
python3 scripts/seed_db.py

# Start server
uvicorn app.main:app --reload
```

Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

### Frontend Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: http://localhost:5173

## Testing Onboarding

### 1. Register Organization

Visit: http://localhost:5173/register

Fill in:

- Organization: Test Corp
- Slug: test-corp
- Domain: test.com
- Admin Name: Test Admin
- Email: admin@test.com
- Password: password123
- Plan: Starter

### 2. Login

Visit: http://localhost:5173/login

Use credentials from registration

### 3. Explore Dashboard

- View organization details
- Invite team members
- Assign courses
- Check analytics

## Demo Accounts

Pre-seeded accounts for testing:

**Acme Corporation (org-1)**

- Admin: admin@acme.com / password
- Learner: learner@acme.com / password
- Instructor: instructor@acme.com / password

**TechStart Inc (org-2)**

- (Create your own via registration)

## Documentation

- `TENANT_ONBOARDING.md` - Detailed onboarding guide
- `ONBOARDING_FLOW.md` - Visual flow diagrams
- `MULTI_TENANT_SETUP.md` - Multi-tenant architecture
- `BACKEND_SETUP_GUIDE.md` - Backend setup instructions
- `ADMIN_DASHBOARD.md` - Admin dashboard features

## Next Steps

### Immediate

1. Test registration flow
2. Test login with new organization
3. Explore admin dashboard
4. Invite team members

### Future Enhancements

1. Email notifications for invites
2. Password reset flow
3. Custom domain support
4. Payment integration for plans
5. SSO integration (SAML, OAuth)
6. Advanced analytics
7. Mobile app
8. API rate limiting
9. Audit logs
10. Data export/import

## Support

For issues or questions:

1. Check documentation files
2. Review API docs at /docs
3. Check backend logs
4. Review browser console for frontend errors

## Technology Stack

### Backend

- FastAPI (Python web framework)
- PostgreSQL (Database)
- SQLAlchemy (ORM)
- Alembic (Migrations)
- JWT (Authentication)
- Bcrypt (Password hashing)

### Frontend

- Vue 3 (Framework)
- TypeScript (Type safety)
- Pinia (State management)
- Vue Router (Routing)
- Vuetify (UI components)
- Tailwind CSS (Styling)

### DevOps

- Uvicorn (ASGI server)
- Vite (Build tool)
- Git (Version control)

## Project Status

✅ Multi-tenant architecture
✅ Backend API with FastAPI
✅ PostgreSQL database
✅ Authentication & authorization
✅ Tenant onboarding
✅ Admin dashboard
✅ Course management
✅ User management
✅ Role-based access control

🚧 Email notifications
🚧 Payment integration
🚧 SSO integration
🚧 Mobile app

## License

[Your License Here]

## Contributors

[Your Team Here]
