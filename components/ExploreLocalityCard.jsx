import React from 'react';
import { View, Text } from 'react-native';

const ExploreLocalityCard = ({ title, avgPrice, priceSqft, growth }) => {
  return (
    <View 
      style={{
        width: 185,
        height: 132,
        backgroundColor: '#FFFFFF',
        borderWidth: 0.67,
        borderColor: '#F3F4F6',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 1.5,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <View 
        style={{ 
          height: 40, 
          backgroundColor: '#EBF9F8', 
          justifyContent: 'center', 
          paddingHorizontal: 16 
        }}
      >
        <Text className="font-inter-bold text-[#101828] text-[16px]">
          {title}
        </Text>
      </View>
      
      {/* Content */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, flex: 1, justifyContent: 'space-between' }}>
        <View className="flex-row items-start justify-between">
          <Text className="font-inter-regular text-[#6A7282] text-[12px] leading-[18px]">
            Avg.{'\n'}Price:
          </Text>
          <Text className="font-inter-semibold text-[#101828] text-[13px] leading-[20px]">
            {priceSqft}
          </Text>
        </View>
        
        <Text className="font-inter-semibold text-[#00A63E] text-[13px]">
          {growth}
        </Text>
      </View>
    </View>
  );
};

export default ExploreLocalityCard;
