import { useEffect } from "react";
import { View, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  Easing,
  interpolate,
  withSequence,
  runOnJS
} from "react-native-reanimated";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);
  const logoY = useSharedValue(20);

  useEffect(() => {
    // Start animations
    scale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.back(1.5)),
    });
    opacity.value = withTiming(1, { duration: 1000 });
    logoY.value = withTiming(0, { duration: 1000 });

    // Navigate to onboarding after 2.5 seconds
    const timeout = setTimeout(() => {
      router.replace("/onboarding/Welcome1");
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: logoY.value }
    ],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: interpolate(opacity.value, [0, 1], [0.5, 1]),
  }));

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Animated.View style={[backgroundStyle, { position: 'absolute', width: '100%', height: '100%' }]}>
        <LinearGradient
          colors={['#008E96', '#004D52']}
          className="flex-1"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        {/* Decorative Ellipse */}
        <Image 
          source={require('../assets/images/Ellipse1.png')}
          style={{ 
            position: 'absolute', 
            width: width * 1.5, 
            height: width * 1.5, 
            top: -width * 0.5, 
            right: -width * 0.5,
            opacity: 0.3,
            transform: [{ rotate: '45deg' }]
          }}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View style={[animatedStyles, { alignItems: 'center' }]}>
        <View className="bg-white/20 p-6 rounded-[32px] border border-white/30 backdrop-blur-lg">
          <Image
            source={require("../assets/images/splash-icon.png")}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
            tintColor="white"
          />
        </View>
        <Animated.Text 
          className="text-white text-4xl font-bold mt-6 tracking-[2px]"
          style={animatedStyles}
        >
          REAL ESTATE
        </Animated.Text>
        <Animated.Text 
          className="text-white/70 text-sm mt-2 font-medium uppercase tracking-[4px]"
        >
          Premium Living
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

