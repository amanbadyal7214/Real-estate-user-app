import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculate responsive icon dimensions (max 144 width)
const ICON_WIDTH = Math.min(144, SCREEN_WIDTH * 0.35);
const ICON_HEIGHT = ICON_WIDTH; // 1:1 aspect ratio for perfect circle

// Calculate relative positions
const INITIAL_TOP = SCREEN_HEIGHT * 0.42; // roughly equivalent to 358 out of 852
const TARGET_TOP = SCREEN_HEIGHT * 0.37; // roughly equivalent to 316 out of 852
const CENTERED_LEFT = (SCREEN_WIDTH - ICON_WIDTH) / 2;

export default function Index() {
  const ellipseTop = useSharedValue(INITIAL_TOP);
  const ellipseLeft = useSharedValue(CENTERED_LEFT - 0.5);
  const ellipseOpacity = useSharedValue(0);
  const bgOpacity = useSharedValue(0); // For transition from solid to gradient
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    // 1. Initial State: Solid background #1BAFA6

    // 2. Transition to Splash 1.1 / Gradient
    bgOpacity.value = withDelay(500, withTiming(1, { duration: 1000 }));

    // 3. Ellipse Animation (Icon Transition)
    // Fade in
    ellipseOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));

    // Move up and shift slightly
    ellipseTop.value = withDelay(1500, withTiming(TARGET_TOP, {
      duration: 1200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    }, (finished) => {
      if (finished) {
        runOnJS(onAnimationComplete)();
      }
    }));

    ellipseLeft.value = withDelay(1500, withTiming(CENTERED_LEFT + 0.5, {
      duration: 1200
    }));

    // Glow overlay fade in (Rectangle 1 Simulation)
    overlayOpacity.value = withDelay(1000, withTiming(0.6, { duration: 1000 }));
  }, [bgOpacity, ellipseLeft, ellipseOpacity, ellipseTop, overlayOpacity]);

  const onAnimationComplete = () => {
    setTimeout(() => {
      router.replace('/screens/Buy/Buy');
    }, 1000);
  };

  const animatedEllipseStyle = useAnimatedStyle(() => {
    return {
      top: ellipseTop.value,
      left: ellipseLeft.value,
      opacity: ellipseOpacity.value,
      transform: [
        { scale: withTiming(ellipseTop.value <= TARGET_TOP ? 1.1 : 1, { duration: 500 }) }
      ]
    };
  });

  const animatedBgStyle = useAnimatedStyle(() => {
    return {
      opacity: bgOpacity.value,
    };
  });

  const animatedOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
    };
  });

  return (
    <View className="flex-1 bg-light">
      {/* Splash 1.0 Background (Solid) */}
      <View className="absolute inset-0 bg-light" />

      {/* Splash 1.1 / Onboarding Background (Gradient) */}
      <Animated.View className="absolute inset-0" style={animatedBgStyle}>
        <LinearGradient
          colors={['#008E96', '#1B3DA8', '#2B7571']}
          locations={[-0.08, 0.14, 0.71]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Rectangle 1 - Glow Blur Simulation */}
      <Animated.View className="absolute inset-0 bg-white/35" style={animatedOverlayStyle} />

      {/* Ellipse (Icon) */}
      <Animated.View
        className="absolute justify-center items-center shadow-black/20 shadow-[0_10px_20px_rgba(0,0,0,0.2)] elevation-[8] rounded-xl overflow-hidden"
        style={[{ width: ICON_WIDTH, height: ICON_HEIGHT }, animatedEllipseStyle]}
      >
        <Image
          source={require('../assets/images/icon3.png')}
          className="w-full h-full rounded-xl"
          resizeMode="cover"
        />
        {/* Inner shadow/border glow simulation */}
        <View className="absolute inset-0 rounded-full border border-white/20" />
      </Animated.View>
    </View>
  );
}
