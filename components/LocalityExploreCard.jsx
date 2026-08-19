import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const LocalityExploreCard = ({ title, rating, price, properties, onPress }) => {
  return (
    <View
      style={{
        width: wp('57%'),
        backgroundColor: '#FFFFFF',
        borderWidth: 0.67,
        borderColor: '#E4E7EC',
        borderRadius: 14,
        padding: 12,
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
          width: 64,
          height: 64,
          borderRadius: 12,
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
                width: 26, 
                height: 32, 
                left: 12, 
                top: 14, 
                backgroundColor: 'rgba(0, 142, 150, 0.1)', 
                borderRadius: 4 
            }} 
        />
        <View 
            style={{ 
                position: 'absolute', 
                width: 20, 
                height: 24, 
                left: 48, 
                top: 40, 
                backgroundColor: 'rgba(0, 142, 150, 0.08)', 
                borderRadius: 4 
            }} 
        />
        
        {/* Map Pin Icon */}
        <View style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="location" size={24} color="#008E96" />
        </View>
      </LinearGradient>

      {/* Content Area */}
      <View style={{ flex: 1, marginLeft: 12, justifyContent: 'center' }}>
        <Text
          style={{
            fontWeight: '600',
            fontSize: 13,
            color: '#101828',
            marginBottom: 4,
            lineHeight: 18
          }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="star" size={14} color="#101828" />
            <Text style={{ fontWeight: '500', fontSize: 11, color: '#101828', marginLeft: 4 }}>
              {rating}
            </Text>
          </View>
          <Text style={{ fontWeight: '400', fontSize: 11, color: '#6A7282', marginHorizontal: 6 }}>•</Text>
          <Text style={{ fontWeight: '400', fontSize: 11, color: '#4A5565' }}>
            {price}
          </Text>
        </View>

        <Text
          style={{
            fontWeight: '400',
            fontSize: 11,
            color: '#6A7282',
            marginBottom: 6,
          }}
        >
          {properties} properties
        </Text>

        <TouchableOpacity 
            onPress={onPress}
            style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={{ fontWeight: '500', fontSize: 12, color: '#008E96', marginRight: 4 }}>
            Know more
          </Text>
          <Ionicons name="chevron-forward" size={12} color="#008E96" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocalityExploreCard;
