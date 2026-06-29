import { Image, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const SellerCard = ({
  name,
  experienceYears,
  propertiesCount,
  avatar,
  tags = ['Commercial', 'Verified'],
  onPressContact,
  cardWidth = wp('75%'),
}) => {
  return (
    <View
      className="bg-white border border-[#E4E7EC] rounded-2xl"
      style={{
        width: cardWidth,
        minHeight: hp('15%'),
        paddingTop: hp('1.5%'),
        paddingHorizontal: wp('3%'),
        paddingBottom: hp('1.2%'),
        gap: hp('1.2%'),
      }}
    >
      <View className="flex-row items-start" style={{ gap: wp('2.5%') }}>
        <Image
          source={{
            uri:
              avatar ||
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
          }}
          className="rounded-full"
          style={{ width: wp('10%'), height: wp('10%') }}
          resizeMode="cover"
        />

        <View className="flex-1" style={{ gap: hp('0.3%') }}>
          <Text className="font-inter-semibold text-[#101828]" style={{ fontSize: wp('3.5%') }}>
            {name}
          </Text>
          <Text className="font-inter-regular text-[#6A7282]" style={{ fontSize: wp('3%') }}>
            {experienceYears} years exp • {propertiesCount} properties
          </Text>
        </View>
      </View>

      <View className="flex-row" style={{ gap: wp('2%') }}>
        {tags.map((tag) => (
          <View key={tag} className="bg-[#F3F4F6] rounded-md" style={{ paddingHorizontal: wp('2.5%'), paddingVertical: hp('0.5%') }}>
            <Text className="font-inter-regular text-[#4A5565]" style={{ fontSize: wp('3%') }}>
              {tag}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={onPressContact}
        activeOpacity={0.8}
        className="rounded-[10px] border-2 border-[#008E96] items-center justify-center"
        style={{ height: hp('5%') }}
      >
        <Text className="font-inter-semibold text-[#008E96]" style={{ fontSize: wp('3.5%') }}>
          Show Contact
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SellerCard;