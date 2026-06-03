import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '../../src/components/Button';
import { useAuth } from '../../src/context/AuthContext';
import { ApiError } from '../../src/services/api';
import { colors, spacing, typography } from '../../src/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(app)/home');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Error al iniciar sesión');
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
          <Text style={styles.title}>Bienvenida de vuelta</Text>

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
            secureTextEntry
          />

          <Link href="/(auth)/forgot-password" style={styles.forgot}>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </Link>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button title="Entrar" onPress={handleLogin} loading={loading} />
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
  forgot: { alignSelf: 'flex-end', marginBottom: spacing.lg },
  forgotText: { color: colors.secondary, fontSize: 14 },
  error: { color: colors.error, marginBottom: spacing.md, textAlign: 'center' },
});
