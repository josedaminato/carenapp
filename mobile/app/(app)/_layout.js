import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { usePushNotifications } from '../../src/hooks/usePushNotifications';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../src/theme';

export default function AppLayout() {
  const { user, loading } = useAuth();
  usePushNotifications();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
