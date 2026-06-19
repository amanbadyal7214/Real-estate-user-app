import { Image, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const DeveloperSummaryCard = ({ logo, logoText, name, yearEstd, projectCount, logoColor = '#E7000B', onPress, isActive }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`bg-white border ${isActive ? 'border-primary' : 'border-[#F3F4F6]'} items-center justify-center`}
      style={{
        padding: wp('2.7%'),
        borderRadius: wp('3.7%'),
        width: wp('34.1%'),
        height: hp('13.4%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp('0.1%') },
        shadowOpacity: 0.08,
        shadowRadius: wp('0.5%'),
        elevation: 1,
      }}
    >
      {/* Logo Container */}
      <View className="items-center justify-center" style={{ height: hp('4.9%'), marginBottom: hp('0.5%') }}>
        {logo ? (
          <Image source={{ uri: logo }} style={{ width: wp('10.7%'), height: wp('10.7%') }} resizeMode="contain" />
        ) : (
          <Text 
            className="font-inter-black" 
            style={{ fontSize: wp('5.3%'), color: logoColor, lineHeight: hp('3.7%') }}
          >
            {logoText || (name ? name.substring(0, 1) : 'D')}
          </Text>
        )}
      </View>

      {/* Developer Name */}
      <Text 
        className="font-inter-semibold text-[#101828] text-center"
        style={{ fontSize: wp('3.5%'), lineHeight: hp('2.5%'), marginBottom: hp('1.5%') }}
      >
        {name}
      </Text>

      {/* Stats Row */}
      <View className="flex-row items-center justify-center" style={{ gap: wp('3.2%') }}>
        <View className="items-center">
          <Text className="font-inter-semibold text-[#101828]" style={{ fontSize: wp('2.9%'), lineHeight: hp('2%') }}>
            {yearEstd}
          </Text>
          <Text className="font-inter-regular text-[#4A5565]" style={{ fontSize: wp('2.7%'), lineHeight: hp('1.8%') }}>
            Year estd.
          </Text>
        </View>
        <View className="items-center">
          <Text className="font-inter-semibold text-[#101828]" style={{ fontSize: wp('2.9%'), lineHeight: hp('2%') }}>
            {projectCount}
          </Text>
          <Text className="font-inter-regular text-[#4A5565]" style={{ fontSize: wp('2.7%'), lineHeight: hp('1.8%') }}>
            Project
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DeveloperSummaryCard;
