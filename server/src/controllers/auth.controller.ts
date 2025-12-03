import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { validateRequest, registerSchema, loginSchema } from '../utils/validation';
import { RegisterDto, LoginDto, AuthResponse } from '../types/auth.types';
import { prisma } from '../utils/prisma';

// TEMPORARY: In-memory user storage until Prisma is configured
interface InMemoryUser {
  id: string;
  email: string;
  password: string;
  name: string | null;
  createdAt: Date;
}

const inMemoryUsers: InMemoryUser[] = [];
let userIdCounter = 1;

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const data = validateRequest<RegisterDto>(registerSchema, req.body);

    // Check if user already exists (in-memory)
    const existingUser = inMemoryUsers.find(u => u.email === data.email);

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà',
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user (in-memory)
    const newUser: InMemoryUser = {
      id: `user_${userIdCounter++}`,
      email: data.email,
      password: hashedPassword,
      name: data.name || null,
      createdAt: new Date(),
    };

    inMemoryUsers.push(newUser);

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
    });

    // Response (without password)
    const { password, ...userWithoutPassword } = newUser;
    const response: AuthResponse = {
      user: userWithoutPassword,
      token,
    };

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: response,
    });
  } catch (error) {
    console.error('Register error:', error);

    if (error instanceof Error && error.message.startsWith('Validation failed')) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du compte',
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const data = validateRequest<LoginDto>(loginSchema, req.body);

    // Find user by email (in-memory)
    const user = inMemoryUsers.find(u => u.email === data.email);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
      return;
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    // Response
    const response: AuthResponse = {
      user: userWithoutPassword,
      token,
    };

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: response,
    });
  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof Error && error.message.startsWith('Validation failed')) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
    });
  }
};

/**
 * Get current user
 * GET /api/auth/me
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // User is already attached to request by auth middleware
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Non authentifié',
      });
      return;
    }

    // Get user from in-memory storage
    const user = inMemoryUsers.find(u => u.id === req.user!.userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
      return;
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'utilisateur',
    });
  }
};

/**
 * Logout user (client-side only, just remove token)
 * POST /api/auth/logout
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Déconnexion réussie',
  });
};
