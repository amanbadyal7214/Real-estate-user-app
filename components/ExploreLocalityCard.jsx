import { Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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
        width: wp('33%'),
        height: hp('10.5%'),
        backgroundColor: '#FFFFFF',
        borderWidth: 0.57,
        borderColor: '#F3F4F6',
        borderBottomLeftRadius: wp('3.2%'),
        borderBottomRightRadius: wp('3.2%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp('0.08%') },
        shadowOpacity: 0.05,
        shadowRadius: wp('0.7%'),
        elevation: 1.5,
        overflow: 'hidden'
      }}
    >
      <View
        style={{
          height: hp('3.2%'),
          backgroundColor: '#EBF9F8',
          justifyContent: 'center',
          paddingHorizontal: wp('2.7%'),
        }}
      >
        <Text className="font-inter-bold text-[#101828]" style={{ fontSize: wp('2.7%'), lineHeight: hp('1.5%') }} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      </View>

      <View
        style={{ paddingHorizontal: wp('3.2%'), paddingTop: hp('0.8%'), paddingBottom: hp('1%'), flex: 1, justifyContent: 'space-between' }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Text className="font-inter-regular text-[#6A7282]" style={{ fontSize: wp('2.7%'), lineHeight: hp('1.8%'), flex: 0.4 }} numberOfLines={1} ellipsizeMode="tail">
             Avg. Price
          </Text>
          {String(displayPrice).includes('/') ? (
            <View style={{ flex: 0.6, alignItems: 'flex-end' }}>
              <Text className="font-inter-semibold text-[#101828]" style={{ fontSize: wp('2.7%'), lineHeight: hp('1.5%') }} numberOfLines={1} ellipsizeMode="tail">
                {displayPrice.split('/')[0]}
              </Text>
              <Text className="font-inter-regular text-[#6A7282]" style={{ fontSize: wp('2.1%'), lineHeight: hp('1.2%') }} numberOfLines={1} ellipsizeMode="tail">
                /{displayPrice.split('/').slice(1).join('/')}
              </Text>
            </View>
          ) : (
            <Text className="font-inter-semibold text-[#101828]" style={{ fontSize: wp('3.2%'), lineHeight: hp('2.2%'), flex: 0.6, textAlign: 'right' }} numberOfLines={1} ellipsizeMode="tail">
              {displayPrice}
            </Text>
          )}
        </View>

        {!!secondaryText && (
          <Text className="font-inter-semibold" style={{ fontSize: wp('3%'), color: secondaryTextColor }} numberOfLines={1} ellipsizeMode="tail">
            {secondaryText}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ExploreLocalityCard;
