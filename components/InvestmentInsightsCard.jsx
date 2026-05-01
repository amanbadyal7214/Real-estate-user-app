import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

const InvestmentInsightsCard = ({ appreciation, appreciationYear, currentValue, projectedValue, roi, potentialGain }) => {
  return (
    <View 
      className="bg-white rounded-[16px] p-4 w-full"
      style={{ 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2 
      }}
    >
      <Text className="font-inter-medium text-[#101828] text-[18px] leading-[27px] mb-4">Investment insights</Text>

      {/* Appreciation Badge */}
      <View className="bg-[#E8F5E9] rounded-[10px] p-2 flex-row items-center mb-4 self-stretch">
        <Ionicons name="trending-up" size={16} color="#2E7D32" style={{ marginRight: 8 }} />
        <View className="flex-1 flex-row flex-wrap items-center">
          <Text className="font-inter-regular text-[#2E7D32] text-[16px] mr-2">{appreciation}</Text>
          <Text className="font-inter-regular text-[#6A7282] text-[14px]">Price appreciation since {appreciationYear}</Text>
        </View>
      </View>

      {/* Stats Table */}
      <View className="border border-[#E5E7EB] rounded-[14px] p-4">
        <View className="flex-row items-center mb-4">
          <Text className="text-[18px] text-[#0A0A0A] mr-2">₹</Text>
          <Text className="font-inter-regular text-[#0A0A0A] text-[14px]">If you invest today in </Text>
          <Text className="font-inter-medium text-[#101828] text-[16px] underline">3 BHK</Text>
          <Ionicons name="chevron-down" size={14} color="#101828" className="ml-1" />
        </View>

        <View className="flex-row justify-between mb-4">
          <View>
            <Text className="font-inter-regular text-[#6A7282] text-[12px] mb-1">Current Value</Text>
            <Text className="font-inter-regular text-[#101828] text-[18px]">{currentValue}</Text>
          </View>
          <View>
            <Text className="font-inter-regular text-[#6A7282] text-[12px] mb-1">Projected Value (1 Yr)</Text>
            <Text className="font-inter-regular text-[#101828] text-[18px]">{projectedValue}</Text>
          </View>
        </View>

        <View className="flex-row items-center mb-4">
          <Text className="text-[14px] mr-2">📅</Text>
          <Text className="font-inter-regular text-[#6A7282] text-[14px]">Within 1 year</Text>
        </View>

        <View className="flex-row justify-between">
          <View>
            <Text className="font-inter-regular text-[#6A7282] text-[12px] mb-1">Potential ROI</Text>
            <View className="flex-row items-center">
              <Ionicons name="trending-up" size={16} color="#2E7D32" className="mr-1" />
              <Text className="font-inter-regular text-[#2E7D32] text-[18px]">{roi}</Text>
              <Text className="font-inter-regular text-[#2E7D32] text-[12px] ml-1">(YOY)</Text>
            </View>
          </View>
          <View>
            <Text className="font-inter-regular text-[#6A7282] text-[12px] mb-1">Potential Gain</Text>
            <Text className="font-inter-regular text-[#101828] text-[18px]">{potentialGain}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default InvestmentInsightsCard;