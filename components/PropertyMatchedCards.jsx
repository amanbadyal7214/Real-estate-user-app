import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const PropertyCard = ({ item }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle both single 'image' and 'images' array
  const images = item.images || (item.image ? [item.image] : []);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <Animated.View entering={FadeInDown.duration(600).springify()}>
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => router.push('/screens/ProjectDetails')}
        className="mr-5"
      >
        <View className="w-[310px] h-[280px] rounded-[24px] overflow-hidden bg-gray-200 shadow-lg">
          <Image
            source={images[currentImageIndex]}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={1000}
            cachePolicy="memory-disk"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
            locations={[0, 0.5, 1]}
            className="absolute inset-0"
          />

          {/* Progress Bars / Pagination */}
          <View className="flex-row gap-1 absolute top-3 left-3 right-3">
            {images.length > 1 ? (
              images.map((_, idx) => (
                <View
                  key={idx}
                  className={`flex-1 h-1 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/30'}`}
                />
              ))
            ) : (
              <>
                <View className="flex-1 h-1 rounded-full bg-white/50" />
                <View className="flex-1 h-1 rounded-full bg-white/30" />
                <View className="flex-1 h-1 rounded-full bg-white/30" />
              </>
            )}
          </View>

          {/* Top Section */}
          <View className="flex-row justify-between items-start pt-5 px-4">
            <View className="bg-[#155DFC] px-2 py-1 rounded-[4px]">
              <Text className="font-inter-bold text-[10px] text-white">RERA</Text>
            </View>
            <View className="items-end">
              <Text className="font-inter-bold text-[12px] text-white tracking-widest text-right">TALLEST LANDMARK</Text>
              <Text className="font-inter-regular text-[10px] text-white text-right uppercase">BY {item.developer || item.builder || ''}</Text>
            </View>
          </View>

          {/* Bottom Section */}
          <View className="absolute bottom-5 left-4 right-4">
            <Text className="font-inter-bold text-[17px] text-white leading-[26px]">
              {item.title}
            </Text>
            <Text className="font-inter-regular text-[12px] text-white/90 leading-[18px]">
              {item.location}
            </Text>
            <Text className="font-inter-bold text-[15px] text-white mt-2 leading-[22px]">
              ₹{item.priceRange}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const PropertyMatchedCards = ({ data }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
      {data.map((item, index) => (
        <PropertyCard key={index} item={item} />
      ))}
    </ScrollView>
  );
};

export default PropertyMatchedCards;

