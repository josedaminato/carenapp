import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing } from '../theme';

export function Button({ title, onPress, variant = 'primary', loading, disabled, style }) {
  const isOutline = variant === 'outline';

  if (isOutline) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.outlineButton, disabled && styles.disabled, style]}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.outlineText}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[disabled && styles.disabled, style]}
    >
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

export function Input({ label, error, style, ...props }) {
  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <TextInputCompat {...props} />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

function TextInputCompat({ style, ...props }) {
  const { TextInput } = require('react-native');
  return (
    <TextInput
      placeholderTextColor={colors.textDim}
      style={[styles.input, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  outlineButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  outlineText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '600',
  },
  disabled: { opacity: 0.5 },
  inputContainer: { marginBottom: spacing.md },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  inputWrapper: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  inputError: { borderColor: colors.error },
  input: {
    color: colors.text,
    fontSize: 16,
    padding: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
