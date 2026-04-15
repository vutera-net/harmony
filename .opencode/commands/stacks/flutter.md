# FLUTTER SPECIFICATION TEMPLATE

## CONTEXT
Ý tưởng sản phẩm từ Marketing: [read từ 1-idea.md]

---

## ROLE
Senior Flutter Architect. Chuyển đổi Marketing Idea thành bản Specification kỹ thuật cho Flutter mobile app (single codebase for iOS + Android), integrated với NestJS backend.

---

## TECH STACK (Fixed)

- **Framework**: Flutter 3.x
- **Language**: Dart
- **State Management**: Riverpod / GetX / Provider
- **Navigation**: GoRouter
- **HTTP Client**: Dio
- **Local Storage**: Hive + Secure Storage
- **UI Components**: Material Design 3
- **Testing**: test, integration_test, flutter_test
- **Build**: Fastlane (iOS/Android)
- **Deployment**: App Store, Google Play Store

---

## 1. PROJECT STRUCTURE

```
mobile_flutter/
├── pubspec.yaml            # Dependencies
├── analysis_options.yaml    # Linter rules
├── lib/
│   ├── main.dart           # App entry point
│   ├── app/
│   │   ├── app.dart        # App widget config
│   │   ├── routes.dart     # Route definitions
│   │   └── theme.dart      # Theme config
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/
│   │   │   │   ├── datasources/
│   │   │   │   │   └── auth_remote_datasource.dart
│   │   │   │   ├── models/
│   │   │   │   │   └── user_model.dart
│   │   │   │   └── repositories/
│   │   │   │       └── auth_repository.dart
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   └── user.dart
│   │   │   │   └── usecases/
│   │   │   │       ├── login_usecase.dart
│   │   │   │       └── register_usecase.dart
│   │   │   └── presentation/
│   │   │       ├── controllers/
│   │   │       │   └── auth_controller.dart
│   │   │       ├── pages/
│   │   │       │   ├── login_page.dart
│   │   │       │   └── register_page.dart
│   │   │       └── widgets/
│   │   │           └── auth_form.dart
│   │   │
│   │   ├── features/
│   │   │   ├── data/
│   │   │   │   ├── datasources/
│   │   │   │   ├── models/
│   │   │   │   └── repositories/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   └── usecases/
│   │   │   └── presentation/
│   │   │       ├── controllers/
│   │   │       ├── pages/
│   │   │       └── widgets/
│   │   │
│   │   └── profile/
│   │       ├── data/
│   │       ├── domain/
│   │       └── presentation/
│   │
│   ├── core/
│   │   ├── constants/
│   │   │   ├── app_constants.dart
│   │   │   └── api_constants.dart
│   │   ├── network/
│   │   │   ├── dio_client.dart
│   │   │   └── api_service.dart
│   │   ├── storage/
│   │   │   ├── local_storage.dart
│   │   │   └── secure_storage.dart
│   │   ├── utils/
│   │   │   ├── validators.dart
│   │   │   ├── formatters.dart
│   │   │   └── helpers.dart
│   │   ├── extensions/
│   │   │   ├── string_extension.dart
│   │   │   └── context_extension.dart
│   │   ├── widgets/
│   │   │   ├── app_button.dart
│   │   │   ├── app_input.dart
│   │   │   ├── app_card.dart
│   │   │   └── error_widget.dart
│   │   └── errors/
│   │       ├── exceptions.dart
│   │       └── failures.dart
│   │
│   ├── config/
│   │   ├── di.dart           # Dependency injection
│   │   └── env_config.dart   # Environment config
│   │
│   └── main.dart
│
├── test/
│   ├── features/
│   │   └── auth/
│   │       ├── domain/
│   │       │   └── usecases/
│   │       │       └── login_usecase_test.dart
│   │       └── data/
│   │           └── repositories/
│   │               └── auth_repository_test.dart
│   └── core/
│       └── utils/
│           └── validators_test.dart
│
├── integration_test/
│   ├── app_test.dart
│   ├── auth_flow_test.dart
│   └── features_test.dart
│
├── android/
│   └── app/
│       └── build.gradle      # Android build config
│
├── ios/
│   └── Runner.xcodeproj/     # iOS build config
│
├── .env
├── .env.example
└── README.md
```

---

## 2. ARCHITECTURE (CLEAN ARCHITECTURE)

```
Domain Layer (Pure Dart, no dependencies)
├── Entities (User, Feature, etc.)
├── Repositories (Abstract interfaces)
└── UseCases (Business logic)

Data Layer (Implementation)
├── DataSources (Remote, Local)
├── Models (with fromJson, toJson)
└── Repositories (Implement domain repositories)

Presentation Layer (UI)
├── Controllers (Riverpod/GetX)
├── Pages (Screens)
└── Widgets (Components)
```

---

## 3. STATE MANAGEMENT (RIVERPOD)

```dart
// lib/core/di/providers.dart
import 'package:riverpod/riverpod.dart';

final dioProvider = Provider((ref) => DioClient().dio);

final authRepositoryProvider = Provider((ref) {
  final dio = ref.watch(dioProvider);
  return AuthRepository(dio);
});

final authControllerProvider = StateNotifierProvider<AuthController, AuthState>(
  (ref) {
    final authRepo = ref.watch(authRepositoryProvider);
    return AuthController(authRepo);
  },
);

// Usage in widgets
class LoginPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authControllerProvider);
    
    return Scaffold(
      body: authState.when(
        data: (_) => Text('Logged in'),
        loading: () => CircularProgressIndicator(),
        error: (err, stack) => Text('Error: $err'),
      ),
    );
  }
}
```

---

## 4. NETWORKING

```dart
// lib/core/network/dio_client.dart
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class DioClient {
  final Dio dio = Dio(
    BaseOptions(
      baseUrl: 'http://localhost:3000',
      connectTimeout: Duration(seconds: 10),
      receiveTimeout: Duration(seconds: 10),
      headers: {'Content-Type': 'application/json'},
    ),
  );

  DioClient() {
    // Add interceptors
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await SecureStorage.getAccessToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            // Refresh token
            final refreshed = await _refreshToken();
            if (refreshed) {
              return handler.resolve(await _retry(error.requestOptions));
            }
          }
          return handler.next(error);
        },
      ),
    );
  }

  Future<bool> _refreshToken() async {
    try {
      final refreshToken = await SecureStorage.getRefreshToken();
      final response = await dio.post(
        '/auth/refresh',
        data: {'refreshToken': refreshToken},
      );
      
      await SecureStorage.saveTokens(
        response.data['accessToken'],
        response.data['refreshToken'],
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<Response<dynamic>> _retry(RequestOptions requestOptions) async {
    final options = Options(
      method: requestOptions.method,
      headers: requestOptions.headers,
    );
    return dio.request<dynamic>(
      requestOptions.path,
      data: requestOptions.data,
      queryParameters: requestOptions.queryParameters,
      options: options,
    );
  }
}
```

---

## 5. SECURE STORAGE

```dart
// lib/core/storage/secure_storage.dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorage {
  static const _storage = FlutterSecureStorage();
  static const _accessTokenKey = 'accessToken';
  static const _refreshTokenKey = 'refreshToken';

  static Future<void> saveTokens(
    String accessToken,
    String refreshToken,
  ) async {
    await Future.wait([
      _storage.write(key: _accessTokenKey, value: accessToken),
      _storage.write(key: _refreshTokenKey, value: refreshToken),
    ]);
  }

  static Future<String?> getAccessToken() async {
    return await _storage.read(key: _accessTokenKey);
  }

  static Future<String?> getRefreshToken() async {
    return await _storage.read(key: _refreshTokenKey);
  }

  static Future<void> clearTokens() async {
    await Future.wait([
      _storage.delete(key: _accessTokenKey),
      _storage.delete(key: _refreshTokenKey),
    ]);
  }
}
```

---

## 6. MODELS & ENTITIES

```dart
// lib/features/auth/domain/entities/user.dart
class User {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final List<String> roles;

  User({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.roles,
  });
}

// lib/features/auth/data/models/user_model.dart
class UserModel extends User {
  UserModel({
    required String id,
    required String email,
    required String firstName,
    required String lastName,
    required List<String> roles,
  }) : super(
    id: id,
    email: email,
    firstName: firstName,
    lastName: lastName,
    roles: roles,
  );

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      email: json['email'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      roles: List<String>.from(json['roles']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'roles': roles,
    };
  }
}
```

---

## 7. USECASES

```dart
// lib/features/auth/domain/usecases/login_usecase.dart
import 'package:fpdart/fpdart.dart';

abstract class AuthRepository {
  Future<Either<Failure, LoginResponse>> login(String email, String password);
}

class LoginUsecase {
  final AuthRepository repository;

  LoginUsecase(this.repository);

  Future<Either<Failure, LoginResponse>> call(
    String email,
    String password,
  ) async {
    return await repository.login(email, password);
  }
}
```

---

## 8. REPOSITORIES

```dart
// lib/features/auth/data/repositories/auth_repository.dart
class AuthRepository implements AuthRepositoryAbstract {
  final DioClient dioClient;
  final SecureStorage secureStorage;

  AuthRepository(this.dioClient, this.secureStorage);

  @override
  Future<Either<Failure, LoginResponse>> login(
    String email,
    String password,
  ) async {
    try {
      final response = await dioClient.post(
        '/auth/login',
        data: {'email': email, 'password': password},
      );

      final user = UserModel.fromJson(response.data['user']);
      await secureStorage.saveTokens(
        response.data['accessToken'],
        response.data['refreshToken'],
      );

      return Right(LoginResponse(user: user));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
```

---

## 9. PAGES & WIDGETS

```dart
// lib/features/auth/presentation/pages/login_page.dart
class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  late TextEditingController _emailController;
  late TextEditingController _passwordController;

  @override
  void initState() {
    super.initState();
    _emailController = TextEditingController();
    _passwordController = TextEditingController();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);

    return Scaffold(
      appBar: AppBar(title: Text('Login')),
      body: authState.when(
        data: (_) => _buildForm(context),
        loading: () => Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Error: $error')),
      ),
    );
  }

  Widget _buildForm(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(16),
      child: Column(
        children: [
          TextField(
            controller: _emailController,
            decoration: InputDecoration(
              labelText: 'Email',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 16),
          TextField(
            controller: _passwordController,
            decoration: InputDecoration(
              labelText: 'Password',
              border: OutlineInputBorder(),
            ),
            obscureText: true,
          ),
          SizedBox(height: 24),
          ElevatedButton(
            onPressed: _handleLogin,
            child: Text('Login'),
          ),
        ],
      ),
    );
  }

  void _handleLogin() {
    ref.read(authControllerProvider.notifier).login(
      _emailController.text,
      _passwordController.text,
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
```

---

## 10. TESTING

```dart
// test/features/auth/domain/usecases/login_usecase_test.dart
void main() {
  late LoginUsecase loginUsecase;
  late MockAuthRepository mockAuthRepository;

  setUp(() {
    mockAuthRepository = MockAuthRepository();
    loginUsecase = LoginUsecase(mockAuthRepository);
  });

  test('should return LoginResponse when login succeeds', () async {
    // Arrange
    const email = 'test@example.com';
    const password = 'password123';
    final mockResponse = LoginResponse(user: mockUser);
    
    when(mockAuthRepository.login(email, password))
        .thenAnswer((_) async => Right(mockResponse));

    // Act
    final result = await loginUsecase(email, password);

    // Assert
    expect(result, Right(mockResponse));
    verify(mockAuthRepository.login(email, password)).called(1);
  });
}
```

---

## 11. BUILD & DEPLOYMENT

### Development

```bash
flutter pub get
flutter run

# Run on specific device
flutter devices
flutter run -d <device-id>
```

### Build APK (Android)

```bash
flutter build apk --release
# Output: build/app/outputs/flutter-app.apk

# Split by ABI
flutter build apk --split-per-abi --release
```

### Build iOS

```bash
flutter build ios --release
# Then use Xcode to sign and build IPA
```

### Using Fastlane

```yaml
# ios/fastlane/Fastfile
default_platform(:ios)

platform :ios do
  desc "Build and upload to TestFlight"
  lane :release do
    build_app(
      workspace: "ios/Runner.xcworkspace",
      scheme: "Runner",
      configuration: "Release",
      archive_path: "build/ios/archive.xcarchive",
      export_method: "app-store",
    )
  end
end
```

---

## 12. KANBAN TASK BREAKDOWN

- [ ] **TASK-01: Flutter Project Setup**
- [ ] **TASK-02: Riverpod & DI Setup**
- [ ] **TASK-03: Networking & Dio Client**
- [ ] **TASK-04: Secure Storage & Auth**
- [ ] **TASK-05: Auth Pages (Login, Register)**
- [ ] **TASK-06: Feature List Page**
- [ ] **TASK-07: Create/Edit/Delete Features**
- [ ] **TASK-08: Error Handling & Loading**
- [ ] **TASK-09: Testing & Coverage**
- [ ] **TASK-10: Build & Deploy (iOS/Android)**

---

## 13. CONSTRAINTS

- Target: iOS 12+, Android 8+ (API 21+)
- Performance: <3s app startup
- Minimum 70% code coverage
- OWASP mobile security standards
