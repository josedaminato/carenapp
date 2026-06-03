import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { colors, spacing, typography } from '../../src/theme';

export default function WelcomeScreen() {
  return (
    <LinearGradient colors={[colors.background, '#1a0a2e', colors.background]} style={styles.flex}>
      <SafeAreaView style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.emoji}>✨ 💡 ✨</Text>
          <Text style={styles.title}>LUZ SECRETA</Text>
          <Text style={styles.tagline}>Tu círculo, tu complicidad</Text>
        </View>

        <View style={styles.actions}>
          <Link href="/(auth)/register" asChild>
            <Button title="Crear cuenta" />
          </Link>
          <Link href="/(auth)/login" asChild>
            <Button title="Iniciar sesión" variant="outline" style={styles.mt} />
          </Link>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    paddingBottom: spacing.xxl,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 48, marginBottom: spacing.lg },
  title: {
    ...typography.title,
    fontSize: 36,
    letterSpacing: 2,
    color: colors.primary,
  },
  tagline: {
    ...typography.caption,
    fontSize: 16,
    marginTop: spacing.sm,
  },
  actions: { gap: spacing.sm },
  mt: { marginTop: spacing.sm },
});
