import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const PropertyListingCard = ({ data }) => {
  return (
    <View className="bg-white rounded-[16px] overflow-hidden shadow-sm mb-[23px] border border-[#E4E7EC]">
      {/* Image Section */}
      <View className="flex-row h-[180px]">
        <View className="flex-1 relative">
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000' }} 
            className="w-full h-full"
          />
          <View className="absolute top-[8px] left-[8px] bg-black/50 px-[8px] py-[4px] rounded-[6px]">
            <Text className="text-white font-inter-semibold text-[11px] tracking-[0.5px]">SEEN</Text>
          </View>
          <View className="absolute bottom-[8px] left-[8px] bg-black/60 px-[8px] py-[4px] rounded-[6px]">
            <Text className="text-white font-inter-semibold text-[12px]">1/11</Text>
          </View>
        </View>
        <View className="w-[4px]" />
        <View className="flex-1 relative">
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1000' }} 
            className="w-full h-full"
          />
          <TouchableOpacity className="absolute top-[8px] right-[8px] w-[36px] h-[36px] bg-black/50 rounded-full items-center justify-center">
            <Ionicons name="heart-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Section */}
      <View className="p-[12px]">
        <Text className="text-[#101828] font-inter-bold text-[18px]">₹42,980 /month</Text>
        <Text className="text-[#101828] font-inter-medium text-[16px] mt-[4px]">Ready to use Office Space</Text>
        <Text className="text-[#6A7282] font-inter-regular text-[13px] mt-[4px]">Gmada Aerocity, Mohali</Text>
        <Text className="text-[#6A7282] font-inter-regular text-[13px] mt-[4px]">Available From: 05/09/2025</Text>
        
        <View className="h-[1px] bg-[#E4E7EC] my-[12px]" />

        {/* Footer / Agent Info */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="relative">
              <LinearGradient
                colors={['#008E96', '#1CB2A9']}
                className="w-[40px] h-[40px] rounded-full items-center justify-center"
              >
                <Ionicons name="person" size={20} color="white" />
              </LinearGradient>
              <View className="absolute bottom-0 right-0 w-[16px] h-[16px] bg-[#F59E0B] border-2 border-white rounded-full items-center justify-center">
                <Text className="text-[10px] text-black">✓</Text>
              </View>
            </View>
            <View className="ml-[8px]">
              <Text className="text-[#101828] font-inter-medium text-[13px]">Regus</Text>
              <Text className="text-[#6A7282] font-inter-regular text-[11px]">Housing Partner</Text>
            </View>
          </View>
          
          <View className="items-end">
            <Text className="text-[#9CA3AF] font-inter-regular text-[11px]">UPDATED</Text>
            <Text className="text-[#6A7282] font-inter-regular text-[12px]">8w ago</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PropertyListingCard;
