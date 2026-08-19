import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const LocalityCard = ({ title, rating, reviews, price, iconColor = '#1CB2A9' }) => {
  return (
    <View 
      className="bg-white relative overflow-hidden shadow-sm flex-col justify-between"
      style={{
        width: wp('48%'),
        minHeight: hp('14%'),
        borderRadius: wp('3.8%'),
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

      <View className="flex-row justify-between items-start z-10" style={{ padding: wp('3.2%'), paddingBottom: wp('1%') }}>
        <View style={{ flex: 1, paddingRight: wp('1%') }}>
          <Text
            className="font-semibold text-[#101828]"
            style={{ fontSize: wp('3.2%'), lineHeight: hp('2.2%'), marginBottom: hp('0.3%') }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <View className="flex-row items-center" style={{ gap: wp('1.6%'), marginBottom: hp('0.5%') }}>
            <View className="flex-row items-center" style={{ gap: wp('0.5%') }}>
              <Ionicons name="star" size={wp('3.5%')} color="#00A63E" />
              <Text className="font-semibold text-[#101828]" style={{ fontSize: wp('3%'), lineHeight: hp('2%') }}>{rating}</Text>
            </View>
            <Text className="font-normal text-[#4A5565]" style={{ fontSize: wp('2.5%'), lineHeight: hp('1.7%') }}>({reviews})</Text>
          </View>
          <Text className="font-bold text-[#101828]" style={{ fontSize: wp('3.2%'), lineHeight: hp('2.2%') }}>{price}</Text>
        </View>

        <View
          className="items-center justify-center bg-[#DFFFFD]"
          style={{ width: wp('10%'), height: wp('10%'), borderRadius: wp('2.5%') }}
        >
          <Ionicons name="cube-outline" size={wp('4.8%')} color={iconColor} style={{ opacity: 0.6 }} />
        </View>
      </View>

      <View className="flex-row items-center z-10" style={{ padding: wp('3.2%'), paddingTop: wp('1%') }}>
        <Text className="font-medium text-[#2B7571]" style={{ fontSize: wp('3.2%'), lineHeight: hp('2.2%') }}>Read all reviews</Text>
        <Ionicons name="chevron-forward" size={wp('3.7%')} color="#2B7571" style={{ marginLeft: wp('1.1%') }} />
      </View>
    </View>
  );
};

export default LocalityCard;
