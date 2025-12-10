import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail, sendResetPasswordEmail } from '../utils/email.util';

const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 12);

export async function registerUser(email: string, password: string, name?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email already registered');

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name: name || null,
    },
  });

  // Create virtual wallet if missing
  await prisma.virtualWallet.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, balance: 100000, currency: 'MAD' },
  });

  // Create default portfolio
  await prisma.portfolio.create({ data: { userId: user.id, name: 'Main Portfolio' } }).catch(() => {});

  // Create verification token
  const token = uuidv4();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await prisma.authToken.create({ data: { userId: user.id, token, type: 'VERIFY', expiresAt: expires } });

  // Send verification email (best-effort)
  sendVerificationEmail(email, token).catch((e) => console.error('Email send failed', e));

  return user;
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Invalid credentials');

  return user;
}

export function generateTokensForUser(user: { id: string; email: string }) {
  const payload = { userId: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return { accessToken, refreshToken };
}

export async function saveRefreshToken(userId: string, token: string) {
  const expiresAt = new Date(Date.now() + parseDuration(process.env.JWT_REFRESH_EXPIRES_IN || '30d'));
  await prisma.refreshToken.create({ data: { userId, token, expiresAt } });
}

export async function revokeRefreshToken(token: string) {
  await prisma.refreshToken.deleteMany({ where: { token } });
}

export async function revokeAllRefreshTokensForUser(userId: string) {
  await prisma.refreshToken.deleteMany({ where: { userId } });
}

export async function verifyAndConsumeRefreshToken(token: string) {
  // Verify signature
  const decoded = verifyRefreshToken(token);
  // Check DB
  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored) throw new Error('Refresh token not found');
  if (new Date(stored.expiresAt) < new Date()) {
    await prisma.refreshToken.delete({ where: { token } }).catch(() => {});
    throw new Error('Refresh token expired');
  }
  return decoded;
}

export async function createPasswordResetToken(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');
  const token = uuidv4();
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await prisma.authToken.create({ data: { userId: user.id, token, type: 'RESET', expiresAt: expires } });
  sendResetPasswordEmail(email, token).catch((e) => console.error('Email send failed', e));
  return token;
}

export async function consumeAuthToken(token: string, type: 'VERIFY' | 'RESET') {
  const record = await prisma.authToken.findUnique({ where: { token } });
  if (!record || record.type !== type) throw new Error('Invalid token');
  if (new Date(record.expiresAt) < new Date()) {
    await prisma.authToken.delete({ where: { token } }).catch(() => {});
    throw new Error('Token expired');
  }
  // delete after use
  await prisma.authToken.delete({ where: { token } });
  return record.userId;
}

function parseDuration(spec: string) {
  // simple parser: supports '30d', '15m', '1h'
  const m = spec.match(/^(\d+)([smhd])$/);
  if (!m) return 30 * 24 * 60 * 60 * 1000;
  const val = Number(m[1]);
  const unit = m[2];
  switch (unit) {
    case 's': return val * 1000;
    case 'm': return val * 60 * 1000;
    case 'h': return val * 60 * 60 * 1000;
    case 'd': return val * 24 * 60 * 60 * 1000;
    default: return val;
  }
}
