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
      className="bg-white flex-row items-start p-2 mr-3"
      style={{
        width: 272,
        height: 116,
        borderRadius: 16,
        borderWidth: 0.67,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 1,
        gap: 10
      }}
    >
      {/* Image Container */}
      <View style={{ width: 112, height: 96, borderRadius: 12, overflow: 'hidden' }}>
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
