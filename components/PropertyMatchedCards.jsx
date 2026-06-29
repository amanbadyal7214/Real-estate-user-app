import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { formatPrice } from '../app/utils/formatPrice';

const PropertyCard = ({ item, destination = 'property' }) => {
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
        onPress={() => {
          const entityId = item._id || item.id || item.propertyId || item.projectId

          if (!entityId) {
            return
          }

          if (destination === 'project') {
            router.push({ pathname: '/screens/ProjectDetails', params: { projectId: entityId } })
            return
          }

          router.push({ pathname: '/screens/PropertyDetails', params: { propertyId: entityId } })
        }}
        style={{ marginRight: wp('4.3%') }}
      >
        <View className="overflow-hidden bg-gray-200 shadow-lg" style={{ width: wp('59%'), height: hp('23%'), borderRadius: wp('4.3%') }}>
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
          <View className="flex-row absolute" style={{ gap: wp('1.1%'), top: hp('1.5%'), left: wp('3.2%'), right: wp('3.2%') }}>
            {images.length > 1 ? (
              images.map((_, idx) => (
                <View
                  key={idx}
                  className={`flex-1 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/30'}`}
                  style={{ height: hp('0.5%') }}
                />
              ))
            ) : (
              <>
                <View className="flex-1 rounded-full bg-white/50" style={{ height: hp('0.5%') }} />
                <View className="flex-1 rounded-full bg-white/30" style={{ height: hp('0.5%') }} />
                <View className="flex-1 rounded-full bg-white/30" style={{ height: hp('0.5%') }} />
              </>
            )}
          </View>

          {/* Top Section */}
          <View className="flex-row justify-between items-start" style={{ paddingTop: hp('2%'), paddingHorizontal: wp('3.2%') }}>
            <View className="bg-[#155DFC]" style={{ paddingHorizontal: wp('2.1%'), paddingVertical: hp('0.5%'), borderRadius: wp('1.1%') }}>
              <Text className="font-inter-bold text-white" style={{ fontSize: wp('2.1%') }}>RERA</Text>
            </View>
            <View className="items-end">
              <Text className="font-inter-bold text-white tracking-widest text-right" style={{ fontSize: wp('2.5%') }}>{item.title}</Text>
              <Text className="font-inter-regular text-white text-right uppercase" style={{ fontSize: wp('2.1%') }}>BY {item.developer || item.builder || ''}</Text>
            </View>
          </View>

          {/* Bottom Section */}
          <View className="absolute" style={{ bottom: hp('2%'), left: wp('3.2%'), right: wp('3.2%') }}>
            <Text className="font-inter-bold text-white" style={{ fontSize: wp('3.4%'), lineHeight: hp('2.5%') }}>
              {item.title}
            </Text>
            <Text className="font-inter-regular text-white/90" style={{ fontSize: wp('2.5%'), lineHeight: hp('1.8%') }}>
              {item.location}
            </Text>
            <Text className="font-inter-bold text-white" style={{ fontSize: wp('3.0%'), marginTop: hp('0.8%'), lineHeight: hp('2%') }}>
              {formatPrice(item.priceRange)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const PropertyMatchedCards = ({ data = [], destination = 'property' }) => {
  if (!data || !Array.isArray(data)) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
      {data.map((item, index) => (
        <PropertyCard key={item.id || index} item={item} destination={destination} />
      ))}
    </ScrollView>
  );
};

export default PropertyMatchedCards;

