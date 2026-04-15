# REACT NATIVE SPECIFICATION TEMPLATE

## CONTEXT
Ý tưởng sản phẩm từ Marketing: [read từ 1-idea.md]

---

## ROLE
Senior React Native Architect. Chuyển đổi Marketing Idea thành bản Specification kỹ thuật cho React Native mobile app, integrated với NestJS backend.

---

## TECH STACK (Fixed)

- **Framework**: React Native 0.73+
- **Language**: TypeScript (ES2023, strict)
- **Navigation**: React Navigation 6
- **State Management**: Redux Toolkit / Zustand
- **HTTP Client**: Axios + Redux Thunk
- **Auth**: JWT + Secure Storage
- **UI Components**: React Native Paper / NativeBase
- **Testing**: Jest, React Native Testing Library, Detox
- **Build Tools**: EAS Build, EAS Submit (Expo) OR Xcode/Android Studio
- **Deployment**: Apple App Store, Google Play Store

---

## 1. PROJECT STRUCTURE

```
mobile/
├── app.json                 # Expo config
├── eas.json                 # EAS Build config
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── SplashScreen.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── FeatureListScreen.tsx
│   │   │   ├── FeatureDetailScreen.tsx
│   │   │   └── CreateFeatureScreen.tsx
│   │   └── profile/
│   │       ├── ProfileScreen.tsx
│   │       └── SettingsScreen.tsx
│   │
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthStack.tsx
│   │   ├── AppStack.tsx
│   │   └── BottomTabNavigator.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── features/
│   │   │   ├── FeatureItem.tsx
│   │   │   ├── FeatureForm.tsx
│   │   │   └── FeatureModal.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── SafeAreaWrapper.tsx
│   │
│   ├── redux/
│   │   ├── store.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   └── featureSlice.ts
│   │   └── thunks/
│   │       ├── authThunks.ts
│   │       └── featureThunks.ts
│   │
│   ├── services/
│   │   ├── api.ts            # Axios instance
│   │   ├── auth.ts           # Auth service
│   │   ├── features.ts       # Features service
│   │   └── storage.ts        # Secure storage
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFeatures.ts
│   │   └── useNavigation.ts
│   │
│   ├── types/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── entities.ts
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── api.ts
│   │
│   ├── utils/
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── helpers.ts
│   │
│   └── App.tsx
│
├── __tests__/
│   ├── components/
│   ├── screens/
│   └── utils/
│
├── e2e/
│   ├── login.e2e.ts
│   ├── features.e2e.ts
│   └── config.ts
│
├── .env
├── .env.example
├── tsconfig.json
└── package.json
```

---

## 2. APP ARCHITECTURE

### Navigation Structure

```
RootNavigator
├── AuthStack (not authenticated)
│   ├── SplashScreen
│   ├── LoginScreen
│   └── RegisterScreen
│
└── AppStack (authenticated)
    ├── BottomTabNavigator
    │   ├── DashboardTab
    │   ├── FeaturesTab
    │   ├── NotificationsTab
    │   └── ProfileTab
    │
    └── Modal Screens (overlays)
        ├── CreateFeatureModal
        ├── EditFeatureModal
        └── SettingsModal
```

### Redux State Structure

```typescript
// redux/store.ts
interface RootState {
  auth: {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
  };
  features: {
    items: Feature[];
    selectedFeature: Feature | null;
    isLoading: boolean;
    error: string | null;
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  };
  ui: {
    theme: 'light' | 'dark';
    language: 'en' | 'vi';
  };
}
```

---

## 3. KEY SCREENS

### SplashScreen
- Logo animation
- Check if user is authenticated (check secure storage)
- Route to AuthStack or AppStack

### AuthStack (Login/Register)
- Email + password form
- Validation errors
- Social login (optional)
- Store JWT tokens securely

### DashboardScreen
- User greeting
- Quick stats
- Recent features
- Navigation to other screens

### FeatureListScreen
- List all features (paginated)
- Pull-to-refresh
- Search / filter
- Infinite scroll OR pagination
- Floating action button to create

### FeatureDetailScreen
- Show feature details
- Edit button
- Delete button
- Related features

### CreateFeatureScreen / Modal
- Form for title, description, etc.
- Image upload (optional)
- Save to backend

### ProfileScreen
- User info
- Edit profile
- Settings
- Logout

---

## 4. API INTEGRATION

### Secure Storage

```typescript
// services/storage.ts
import * as SecureStore from 'expo-secure-store';

export const StorageService = {
  async saveTokens(accessToken: string, refreshToken: string) {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  },

  async getAccessToken() {
    return await SecureStore.getItemAsync('accessToken');
  },

  async getRefreshToken() {
    return await SecureStore.getItemAsync('refreshToken');
  },

  async clearTokens() {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  },
};
```

### API Client

```typescript
// services/api.ts
import axios from 'axios';
import { StorageService } from './storage';

const api = axios.create({
  baseURL: Config.API_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await StorageService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = await StorageService.getRefreshToken();
      const response = await axios.post(
        `${Config.API_URL}/auth/refresh`,
        { refreshToken }
      );

      const { accessToken } = response.data;
      await StorageService.saveTokens(accessToken, refreshToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    }

    throw error;
  }
);

export default api;
```

### Auth Thunks

```typescript
// redux/thunks/authThunks.ts
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      await StorageService.saveTokens(
        response.data.accessToken,
        response.data.refreshToken
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', data);
      await StorageService.saveTokens(
        response.data.accessToken,
        response.data.refreshToken
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await StorageService.clearTokens();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

---

## 5. UI/UX CONSIDERATIONS

### Responsive Design

```typescript
// constants/spacing.ts
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Use in components
<View style={{ padding: SPACING.md }}>
  <Text style={{ fontSize: 16 }}>Hello</Text>
</View>
```

### Dark Mode Support

```typescript
// utils/theme.ts
export const LIGHT_THEME = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#000000',
  primary: '#3B82F6',
  danger: '#EF4444',
};

export const DARK_THEME = {
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  primary: '#60A5FA',
  danger: '#F87171',
};
```

### Accessibility

- Use `accessible={true}` on interactive elements
- Add `accessibilityLabel` for screen readers
- Ensure text contrast >4.5:1
- Min touch target: 48x48 dp
- Support system font scaling

```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Create new feature"
  accessibilityRole="button"
  onPress={handleCreate}
>
  <Text>Create</Text>
</TouchableOpacity>
```

---

## 6. OFFLINE SUPPORT

```typescript
// services/offline.ts
import NetInfo from '@react-native-community/netinfo';

export const isConnected = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
};

// In thunks: Check connection before API calls
export const getFeatures = createAsyncThunk(
  'features/getFeatures',
  async (_, { rejectWithValue }) => {
    const connected = await isConnected();
    if (!connected) {
      return rejectWithValue('No internet connection');
    }
    // ... fetch from API
  }
);
```

---

## 7. TESTING STRATEGY

### Unit Tests (Jest)

```typescript
// __tests__/utils/validators.test.ts
import { validateEmail, validatePassword } from '@/utils/validators';

describe('Validators', () => {
  it('validates email correctly', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
  });

  it('validates password strength', () => {
    expect(validatePassword('short')).toBe(false);
    expect(validatePassword('StrongPass123')).toBe(true);
  });
});
```

### Component Tests (React Native Testing Library)

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/Button';

describe('Button', () => {
  it('renders and responds to press', () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress}>Click me</Button>);

    fireEvent.press(screen.getByText('Click me'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### E2E Tests (Detox)

```typescript
// e2e/login.e2e.ts
describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login with valid credentials', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).multiTap();

    await waitFor(element(by.text('Dashboard')))
      .toBeVisible()
      .withTimeout(5000);
  });
});
```

---

## 8. BUILD & DEPLOYMENT

### Development

```bash
# Install Expo
npm install -g eas-cli

# Start dev server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android
```

### Build for Testing (EAS)

```bash
# Preview build (installable)
eas build --platform ios --profile preview
eas build --platform android --profile preview

# Check build status
eas build --status
```

### Production Build

```bash
# Configure eas.json
{
  "build": {
    "production": {
      "ios": {
        "image": "latest"
      },
      "android": {
        "image": "latest"
      }
    }
  }
}

# Build production
eas build --platform ios --profile production
eas build --platform android --profile production

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

### Store Requirements

**Apple App Store:**
- Icon (1024x1024 PNG)
- Screenshots (6 required, multiple sizes)
- Description (max 170 chars)
- Keywords (up to 100 chars)
- Privacy policy URL
- Age rating

**Google Play Store:**
- Icon (512x512 PNG)
- Screenshots (at least 2, up to 8)
- Feature graphic (1024x500)
- Description (max 4000 chars)
- Short description (80 chars)
- Privacy policy URL
- Content rating

---

## 9. PERFORMANCE OPTIMIZATION

### Image Optimization

```typescript
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';

// Use FastImage for network images (caching)
<FastImage
  style={{ width: 200, height: 200 }}
  source={{ uri: 'https://example.com/image.png' }}
  resizeMode={FastImage.resizeMode.contain}
/>
```

### Code Splitting

```typescript
// Lazy load heavy screens
const SettingsScreen = lazy(() => import('./screens/SettingsScreen'));
const ReportsScreen = lazy(() => import('./screens/ReportsScreen'));
```

### Memory Management

```typescript
// Clean up in useEffect
useEffect(() => {
  const unsubscribe = navigation.addListener('beforeRemove', () => {
    // Clean up subscriptions, timers, etc.
  });

  return unsubscribe;
}, [navigation]);
```

---

## 10. KANBAN TASK BREAKDOWN

### Phase 1: Setup
- [ ] **TASK-01: React Native Project Init**
  - Description: Setup Expo project, TypeScript, ESLint, Prettier
  - DoD: `npx expo start` runs, no errors

- [ ] **TASK-02: Navigation Setup**
  - Description: Setup React Navigation, auth stack, app stack
  - DoD: Can navigate between screens without errors

### Phase 2: Core Features
- [ ] **TASK-03: Secure Storage & Auth**
  - Description: JWT token storage, login/register API integration
  - DoD: Tokens securely stored, auto-login on app restart

- [ ] **TASK-04: Auth Screens**
  - Description: Login, register screens with forms and validation
  - DoD: Can register and login successfully

- [ ] **TASK-05: Feature List Screen**
  - Description: Fetch and display features from backend
  - DoD: Features display with pagination, pull-to-refresh works

- [ ] **TASK-06: Create Feature**
  - Description: Modal to create new feature
  - DoD: Can create feature, appears in list immediately

- [ ] **TASK-07: Edit/Delete Feature**
  - Description: Edit and delete existing features
  - DoD: Can edit and delete with confirmation

### Phase 3: Polish
- [ ] **TASK-08: Offline Support**
  - Description: Check internet connection, cache data locally
  - DoD: App works offline, syncs when reconnected

- [ ] **TASK-09: Dark Mode**
  - Description: Support light/dark theme switching
  - DoD: Theme persists, all components themed

- [ ] **TASK-10: Testing & Performance**
  - Description: Unit tests, E2E tests, performance optimization
  - DoD: >70% coverage, E2E tests pass, app loads <3s

- [ ] **TASK-11: Build & Deploy**
  - Description: Build for iOS and Android, submit to stores
  - DoD: Apps available on App Store and Play Store

---

## 11. CONSTRAINTS & NOTES

### Target Devices
- iOS 13+
- Android 8+ (API 26+)
- Screen sizes: 3.5" to 6.7"

### Performance Targets
- App startup: <3 seconds
- List scroll: 60 FPS
- API response: <2 seconds

### Network
- Min bandwidth: 3G (EDGE fallback)
- Timeouts: 10 seconds
- Retry logic: 3 attempts with exponential backoff

### Storage
- Token storage: Secure Enclave (iOS), Keystore (Android)
- Cache: AsyncStorage (encrypted)
- Database: SQLite (optional, for offline)

### Security
- No hardcoded credentials
- API communication: HTTPS only
- Certificate pinning (optional, for high-security)
- Obfuscate code for production
