import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

const HighDemandProjectCard = ({ priceRange, title, developer, location }) => {
  return (
    <View 
      className="bg-white rounded-[20px] overflow-hidden"
      style={{
        width: 338,
        height: 284.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      {/* Container (Gradient Image Background) */}
      <LinearGradient
        colors={['#FFFBEB', '#FFF7ED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="items-center justify-center px-4"
        style={{ height: 160 }}
      >
        <View 
          className="items-center justify-center rounded-xl bg-gray-200/50"
          style={{ width: 306, height: 128 }}
        >
          <Ionicons name="image-outline" size={40} color="#9CA3AF" />
        </View>
      </LinearGradient>

      {/* Content Container */}
      <View className="px-4 py-4 justify-between" style={{ height: 124.5 }}>
        <View>
          <Text 
            className="font-inter-bold text-[#101828]"
            style={{ fontSize: 16, lineHeight: 24 }}
          >
            {priceRange}
          </Text>
          <Text 
            className="font-inter-semibold text-[#101828]"
            style={{ fontSize: 15, lineHeight: 22, marginTop: 4 }}
          >
            {title}
          </Text>
        </View>
        
        <View>
          <Text 
            className="font-inter-regular text-[#4A5565]"
            style={{ fontSize: 12, lineHeight: 18 }}
          >
            by {developer}
          </Text>
          <Text 
            className="font-inter-regular text-[#4A5565]"
            style={{ fontSize: 12, lineHeight: 18, marginTop: 2 }}
          >
            {location}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HighDemandProjectCard;
