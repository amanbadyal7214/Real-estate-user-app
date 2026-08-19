import { useRouter } from 'expo-router';
import { Check, Heart, MessageCircle } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import api from '../app/api';

const InsightPropertyCard = ({ 
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
      console.error("Error toggling wishlist in InsightPropertyCard:", err);
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
      className="bg-white border-[#E4E7EC]"
      style={{
        marginRight: wp('3.5%'),
        marginBottom: hp('1%'),
        borderRadius: 14,
        borderWidth: 0.67,
        padding: 10,
        width: wp('42%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <View className="w-full overflow-hidden relative bg-gray-100" style={{ height: 115, borderRadius: 10 }}>
        <Image 
          source={{ uri: image }} 
          className="w-full h-full"
          resizeMode="cover"
        />
        {/* RERA Badge */}
        {isRera && (
          <View className="absolute bg-[#008E96] flex-row items-center" style={{ left: 6, top: 6, borderRadius: 4, paddingVertical: 2, paddingHorizontal: 6, gap: 4 }}>
            <Check size={10} color="#FFFFFF" strokeWidth={3} />
            <Text style={{ fontWeight: '500', fontSize: 9 }} className="text-white">RERA</Text>
          </View>
        )}
        <TouchableOpacity 
          onPress={toggleWishlist}
          className="absolute bg-white/90 rounded-full items-center justify-center"
          style={{ right: 6, top: 6, width: 28, height: 28 }}
        >
          <Heart 
            size={16} 
            color={isSaved ? "#F04438" : "#4A5565"} 
            fill={isSaved ? "#F04438" : "transparent"} 
            strokeWidth={2} 
          />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 8 }}>
        <Text style={{ fontWeight: '400', fontSize: 10, marginBottom: 2 }} className="text-[#6A7282]">
          {possession}
        </Text>
        <Text style={{ fontWeight: '600', fontSize: 13, marginBottom: 2 }} className="text-[#101828]" numberOfLines={1}>
          {title}
        </Text>
        <Text style={{ fontWeight: '400', fontSize: 11, marginBottom: 4 }} className="text-[#6A7282]" numberOfLines={1}>
          {location}
        </Text>
        <Text style={{ fontWeight: '600', fontSize: 13, marginBottom: 2 }} className="text-[#101828]">
          {price}
        </Text>
        <Text style={{ fontWeight: '400', fontSize: 11, marginBottom: 2 }} className="text-[#6A7282]">
          {bhk}
        </Text>
        <Text style={{ fontWeight: '400', fontSize: 11, marginBottom: 8 }} className="text-[#6A7282]">
          {area}
        </Text>

        <View className="flex-row items-center w-full" style={{ gap: 6, height: 34 }}>
          <TouchableOpacity 
            className="bg-[#25D366]/10 rounded-full items-center justify-center"
            style={{ width: 34, height: 34 }}
          >
            <MessageCircle size={16} color="#25D366" fill="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 bg-[#008E96]/10 items-center justify-center"
            style={{ height: 34, borderRadius: 8 }}
          >
            <Text style={{ fontWeight: '500', fontSize: 12 }} className="text-[#008E96] text-center">
              View Phone
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {toast && (
        <View 
          style={{
            position: 'absolute',
            bottom: hp('6.2%'),
            left: wp('2.1%'),
            right: wp('2.1%'),
            backgroundColor: '#1E293B',
            paddingVertical: hp('1%'),
            paddingHorizontal: wp('2.1%'),
            borderRadius: wp('4.3%'),
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
          <Text style={{ color: 'white', fontWeight: '500', fontSize: wp('2.7%'), textAlign: 'center' }}>
            {toast}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default InsightPropertyCard;
