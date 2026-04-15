# PERFORMANCE TARGETS & OPTIMIZATION

## CONTEXT
Để đảm bảo API responsive + scalable, cần đạt performance targets. Checklist này giúp dev & reviewer xác nhận performance requirements.

---

## PERFORMANCE TARGETS

| Metric | Target | Measurement |
|--------|--------|-------------|
| **API Response Time (p95)** | **<200ms** | Typical request (e.g., GET /features) |
| **Auth Endpoints (p95)** | **<300ms** | /auth/login, /auth/register |
| **Bulk Operations (p95)** | **<2s** | Create 100+ items |
| **Database Query (p95)** | **<50ms** | Single DB query |
| **Memory Usage** | **<200MB** | Baseline heap (not including data) |
| **CPU Usage** | **<30%** | Average under normal load |
| **Throughput** | **>1000 req/s** | Concurrent requests |

---

## MEASURING PERFORMANCE

### 1. Local Development

**Manual Timing**:
```bash
# Start server
npm run start:dev

# Time a request
time curl http://localhost:3000/features?page=1

# Should show: real 0m0.150s (150ms, within target)
```

**Using Apache Bench**:
```bash
# Install: brew install httpd (macOS) or apt-get install apache2-utils
ab -n 1000 -c 10 http://localhost:3000/health

# Output:
# Requests per second: 1200 [#/sec]
# Time per request: 8.3 [ms] (mean)
```

**Using wrk (better)**:
```bash
# Install: brew install wrk
wrk -t4 -c100 -d30s http://localhost:3000/features

# Shows: throughput, latency percentiles
```

### 2. Production Monitoring

**New Relic / DataDog / CloudWatch**:
- Track p50, p95, p99 latencies
- Alert if response time >500ms
- Track error rates + exceptions

**Node.js Built-in Profiling**:
```bash
node --inspect src/main.js
# Open chrome://inspect to profile CPU + memory
```

---

## OPTIMIZATION CHECKLIST

### Database Queries

- [ ] **Indexes on frequently queried fields**
  ```typescript
  // src/modules/feature/feature.schema.ts
  @Schema()
  export class Feature {
    @Prop({ index: true })  // ← Add index for common queries
    userId: string;

    @Prop({ index: true })
    status: string;

    @Prop({ index: true })
    createdAt: Date;
  }

  // Multi-field index for common filter combinations
  FeatureSchema.index({ userId: 1, status: 1, createdAt: -1 });
  ```

- [ ] **No N+1 queries** (use `.populate()` strategically)
  ```typescript
  // ❌ BAD: N+1 query
  const features = await Feature.find({ userId });
  for (const feature of features) {
    const author = await User.findById(feature.authorId); // Loop = N queries
  }

  // ✅ GOOD: Single query with populate
  const features = await Feature.find({ userId }).populate('author').lean();
  ```

- [ ] **Use `.lean()` for read-only queries** (5-10x faster)
  ```typescript
  // ❌ Returns Mongoose document (heavier)
  const feature = await Feature.findById(id);

  // ✅ Returns plain JS object (faster)
  const feature = await Feature.findById(id).lean();
  ```

- [ ] **Pagination on list endpoints** (don't load 100K items)
  ```typescript
  @Get()
  async list(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    const skip = (page - 1) * limit;
    const items = await this.model.find().skip(skip).limit(limit);
    return { items, total, page, limit };
  }
  ```

- [ ] **Field projection** (select only needed fields)
  ```typescript
  // ❌ Loads all fields + secret ones
  const users = await User.find();

  // ✅ Loads only needed fields
  const users = await User.find().select('id firstName lastName -password').lean();
  ```

- [ ] **Query timeouts** (prevent long-running queries)
  ```typescript
  // In mongo connection:
  mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,  // 5s timeout for query
  });
  ```

- [ ] **Batch operations** for bulk inserts/updates
  ```typescript
  // ❌ Slow: 1000 individual inserts
  for (const item of items) {
    await Item.create(item);
  }

  // ✅ Fast: single bulk operation
  await Item.insertMany(items, { ordered: false });
  ```

### Caching

- [ ] **HTTP caching headers** on read endpoints
  ```typescript
  @Get(':id')
  @SetMetadata('cache', { ttl: 300 }) // 5 minutes
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // Or use @CacheKey() + @CacheTTL() decorators
  ```

- [ ] **Redis caching** for high-read endpoints
  ```typescript
  async findOne(id: string): Promise<Feature> {
    const cached = await this.redis.get(`feature:${id}`);
    if (cached) return JSON.parse(cached);

    const feature = await this.model.findById(id).lean();
    await this.redis.setex(`feature:${id}`, 3600, JSON.stringify(feature));
    return feature;
  }

  // Invalidate cache on update
  async update(id: string, dto: UpdateDto): Promise<Feature> {
    const updated = await this.model.findByIdAndUpdate(id, dto);
    await this.redis.del(`feature:${id}`); // ← Invalidate
    return updated;
  }
  ```

- [ ] **Cache headers strategy**
  ```typescript
  // Public endpoints: cache aggressively
  res.set('Cache-Control', 'public, max-age=3600');

  // Private user data: don't cache
  res.set('Cache-Control', 'private, no-cache');

  // Frequently changing: short TTL
  res.set('Cache-Control', 'public, max-age=60');
  ```

### Request/Response Optimization

- [ ] **Compression enabled** (gzip)
  ```typescript
  // main.ts
  app.use(compression());
  ```

- [ ] **Request size limits** (prevent abuse)
  ```typescript
  app.use(json({ limit: '10kb' })); // Limit POST body
  app.use(urlencoded({ limit: '10kb' }));
  ```

- [ ] **Streaming responses** for large data
  ```typescript
  // Instead of loading all items into memory:
  @Get('export')
  async export(@Res() res: Response) {
    res.setHeader('Content-Type', 'application/json');
    
    const cursor = Item.find().cursor();
    cursor.on('data', (doc) => {
      res.write(JSON.stringify(doc) + '\n');
    });
    cursor.on('end', () => res.end());
  }
  ```

- [ ] **Lazy loading** of related data
  ```typescript
  // Only populate if explicitly requested
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('include') include?: string,
  ) {
    let query = Feature.findById(id);
    if (include?.includes('author')) {
      query = query.populate('author');
    }
    return query.lean();
  }
  ```

### Code Optimization

- [ ] **Async/await over callbacks** (easier to profile)
  ```typescript
  // ✅ Preferred (stack traces clearer)
  async findOne(id: string) {
    return await this.model.findById(id);
  }
  ```

- [ ] **Connection pooling** for database
  ```typescript
  // Mongoose does this automatically
  // But verify pool size if under heavy load:
  mongoose.connect(uri, {
    maxPoolSize: 10,  // Adjust based on load
  });
  ```

- [ ] **Worker threads** for CPU-heavy operations
  ```typescript
  // For expensive crypto/hashing:
  const { Worker } = require('worker_threads');
  
  async function hashPassword(password: string) {
    return new Promise((resolve) => {
      const worker = new Worker('./hash.worker.js');
      worker.on('message', resolve);
      worker.postMessage(password);
    });
  }
  ```

---

## IDENTIFYING BOTTLENECKS

### 1. CPU Profiling
```bash
# Start profiling
node --prof src/main.js

# After running load test, press Ctrl+C
# Generate readable profile
node --prof-process isolate-*.log > profile.txt

# View slowest functions
cat profile.txt | grep "ms" | sort -rn | head -20
```

### 2. Memory Profiling
```bash
# Check for memory leaks
node --inspect src/main.js

# Open chrome://inspect
# Take heap snapshots before/after load test
# Look for unreleased objects
```

### 3. Query Profiling
```typescript
// Enable Mongoose query logging in development:
mongoose.set('debug', true);

// Or use explain() to see query plan:
const explain = await Feature.find({ userId }).explain('executionStats');
console.log(explain.executionStats);
// ← Check: executionStages.executionStages[0] should use index (not COLLSCAN)
```

### 4. Application Metrics
```typescript
// Track metrics manually:
const start = Date.now();
const result = await this.model.find();
const duration = Date.now() - start;

console.log(`Query took ${duration}ms for ${result.length} items`);
// If consistently >50ms, optimize query
```

---

## LOAD TESTING

### Setup Load Test
```bash
# Install k6 (https://k6.io)
brew install k6

# Create test script
cat > load-test.js << 'EOF'
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 100 },  // Ramp to 100 users
    { duration: '1m', target: 500 },   // Spike to 500 users
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],  // 95% of requests <200ms
    http_req_failed: ['rate<0.1'],     // <10% failures
  },
};

export default function () {
  const res = http.get('http://localhost:3000/features');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time <200ms': (r) => r.timings.duration < 200,
  });
}
EOF

# Run test
k6 run load-test.js
```

### Results to Analyze
- **p95 latency**: Should be <200ms
- **Error rate**: Should be <1%
- **Throughput**: Should handle 1000+ req/s (depends on resources)

---

## MONITORING IN PRODUCTION

### Key Metrics to Track

**Response Time**:
```javascript
// New Relic / DataDog
agent.recordMetric('api.response_time', duration, 'ms');
```

**Error Rate**:
```javascript
// Alert if error rate >1%
agent.recordMetric('api.errors', 1, 'count');
```

**Database Performance**:
```javascript
// Track slow queries (>100ms)
if (queryDuration > 100) {
  agent.recordMetric('db.slow_query', queryDuration, 'ms');
}
```

**Memory Usage**:
```javascript
// Alert if memory >500MB
const used = process.memoryUsage().heapUsed / 1024 / 1024;
agent.recordMetric('process.memory', used, 'MB');
```

### Alerting Strategy
```
IF p95_latency > 500ms THEN alert
IF error_rate > 5% THEN page_oncall
IF memory_usage > 80% THEN alert
IF db_connections_exhausted THEN page_oncall
```

---

## PERFORMANCE REGRESSION TEST

Before merging, compare vs. main:

```bash
# Run baseline on main
git stash
npm run build
npm start &  # Start on :3000
wrk -t4 -c100 -d30s http://localhost:3000/features > baseline.txt
kill %1

# Run test on PR branch
git stash pop
npm run build
npm start &  # Start on :3001
wrk -t4 -c100 -d30s http://localhost:3001/features > pr.txt
kill %1

# Compare results
diff baseline.txt pr.txt
# If avg latency increased >10%, investigate optimization
```

---

## COMMON PERFORMANCE ISSUES & FIXES

| Issue | Symptom | Fix |
|-------|---------|-----|
| **Missing index** | Slow queries (>100ms) | Add `@Prop({ index: true })` |
| **N+1 queries** | Query count = N items + 1 | Use `.populate()` or batch |
| **No pagination** | Requests timeout loading 100K rows | Add pagination (limit 20-50) |
| **Large response** | Slow network transfer | Use field projection `.select()` |
| **No caching** | Same data queried repeatedly | Add Redis caching (TTL 1-3600s) |
| **Synchronous code** | Blocking event loop | Use `async/await` |
| **Memory leak** | Heap grows over time | Check for unreleased event listeners |
| **CPU-heavy ops** | 100% CPU during requests | Use worker threads for crypto/compression |

---

## SIGN-OFF CHECKLIST

Before production deploy:

- [ ] Response time p95 <200ms on all endpoints
- [ ] Error rate <1% under normal load
- [ ] Memory usage stable (no leaks)
- [ ] Database indexes on all frequently queried fields
- [ ] No N+1 queries (verified with explain())
- [ ] Pagination on list endpoints
- [ ] Caching implemented for high-read endpoints
- [ ] Compression enabled (gzip)
- [ ] Load test passed (1000+ req/s, p95 <200ms)
- [ ] Monitoring + alerting configured
- [ ] SLA defined (e.g., 99.9% uptime, <200ms p95)
