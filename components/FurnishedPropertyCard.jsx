import { Image, Text, View } from 'react-native';

const FurnishedPropertyCard = ({ image, price, title, location, furnishedStatus, area }) => {
  return (
    <View className="w-[180px] h-[301px] bg-white rounded-[14px] mr-2 overflow-hidden border border-[#F3F4F6] shadow-sm">
      {/* Property Image */}
      <View className="w-[145px] h-[138px] mt-3 ml-3 rounded-[8px] overflow-hidden">
        <Image 
          source={{ uri: image }} 
          style={{ width: '100%', height: '100%' }} 
          resizeMode="cover"
        />
      </View>

      {/* Content Container */}
      <View className="mt-2 px-3 flex-1">
        <Text numberOfLines={1} className="font-inter-bold text-[#101828] text-[15px] leading-[22px]">{price}</Text>
        <Text numberOfLines={1} className="font-inter-regular text-[#364153] text-[12px] leading-[18px] mt-[2px]">{title}</Text>
        <Text numberOfLines={2} className="font-inter-regular text-[#6A7282] text-[12px] leading-[17px] mt-[4px] h-[28px]">{location}</Text>
        
        <View className="flex-row items-center mt-2 flex-wrap">
          <Text className="font-inter-bold text-[#101828] text-[11px] leading-[16px]">{furnishedStatus}</Text>
          <Text className="mx-1 text-[#99A1AF] text-[12px]">•</Text>
          <Text className="font-inter-bold text-[#101828] text-[11px] leading-[16px]">{area}</Text>
        </View>
      </View>
    </View>
  );
};

export default FurnishedPropertyCard;
