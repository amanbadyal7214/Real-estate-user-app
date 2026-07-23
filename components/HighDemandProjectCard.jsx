import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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
      className="bg-white overflow-hidden"
      style={{
        width: wp('62%'),
        height: hp('24%'),
        borderRadius: wp('3.8%'),
        marginBottom: hp('1%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp('0.4%') },
        shadowOpacity: 0.08,
        shadowRadius: wp('1.1%'),
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
          className="flex-row items-center justify-center"
          style={{ height: hp('12.5%'), paddingHorizontal: wp('3.2%') }}
        >
          <View
            className="rounded-lg overflow-hidden"
            style={{ width: wp('56%'), height: hp('10%') }}
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
                <Ionicons name="image-outline" size={wp('10.7%')} color="#9CA3AF" />
              </View>
            )}
          </View>
        </LinearGradient>

        {/* Content Container */}
        <View className="relative bg-white" style={{ height: hp('11.5%') }}>
          {/* Price Range */}
          <View style={{ position: 'absolute', left: wp('4.3%'), top: hp('1.2%'), width: wp('53.4%'), height: hp('2.2%') }}>
            <Text
                className="font-bold text-[#101828]"
                style={{ fontSize: wp('3.2%'), lineHeight: hp('2.2%') }}
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
            <View style={{ position: 'absolute', left: wp('4.3%'), top: hp('3.2%'), width: wp('53.4%'), height: hp('2.2%') }}>
              <Text
                className="font-semibold text-[#101828]"
                style={{ fontSize: wp('2.9%'), lineHeight: hp('2%') }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
            </View>

          {/* Developer */}
            <View style={{ position: 'absolute', left: wp('4.3%'), top: hp('5.4%'), width: wp('53.4%') }}>
              <Text
                className="font-normal text-[#4A5565]"
                style={{ fontSize: wp('2.3%'), lineHeight: hp('1.6%') }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                by <Text className="font-medium">{developer}</Text>
              </Text>
            </View>

          {/* Location (allow wrapping, up to 2 lines) */}
            <View style={{ position: 'absolute', left: wp('4.3%'), top: hp('7.4%'), width: wp('53.4%') }}>
              <Text
                className="font-normal text-[#4A5565]"
                style={{ fontSize: wp('2.3%'), lineHeight: hp('1.6%'), flexWrap: 'wrap' }}
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
