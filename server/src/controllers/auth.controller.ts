import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import {
  registerUser,
  authenticateUser,
  generateTokensForUser,
  saveRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokensForUser,
  verifyAndConsumeRefreshToken,
  createPasswordResetToken,
  consumeAuthToken,
} from '../services/auth.service';
import { validateRequest, registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema } from '../utils/validation';
import { prisma } from '../utils/prisma';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = validateRequest(registerSchema, req.body);

    const user = await registerUser(data.email, data.password, data.name);

    const tokens = generateTokensForUser({ id: user.id, email: user.email });

    await saveRefreshToken(user.id, tokens.refreshToken).catch(() => {});

    // Set httpOnly cookie for refresh token
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: { user: { id: user.id, email: user.email, name: user.name }, accessToken: tokens.accessToken },
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error instanceof Error && error.message.includes('Email already')) {
      res.status(400).json({ success: false, message: 'Un utilisateur avec cet email existe déjà' });
      return;
    }
    if (error instanceof Error && error.message.startsWith('Validation failed')) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    res.status(500).json({ success: false, message: 'Erreur lors de la création du compte' });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = validateRequest(loginSchema, req.body);

    const user = await authenticateUser(data.email, data.password);

    const tokens = generateTokensForUser({ id: user.id, email: user.email });

    await saveRefreshToken(user.id, tokens.refreshToken).catch(() => {});

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: { user: { id: user.id, email: user.email, name: user.name }, accessToken: tokens.accessToken },
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error && error.message.startsWith('Validation failed')) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
  }
};

/**
 * Get current user
 * GET /api/auth/me
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Expect auth middleware to populate req.user with { userId }
    const auth = (req as any).user;
    if (!auth || !auth.userId) {
      res.status(401).json({ success: false, message: 'Non authentifié' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { id: true, email: true, name: true, emailVerified: true, createdAt: true, updatedAt: true } });

    if (!user) {
      res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération de l\'utilisateur' });
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Try cookie first
    const token = req.cookies?.refreshToken || req.body?.refreshToken || req.headers['x-refresh-token'];
    if (token) {
      await revokeRefreshToken(String(token)).catch(() => {});
    }
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Déconnexion réussie' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la déconnexion' });
  }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // token can come from cookie or body
    const token = req.cookies?.refreshToken || req.body?.refreshToken || req.headers['x-refresh-token'];
    if (!token) {
      res.status(400).json({ success: false, message: 'Refresh token requis' });
      return;
    }

    const decoded = await verifyAndConsumeRefreshToken(String(token));

    // revoke old token
    await revokeRefreshToken(String(token)).catch(() => {});

    const tokens = generateTokensForUser({ id: decoded.userId, email: decoded.email });

    await saveRefreshToken(decoded.userId, tokens.refreshToken).catch(() => {});

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, data: { accessToken: tokens.accessToken } });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ success: false, message: 'Refresh token invalide ou expiré' });
  }
};

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = validateRequest(forgotPasswordSchema, req.body);
    // Best-effort: do not reveal whether the email exists
    await createPasswordResetToken(data.email).catch(() => {});
    res.status(200).json({ success: true, message: 'Si cet email existe, vous recevrez un lien de réinitialisation.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la demande de réinitialisation' });
  }
};

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = validateRequest(resetPasswordSchema, req.body);
    const userId = await consumeAuthToken(data.token, 'RESET');

    const hashed = await bcrypt.hash(data.password, Number(process.env.BCRYPT_ROUNDS || 12));

    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    // Revoke all refresh tokens
    await revokeAllRefreshTokensForUser(userId).catch(() => {});

    res.status(200).json({ success: true, message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({ success: false, message: 'Token invalide ou expiré' });
  }
};

/**
 * Verify email with token
 * POST /api/auth/verify-email
 */
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = validateRequest(verifyEmailSchema, req.body);
    const userId = await consumeAuthToken(data.token, 'VERIFY');
    await prisma.user.update({ where: { id: userId }, data: { emailVerified: true } });
    res.status(200).json({ success: true, message: 'Email vérifié avec succès' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(400).json({ success: false, message: 'Token invalide ou expiré' });
  }
};
