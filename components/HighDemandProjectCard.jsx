import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { formatPrice } from '../app/utils/formatPrice';

const HighDemandProjectCard = ({ image, priceRange, title, developer, location, projectId, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({ pathname: '/screens/ProjectDetails', params: { projectId } });
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(600).springify().damping(12)}
      className="bg-white rounded-[16px] mb-2 overflow-hidden"
      style={{
        width: 270,
        height: 227,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={handlePress}
        style={{ flex: 1 }}
      >
        {/* Container (Linear Gradient Background) */}
        <LinearGradient
          colors={['#FFFBEB', '#FFF7ED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-row items-center justify-center px-3"
          style={{ height: 128 }}
        >
          <View
            className="rounded-lg overflow-hidden"
            style={{ width: 244, height: 102 }}
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
          <View style={{ position: 'absolute', left: 16, top: 16, width: 236, height: 22 }}>
            <Text
                className="font-inter-bold text-[#101828]"
                style={{ fontSize: 14, lineHeight: 20 }}
              >
                {(() => {
                  const raw = priceRange;
                  if (raw === null || raw === undefined || raw === '') return 'View details';
                  if (typeof raw === 'number') return formatPrice(raw);
                  if (typeof raw === 'string') {
                    if (raw.trim().startsWith('₹')) return raw;
                    if (raw.includes('-')) {
                      const parts = raw.split('-').map(p => p.trim());
                      const formatted = parts.map(p => {
                        const digits = p.replace(/[^0-9.]/g, '');
                        const num = Number(digits);
                        return Number.isFinite(num) && num > 0 ? formatPrice(num) : p;
                      });
                      return formatted.join(' - ');
                    }
                    const digits = raw.replace(/[^0-9.]/g, '');
                    const num = Number(digits);
                    return Number.isFinite(num) && num > 0 ? formatPrice(num) : raw;
                  }
                  return String(raw);
                })()}
              </Text>
          </View>

          {/* Title */}
            <View style={{ position: 'absolute', left: 16, top: 34, width: 236, height: 22.5 }}>
              <Text
                className="font-inter-semibold text-[#101828]"
                style={{ fontSize: 13, lineHeight: 20 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
            </View>

          {/* Developer */}
            <View style={{ position: 'absolute', left: 16, top: 56, width: 236 }}>
              <Text
                className="font-inter-regular text-[#4A5565]"
                style={{ fontSize: 11, lineHeight: 16 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                by <Text className="font-inter-medium">{developer}</Text>
              </Text>
            </View>

          {/* Location (allow wrapping, up to 2 lines) */}
            <View style={{ position: 'absolute', left: 16, top: 76, width: 236 }}>
              <Text
                className="font-inter-regular text-[#4A5565]"
                style={{ fontSize: 11, lineHeight: 16, flexWrap: 'wrap' }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {location}
              </Text>
            </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default HighDemandProjectCard;
