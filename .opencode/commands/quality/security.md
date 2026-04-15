# SECURITY CHECKLIST

## CONTEXT
Trước khi release, audit code + deployment cho OWASP Top 10 + common backend vulnerabilities.

---

## OWASP TOP 10 (2024)

### 1. Broken Access Control
- [ ] Authentication required on protected endpoints
- [ ] Authorization checks (RBAC) enforced per resource
- [ ] User cannot access other users' data (userId check)
- [ ] Admin-only endpoints guarded by role check
- [ ] API tokens validated (JWT not expired, valid signature)
- [ ] No hardcoded test credentials in production

**Test**:
```bash
# Unauth request should fail
curl http://localhost:3000/profile
# Should return 401, NOT user data

# Cross-user access should fail
curl -H "Authorization: Bearer <user1-token>" http://localhost:3000/users/user2-id
# Should return 403, NOT user2 data
```

### 2. Cryptographic Failures
- [ ] Passwords hashed with bcrypt (cost ≥10)
- [ ] JWT signed with strong secret (≥32 chars, random)
- [ ] No plaintext secrets in code/logs
- [ ] HTTPS enforced in production (not optional)
- [ ] Sensitive data encrypted at rest (if applicable)
- [ ] Database credentials NOT in `.env.example`

**Check**:
```bash
# Verify JWT secret length
echo $JWT_SECRET | wc -c  # Should be ≥32 chars

# Check password hashing
npm test -- --grep="password"
```

### 3. Injection (SQL, NoSQL, Command)
- [ ] No string concatenation in queries
  ```typescript
  // ❌ BAD: Vulnerable to injection
  await Model.find({ $where: `this.name == "${userName}"` });
  
  // ✅ GOOD: Parametrized
  await Model.find({ name: userName });
  ```

- [ ] User input validated before DB queries
- [ ] No `eval()` or `Function()` constructors
- [ ] Mongoose schemas validate types (required fields, enums)

**Test**:
```typescript
// Test with malicious input
await service.findByName("'; drop table users; --");
// Should fail gracefully, NOT execute injection
```

### 4. Insecure Design
- [ ] Authorization checked at service level (NOT just controller)
- [ ] Rate limiting on auth endpoints (prevent brute force)
  ```typescript
  // In auth.controller.ts:
  @Post('login')
  @RateLimit({ limit: 5, windowMs: 60000 }) // 5 requests/minute
  async login(@Body() dto: LoginDto) { ... }
  ```

- [ ] Weak passwords rejected (min 8 chars, mix of types)
- [ ] Failed login attempts logged (for monitoring)
- [ ] Account lockout after N failed attempts (optional but recommended)

### 5. Security Misconfiguration
- [ ] No debug mode in production (`NODE_ENV=production`)
- [ ] CORS restricted (not `*` in production)
  ```typescript
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });
  ```

- [ ] Helmet.js enabled (HTTP headers)
  ```typescript
  app.use(helmet());
  ```

- [ ] No console.logs in production (use structured logging)
- [ ] Error messages don't expose stack traces to client
- [ ] Sensitive headers removed (X-Powered-By, etc.)

**Check**:
```bash
curl -I http://localhost:3000
# Should see:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# Strict-Transport-Security: (in production)
# NOT: X-Powered-By (reveals tech stack)
```

### 6. Vulnerable & Outdated Components
- [ ] No known vulnerabilities
  ```bash
  npm audit
  # Should show 0 vulnerabilities (or only optional)
  ```

- [ ] Dependencies updated regularly
- [ ] No deprecated libraries used
- [ ] Lock file (package-lock.json) committed

**Command**:
```bash
npm audit --production
npm outdated
```

### 7. Identification & Authentication Failures
- [ ] Password reset uses secure token (random, short-lived)
- [ ] Email verification required (for account creation/changes)
- [ ] Refresh token rotation (new token each refresh)
- [ ] Sessions invalidated on logout
- [ ] Multi-factor auth (optional, but good for admin accounts)

**Test**:
```bash
# After logout, token should be invalid
curl -H "Authorization: Bearer <old-token>" http://localhost:3000/profile
# Should return 401
```

### 8. Software & Data Integrity Failures
- [ ] Dependency versions locked (package-lock.json)
- [ ] Updates reviewed before applying
- [ ] CI/CD runs tests before deploying
- [ ] Deployment artifacts signed (if using Docker)

### 9. Logging & Monitoring Failures
- [ ] All auth attempts logged (success + failures)
- [ ] All data mutations logged (create, update, delete)
- [ ] Errors logged with context (userId, action, timestamp)
- [ ] Logs NOT containing sensitive data (passwords, tokens)
- [ ] Log retention policy (e.g., 30 days)

**Check logs**:
```bash
tail -f logs/app.log | grep -i "login\|create\|delete"
# Should see audit trail
```

### 10. Request Forgery (CSRF, SSRF)
- [ ] CSRF tokens if using cookies (NestJS doesn't need if using Bearer tokens)
- [ ] No arbitrary URL redirects
- [ ] No server-side requests to untrusted URLs (SSRF prevention)

---

## ADDITIONAL SECURITY CHECKS

### Input Validation
- [ ] All DTOs validated with class-validator
- [ ] File uploads (if any) have size/type limits
- [ ] String lengths validated
- [ ] Email format validated
- [ ] Enum values whitelisted

**Example**:
```typescript
export class CreateFeatureDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @IsEmail()
  email: string;

  @IsEnum(['draft', 'active', 'archived'])
  status: string;
}
```

### Sensitive Data Handling
- [ ] Passwords never logged
- [ ] API keys/secrets never logged
- [ ] OAuth tokens never logged
- [ ] PII (names, emails, IPs) logged only when necessary
- [ ] Log level set to `error` in production (not `debug`)

**Bad**:
```typescript
this.logger.log(`Login attempt: ${email}:${password}`);
this.logger.log(`API key: ${apiKey}`);
```

**Good**:
```typescript
this.logger.log(`Login attempt`, { userId, success: true });
this.logger.log(`API request`, { apiKeyId: apiKey.substring(0, 8) });
```

### Database Security
- [ ] Query timeouts set (prevent resource exhaustion)
- [ ] Connection limits enforced
- [ ] Backup strategy in place
- [ ] Database credentials rotated regularly
- [ ] Read replicas used for reports (not modify production)

### API Security
- [ ] Rate limiting on all endpoints (especially auth)
- [ ] Request size limits enforced
- [ ] Timeout on external API calls
- [ ] No sensitive data in URLs (use POST body instead)

**Bad**: `GET /search?password=secret`
**Good**: `POST /search { password: "secret" }`

### Dependency Security
- [ ] ESLint security plugins enabled
  ```bash
  npm install --save-dev eslint-plugin-security
  ```

- [ ] No `eval()`, `exec()`, `spawn()` without input validation
- [ ] YAML parsing safe (not loading untrusted YAML)
- [ ] XML parsing safe (not vulnerable to XXE)

---

## PENETRATION TEST CHECKLIST

Before production, test with these payloads:

### SQL/NoSQL Injection
```bash
# Test with:
curl "http://localhost:3000/search?q=';DROP TABLE users;--"
curl "http://localhost:3000/search?q={\$gt:\"\"}"

# Should return 400 or safe error, NOT execute injection
```

### XSS (if frontend exists)
```bash
# Submit via API:
curl -X POST http://localhost:3000/features \
  -H "Content-Type: application/json" \
  -d '{"title":"<script>alert(1)</script>"}'

# Frontend should escape, NOT render raw HTML
```

### CSRF (if using cookies)
```bash
# Test with cross-origin POST request
# Should be rejected if CSRF protection enabled
```

### Brute Force
```bash
# Send 100 login attempts rapidly
for i in {1..100}; do
  curl -X POST http://localhost:3000/auth/login \
    -d '{"email":"test@example.com","password":"wrong"}'
done

# After N attempts (e.g., 10), should return 429 Too Many Requests
```

---

## SECURITY INCIDENT RESPONSE

If vulnerability found:

1. **Isolate**: Stop affected service if critical
2. **Assess**: Determine severity + blast radius
3. **Patch**: Fix code + deploy immediately
4. **Audit**: Check logs for exploitation
5. **Communicate**: Notify affected users (if data breach)
6. **Document**: Post-mortem + prevent recurrence

---

## PRODUCTION CHECKLIST

Before deploying to production:

- [ ] `npm audit --production` returns 0 vulnerabilities
- [ ] All secrets in `.env` (NOT in code/git)
- [ ] `NODE_ENV=production` set
- [ ] HTTPS enforced (redirect HTTP → HTTPS)
- [ ] CORS restricted to known origins
- [ ] Helmet.js enabled
- [ ] Rate limiting enabled on auth endpoints
- [ ] Structured logging (no debug logs)
- [ ] Error tracking enabled (Sentry, DataDog, etc.)
- [ ] Database backups automated + tested
- [ ] HTTPS certificate valid + auto-renew
- [ ] Security headers verified
- [ ] Secrets rotated (JWT_SECRET, DB password, etc.)
- [ ] Monitoring + alerting configured
- [ ] Incident response plan documented

**Pre-deploy security check**:
```bash
npm audit --production
npm run test
npm run lint
npm run build
# Then deploy with confidence
```

---

## SECURITY RESOURCES

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NestJS Security](https://docs.nestjs.com/security/authentication)
- [Passport.js](https://www.passportjs.org/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8949)
- [Helmet.js](https://helmetjs.github.io/)

---

## RED FLAGS (REJECT IF FOUND)

- ❌ Passwords stored in plaintext
- ❌ API keys/secrets in code or logs
- ❌ SQL/NoSQL injection vulnerabilities
- ❌ Cross-user data access without authorization
- ❌ No authentication on protected endpoints
- ❌ Admin endpoints accessible to regular users
- ❌ Console.logs with sensitive data in production code
- ❌ Known high-severity npm vulnerabilities
- ❌ Weak JWT secret (<16 chars)
- ❌ HTTP (no HTTPS) in production
- ❌ `eval()` or `Function()` constructors
- ❌ No input validation on user data
