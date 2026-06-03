import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

export function LightOrb({ active, size = 140 }) {
  const pulse = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (active) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulse, {
              toValue: 1,
              duration: 1200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pulse, {
              toValue: 0,
              duration: 1200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(glow, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(glow, {
              toValue: 0.4,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      pulse.setValue(0);
      glow.setValue(0.2);
    }
  }, [active, pulse, glow]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const opacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.9],
  });

  return (
    <View style={[styles.container, { width: size * 1.6, height: size * 1.6 }]}>
      <Animated.View
        style={[
          styles.glowRing,
          {
            width: size * 1.4,
            height: size * 1.4,
            borderRadius: size * 0.7,
            opacity,
            transform: [{ scale }],
          },
        ]}
      />
      <Animated.View style={{ transform: [{ scale }] }}>
        <LinearGradient
          colors={
            active
              ? [colors.primary, colors.secondary, colors.accent]
              : [colors.surfaceLight, colors.surface]
          }
          style={[
            styles.orb,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      </Animated.View>
      {active && (
        <View style={[styles.sparkle, { top: size * 0.1, right: size * 0.15 }]}>
          <Animated.Text style={{ opacity, fontSize: 20 }}>✨</Animated.Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    backgroundColor: colors.glow,
  },
  orb: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  sparkle: {
    position: 'absolute',
  },
});
