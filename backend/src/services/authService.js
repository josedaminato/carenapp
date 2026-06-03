const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../config/database');
const config = require('../config');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  getRefreshExpiryDate,
} = require('../utils/jwt');

async function register({ email, password, displayName }) {
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    const err = new Error('El email ya está registrado');
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, config.bcryptRounds);
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      displayName,
    },
    select: { id: true, email: true, displayName: true, createdAt: true },
  });

  const tokens = await issueTokens(user.id);
  return { user, ...tokens };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    const err = new Error('Credenciales inválidas');
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const err = new Error('Credenciales inválidas');
    err.status = 401;
    throw err;
  }

  const tokens = await issueTokens(user.id);
  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
    },
    ...tokens,
  };
}

async function issueTokens(userId) {
  const accessToken = signAccessToken(userId);
  const refreshToken = signRefreshToken(userId);

  await prisma.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt: getRefreshExpiryDate(),
    },
  });

  return { accessToken, refreshToken };
}

async function refresh(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    const err = new Error('Refresh token inválido');
    err.status = 401;
    throw err;
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored || stored.expiresAt < new Date()) {
    const err = new Error('Refresh token expirado');
    err.status = 401;
    throw err;
  }

  await prisma.refreshToken.delete({ where: { id: stored.id } });
  return issueTokens(payload.sub);
}

async function logout(refreshToken) {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
}

async function requestPasswordReset(email) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return { message: 'Si el email existe, recibirás un enlace de recuperación' };

  const token = uuidv4();
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 3600000),
    },
  });

  // MVP: log token (en producción → email service)
  if (config.nodeEnv === 'development') {
    console.log(`[Password Reset] Token for ${email}: ${token}`);
  }

  return {
    message: 'Si el email existe, recibirás un enlace de recuperación',
    ...(config.nodeEnv === 'development' && { resetToken: token }),
  };
}

async function resetPassword({ token, newPassword }) {
  const reset = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!reset || reset.used || reset.expiresAt < new Date()) {
    const err = new Error('Token de recuperación inválido o expirado');
    err.status = 400;
    throw err;
  }

  const passwordHash = await bcrypt.hash(newPassword, config.bcryptRounds);
  await prisma.$transaction([
    prisma.user.update({ where: { id: reset.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: reset.id }, data: { used: true } }),
  ]);

  return { message: 'Contraseña actualizada correctamente' };
}

async function getProfile(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, displayName: true, createdAt: true },
  });
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  requestPasswordReset,
  resetPassword,
  getProfile,
};
