const prisma = require('../config/database');
const config = require('../config');
const { generateInviteCode } = require('../utils/inviteCode');
const { randomLightMessage } = require('../utils/messages');
const { sendPushToUsers } = require('./pushService');

async function ensureMembership(groupId, userId) {
  const member = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  if (!member) {
    const err = new Error('No eres miembro de este grupo');
    err.status = 403;
    throw err;
  }
  return member;
}

async function createGroup(userId, name) {
  let inviteCode;
  let attempts = 0;
  do {
    inviteCode = generateInviteCode();
    attempts++;
  } while (attempts < 5 && (await prisma.group.findUnique({ where: { inviteCode } })));

  const group = await prisma.group.create({
    data: {
      name,
      inviteCode,
      createdBy: userId,
      members: { create: { userId } },
    },
    include: { _count: { select: { members: true } } },
  });

  return formatGroup(group);
}

async function joinGroup(userId, inviteCode) {
  const group = await prisma.group.findFirst({
    where: { inviteCode: inviteCode.toUpperCase(), isActive: true },
    include: { _count: { select: { members: true } } },
  });

  if (!group) {
    const err = new Error('Código de invitación inválido');
    err.status = 404;
    throw err;
  }

  if (group._count.members >= config.maxGroupMembers) {
    const err = new Error('El grupo está lleno (máximo 20 integrantes)');
    err.status = 400;
    throw err;
  }

  const existing = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId: group.id, userId } },
  });
  if (existing) {
    return formatGroup(group);
  }

  await prisma.groupMember.create({ data: { groupId: group.id, userId } });
  const updated = await prisma.group.findUnique({
    where: { id: group.id },
    include: { _count: { select: { members: true } } },
  });

  return formatGroup(updated);
}

async function listUserGroups(userId) {
  const memberships = await prisma.groupMember.findMany({
    where: { userId, group: { isActive: true } },
    include: {
      group: {
        include: {
          _count: { select: { members: true } },
          lightEvents: {
            where: { triggeredAt: { gte: startOfDay() } },
            select: { id: true },
          },
        },
      },
    },
    orderBy: { joinedAt: 'desc' },
  });

  return memberships.map((m) => ({
    ...formatGroup(m.group),
    lightsToday: m.group.lightEvents.length,
  }));
}

async function getGroupDetail(groupId, userId) {
  await ensureMembership(groupId, userId);

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: { _count: { select: { members: true } } },
  });

  if (!group?.isActive) {
    const err = new Error('Grupo no encontrado');
    err.status = 404;
    throw err;
  }

  const [stats, events] = await Promise.all([
    getGroupStats(groupId),
    getGroupFeed(groupId),
  ]);

  return {
    ...formatGroup(group),
    stats,
    feed: events,
  };
}

async function triggerLight(groupId, userId) {
  await ensureMembership(groupId, userId);

  const oneHourAgo = new Date(Date.now() - 3600000);
  const recentCount = await prisma.lightEvent.count({
    where: { userId, triggeredAt: { gte: oneHourAgo } },
  });

  if (recentCount >= config.maxLightsPerHour) {
    const err = new Error('Has alcanzado el límite de luces por hora');
    err.status = 429;
    throw err;
  }

  const message = randomLightMessage();
  const event = await prisma.lightEvent.create({
    data: { groupId, userId, message },
  });

  const members = await prisma.groupMember.findMany({
    where: { groupId, userId: { not: userId } },
    select: { userId: true },
  });

  const memberIds = members.map((m) => m.userId);
  await sendPushToUsers(memberIds, {
    title: 'Luz Secreta ✨',
    body: 'Una luz acaba de encenderse ✨',
    data: { groupId, type: 'light_triggered' },
  });

  return formatLightEvent(event);
}

async function getGroupFeed(groupId, limit = 30) {
  const events = await prisma.lightEvent.findMany({
    where: { groupId },
    orderBy: { triggeredAt: 'desc' },
    take: limit,
    include: {
      reactions: { select: { emoji: true } },
    },
  });

  return events.map(formatLightEventWithReactions);
}

async function getGroupStats(groupId) {
  const now = new Date();
  const startDay = startOfDay(now);
  const startWeek = startOfWeek(now);

  const [todayCount, weekCount, dailyActivity] = await Promise.all([
    prisma.lightEvent.count({
      where: { groupId, triggeredAt: { gte: startDay } },
    }),
    prisma.lightEvent.count({
      where: { groupId, triggeredAt: { gte: startWeek } },
    }),
    prisma.$queryRaw`
      SELECT DATE(triggered_at) as day, COUNT(*)::int as count
      FROM light_events
      WHERE group_id = ${groupId}::uuid
        AND triggered_at >= ${new Date(now.getTime() - 90 * 86400000)}
      GROUP BY DATE(triggered_at)
      ORDER BY day DESC
    `,
  ]);

  const streak = calculateStreak(dailyActivity);

  return { today: todayCount, week: weekCount, streak };
}

function calculateStreak(dailyActivity) {
  if (!dailyActivity.length) return 0;

  const days = new Set(
    dailyActivity.map((d) => {
      const date = d.day instanceof Date ? d.day : new Date(d.day);
      return date.toISOString().slice(0, 10);
    })
  );

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(date = new Date()) {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

function formatGroup(group) {
  return {
    id: group.id,
    name: group.name,
    inviteCode: group.inviteCode,
    memberCount: group._count?.members ?? 0,
    createdAt: group.createdAt,
  };
}

function formatLightEvent(event) {
  return {
    id: event.id,
    groupId: event.groupId,
    message: event.message,
    triggeredAt: event.triggeredAt,
  };
}

function formatLightEventWithReactions(event) {
  const reactionMap = {};
  for (const r of event.reactions) {
    reactionMap[r.emoji] = (reactionMap[r.emoji] || 0) + 1;
  }

  return {
    ...formatLightEvent(event),
    reactions: Object.entries(reactionMap).map(([emoji, count]) => ({ emoji, count })),
  };
}

module.exports = {
  createGroup,
  joinGroup,
  listUserGroups,
  getGroupDetail,
  triggerLight,
  getGroupFeed,
  getGroupStats,
  ensureMembership,
};
