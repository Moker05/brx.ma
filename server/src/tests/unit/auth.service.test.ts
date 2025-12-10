/**
 * Unit Tests for Auth Service
 */
import { registerUser, loginUser, verifyToken } from '../../services/auth.service';
import { generateTokensForUser } from '../../utils/jwt';
import { prisma } from '../../utils/prisma';

// Mock Prisma
jest.mock('../../utils/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

import bcrypt from 'bcryptjs';

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@brx.ma',
        password: 'hashed_password',
        name: 'Test User',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const user = await registerUser('test@brx.ma', 'Password123!', 'Test User');

      expect(user.email).toBe('test@brx.ma');
      expect(user.name).toBe('Test User');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@brx.ma',
          password: 'hashed_password',
          name: 'Test User',
        },
      });
    });

    it('should throw error if email already exists', async () => {
      const existingUser = {
        id: '1',
        email: 'test@brx.ma',
        password: 'hashed_password',
        name: 'Existing User',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

      await expect(
        registerUser('test@brx.ma', 'Password123!', 'Test User')
      ).rejects.toThrow('Email already registered');
    });

    it('should throw error for weak password', async () => {
      await expect(
        registerUser('test@brx.ma', '123', 'Test User')
      ).rejects.toThrow();
    });
  });

  describe('loginUser', () => {
    it('should login user with correct credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'test@brx.ma',
        password: 'hashed_password',
        name: 'Test User',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const user = await loginUser('test@brx.ma', 'Password123!');

      expect(user.email).toBe('test@brx.ma');
      expect(bcrypt.compare).toHaveBeenCalledWith('Password123!', 'hashed_password');
    });

    it('should throw error for non-existent user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        loginUser('nonexistent@brx.ma', 'Password123!')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for incorrect password', async () => {
      const mockUser = {
        id: '1',
        email: 'test@brx.ma',
        password: 'hashed_password',
        name: 'Test User',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        loginUser('test@brx.ma', 'WrongPassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('JWT Tokens', () => {
    it('should generate access and refresh tokens', () => {
      const tokens = generateTokensForUser({ id: '1', email: 'test@brx.ma' });

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
    });

    it('should verify valid token', () => {
      const tokens = generateTokensForUser({ id: '1', email: 'test@brx.ma' });
      const decoded = verifyToken(tokens.accessToken);

      expect(decoded).toHaveProperty('userId', '1');
      expect(decoded).toHaveProperty('email', 'test@brx.ma');
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        verifyToken('invalid.token.here');
      }).toThrow();
    });
  });
});
