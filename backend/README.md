# LMS Backend - FastAPI + PostgreSQL

## Setup Instructions

### 1. Create Virtual Environment

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
# Make sure venv is activated (you should see (venv) in your terminal)
pip install -r requirements.txt
```

### 3. Setup PostgreSQL Database

```bash
# Install PostgreSQL if not already installed
# On Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# On Mac (using Homebrew):
brew install postgresql

# On Windows: Download from https://www.postgresql.org/download/windows/

# Start PostgreSQL service
# On Linux:
sudo service postgresql start

# On Mac:
brew services start postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE lms_db;
CREATE USER lms_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE lms_db TO lms_user;
\q
```

### 4. Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your settings
nano .env  # or use your preferred editor
```

Update these values in `.env`:

```
DATABASE_URL=postgresql://lms_user:your_password@localhost:5432/lms_db
SECRET_KEY=generate-a-secure-random-key-here
```

To generate a secure SECRET_KEY:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 5. Run Database Migrations

```bash
# Initialize Alembic (first time only)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Run migrations
alembic upgrade head
```

### 6. Seed Database (Optional)

```bash
# Run seed script to populate with sample data
python scripts/seed_db.py
```

### 7. Start Development Server

```bash
# Make sure venv is activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:

- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── venv/                   # Virtual environment (git ignored)
├── app/
│   ├── __init__.py
│   ├── main.py            # FastAPI app entry point
│   ├── core/
│   │   ├── config.py      # Settings and configuration
│   │   ├── database.py    # Database connection
│   │   └── security.py    # JWT and password hashing
│   ├── models/            # SQLAlchemy models
│   │   ├── user.py
│   │   ├── organization.py
│   │   └── course.py
│   ├── schemas/           # Pydantic schemas
│   │   ├── auth.py
│   │   ├── user.py
│   │   └── course.py
│   ├── api/
│   │   ├── deps.py        # Dependencies (auth, etc.)
│   │   └── routes/        # API endpoints
│   │       ├── auth.py
│   │       ├── courses.py
│   │       ├── admin.py
│   │       └── users.py
│   └── services/          # Business logic
│       ├── auth.py
│       └── courses.py
├── alembic/               # Database migrations
├── scripts/               # Utility scripts
│   └── seed_db.py
├── tests/                 # Test files
├── requirements.txt
├── .env.example
├── .env                   # Your local config (git ignored)
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login and get token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

### Courses

- `GET /api/courses` - List courses (filtered by org)
- `GET /api/courses/{id}` - Get course details
- `POST /api/courses/{id}/enroll` - Enroll in course
- `PUT /api/courses/{id}/progress` - Update progress

### Admin

- `GET /api/admin/employees` - List employees
- `POST /api/admin/employees/invite` - Invite employee
- `DELETE /api/admin/employees/{id}` - Remove employee
- `POST /api/admin/courses/assign` - Assign course
- `GET /api/admin/analytics` - Get analytics

### Users

- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `GET /api/users/me/progress` - Get learning progress

## Development

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
# Install dev dependencies
pip install black flake8 mypy

# Format code
black app/

# Lint
flake8 app/

# Type check
mypy app/
```

### Database Commands

```bash
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1

# Reset database (WARNING: deletes all data)
alembic downgrade base
alembic upgrade head
```

## Deployment

### Using Docker

```bash
# Build image
docker build -t lms-backend .

# Run container
docker run -p 8000:8000 --env-file .env lms-backend
```

### Using Docker Compose

```bash
# Start all services (backend + postgres)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Environment Variables

| Variable                    | Description                          | Default               |
| --------------------------- | ------------------------------------ | --------------------- |
| DATABASE_URL                | PostgreSQL connection string         | postgresql://...      |
| SECRET_KEY                  | JWT secret key                       | (required)            |
| ALGORITHM                   | JWT algorithm                        | HS256                 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token expiry time                    | 30                    |
| FRONTEND_URL                | Frontend URL for CORS                | http://localhost:5173 |
| ENVIRONMENT                 | Environment (development/production) | development           |

## Troubleshooting

### Virtual Environment Issues

**Problem**: `venv` command not found

```bash
# Install python3-venv
sudo apt-get install python3-venv
```

**Problem**: Can't activate venv

```bash
# Make sure you're in the backend folder
cd backend

# Try with python3 explicitly
python3 -m venv venv
```

### Database Connection Issues

**Problem**: Can't connect to PostgreSQL

```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Check connection
psql -U lms_user -d lms_db -h localhost
```

**Problem**: Permission denied

```bash
# Grant permissions
sudo -u postgres psql
GRANT ALL PRIVILEGES ON DATABASE lms_db TO lms_user;
```

### Import Errors

**Problem**: Module not found

```bash
# Make sure venv is activated
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Reinstall dependencies
pip install -r requirements.txt
```

## Security Notes

1. **Never commit `.env` file** - It contains secrets
2. **Use strong SECRET_KEY** - Generate with `secrets.token_urlsafe(32)`
3. **Use HTTPS in production** - Required for secure cookies
4. **Enable CORS properly** - Only allow trusted origins
5. **Validate all inputs** - Pydantic handles this automatically
6. **Use prepared statements** - SQLAlchemy does this by default
7. **Rate limit endpoints** - Add rate limiting middleware
8. **Monitor logs** - Set up logging and monitoring

## Next Steps

1. Complete remaining API endpoints
2. Add comprehensive tests
3. Set up CI/CD pipeline
4. Add rate limiting
5. Add logging and monitoring
6. Set up production database
7. Configure SSL/TLS
8. Add backup strategy
