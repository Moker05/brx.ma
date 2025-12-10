import jwt from 'jsonwebtoken';
import { JwtPayload, TokenPayload } from '../types/auth.types';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'brx_access_secret_dev';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'brx_refresh_secret_dev';
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '30d';


export const signAccessToken = (payload: TokenPayload): string => {
  // cast to any to avoid typing mismatch in some TS setups
  return jwt.sign(payload as any, ACCESS_SECRET as any, { expiresIn: ACCESS_EXPIRES } as any);
};

export const signRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload as any, REFRESH_SECRET as any, { expiresIn: REFRESH_EXPIRES } as any);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, ACCESS_SECRET as any) as JwtPayload;
  } catch (e) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, REFRESH_SECRET as any) as JwtPayload;
  } catch (e) {
    throw new Error('Invalid or expired refresh token');
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (e) {
    return null;
  }
};
