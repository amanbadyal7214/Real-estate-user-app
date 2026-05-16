import React from 'react';
import { View, Text } from 'react-native';

const ExploreLocalityCard = ({
  title,
  avgLabel,
  avgPrice,
  priceSqft,
  growth,
  averagePrice,
  priceRange,
  totalProperties,
}) => {
  const displayPrice = averagePrice || priceSqft || avgPrice || 'N/A';
  const secondaryText = priceRange || growth || (typeof totalProperties === 'number'
    ? `${totalProperties} ${totalProperties === 1 ? 'Property' : 'Properties'}`
    : '');
  const secondaryTextColor = priceRange ? '#4A5565' : '#00A63E';

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

      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, flex: 1, justifyContent: 'space-between' }}>
        <View className="flex-row items-start justify-between">
          <Text className="font-inter-regular text-[#6A7282] text-[12px] leading-[18px]">
            {avgLabel || "Avg.\nPrice:"}
          </Text>
          <Text className="font-inter-semibold text-[#101828] text-[13px] leading-[20px]">
            {displayPrice}/sqft
          </Text>
        </View>

        {!!secondaryText && (
          <Text className="font-inter-semibold text-[13px]" style={{ color: secondaryTextColor }}>
            {secondaryText}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ExploreLocalityCard;
