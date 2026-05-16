import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

const ProjectContactFormCard = ({ sellerName, sellerPhone }) => {
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
      <Text className="font-inter-medium text-[#101828] text-[18px] leading-[27px]">
        Check availability & more information
      </Text>

      <View className="border border-[#E5E7EB] rounded-[14px] p-4 gap-4">
        <View>
          <Text className="font-inter-regular text-[#6A7282] text-[14px] mb-2">Contacting</Text>
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-[#008E96] rounded-full items-center justify-center mr-3">
              <Text className="text-white font-inter-regular text-[16px]">{sellerName.charAt(0)}</Text>
            </View>
            <View>
              <Text className="font-inter-regular text-[#0A0A0A] text-[14px]">{sellerName}</Text>
              <Text className="font-inter-regular text-[#6A7282] text-[12px]">Seller</Text>
              <Text className="font-inter-regular text-[#0A0A0A] text-[14px]">{sellerPhone}</Text>
            </View>
          </View>
        </View>

        <View>
          <Text className="font-inter-regular text-[#0A0A0A] text-[14px] mb-2">You are looking for</Text>
          <View className="flex-row gap-2">
            <TouchableOpacity className="border-2 border-[#008E96] rounded-[10px] px-4 py-2">
               <Text className="text-[#008E96] font-inter-medium text-[14px]">3 BHK</Text>
            </TouchableOpacity>
            <TouchableOpacity className="border-2 border-[#008E96] rounded-[10px] px-4 py-2">
               <Text className="text-[#008E96] font-inter-medium text-[14px]">5 BHK</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="gap-4">
          <TouchableOpacity className="flex-row items-center gap-3">
            <View className="w-5 h-5 bg-[#008E96] rounded-[4px] items-center justify-center">
              <Ionicons name="checkmark" size={14} color="white" />
            </View>
            <Text className="font-inter-medium text-[#0A0A0A] text-[14px]">Allow sellers to get in touch</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity className="flex-row items-center gap-3">
            <View className="w-5 h-5 border-2 border-[#E5E7EB] rounded-[4px]" />
            <Text className="font-inter-medium text-[#0A0A0A] text-[14px]">I am interested in Home loans</Text>
          </TouchableOpacity> */}
        </View>

        <View className="flex-row gap-2 bg-[#F9FAFB] p-2 rounded-lg">
          <Text className="text-[14px]">👍</Text>
          <Text className="flex-1 font-inter-bold text-[#6A7282] text-[14px]">
            Perfect Choice! Users like you also liked this
          </Text>
        </View>

        <TouchableOpacity className="bg-[#008E96] rounded-[14px] items-center justify-center h-[48px]">
          <Text className="text-white font-inter-medium text-[16px]">Check availability with seller</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProjectContactFormCard;