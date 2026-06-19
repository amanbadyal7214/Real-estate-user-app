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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Design Constants from CSS
const DESIGN_WIDTH = 393;
const scale = SCREEN_WIDTH / DESIGN_WIDTH;

export default function Index() {
  const ellipseTop = useSharedValue(358 * scale);
  const ellipseLeft = useSharedValue(((DESIGN_WIDTH - 144) / 2 - 0.5) * scale);
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

    // Move up from 358 to 316 and shift 0.5px right (total 1px shift from start)
    ellipseTop.value = withDelay(1500, withTiming(316 * scale, {
      duration: 1200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    }, (finished) => {
      if (finished) {
        runOnJS(onAnimationComplete)();
      }
    }));

    ellipseLeft.value = withDelay(1500, withTiming(((DESIGN_WIDTH - 144) / 2 + 0.5) * scale, {
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
        { scale: withTiming(ellipseTop.value <= 316 * scale ? 1.1 : 1, { duration: 500 }) }
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
        className="absolute justify-center items-center shadow-black/20 shadow-[0_10px_20px_rgba(0,0,0,0.2)] elevation-[8]"
        style={[{ width: 144 * scale, height: 136 * scale }, animatedEllipseStyle]}
      >
        <Image
          source={require('../assets/images/icon.png')}
          className="w-full h-full"
          resizeMode="contain"
        />
        {/* Inner shadow/border glow simulation */}
        <View className="absolute inset-0 rounded-full border border-white/20" />
      </Animated.View>
    </View>
  );
}
