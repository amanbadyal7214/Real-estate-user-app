import { Ionicons } from '@expo/vector-icons';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const ProjectMapCard = () => {
  return (
    <View 
      className="bg-white rounded-[16px] p-4 gap-3 w-full"
      style={{ 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2 
      }}
    >
      <Text className="font-inter-medium text-[#101828] text-[18px] leading-[27px]">Explore on map</Text>
      
      {/* Search Input */}
      <View className="bg-[#F3F4F6] rounded-[10px] flex-row items-center px-4 h-[44px]">
        <Ionicons name="search" size={18} color="#6A7282" className="mr-3" />
        <TextInput 
          placeholder="Check distance from office/landmark" 
          placeholderTextColor="rgba(10, 10, 10, 0.5)"
          className="flex-1 font-inter-regular text-[14px]"
        />
      </View>

      {/* Map Placeholder */}
      <View className="bg-[#F3F4F6] rounded-[14px] h-[176px] items-center justify-center overflow-hidden">
        {/* Simulation of Map/Background */}
        <View className="absolute inset-0 bg-[#4B5BF6] opacity-10" />
        
        {/* Pin */}
        <View className="w-10 h-10 bg-[#4B5BF6] rounded-full items-center justify-center">
            <View className="w-3 h-3 bg-white rounded-full" />
        </View>

        {/* Request Overlay */}
        <TouchableOpacity className="absolute bottom-4 bg-black rounded-full px-4 py-2 flex-row items-center">
          <Text className="text-white font-inter-regular text-[14px]">Request seller for exact location →</Text>
        </TouchableOpacity>

        {/* Fullscreen Button */}
        <TouchableOpacity className="absolute right-2 top-2 bg-black/60 w-8 h-8 rounded-full items-center justify-center">
           <Ionicons name="expand" size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* Category Buttons */}
      <View className="gap-3">
        <View className="flex-row gap-2">
          <TouchableOpacity className="flex-1 border border-[#E5E7EB] rounded-[10px] flex-row items-center p-3">
            <Text className="text-[20px] mr-2">🏥</Text>
            <Text className="flex-1 font-inter-medium text-[#101828] text-[14px]">Healthcare</Text>
            <Text className="text-[16px]">→</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 border border-[#E5E7EB] rounded-[10px] flex-row items-center p-3">
            <Text className="text-[20px] mr-2">🚗</Text>
            <Text className="flex-1 font-inter-medium text-[#101828] text-[14px]">Commute</Text>
            <Text className="text-[16px]">→</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="border border-[#E5E7EB] rounded-[10px] flex-row items-center p-3">
          <Text className="text-[20px] mr-2">☕</Text>
          <Text className="flex-1 font-inter-medium text-[#101828] text-[14px]">Food and Drinks</Text>
          <Text className="text-[16px]">→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProjectMapCard;