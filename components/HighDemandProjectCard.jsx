import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';

const HighDemandProjectCard = ({ image, priceRange, title, developer, location }) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(600).springify().damping(12)}
      className="bg-white rounded-[20px] mb-2 overflow-hidden"
      style={{
        width: 338,
        height: 284.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      {/* Container (Linear Gradient Background) */}
      <LinearGradient
        colors={['#FFFBEB', '#FFF7ED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-row items-center justify-center px-4"
        style={{ height: 160 }}
      >
        <View
          className="rounded-xl overflow-hidden"
          style={{ width: 306, height: 128 }}
        >
          {image ? (
            <Image
              source={image}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={800}
              cachePolicy="memory-disk"
            />
          ) : (
            <View className="w-full h-full bg-gray-200 items-center justify-center">
              <Ionicons name="image-outline" size={40} color="#9CA3AF" />
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Content Container */}
      <View className="relative bg-white" style={{ height: 124.5 }}>
        {/* Price Range */}
        <View style={{ position: 'absolute', left: 16, top: 16, width: 306, height: 24 }}>
          <Text
            className="font-inter-bold text-[#101828]"
            style={{ fontSize: 16, lineHeight: 24 }}
          >
            {priceRange}
          </Text>
        </View>

        {/* Title */}
        <View style={{ position: 'absolute', left: 16, top: 44, width: 306, height: 22.5 }}>
          <Text
            className="font-inter-semibold text-[#101828]"
            style={{ fontSize: 15, lineHeight: 22.5 }}
          >
            {title}
          </Text>
        </View>

        {/* Developer */}
        <View style={{ position: 'absolute', left: 16, top: 70.5, width: 306, height: 18 }}>
          <Text
            className="font-inter-regular text-[#4A5565]"
            style={{ fontSize: 12, lineHeight: 18 }}
          >
            by <Text className="font-inter-medium">{developer}</Text>
          </Text>
        </View>

        {/* Location */}
        <View style={{ position: 'absolute', left: 16, top: 90.5, width: 306, height: 18 }}>
          <Text
            className="font-inter-regular text-[#4A5565]"
            style={{ fontSize: 12, lineHeight: 18 }}
          >
            {location}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default HighDemandProjectCard;
