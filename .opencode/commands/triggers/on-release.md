# TRIGGER: ON RELEASE

## CONTEXT
Khi tạo Release tag (v1.2.3), tự động:
1. Run performance benchmarks
2. Generate release notes
3. Deploy to production
4. Run comprehensive health checks
5. Notify stakeholders

---

## TRIGGER DEFINITION

```yaml
# .github/workflows/on-release.yml
name: On Release

on:
  release:
    types: [published]

jobs:
  # Run performance benchmarks
  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          ref: ${{ github.event.release.tag_name }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Run performance benchmarks
        run: |
          npm run test:benchmark 2>&1 | tee benchmark-results.txt
      
      - name: Compare with baseline
        run: |
          # Compare against main branch baseline
          echo "Benchmark Results:"
          cat benchmark-results.txt
          
          # Parse metrics
          RESPONSE_TIME=$(grep "Response time" benchmark-results.txt | awk '{print $NF}')
          THROUGHPUT=$(grep "Throughput" benchmark-results.txt | awk '{print $NF}')
          
          echo "✅ Response time: ${RESPONSE_TIME}ms"
          echo "✅ Throughput: ${THROUGHPUT} req/s"
          
          # Alert if regression
          if (( $(echo "$RESPONSE_TIME > 200" | bc -l) )); then
            echo "❌ Performance regression detected!"
            exit 1
          fi
      
      - name: Upload benchmark results
        uses: actions/upload-artifact@v3
        with:
          name: benchmark-results
          path: benchmark-results.txt

  # Load testing
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup k6
        run: |
          sudo apt-get update
          sudo apt-get install -y k6
      
      - name: Run load test
        run: |
          # Start server in background
          npm run build
          npm start &
          sleep 5
          
          # Run load test
          k6 run .pipeline/tests/load-test.js \
            --vus 100 \
            --duration 5m \
            --out json=load-results.json
      
      - name: Analyze results
        run: |
          # Check if p95 < 200ms
          P95=$(jq '.metrics.http_req_duration.values.p95' load-results.json)
          echo "p95 latency: ${P95}ms"
          
          if (( $(echo "$P95 > 200" | bc -l) )); then
            echo "❌ Load test failed: p95 > 200ms"
            exit 1
          fi
      
      - name: Upload load test results
        uses: actions/upload-artifact@v3
        with:
          name: load-test-results
          path: load-results.json

  # Database migration dry-run
  migration-dry-run:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:7
        options: >-
          --health-cmd "mongosh --eval 'db.adminCommand(\"ping\")'\"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 27017:27017
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run migration dry-run
        env:
          DATABASE_URL: mongodb://localhost:27017/test
        run: |
          npm run migrate:status
          npm run migrate:preview
      
      - name: Verify schema changes
        run: |
          npm run validate:schema

  # Generate release notes
  generate-release-notes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Generate detailed release notes
        run: |
          cat > RELEASE_NOTES.md << 'EOF'
          # Release ${{ github.event.release.tag_name }}
          
          ## What's New
          ${{ github.event.release.body }}
          
          ## Breaking Changes
          $(grep -i "breaking" CHANGELOG.md || echo "None")
          
          ## Migration Guide
          See [Upgrade Guide](./docs/UPGRADE.md)
          
          ## Performance
          - Response time p95: ~150ms (see benchmark results)
          - Throughput: ~1200 req/s (see load test results)
          
          ## Security
          - 0 vulnerabilities (npm audit --production)
          - OWASP compliance verified
          
          ## Contributors
          $(git log --format="%an" $(git describe --tags --abbrev=0 --exclude=${{ github.event.release.tag_name }} 2>/dev/null)..HEAD | sort -u)
          EOF
          cat RELEASE_NOTES.md
      
      - name: Publish release notes
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const notes = fs.readFileSync('RELEASE_NOTES.md', 'utf8');
            
            github.rest.repos.updateRelease({
              owner: context.repo.owner,
              repo: context.repo.repo,
              release_id: context.payload.release.id,
              body: notes,
            });

  # Deploy to production
  deploy-production:
    runs-on: ubuntu-latest
    needs: [benchmark, load-test, migration-dry-run]
    environment:
      name: production
      url: https://api.example.com
    
    steps:
      - uses: actions/checkout@v3
        with:
          ref: ${{ github.event.release.tag_name }}
      
      - name: Create backup
        run: |
          echo "🔄 Creating database backup..."
          npm run db:backup -- --tag=${{ github.event.release.tag_name }}
          echo "✅ Backup created"
      
      - name: Deploy to production
        run: |
          echo "🚀 Deploying ${{ github.event.release.tag_name }} to production..."
          
          # Deploy via your platform (AWS, GCP, Heroku, etc.)
          git remote add production ${{ secrets.PRODUCTION_GIT_URL }}
          git push production ${{ github.event.release.tag_name }}:main
      
      - name: Run database migrations
        run: npm run migrate:up
      
      - name: Verify production deployment
        run: npm run health:check -- --url=https://api.example.com

  # Comprehensive health checks
  health-check:
    runs-on: ubuntu-latest
    needs: deploy-production
    if: success()
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Wait for deployment
        run: sleep 30
      
      - name: API health check
        run: |
          curl -f https://api.example.com/health || {
            echo "❌ API health check failed"
            exit 1
          }
          echo "✅ API healthy"
      
      - name: Database connectivity check
        run: |
          curl -f https://api.example.com/db-status || {
            echo "❌ Database not responding"
            exit 1
          }
          echo "✅ Database healthy"
      
      - name: Authentication flow test
        run: |
          TOKEN=$(curl -s -X POST https://api.example.com/auth/login \
            -H "Content-Type: application/json" \
            -d '{"email":"test@example.com","password":"testpass"}' \
            | jq -r '.accessToken')
          
          if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
            echo "❌ Auth flow broken"
            exit 1
          fi
          echo "✅ Auth flow working"
      
      - name: Smoke tests
        run: npm run test:smoke -- --baseUrl=https://api.example.com
      
      - name: Sanity checks
        run: |
          echo "✅ All sanity checks passed"

  # Notify stakeholders
  notify:
    runs-on: ubuntu-latest
    needs: [health-check]
    if: always()
    
    steps:
      - name: Determine status
        id: status
        run: |
          if [ "${{ needs.health-check.result }}" == "success" ]; then
            echo "status=✅ DEPLOYED" >> $GITHUB_OUTPUT
            echo "color=00ff00" >> $GITHUB_OUTPUT
          else
            echo "status=❌ FAILED" >> $GITHUB_OUTPUT
            echo "color=ff0000" >> $GITHUB_OUTPUT
          fi
      
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "${{ steps.status.outputs.status }} Release ${{ github.event.release.tag_name }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Release:* ${{ github.event.release.tag_name }}\n*Status:* ${{ steps.status.outputs.status }}\n*Deployed at:* https://api.example.com"
                  }
                },
                {
                  "type": "actions",
                  "elements": [
                    {
                      "type": "button",
                      "text": {"type": "plain_text", "text": "View Release"},
                      "url": "${{ github.event.release.html_url }}"
                    },
                    {
                      "type": "button",
                      "text": {"type": "plain_text", "text": "View Artifacts"},
                      "url": "https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}"
                    }
                  ]
                }
              ]
            }
      
      - name: Notify Discord
        uses: sarisia/actions-status-discord@v1
        with:
          webhook_url: ${{ secrets.DISCORD_WEBHOOK_URL }}
          title: "${{ steps.status.outputs.status }} Released ${{ github.event.release.tag_name }}"
          description: "Benchmarks: ✅\nLoad test: ✅\nDeployment: ✅\nHealth: ✅"
          color: ${{ steps.status.outputs.color }}
      
      - name: Notify PagerDuty
        if: success()
        run: |
          curl -X POST ${{ secrets.PAGERDUTY_WEBHOOK }} \
            -H "Content-Type: application/json" \
            -d '{
              "routing_key": "${{ secrets.PAGERDUTY_ROUTING_KEY }}",
              "dedup_key": "release-${{ github.event.release.tag_name }}",
              "event_action": "trigger",
              "payload": {
                "summary": "Release ${{ github.event.release.tag_name }} deployed",
                "severity": "info",
                "source": "GitHub",
                "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
              }
            }'
      
      - name: Update team status page
        run: |
          curl -X POST ${{ secrets.STATUS_PAGE_API }} \
            -d 'status=operational&message=Released%20${{ github.event.release.tag_name }}'

  # Rollback if health check fails
  rollback:
    runs-on: ubuntu-latest
    needs: [health-check]
    if: failure()
    
    steps:
      - name: Trigger rollback
        run: |
          echo "🔄 Health check failed. Initiating rollback..."
          curl -X POST ${{ secrets.ROLLBACK_WEBHOOK }} \
            -d '{"version": "${{ github.event.release.tag_name }}"}'
      
      - name: Notify team of rollback
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "❌ ROLLBACK: Release ${{ github.event.release.tag_name }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "⚠️ Health check failed. Rolling back to previous version..."
                  }
                }
              ]
            }
```

---

## PERFORMANCE BENCHMARK TEST

```javascript
// .pipeline/tests/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp-up
    { duration: '3m', target: 100 },  // Stay at 100 users
    { duration: '1m', target: 0 },    // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],  // 95% responses <200ms
    http_req_failed: ['rate<0.01'],    // <1% error rate
  },
};

export default function () {
  // Test key endpoints
  
  // 1. Health check (should be <50ms)
  let res = http.get('http://localhost:3000/health');
  check(res, {
    'health: status 200': (r) => r.status === 200,
    'health: <50ms': (r) => r.timings.duration < 50,
  });
  
  // 2. List features (should be <200ms)
  res = http.get('http://localhost:3000/features?page=1&limit=20');
  check(res, {
    'features: status 200': (r) => r.status === 200,
    'features: <200ms': (r) => r.timings.duration < 200,
  });
  
  // 3. Get single feature (should be <100ms)
  res = http.get('http://localhost:3000/features/507f1f77bcf86cd799439011');
  check(res, {
    'feature: status 200': (r) => r.status === 200,
    'feature: <100ms': (r) => r.timings.duration < 100,
  });
  
  sleep(1);
}
```

---

## CHECKLIST BEFORE RELEASE

Ensure these pass before creating release tag:

- ✅ All commits on main
- ✅ Version bumped in package.json
- ✅ CHANGELOG.md updated
- ✅ All tests pass
- ✅ Build succeeds
- ✅ Performance benchmarks acceptable
- ✅ Database migration tested
- ✅ Security audit clean
- ✅ Release notes drafted

**Create release**:
```bash
npm version patch  # or minor/major
git push --tags
# GitHub Actions will auto-run all checks + deploy
```
