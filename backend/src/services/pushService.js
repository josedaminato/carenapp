const prisma = require('../config/database');

/**
 * MVP: logs push payloads. En producción, integrar Expo Push API.
 * https://docs.expo.dev/push-notifications/sending-notifications/
 */
async function sendPushToUsers(userIds, { title, body, data = {} }) {
  if (!userIds.length) return;

  const tokens = await prisma.pushToken.findMany({
    where: { userId: { in: userIds } },
    select: { token: true, userId: true },
  });

  if (!tokens.length) return;

  const messages = tokens.map((t) => ({
    to: t.token,
    sound: 'default',
    title,
    body,
    data,
  }));

  if (process.env.NODE_ENV === 'development') {
    console.log('[Push]', JSON.stringify(messages, null, 2));
    return;
  }

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });
    const result = await response.json();
    if (result.errors) {
      console.error('[Push errors]', result.errors);
    }
  } catch (err) {
    console.error('[Push failed]', err.message);
  }
}

async function registerPushToken(userId, token, platform) {
  return prisma.pushToken.upsert({
    where: { token },
    create: { userId, token, platform },
    update: { userId, platform },
  });
}

async function unregisterPushToken(userId, token) {
  await prisma.pushToken.deleteMany({ where: { userId, token } });
}

module.exports = { sendPushToUsers, registerPushToken, unregisterPushToken };
