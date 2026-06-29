import React, { useState, useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import api from '../app/api';

const PropertyCardSmall = ({
  id,
  image,
  price,
  title,
  area,
  location,
  containerStyle,
  imageStyle,
  showWishlist = true,
  isWishlisted = false,
  onWishlistToggle = () => {},
}) => {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(isWishlisted);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setIsSaved(isWishlisted);
  }, [isWishlisted]);

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
        onWishlistToggle(id, nextState);
      }
    } catch (err) {
      console.error("Error toggling wishlist in PropertyCardSmall:", err);
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
      className="overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white relative"
      style={{
        width: '100%',
        borderWidth: 0.6667,
        minHeight: 218,
        ...containerStyle,
      }}
    >
      <View className="relative">
        <Image
          source={{ uri: image }}
          className="w-full"
          style={[{ height: 118 }, imageStyle]}
          resizeMode="cover"
        />
        {showWishlist && (
          <TouchableOpacity 
            onPress={toggleWishlist}
            className="absolute bg-black/45 items-center justify-center"
            style={{ 
              width: 27, 
              height: 27, 
              borderRadius: 14,
              right: 7, 
              top: 7,
              zIndex: 10 
            }}
          >
            <Heart 
              size={13} 
              color={isSaved ? "#F04438" : "white"} 
              fill={isSaved ? "#F04438" : "transparent"} 
            />
          </TouchableOpacity>
        )}
      </View>

      <View className="px-2.5 pb-2.5 pt-2">
        <Text className="font-inter-semibold text-[14px] leading-5 text-[#101828]">
          {price}
        </Text>
        <Text className="mt-0.5 font-inter-medium text-[13px] leading-[17px] text-[#101828]" numberOfLines={1}>
          {title}
        </Text>
        <Text className="mt-0.5 font-inter-medium text-[11px] leading-[18px] text-[#6A7282]">
          {area}
        </Text>
        <Text className="font-inter-medium text-[11px] leading-[18px] text-[#6A7282]" numberOfLines={1}>
          {location}
        </Text>
      </View>

      {toast && (
        <View 
          style={{
            position: 'absolute',
            bottom: 45,
            left: 10,
            right: 10,
            backgroundColor: '#1E293B',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}
        >
          <Text style={{ color: 'white', fontFamily: 'Inter-Medium', fontSize: 11, textAlign: 'center' }}>
            {toast}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PropertyCardSmall;
