import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '../../src/components/Button';
import { useAuth } from '../../src/context/AuthContext';
import { ApiError } from '../../src/services/api';
import { colors, spacing, typography } from '../../src/theme';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    if (!displayName || !email || !password) {
      setError('Completa todos los campos');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    setLoading(true);
    try {
      await register(email.trim(), password, displayName.trim());
      router.replace('/(app)/home');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Link href="/(auth)/welcome" style={styles.back}>
            <Text style={styles.backText}>← Volver</Text>
          </Link>
          <Text style={styles.title}>Crear cuenta</Text>

          <Input label="Nombre" value={displayName} onChangeText={setDisplayName} placeholder="Ana" />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="ana@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 8 caracteres"
            secureTextEntry
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button title="Registrarme" onPress={handleRegister} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { padding: spacing.lg, paddingTop: spacing.md },
  back: { marginBottom: spacing.lg },
  backText: { color: colors.textMuted, fontSize: 16 },
  title: { ...typography.title, marginBottom: spacing.xl },
  error: { color: colors.error, marginBottom: spacing.md, textAlign: 'center' },
});
