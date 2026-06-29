import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const LocalityExploreCard = ({ title, rating, price, properties, onPress }) => {
  return (
    <View
      style={{
        width: wp('57%'),
        height: hp('11.7%'),
        backgroundColor: '#FFFFFF',
        borderWidth: 0.67,
        borderColor: '#E4E7EC',
        borderRadius: wp('3.2%'),
        padding: wp('3%'),
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Icon Area */}
      <LinearGradient
        colors={['rgba(0, 142, 150, 0.1)', 'rgba(28, 178, 169, 0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: wp('18%'),
          height: wp('18%'),
          borderRadius: wp('2.7%'),
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative Boxes */}
        <View 
            style={{ 
                position: 'absolute', 
                width: wp('7.2%'), 
                height: hp('4.2%'), 
                left: wp('3.7%'), 
                top: hp('1.7%'), 
                backgroundColor: 'rgba(0, 142, 150, 0.1)', 
                borderRadius: wp('1%') 
            }} 
        />
        <View 
            style={{ 
                position: 'absolute', 
                width: wp('5.5%'), 
                height: hp('3.3%'), 
                left: wp('13.5%'), 
                top: hp('5.5%'), 
                backgroundColor: 'rgba(0, 142, 150, 0.08)', 
                borderRadius: wp('1%') 
            }} 
        />
        
        {/* Map Pin Icon */}
        <View style={{ width: wp('9%'), height: wp('9%'), justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="location" size={wp('6.8%')} color="#008E96" />
        </View>
      </LinearGradient>

      {/* Content Area */}
      <View style={{ flex: 1, marginLeft: wp('3.5%'), justifyContent: 'center' }}>
        <Text
          style={{
            fontFamily: 'Inter-SemiBold',
            fontSize: wp('3.4%'),
            color: '#101828',
            marginBottom: hp('0.4%'),
          }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp('0.5%') }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="star" size={wp('3.7%')} color="#101828" />
            <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.2%'), color: '#101828', marginLeft: wp('0.8%') }}>
              {rating}
            </Text>
          </View>
          <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.7%'), color: '#6A7282', marginHorizontal: wp('1.8%') }}>•</Text>
          <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.2%'), color: '#4A5565' }}>
            {price}
          </Text>
        </View>

        <Text
          style={{
            fontFamily: 'Inter-Regular',
            fontSize: wp('3%'),
            color: '#6A7282',
            marginBottom: hp('1%'),
          }}
        >
          {properties} properties
        </Text>

        <TouchableOpacity 
            onPress={onPress}
            style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.2%'), color: '#008E96', marginRight: wp('0.8%') }}>
            Know more
          </Text>
          <Ionicons name="chevron-forward" size={wp('3.2%')} color="#008E96" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocalityExploreCard;
