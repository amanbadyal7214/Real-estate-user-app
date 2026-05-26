import { router } from 'expo-router';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { formatPrice } from '../app/utils/formatPrice';

const OwnerPropertyCardAlt = ({ id, image, price, title, area, location, onContact }) => {
  return (
    <View  className="mr-3">
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => id ? router.push({ pathname: '/screens/PropertyDetails', params: { propertyId: id } }) : router.push('/screens/PropertyDetails')}
      >
        <ImageBackground
          source={{ uri: image }}
          style={{ width: 200, height: 160, borderRadius: 14, overflow: 'hidden', justifyContent: 'flex-end' }}
          imageStyle={{ borderRadius: 14 }}
        >
          <View style={{ backgroundColor: 'rgba(0,0,0,0.36)', padding: 8 }}>
            <Text className="font-inter-bold text-white" style={{ fontSize: 14 }} numberOfLines={1}>
              {typeof price === 'number' ? formatPrice(price) : (price || 'View details')}
            </Text>
            <Text className="font-inter-medium text-white" style={{ fontSize: 12 }} numberOfLines={1}>{title}</Text>
          </View>
        </ImageBackground>

      </TouchableOpacity>

      <View className="mt-2 bg-white px-3 pt-2 rounded-[12px]" style={{ borderWidth: 0.67, borderColor: '#F3F4F6' }}>
        <Text className="font-inter-regular text-[#6A7282]" style={{ fontSize: 12 }}>{area}</Text>
        <Text className="font-inter-regular text-[#6A7282] mt-1" style={{ fontSize: 12 }} numberOfLines={1}>{location}</Text>

        <View className="flex-row items-center justify-between mt-3">
          <View style={{ backgroundColor: '#FFF7ED', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
            <Text className="font-inter-medium text-[#92400E]" style={{ fontSize: 12 }}>Owner</Text>
          </View>

          <TouchableOpacity
            onPress={() => onContact ? onContact(id) : router.push({ pathname: '/screens/ContactOwner', params: { propertyId: id } })}
            style={{ backgroundColor: '#008E96', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
          >
            <Text className="font-inter-medium text-white" style={{ fontSize: 12 }}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OwnerPropertyCardAlt;
