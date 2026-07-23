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
      style={{
        width: wp('59%'),
        height: hp('19%'),
        borderRadius: wp('4.3%'),
        overflow: 'hidden',
        backgroundColor: '#ffffff',
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
          style={{ 
            width: '100%', 
            height: '100%', 
            justifyContent: 'space-between',
            padding: wp('3.2%') 
          }}
        >
          {/* Top Row: RERA Tag and Landmark Info */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View
              style={{ paddingHorizontal: wp('2.1%'), paddingVertical: hp('0.5%'), borderRadius: wp('1.1%'), backgroundColor: badgeColor || '#155DFC' }}
            >
              <Text style={{ color: '#ffffff', fontWeight: '700', letterSpacing: 1, fontSize: wp('2.1%') }}>
                {badgeType ? String(badgeType) : 'RERA'}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: wp('2.1%'), paddingVertical: hp('0.5%'), borderRadius: wp('2.1%') }}>
              <Text style={{ color: '#ffffff', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: wp('2.1%') }}>
                {tag ? String(tag) : ''}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '500', textTransform: 'uppercase', fontSize: wp('1.7%') }}>
                BY {developer ? String(developer) : ''}
              </Text>
            </View>
          </View>

          {/* Bottom Row: Project Details */}
          <View>
            <Text 
              style={{ color: '#ffffff', fontWeight: '700', fontSize: wp('3.6%'), marginBottom: hp('0.2%'), lineHeight: hp('2.2%') }} 
              numberOfLines={2}
            >
              {title ? String(title) : ''}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp('0.8%') }}>
              <Ionicons name="location-sharp" size={wp('2.1%')} color="rgba(255,255,255,0.8)" />
              <Text 
                style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '400', flex: 1, fontSize: wp('2.5%'), marginLeft: wp('1.1%') }} 
                numberOfLines={1} 
                ellipsizeMode="tail"
              >
                {location ? String(location) : ''}
              </Text>
            </View>
            <Text style={{ color: '#ffffff', fontWeight: '700', letterSpacing: -0.5, fontSize: wp('3.2%') }}>
              {price ? String(price) : ''}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ProjectFocusCard;
