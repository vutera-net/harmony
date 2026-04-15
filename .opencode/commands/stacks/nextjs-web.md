# NEXTJS WEB SPECIFICATION TEMPLATE

## CONTEXT
Ý tưởng sản phẩm từ Marketing: [read từ 1-idea.md]

---

## ROLE
Bạn là Senior Frontend Architect chuyên Next.js + React. Chuyển đổi Marketing Idea thành bản Specification kỹ thuật cho Next.js frontend, integrated với NestJS backend.

---

## TECH STACK (Fixed)

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (ES2023, strict)
- **Styling**: Tailwind CSS
- **State Management**: React Context / Zustand
- **HTTP Client**: Axios + React Query
- **Auth**: NextAuth.js (JWT tokens from NestJS)
- **UI Components**: Shadcn/ui or Radix UI
- **Testing**: Jest, React Testing Library, Playwright
- **Deployment**: Vercel or Docker

---

## 1. PROJECT STRUCTURE

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── features/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   └── api/
│       └── auth/[...nextauth].ts  # NextAuth callback
│
├── components/             # Reusable React components
│   ├── ui/                 # Shadcn/ui components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── features/           # Feature-specific components
│   │   ├── FeatureList.tsx
│   │   ├── FeatureCard.tsx
│   │   └── CreateFeatureForm.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useFeatures.ts
│   └── useFetch.ts
│
├── lib/                    # Utility functions
│   ├── api.ts              # Axios instance + API calls
│   ├── auth.ts             # NextAuth config
│   ├── validators.ts       # Input validation (Zod)
│   └── utils.ts            # Helper functions
│
├── store/                  # State management (Zustand/Context)
│   ├── authStore.ts
│   └── featureStore.ts
│
├── types/                  # TypeScript types
│   ├── api.ts              # API response types
│   ├── auth.ts             # Auth types
│   └── entities.ts         # Domain models
│
├── constants/              # Constants
│   ├── env.ts
│   ├── api-routes.ts
│   └── messages.ts
│
└── styles/
    └── globals.css         # Tailwind imports
```

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 User Flows

**Authentication Flow:**
```
Landing Page
  ↓
Login/Register
  ↓
JWT token stored (httpOnly cookie via NextAuth)
  ↓
Dashboard (protected route)
```

**Feature Management Flow:**
```
Dashboard
  ↓
List Features (paginated)
  ↓
Create/Edit/Delete Feature
  ↓
Real-time updates via polling or WebSocket
```

### 2.2 Pages

```
Public Pages:
  / (Landing)
  /login
  /register

Protected Pages:
  /dashboard
  /features
  /features/[id]
  /features/create
  /settings
  /profile
```

### 2.3 Key Components

- **Authentication**: Login form, Register form, Session management
- **Navigation**: Header, Sidebar, Mobile menu
- **Data Display**: Tables, Cards, Lists with pagination
- **Forms**: Feature creation, Profile editing with validation
- **Modals**: Confirmation dialogs, Delete confirmations

---

## 3. TECH DECISIONS

### State Management: Zustand vs Context

**Option A: Zustand (Recommended)**
```typescript
// store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  login: async (email, password) => {
    set({ isLoading: true });
    const response = await api.post('/auth/login', { email, password });
    set({ user: response.user, isLoading: false });
  },
  logout: () => set({ user: null }),
}));
```

**Option B: React Context + useReducer**
```typescript
// context/AuthContext.tsx
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    const user = await api.post('/auth/login', { email, password });
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
  };

  return (
    <AuthContext.Provider value={{ state, login }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Recommendation**: Zustand (simpler, better performance)

### API Integration: React Query

```typescript
// hooks/useFeatures.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useFeatures(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['features', page, limit],
    queryFn: () => api.get(`/features?page=${page}&limit=${limit}`),
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
}

export function useCreateFeature() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateFeatureDto) => 
      api.post('/features', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
  });
}
```

### Form Handling: React Hook Form + Zod

```typescript
// components/CreateFeatureForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFeatureSchema } from '@/lib/validators';

export function CreateFeatureForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createFeatureSchema),
  });

  const { mutate: createFeature, isPending } = useCreateFeature();

  return (
    <form onSubmit={handleSubmit((data) => createFeature(data))}>
      <input {...register('title')} placeholder="Title" />
      {errors.title && <span>{errors.title.message}</span>}
      
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### Authentication: NextAuth.js

```typescript
// lib/auth.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
        });

        const user = await res.json();
        if (res.ok && user) {
          return user;  // { id, email, accessToken, refreshToken }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = { ...session.user, id: token.sub };
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

export const handler = NextAuth(authOptions);
```

### Protected Routes

```typescript
// middleware.ts (Next.js 13+)
export { auth as middleware } from '@/lib/auth';

export const config = {
  matcher: ['/dashboard/:path*', '/features/:path*', '/settings/:path*'],
};
```

---

## 4. API INTEGRATION

### API Client Setup

```typescript
// lib/api.ts
import axios, { AxiosInstance } from 'axios';
import { getSession } from 'next-auth/react';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

// Add token to headers
axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

// Handle 401 responses (refresh token)
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Trigger token refresh via NextAuth
      await signOut({ redirect: false });
      window.location.href = '/login';
    }
    throw error;
  },
);

export const api = axiosInstance;
```

### API Routes (Client-side)

```typescript
// API endpoints called from frontend
const API_ROUTES = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',

  // Features
  FEATURES: '/features',
  FEATURE_BY_ID: (id: string) => `/features/${id}`,
  CREATE_FEATURE: '/features',
  UPDATE_FEATURE: (id: string) => `/features/${id}`,
  DELETE_FEATURE: (id: string) => `/features/${id}`,

  // User
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
};
```

---

## 5. ENVIRONMENT VARIABLES

```bash
# .env.local (frontend)
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-min-32-chars
NEXT_PUBLIC_APP_NAME=EUP
NEXT_PUBLIC_SENTRY_DSN=https://...
```

---

## 6. STYLING WITH TAILWIND

### Setup

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        success: '#10b981',
        danger: '#ef4444',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config;
```

### Component Example

```typescript
export function Button({ 
  variant = 'primary', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' 
}) {
  const baseStyles = 'px-4 py-2 rounded font-semibold';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]}`} 
      {...props} 
    />
  );
}
```

---

## 7. TESTING STRATEGY

### Unit Tests (Jest + React Testing Library)

```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(onClick).toHaveBeenCalled();
  });
});
```

### E2E Tests (Playwright)

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button:has-text("Login")');
  
  await expect(page).toHaveURL('http://localhost:3000/dashboard');
  await expect(page.locator('text=Dashboard')).toBeVisible();
});
```

---

## 8. PERFORMANCE OPTIMIZATION

### Image Optimization

```typescript
import Image from 'next/image';

export function FeatureCard({ imageUrl, title }) {
  return (
    <div>
      <Image
        src={imageUrl}
        alt={title}
        width={300}
        height={200}
        priority={false}  // Lazy load
        placeholder="blur"
        blurDataURL="data:image/..."
      />
      <h3>{title}</h3>
    </div>
  );
}
```

### Code Splitting

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/HeavyChart'),
  { 
    loading: () => <p>Loading...</p>,
    ssr: false,  // Only load on client
  }
);

export function Dashboard() {
  return <HeavyComponent />;
}
```

### API Route Caching

```typescript
// next.config.js
module.exports = {
  // ISR (Incremental Static Regeneration)
  revalidate: 60,  // Revalidate every 60 seconds
};
```

---

## 9. DEPLOYMENT

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Environment variables
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXTAUTH_SECRET
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY --from=builder /app/.next ./.next
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment for Production

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.example.com
NEXTAUTH_URL=https://app.example.com
NEXTAUTH_SECRET=production-secret-key-min-32-chars
NODE_ENV=production
```

---

## 10. KANBAN TASK BREAKDOWN

### Phase 1: Project Setup
- [ ] **TASK-01: Next.js Project Scaffolding**
  - Description: Setup Next.js 16, TypeScript, Tailwind, ESLint, Prettier
  - DoD: `npm run dev` runs, no linting errors

- [ ] **TASK-02: NextAuth Setup**
  - Description: Configure NextAuth.js with credentials provider, JWT flow
  - DoD: Login/register pages work, tokens stored securely

### Phase 2: Core Features
- [ ] **TASK-03: API Client & Axios Setup**
  - Description: Create axios instance with interceptors, token refresh
  - DoD: API calls include auth headers, 401 triggers re-login

- [ ] **TASK-04: Authentication Pages**
  - Description: Build login, register pages with forms and validation
  - DoD: Can register new user, login returns dashboard

- [ ] **TASK-05: Dashboard Layout**
  - Description: Header, sidebar, protected layout component
  - DoD: Only authenticated users can access /dashboard

- [ ] **TASK-06: Feature List Page**
  - Description: Fetch features from API, display in table with pagination
  - DoD: List features, pagination works, search/filter optional

- [ ] **TASK-07: Create Feature Modal/Form**
  - Description: Form to create new feature with validation
  - DoD: New feature creates successfully, list updates

- [ ] **TASK-08: Edit/Delete Feature**
  - Description: Update and delete feature functionality
  - DoD: Can edit and delete with confirmation

### Phase 3: Polish
- [ ] **TASK-09: Error Handling & Loading States**
  - Description: Toast notifications, loading spinners, error messages
  - DoD: All error cases show user-friendly messages

- [ ] **TASK-10: Mobile Responsive Design**
  - Description: Ensure UI works on mobile (320px, 768px, 1024px)
  - DoD: Sidebar collapses on mobile, buttons accessible

- [ ] **TASK-11: Testing & Performance**
  - Description: Unit tests for components, E2E tests, Lighthouse score >90
  - DoD: >70% coverage, E2E tests pass, Core Web Vitals good

- [ ] **TASK-12: Deployment Setup**
  - Description: Deploy to Vercel, configure CI/CD, custom domain
  - DoD: App running at https://app.example.com

---

## 11. CONSTRAINTS & NOTES

### Performance Targets
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Time to Interactive**: <3.5s

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation on all interactive elements
- Proper ARIA labels
- Color contrast >4.5:1

### Security
- No API keys in frontend code
- Sensitive operations via server-side API routes
- CSRF protection (NextAuth handles)
- XSS prevention (React escapes by default)
- Content Security Policy headers

### SEO
- Open Graph meta tags
- Canonical URLs
- Structured data (JSON-LD)
- Sitemap.xml
- robots.txt
