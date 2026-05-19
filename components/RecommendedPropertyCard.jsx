import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
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
      className="bg-white flex-row items-start p-3 mr-3"
      style={{
        width: 340,
        height: 145.33,
        borderRadius: 20,
        borderWidth: 0.67,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        gap: 12
      }}
    >
      {/* Image Container */}
      <View style={{ width: 140, height: 120, borderRadius: 16, overflow: 'hidden' }}>
        <Image 
          source={{ uri: image }} 
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>

      {/* Details Container */}
      <View className="flex-col pt-3 py-1" style={{ flex: 1, height: 120 }}>
        <Text className="font-inter-bold text-[#101828]" style={{ fontSize: 16, lineHeight: 24 }}>
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
        <Text className="font-inter-semibold text-[#101828] mt-1" style={{ fontSize: 14, lineHeight: 21 }} numberOfLines={1}>
          {title}
        </Text>
        <Text className="font-inter-regular text-[#6A7282] mt-1" style={{ fontSize: 12, lineHeight: 18 }}>
          {area}
        </Text>
        <Text className="font-inter-regular text-[#6A7282]" style={{ fontSize: 12, lineHeight: 18 }} numberOfLines={1}>
          {location}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RecommendedPropertyCard;
