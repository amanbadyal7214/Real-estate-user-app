import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, TouchableOpacity, View } from 'react-native';

const LocalityExploreCard = ({ title, rating, price, properties, onPress }) => {
  return (
    <View
      style={{
        width: 250,
        height: 112,
        backgroundColor: '#FFFFFF',
        borderWidth: 0.67,
        borderColor: '#E4E7EC',
        borderRadius: 14,
        padding: 13,
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
          width: 80,
          height: 80,
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
                width: 32, 
                height: 40, 
                left: 16, 
                top: 16, 
                backgroundColor: 'rgba(0, 142, 150, 0.1)', 
                borderRadius: 4 
            }} 
        />
        <View 
            style={{ 
                position: 'absolute', 
                width: 24, 
                height: 32, 
                left: 60, 
                top: 52, 
                backgroundColor: 'rgba(0, 142, 150, 0.08)', 
                borderRadius: 4 
            }} 
        />
        
        {/* Map Pin Icon */}
        <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="location" size={30} color="#008E96" />
        </View>
      </LinearGradient>

      {/* Content Area */}
      <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center' }}>
        <Text
          style={{
            fontFamily: 'Inter-SemiBold',
            fontSize: 15,
            color: '#101828',
            marginBottom: 4,
          }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="star" size={16} color="#101828" />
            <Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: '#101828', marginLeft: 4 }}>
              {rating}
            </Text>
          </View>
          <Text style={{ fontFamily: 'Inter-Regular', fontSize: 16, color: '#6A7282', marginHorizontal: 8 }}>•</Text>
          <Text style={{ fontFamily: 'Inter-Regular', fontSize: 14, color: '#4A5565' }}>
            {price}
          </Text>
        </View>

        <Text
          style={{
            fontFamily: 'Inter-Regular',
            fontSize: 13,
            color: '#6A7282',
            marginBottom: 10,
          }}
        >
          {properties} properties
        </Text>

        <TouchableOpacity 
            onPress={onPress}
            style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: '#008E96', marginRight: 4 }}>
            Know more
          </Text>
          <Ionicons name="chevron-forward" size={14} color="#008E96" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocalityExploreCard;
