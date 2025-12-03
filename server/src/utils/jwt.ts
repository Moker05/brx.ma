import jwt from 'jsonwebtoken';
import { JwtPayload, TokenPayload } from '../types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET || 'brx_jwt_secret_development_key_2025_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRE || '7d';

/**
 * Generate JWT token
 */
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Decode token without verification (for debugging)
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    return null;
  }
};
