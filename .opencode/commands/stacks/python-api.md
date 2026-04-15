# PYTHON API SPECIFICATION TEMPLATE

## CONTEXT
Ý tưởng sản phẩm từ Marketing: [read từ 1-idea.md]

---

## ROLE
Senior Python Backend Architect. Chuyển đổi Marketing Idea thành bản Specification kỹ thuật cho Python API backend, alternative hoặc complement cho NestJS.

---

## TECH STACK (Fixed)

- **Framework**: FastAPI 0.104+
- **Language**: Python 3.11+
- **Database**: SQLAlchemy ORM + PostgreSQL
- **Cache**: Redis
- **Auth**: JWT + Passlib
- **Validation**: Pydantic v2
- **Testing**: pytest, httpx
- **Async**: asyncio
- **Deployment**: Docker, Gunicorn, Nginx
- **Monitoring**: Prometheus, Grafana

---

## 1. PROJECT STRUCTURE

```
python-api/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Configuration (Pydantic Settings)
│   ├── dependencies.py      # Dependency injection
│   │
│   ├── core/
│   │   ├── security.py      # JWT, password hashing
│   │   ├── errors.py        # Custom exceptions
│   │   └── constants.py     # App constants
│   │
│   ├── api/
│   │   ├── api_v1/
│   │   │   ├── api.py       # API router
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py
│   │   │   │   ├── users.py
│   │   │   │   └── features.py
│   │   │   └── schemas/
│   │   │       ├── auth.py
│   │   │       ├── user.py
│   │   │       └── feature.py
│   │   └── health/
│   │       └── endpoints.py
│   │
│   ├── models/              # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── feature.py
│   │
│   ├── crud/                # Database operations
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── feature.py
│   │
│   ├── services/            # Business logic
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── feature.py
│   │
│   ├── db/
│   │   ├── __init__.py
│   │   ├── session.py       # Database session
│   │   ├── base.py          # SQLAlchemy Base
│   │   └── migrations/      # Alembic migrations
│   │
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── logging.py
│   │   ├── cors.py
│   │   └── rate_limit.py
│   │
│   └── utils/
│       ├── __init__.py
│       ├── validators.py
│       └── formatters.py
│
├── tests/
│   ├── conftest.py          # pytest fixtures
│   ├── test_api/
│   │   ├── test_auth.py
│   │   ├── test_users.py
│   │   └── test_features.py
│   └── test_services/
│       ├── test_auth.py
│       └── test_features.py
│
├── migrations/              # Database migrations (Alembic)
│   └── versions/
│
├── scripts/
│   ├── init_db.py          # Initialize database
│   └── seed_db.py          # Seed test data
│
├── Dockerfile
├── docker-compose.yml       # With PostgreSQL
├── requirements.txt
├── .env.example
├── pyproject.toml
└── README.md
```

---

## 2. SETUP & CONFIGURATION

### requirements.txt

```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
pydantic==2.5.0
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
redis==5.0.1
httpx==0.25.1
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
alembic==1.13.0
python-dotenv==1.0.0
```

### config.py (Pydantic Settings)

```python
# app/config.py
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # App
    APP_NAME: str = "EUP API"
    DEBUG: bool = False
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 3000
    
    # Database
    DATABASE_URL: str
    SQLALCHEMY_ECHO: bool = False
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # JWT
    JWT_ALGORITHM: str = "HS256"
    JWT_SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:3001"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

### .env.example

```bash
DEBUG=false
DATABASE_URL=postgresql://user:password@localhost:5432/eup_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET_KEY=your-secret-key-must-be-at-least-32-characters-long
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## 3. DATABASE MODELS

```python
# app/models/user.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    is_active = Column(Boolean, default=True)
    roles = Column(String, default="user")  # JSON array as string
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    features = relationship("Feature", back_populates="owner")

class Feature(Base):
    __tablename__ = "features"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(String)
    status = Column(String, default="draft", index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    owner = relationship("User", back_populates="features")
```

---

## 4. SCHEMAS (PYDANTIC)

```python
# app/api/api_v1/schemas/user.py
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    roles: List[str]
    created_at: datetime
    
    class Config:
        from_attributes = True  # ORM mode

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse
```

---

## 5. CRUD OPERATIONS

```python
# app/crud/user.py
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password

class UserCRUD:
    @staticmethod
    async def create(db: Session, email: str, password: str, first_name: str, last_name: str):
        db_user = User(
            email=email,
            password_hash=hash_password(password),
            first_name=first_name,
            last_name=last_name,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    async def get_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    async def get_by_id(db: Session, user_id: int):
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    async def update(db: Session, user_id: int, **kwargs):
        db.query(User).filter(User.id == user_id).update(kwargs)
        db.commit()
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    async def delete(db: Session, user_id: int):
        db.query(User).filter(User.id == user_id).delete()
        db.commit()
```

---

## 6. SERVICES (BUSINESS LOGIC)

```python
# app/services/auth.py
from datetime import datetime, timedelta
from app.core.security import verify_password, create_access_token, create_refresh_token
from app.crud.user import UserCRUD
from app.api.api_v1.schemas.user import TokenResponse
from app.core.errors import InvalidCredentialsError

class AuthService:
    @staticmethod
    async def login(db, email: str, password: str) -> TokenResponse:
        user = await UserCRUD.get_by_email(db, email)
        
        if not user or not verify_password(password, user.password_hash):
            raise InvalidCredentialsError("Invalid email or password")
        
        access_token = create_access_token(data={"sub": user.id, "email": user.email})
        refresh_token = create_refresh_token(data={"sub": user.id})
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=user,
        )
    
    @staticmethod
    async def register(db, email: str, password: str, first_name: str, last_name: str):
        existing_user = await UserCRUD.get_by_email(db, email)
        
        if existing_user:
            raise ValueError("Email already registered")
        
        user = await UserCRUD.create(db, email, password, first_name, last_name)
        
        access_token = create_access_token(data={"sub": user.id, "email": user.email})
        refresh_token = create_refresh_token(data={"sub": user.id})
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=user,
        )
```

---

## 7. ENDPOINTS

```python
# app/api/api_v1/endpoints/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.api_v1.schemas.user import LoginRequest, TokenResponse, UserCreate, UserResponse
from app.services.auth import AuthService
from app.dependencies import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse)
async def register(request: UserCreate, db: Session = Depends(get_db)):
    try:
        result = await AuthService.register(
            db,
            request.email,
            request.password,
            request.first_name,
            request.last_name,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    try:
        result = await AuthService.login(db, request.email, request.password)
        return result
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
```

---

## 8. TESTING

```python
# tests/test_api/test_auth.py
import pytest
from httpx import AsyncClient
from sqlalchemy.orm import Session
from app.main import app
from app.crud.user import UserCRUD

@pytest.mark.asyncio
async def test_register_user():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/auth/register",
            json={
                "email": "test@example.com",
                "password": "SecurePass123",
                "first_name": "John",
                "last_name": "Doe",
            },
        )
        assert response.status_code == 200
        assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_login_user(db: Session):
    # Create user first
    await UserCRUD.create(
        db,
        "test@example.com",
        "password123",
        "John",
        "Doe",
    )
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/auth/login",
            json={
                "email": "test@example.com",
                "password": "password123",
            },
        )
        assert response.status_code == 200
        assert "access_token" in response.json()
```

---

## 9. MAIN APP

```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.api_v1.api import api_router
from app.middleware.logging import LoggingMiddleware

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging middleware
app.add_middleware(LoggingMiddleware)

# Include routes
app.include_router(api_router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    print("⚙️  Starting up...")

@app.on_event("shutdown")
async def shutdown_event():
    print("🛑 Shutting down...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
```

---

## 10. DOCKER & DEPLOYMENT

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3000"]
```

### docker-compose.yml

```yaml
services:
  python-api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/eup_dev
      REDIS_URL: redis://redis:6379
      JWT_SECRET_KEY: dev-secret-key-32-chars-min
    depends_on:
      - postgres
      - redis
    command: uvicorn app.main:app --host 0.0.0.0 --port 3000

  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: eup_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  postgres_data:
```

---

## 11. ASYNC FEATURES

FastAPI + SQLAlchemy AsyncIO:

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql+asyncpg://user:password@localhost/eup_dev"

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

---

## 12. KANBAN TASK BREAKDOWN

- [ ] **TASK-01: FastAPI Project Setup**
- [ ] **TASK-02: Database Models & Migrations**
- [ ] **TASK-03: Authentication (JWT, Passlib)**
- [ ] **TASK-04: CRUD Operations**
- [ ] **TASK-05: Auth Endpoints**
- [ ] **TASK-06: Feature Endpoints**
- [ ] **TASK-07: Error Handling & Validation**
- [ ] **TASK-08: Testing & Coverage**
- [ ] **TASK-09: Docker & Deployment**
- [ ] **TASK-10: Performance & Monitoring**

---

## 13. COMPARISON: FastAPI vs NestJS

| Aspect | FastAPI | NestJS |
|--------|---------|--------|
| **Language** | Python | TypeScript |
| **Performance** | Excellent (async) | Very Good |
| **Learning Curve** | Easy | Moderate |
| **Ecosystem** | Rich | Comprehensive |
| **Type Safety** | Pydantic | Native |
| **Best For** | Data APIs, ML | Enterprise |

Use **FastAPI** for:
- Data science APIs
- Quick prototyping
- Microservices
- High-performance APIs

Use **NestJS** for:
- Enterprise applications
- Complex business logic
- Strong typing needed
- Large teams

---

Both can coexist:
- NestJS for core backend
- FastAPI for data/AI services
- Communicate via REST/gRPC
