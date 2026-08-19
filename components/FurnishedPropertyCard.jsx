import { Image, Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const FurnishedPropertyCard = ({ image, price, title, location, furnishedStatus, area }) => {
  return (
    <View style={{ width: wp('48%'), height: hp('37%'), marginRight: wp('2.1%') }} className="bg-white rounded-[14px] overflow-hidden border border-[#F3F4F6] shadow-sm">
      {/* Property Image */}
      <View style={{ width: wp('38.6%'), height: hp('17%'), marginTop: hp('1.5%'), marginLeft: wp('3.2%') }} className="rounded-[8px] overflow-hidden">
        <Image
          source={{ uri: image }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>

      {/* Content Container */}
      <View style={{ marginTop: hp('1%'), paddingHorizontal: wp('3.2%'), flex: 1 }}>
        <Text numberOfLines={1} className="font-bold text-[#101828]" style={{ fontSize: wp('4%'), lineHeight: hp('2.7%') }}>{price}</Text>
        <Text numberOfLines={1} className="font-normal text-[#364153]" style={{ fontSize: wp('3.2%'), lineHeight: hp('2.2%'), marginTop: hp('0.2%') }}>{title}</Text>
        <Text numberOfLines={2} className="font-normal text-[#6A7282]" style={{ fontSize: wp('3.2%'), lineHeight: hp('2.1%'), marginTop: hp('0.5%'), height: hp('3.4%') }}>{location}</Text>

        <View className="flex-row items-center flex-wrap" style={{ marginTop: hp('1%') }}>
          <Text className="font-bold text-[#101828]" style={{ fontSize: wp('2.9%'), lineHeight: hp('2%') }}>{furnishedStatus}</Text>
          <Text className="text-[#99A1AF]" style={{ marginHorizontal: wp('1.1%'), fontSize: wp('3.2%') }}>•</Text>
          <Text className="font-bold text-[#101828]" style={{ fontSize: wp('2.9%'), lineHeight: hp('2%') }}>{area}</Text>
        </View>
      </View>
    </View>
  );
};

export default FurnishedPropertyCard;
