import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

const ProjectFocusCard = ({ image, images: propImages, title, location, price, tag, developer, badgeType, badgeColor, projectId }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = propImages || (image ? [image] : []);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <Animated.View
      entering={FadeInRight.duration(600).delay(200)}
      className="overflow-hidden bg-white shadow-sm"
      style={{
        width: 300,
        height: 220,
        borderRadius: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => router.push({ pathname: '/screens/ProjectDetails', params: { projectId } })}
        style={StyleSheet.absoluteFill}
      >
        <Image
          source={images[currentImageIndex]}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={1000}
          cachePolicy="memory-disk"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']}
          locations={[0, 0.4, 1]}
          className="w-full h-full p-4 justify-between"
        >
          {/* Top Row: RERA Tag and Landmark Info */}
          <View className="flex-row justify-between items-start">
            <View
              className="px-2 py-1 rounded"
              style={{ backgroundColor: badgeColor || '#155DFC' }}
            >
              <Text className="text-white font-inter-bold text-[10px] tracking-wider">{badgeType || 'RERA'}</Text>
            </View>
            <View className="items-end bg-black/20 px-2 py-1 rounded-lg">
              <Text className="text-white font-inter-bold text-[10px] uppercase tracking-wide">{tag}</Text>
              <Text className="text-white/90 font-inter-medium text-[8px] uppercase">BY {developer}</Text>
            </View>
          </View>

          {/* Bottom Row: Project Details */}
          <View>
            <Text className="text-white font-inter-bold text-[18px] mb-0.5 leading-6" numberOfLines={1}>{title}</Text>
            <View className="flex-row items-center mb-2">
              <Ionicons name="location-sharp" size={10} color="rgba(255,255,255,0.8)" />
              <Text className="text-white/80 font-inter-regular text-[12px] ml-1" numberOfLines={1}>{location}</Text>
            </View>
            <Text className="text-white font-inter-bold text-[16px] tracking-tight">{price}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};


export default ProjectFocusCard;

