import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

const ProjectConfigCard = ({ title, areaRange, priceRange, onSeeFloorPlan }) => {
  return (
    <View 
      className="bg-white border border-[#E5E7EB] rounded-[14px] p-[12.6px] mr-3"
      style={{ width: 170, height: 166 }}
    >
      <View className="flex-1">
        <Text className="font-inter-medium text-[#101828] text-[16px] leading-[24px] mb-2">{title}</Text>
        
        <View className="mb-4">
          <Text className="font-inter-regular text-[#6A7282] text-[12px] leading-[16px]">Super Builtup Area</Text>
          <View className="flex-row items-center gap-1">
             <Text className="font-inter-regular text-[#101828] text-[12px] leading-[16px]">{areaRange}</Text>
             <Ionicons name="chevron-down" size={12} color="#6A7282" />
          </View>
        </View>

        <View className="border-t border-dashed border-[#E5E7EB] pt-2 mb-2">
          <Text className="font-inter-regular text-[#101828] text-[16px] leading-[24px]">{priceRange}</Text>
        </View>

        <TouchableOpacity onPress={onSeeFloorPlan}>
          <Text className="font-inter-medium text-[#101828] text-[14px] leading-[20px] underline">
            See Floor Plan →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProjectConfigCard;