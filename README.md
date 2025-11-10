# Ramya News - Full Stack Application

A modern news website built with FastAPI (Python) backend and vanilla JavaScript frontend, using PostgreSQL (Aiven) database.

## 🏗️ Architecture

```
├── backend/                 # FastAPI Python backend
│   ├── Dockerfile          # Backend container configuration
│   ├── main.py             # Main application & endpoints
│   ├── db.py               # Database configuration (PostgreSQL)
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic schemas
│   ├── auth.py             # JWT authentication
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # Static frontend files
│   ├── Dockerfile          # Frontend nginx container
│   ├── nginx.conf          # Nginx configuration
│   ├── index.html          # Homepage
│   ├── admin.html          # Admin panel
│   ├── style.css           # Global styles
│   ├── js/                 # JavaScript modules
│   │   ├── api.js          # API client
│   │   ├── utils.js        # Utility functions
│   │   └── app.js          # Main application logic
│   └── pages/              # Additional pages
│       ├── category.html   # Dynamic category page
│       └── article.html    # Article detail page
│
├── docker-compose.yml      # Docker orchestration
├── .env                    # Environment variables (DO NOT COMMIT)
└── .env.example            # Environment template
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose installed
- Aiven PostgreSQL database (or any PostgreSQL instance)

### 1. Clone & Configure

```bash
# Clone the repository
git clone <repository-url>
cd news

# Copy environment template
cp .env.example .env

# Edit .env with your actual credentials
nano .env
```

### 2. Build & Run with Docker

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 3. Access the Application

- **Frontend**: http://localhost
- **Admin Panel**: http://localhost/admin.html
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Default Admin Credentials

- **Username**: admin123
- **Password**: rawad123

⚠️ **IMPORTANT**: Change these credentials after first login by updating the `.env` file!

## 📡 API Endpoints

### Public Endpoints

```
GET  /api/news              Get all news articles
     ?category=local        Filter by category
     ?breaking=1            Filter breaking news
```

### Protected Endpoints (Require JWT Token)

```
POST /api/login             Admin authentication
     Body: { "username": "...", "password": "..." }
     Returns: { "access_token": "...", "token_type": "bearer" }

POST /api/news              Create new article (Admin only)
     Headers: Authorization: Bearer <token>
     Body: {
       "title": "...",
       "category": "local|international|economy|urgent|highlights",
       "image": "https://...",
       "summary": "...",
       "content": "...",
       "breaking": false,
       "date": "2025-01-01T00:00:00" (optional)
     }
```

## 🗄️ Database Schema

### Admin Table
| Column        | Type   | Description          |
|---------------|--------|----------------------|
| id            | Integer| Primary key          |
| username      | String | Admin username       |
| password_hash | String | Hashed password      |

### News Table
| Column    | Type    | Description          |
|-----------|---------|----------------------|
| id        | Integer | Primary key          |
| title     | String  | Article title        |
| category  | String  | Category (enum)      |
| image     | String  | Image URL            |
| summary   | Text    | Short summary        |
| content   | Text    | Full article content |
| breaking  | Boolean | Breaking news flag   |
| date      | String  | Publication date     |

## 🔧 Configuration

### Environment Variables (`.env`)

```bash
# Database Configuration
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
DB_HOST=your-postgres-host.aivencloud.com
DB_PORT=10282
DB_NAME=defaultdb
DB_USER=avnadmin
DB_PASSWORD=your-password
DB_SSLMODE=require

# JWT Configuration
JWT_SECRET_KEY=change-this-to-a-random-32-character-string
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Backend Configuration
BACKEND_PORT=8000
BACKEND_HOST=0.0.0.0

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:80,http://localhost:3000

# Admin Configuration
DEFAULT_ADMIN_USERNAME=admin123
DEFAULT_ADMIN_PASSWORD=rawad123
```

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up --build

# Remove all containers and volumes
docker-compose down -v
```

## 🔐 Security Considerations

1. **Change default credentials** immediately after first login
2. **Use strong JWT secret** (minimum 32 characters, random)
3. **Update CORS origins** to your actual domain in production
4. **Enable HTTPS** in production (update nginx config)
5. **Never commit `.env`** file to version control
6. **Rotate JWT secrets** periodically
7. **Implement rate limiting** for login endpoint (future enhancement)

## 📝 Development

### Making Changes

1. **Backend changes**: Edit files in `backend/`, rebuild container
2. **Frontend changes**: Edit files in `frontend/`, rebuild container
3. **Database schema changes**: Update `models.py`, restart backend (auto-creates tables)

## 🌐 Categories

The system supports these news categories:

- `highlights` - الأخبار الهامة (Highlights)
- `urgent` - العواجل (Breaking/Urgent)
- `local` - محليات (Local)
- `international` - إقليمي ودولي (International)
- `economy` - اقتصاد (Economy)

## 🎨 Frontend Structure

The frontend uses a modular JavaScript approach:

- **api.js**: Handles all API communication
- **utils.js**: Utility functions (HTML escaping, date formatting, rendering)
- **app.js**: Main application logic and page initialization

All pages now fetch data from the backend API instead of static JSON files.

## 📊 Monitoring & Health Checks

Both containers include health checks:

- **Backend**: Checks `/api/news` endpoint every 30s
- **Frontend**: Checks nginx root every 30s

View health status:
```bash
docker-compose ps
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check backend logs
docker-compose logs backend

# Common issues:
# - DATABASE_URL not set correctly
# - PostgreSQL connection refused
# - JWT_SECRET_KEY not set
```

### Frontend shows errors
```bash
# Check if backend is running
curl http://localhost:8000/api/news

# Check nginx logs
docker-compose logs frontend

# Check browser console for CORS errors
```

### Database connection issues
```bash
# Test PostgreSQL connection
docker-compose exec backend python -c "from db import engine; engine.connect()"

# Verify DATABASE_URL format
# postgresql://user:password@host:port/database?sslmode=require
```

## 🚀 Production Deployment

1. **Use environment-specific `.env` files**
2. **Set up SSL/TLS certificates** (Let's Encrypt recommended)
3. **Update nginx config** for HTTPS
4. **Use a reverse proxy** (Cloudflare, nginx) in front of containers
5. **Set up monitoring** (Grafana, Prometheus)
6. **Configure backups** for PostgreSQL database
7. **Implement log aggregation** (ELK stack, etc.)

## 📄 License

[Your License Here]

## 👥 Contributors

[Your Name/Team]

---

**Built with ❤️ using FastAPI, PostgreSQL (Aiven), and vanilla JavaScript**
