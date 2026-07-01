import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { formatPrice } from '../app/utils/formatPrice';

const BetterPricedPropertyCard = ({ id, image, title, marketer, details, priceRange }) => {
  const marketerInitial = marketer ? marketer.charAt(0).toUpperCase() : '';

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={() => {
        const propId = id
        if (propId) {
          router.push({ pathname: '/screens/PropertyDetails', params: { propertyId: propId } })
        } else {
          router.push('/screens/ProjectDetails')
        }
      }}
      className="bg-white mr-3"
      style={{
        width: wp('55%'),
        height: hp('30%'),
        borderRadius: wp('3.8%'),
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp('0.3%') },
        shadowOpacity: 0.08,
        shadowRadius: wp('1%'),
        elevation: 3,
      }}
    >
      <View style={{ borderRadius: wp('3.8%'), overflow: 'hidden', width: '100%', height: '100%' }}>
        <Image 
          source={{ uri: image }} 
          style={{ width: '100%', height: hp('16.5%') }}
          resizeMode="cover"
        />
        
        <View style={{ paddingHorizontal: wp('3.2%'), paddingTop: hp('1%'), paddingBottom: hp('1.5%'), gap: hp('0.5%') }}>
          <Text 
            className="font-inter-bold text-[#101828]" 
            style={{ fontSize: wp('3.6%'), lineHeight: hp('2.5%') }}
            numberOfLines={1}
          >
            {title}
          </Text>
          
          <View className="flex-row items-center" style={{ gap: wp('2.1%') }}>
            <View 
              className="items-center justify-center bg-primary"
              style={{ width: wp('5.6%'), height: wp('5.6%'), borderRadius: wp('2.8%') }}
            >
              <Text 
                className="font-inter-bold text-white text-center" 
                style={{ fontSize: wp('2.2%'), lineHeight: hp('1.5%') }}
              >
                {marketerInitial}
              </Text>
            </View>
            <Text 
              className="font-inter-regular text-[#6A7282]" 
              style={{ fontSize: wp('2.8%'), lineHeight: hp('2%'), flex: 1 }}
              numberOfLines={1}
            >
              mktd by {marketer}
            </Text>
          </View>

          <Text 
            className="font-inter-regular text-[#4A5565]" 
            style={{ fontSize: wp('2.8%'), lineHeight: hp('2%') }}
            numberOfLines={1}
          >
            {details}
          </Text>

          <Text 
            className="font-inter-bold text-[#101828]" 
            style={{ fontSize: wp('3.4%'), lineHeight: hp('2.3%') }}
            numberOfLines={1}
          >
           {formatPrice(priceRange)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BetterPricedPropertyCard;
