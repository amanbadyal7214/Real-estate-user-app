import { useRouter } from 'expo-router';
import { Check, Heart, MessageCircle } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const InsightPropertyCard = ({ 
  id,
  image, 
  possession, 
  title, 
  location, 
  price, 
  bhk, 
  area, 
  isRera 
}) => {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  const navigateToDetails = () => {
    if (id) {
        router.push({
            pathname: '/screens/PropertyDetails',
            params: { propertyId: id }
        });
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={navigateToDetails}
      className="bg-white mr-4 mb-2 rounded-[14px] border-[0.67px] border-[#E4E7EC] pt-[10px] px-[10px] pb-[10px] w-[180px] h-[330px]"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <View className="w-full h-[128px] rounded-[12px] overflow-hidden relative">
        <Image 
          source={{ uri: image }} 
          className="w-full h-full"
          resizeMode="cover"
        />
        {/* RERA Badge */}
        {isRera && (
          <View className="absolute left-2 top-2 bg-[#008E96] rounded-lg flex-row items-center py-1 px-2 gap-1">
            <Check size={12} color="#FFFFFF" strokeWidth={3} />
            <Text className="font-inter-medium text-[11px] leading-[16px] text-white">RERA</Text>
          </View>
        )}
        {/* Heart Icon */}
        <TouchableOpacity 
          onPress={() => setIsSaved(!isSaved)}
          className="absolute right-2 top-2 w-8 h-8 bg-white/90 rounded-full items-center justify-center"
        >
          <Heart 
            size={18} 
            color={isSaved ? "#F04438" : "#4A5565"} 
            fill={isSaved ? "#F04438" : "transparent"} 
            strokeWidth={2} 
          />
        </TouchableOpacity>
      </View>

      <View className="mt-1.5">
        <Text className="font-inter-regular text-[12px] leading-[18px] text-[#6A7282] mb-1">
          {possession}
        </Text>
        <Text className="font-inter-semibold text-[16px] leading-[24px] text-[#101828] mb-0.5" numberOfLines={1}>
          {title}
        </Text>
        <Text className="font-inter-regular text-[13px] leading-[20px] text-[#6A7282] mb-1">
          {location}
        </Text>
        <Text className="font-inter-semibold text-[15px] leading-[22px] text-[#101828] mb-0.5">
          {price}
        </Text>
        <Text className="font-inter-regular text-[13px] leading-[20px] text-[#6A7282] mb-0.5">
          {bhk}
        </Text>
        <Text className="font-inter-regular text-[13px] leading-[20px] text-[#6A7282] mb-2">
          {area}
        </Text>

        <View className="flex-row items-center gap-2 w-full h-10">
          <TouchableOpacity 
            className="w-10 h-10 bg-[#25D366]/10 rounded-full items-center justify-center"
          >
            <MessageCircle size={20} color="#25D366" fill="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 h-10 bg-[#008E96]/10 rounded-[14px] items-center justify-center"
          >
            <Text className="font-inter-medium text-[14px] leading-[21px] text-[#008E96] text-center">
              View Phone
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default InsightPropertyCard;
