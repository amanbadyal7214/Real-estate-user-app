import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
        width: wp('59%'),
        height: hp('19%'),
        borderRadius: wp('4.3%'),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp('0.2%') },
        shadowOpacity: 0.09,
        shadowRadius: wp('1.1%'),
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
          className="w-full h-full justify-between"
          style={{ padding: wp('3.2%') }}
        >
          {/* Top Row: RERA Tag and Landmark Info */}
          <View className="flex-row justify-between items-start">
            <View
              style={{ paddingHorizontal: wp('2.1%'), paddingVertical: hp('0.5%'), borderRadius: wp('1.1%'), backgroundColor: badgeColor || '#155DFC' }}
            >
              <Text className="text-white font-inter-bold tracking-wider" style={{ fontSize: wp('2.1%') }}>{badgeType || 'RERA'}</Text>
            </View>
            <View className="items-end bg-black/20" style={{ paddingHorizontal: wp('2.1%'), paddingVertical: hp('0.5%'), borderRadius: wp('2.1%') }}>
              <Text className="text-white font-inter-bold uppercase tracking-wide" style={{ fontSize: wp('2.1%') }}>{tag}</Text>
              <Text className="text-white/90 font-inter-medium uppercase" style={{ fontSize: wp('1.7%') }}>BY {developer}</Text>
            </View>
          </View>

          {/* Bottom Row: Project Details */}
          <View>
            <Text className="text-white font-inter-bold" style={{ fontSize: wp('3.6%'), marginBottom: hp('0.2%'), lineHeight: hp('2.2%') }} numberOfLines={2}>{title}</Text>
            <View className="flex-row items-center" style={{ marginBottom: hp('0.8%') }}>
              <Ionicons name="location-sharp" size={wp('2.1%')} color="rgba(255,255,255,0.8)" />
              <Text className="text-white/80 font-inter-regular flex-1" style={{ fontSize: wp('2.5%'), marginLeft: wp('1.1%') }} numberOfLines={1} ellipsizeMode="tail">{location}</Text>
            </View>
            <Text className="text-white font-inter-bold tracking-tight" style={{ fontSize: wp('3.2%') }}>{price}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ProjectFocusCard;

