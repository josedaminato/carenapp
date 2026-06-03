import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../src/context/AuthContext';
import { api } from '../../src/services/api';
import { colors, spacing, borderRadius, typography } from '../../src/theme';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [groups, setGroups] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadGroups = async () => {
    try {
      const { groups: data } = await api.listGroups();
      setGroups(data);
    } catch {
      setGroups([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGroups();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGroups();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {user?.displayName} ✨</Text>
          <Text style={styles.subtitle}>Mis grupos</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Salir</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Aún no tienes grupos. ¡Crea uno o únete con un código!</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/(app)/group/${item.id}`)}
            activeOpacity={0.8}
          >
            <Text style={styles.groupName}>💜 {item.name}</Text>
            <Text style={styles.groupMeta}>
              {item.memberCount} integrantes · 🔥 {item.lightsToday ?? 0} hoy
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.footer}>
        <Link href="/(app)/create-group" asChild>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>+ Crear grupo</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(app)/join-group" asChild>
          <TouchableOpacity style={[styles.actionBtn, styles.actionOutline]}>
            <Text style={styles.actionOutlineText}>🔗 Unirse con código</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  greeting: { ...typography.subtitle, fontSize: 22 },
  subtitle: { ...typography.caption, marginTop: 4 },
  logout: { color: colors.textDim, fontSize: 14 },
  list: { padding: spacing.lg, paddingTop: 0, flexGrow: 1 },
  empty: {
    color: colors.textDim,
    textAlign: 'center',
    marginTop: spacing.xxl,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  groupName: { color: colors.text, fontSize: 18, fontWeight: '600', marginBottom: 4 },
  groupMeta: { color: colors.textMuted, fontSize: 14 },
  footer: { padding: spacing.lg, gap: spacing.sm },
  actionBtn: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  actionOutline: { borderColor: colors.secondary },
  actionText: { color: colors.primary, fontWeight: '600', fontSize: 16 },
  actionOutlineText: { color: colors.secondary, fontWeight: '600', fontSize: 16 },
});
