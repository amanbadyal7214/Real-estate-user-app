import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

const PropertyCardSmall = ({
  id,
  image,
  price,
  title,
  area,
  location,
  containerStyle,
  imageStyle,
}) => {
  const router = useRouter();

  const navigateToDetails = () => {
    if (id) {
        router.push({
            pathname: '/screens/PropertyDetails',
            params: { propertyId: id }
        });
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={navigateToDetails}
      className="overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white"
      style={{
        width: '100%',
        borderWidth: 0.6667,
        minHeight: 257,
        ...containerStyle,
      }}
    >
      <Image
        source={{ uri: image }}
        className="w-full"
        style={[{ height: 140 }, imageStyle]}
        resizeMode="cover"
      />

      <View className="px-3 pb-3 pt-[10px]">
        <Text className="font-inter-semibold text-[16px] leading-6 text-[#101828]">
          {price}
        </Text>
        <Text className="mt-1 font-inter-medium text-[15px] leading-[19px] text-[#101828]" numberOfLines={1}>
          {title}
        </Text>
        <Text className="mt-1 font-inter-medium text-[13px] leading-5 text-[#6A7282]">
          {area}
        </Text>
        <Text className="font-inter-medium text-[13px] leading-5 text-[#6A7282]" numberOfLines={1}>
          {location}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PropertyCardSmall;
