# AUTO-GENERATE README

## CONTEXT
Tự động generate README.md từ PRD + Task breakdown + Package.json. Giữ README luôn updated.

---

## TRIGGER

File này được chạy bởi:
- ✅ `on-merge.md` (sau khi merge vào main)
- ✅ Thủ công: `npm run docs:readme`

---

## IMPLEMENTATION

```javascript
// .pipeline/ai/docs/generate-readme.js

const fs = require('fs');
const path = require('path');

function generateREADME() {
  console.log('📝 Generating README.md...');

  // 1. Read source files
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const prd = fs.readFileSync('docs/PRD.md', 'utf8');
  const claude = fs.readFileSync('CLAUDE.md', 'utf8');
  
  // 2. Extract key information
  const name = packageJson.name;
  const description = packageJson.description;
  const version = packageJson.version;
  const authors = packageJson.author || 'Team';
  
  // 3. Parse PRD sections
  const features = extractSection(prd, 'Features', 'features');
  const techStack = extractSection(prd, 'Tech Stack', 'tech');
  const architecture = extractSection(claude, 'Architecture', 'architecture');
  
  // 4. Generate README content
  const readme = `# ${name}

${description}

**Version**: ${version}  
**Status**: ✅ Production Ready

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Running](#running)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

---

## 🚀 Quick Start

\`\`\`bash
# Clone and setup
git clone https://github.com/your-org/${name}.git
cd ${name}
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run in development
npm run start:dev

# Server will be available at http://localhost:3000
\`\`\`

---

## ✨ Features

${features}

---

## 🛠️ Tech Stack

${techStack}

- **Runtime**: Node.js ${packageJson.engines?.node || '20+'}
- **Framework**: NestJS v11
- **Database**: MongoDB via Mongoose
- **ORM**: Mongoose
- **Authentication**: JWT + Passport
- **Logging**: Winston
- **Testing**: Jest, Supertest
- **Code Quality**: ESLint, Prettier

---

## 🏗️ Architecture

${architecture}

For detailed architecture info, see [CLAUDE.md](./CLAUDE.md)

### Layer Structure

\`\`\`
src/
├── core/               # Domain logic (no NestJS)
├── infrastructure/     # NestJS adapters
├── modules/            # Feature modules
└── config/             # Configuration
\`\`\`

Each module follows:
\`\`\`
modules/feature/
├── feature.module.ts       # DI setup
├── feature.controller.ts   # HTTP routing
├── feature.service.ts      # Business logic
├── feature.schema.ts       # Database schema
└── dto/
    └── create-feature.dto.ts
\`\`\`

---

## 📦 Installation

### Prerequisites

- Node.js 20+
- MongoDB 7+
- npm or yarn

### Steps

\`\`\`bash
# 1. Clone repository
git clone https://github.com/your-org/${name}.git
cd ${name}

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
nano .env  # Configure your settings

# 4. Start MongoDB (if not running)
docker run -d -p 27017:27017 mongo:7

# 5. Verify installation
npm run lint
npm test
\`\`\`

---

## 🏃 Running

### Development

\`\`\`bash
# Hot reload enabled
npm run start:dev

# Watch for file changes
npm run start:watch

# Debug mode
DEBUG=* npm run start:dev
\`\`\`

### Production

\`\`\`bash
# Build
npm run build

# Start
npm start

# Or use Docker
docker build -t ${name}:latest .
docker run -p 3000:3000 ${name}:latest
\`\`\`

### Environment Variables

Create \`.env\` file (see \`.env.example\`):

\`\`\`
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/${name}
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRY=15m
REFRESH_TOKEN_SECRET=refresh-secret-min-32-chars
REFRESH_TOKEN_EXPIRY=7d
LOG_LEVEL=debug
\`\`\`

---

## 🧪 Testing

\`\`\`bash
# Unit tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e

# Smoke tests (production)
npm run test:smoke
\`\`\`

**Coverage Requirements**:
- Services: >70%
- Controllers: >50%
- Overall: >65%

See [Test Coverage Checklist](.pipeline/ai/quality/test-coverage.md)

---

## 📚 API Documentation

### Swagger UI

Start the server and visit:
\`\`\`
http://localhost:3000/api/docs
\`\`\`

### Endpoints

#### Authentication
\`\`\`
POST   /auth/register      # Create account
POST   /auth/login         # Login
POST   /auth/refresh       # Refresh token
\`\`\`

#### Features
\`\`\`
GET    /features           # List all (paginated)
GET    /features/:id       # Get one
POST   /features           # Create (auth required)
PUT    /features/:id       # Update (auth required)
DELETE /features/:id       # Delete (auth required)
\`\`\`

For complete API spec, see generated [OpenAPI Docs](./docs/swagger.json)

---

## 💻 Development

### Code Style

\`\`\`bash
# Check linting
npm run lint

# Auto-fix
npm run lint -- --fix

# Format with Prettier
npm run format
\`\`\`

### Common Commands

\`\`\`bash
npm run start:dev         # Dev server with hot reload
npm run build             # Production build
npm test                  # Run all tests
npm run test:cov          # Generate coverage report
npm run test:e2e          # E2E tests
npm run lint              # Check code style
npm run lint -- --fix     # Auto-fix style issues
npm run format            # Format with Prettier
npm run migrate           # Run database migrations
npm run db:seed           # Seed database
\`\`\`

---

## 🔒 Security

### Authentication

- JWT-based authentication
- Refresh token rotation
- Secure password hashing (bcrypt)

### Authorization

- Role-based access control (RBAC)
- Resource-level permissions
- Guard-based protection

### Best Practices

- No secrets in code (use .env)
- Input validation on all endpoints
- Rate limiting on auth endpoints
- HTTPS in production
- OWASP compliance

See [Security Checklist](.pipeline/ai/quality/security.md)

---

## 📈 Performance

### Targets

- **Response Time**: <200ms (p95)
- **Throughput**: >1000 req/s
- **Memory**: <200MB baseline
- **Error Rate**: <1%

### Optimization

- Database indexes on frequently queried fields
- Query result caching (Redis)
- Pagination on list endpoints
- Field projection in queries

See [Performance Guidelines](.pipeline/ai/quality/performance.md)

---

## 🤝 Contributing

### Code Review Process

Before submitting PR:

1. **Branch**: Create feature branch: \`git checkout -b feature/your-feature\`
2. **Code**: Follow [code style](.pipeline/ai/quality/code-review.md)
3. **Test**: Ensure tests pass: \`npm test\`
4. **Lint**: Fix style issues: \`npm run lint -- --fix\`
5. **Push**: \`git push origin feature/your-feature\`
6. **PR**: Create pull request with description

### PR Requirements

- [ ] Tests added/updated
- [ ] Code review checklist passed
- [ ] No coverage decrease
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

See detailed [Code Review Checklist](.pipeline/ai/quality/code-review.md)

### Commit Conventions

\`\`\`
feat(module): add new feature
fix(module): fix bug
docs: update documentation
test(module): add test cases
chore: update dependencies
\`\`\`

---

## 📋 Module Development

### Creating a New Module

\`\`\`bash
# 1. Create folder
mkdir src/modules/new-feature
cd src/modules/new-feature

# 2. Create files (see template)
touch new-feature.module.ts
touch new-feature.controller.ts
touch new-feature.service.ts
touch new-feature.schema.ts
mkdir dto
touch dto/create-new-feature.dto.ts

# 3. Implement following [Module Pattern](./CLAUDE.md#module-pattern)

# 4. Register in src/app.module.ts

# 5. Test: npm test -- src/modules/new-feature

# 6. Create PR
\`\`\`

---

## 🐛 Debugging

### Local Debugging

\`\`\`bash
# VS Code: F5 or Run → Start Debugging
# See .vscode/launch.json for config

# Browser DevTools:
node --inspect src/main.js
# Open chrome://inspect

# Log debugging:
DEBUG=* npm run start:dev
\`\`\`

### Common Issues

**Problem**: Port 3000 in use
\`\`\`bash
PORT=3001 npm run start:dev
\`\`\`

**Problem**: MongoDB connection failed
\`\`\`bash
# Check if MongoDB is running
docker ps | grep mongo
# Or start MongoDB:
docker run -d -p 27017:27017 mongo:7
\`\`\`

**Problem**: Tests failing
\`\`\`bash
# Run with verbose output
npm test -- --verbose

# Run single test file
npm test src/modules/feature/feature.service.spec.ts
\`\`\`

---

## 📦 Deployment

### Docker

\`\`\`bash
# Build image
docker build -t ${name}:latest .

# Run container
docker run -p 3000:3000 \\
  -e DATABASE_URL=mongodb://host.docker.internal:27017/${name} \\
  -e JWT_SECRET=your-secret \\
  ${name}:latest
\`\`\`

### Kubernetes

See [Deployment Guide](./docs/DEPLOYMENT.md)

### CI/CD

- **GitHub Actions**: Auto-test on PR, auto-deploy on merge
- **Version Bumping**: Automatic (semantic versioning)
- **Releases**: Auto-generated on version tags

See [CI/CD Configuration](./.github/workflows/)

---

## 📞 Support & Issues

- **Bug Reports**: GitHub Issues
- **Feature Requests**: GitHub Discussions
- **Documentation**: \`/docs\` folder
- **Questions**: Check existing issues first

---

## 📜 License

${packageJson.license || 'MIT'}

See [LICENSE](./LICENSE) file for details.

---

## 👥 Authors

${authors}

---

## 📅 Changelog

All changes documented in [CHANGELOG.md](./CHANGELOG.md)

\`\`\`bash
# View recent changes
git log --oneline -10

# View version tags
git tag -l
\`\`\`

---

**Last Updated**: ${new Date().toISOString().split('T')[0]}
`;

  // 5. Write README
  fs.writeFileSync('README.md', readme);
  console.log('✅ README.md generated successfully');
  return true;
}

/**
 * Extract section from markdown
 */
function extractSection(content, sectionName, fallback) {
  const regex = new RegExp(\`## \${sectionName}(.+?)(?=##|$)\`, 's');
  const match = content.match(regex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // Fallback content
  const fallbacks = {
    features: '- Feature 1\\n- Feature 2\\n- Feature 3',
    tech: '- Node.js\\n- NestJS\\n- MongoDB',
    architecture: 'See CLAUDE.md for detailed architecture',
  };
  
  return fallbacks[fallback] || '';
}

// Run
if (require.main === module) {
  try {
    generateREADME();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating README:', error.message);
    process.exit(1);
  }
}

module.exports = { generateREADME };
\`\`\`

---

## SETUP IN PACKAGE.JSON

```json
{
  "scripts": {
    "docs:readme": "node .pipeline/ai/docs/generate-readme.js",
    "docs:all": "npm run docs:readme && npm run swagger && npm run changelog"
  }
}
```

---

## AUTOMATED UPDATES

### On Every Merge

The `on-merge.yml` workflow automatically:

1. ✅ Generates README.md
2. ✅ Generates API docs (Swagger)
3. ✅ Generates CHANGELOG
4. ✅ Commits updates
5. ✅ Pushes to main

No manual action needed.

---

## MANUAL REGENERATION

```bash
npm run docs:readme
git add README.md
git commit -m "docs: regenerate README"
git push
```

---

## CUSTOMIZATION

To customize README generation, edit:
- `.pipeline/ai/docs/generate-readme.js` — Logic
- `package.json` — Script commands
- `docs/PRD.md` — Feature content
- `CLAUDE.md` — Architecture content

---

## RESULT

The generated README will include:

✅ Project name + description  
✅ Quick start instructions  
✅ Features list (from PRD)  
✅ Tech stack  
✅ Architecture overview  
✅ Installation guide  
✅ Running instructions  
✅ Testing instructions  
✅ API documentation  
✅ Contributing guidelines  
✅ Security practices  
✅ Performance targets  
✅ Deployment guide  
✅ Troubleshooting  
✅ License + authors  
✅ Changelog link  

**Always up-to-date.** ✨
