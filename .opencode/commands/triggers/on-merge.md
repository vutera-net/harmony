# TRIGGER: ON MERGE

## CONTEXT
Khi PR merge vào main, tự động:
1. Generate documentation
2. Build + deploy artifact
3. Create release notes
4. Update version

---

## TRIGGER DEFINITION

```yaml
# .github/workflows/on-merge.yml
name: On Merge to Main

on:
  push:
    branches:
      - main

jobs:
  # Generate documentation from code
  generate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate API documentation
        run: |
          npx compodoc -p tsconfig.json -d docs/generated-api
          # Or use Swagger: npm run swagger
      
      - name: Generate README from PRD
        run: node .pipeline/ai/docs/generate-readme.js
      
      - name: Generate CHANGELOG
        run: npm run changelog
      
      - name: Commit documentation
        run: |
          git config user.name "CI Bot"
          git config user.email "ci@example.com"
          git add docs/ CHANGELOG.md README.md
          git commit -m "docs: auto-generate documentation" || true
          git push

  # Build Docker image
  build-docker:
    runs-on: ubuntu-latest
    needs: generate-docs
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:latest
            ghcr.io/${{ github.repository }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # Create GitHub Release
  create-release:
    runs-on: ubuntu-latest
    needs: build-docker
    steps:
      - uses: actions/checkout@v3
      
      - name: Get version from package.json
        id: version
        run: |
          VERSION=$(jq -r '.version' package.json)
          echo "version=$VERSION" >> $GITHUB_OUTPUT
      
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          tag_name: v${{ steps.version.outputs.version }}
          body_path: CHANGELOG.md
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  # Deploy to staging
  deploy-staging:
    runs-on: ubuntu-latest
    needs: create-release
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to staging environment
        run: |
          # Example: Deploy to Heroku
          git remote add heroku https://heroku.com/repos/your-staging-app.git
          git push heroku main
      
      - name: Smoke tests on staging
        run: |
          npm run test:smoke -- --baseUrl=https://staging.example.com
      
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "✅ Deployed to staging",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "🚀 New version deployed to staging\n*Version:* ${{ github.sha }}\n*Commit:* ${{ github.event.head_commit.message }}"
                  }
                }
              ]
            }

  # Notify teams
  notify-completion:
    runs-on: ubuntu-latest
    needs: [generate-docs, build-docker, create-release, deploy-staging]
    if: always()
    steps:
      - name: Send Discord notification
        uses: sarisia/actions-status-discord@v1
        with:
          webhook_url: ${{ secrets.DISCORD_WEBHOOK_URL }}
          title: "Merge to main completed"
          description: |
            Documentation generated
            Docker image built
            Release created
            Staging deployed
```

---

## AUTO-GENERATED DOCUMENTATION

### 1. API Documentation
```bash
# Auto-generate Swagger from NestJS decorators
npm run swagger

# Output: docs/swagger.json + swagger-ui.html
```

### 2. README Generator
```javascript
// .pipeline/ai/docs/generate-readme.js
const fs = require('fs');
const path = require('path');

function generateREADME() {
  const prd = fs.readFileSync('docs/PRD.md', 'utf8');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  const readme = `# ${packageJson.name}

${packageJson.description}

## Quick Start

\`\`\`bash
npm install
npm run start:dev
\`\`\

## API Documentation

See [Swagger UI](./docs/swagger-ui.html)

## Architecture

See [CLAUDE.md](./CLAUDE.md)

## Features

${extractFeatures(prd)}

## Testing

\`\`\`bash
npm test          # Unit tests
npm run test:e2e  # E2E tests
npm run test:cov  # Coverage
\`\`\

## Contributing

See [Code Review Checklist](.pipeline/ai/quality/code-review.md)

---

Generated on ${new Date().toISOString()}
`;

  fs.writeFileSync('README.md', readme);
  console.log('✅ README.md generated');
}

function extractFeatures(prd) {
  // Parse features from PRD and format
  return prd.split('\n')
    .filter(line => line.startsWith('- '))
    .join('\n');
}

generateREADME();
```

### 3. Changelog Generator
```bash
# .github/workflows/changelog.yml
# Auto-generate from commit messages

# Install conventional-changelog
npm install -D conventional-changelog-cli

# Add to package.json scripts:
# "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s"

# Generates CHANGELOG.md from commit history:
# ## [1.2.3] - 2026-04-15
# ### Added
# - Feature X
# ### Fixed
# - Bug Y
```

---

## DEPLOYMENT CHECKLIST

Trước deploy, auto-verify:

```yaml
# .github/workflows/pre-deploy-check.yml
jobs:
  pre-deploy:
    steps:
      - name: Verify no secrets in code
        run: git log --oneline -n 1 | grep -i secret && exit 1 || true
      
      - name: Check version bumped
        run: |
          CURRENT_TAG=$(git describe --tags --abbrev=0 || echo "v0.0.0")
          CURRENT_VERSION=$(jq -r '.version' package.json)
          # Version should be newer than last tag
      
      - name: Verify database migrations
        run: npm run migrate:status
      
      - name: Check environment variables
        run: |
          REQUIRED_VARS=(
            "DATABASE_URL"
            "JWT_SECRET"
            "NODE_ENV"
          )
          for var in "${REQUIRED_VARS[@]}"; do
            [ -z "${!var}" ] && echo "❌ $var not set" && exit 1
          done
          echo "✅ All required env vars set"
```

---

## STAGING VS PRODUCTION DEPLOYMENT

### Staging (Auto-deploy on merge)
```yaml
deploy-staging:
  environment:
    name: staging
    url: https://staging.example.com
  steps:
    - run: npm run build
    - run: npm run migrate  # Auto-run migrations
    - run: git push heroku main
    - run: npm run test:smoke  # Run smoke tests
```

### Production (Manual approval)
```yaml
deploy-production:
  environment:
    name: production
    url: https://api.example.com
  needs: deploy-staging
  if: github.ref == 'refs/tags/v*'  # Only on version tags
  steps:
    - name: Deploy
      run: |
        # Require manual approval via GitHub UI
        echo "⏳ Waiting for approval..."
    
    - name: Create backup
      run: npm run db:backup
    
    - name: Deploy to production
      run: npm run deploy:prod
    
    - name: Verify production health
      run: npm run health:check -- --url=https://api.example.com
    
    - name: Notify on-call
      run: |
        curl -X POST ${{ secrets.PAGERDUTY_WEBHOOK }} \
          -d '{"status": "deployed", "version": "${{ github.ref }}"}'
```

---

## ROLLBACK PROCEDURE

Nếu deployment fail:

```yaml
rollback:
  if: failure()
  steps:
    - name: Trigger rollback
      run: |
        # Rollback to previous version
        git revert HEAD
        git push
        # Re-trigger deployment
```

---

## MONITORING POST-DEPLOY

Auto-check sức khỏe sau deploy:

```yaml
health-check:
  needs: deploy-staging
  steps:
    - name: Wait for service to be ready
      run: sleep 30
    
    - name: Check API health
      run: |
        curl -f https://staging.example.com/health || exit 1
    
    - name: Check database connectivity
      run: npm run db:health-check
    
    - name: Run smoke tests
      run: npm run test:smoke
    
    - name: Alert if unhealthy
      if: failure()
      run: |
        curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
          -d '{"text": "⚠️ Deployment health check failed"}'
```

---

## VERSION MANAGEMENT

Auto-bump version:

```yaml
bump-version:
  steps:
    - name: Determine version bump
      id: version
      run: |
        COMMIT_MSG=$(git log --oneline -1)
        if [[ $COMMIT_MSG == *"BREAKING"* ]]; then
          echo "bump=major" >> $GITHUB_OUTPUT
        elif [[ $COMMIT_MSG == *"feat:"* ]]; then
          echo "bump=minor" >> $GITHUB_OUTPUT
        else
          echo "bump=patch" >> $GITHUB_OUTPUT
        fi
    
    - name: Update version
      run: npm version ${{ steps.version.outputs.bump }}
    
    - name: Commit and tag
      run: |
        git config user.name "CI Bot"
        git commit -am "chore: bump version [skip ci]"
        git tag v$(jq -r '.version' package.json)
        git push --follow-tags
```

---

## NOTIFICATIONS

### Slack Notification
```yaml
notify-slack:
  steps:
    - uses: slackapi/slack-github-action@v1
      with:
        webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
        payload: |
          {
            "text": "✅ Merge to main",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Merged:* ${{ github.event.head_commit.message }}\n*Author:* ${{ github.event.head_commit.author.name }}\n*Status:* ✅ All checks passed"
                }
              }
            ]
          }
```

### Discord Notification
```yaml
notify-discord:
  steps:
    - uses: sarisia/actions-status-discord@v1
      with:
        webhook_url: ${{ secrets.DISCORD_WEBHOOK_URL }}
        title: "✅ Merged to main"
        description: "Docs generated, Docker built, staging deployed"
        color: 0x00ff00
```

---

## CLEANUP

Auto-cleanup old artifacts:

```yaml
cleanup:
  steps:
    - name: Delete old Docker images
      run: |
        # Keep only last 10 images
        docker image prune -af --filter "until=720h"
    
    - name: Delete old release artifacts
      run: |
        # Keep only last 5 releases
        gh release list --limit 5
```

---

## CHECKLIST BEFORE MERGE

Ensure these pass before merging:

- ✅ ESLint passes
- ✅ All tests pass (unit + E2E)
- ✅ Coverage maintained or improved
- ✅ Security scan passed
- ✅ Build succeeds
- ✅ Code review approved (≥2 reviewers)
- ✅ No breaking changes (or documented)
- ✅ Database migrations tested
- ✅ Environment variables documented
