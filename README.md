# Practice Panther - Legal Practice Management System

A full-stack web application for managing legal practice operations, including client management, matter tracking, and case organization.

## Technology Stack

### Frontend
- **React 19** with **TypeScript** - Modern component-based UI framework
- **Vite 6.3.5** - Fast build tool and development server  
- **TailwindCSS** - Utility-first CSS framework for styling
- **React Router** - Client-side routing and navigation

### Backend
- **.NET Core 8** - Cross-platform web API framework
- **Entity Framework Core** - Object-relational mapping (ORM)
- **PostgreSQL** - Relational database system
- **JWT Authentication** - Secure token-based authentication

### Infrastructure
- **Docker & Docker Compose** - Containerized database deployment
- **VS Code** - Development environment with debugging support

---

## Quick Start Guide

### Prerequisites
- **Node.js** (for frontend development)
- **Docker Desktop** (for PostgreSQL database)
- **.NET 8 SDK** (for backend development)
- **VS Code** with Docker extension (recommended)

### 1. Environment Setup

1. **Copy environment configuration:**
   ```bash
   # Copy the example environment file contents into your own .env file
   cp .env.example .env
   ```

2. **Review and adjust the `.env` file** if needed:
   - Check PostgreSQL port (default: 5433) for conflicts
   - Modify `ConnectionStrings__Default` if you change the database port
   - JWT settings are pre-configured for development

### 2. Backend Setup

#### Option A: Using VS Code (Recommended)
1. Open the project in VS Code
2. **Press F5** to start debugging
   - Automatically runs `docker-compose up` to start PostgreSQL
   - Builds and runs the .NET API
   - Applies database migrations automatically

#### Option B: Manual Setup
```bash
# Start PostgreSQL database
cd docker
docker-compose up -d

# Navigate to API project
cd backend/src/Api

# Apply database migrations (creates tables and seed data)
dotnet ef database update

# Run the API
dotnet run
```

**Backend will be available at:** http://localhost:5206
**API Documentation (Swagger):** http://localhost:5206/swagger

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will be available at:** http://localhost:5173

---

## Future Enhancements

### Architecture Improvements
- **Multi-tenancy support** for law firm organizations
- **Account-based user model** with role-based permissions
- **Split out frontend and backend** into separate deployments
- **Implement autoscaling features** to improve performance and reduce costs

### Feature Expansions
- **Advanced matter workflow** with status automation, files, tagging, and comments
- **Document management** and file attachments
- **Time tracking and billing** integration
- **Client communication portal** with notifications
- **Advanced search, filtering, and pagination**

### Technical Enhancements
- **Unit and integration testing** suites
- **Rate limiting** on API endpoints and frontend
- **Caching layer** (Redis) for performance
- **CI/CD pipeline** for automated deployments
- **Monitoring and logging** infrastructure

### UI/UX Improvements  
- **Responsive navigation sidebar** with matter/customer views
- **Reusable header component** across all pages
- **Real-time notifications** and status updates

---
