import { useCallback, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { Button } from '../../src/components/Button';
import { LightOrb } from '../../src/components/LightOrb';
import { FeedItem } from '../../src/components/FeedItem';
import { api, ApiError } from '../../src/services/api';
import { colors, spacing, borderRadius, typography } from '../../src/theme';

export default function GroupScreen() {
  const { id } = useLocalSearchParams();
  const [group, setGroup] = useState(null);
  const [lightActive, setLightActive] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const pollRef = useRef(null);

  const loadGroup = async () => {
    try {
      const { group: data } = await api.getGroup(id);
      setGroup(data);
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        Alert.alert('Error', 'No tienes acceso a este grupo');
        router.back();
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGroup();
      pollRef.current = setInterval(loadGroup, 5000);
      return () => clearInterval(pollRef.current);
    }, [id])
  );

  useEffect(() => {
    if (lightActive) {
      const t = setTimeout(() => setLightActive(false), 4000);
      return () => clearTimeout(t);
    }
  }, [lightActive]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGroup();
    setRefreshing(false);
  };

  const handleTriggerLight = async () => {
    setTriggering(true);
    try {
      await api.triggerLight(id);
      setLightActive(true);
      await loadGroup();
    } catch (e) {
      Alert.alert('Ups', e instanceof ApiError ? e.message : 'No se pudo encender la luz');
    } finally {
      setTriggering(false);
    }
  };

  const copyCode = async () => {
    if (group?.inviteCode) {
      await Clipboard.setStringAsync(group.inviteCode);
      Alert.alert('Copiado', 'Código copiado al portapapeles');
    }
  };

  const handleReact = async (eventId, emoji) => {
    try {
      await api.addReaction(eventId, emoji);
      await loadGroup();
    } catch {
      // silent
    }
  };

  if (!group) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  const recentLight =
    group.feed?.[0] &&
    Date.now() - new Date(group.feed[0].triggeredAt).getTime() < 60000;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.scroll}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← {group.name}</Text>
        </TouchableOpacity>

        <Text style={styles.meta}>
          {group.memberCount} integrantes · código:{' '}
          <Text style={styles.code} onPress={copyCode}>
            {group.inviteCode}
          </Text>{' '}
          <Text style={styles.copy} onPress={copyCode}>
            [Copiar]
          </Text>
        </Text>

        <View style={styles.orbSection}>
          <LightOrb active={lightActive || recentLight} size={120} />
          <Text style={styles.orbLabel}>
            {lightActive || recentLight ? 'LUZ ENCENDIDA' : 'LUZ APAGADA'}
          </Text>
        </View>

        <Button
          title="💡 ENCENDER LUZ"
          onPress={handleTriggerLight}
          loading={triggering}
          style={styles.triggerBtn}
        />

        <View style={styles.statsRow}>
          <Text style={styles.statsTitle}>Estadísticas</Text>
          <View style={styles.statsGrid}>
            <StatBox label="Hoy" value={group.stats?.today ?? 0} />
            <StatBox label="Semana" value={group.stats?.week ?? 0} />
            <StatBox label="Racha" value={`🔥 ${group.stats?.streak ?? 0}d`} />
          </View>
        </View>

        <Text style={styles.feedTitle}>Muro</Text>
        {group.feed?.length ? (
          group.feed.map((event) => (
            <FeedItem key={event.id} event={event} onReact={handleReact} />
          ))
        ) : (
          <Text style={styles.emptyFeed}>
            Aún no hay luces en este grupo. ¡Sé la primera en encenderla! ✨
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ label, value }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  loading: { color: colors.textMuted, textAlign: 'center', marginTop: 100 },
  back: { ...typography.subtitle, marginBottom: spacing.xs },
  meta: { ...typography.caption, marginBottom: spacing.lg },
  code: { color: colors.secondary, fontWeight: '700', letterSpacing: 1 },
  copy: { color: colors.accent },
  orbSection: { alignItems: 'center', marginVertical: spacing.lg },
  orbLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: spacing.md,
  },
  triggerBtn: { marginBottom: spacing.xl },
  statsRow: { marginBottom: spacing.lg },
  statsTitle: { ...typography.caption, marginBottom: spacing.sm, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', gap: spacing.sm },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  statValue: { color: colors.text, fontSize: 20, fontWeight: '700' },
  statLabel: { color: colors.textDim, fontSize: 12, marginTop: 4 },
  feedTitle: { ...typography.caption, fontWeight: '600', marginBottom: spacing.sm },
  emptyFeed: { color: colors.textDim, textAlign: 'center', lineHeight: 22, marginTop: spacing.md },
});
