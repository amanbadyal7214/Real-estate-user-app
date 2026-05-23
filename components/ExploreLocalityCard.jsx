import { Text, TouchableOpacity, View } from 'react-native';

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
    <TouchableOpacity
      activeOpacity={0.9}
      style={{
        width: 170,
        height: 120,
        backgroundColor: '#FFFFFF',
        borderWidth: 0.67,
        borderColor: '#F3F4F6',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
        overflow: 'hidden'
      }}
    >
      <View
        style={{
          height: 32,
          backgroundColor: '#EBF9F8',
          justifyContent: 'center',
          paddingHorizontal: 12,
        }}
      >
        <Text className="font-inter-bold text-[#101828] text-[14px]" numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
      </View>

      <View
        style={{ paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12, flex: 1, justifyContent: 'space-between' }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Text className="font-inter-regular text-[#6A7282] text-[12px] leading-[18px]" style={{ flex: 0.6 }} numberOfLines={2} ellipsizeMode="tail">
            {avgLabel || 'Avg. Price'}
          </Text>
          <Text className="font-inter-semibold text-[#101828]" style={{ fontSize: 14, lineHeight: 20, flex: 0.4, textAlign: 'right' }} numberOfLines={1} ellipsizeMode="tail">
            {displayPrice}
          </Text>
        </View>

        {!!secondaryText && (
          <Text className="font-inter-semibold text-[13px]" style={{ color: secondaryTextColor }} numberOfLines={2} ellipsizeMode="tail">
            {secondaryText}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ExploreLocalityCard;
