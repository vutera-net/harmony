# AUTO-GENERATE API DOCS (SWAGGER/OPENAPI)

## CONTEXT
Tự động generate OpenAPI/Swagger documentation từ NestJS decorators. Giữ docs luôn sync với code.

---

## SWAGGER SETUP

### 1. Install Dependencies

```bash
npm install @nestjs/swagger swagger-ui-express
```

### 2. Setup in main.ts

```typescript
// src/main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('EUP API')
    .setDescription('NestJS Backend API')
    .setVersion('1.0.0')
    .addServer('http://localhost:3000', 'Local')
    .addServer('https://staging.example.com', 'Staging')
    .addServer('https://api.example.com', 'Production')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('features', 'Feature management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(3000);
  console.log('Swagger UI available at http://localhost:3000/api/docs');
}

bootstrap();
```

### 3. Controller Decorators

```typescript
// src/modules/feature/feature.controller.ts

@Controller('features')
@ApiTags('features')
@UseGuards(JwtAccessGuard)
export class FeatureController {
  constructor(private featureService: FeatureService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new feature',
    description: 'Creates a new feature for the authenticated user',
  })
  @ApiCreatedResponse({
    description: 'Feature created successfully',
    type: FeatureResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async create(
    @Body() dto: CreateFeatureDto,
    @AuthUser() user: UserRequest,
  ): Promise<FeatureResponseDto> {
    return this.featureService.create(dto, user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get feature by ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Feature ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({
    description: 'Feature found',
    type: FeatureResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Feature not found' })
  async findOne(@Param('id') id: string): Promise<FeatureResponseDto> {
    return this.featureService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'List all features (paginated)' })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    example: 20,
  })
  @ApiOkResponse({
    description: 'Features list with pagination',
    schema: {
      example: {
        items: [{ id: '...', title: '...' }],
        total: 100,
        page: 1,
        limit: 20,
      },
    },
  })
  async list(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.featureService.list(page, limit);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update feature' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOkResponse({ description: 'Feature updated', type: FeatureResponseDto })
  @ApiNotFoundResponse({ description: 'Feature not found' })
  @ApiForbiddenResponse({ description: 'Not authorized' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateFeatureDto,
    @AuthUser() user: UserRequest,
  ): Promise<FeatureResponseDto> {
    return this.featureService.update(id, dto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete feature' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiNoContentResponse({ description: 'Feature deleted' })
  @ApiNotFoundResponse({ description: 'Feature not found' })
  @ApiForbiddenResponse({ description: 'Not authorized' })
  async delete(
    @Param('id') id: string,
    @AuthUser() user: UserRequest,
  ): Promise<void> {
    return this.featureService.delete(id, user.id);
  }
}
```

### 4. DTO Decorators

```typescript
// src/modules/feature/dto/create-feature.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateFeatureDto {
  @ApiProperty({
    description: 'Feature title',
    minLength: 1,
    maxLength: 255,
    example: 'User Dashboard',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    description: 'Feature description',
    example: 'A comprehensive dashboard for users to manage their profile',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Feature status',
    enum: ['draft', 'active', 'archived'],
    default: 'draft',
  })
  @IsEnum(['draft', 'active', 'archived'])
  @IsOptional()
  status?: string;
}

export class FeatureResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'MongoDB ObjectId',
  })
  id: string;

  @ApiProperty({ example: 'User Dashboard' })
  title: string;

  @ApiProperty({ example: 'A comprehensive dashboard...' })
  description?: string;

  @ApiProperty({ example: 'active' })
  status: string;

  @ApiProperty({
    example: '2026-04-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-04-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}
```

### 5. Global Error Response

```typescript
// Add to DocumentBuilder:
builder.addBearerAuth({
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Enter JWT token',
});

// Add to controllers:
@ApiUnauthorizedResponse({
  description: 'Not authenticated',
  schema: {
    example: {
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
        statusCode: 401,
      },
    },
  },
})
```

---

## GENERATE SWAGGER JSON

### Manually

```bash
npm run swagger
# Generates: docs/swagger.json + docs/swagger-ui.html
```

### Automatically

Add to `package.json`:

```json
{
  "scripts": {
    "swagger": "npm run build && npx swagger-cli bundle ./docs/swagger.json -o ./docs/swagger-ui.json"
  }
}
```

---

## EXPORT SWAGGER JSON

```bash
# Save Swagger JSON from running server
curl http://localhost:3000/api-json > docs/swagger.json
```

---

## INTEGRATION WITH CI/CD

In `on-merge.md`:

```yaml
- name: Generate Swagger docs
  run: npm run swagger

- name: Commit Swagger updates
  run: |
    git add docs/swagger.json
    git commit -m "docs: update Swagger documentation" || true
    git push
```

---

## PUBLISH API DOCS

### Option 1: Host on GitHub Pages

```yaml
# .github/workflows/publish-docs.yml
jobs:
  publish-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Generate Swagger
        run: npm run swagger
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

Visit: `https://your-org.github.io/repo-name/swagger-ui.html`

### Option 2: Host on Swagger Hub

```bash
# Publish to Swagger Hub
npx swagger-cli deploy \
  docs/swagger.json \
  -u $SWAGGER_HUB_USER:$SWAGGER_HUB_PASSWORD \
  -r org/api/1.0.0
```

### Option 3: Serve from API

Swagger UI is already available at:
```
http://localhost:3000/api/docs
```

---

## BEST PRACTICES

### 1. Complete All Decorators

```typescript
// ✅ GOOD: Complete with all response codes
@Post()
@ApiOperation({ summary: 'Create feature' })
@ApiBody({ type: CreateFeatureDto })
@ApiCreatedResponse({ type: FeatureResponseDto })
@ApiBadRequestResponse({ description: 'Invalid input' })
@ApiUnauthorizedResponse({ description: 'Not authenticated' })
@ApiInternalServerErrorResponse({ description: 'Server error' })
async create(@Body() dto: CreateFeatureDto) { ... }
```

```typescript
// ❌ BAD: Missing response documentation
@Post()
async create(@Body() dto: CreateFeatureDto) { ... }
```

### 2. Type Every Response

```typescript
@Get(':id')
@ApiOkResponse({ type: FeatureResponseDto })  // ← Explicit type
async findOne(@Param('id') id: string) { ... }
```

### 3. Document Query/Path Parameters

```typescript
@Get(':id')
@ApiParam({
  name: 'id',
  type: 'string',
  description: 'Feature ID',
  example: '507f1f77bcf86cd799439011',
})
@ApiQuery({
  name: 'includeDetails',
  type: 'boolean',
  required: false,
  description: 'Include full details',
})
async findOne(
  @Param('id') id: string,
  @Query('includeDetails') includeDetails?: boolean,
) { ... }
```

### 4. Add Examples to DTOs

```typescript
export class CreateFeatureDto {
  @ApiProperty({
    example: 'User Dashboard',
    description: 'Feature title',
  })
  title: string;
}
```

### 5. Group Endpoints with Tags

```typescript
@Controller('features')
@ApiTags('features')  // ← Groups in Swagger UI
export class FeatureController { ... }

@Controller('auth')
@ApiTags('auth')
export class AuthController { ... }
```

---

## VALIDATION IN SWAGGER

DTOs automatically generate request schema:

```typescript
export class CreateFeatureDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @IsEmail()
  email: string;

  @IsEnum(['draft', 'active'])
  status: string;
}

// Swagger automatically shows:
// - title: required, string, length 1-255
// - email: required, string, email format
// - status: required, enum: [draft, active]
```

---

## MONITORING SWAGGER

Add to CI/CD to ensure Swagger stays updated:

```bash
# Check if Swagger is valid
npm run swagger -- --validate

# Compare Swagger versions
diff docs/swagger.old.json docs/swagger.json
```

---

## USEFUL SWAGGER DECORATORS

```typescript
// Request/Response
@ApiBody({ type: CreateFeatureDto })
@ApiOkResponse({ type: FeatureResponseDto })
@ApiCreatedResponse({ ... })
@ApiNoContentResponse()

// Parameters
@ApiParam({ name: 'id', type: 'string' })
@ApiQuery({ name: 'page', type: 'number' })
@ApiHeader({ name: 'X-Custom-Header', required: false })

// Authentication
@ApiBearerAuth()
@ApiSecurity('api_key')

// Errors
@ApiBadRequestResponse()
@ApiUnauthorizedResponse()
@ApiForbiddenResponse()
@ApiNotFoundResponse()
@ApiInternalServerErrorResponse()

// Organization
@ApiTags('features')
@ApiOperation({ summary: '...', description: '...' })

// Documentation
@ApiProperty({ description: '...', example: '...' })
@ApiPropertyOptional()
```

---

## RESULT

Auto-generated API docs will be available at:

✅ **Swagger UI**: `http://localhost:3000/api/docs`  
✅ **OpenAPI JSON**: `http://localhost:3000/api-json`  
✅ **Auto-synced**: Updated on every merge  
✅ **Always accurate**: Generated from code  

**Zero manual documentation needed.** ✨
