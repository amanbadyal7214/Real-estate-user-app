import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const LocalityCard = ({ title, rating, reviews, price, iconColor = '#1CB2A9' }) => {
  return (
    <View 
      className="bg-white relative overflow-hidden shadow-sm"
      style={{
        width: wp('55.5%'),
        height: hp('12.6%'),
        borderRadius: wp('4.3%'),
        marginBottom: hp('1%'),
        elevation: 1,
      }}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 1)', 'rgba(154, 221, 217, 0.03)', 'rgba(28, 178, 169, 0)']}
        locations={[0, 0.4471, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <View className="flex-row justify-between items-start z-10" style={{ padding: wp('3.2%') }}>
        <View className="flex-1">
          <Text
            className="font-inter-semibold text-[#101828]"
            style={{ fontSize: wp('3.7%'), lineHeight: hp('2.5%'), marginBottom: hp('0.5%'), marginTop: hp('-0.5%') }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <View className="flex-row items-center" style={{ gap: wp('1.6%'), marginBottom: hp('1%') }}>
            <View className="flex-row items-center" style={{ gap: wp('0.5%') }}>
              <Ionicons name="star" size={wp('4.3%')} color="#00A63E" />
              <Text className="font-inter-semibold text-[#101828]" style={{ fontSize: wp('3.5%'), lineHeight: hp('2.5%') }}>{rating}</Text>
            </View>
            <Text className="font-inter-regular text-[#4A5565]" style={{ fontSize: wp('2.9%'), lineHeight: hp('2%') }}>({reviews} ratings)</Text>
          </View>
          <Text className="font-inter-bold text-[#101828]" style={{ fontSize: wp('3.7%'), lineHeight: hp('2.6%') }}>{price}</Text>
        </View>

        <View
          className="items-center justify-center bg-[#DFFFFD]"
          style={{ width: wp('13.3%'), height: wp('13.3%'), borderRadius: wp('3.2%') }}
        >
          <Ionicons name="cube-outline" size={wp('6.4%')} color={iconColor} style={{ opacity: 0.6 }} />
        </View>
      </View>

      <View className="flex-row items-center absolute bottom-0 left-0 z-10" style={{ padding: wp('3.2%') }}>
        <Text className="font-inter-medium text-[#2B7571]" style={{ fontSize: wp('3.2%'), lineHeight: hp('2.2%') }}>Read all reviews</Text>
        <Ionicons name="chevron-forward" size={wp('3.7%')} color="#2B7571" style={{ marginLeft: wp('1.1%') }} />
      </View>
    </View>
  );
};

export default LocalityCard;
