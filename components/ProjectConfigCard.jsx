import { Text, View, TouchableOpacity } from 'react-native';

const ProjectConfigCard = ({ title, areaRange, priceRange, onPress }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-white border border-[#E5E7EB] rounded-[14px] p-[12.6px] mr-3"
      style={{ width: 170, height: 166 }}
    >
      <View style={{ flex: 1 }}>
        <Text className="font-medium text-[#101828] text-[16px] leading-[24px] mb-2">{title}</Text>
        
        <View className="mb-4">
          <Text className="font-normal text-[#6A7282] text-[12px] leading-[16px]">Super Builtup Area</Text>
          <View className="flex-row items-center gap-1">
             <Text className="font-normal text-[#101828] text-[12px] leading-[16px]">{areaRange}</Text>
          </View>
        </View>

        <View className="border-t border-dashed border-[#E5E7EB] pt-2 mb-2">
          <Text className="font-normal text-[#101828] text-[16px] leading-[24px]">{priceRange}</Text>
        </View>

        {/* See Floor Plan button removed per request */}
      </View>
    </TouchableOpacity>
  );
};

export default ProjectConfigCard;