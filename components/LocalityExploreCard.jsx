import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const LocalityExploreCard = ({ title, rating, price, properties, onPress }) => {
  return (
    <View
      style={{
        width: wp('66.7%'),
        height: hp('13.8%'),
        backgroundColor: '#FFFFFF',
        borderWidth: 0.67,
        borderColor: '#E4E7EC',
        borderRadius: wp('3.7%'),
        padding: wp('3.5%'),
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
          width: wp('21.3%'),
          height: wp('21.3%'),
          borderRadius: wp('3.2%'),
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
                width: wp('8.5%'), 
                height: hp('4.9%'), 
                left: wp('4.3%'), 
                top: hp('2%'), 
                backgroundColor: 'rgba(0, 142, 150, 0.1)', 
                borderRadius: wp('1%') 
            }} 
        />
        <View 
            style={{ 
                position: 'absolute', 
                width: wp('6.4%'), 
                height: hp('3.9%'), 
                left: wp('16%'), 
                top: hp('6.4%'), 
                backgroundColor: 'rgba(0, 142, 150, 0.08)', 
                borderRadius: wp('1%') 
            }} 
        />
        
        {/* Map Pin Icon */}
        <View style={{ width: wp('10.7%'), height: wp('10.7%'), justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="location" size={wp('8%')} color="#008E96" />
        </View>
      </LinearGradient>

      {/* Content Area */}
      <View style={{ flex: 1, marginLeft: wp('4.3%'), justifyContent: 'center' }}>
        <Text
          style={{
            fontFamily: 'Inter-SemiBold',
            fontSize: wp('4%'),
            color: '#101828',
            marginBottom: hp('0.5%'),
          }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp('0.7%') }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="star" size={wp('4.3%')} color="#101828" />
            <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.7%'), color: '#101828', marginLeft: wp('1%') }}>
              {rating}
            </Text>
          </View>
          <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('4.3%'), color: '#6A7282', marginHorizontal: wp('2.1%') }}>•</Text>
          <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.7%'), color: '#4A5565' }}>
            {price}
          </Text>
        </View>

        <Text
          style={{
            fontFamily: 'Inter-Regular',
            fontSize: wp('3.5%'),
            color: '#6A7282',
            marginBottom: hp('1.2%'),
          }}
        >
          {properties} properties
        </Text>

        <TouchableOpacity 
            onPress={onPress}
            style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.7%'), color: '#008E96', marginRight: wp('1%') }}>
            Know more
          </Text>
          <Ionicons name="chevron-forward" size={wp('3.7%')} color="#008E96" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocalityExploreCard;
