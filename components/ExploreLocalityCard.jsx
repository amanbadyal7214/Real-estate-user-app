import { Text, TouchableOpacity, View } from 'react-native';
import { formatPrice, formatPricePerSqft } from '../app/utils/formatPrice';

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
  let displayPrice = 'N/A';

  if (averagePrice !== undefined && averagePrice !== null && averagePrice !== '') {
    displayPrice = formatPrice(averagePrice);
  } else if (priceSqft !== undefined && priceSqft !== null && priceSqft !== '') {
    displayPrice = formatPricePerSqft(priceSqft);
  } else if (avgPrice !== undefined && avgPrice !== null && avgPrice !== '') {
    // avgPrice can be a per-sqft value or a total value depending on source
    const raw = String(avgPrice).toLowerCase();
    if (raw.includes('sq') || raw.includes('/sq') || raw.includes('per')) {
      displayPrice = typeof avgPrice === 'number' ? formatPricePerSqft(avgPrice) : avgPrice;
    } else {
      displayPrice = formatPrice(avgPrice);
    }
  } else if (avgLabel) {
    displayPrice = avgLabel;
  }
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
          <Text className="font-inter-regular text-[#6A7282] text-[12px] leading-[18px]" style={{ flex: 0.4 }} numberOfLines={1} ellipsizeMode="tail">
             Avg. Price
          </Text>
          {String(displayPrice).includes('/') ? (
            <View style={{ flex: 0.6, alignItems: 'flex-end' }}>
              <Text className="font-inter-semibold text-[#101828]" style={{ fontSize: 14, lineHeight: 20 }} numberOfLines={1} ellipsizeMode="tail">
                {displayPrice.split('/')[0]}
              </Text>
              <Text className="font-inter-regular text-[#6A7282]" style={{ fontSize: 11, lineHeight: 14 }} numberOfLines={1} ellipsizeMode="tail">
                /{displayPrice.split('/').slice(1).join('/')}
              </Text>
            </View>
          ) : (
            <Text className="font-inter-semibold text-[#101828]" style={{ fontSize: 14, lineHeight: 20, flex: 0.6, textAlign: 'right' }} numberOfLines={1} ellipsizeMode="tail">
              {displayPrice}
            </Text>
          )}
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
