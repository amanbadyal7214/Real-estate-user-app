import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { formatPrice } from '../app/utils/formatPrice';

const RecommendedPropertyCard = ({ id, image, price, title, area, location }) => {
  return (
    <TouchableOpacity 
      onPress={() => {
        const propId = id
        if (propId) {
          router.push({ pathname: '/screens/PropertyDetails', params: { propertyId: propId } })
        } else {
          router.push('/screens/ProjectDetails')
        }
      }}
      activeOpacity={0.9}
      className="bg-white flex-row items-start"
      style={{
        padding: wp('2.1%'),
        marginRight: wp('3.2%'),
        width: wp('62%'),
        height: hp('12.2%'),
        borderRadius: wp('3.8%'),
        borderWidth: 0.67,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: hp('0.1%'),
        },
        shadowOpacity: 0.08,
        shadowRadius: wp('0.5%'),
        elevation: 1,
        gap: wp('2.7%')
      }}
    >
      {/* Image Container */}
      <View style={{ width: wp('25.5%'), height: hp('10%'), borderRadius: wp('3%'), overflow: 'hidden' }}>
        <Image 
          source={{ uri: image }} 
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>

      {/* Details Container */}
      <View className="flex-col" style={{ flex: 1, height: hp('12.2%'), paddingTop: hp('0.8%'), paddingVertical: hp('0.2%') }}>
        <Text className="font-inter-bold text-[#101828]" style={{ fontSize: wp('3.7%'), lineHeight: hp('2.5%') }}>
          {(() => {
            const raw = price;
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
        <Text className="font-inter-semibold text-[#101828]" style={{ fontSize: wp('3.2%'), lineHeight: hp('2.2%'), marginTop: hp('0.3%') }} numberOfLines={1}>
          {title}
        </Text>
        <Text className="font-inter-regular text-[#6A7282]" style={{ fontSize: wp('2.7%'), lineHeight: hp('1.8%'), marginTop: hp('0.3%') }}>
          {area}
        </Text>
        <Text className="font-inter-regular text-[#6A7282]" style={{ fontSize: wp('2.7%'), lineHeight: hp('1.8%') }} numberOfLines={1}>
          {location}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RecommendedPropertyCard;
