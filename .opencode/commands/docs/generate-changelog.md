# AUTO-GENERATE CHANGELOG

## CONTEXT
Tự động generate CHANGELOG.md từ Git commits. Giữ changelog luôn sync với version history.

---

## SETUP

### 1. Install conventional-changelog

```bash
npm install --save-dev conventional-changelog-cli
```

### 2. Add to package.json

```json
{
  "scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s",
    "changelog:init": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
  }
}
```

### 3. Create .changelogrc.js (optional)

```javascript
// .changelogrc.js
module.exports = {
  "types": [
    {
      "type": "feat",
      "section": "✨ Features",
      "hidden": false
    },
    {
      "type": "fix",
      "section": "🐛 Bug Fixes",
      "hidden": false
    },
    {
      "type": "docs",
      "section": "📚 Documentation",
      "hidden": false
    },
    {
      "type": "test",
      "section": "✅ Testing",
      "hidden": false
    },
    {
      "type": "chore",
      "section": "🔧 Chores",
      "hidden": true
    },
    {
      "type": "refactor",
      "section": "♻️ Refactoring",
      "hidden": false
    },
    {
      "type": "perf",
      "section": "⚡ Performance",
      "hidden": false
    }
  ]
};
```

---

## COMMIT CONVENTIONS

Use Conventional Commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Examples

```bash
# Feature
git commit -m "feat(auth): add JWT refresh token support"

# Bug fix
git commit -m "fix(features): handle empty title validation"

# Documentation
git commit -m "docs: update README with API examples"

# Breaking change
git commit -m "feat(api)!: migrate from REST to GraphQL"

# With body and footer
git commit -m "fix(auth): prevent token replay attacks

Added token nonce to prevent token replay.
Fixes #123"
```

### Type Examples

```
feat:      New feature (MINOR version bump)
fix:       Bug fix (PATCH version bump)
docs:      Documentation changes (no version bump)
test:      Test additions/fixes (no version bump)
chore:     Dependency updates (no version bump)
refactor:  Code refactoring (no version bump)
perf:      Performance improvements (PATCH or MINOR)
```

---

## AUTO-GENERATE

### Manually

```bash
# Generate CHANGELOG (prepends latest version)
npm run changelog

# Generate from scratch
npm run changelog:init
```

### Automatically (CI/CD)

In `on-merge.md`:

```yaml
- name: Generate CHANGELOG
  run: npm run changelog

- name: Commit CHANGELOG
  run: |
    git config user.name "CI Bot"
    git config user.email "ci@example.com"
    git add CHANGELOG.md
    git commit -m "docs: update CHANGELOG" || true
    git push
```

---

## GENERATED FORMAT

Generated CHANGELOG will look like:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

---

## [1.2.3] - 2026-04-15

### ✨ Features
- **auth**: Add JWT refresh token support (#123)
- **features**: Add batch operations endpoint (#124)

### 🐛 Bug Fixes
- **features**: Handle empty title validation (#125)
- **auth**: Prevent token replay attacks (#126)

### ⚡ Performance
- **database**: Add indexes on frequently queried fields

### 📚 Documentation
- Update README with API examples
- Add deployment guide

### ♻️ Refactoring
- Extract error handling logic to core layer

---

## [1.2.2] - 2026-04-10

### 🐛 Bug Fixes
- **auth**: Fix token validation for expired tokens

### 📚 Documentation
- Update installation instructions

---

## [1.2.1] - 2026-04-05

### ✨ Features
- **user**: Add profile avatar support

---

## [1.2.0] - 2026-04-01

### ✨ Features
- **billing**: Initial billing module implementation
- Add Stripe payment integration

### 🐛 Bug Fixes
- Fix CORS policy for production environment

---
```

---

## CUSTOM TEMPLATE

Create custom changelog format:

```javascript
// .changelogTemplateFile.hbs
# Changelog

{{#each releases}}
## [{{version}}] - {{date}}

{{#if features}}
### ✨ Features
{{#each features}}
- {{this}}
{{/each}}
{{/if}}

{{#if fixes}}
### 🐛 Bug Fixes
{{#each fixes}}
- {{this}}
{{/each}}
{{/if}}

{{#if breaking}}
### 💥 BREAKING CHANGES
{{#each breaking}}
- {{this}}
{{/each}}
{{/if}}

---
{{/each}}
```

Configure in `conventional.config.js`:

```javascript
module.exports = {
  changelogFile: 'CHANGELOG.md',
  changelogTemplateFile: '.changelogTemplateFile.hbs',
  preset: 'angular',
  releaseCount: 5,  // Include last 5 releases
};
```

---

## VERSION BUMPING

### Semantic Versioning

```
MAJOR.MINOR.PATCH
1.2.3

- MAJOR: Breaking changes (feat!:)
- MINOR: New features (feat:)
- PATCH: Bug fixes (fix:)
```

### Auto-Bump with npm version

```bash
# Patch (bug fix)
npm version patch    # 1.2.3 → 1.2.4

# Minor (new feature)
npm version minor    # 1.2.3 → 1.3.0

# Major (breaking change)
npm version major    # 1.2.3 → 2.0.0
```

After bumping:
```bash
# Generate changelog for new version
npm run changelog

# Commit and tag
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore: bump version to 1.2.4"
git tag v1.2.4
git push --tags
```

---

## BREAKING CHANGES

Clearly mark breaking changes in commits:

```bash
# Using ! syntax
git commit -m "feat(api)!: migrate from REST to GraphQL"

# Or in footer
git commit -m "feat(auth): new auth system

BREAKING CHANGE: Old JWT format no longer supported"
```

Breaking changes will appear in CHANGELOG with warning:

```markdown
## [2.0.0] - 2026-04-15

### 💥 BREAKING CHANGES
- API migrated from REST to GraphQL
- Old JWT format no longer supported
```

---

## GITHUB INTEGRATION

### Auto-Create Release Notes

In `on-release.md`:

```yaml
create-release:
  steps:
    - name: Create GitHub Release
      uses: softprops/action-gh-release@v1
      with:
        body_path: CHANGELOG.md
        tag_name: v${{ steps.version.outputs.version }}
```

---

## MULTIPLE PACKAGES (Monorepo)

For monorepo with multiple packages:

```bash
# Generate changelog for specific package
npx conventional-changelog -p angular \
  -i packages/api/CHANGELOG.md \
  -s \
  --path packages/api
```

---

## SKIP CHANGELOG UPDATES

For commits that shouldn't appear in changelog:

```bash
# Chore commits (hidden by default)
git commit -m "chore: update dependencies"

# Or explicitly skip
git commit -m "docs: [skip-changelog] minor typo fix"
```

---

## AUTOMATION

### Commit Message Validator

Prevent commits that don't follow conventions:

```javascript
// .husky/commit-msg
#!/bin/sh
npx --no -- commitlint --edit
```

Install commitlint:

```bash
npm install --save-dev @commitlint/{config-conventional,cli}

# Create commitlint.config.js
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js

# Setup husky
npx husky install
npx husky add .husky/commit-msg 'npx --no commitlint --edit "$1"'
```

---

## USEFUL COMMANDS

```bash
# Generate changelog
npm run changelog

# View changelog
cat CHANGELOG.md

# Generate from scratch
npm run changelog:init

# Dry run (preview)
npx conventional-changelog -p angular -u

# Show commits since last tag
git log --oneline $(git describe --tags --abbrev=0)..HEAD

# Check conventional commit format
npx commitlint --from HEAD~5
```

---

## CI/CD INTEGRATION

```yaml
# .github/workflows/changelog.yml
on:
  push:
    branches: [main]

jobs:
  changelog:
    if: startsWith(github.event.head_commit.message, 'chore: bump version')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node
        uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate CHANGELOG
        run: npm run changelog
      
      - name: Commit CHANGELOG
        run: |
          git config user.name "CI Bot"
          git config user.email "ci@example.com"
          git add CHANGELOG.md
          git commit -m "docs: update CHANGELOG [skip ci]" || true
          git push
```

---

## RESULT

Auto-generated CHANGELOG will:

✅ Include all commits since last version  
✅ Group by type (features, fixes, docs, etc.)  
✅ Show commit references (#123)  
✅ Mark breaking changes  
✅ Stay synced with code  
✅ Auto-update on release  

**Zero manual changelog writing.** ✨

---

## GOOD COMMIT MESSAGES

```bash
# ✅ GOOD: Clear type, scope, subject
feat(auth): add two-factor authentication

# ✅ GOOD: With body and issue reference
fix(database): prevent N+1 queries

Use .populate() to fetch related documents efficiently.
Fixes #456

# ❌ BAD: No type or scope
Added new feature

# ❌ BAD: Subject too long
feat: add a new authentication module that supports JWT tokens and refresh tokens with expiration

# ❌ BAD: Vague message
fix stuff
```
