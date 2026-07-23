import { Image, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const DeveloperSummaryCard = ({ logo, logoText, name, yearEstd, projectCount, logoColor = '#E7000B', onPress, isActive }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        width: wp('38%'),
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: isActive ? '#008E96' : '#F3F4F6',
        paddingVertical: 16, // Equal space top and bottom
        paddingHorizontal: 10,
        borderRadius: wp('3.2%'),
        minHeight: hp('14%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 1,
        alignItems: 'center',
        justifyContent: 'space-between', // Pushes content evenly
      }}
    >
      {/* Logo Container */}
      <View style={{ alignItems: 'center', justifyContent: 'center', height: hp('4%'), marginBottom: 6 }}>
        {logo ? (
          <Image source={{ uri: logo }} style={{ width: wp('10.7%'), height: wp('10.7%') }} resizeMode="contain" />
        ) : (
          <View style={{
            width: wp('10.7%'),
            height: wp('10.7%'),
            borderRadius: wp('2%'),
            backgroundColor: logoColor + '22',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ fontSize: wp('4.5%'), color: logoColor, fontWeight: '700' }}>
              {logoText ? String(logoText) : (name ? String(name).substring(0, 1) : 'D')}
            </Text>
          </View>
        )}
      </View>

      {/* Developer Name */}
      <Text
        numberOfLines={2}
        style={{
          fontWeight: '600',
          color: '#101828',
          textAlign: 'center',
          fontSize: wp('3%'),
          lineHeight: hp('2%'),
          marginBottom: 8,
        }}
      >
        {name ? String(name) : ''}
      </Text>

      {/* Stats Row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: wp('3.2%') }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontWeight: '600', color: '#101828', fontSize: wp('2.5%'), lineHeight: hp('1.7%') }}>
            {yearEstd ? String(yearEstd) : '2024'}
          </Text>
          <Text style={{ fontWeight: '400', color: '#4A5565', fontSize: wp('2.2%'), lineHeight: hp('1.5%') }}>
            Year estd.
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontWeight: '600', color: '#101828', fontSize: wp('2.5%'), lineHeight: hp('1.7%') }}>
            {projectCount !== undefined ? String(projectCount) : '0'}
          </Text>
          <Text style={{ fontWeight: '400', color: '#4A5565', fontSize: wp('2.2%'), lineHeight: hp('1.5%') }}>
            Projects
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DeveloperSummaryCard;
