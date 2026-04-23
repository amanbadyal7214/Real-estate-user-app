import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, TouchableOpacity, View } from 'react-native';

const LocalityCard = ({ title, rating, reviews, price, iconColor = '#1CB2A9' }) => {
  return (
    <View 
      className="bg-white rounded-[20px] p-4 mb-2 flex-col justify-between"
      style={{
        width: 260,
        height: 127,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <LinearGradient
        colors={['#FFFFFF', 'rgba(154, 221, 217, 0.03)', 'rgba(28, 178, 169, 0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 20 }}
      />
      
      <View className="flex-row justify-between items-start z-10">
        <View className="flex-1">
          <Text className="font-inter-bold text-[15px] text-[#101828] mb-1">{title}</Text>
          <View className="flex-row items-center mb-1">
            <Ionicons name="star" size={14} color="#00A63E" />
            <Text className="font-inter-bold text-[13px] text-[#101828] ml-1">{rating}</Text>
            <Text className="font-inter-regular text-[11px] text-[#4A5565] ml-1">({reviews} reviews)</Text>
          </View>
          <Text className="font-inter-bold text-[14px] text-[#101828]">{price}</Text>
        </View>

        <View 
          className="w-16 h-16 rounded-[14px] items-center justify-center bg-[#DFFFFD]"
        >
          <Ionicons name="cube-outline" size={32} color={iconColor} style={{ opacity: 0.6 }} />
        </View>
      </View>

      <TouchableOpacity className="flex-row items-center z-10 mt-2">
        <Text className="font-inter-medium text-[12px] text-[#2B7571]">Read all reviews</Text>
        <Ionicons name="chevron-forward" size={14} color="#2B7571" className="ml-1" />
      </TouchableOpacity>
    </View>
  );
};

export default LocalityCard;
