import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';
import { ALLOWED_EMOJIS } from '../constants/emojis';

export function FeedItem({ event, onReact }) {
  const timeAgo = formatTimeAgo(event.triggeredAt);

  return (
    <View style={styles.card}>
      <Text style={styles.message}>{event.message}</Text>
      <Text style={styles.time}>{timeAgo}</Text>
      <View style={styles.reactions}>
        {ALLOWED_EMOJIS.slice(0, 4).map((emoji) => {
          const count =
            event.reactions?.find((r) => r.emoji === emoji)?.count || 0;
          return (
            <TouchableOpacity
              key={emoji}
              style={[styles.reactionBtn, count > 0 && styles.reactionActive]}
              onPress={() => onReact?.(event.id, emoji)}
            >
              <Text style={styles.emoji}>{emoji}</Text>
              {count > 0 && <Text style={styles.count}>{count}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function formatTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  return `hace ${Math.floor(hours / 24)}d`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  message: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  time: {
    color: colors.textDim,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  reactions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  reactionActive: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  emoji: { fontSize: 16 },
  count: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
});
