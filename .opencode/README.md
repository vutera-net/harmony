# 🚀 AI Pipeline - Hướng Dẫn Sử Dụng

**Tóm tắt**: Pipeline giúp bạn chuyển ý tưởng → sản phẩm production trong **tối thiểu thủ công**, **tối đa automation**.

---

## 📋 Mục Lục

1. [Quy trình tổng quan](#quy-trình-tổng-quan)
2. [Phase 1: Planning](#phase-1-planning)
3. [Phase 2: Implementation](#phase-2-implementation)
4. [Phase 3: Automation](#phase-3-automation)
5. [Stack Selection](#stack-selection)
6. [Ví dụ thực tế](#ví-dụ-thực-tế)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Quy Trình Tổng Quan

```
┌─────────────────────────────────────────────────────────────┐
│                     CON ĐƯỜNG PHÁT TRIỂN SẢN PHẨM          │
└─────────────────────────────────────────────────────────────┘

Buổi sáng: ĐẶT VẤN ĐỀ
  ↓
  "Tôi có ý tưởng về một app để..."
  ↓

[PHASE 1] PLANNING (1-2 ngày)
  ↓
  File: create/0-validate.md
  ├─ Kiểm tra: Thị trường có nhu cầu không?
  ├─ Kiểm tra: Công nghệ khả thi không?
  └─ Quyết định: GO / NO-GO / PIVOT
  ↓
  ✅ Quyết định GO → Tiếp tục
  
  File: create/1-idea.md
  ├─ Xây dựng: Marketing Idea
  ├─ Xác định: Killer Feature
  ├─ Nhắm tới: Target User
  └─ Output: 1-page marketing overview
  ↓
  
  File: create/2-specs.md + stacks/[your-stack].md
  ├─ Chọn: Technology stack (NestJS, Next.js, Flutter, etc.)
  ├─ Thiết kế: Architecture + Database schema
  ├─ Liệt kê: Functional requirements
  └─ Output: Technical specification
  ↓
  
  File: create/3-tasks.md
  ├─ Chia nhỏ: Specification thành tasks
  ├─ Ước lượng: Effort per task
  ├─ Sắp xếp: Priority + dependencies
  └─ Output: Kanban board (10-50 tasks)
  
  ⏱️  TOTAL TIME: 1-2 ngày (một người làm specs)

[PHASE 2] IMPLEMENTATION (2-8 tuần)
  ↓
  File: create/4-execute.md
  ├─ Hướng dẫn: Step-by-step thực hiện từng task
  ├─ Cung cấp: Code templates, patterns
  ├─ Giải thích: Gotchas & best practices
  └─ Định nghĩa: Definition of Done per task
  ↓
  Developer: Chạy tasks theo thứ tự
  ├─ TASK-00: Setup
  ├─ TASK-01-04: Infrastructure (auth, logging, error handling)
  ├─ TASK-05+: Feature modules
  └─ All tasks: Pass code review + tests
  ↓
  Quality Gates (mỗi commit):
  ├─ quality/code-review.md
  │  └─ Architecture, security, code style
  ├─ quality/test-coverage.md
  │  └─ Unit tests >70%, E2E tests pass
  ├─ quality/security.md
  │  └─ OWASP compliance, no vulnerabilities
  └─ quality/performance.md
     └─ Response time <200ms, p95 latency
  
  ⏱️  TOTAL TIME: 2-8 tuần (depends on features)

[PHASE 3] AUTOMATION (Setup once, use forever)
  ↓
  File: triggers/on-pr-opened.md
  ├─ Trigger: GitHub action khi mở PR
  ├─ Action: ESLint, tests, security scan, build
  └─ Result: Auto-comment checklist trên PR
  ↓
  File: triggers/on-merge.md
  ├─ Trigger: GitHub action khi merge vào main
  ├─ Action: Generate docs, build Docker, deploy staging
  ├─ Action: Run smoke tests
  └─ Result: Staging live, Slack notification
  ↓
  File: triggers/on-release.md
  ├─ Trigger: GitHub action khi create version tag
  ├─ Action: Performance benchmarks, load tests
  ├─ Action: Deploy to production (manual approval)
  ├─ Action: Health checks, auto-rollback if fail
  └─ Result: Production live, release notes auto-generated
  ↓
  File: docs/generate-*.md
  ├─ Auto-generate: README.md từ PRD
  ├─ Auto-generate: Swagger/OpenAPI từ code
  ├─ Auto-generate: CHANGELOG từ commits
  └─ Result: Docs luôn sync với code
  
  ⏱️  SETUP TIME: 4-8 giờ (one-time)

⭐ PRODUCTION LIVE
  ├─ Docs updated automatically
  ├─ Staging tests pass automatically
  ├─ Production deploys safely with health checks
  └─ Team notified via Slack on every milestone

📊 TIMELINE TỔNG
├─ Phase 1 Planning: 1-2 ngày
├─ Phase 2 Implementation: 2-8 tuần
├─ Phase 3 Automation: 4-8 giờ (setup once)
└─ TOTAL: 2-8+ tuần (depending on scope)
```

---

## 📝 PHASE 1: Planning (Ngày 1-2)

### Bước 1: Validate Idea
**File**: `create/0-validate.md`

```bash
# 1. Tạo prompt cho AI validate idea
cd .pipeline/ai/create

# 2. Chạy validate (hoặc manually sử dụng file template)
cat 0-validate.md

# Prompt AI:
# "Validate my idea: A mobile app for restaurant booking"

# AI sẽ trả về:
# - Market size analysis
# - Competitive landscape
# - Technical feasibility
# - GO/NO-GO/PIVOT decision
```

**Decision Framework**:
- ✅ **GO**: Thị trường lớn, tech khả thi, USP rõ → Tiếp tục
- ⚠️ **PIVOT**: Thị trường nhỏ hoặc tech phức tạp → Adjust scope
- ❌ **NO-GO**: Quá expensive, competitors quá mạnh → Bỏ ý tưởng

### Bước 2: Xây Dựng Marketing Idea
**File**: `create/1-idea.md`

```bash
# Chạy 1-idea.md với AI
# Prompt: "Build marketing idea for: restaurant booking app"

# Output sẽ có:
# - Core Concept: "Reserve tables instantly at your favorite restaurants"
# - Killer Feature: "Real-time table availability + 1-click booking"
# - Target User: "Food enthusiasts aged 25-45"
# - Trend: "On-demand service economy (like Uber, Airbnb)"
# - Vibe: "Modern, simple, trustworthy"
```

### Bước 3: Technical Specification
**File**: `create/2-specs.md` hoặc `stacks/[your-stack].md`

```bash
# Chọn stack (tùy preference):
# - Web: Next.js + NestJS
# - Mobile: React Native hoặc Flutter
# - Backend: NestJS hoặc FastAPI
# - Infra: Docker + Kubernetes

# Ví dụ: NestJS + Next.js + React Native stack
cat stacks/nestjs-api.md
cat stacks/nextjs-web.md
cat stacks/react-native.md

# Hoặc dùng 2-specs.md và reference stack files

# Output:
# - Architecture diagram
# - Database schema
# - API endpoints spec
# - Technology decisions with trade-offs
```

### Bước 4: Task Breakdown
**File**: `create/3-tasks.md`

```bash
# Chạy 3-tasks.md với AI
# Prompt: "Break down spec into tasks for NestJS + Next.js + React Native"

# Output:
# Phase 0: Setup (3 days)
#   - TASK-00: Project scaffolding
#   - TASK-01: Database setup
# Phase 1: Core (2 weeks)
#   - TASK-02: Authentication
#   - TASK-03: Restaurant CRUD
#   - TASK-04: Booking system
# Phase 2: Polish (1 week)
#   - TASK-05: Testing
#   - TASK-06: Performance
# Phase 3: Deploy (3 days)
#   - TASK-07: Docker + K8s
#   - TASK-08: CI/CD pipelines
```

**Deliverables Phase 1**:
- ✅ `docs/PRD.md` - Product Requirements Document
- ✅ `docs/IMPLEMENTATION_PLAN.md` - Task list with estimates
- ✅ Database schema diagram
- ✅ API specification
- ✅ Technology stack decision log

**Timeline**: 1-2 ngày (2-3 người)

---

## 💻 PHASE 2: Implementation (Tuần 1-8)

### Bước 1: Setup Environment
**File**: `create/4-execute.md`

```bash
# Clone template
git clone https://github.com/your-org/eup-nestjs-template.git my-project
cd my-project

# Copy .env
cp .env.example .env

# Start Docker (backend + frontend + db)
docker-compose up

# Verify everything works
curl http://localhost:3000/health
curl http://localhost:3001

# ✅ Local dev environment ready
```

### Bước 2: Implement Tasks In Order

**TASK-00: Environment & Config**
```bash
# Follow 4-execute.md TASK-00 section
# - Setup .env validation (Zod)
# - Create AppConfigService, MongoConfigService
# - Verify all env vars at startup

# Definition of Done:
# ✅ npm run start:dev works
# ✅ No linting errors
# ✅ npm run test passes
```

**TASK-01-04: Infrastructure**
```bash
# Follow 4-execute.md for each task
# - Error handling (AppError + GlobalExceptionFilter)
# - Authentication (JWT + Passport)
# - Authorization (RBAC + PermissionGuard)
# - Logging (Winston + middleware)

# Each task has:
# - Step-by-step implementation
# - Code examples
# - Testing approach
# - Definition of Done
```

**TASK-05+: Feature Modules**
```bash
# For each feature:
# 1. Create schema (Mongoose)
# 2. Create service (business logic)
# 3. Create controller (HTTP routing)
# 4. Create DTO (validation)
# 5. Create tests (unit + E2E)
# 6. Code review (checklist)

# Example: Feature module
src/modules/feature/
├── feature.module.ts
├── feature.controller.ts
├── feature.service.ts
├── feature.schema.ts
└── dto/
    └── create-feature.dto.ts
```

### Bước 3: Code Review Before Merge

**Quality Gates**:

```bash
# Before creating PR:
npm run lint -- --fix
npm test -- --coverage
npm run test:e2e
npm audit

# Create PR with description
git push origin feature/xxx
# GitHub Actions automatically:
# ✅ Runs ESLint
# ✅ Runs tests (>70% coverage)
# ✅ Runs E2E tests
# ✅ Checks security (npm audit)
# ✅ Builds successfully
# ✅ Posts checklist comment

# Manual review:
# - Use quality/code-review.md checklist
# - Check architecture, security, style
# - Require 2 approvals
# - Then merge
```

**Quality Checklists**:

```
✅ code-review.md
   ├─ Layer separation (core/infra/modules)
   ├─ No business logic in controllers
   ├─ Error handling (AppError, not HttpException)
   ├─ Input validation (class-validator)
   └─ No hardcoded secrets

✅ test-coverage.md
   ├─ Services: >70% coverage
   ├─ Controllers: >50% coverage
   ├─ E2E tests for key flows (auth, CRUD)
   └─ No coverage decrease

✅ security.md
   ├─ OWASP Top 10 compliance
   ├─ No vulnerabilities (npm audit)
   ├─ No secrets in logs
   ├─ Passwords hashed (bcrypt)
   └─ HTTPS in production

✅ performance.md
   ├─ Database: <50ms per query
   ├─ API: <200ms p95 response time
   ├─ Indexes on queried fields
   ├─ No N+1 queries
   └─ Caching strategy
```

### Bước 4: Merge to Main

```bash
# After 2+ approvals and all checks pass
# Click "Merge Pull Request"

# Automatically triggered:
# ✅ on-merge.md runs:
#    ├─ Generate README.md
#    ├─ Generate Swagger docs
#    ├─ Generate CHANGELOG
#    ├─ Build Docker image
#    ├─ Deploy to staging
#    ├─ Run smoke tests
#    └─ Notify Slack
```

**Timeline**: 2-8 tuần (depends on scope)

---

## 🤖 PHASE 3: Automation (Setup Once)

### Bước 1: Setup GitHub Actions

```bash
# Create .github/workflows/ directory
mkdir -p .github/workflows

# Copy workflows từ triggers/
# - on-pr-opened.md → .github/workflows/pr-check.yml
# - on-merge.md → .github/workflows/on-merge.yml
# - on-release.md → .github/workflows/on-release.yml

# Configure branch protection
GitHub Settings → Branch Protection Rules
├─ Require 2 reviews
├─ Require status checks (pr-check)
├─ Require up-to-date branch
└─ Require signed commits (optional)
```

### Bước 2: Configure Environment Variables

```bash
# GitHub Settings → Secrets and variables

PRODUCTION_SECRETS:
├─ DATABASE_URL (production)
├─ JWT_SECRET
├─ SLACK_WEBHOOK_URL
├─ PAGERDUTY_WEBHOOK
└─ API_KEYS (external services)

STAGING_SECRETS:
├─ DATABASE_URL (staging)
├─ REDIS_URL
└─ etc.
```

### Bước 3: Test Workflow

```bash
# Make a PR to trigger on-pr-opened.md
git checkout -b test/workflow-test
echo "test" > test.txt
git add test.txt
git commit -m "test: trigger workflow"
git push origin test/workflow-test

# Check GitHub Actions tab
# Verify: ESLint ✅, Tests ✅, Build ✅

# Merge PR to trigger on-merge.md
# Check: Staging deployed ✅, Slack notification ✅
```

### Bước 4: Create First Release

```bash
# Bump version
npm version minor  # or patch/major

# Push tags
git push --tags

# Automatically:
# ✅ on-release.md triggers
# ├─ Performance benchmarks
# ├─ Load tests
# ├─ Deploy to production (wait for approval)
# ├─ Health checks
# ├─ Release notes auto-generated
# └─ Slack notification
```

**Timeline**: 4-8 giờ (one-time setup)

---

## 🏗️ Stack Selection

### Chọn Stack Phù Hợp

```
Quyết định: Web, Mobile, Backend, Database?

┌─────────────────────────────────────────────┐
│           STACK SELECTION MATRIX             │
├─────────────────────────────────────────────┤

FRONTEND WEB:
  ✅ Next.js 16 (recommended)
     - SSR, SSG, API routes
     - TypeScript + Tailwind
     - Deploy: Vercel

BACKEND API:
  ✅ NestJS (recommended)
     - Enterprise-ready
     - Clean architecture
     - Full-featured
  
  ⚠️ FastAPI (for data/AI)
     - High performance
     - Python ecosystem

MOBILE:
  ✅ React Native (fast dev)
     - One codebase iOS/Android
     - Expo for quick testing
  
  ✅ Flutter (best performance)
     - Native performance
     - Single language (Dart)

DATABASE:
  ✅ MongoDB (for rapid dev)
     - Flexible schema
     - Easy scaling
  
  ✅ PostgreSQL (for structured data)
     - ACID compliance
     - Complex queries

INFRASTRUCTURE:
  ✅ Docker (always)
     - Local dev consistency
  
  ✅ Kubernetes (for production)
     - Auto-scaling
     - High availability
```

### Recommended Combinations

```
MVP (Fastest to market):
  Frontend: Next.js
  Backend:  NestJS
  Mobile:   React Native (Expo)
  DB:       MongoDB
  Timeline: 2-3 months

Startup (Balanced):
  Frontend: Next.js
  Backend:  NestJS + FastAPI (for analytics)
  Mobile:   Flutter
  DB:       PostgreSQL + MongoDB
  Timeline: 3-4 months

Enterprise (Full-featured):
  Frontend: Next.js
  Backend:  NestJS + FastAPI
  Mobile:   Flutter + React Native
  DB:       PostgreSQL + MongoDB + Redis
  Timeline: 4-6 months
```

---

## 📖 VÍ DỤ THỰC TẾ

### Scenario: Build Restaurant Booking App

```
Ngày 1-2: PHASE 1 Planning
├─ Sáng: Validate idea (restaurant booking)
│  └─ AI: "GO - Market size 10B, tech feasible"
│
├─ Chiều: Build marketing idea
│  └─ AI: "Core: Real-time table booking"
│           "Killer: 1-click reserve + live updates"
│
├─ Sáng hôm sau: Technical specs
│  └─ Stack: Next.js (web) + NestJS (API) + React Native (mobile)
│           MongoDB, Redis, Docker, K8s
│
└─ Chiều: Task breakdown
   └─ 25 tasks total
      Phase 0: 3 days (setup)
      Phase 1: 2 weeks (core features)
      Phase 2: 1 week (polish)
      Phase 3: 3 days (deploy)

Tuần 1-3: PHASE 2 Implementation
├─ Tuần 1: Setup infrastructure
│  └─ TASK-00-04: Config, Auth, Error handling, Logging
│
├─ Tuần 2: Core features
│  └─ TASK-05-08: Restaurant CRUD, Booking system
│
└─ Tuần 3: Polish + Testing
   └─ TASK-09-12: Tests, Performance, Deploy

Ngày cuối: PHASE 3 Automation (4 hours)
├─ Setup GitHub Actions workflows
├─ Configure branch protection
├─ Create first release
└─ Production live ✅

Timeline: ~3 weeks to MVP
├─ Phase 1: 2 days
├─ Phase 2: 15 days
├─ Phase 3: 4 hours
└─ Total: 17 days = 2.4 weeks
```

**Task Breakdown Example**:

```
PHASE 0: SETUP (Days 1-3)
  ☐ TASK-00: Project scaffolding (NestJS + Next.js + React Native)
  ☐ TASK-01: Database schema (Restaurants, Bookings, Users)
  ☐ TASK-02: Authentication (JWT + Passport)
  ☐ TASK-03: Authorization (User roles)
  ☐ TASK-04: Error handling + Logging

PHASE 1: CORE FEATURES (Weeks 1-2)
  ☐ TASK-05: Restaurant API (CRUD)
  ☐ TASK-06: Restaurant search + filter
  ☐ TASK-07: Booking API (Create, cancel, update)
  ☐ TASK-08: Real-time availability
  ☐ TASK-09: User profile + preferences
  ☐ TASK-10: Payment integration (Stripe)

PHASE 2: FRONTEND (Week 3)
  ☐ TASK-11: Web UI (Next.js)
    - Restaurant listing
    - Booking form
    - User dashboard
  ☐ TASK-12: Mobile UI (React Native)
    - Same features as web
    - Offline support

PHASE 3: TESTING + DEPLOY (Week 3)
  ☐ TASK-13: Unit + E2E tests (>70% coverage)
  ☐ TASK-14: Performance testing (p95 <200ms)
  ☐ TASK-15: Security audit (OWASP)
  ☐ TASK-16: Docker build + deploy
  ☐ TASK-17: GitHub Actions setup
  ☐ TASK-18: Production deployment
```

---

## 🎯 Best Practices

### 1. Planning Phase
```
✅ DO:
   - Spend 1-2 days on planning (saves 2+ weeks later)
   - Validate idea with AI before starting
   - Write clear specs before coding
   - Get stakeholder sign-off on requirements
   - Use realistic effort estimates

❌ DON'T:
   - Skip validation ("We know it will work!")
   - Start coding without specs
   - Underestimate effort (adds technical debt)
   - Change requirements mid-implementation
   - Skip testing/security planning
```

### 2. Implementation Phase
```
✅ DO:
   - Follow task order (dependencies matter)
   - Use execute.md as step-by-step guide
   - Commit frequently (small, logical commits)
   - Write tests as you code (not after)
   - Get code reviewed before merge
   - Document edge cases in code comments

❌ DON'T:
   - Jump between tasks (causes context switching)
   - "Optimize later" (tech debt accumulates)
   - Commit huge changes (hard to review)
   - Merge without tests (<70% coverage)
   - Ignore code review feedback
   - Let "TODOs" pile up
```

### 3. Quality Gates
```
✅ DO:
   - Run linting locally before pushing
   - Write unit tests for business logic
   - Write E2E tests for user flows
   - Check security vulnerabilities (npm audit)
   - Test on multiple devices/browsers
   - Document API changes

❌ DON'T:
   - Disable linting to "save time"
   - Test only happy path
   - Ignore security warnings
   - Merge coverage-decreasing PRs
   - Assume it works on all devices
   - Push without running tests
```

### 4. Automation
```
✅ DO:
   - Let CI/CD handle repetitive checks
   - Use GitHub Actions for all testing
   - Auto-generate documentation
   - Require approvals before merge
   - Use branch protection rules
   - Monitor deployment health

❌ DON'T:
   - Manually run tests before merging
   - Skip CI/CD setup ("We'll do it later")
   - Disable security checks
   - Force push to main
   - Ignore deployment notifications
   - Deploy without health checks
```

---

## 🔧 Troubleshooting

### Problem: "Phase 1 planning takes too long"

**Solution**:
```
- Allocate 1-2 days max per planning phase
- Use AI to speed up validation & specs
- Skip detailed specs if you did planning before
- For small features: skip full planning, go straight to tasks
```

### Problem: "Phase 2 development is slower than estimated"

**Solution**:
```
- Adjust task estimates (OK to be wrong first time)
- Break large tasks into smaller ones (5 tasks beats 1 big task)
- Use code templates from execute.md (copy-paste, adapt)
- Pair programming for complex features
- Remove blockers immediately (don't wait)
```

### Problem: "Tests are failing in CI/CD"

**Solution**:
```
- Run tests locally first (npm test)
- Check if environment variables are set
- Verify database/Redis is running
- Check for timing issues (use longer timeouts)
- Run tests in isolation (jest --testNamePattern)
```

### Problem: "Merge conflicts keep happening"

**Solution**:
```
- Rebase frequently (git rebase origin/main)
- Communicate task dependencies with team
- One person per module (avoid conflicts)
- Break tasks into smaller PRs (<500 lines)
- Merge small PRs faster (don't let them sit)
```

### Problem: "Production deployment failed"

**Solution**:
```
- Check health checks (is API responding?)
- Check environment variables (all set?)
- Rollback to previous version: git revert HEAD
- Check database migrations (did they run?)
- Monitor logs for errors (docker logs)
- Use on-release.md auto-rollback feature
```

---

## 📊 Metric Success

### Planning Success
```
✅ Specification is clear enough that 2 devs code same feature identically
✅ Task estimates are within 20% of actual (improves over time)
✅ Stakeholders understand trade-offs (speed vs. quality)
```

### Development Success
```
✅ Code passes all checks first time (or <2 iterations)
✅ Tests run in <5 minutes
✅ Merge PRs within 2 hours of approval
✅ Zero critical bugs in first month
```

### Production Success
```
✅ Zero downtime deployments
✅ Response time p95 <200ms
✅ Error rate <0.1%
✅ Users can accomplish tasks without support
```

---

## 🚀 Checklist Before Each Phase

### Before Phase 1 Start
- [ ] Team understands the problem
- [ ] Success metrics defined
- [ ] Budget/timeline aligned with stakeholders
- [ ] AI tools accessible (Claude API)

### Before Phase 2 Start
- [ ] Specifications documented and approved
- [ ] Tech stack selected
- [ ] Team trained on architecture
- [ ] Development environment setup (docker-compose works)
- [ ] GitHub repo ready with branch protection

### Before Phase 3 Start
- [ ] Phase 2 complete (all tests passing)
- [ ] GitHub Actions workflows configured
- [ ] Environment variables set in GitHub Secrets
- [ ] Deployment service (AWS/GCP/Vercel) configured
- [ ] Monitoring/alerting setup (Slack, Sentry, etc.)

### Before Production Deploy
- [ ] Security audit passed (quality/security.md)
- [ ] Performance benchmarks acceptable (quality/performance.md)
- [ ] Load tests passed (1000+ req/s)
- [ ] Rollback plan documented
- [ ] Support runbook written
- [ ] Post-launch monitoring configured

---

## 📞 Support

**Stuck?**

1. **Check execute.md** - Has step-by-step guides for all major tasks
2. **Check quality/** - Has checklists for code review, testing, security
3. **Check triggers/** - Has GitHub Actions examples
4. **Review PRD.md** - Make sure you're building the right thing
5. **Ask AI** - Use Claude to debug/explain specific issues

**Found a bug?**

- Report via GitHub Issues
- Include: Error message, steps to reproduce, expected behavior
- Tag: `pipeline`, `phase-1`, `phase-2`, etc.

---

## ✨ Final Tips

1. **Trust the process** - Phases work best in order
2. **Automate everything** - CI/CD saves 10+ hours per week
3. **Document as you go** - Future-you will thank you
4. **Celebrate milestones** - First task done? 🎉 First PR? 🎉
5. **Ship early** - MVP first, perfection later
6. **Measure success** - Users love it? That's success.

---

**Happy building! 🚀**
