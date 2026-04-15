# TEST COVERAGE REQUIREMENTS

## CONTEXT
Để đảm bảo code quality + prevent regressions, mỗi PR cần đạt minimum coverage targets. Checklist này giúp dev & reviewer xác nhận coverage yêu cầu.

---

## COVERAGE TARGETS (Minimum)

| Layer | Target | Why |
|-------|--------|-----|
| **Services** | **>70%** | Core business logic → must be tested |
| **Controllers** | **>50%** | HTTP layer → mostly delegation to service (tested via E2E) |
| **Schemas** | **>30%** | Model definitions → less critical |
| **Guards/Filters** | **>60%** | Security-critical → test auth flows |
| **Critical Paths** | **100%** | Payment, auth, data mutations → zero tolerance |

---

## RUNNING COVERAGE

### Check Current Coverage
```bash
npm run test:cov

# Output:
# ========== Coverage summary ==========
# Statements   : 65.23% ( 450/689 )
# Branches     : 58.47% ( 125/214 )
# Functions    : 72.34% ( 98/135 )
# Lines        : 66.89% ( 461/689 )
```

### Check Coverage for Specific File
```bash
npm test -- src/modules/feature/feature.service.ts --coverage
```

### Generate HTML Report
```bash
npm run test:cov
# Open coverage/index.html in browser to see line-by-line coverage
```

---

## UNIT TEST TEMPLATE (Services)

```typescript
// src/modules/feature/feature.service.spec.ts

describe('FeatureService', () => {
  let service: FeatureService;
  let mockModel: jest.Mocked<FeatureModel>;

  beforeEach(() => {
    mockModel = {
      findById: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    } as any;

    service = new FeatureService(mockModel);
  });

  describe('findOne', () => {
    it('should return feature if found', async () => {
      const featureId = '507f1f77bcf86cd799439011';
      const mockFeature = { _id: featureId, title: 'Test' };
      mockModel.findById.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockFeature),
      });

      const result = await service.findOne(featureId);
      expect(result).toEqual(mockFeature);
    });

    it('should throw NOT_FOUND if feature not found', async () => {
      mockModel.findById.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.findOne('invalid')).rejects.toThrow(
        expect.objectContaining({
          code: AppErrorCode.NOT_FOUND,
        }),
      );
    });
  });

  describe('create', () => {
    it('should create feature with user ID', async () => {
      const dto: CreateFeatureDto = { title: 'New Feature' };
      const userId = 'user-123';
      const expected = { _id: 'feature-123', ...dto, userId };
      mockModel.create.mockResolvedValueOnce(expected);

      const result = await service.create(dto, userId);
      expect(result).toEqual(expected);
      expect(mockModel.create).toHaveBeenCalledWith({ ...dto, userId });
    });

    it('should throw error if user ID is missing', async () => {
      const dto: CreateFeatureDto = { title: 'New Feature' };
      await expect(service.create(dto, '')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update feature if authorized', async () => {
      const featureId = 'feature-123';
      const userId = 'user-123';
      const dto: UpdateFeatureDto = { title: 'Updated' };
      const updated = { _id: featureId, userId, ...dto };
      
      mockModel.findByIdAndUpdate.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(updated),
      });

      const result = await service.update(featureId, dto, userId);
      expect(result).toEqual(updated);
    });

    it('should throw FORBIDDEN if not owner', async () => {
      mockModel.findById.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce({ userId: 'other-user' }),
      });

      await expect(
        service.update('feature-123', {}, 'different-user')
      ).rejects.toThrow(AppErrorCode.FORBIDDEN);
    });
  });
});
```

---

## E2E TEST TEMPLATE (Controllers)

```typescript
// src/modules/feature/feature.e2e-spec.ts

describe('FeatureController (E2E)', () => {
  let app: INestApplication;
  let connection: Connection;
  let featureModel: Model<FeatureDocument>;
  let userModel: Model<UserDocument>;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGO_URL_TEST || 'mongodb://localhost/test'),
        FeatureModule,
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    connection = moduleFixture.get(Connection);
    featureModel = moduleFixture.get(getModelToken(Feature.name));
    userModel = moduleFixture.get(getModelToken(User.name));

    // Create test user + get token
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123',
        firstName: 'John',
        lastName: 'Doe',
      })
      .expect(201)
      .then(res => {
        accessToken = res.body.accessToken;
      });

    const user = await userModel.findOne({ email: 'test@example.com' });
    userId = user._id.toString();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await app.close();
  });

  describe('POST /features (create)', () => {
    it('should create feature with valid DTO', () => {
      return request(app.getHttpServer())
        .post('/features')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Feature',
          description: 'A test feature',
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.title).toBe('Test Feature');
          expect(res.body.userId).toBe(userId);
        });
    });

    it('should return 400 if title missing', () => {
      return request(app.getHttpServer())
        .post('/features')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ description: 'No title' })
        .expect(400);
    });

    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .post('/features')
        .send({ title: 'Test' })
        .expect(401);
    });
  });

  describe('GET /features/:id (read)', () => {
    let featureId: string;

    beforeEach(async () => {
      const feature = await featureModel.create({
        userId,
        title: 'Test Feature',
      });
      featureId = feature._id.toString();
    });

    it('should return feature if found', () => {
      return request(app.getHttpServer())
        .get(`/features/${featureId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body._id).toBe(featureId);
        });
    });

    it('should return 404 if not found', () => {
      return request(app.getHttpServer())
        .get('/features/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('PUT /features/:id (update)', () => {
    let featureId: string;

    beforeEach(async () => {
      const feature = await featureModel.create({
        userId,
        title: 'Original Title',
      });
      featureId = feature._id.toString();
    });

    it('should update feature if owner', () => {
      return request(app.getHttpServer())
        .put(`/features/${featureId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Updated Title' })
        .expect(200)
        .expect(res => {
          expect(res.body.title).toBe('Updated Title');
        });
    });

    it('should return 403 if not owner', async () => {
      // Create another user
      const otherUserRes = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'other@example.com',
          password: 'SecurePass123',
          firstName: 'Jane',
          lastName: 'Doe',
        });
      const otherToken = otherUserRes.body.accessToken;

      return request(app.getHttpServer())
        .put(`/features/${featureId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ title: 'Hacked' })
        .expect(403);
    });
  });

  describe('DELETE /features/:id (delete)', () => {
    let featureId: string;

    beforeEach(async () => {
      const feature = await featureModel.create({
        userId,
        title: 'To Delete',
      });
      featureId = feature._id.toString();
    });

    it('should delete feature if owner', () => {
      return request(app.getHttpServer())
        .delete(`/features/${featureId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it('should return 404 if already deleted', async () => {
      await featureModel.findByIdAndDelete(featureId);

      return request(app.getHttpServer())
        .delete(`/features/${featureId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
```

---

## AUTH FLOW TESTS

```typescript
describe('Auth E2E', () => {
  describe('POST /auth/register', () => {
    it('should register new user with valid email/password', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'SecurePass123',
          firstName: 'New',
          lastName: 'User',
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
        });
    });

    it('should return 409 if email already registered', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'SecurePass123',
          firstName: 'User1',
          lastName: 'Test',
        });

      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'DifferentPass123',
          firstName: 'User2',
          lastName: 'Test',
        })
        .expect(409);
    });

    it('should return 400 if password too short', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'short',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should return tokens if credentials valid', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123',
        })
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
        });
    });

    it('should return 401 if email not found', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'AnyPassword123',
        })
        .expect(401);
    });

    it('should return 401 if password wrong', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123',
        })
        .expect(401);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should return new accessToken if refreshToken valid', async () => {
      const registerRes = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'refresh-test@example.com',
          password: 'SecurePass123',
          firstName: 'Refresh',
          lastName: 'Test',
        });

      const refreshToken = registerRes.body.refreshToken;

      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('accessToken');
        });
    });

    it('should return 401 if refreshToken invalid', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);
    });
  });
});
```

---

## CRITICAL PATHS (100% Coverage Required)

These must have full coverage (happy path + all error cases):

1. **Auth Service**
   - register() — valid user, duplicate email, validation error
   - login() — valid credentials, user not found, wrong password
   - refresh() — valid token, invalid token, expired token

2. **Payment/Billing Service** (if exists)
   - createTransaction() — success, insufficient funds, invalid card
   - refund() — success, not found, already refunded

3. **Data Mutation Endpoints**
   - create() — success, validation error, permission denied
   - update() — success, not found, not authorized
   - delete() — success, not found, not authorized

---

## COVERAGE REPORT CHECKLIST

Before merging, verify:

- [ ] `npm run test:cov` shows overall coverage ≥65%
- [ ] Services >70% coverage
- [ ] Controllers >50% coverage
- [ ] No critical paths with <100% coverage
- [ ] E2E tests cover happy path + error cases
- [ ] Auth flows tested (register, login, refresh, expired tokens)
- [ ] Permission checks tested (authorized, forbidden)
- [ ] Error responses tested (404, 400, 403, 500)
- [ ] HTML coverage report reviewed (no unexpectedly low coverage)

**Command to check before merge**:
```bash
npm run test:cov && npm run test:e2e
# Ensure no coverage decrease vs. main branch
```

---

## COVERAGE DECREASE IS A BLOCKER

If this PR decreases coverage:
1. Identify which files have lower coverage
2. Add tests to bring coverage back up
3. OR mark new code with /* istanbul ignore next */ if untestable
4. Rerun coverage and confirm improved

**Git hook option** (auto-check before commit):
```bash
# In .husky/pre-commit:
npm run test:cov || exit 1
```
