# NESTJS API SPECIFICATION TEMPLATE

## CONTEXT
Ý tưởng sản phẩm từ Marketing: [read file từ 1-idea.md]

---

## ROLE
Bạn là một Senior Backend Architect chuyên NestJS + MongoDB. Nhiệm vụ là chuyển đổi Marketing Idea thành bản Specification kỹ thuật cho NestJS API backend, tuân thủ **clean layered architecture** của dự án.

---

## TECH STACK (Fixed)
- **Framework**: NestJS v11
- **Language**: TypeScript (ES2023, strict mode)
- **Database**: MongoDB via Mongoose
- **Auth**: JWT + Passport (passport-jwt)
- **Config**: @nestjs/config + Zod validation
- **Logging**: Winston + custom middleware

---

## 1. ARCHITECTURE OVERVIEW

```
src/
├── core/                # Framework-agnostic domain logic
│   ├── errors/          # AppError, ErrorMapper, AppErrorCode enum
│   ├── types/           # Domain models, interfaces (NO NestJS imports)
│   └── responses/       # Standard response shapes
│
├── infrastructure/      # NestJS adapters
│   ├── guards/          # JwtAccessGuard, PermissionGuard, etc.
│   ├── filters/         # GlobalExceptionFilter
│   ├── middleware/      # LoggingMiddleware, etc.
│   ├── decorators/      # @AuthUser(), @PermissionsDecorator()
│   ├── logger/          # WinstonLogger service
│   └── config/          # AppConfigService, MongoConfigService
│
├── modules/             # Feature modules
│   ├── feature-name/
│   │   ├── feature.module.ts
│   │   ├── feature.controller.ts
│   │   ├── feature.service.ts
│   │   ├── feature.schema.ts
│   │   ├── feature.request.ts (if needed)
│   │   └── dto/
│   │       └── create-feature.dto.ts
│   └── [other features...]
│
├── config/              # App config entry point
│   └── config-root.module.ts
│
└── app.module.ts        # Main app module
```

**Layer Rules (STRICT)**:
| Layer | Allowed | Forbidden |
|-------|---------|-----------|
| `core/` | Pure TS, no imports from NestJS | NestJS decorators, HTTP concepts |
| `infrastructure/` | NestJS, external libs, adapters | Business logic |
| `modules/` | Feature logic (Controller → Service → Schema) | Cross-module DB access |

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 Core Features
- [ ] Feature 1: [Tên + mô tả ngắn]
  - User flow: [Bước 1 → 2 → 3]
  - API endpoints: [List endpoints]
  
- [ ] Feature 2: [...]

### 2.2 User Roles & Permissions
- **Admin**: Full access
- **User**: [Specific permissions]
- **Guest**: [Public endpoints]

### 2.3 Cross-cutting Concerns
- [ ] **Authentication**: JWT + refresh token flow
- [ ] **Authorization**: Role-based access control (RBAC)
- [ ] **Logging & Monitoring**: Winston logs + request/error tracking
- [ ] **Error Handling**: Centralized AppError → HTTP response mapping
- [ ] **Validation**: Zod for env, class-validator for DTOs

---

## 3. DATABASE SCHEMA

### Entities & Relationships
```
User
├── _id: ObjectId (PK)
├── email: String (unique, indexed)
├── passwordHash: String
├── firstName: String
├── lastName: String
├── roles: [String] (enum: admin, user, etc.)
├── createdAt: Date (indexed)
├── updatedAt: Date

Feature
├── _id: ObjectId (PK)
├── userId: ObjectId (FK → User, indexed)
├── title: String (indexed)
├── description: String
├── status: String (enum: draft, active, archived, indexed)
├── metadata: Object
├── createdAt: Date (indexed)
├── updatedAt: Date
```

**Indexes to Create**:
- `User`: email, createdAt
- `Feature`: userId + status, createdAt
- [Add per feature...]

---

## 4. API SPECIFICATION

### 4.1 Authentication Endpoints

```
POST /auth/register
  Request: { email, password, firstName, lastName }
  Response: 201 { accessToken, refreshToken, user }
  Errors: CONFLICT (email exists), VALIDATION_ERROR

POST /auth/login
  Request: { email, password }
  Response: 200 { accessToken, refreshToken, user }
  Errors: UNAUTHORIZED, VALIDATION_ERROR

POST /auth/refresh
  Request: { refreshToken }
  Response: 200 { accessToken }
  Errors: UNAUTHORIZED

POST /auth/logout
  Guards: JwtAccessGuard
  Response: 200 { message: "Logged out" }
```

### 4.2 Feature Endpoints

```
GET /features
  Guards: JwtAccessGuard
  Query params: page, limit, status, sortBy
  Response: 200 { data: Feature[], pagination: { total, page, limit } }

GET /features/:id
  Guards: JwtAccessGuard
  Response: 200 { Feature }
  Errors: NOT_FOUND

POST /features
  Guards: JwtAccessGuard, PermissionGuard('feature.create')
  Request: CreateFeatureDto
  Response: 201 { Feature }
  Errors: VALIDATION_ERROR, FORBIDDEN

PUT /features/:id
  Guards: JwtAccessGuard, PermissionGuard('feature.update')
  Request: UpdateFeatureDto
  Response: 200 { Feature }
  Errors: NOT_FOUND, FORBIDDEN, VALIDATION_ERROR

DELETE /features/:id
  Guards: JwtAccessGuard, PermissionGuard('feature.delete')
  Response: 204
  Errors: NOT_FOUND, FORBIDDEN
```

### 4.3 Error Responses

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Feature not found",
    "statusCode": 404
  }
}
```

Possible error codes (from `core/errors/AppErrorCode`):
- `NOT_FOUND`, `CONFLICT`, `UNAUTHORIZED`, `FORBIDDEN`, `VALIDATION_ERROR`, `INTERNAL_SERVER_ERROR`, etc.

---

## 5. MODULE PATTERN

### Example: FeatureModule

**feature.module.ts**:
```typescript
@Module({
  imports: [MongooseModule.forFeature([{ name: Feature.name, schema: FeatureSchema }])],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService], // If other modules need it
})
export class FeatureModule {}
```

**feature.controller.ts**:
```typescript
@Controller('features')
@UseGuards(JwtAccessGuard)
export class FeatureController {
  constructor(private featureService: FeatureService) {}

  @Post()
  @UseGuards(PermissionGuard)
  @PermissionsDecorator('feature.create')
  async create(@Body() dto: CreateFeatureDto, @AuthUser() user: UserRequest) {
    return this.featureService.create(dto, user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.featureService.findOne(id);
  }
}
```

**feature.service.ts**:
```typescript
@Injectable()
export class FeatureService {
  constructor(@InjectModel(Feature.name) private model: FeatureModel) {}

  async create(dto: CreateFeatureDto, user: UserRequest): Promise<Feature> {
    // Business logic here
    // Throw AppError (NOT HttpException)
    if (!user) throw new AppError(AppErrorCode.UNAUTHORIZED, 'User required');
    
    return this.model.create({ ...dto, userId: user.id });
  }

  async findOne(id: string): Promise<Feature> {
    const doc = await this.model.findById(id).select('-__v').lean();
    if (!doc) throw new AppError(AppErrorCode.NOT_FOUND, 'Feature not found');
    return doc;
  }
}
```

**feature.schema.ts**:
```typescript
@Schema({ timestamps: true })
export class Feature {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, index: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ enum: ['draft', 'active', 'archived'], index: true, default: 'draft' })
  status: string;
}

export const FeatureSchema = SchemaFactory.createForClass(Feature);
export type FeatureDocument = HydratedDocument<Feature>;
export type FeatureModel = Model<FeatureDocument>;
```

**dto/create-feature.dto.ts**:
```typescript
export class CreateFeatureDto {
  @ApiProperty({ example: 'Feature Title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
```

---

## 6. ERROR HANDLING & VALIDATION

### Error Handling Pattern
```typescript
// ❌ DON'T: in services
throw new BadRequestException('Invalid input');

// ✅ DO: in services
throw new AppError(AppErrorCode.VALIDATION_ERROR, 'Invalid input');

// GlobalExceptionFilter catches & maps to HTTP response automatically
```

### Validation Pattern
```typescript
// ✅ Use class-validator in DTOs
export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}

// ✅ Use Zod for environment variables (config layer)
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
});
```

---

## 7. AUTHENTICATION & AUTHORIZATION

### JWT Flow
```
Client → POST /auth/login (email, password)
                ↓
API → Hash password, verify user
                ↓
       Generate JWT accessToken (15 min) + refreshToken (7 days)
                ↓
Response: { accessToken, refreshToken, user }
```

### Guard Order
```typescript
@UseGuards(JwtAccessGuard, PermissionGuard)
@PermissionsDecorator('resource.action')
@Post('endpoint')
```

1. **JwtAccessGuard**: Validates JWT signature + expiry → populates `req.user`
2. **PermissionGuard**: Checks `req.user.roles` vs. required permissions
3. **@AuthUser()**: Decorator to extract authenticated user into method param

---

## 8. CONFIG PATTERN

Never use `process.env` directly in modules. Always inject config services:

```typescript
// ❌ DON'T
const port = process.env.PORT;

// ✅ DO
constructor(private appConfig: AppConfigService) {}
const port = this.appConfig.getPort();
```

**Available Config Services**:
- `AppConfigService`: app settings (port, env, JWT secrets, etc.)
- `MongoConfigService`: MongoDB URI

Both are provided globally by `ConfigRootModule` (`@Global()`).

---

## 9. LOGGING

```typescript
// Inject logger
constructor(private logger: Logger) {}

// Use logger
this.logger.log('User created', { userId: user.id });
this.logger.error('Database error', { error: err.message }, FeatureService.name);
```

Logs are:
- Written to `logs/app.log` (JSON format)
- Exposed via Winston service
- Traced with request ID (correlation)

---

## 10. KANBAN TASK BREAKDOWN (CRITICAL)

### Phase 0: Project Setup
- [ ] **TASK-00: Environment & Config Setup**
  - Description: Tạo .env.example, setup AppConfigService + MongoConfigService, validate all env vars via Zod
  - DoD: `npm run start:dev` chạy không lỗi, env vars validated at startup

### Phase 1: Core Infrastructure
- [ ] **TASK-01: Error Handling & AppError**
  - Description: Implement AppErrorCode enum, AppError class, ErrorMapper, GlobalExceptionFilter
  - DoD: Throwing AppError from service automatically maps to HTTP response with correct status code

- [ ] **TASK-02: Authentication Infrastructure**
  - Description: Setup JWT + Passport, implement JwtAccessGuard, @AuthUser() decorator
  - DoD: POST /auth/login returns valid JWT, subsequent requests with token work

- [ ] **TASK-03: Authorization Infrastructure**
  - Description: Implement PermissionGuard, @PermissionsDecorator(), user roles enum
  - DoD: Endpoints with @PermissionsDecorator protect against unauthorized users

- [ ] **TASK-04: Logging Infrastructure**
  - Description: Setup Winston logger, LoggingMiddleware for request/response tracing
  - DoD: All requests logged with correlation ID, error traces include stack

### Phase 2: Core Features
- [ ] **TASK-05: User Module (Auth + Profile)**
  - Description: UserModule, register/login/refresh endpoints, User schema, UserService
  - DoD: Can register new user, login returns JWT, refresh token works, /profile endpoint returns current user

- [ ] **TASK-06: [Feature Name] Module**
  - Description: Feature CRUD endpoints, schema, service, DTOs
  - DoD: All CRUD operations work, validation errors return proper HTTP 400, permission checks work

- [ ] **TASK-07: [Another Feature] Module**
  - Description: [...]
  - DoD: [...]

### Phase 3: Polish & Deployment
- [ ] **TASK-08: Testing & Documentation**
  - Description: Unit tests for services, E2E tests for API endpoints, Swagger/OpenAPI docs
  - DoD: >80% code coverage, E2E tests all pass, Swagger docs reflect API spec

- [ ] **TASK-09: Performance & Optimization**
  - Description: Add database indexes, caching (Redis if needed), query optimization
  - DoD: All endpoints respond <200ms on typical queries, no N+1 queries

- [ ] **TASK-10: Deployment & Monitoring**
  - Description: Docker setup, CI/CD pipeline, production env vars, error tracking (Sentry, etc.)
  - DoD: API runs in Docker, GitHub Actions CI passes all tests, errors logged to external service

---

## 11. CONSTRAINTS & NOTES

### Code Quality
- Follow NestJS official guidelines & best practices
- Use strict TypeScript (no `any`, no `!` assertions)
- Run ESLint before commit: `npm run lint`

### Testing
- Unit tests: Services via Moq/jest.mock()
- E2E tests: Real MongoDB + API endpoints
- Minimum coverage: 70% services, 50% controllers

### Error Cases to Handle
- User not found → 404 NOT_FOUND
- Email already exists → 409 CONFLICT
- Invalid JWT → 401 UNAUTHORIZED
- Missing permissions → 403 FORBIDDEN
- Validation errors → 400 VALIDATION_ERROR
- Unhandled errors → 500 INTERNAL_SERVER_ERROR (logged)

### Security Best Practices
- Never log passwords or sensitive data
- Use `.select('-password')` when querying users
- Validate & sanitize all inputs (class-validator)
- Use helmet.js middleware (if not already enabled)
- Implement rate limiting on auth endpoints
- CORS policy: Only allow trusted origins

### Documentation
- Each endpoint should have @ApiOperation + @ApiResponse decorators
- Generate Swagger docs: `npm run swagger` (if setup)
- Keep README.md updated with quick-start instructions
