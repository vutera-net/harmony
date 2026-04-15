# TRIGGER: ON PR OPENED

## CONTEXT
Khi PR mở trên GitHub, tự động chạy quality checks để đảm bảo code quality trước khi merge.

---

## TRIGGER DEFINITION

```yaml
# .github/workflows/pr-check.yml
name: PR Quality Checks

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  code-review:
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
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Check security vulnerabilities
        run: npm audit --production
      
      - name: Build project
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e

  # Auto-generate code review checklist comment
  code-review-checklist:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Generate code review comment
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const checklist = fs.readFileSync('.pipeline/ai/quality/code-review.md', 'utf8');
            
            const comment = `## 📋 Code Review Checklist
            
Please ensure this PR meets the following standards:

${checklist.split('\n').filter(line => line.startsWith('- [ ]')).join('\n')}

See [Full Code Review Checklist](.pipeline/ai/quality/code-review.md) for details.`;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment,
            });

  # Auto-run security scan
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Snyk security scan
        run: npx snyk test --severity-threshold=high
        continue-on-error: true
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: security-scan
          path: snyk-results.json

  # Coverage badge
  coverage-badge:
    runs-on: ubuntu-latest
    needs: code-review
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate coverage
        run: npm run test:cov
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          fail_ci_if_error: false
```

---

## AUTO-COMMENT ON PR

Khi PR opened, bot auto-post:

```markdown
## ✅ Automated Checks

🚀 PR opened! Running automated quality checks...

**What we're checking:**
- ✅ Code style (ESLint)
- ✅ Unit tests (>70% coverage)
- ✅ Integration tests
- ✅ Security vulnerabilities
- ✅ Build success
- ✅ E2E tests

**Status:**
- ESLint: [Pending]
- Tests: [Pending]
- Security: [Pending]
- Build: [Pending]

👉 See [Code Review Checklist](.pipeline/ai/quality/code-review.md) for manual review items.
```

---

## FAILURE HANDLING

Nếu checks fail:

### 1. ESLint Fails
```bash
npm run lint -- --fix
git add .
git commit -m "style: auto-fix linting issues"
git push
```

### 2. Tests Fail
```bash
npm test -- --watch  # Run locally to debug
# Fix test failures
git add .
git commit -m "test: fix test failures"
git push
```

### 3. Coverage Decreases
```bash
npm run test:cov
# If coverage < baseline:
# Add more tests to src/modules/feature/feature.service.spec.ts
git add .
git commit -m "test: improve coverage"
git push
```

### 4. Security Vulnerabilities Found
```bash
npm audit --production
npm audit fix  # Auto-fix if possible
# OR manually update packages
npm install package@latest
git add package.json package-lock.json
git commit -m "chore: update vulnerable dependencies"
git push
```

### 5. Build Fails
```bash
npm run build  # Run locally to debug
# Fix TypeScript errors
git add .
git commit -m "fix: resolve build errors"
git push
```

---

## AUTO-ACTIONS (Optional Bots)

### A. Dependabot Auto-Update
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    pull-request-branch-name:
      separator: "/"
    reviewers:
      - "@linh"  # Tag for review
```

### B. Auto-Assign Reviewers
```yaml
# .github/workflows/auto-assign.yml
on: pull_request

jobs:
  auto-assign:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v6
        with:
          script: |
            github.rest.pulls.requestReviewers({
              pull_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              reviewers: ['senior-dev-1', 'senior-dev-2'],
            });
```

### C. Auto-Link Issue
```yaml
# .github/workflows/link-issue.yml
on: pull_request

jobs:
  link-issue:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v6
        with:
          script: |
            const body = context.payload.pull_request.body;
            const issueMatch = body.match(/#(\d+)/);
            if (issueMatch) {
              const issueNum = issueMatch[1];
              github.rest.issues.createComment({
                issue_number: issueNum,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: `PR #${context.issue.number} opened for this issue`,
              });
            }
```

---

## PR TEMPLATE

Để standardize PR descriptions:

```markdown
# .github/pull_request_template.md

## 📝 Description
[What does this PR do?]

## 🎯 Related Issue
Closes #[issue number]

## 🔄 Type of Change
- [ ] Bug fix
- [ ] Feature
- [ ] Documentation
- [ ] Refactoring
- [ ] Performance improvement

## ✅ Testing Performed
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing (describe below)

## 📸 Screenshots (if applicable)
[Add screenshots for UI changes]

## 📋 Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
- [ ] No breaking changes (or documented)

## 🔒 Security Checklist
- [ ] No secrets/credentials exposed
- [ ] Input validation added
- [ ] Error handling in place
- [ ] OWASP compliance checked
```

---

## BRANCH PROTECTION RULES

Để enforce quality gates:

```yaml
# Repository Settings → Branch Protection Rules

Branch: main
Require:
  ✅ Pull request reviews before merging (2 reviewers)
  ✅ Status checks to pass:
    - code-review (ESLint, tests, build)
    - security-scan
    - coverage-badge
  ✅ Code review dismissal stale
  ✅ Branches up to date before merging
  ✅ Signed commits

Restrict:
  ✅ Force pushes (disabled)
  ✅ Deletions (disabled)
```

---

## PERFORMANCE

Checks should complete in **<10 minutes**:
- ESLint: ~1m
- Unit tests: ~2m
- Build: ~2m
- E2E tests: ~4m
- Security scan: ~1m

Optimize if slower:
- Split tests across matrix (parallel jobs)
- Cache dependencies
- Use `--bail` flag to stop on first failure

---

## MONITORING & ALERTS

Track PR check health:

```yaml
# .github/workflows/check-health.yml
schedule:
  - cron: '0 9 * * 1'  # Weekly Monday 9am

jobs:
  report:
    steps:
      - name: Check PR check health
        run: |
          # Calculate % of PRs with passing checks
          # Alert if <95% pass rate
          echo "PR check health: 98% ✅"
```

---

## RED FLAGS THAT BLOCK MERGE

Auto-block merge if:
- ❌ ESLint fails
- ❌ Tests fail
- ❌ Coverage decreases >5%
- ❌ High-severity security vulnerabilities
- ❌ Build fails
- ❌ E2E tests fail
- ❌ Less than 2 approvals

---

## USEFUL COMMANDS FOR DEV

```bash
# Run same checks as CI locally
npm run lint
npm test -- --coverage
npm audit --production
npm run build
npm run test:e2e

# Auto-fix before push
npm run lint -- --fix
git add .
git commit -m "style: auto-fix linting"

# Check what will fail in CI
npm run lint && npm test:cov && npm audit && npm run build
```
