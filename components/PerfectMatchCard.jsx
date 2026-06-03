import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Camera, Heart, MessageSquare, Phone } from 'lucide-react-native';
import { Image, ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import api from '../app/api';

const PerfectMatchCard = ({ property, onPress, showWishlist = true }) => {
  const [isSaved, setIsSaved] = useState(!!property.isWishlisted);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  const toggleWishlist = async () => {
    const id = property.id;
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
      console.error("Error toggling wishlist in PerfectMatchCard:", err);
      setIsSaved(prev => !prev);
      showToast(err.response?.data?.message || err.response?.data?.error || "Failed to update wishlist");
    }
  };
  const router = useRouter();

  const navigateToDetails = () => {
    router.push({
      pathname: '/screens/PropertyDetails',
      params: { propertyId: property.id }
    });
  };
  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={onPress || navigateToDetails}
      className="bg-white rounded-[16px] mb-6 p-3"
      style={{ 
        borderWidth: 0.667,
        borderColor: '#F3F4F6',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.06, 
        shadowRadius: 16, 
        elevation: 3 
      }}
    >
      {/* Image Section */}
      <View className="mb-3 relative">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          decelerationRate="fast"
          snapToInterval={213} // 203 (width) + 10 (gap)
          snapToAlignment="start"
          contentContainerStyle={{ gap: 10, paddingRight: 20 }}
        >
          {property.images?.map((img, index) => (
            <View 
              key={index} 
              className="rounded-[14px] overflow-hidden"
              style={{ width: 170, height: 150 }}
            >
              <Image 
                source={{ uri: img }} 
                className="w-full h-full" 
                resizeMode="cover" 
              />
            </View>
          ))}
        </ScrollView>
        
        {/* Badges Left */}
        <View className="absolute top-2 left-2 flex-row gap-1.5" pointerEvents="none">
          {property.zeroBrokerage && (
            <View className="bg-black/65 px-3 py-1 rounded-[8px]">
              <Text className="text-white font-inter-semibold text-[12px]">Zero Brokerage</Text>
            </View>
          )}
          {property.isRera && (
            <View className="bg-[#22C55EE6] px-3 py-1 rounded-[8px] flex-row items-center gap-1">
              <View className="w-1.5 h-1.5 rounded-full bg-white" />
              <Text className="text-white font-inter-bold text-[11px]">RERA</Text>
            </View>
          )}
        </View>

        {/* Photo Count Bottom Left */}
        <View className="absolute bottom-2 left-2 bg-black/65 px-2 py-1 rounded-[8px] flex-row items-center gap-1" pointerEvents="none">
          <Camera size={14} color="white" />
          <Text className="text-white font-inter-semibold text-[12px]">{property.images?.length || 0}</Text>
        </View>

        {/* Heart Button Right */}
        {showWishlist && (
          <View className="absolute" style={{ right: 8, top: 8 }}>
            <TouchableOpacity 
              onPress={toggleWishlist}
              className="bg-black/50 items-center justify-center"
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20,
                zIndex: 10 
              }}
            >
              <Heart 
                size={20} 
                color={isSaved ? "#F04438" : "white"} 
                fill={isSaved ? "#F04438" : "transparent"} 
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View className="px-1">
        <Text className="font-inter-semibold text-[16px] text-[#101828] mb-1">{property.price}</Text>
      <Text className="font-inter-semibold text-[14px] text-[#101828] mb-0.5">{property.name}</Text>
      <Text className="font-inter-regular text-[12px] text-[#6A7282]">{property.developer}</Text>
      <Text className="font-inter-regular text-[12px] text-[#6A7282] mb-2">{property.location}</Text>
        
        <View className="pt-2 border-b border-[#E4E7EC] mb-4">
          <Text className="font-inter-regular text-[12px] text-[#6A7282] pb-3">{property.details}</Text>
        </View>



        {/* Actions */}
        <View className="flex-row gap-2.5">
          <TouchableOpacity className="w-10 h-10 bg-[#008E960D] border border-[#E4E7EC] rounded-[12px] items-center justify-center">
            <MessageSquare size={20} color="#008E96" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 bg-[#25D36614] border border-[#E4E7EC] rounded-[12px] items-center justify-center">
            <Phone size={20} color="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-1">
            <LinearGradient
              colors={['#008E96', '#1CB2A9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
                style={{
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 22,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Phone size={16} color="white" />
              <Text className="text-white font-inter-semibold text-[13px] leading-[18px]">Contact</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      {toast && (
        <View 
          style={{
            position: 'absolute',
            bottom: 60,
            left: 20,
            right: 20,
            backgroundColor: '#1E293B',
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 25,
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
          <Text style={{ color: 'white', fontFamily: 'Inter-Medium', fontSize: 13, textAlign: 'center' }}>
            {toast}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PerfectMatchCard;
