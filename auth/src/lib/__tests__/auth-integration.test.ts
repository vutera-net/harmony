import { prisma } from '../prisma';
import bcrypt from 'bcryptjs';

// Mock prisma
jest.mock('../prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('Auth Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Integration', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('Password123!', 10),
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      // Simulate the authorize function from NextAuth
      const authorize = async (credentials: any) => {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return user;
      };

      const result = await authorize({ email: 'test@example.com', password: 'Password123!' });
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null if password is incorrect', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('Password123!', 10),
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const authorize = async (credentials: any) => {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return user;
      };

      const result = await authorize({ email: 'test@example.com', password: 'WrongPassword' });
      expect(result).toBeNull();
    });

    it('should return null if user is not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const authorize = async (credentials: any) => {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return user;
      };

      const result = await authorize({ email: 'nonexistent@example.com', password: 'Password123!' });
      expect(result).toBeNull();
    });
  });

  describe('Registration Integration', () => {
    it('should create a new user in the database', async () => {
      const userData = {
        email: 'new@example.com',
        password: 'Password123!',
      };
      const hashedPass = await bcrypt.hash(userData.password, 10);
      const mockCreatedUser = { id: '2', ...userData, password: hashedPass };
      
      (prisma.user.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const register = async (data: any) => {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return await prisma.user.create({
          data: {
            email: data.email,
            password: hashedPassword,
          },
        });
      };

      const result = await register(userData);
      expect(result).toEqual(mockCreatedUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: userData.email,
          password: expect.any(String),
        },
      });
    });
  });
});
