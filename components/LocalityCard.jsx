import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

const LocalityCard = ({ title, rating, reviews, price, iconColor = '#1CB2A9' }) => {
  return (
    <View 
      className="bg-white rounded-[16px] mb-2 relative overflow-hidden shadow-sm"
      style={{
        width: 208,
        height: 102,
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

      <View className="flex-row justify-between items-start p-3 z-10">
        <View className="flex-1">
          <Text
            className="font-inter-semibold text-[14px] text-[#101828] leading-[20px] mb-1"
            style={{ marginTop: -4 }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <View className="flex-row items-center mb-2" style={{ gap: 6 }}>
            <View className="flex-row items-center" style={{ gap: 2 }}>
              <Ionicons name="star" size={16} color="#00A63E" />
              <Text className="font-inter-semibold text-[13px] text-[#101828] leading-[20px]">{rating}</Text>
            </View>
            <Text className="font-inter-regular text-[11px] text-[#4A5565] leading-[16px]">({reviews} ratings)</Text>
          </View>
          <Text className="font-inter-bold text-[14px] text-[#101828] leading-[21px]">{price}</Text>
        </View>

        <View
          className="w-[50px] h-[50px] rounded-[12px] items-center justify-center bg-[#DFFFFD]"
        >
          <Ionicons name="cube-outline" size={24} color={iconColor} style={{ opacity: 0.6 }} />
        </View>
      </View>

      <View className="flex-row items-center p-3 absolute bottom-0 left-0 z-10">
        <Text className="font-inter-medium text-[12px] text-[#2B7571] leading-[18px]">Read all reviews</Text>
        <Ionicons name="chevron-forward" size={14} color="#2B7571" className="ml-1" />
      </View>
    </View>
  );
};

export default LocalityCard;
