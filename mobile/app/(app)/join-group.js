import { useState } from 'react';
import { Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '../../src/components/Button';
import { api, ApiError } from '../../src/services/api';
import { colors, spacing, typography } from '../../src/theme';

export default function JoinGroupScreen() {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      setError('Ingresa el código de invitación');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { group } = await api.joinGroup({ inviteCode: inviteCode.trim().toUpperCase() });
      router.replace(`/(app)/group/${group.id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Error al unirse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <Text style={styles.back} onPress={() => router.back()}>
          ← Volver
        </Text>
        <Text style={styles.title}>Unirse a un grupo</Text>
        <Input
          label="Código de invitación"
          value={inviteCode}
          onChangeText={setInviteCode}
          placeholder="ABC12XYZ"
          autoCapitalize="characters"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Unirme" onPress={handleJoin} loading={loading} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  flex: { flex: 1 },
  back: { color: colors.textMuted, fontSize: 16, marginBottom: spacing.lg },
  title: { ...typography.title, marginBottom: spacing.xl },
  error: { color: colors.error, marginBottom: spacing.md },
});
