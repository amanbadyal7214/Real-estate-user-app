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
        padding: wp('1.8%'),
        marginRight: wp('2.7%'),
        width: wp('52.7%'),
        height: hp('10.4%'),
        borderRadius: wp('3.2%'),
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
        gap: wp('2.3%')
      }}
    >
      {/* Image Container */}
      <View style={{ width: wp('21.7%'), height: hp('8.5%'), borderRadius: wp('2.5%'), overflow: 'hidden' }}>
        <Image 
          source={{ uri: image }} 
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>

      {/* Details Container */}
      <View className="flex-col" style={{ flex: 1, height: hp('10.4%'), paddingTop: hp('0.7%'), paddingVertical: hp('0.2%') }}>
        <Text className="font-bold text-[#101828]" style={{ fontSize: wp('3.2%'), lineHeight: hp('2.1%') }}>
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
        <Text className="font-semibold text-[#101828]" style={{ fontSize: wp('2.7%'), lineHeight: hp('1.9%'), marginTop: hp('0.3%') }} numberOfLines={1}>
          {title}
        </Text>
        <Text className="font-normal text-[#6A7282]" style={{ fontSize: wp('2.3%'), lineHeight: hp('1.5%'), marginTop: hp('0.3%') }}>
          {area}
        </Text>
        <Text className="font-normal text-[#6A7282]" style={{ fontSize: wp('2.3%'), lineHeight: hp('1.5%') }} numberOfLines={1}>
          {location}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RecommendedPropertyCard;
