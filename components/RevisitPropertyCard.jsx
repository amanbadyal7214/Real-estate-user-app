import { Check, Heart, MessageCircle } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../app/api';

const RevisitPropertyCard = ({
  id,
  image,
  possession,
  title,
  location,
  price,
  bhk,
  area,
  isRera,
  isWishlisted = false
}) => {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(!!isWishlisted);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  const toggleWishlist = async () => {
    if (!id) {
      showToast("Property ID is missing");
      return;
    }
    try {
      const nextState = !isSaved;
      setIsSaved(nextState);
      const res = nextState 
        ? await api.post(`/properties/wishlist/${id}`)
        : await api.delete(`/properties/wishlist/${id}`);
      if (res.data?.success) {
        showToast(res.data.message || (nextState ? "Property added to wishlist" : "Property removed from wishlist"));
      }
    } catch (err) {
      console.error("Error toggling wishlist in RevisitPropertyCard:", err);
      setIsSaved(prev => !prev);
      showToast(err.response?.data?.message || err.response?.data?.error || "Failed to update wishlist");
    }
  };

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
      className="bg-white mr-4 mb-2 rounded-[16px] border-[0.67px] border-[#E4E7EC] pt-[12.67px] px-[12.67px] pb-[0.67px] w-[260px] h-[376.33px]"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
      }}
    >
      <View className="w-[234.67px] h-[140px] rounded-[14px] overflow-hidden relative">
        <Image
          source={{ uri: image }}
          className="w-full h-full"
          resizeMode="cover"
        />
        {/* RERA Badge */}
        {isRera && (
          <View className="absolute left-2 top-2 bg-[#00C48C] rounded-lg flex-row items-center py-1 px-2 gap-1">
            <Check size={12} color="#FFFFFF" strokeWidth={3} />
            <Text className="font-inter-medium text-[11px] leading-[16px] text-white">RERA</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={toggleWishlist}
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

      <View className="mt-3">
        <Text className="font-inter-regular text-[12px] leading-[18px] text-[#6A7282] mb-1">
          {possession}
        </Text>
        <Text className="font-inter-semibold text-[16px] leading-[24px] text-[#101828] mb-1" numberOfLines={1}>
          {title}
        </Text>
        <Text className="font-inter-regular text-[13px] leading-[20px] text-[#6A7282] mb-1.5">
          {location}
        </Text>
        <Text className="font-inter-semibold text-[15px] leading-[22px] text-[#101828] mb-1">
          {price}
        </Text>
        <Text className="font-inter-regular text-[13px] leading-[20px] text-[#6A7282] mb-0.5">
          {bhk}
        </Text>
        <Text className="font-inter-regular text-[13px] leading-[20px] text-[#6A7282] mb-3">
          {area}
        </Text>

        <View className="flex-row items-center gap-2 w-[234.67px] h-10">
          <TouchableOpacity
            className="w-10 h-10 bg-[#25D366]/10 rounded-full items-center justify-center"
          >
            <MessageCircle size={20} color="#25D366" fill="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[186.67px] h-10 bg-[#008E96]/10 rounded-[14px] items-center justify-center"
          >
            <Text className="font-inter-medium text-[14px] leading-[21px] text-[#008E96] text-center">
              View Phone
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {toast && (
        <View 
          style={{
            position: 'absolute',
            bottom: 60,
            left: 10,
            right: 10,
            backgroundColor: '#1E293B',
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text style={{ color: 'white', fontFamily: 'Inter-Medium', fontSize: 12, textAlign: 'center' }}>
            {toast}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default RevisitPropertyCard;
