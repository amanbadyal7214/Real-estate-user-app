import { Image, Text, TouchableOpacity, View } from 'react-native';

const TrendingProjectCard = ({ name, location, price, image }) => {
  return (
    <TouchableOpacity 
      className="bg-[#F7F9FA] border border-[#E4E7EC] shadow-sm rounded-2xl mr-4 w-[170px] overflow-hidden"
      activeOpacity={0.7}
    >
      <Image source={image} className="w-full h-24 bg-gray-200" resizeMode="cover" />
      <View className="p-3">
        <Text className="text-[#101828] font-inter-medium text-sm mb-0.5" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-[#6A7282] text-[12px] font-inter-regular mb-1.5" numberOfLines={1}>
          {location}
        </Text>
        <Text className="text-[#008E96] font-inter-medium text-[13px]">
          {price}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TrendingProjectCard;
