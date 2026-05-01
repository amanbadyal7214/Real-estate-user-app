import { Text, TouchableOpacity, View } from 'react-native';

const ProjectSellerCard = ({ sellerName, postedBy, onSeeProfile, onViewPhone }) => {
  return (
    <View 
      className="bg-white rounded-[16px] p-4 flex-row justify-between items-center w-full"
      style={{ 
        minHeight: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2 
      }}
    >
      <View className="flex-row items-center flex-1 pr-2">
        <View className="w-[46px] h-[48px] bg-[#008E96] rounded-full items-center justify-center mr-3">
          <Text className="text-white font-inter-regular text-[16px]">{sellerName.charAt(0)}</Text>
        </View>
        <View className="flex-1">
          <Text className="font-inter-regular text-[#101828] text-[14px] leading-[20px]" numberOfLines={2}>
            Posted by {postedBy}
          </Text>
          <TouchableOpacity onPress={onSeeProfile} className="mt-1">
            <Text className="font-inter-medium text-[#101828] text-[14px] leading-[20px] underline">
              See Seller Profile →
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        onPress={onViewPhone}
        className="border-2 border-[#008E96] rounded-[10px] items-center justify-center"
        style={{ width: 134, height: 48 }}
      >
        <Text className="text-[#008E96] font-inter-medium text-[16px]">View phone</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProjectSellerCard;