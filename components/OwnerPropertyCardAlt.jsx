import { router } from 'expo-router';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { formatPrice } from '../app/utils/formatPrice';

const OwnerPropertyCardAlt = ({ id, image, price, title, area, location, onContact }) => {
  return (
    <View  className="">
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => id ? router.push({ pathname: '/screens/PropertyDetails', params: { propertyId: id } }) : router.push('/screens/PropertyDetails')}
      >
        <ImageBackground
          source={{ uri: image }}
          style={{ width: wp('49.8%'), height: hp('16.7%'), borderRadius: wp('3.2%'), overflow: 'hidden', justifyContent: 'flex-end' }}
          imageStyle={{ borderRadius: wp('3.2%') }}
        >
          <View style={{ backgroundColor: 'rgba(0,0,0,0.36)', padding: 7 }}>
            <Text className="font-bold text-white" style={{ fontSize: 12 }} numberOfLines={1}>
              {typeof price === 'number' ? formatPrice(price) : (price || 'View details')}
            </Text>
            <Text className="font-medium text-white" style={{ fontSize: 10 }} numberOfLines={1}>{title}</Text>
          </View>
        </ImageBackground>

      </TouchableOpacity>

      <View className="mt-1.5 bg-white px-2.5 py-1.5 rounded-[10px]" style={{ width: wp('49.9%'), borderWidth: 0.67, borderColor: '#F3F4F6' }}>
        <Text className="font-normal text-[#6A7282]" style={{ fontSize: 10 }}>{area}</Text>
        <Text className="font-normal text-[#6A7282] mt-1" style={{ fontSize: 10 }} numberOfLines={1}>{location}</Text>

        <View className="flex-row items-center justify-between mt-2">
          <View style={{ backgroundColor: '#FFF7ED', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 7 }}>
            <Text className="font-medium text-[#92400E]" style={{ fontSize: 10 }}>Owner</Text>
          </View>

          <TouchableOpacity
            onPress={() => onContact ? onContact(id) : router.push({ pathname: '/screens/ContactOwner', params: { propertyId: id } })}
            style={{ backgroundColor: '#008E96', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 7 }}
          >
            <Text className="font-medium text-white" style={{ fontSize: 10 }}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OwnerPropertyCardAlt;
