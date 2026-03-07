# Backend Quick Start Guide

## Prerequisites

1. **PostgreSQL** installed and running
2. **Python 3.10+** installed
3. **Database created** (see below)

## Step 1: Create PostgreSQL Database

```bash
# Access PostgreSQL
sudo -u postgres psql

# Run these commands:
CREATE DATABASE lms_db;
CREATE USER lms_user WITH PASSWORD 'Welcome@8012';
GRANT ALL PRIVILEGES ON DATABASE lms_db TO lms_user;
\q
```

## Step 2: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python3 -m venv venv

# Activate venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Step 3: Configure Environment

Your `.env` file is already configured with:

```
DATABASE_URL=postgresql://lms_user:Welcome@8012@localhost:5432/lms_db
```

If you need to change it, edit `backend/.env`

## Step 4: Create Database Tables & Seed Data

```bash
# Make sure venv is activated (you should see (venv) in terminal)
source venv/bin/activate

# Run seed script
python3 scripts/seed_db.py
```

You should see: `✅ Database seeded successfully!`

## Step 5: Start Backend Server

```bash
# Make sure venv is activated
source venv/bin/activate

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server will start at:

- API: http://localhost:8000
- Docs: http://localhost:8000/docs

## Step 6: Test the API

### Option 1: Using Browser

Go to http://localhost:8000/docs and try the `/api/auth/login` endpoint

### Option 2: Using curl

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@acme.com","password":"password"}'
```

You should get a response with a token!

## Test Credentials

After seeding, you can login with:

- **Admin**: `admin@acme.com` / `password`
- **Learner**: `learner@acme.com` / `password`
- **Instructor**: `instructor@acme.com` / `password`

## Troubleshooting

### "ModuleNotFoundError"

```bash
# Make sure venv is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### "Can't connect to database"

```bash
# Check PostgreSQL is running
sudo service postgresql status

# If not running, start it
sudo service postgresql start

# Test connection
psql -U lms_user -d lms_db -h localhost
# Password: Welcome@8012
```

### "Permission denied for database"

```bash
sudo -u postgres psql
GRANT ALL PRIVILEGES ON DATABASE lms_db TO lms_user;
GRANT ALL ON SCHEMA public TO lms_user;
\q
```

### "Port 8000 already in use"

```bash
# Find and kill process
lsof -i :8000
kill -9 <PID>

# Or use different port
uvicorn app.main:app --reload --port 8001
```

## Next Steps

1. ✅ Backend is running
2. ✅ Database is seeded with sample data
3. 🔄 Connect frontend to backend
4. 🔄 Test all API endpoints

## Quick Commands Reference

```bash
# Activate venv
source venv/bin/activate

# Start server
uvicorn app.main:app --reload

# Seed database
python3 scripts/seed_db.py

# Deactivate venv
deactivate
```

## API Endpoints

- `POST /api/auth/login` - Login
- `GET /api/courses` - List courses
- `GET /api/admin/employees` - List employees (admin only)
- `POST /api/admin/courses/assign` - Assign course (admin only)
- `GET /api/users/me` - Get current user

Full API docs: http://localhost:8000/docs
