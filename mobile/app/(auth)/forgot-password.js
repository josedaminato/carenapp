import { useState } from 'react';
import { Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '../../src/components/Button';
import { api, ApiError } from '../../src/services/api';
import { colors, spacing, typography } from '../../src/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await api.forgotPassword({ email: email.trim() });
      setMessage(res.message);
      if (res.resetToken) {
        setMessage(`${res.message}\n\nToken dev (solo desarrollo): ${res.resetToken}`);
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Error al enviar solicitud');
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
          <Link href="/(auth)/login" style={styles.back}>
            <Text style={styles.backText}>← Volver</Text>
          </Link>
          <Text style={styles.title}>Recuperar contraseña</Text>
          <Text style={styles.subtitle}>Te enviaremos un enlace a tu email</Text>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="ana@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {message ? <Text style={styles.success}>{message}</Text> : null}

          <Button title="Enviar enlace" onPress={handleSubmit} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { padding: spacing.lg },
  back: { marginBottom: spacing.lg },
  backText: { color: colors.textMuted, fontSize: 16 },
  title: { ...typography.title, marginBottom: spacing.sm },
  subtitle: { ...typography.caption, marginBottom: spacing.xl },
  error: { color: colors.error, marginBottom: spacing.md },
  success: { color: colors.success, marginBottom: spacing.md, lineHeight: 22 },
});
