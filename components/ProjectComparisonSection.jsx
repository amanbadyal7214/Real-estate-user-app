import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const PropertyCompareCard = ({ image, possession, name, locality, bhk, area, price }) => (
  <View 
    className="bg-white border border-[#E5E7EB] rounded-[14px] p-3 mr-3"
    style={{ width: 280 }}
  >
    <Image 
      source={{ uri: image }} 
      className="w-full h-[128px] rounded-[10px] mb-3"
    />
    <Text className="font-inter-regular text-[#6A7282] text-[12px] mb-1">Possession by {possession}</Text>
    <Text className="font-inter-medium text-[#0A0A0A] text-[14px] mb-1">{name}</Text>
    <Text className="font-inter-regular text-[#6A7282] text-[12px] mb-4">{locality}</Text>

    <View className="gap-2 mb-4">
      <View className="flex-row justify-between items-center">
        <Text className="font-inter-regular text-[#6A7282] text-[12px]">BHK Type</Text>
        <View className="flex-row items-center">
          <Text className="font-inter-regular text-[#0A0A0A] text-[12px] mr-1">{bhk}</Text>
          <Ionicons name="chevron-down" size={12} color="black" />
        </View>
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="font-inter-regular text-[#6A7282] text-[12px]">Super Builtup Area</Text>
        <View className="flex-row items-center">
          <Text className="font-inter-regular text-[#0A0A0A] text-[12px] mr-1">{area}</Text>
          <Ionicons name="chevron-down" size={12} color="black" />
        </View>
      </View>
    </View>

    <Text className="font-inter-regular text-[#0A0A0A] text-[18px] mb-3">₹ {price}</Text>

    <TouchableOpacity className="border-2 border-[#008E96] rounded-[10px] h-[40px] items-center justify-center">
      <Text className="text-[#008E96] font-inter-medium text-[14px]">Contact</Text>
    </TouchableOpacity>
  </View>
);

const ProjectComparisonSection = ({ properties }) => {
  return (
    <View className="w-full">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="font-inter-medium text-[#101828] text-[18px]">Compare with similar properties</Text>
        <TouchableOpacity className="border border-[#E5E7EB] rounded-full px-3 py-1 bg-white">
          <Text className="font-inter-medium text-[#0A0A0A] text-[14px]">Top ↑</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4 mb-4">
        {properties.map((prop, index) => (
          <PropertyCompareCard key={index} {...prop} />
        ))}
      </ScrollView>

      <TouchableOpacity className="mx-4 bg-[#008E96] rounded-[14px] h-[48px] items-center justify-center">
        <Text className="text-white font-inter-medium text-[16px]">Compare & contact sellers</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProjectComparisonSection;