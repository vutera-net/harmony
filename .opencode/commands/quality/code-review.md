# CODE REVIEW CHECKLIST

## CONTEXT
Trước khi merge PR, hãy kiểm tra code theo checklist này để đảm bảo quality + consistency.

---

## ARCHITECTURE & DESIGN

### Layer Separation
- [ ] Controllers chỉ handle HTTP concerns (routing, decorators, guards)
- [ ] Services chứa tất cả business logic (NO HTTP concepts)
- [ ] Core layer không import NestJS (pure TypeScript)
- [ ] Infrastructure không chứa business logic
- [ ] Không có cross-module DB access (mỗi module quản lý schema của nó)

### Module Pattern
- [ ] Module có đủ: controller, service, schema, DTOs
- [ ] `@InjectModel()` sử dụng correctly
- [ ] `exports: [Service]` nếu module khác cần service
- [ ] Không có duplicate logic giữa modules

### Error Handling
- [ ] Services throw `AppError` (NOT `HttpException`)
- [ ] Error messages clear + actionable
- [ ] GlobalExceptionFilter catches + maps correctly
- [ ] Không có unhandled promise rejections

---

## CODE QUALITY

### TypeScript
- [ ] Strict mode enabled (no `any`, no `!` non-null assertions)
- [ ] All types properly declared (no implicit `any`)
- [ ] Generics used appropriately
- [ ] No dead code or unused imports
- [ ] Consistent naming (camelCase for vars, PascalCase for classes)

### Function Design
- [ ] Single responsibility (function does ONE thing)
- [ ] Max 20-30 lines per function (readability)
- [ ] Nested ternaries avoided (prefer `if/else`)
- [ ] No boolean parameters (prefer object args for clarity)

**Bad**:
```typescript
async create(title: string, desc: string, isPublic: boolean, isArchived: boolean) { ... }
```

**Good**:
```typescript
async create(dto: CreateFeatureDto) { ... }
// where CreateFeatureDto { title, description, isPublic?, isArchived? }
```

### Constants & Config
- [ ] Magic numbers/strings extracted to named constants
- [ ] Config accessed via config services (NOT process.env directly)
- [ ] Enums used for fixed value sets
- [ ] Environment-specific logic minimal

---

## SECURITY

### Input Validation
- [ ] All DTOs have validation decorators (`@IsEmail`, `@MinLength`, etc.)
- [ ] User input sanitized before DB queries
- [ ] No SQL injection / NoSQL injection risks
- [ ] File uploads (if any) validated (size, type)

### Authentication & Authorization
- [ ] Auth guards in place on protected endpoints
- [ ] Permission checks match intended access (no overly permissive)
- [ ] Tokens validated correctly (no hardcoded secrets)
- [ ] Refresh token rotation implemented (if used)

### Data Protection
- [ ] Passwords hashed with bcrypt (NOT plaintext)
- [ ] `.select('-password')` used when querying users
- [ ] Sensitive data NOT logged (API keys, tokens, PII)
- [ ] CORS policy restrictive (NOT `*` in production)
- [ ] Rate limiting on sensitive endpoints (login, register)

### Dependencies
- [ ] No known vulnerabilities (`npm audit`)
- [ ] Dependency versions locked in package-lock.json
- [ ] Unused dependencies removed

---

## DATABASE

### Mongoose Patterns
- [ ] Schemas use `@Schema()` + `@Prop()` correctly
- [ ] Indexes on frequently queried fields (email, userId, status, dates)
- [ ] Timestamps enabled (`timestamps: true`)
- [ ] Model types exported (`FeatureDocument`, `FeatureModel`)

### Query Optimization
- [ ] No N+1 queries (use `.populate()` selectively)
- [ ] Queries use `.lean()` for read-only operations
- [ ] Appropriate pagination (limit, skip)
- [ ] `.select()` to project only needed fields
- [ ] Batch operations for bulk updates

**Bad**:
```typescript
const users = await User.find();
for (const user of users) {
  const posts = await Post.find({ userId: user._id }); // N+1!
}
```

**Good**:
```typescript
const users = await User.find().populate('posts').lean();
```

---

## TESTING

### Unit Tests
- [ ] Services tested (dependency mocked via jest.mock or jest.spyOn)
- [ ] Edge cases covered (null, empty, error paths)
- [ ] Mocks are realistic (not oversimplified)
- [ ] No database calls in unit tests (use in-memory mocks)

### E2E Tests
- [ ] Real database (or Docker container)
- [ ] Full request/response flow tested
- [ ] Auth flows tested (login, token validation, expired tokens)
- [ ] Error responses tested (404, 400, 403, 500)
- [ ] Happy path + sad paths covered

### Coverage
- [ ] Services: >70% coverage
- [ ] Controllers: >50% coverage (testing logic delegation is enough)
- [ ] Critical paths: 100% (auth, payments, data mutations)

**Run before merge**:
```bash
npm run test:cov -- src/modules/feature/feature.service.ts
```

---

## LOGGING

### Log Quality
- [ ] Errors logged with stack trace
- [ ] Sensitive data NOT logged (passwords, tokens, PII)
- [ ] Log levels appropriate (error, warn, log, debug)
- [ ] Correlation ID included (for tracing)

**Bad**:
```typescript
this.logger.log(`User registered: ${user.password}`); // EXPOSED!
```

**Good**:
```typescript
this.logger.log(`User registered`, { userId: user._id, email: user.email });
```

### Performance
- [ ] Excessive logging removed (not logging every variable)
- [ ] Large objects not logged (truncate or log IDs only)
- [ ] Async logging (Winston handles this)

---

## API & DOCUMENTATION

### Endpoint Design
- [ ] RESTful conventions followed (GET, POST, PUT, DELETE)
- [ ] Status codes correct (201 for create, 204 for delete, etc.)
- [ ] Consistent response shape `{ data, error, pagination }`
- [ ] No redundant endpoints (GET /users/me vs GET /profile)

### OpenAPI/Swagger
- [ ] `@ApiOperation` describes endpoint purpose
- [ ] `@ApiResponse` documents success + error responses
- [ ] DTOs have `@ApiProperty` with examples
- [ ] Swagger docs match actual implementation

---

## PERFORMANCE

### N+1 Queries
- [ ] No database loops (use `.find()` with conditions)
- [ ] `.populate()` used for relationships
- [ ] Indexes added for join columns

### Caching
- [ ] High-read endpoints consider caching (Redis, HTTP cache headers)
- [ ] Cache invalidation strategy clear
- [ ] TTL reasonable (not too short, not forever)

### Response Time
- [ ] Slow queries optimized
- [ ] Pagination defaults reasonable (default limit 20-50)
- [ ] Large data sets streamed (not loaded in memory)

**Check with**:
```bash
npm run start:dev
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/features?page=1&limit=50
```

---

## CODE STYLE & CONSISTENCY

### Formatting
- [ ] ESLint passes (`npm run lint`)
- [ ] Prettier applied
- [ ] Consistent indentation (2 spaces)
- [ ] No trailing whitespace

### Naming
- [ ] Classes: PascalCase (User, FeatureService)
- [ ] Variables/functions: camelCase (userId, createUser)
- [ ] Constants: UPPER_SNAKE_CASE (DEFAULT_PAGE_SIZE)
- [ ] Booleans: is/has prefix (isActive, hasPermission)

### Comments
- [ ] Complex logic has comments explaining "why", not "what"
- [ ] TODOs removed (or ticket tracked)
- [ ] Commented-out code removed
- [ ] JSDoc for public methods (optional but nice)

**Bad**:
```typescript
// increment i
i++;
```

**Good**:
```typescript
// Skip hidden files in import
i++;
```

---

## COMMITS & PR

### Git Hygiene
- [ ] Commits atomic (1 logical change per commit)
- [ ] Commit messages clear + descriptive
- [ ] No `git merge` in history (rebase if needed)
- [ ] Branch up-to-date with main

**Good commit message**:
```
fix(auth): handle expired tokens in refresh endpoint

When token expires during refresh, return 401 instead of hanging.
Fixes #123.
```

### PR Description
- [ ] Summary of changes
- [ ] Why (context, linked issue)
- [ ] Testing performed (manual + automated)
- [ ] Any breaking changes noted

---

## FINAL SIGN-OFF

- [ ] Code runs locally without errors
- [ ] All tests pass (`npm test && npm run test:e2e`)
- [ ] Linting passes (`npm run lint`)
- [ ] No console.logs left (except in migrations/seeds)
- [ ] PR description complete
- [ ] No merge conflicts

**Before merging**:
```bash
npm run lint
npm test -- --coverage
npm run test:e2e
npm run build  # Ensure prod build works
```

---

## WHAT TO LOOK FOR

| Red Flag | Action |
|----------|--------|
| **Business logic in controller** | Ask to move to service |
| **No error handling** | Require error case testing |
| **Hardcoded values** | Ask to extract to config |
| **>50 lines per function** | Ask to refactor into smaller functions |
| **No tests** | Reject until tests added |
| **Only happy-path tests** | Ask for error/edge case tests |
| **Missing DTO validation** | Ask to add class-validator decorators |
| **SQL/NoSQL injection risks** | Reject until fixed |
| **Sensitive data logged** | Reject until removed |
| **Inconsistent naming** | Ask to align with codebase style |
