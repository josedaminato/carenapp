import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { Button } from '../../../src/components/Button';
import { FireVisual } from '../../../src/components/FireVisual';
import { api, ApiError } from '../../../src/services/api';
import { colors, spacing, typography } from '../../../src/theme';
import { vibrateOnFireSent } from '../../../src/utils/haptics';

export default function GroupScreen() {
  const { id } = useLocalSearchParams();
  const [group, setGroup] = useState(null);
  const [triggering, setTriggering] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadGroup = async () => {
    try {
      const { group: data } = await api.getGroup(id);
      setGroup(data);
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        Alert.alert('Error', 'No tenés acceso a este grupo');
        router.back();
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGroup();
    }, [id])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGroup();
    setRefreshing(false);
  };

  const handleTriggerFire = async () => {
    setTriggering(true);
    try {
      await api.triggerFire(id);
      await vibrateOnFireSent();
      const { group: data } = await api.getGroup(id);
      setGroup(data);
    } catch (e) {
      Alert.alert('Ups', e instanceof ApiError ? e.message : 'No se pudo encender el fuego');
    } finally {
      setTriggering(false);
    }
  };

  const copyCode = async () => {
    if (group?.inviteCode) {
      await Clipboard.setStringAsync(group.inviteCode);
      Alert.alert('Copiado', 'Código copiado');
    }
  };

  if (!group) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← {group.name}</Text>
        </TouchableOpacity>

        <View style={styles.center}>
          <FireVisual active={group.fireActive} size={130} />

          {group.fireActive ? (
            <Text style={styles.message}>🔥 Alguien encendió el fuego.</Text>
          ) : (
            <Text style={styles.messageDim}>El fuego está apagado.</Text>
          )}

          <Button
            title="🔥 ENCENDER FUEGO"
            onPress={handleTriggerFire}
            loading={triggering}
            style={styles.btn}
          />
        </View>

        <View style={styles.invite}>
          <Text style={styles.inviteLabel}>Invitar amigas</Text>
          <TouchableOpacity onPress={copyCode}>
            <Text style={styles.inviteCode}>{group.inviteCode}</Text>
          </TouchableOpacity>
          <Text style={styles.inviteHint}>Tocá el código para copiar</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, padding: spacing.lg },
  loading: { color: colors.textMuted, textAlign: 'center', marginTop: 100 },
  back: { ...typography.subtitle, marginBottom: spacing.xl },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  message: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  messageDim: {
    color: colors.textDim,
    fontSize: 15,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  btn: { marginTop: spacing.xl, width: '100%' },
  invite: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLight,
  },
  inviteLabel: { color: colors.textMuted, fontSize: 13, marginBottom: spacing.sm },
  inviteCode: {
    color: colors.secondary,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 3,
  },
  inviteHint: { color: colors.textDim, fontSize: 12, marginTop: spacing.xs },
});
