# DOCKER-COMPOSE SPECIFICATION TEMPLATE

## CONTEXT
Setup local development environment với tất cả services (Backend, Frontend, Database, Cache, etc.) chạy trong Docker containers.

---

## GOAL
Một lệnh duy nhất để spin up toàn bộ development stack:
```bash
docker-compose up
```

---

## 1. DOCKER-COMPOSE.YML

```yaml
version: '3.9'

services:
  # ==================== BACKEND ====================
  backend:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
    container_name: eup-api
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      PORT: 3000
      DATABASE_URL: mongodb://mongodb:27017/eup-dev
      REDIS_URL: redis://redis:6379
      JWT_SECRET: dev-secret-key-min-32-characters
      REFRESH_TOKEN_SECRET: dev-refresh-secret-32-chars
      LOG_LEVEL: debug
    volumes:
      - .:/app
      - /app/node_modules  # Don't override node_modules
    depends_on:
      - mongodb
      - redis
    networks:
      - eup-network
    command: npm run start:dev
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 20s

  # ==================== FRONTEND ====================
  frontend:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
      target: development
    container_name: eup-web
    ports:
      - "3001:3000"  # Next.js dev server
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3000
      NEXTAUTH_URL: http://localhost:3001
      NEXTAUTH_SECRET: dev-nextauth-secret-32-chars
      NODE_ENV: development
    volumes:
      - ./apps/web:/app
      - /app/node_modules
    depends_on:
      - backend
    networks:
      - eup-network
    command: npm run dev
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  # ==================== DATABASE ====================
  mongodb:
    image: mongo:7.0
    container_name: eup-mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: rootpassword
      MONGO_INITDB_DATABASE: eup-dev
    volumes:
      - mongodb_data:/data/db
      - ./scripts/mongodb-init.js:/docker-entrypoint-initdb.d/init.js:ro
    networks:
      - eup-network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ==================== CACHE ====================
  redis:
    image: redis:7.2-alpine
    container_name: eup-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - eup-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ==================== MONITORING ====================
  mailhog:
    image: mailhog/mailhog:latest
    container_name: eup-mailhog
    ports:
      - "1025:1025"  # SMTP
      - "8025:8025"  # Web UI
    networks:
      - eup-network
    # For testing emails locally

  # ==================== OPTIONAL: ADMINER ====================
  adminer:
    image: adminer:latest
    container_name: eup-adminer
    ports:
      - "8080:8080"
    environment:
      ADMINER_DEFAULT_SERVER: mongodb
    depends_on:
      - mongodb
    networks:
      - eup-network
    # Access at http://localhost:8080

  # ==================== OPTIONAL: SWAGGER UI ====================
  swagger-ui:
    image: swaggerapi/swagger-ui:latest
    container_name: eup-swagger
    ports:
      - "8081:8080"
    environment:
      SWAGGER_JSON: /api/swagger.json
      BASE_URL: /api
    volumes:
      - ./docs/swagger.json:/usr/share/nginx/html/swagger.json:ro
    networks:
      - eup-network
    # Access at http://localhost:8081

volumes:
  mongodb_data:
    driver: local
  redis_data:
    driver: local

networks:
  eup-network:
    driver: bridge
```

---

## 2. DOCKERFILE (Backend)

```dockerfile
# Dockerfile (root of backend project)

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Development
FROM node:20-alpine AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# Stage 3: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 4: Production
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 3. DOCKERFILE (Frontend)

```dockerfile
# apps/web/Dockerfile

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Development
FROM node:20-alpine AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Stage 3: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 4: Production
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY --from=builder /app/.next ./.next
COPY public ./public
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
```

---

## 4. .DOCKERIGNORE

```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
.DS_Store
dist
build
coverage
.next
.vscode
.idea
*.swp
*.swo
logs
*.log
```

---

## 5. MONGODB INITIALIZATION

```javascript
// scripts/mongodb-init.js
db.createUser({
  user: 'eup-user',
  pwd: 'dev-password',
  roles: [
    {
      role: 'readWrite',
      db: 'eup-dev',
    },
  ],
});

db.createCollection('users');
db.createCollection('features');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.features.createIndex({ userId: 1, createdAt: -1 });

print('✅ MongoDB initialized');
```

---

## 6. ENV FILE

```bash
# .env.docker
# Backend
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://eup-user:dev-password@mongodb:27017/eup-dev
REDIS_URL=redis://redis:6379
JWT_SECRET=dev-secret-key-must-be-at-least-32-characters-long
REFRESH_TOKEN_SECRET=dev-refresh-secret-must-be-at-least-32-chars
LOG_LEVEL=debug

# Frontend
NEXT_PUBLIC_API_URL=http://backend:3000
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=dev-nextauth-secret-must-be-32-chars-long

# Mail (MailHog)
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_USER=dev@example.com
SMTP_PASS=password
```

---

## 7. COMMON COMMANDS

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f mongodb

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# Restart specific service
docker-compose restart backend

# Execute command in container
docker-compose exec backend npm test
docker-compose exec mongodb mongosh -u root -p rootpassword

# View running containers
docker-compose ps

# View resource usage
docker stats

# Remove unused images/volumes
docker system prune
```

---

## 8. DEVELOPMENT WORKFLOW

### First Time Setup

```bash
# Clone repo
git clone https://github.com/your-org/eup.git
cd eup

# Copy .env.docker
cp .env.docker .env

# Start services
docker-compose up

# Wait for services to be healthy
# Backend: http://localhost:3000/health
# Frontend: http://localhost:3001
# MongoDB: localhost:27017
# Redis: localhost:6379
```

### Database Access

```bash
# Access MongoDB
docker-compose exec mongodb mongosh -u eup-user -p dev-password eup-dev

# View all users
db.users.find()

# View all features
db.features.find()

# Clear database
db.dropDatabase()
```

### Run Tests in Docker

```bash
# Run backend tests
docker-compose exec backend npm test

# Run E2E tests
docker-compose exec backend npm run test:e2e

# Run frontend tests
docker-compose exec frontend npm test
```

### View Logs

```bash
# All services
docker-compose logs -f

# Only backend errors
docker-compose logs -f backend | grep -i error

# Only last 100 lines
docker-compose logs --tail=100

# Follow in real-time
docker-compose logs -f --tail=50
```

### Hot Reload

All services use volume mounts for code, so changes reflect immediately:
- Backend: `npm run start:dev` watches changes
- Frontend: Next.js dev server watches changes
- Database: Changes persist in `mongodb_data` volume

---

## 9. TROUBLESHOOTING

### Issue: Port Already in Use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port in docker-compose.yml
ports:
  - "3010:3000"  # Change 3000 to 3010
```

### Issue: MongoDB Connection Failed

```bash
# Check MongoDB is running
docker-compose ps

# Restart MongoDB
docker-compose restart mongodb

# Check logs
docker-compose logs mongodb
```

### Issue: Frontend Can't Reach Backend

```bash
# In frontend, use service name (not localhost)
NEXT_PUBLIC_API_URL=http://backend:3000  # ✅ Correct
NEXT_PUBLIC_API_URL=http://localhost:3000  # ❌ Wrong (localhost = container itself)
```

### Issue: Out of Disk Space

```bash
# Remove old images and volumes
docker system prune -a --volumes

# Remove specific volume
docker volume rm eup-mongodb_data
```

### Issue: Permissions Denied

```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Or use sudo
sudo docker-compose up
```

---

## 10. NETWORKING

All services connect via `eup-network` bridge:

```
Frontend (port 3001)
  ↓
Backend (port 3000) ← via http://backend:3000
  ↓
MongoDB (port 27017) ← via mongodb://mongodb:27017
  ↓
Redis (port 6379) ← via redis://redis:6379
```

Internal communication uses service names (not localhost):
```typescript
// Inside backend container
const mongoUrl = 'mongodb://mongodb:27017/eup-dev';
const redisUrl = 'redis://redis:6379';

// Inside frontend container
const apiUrl = 'http://backend:3000';
```

---

## 11. PRODUCTION CONSIDERATIONS

### Don't use docker-compose in production

Instead:
- Use Kubernetes for orchestration
- Use managed databases (MongoDB Atlas, RDS)
- Use CDN for static files (Cloudflare, CloudFront)
- Use separate image registries (ECR, Docker Hub)

### For staging/testing:

```yaml
# docker-compose.prod.yml
version: '3.9'
services:
  backend:
    image: your-registry/eup-api:latest
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DB_URL}  # Managed database
      # ... production secrets
  frontend:
    image: your-registry/eup-web:latest
    environment:
      NEXT_PUBLIC_API_URL: https://api.example.com
      # ... production secrets
```

---

## 12. HEALTH CHECKS

All services include health checks:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 10s
  timeout: 5s
  retries: 5
  start_period: 20s
```

Check status:
```bash
docker-compose ps
# Shows: Up X seconds (healthy), Up X seconds (unhealthy), etc.
```

---

## 13. VOLUME MANAGEMENT

**Persistent Volumes:**
- `mongodb_data`: MongoDB database files
- `redis_data`: Redis cache files

**Named Volumes:**
```yaml
volumes:
  mongodb_data:
  redis_data:
```

**Access host files from container:**
```yaml
volumes:
  - ./scripts/init.js:/app/init.js:ro  # ro = read-only
  - .:/app  # Current directory mounted to /app
```

---

## 14. MONITORING

### View Resource Usage

```bash
docker stats

# Output:
# CONTAINER     MEM USAGE / LIMIT     CPU %
# eup-api       245MB / 2GB            15%
# eup-web       120MB / 2GB            8%
# eup-mongodb   350MB / 2GB            25%
```

### View Events

```bash
docker events --filter type=container --filter type=service
```

### Check Service Health

```bash
docker-compose ps

# Or use health command
docker inspect eup-api | jq '.[] | .State.Health'
```

---

## 15. BEST PRACTICES

✅ **DO:**
- Use `.dockerignore` to exclude unnecessary files
- Add health checks to all services
- Use volume mounts for development
- Pin image versions (not `latest`)
- Use environment variables for config
- Clean up unused images/volumes regularly

❌ **DON'T:**
- Run as root in production
- Store secrets in Dockerfile
- Use `docker-compose` for production
- Mix development and production configs
- Ignore security vulnerabilities
- Store databases without backups

---

## 16. NEXT STEPS

Once docker-compose is running:

1. ✅ Access services:
   - Backend: http://localhost:3000
   - Frontend: http://localhost:3001
   - MongoDB: localhost:27017
   - Redis: localhost:6379
   - MailHog: http://localhost:8025

2. ✅ Create sample data:
   ```bash
   docker-compose exec backend npm run seed
   ```

3. ✅ Run tests:
   ```bash
   docker-compose exec backend npm test
   ```

4. ✅ View logs:
   ```bash
   docker-compose logs -f
   ```
