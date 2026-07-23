import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Phone } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const RecommendedSellerCard = ({ name, experienceYears, propertiesCount, location }) => {
  return (
    <View 
      style={{
        width: wp('62%'),
        height: hp('18%'),
        borderRadius: wp('3.8%'),
        marginRight: wp('1.5%'),
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp('0.4%') },
        shadowOpacity: 0.08,
        shadowRadius: wp('1.1%'),
        elevation: 3,
      }}
    >
      <LinearGradient
        colors={[
          'rgba(28, 178, 169, 0.97)',
          'rgba(26, 175, 168, 0.62)',
          'rgba(25, 173, 166, 0.68)',
          'rgba(23, 170, 165, 0.73)',
          '#15A8A4',
          '#13A5A2',
          '#11A2A1',
          '#0FA0A0',
          '#0D9D9E',
          '#0B9B9D',
          'rgba(8, 152, 155, 0.42)',
          '#06969A',
          'rgba(4, 147, 153, 0.52)',
          '#029197',
          '#008E96'
        ]}
        locations={[
          0, 0.0714, 0.1429, 0.2143, 0.2857, 0.3571, 0.4286, 
          0.5, 0.5714, 0.6429, 0.7143, 0.7857, 0.8571, 0.9286, 1
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: wp('3.8%'),
          padding: wp('3.3%'),
          justifyContent: 'space-between'
        }}
      >
        {/* Top Profile Section */}
        <View className="flex-row items-center">
          <View 
            style={{ 
              width: wp('11.5%'), 
              height: wp('11.5%'), 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: wp('3%'),
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ fontSize: wp('5%') }}>👤</Text>
          </View>
          
          <View className="flex-row items-center" style={{ marginLeft: wp('2.8%') }}>
            <Text className="font-bold text-white" style={{ fontSize: wp('3.5%') }}>{name}</Text>
            <ChevronRight size={wp('3.7%')} color="white" style={{ marginLeft: wp('1.1%') }} />
          </View>
        </View>

        {/* Info Section */}
        <View style={{ gap: wp('1.5%'), marginTop: hp('0.2%') }}>
          <View className="flex-row items-center" style={{ gap: wp('2.2%') }}>
            <Text className="text-white" style={{ fontSize: wp('2.8%') }}>
              <Text className="font-bold">{experienceYears} yrs </Text>
              <Text className="font-normal">Experience</Text>
            </Text>
            
            <View style={{ width: wp('0.3%'), height: hp('1.5%'), backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
            
            <Text className="text-white" style={{ fontSize: wp('2.8%') }}>
              <Text className="font-bold">{propertiesCount} </Text>
              <Text className="font-normal">Properties</Text>
            </Text>
          </View>
          
          <Text className="font-normal text-white" style={{ fontSize: wp('2.7%') }}>{location}</Text>
        </View>

        {/* Button */}
        <TouchableOpacity 
          className="bg-white flex-row items-center justify-center"
          style={{ width: '100%', height: hp('3.8%'), borderRadius: 9999, gap: wp('1.8%'), marginTop: hp('0.3%') }}
        >
          <Phone size={wp('3.5%')} color="#008E96" />
          <Text className="font-medium text-[#008E96]" style={{ fontSize: wp('3.1%') }}>
            Show Contact
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default RecommendedSellerCard;
