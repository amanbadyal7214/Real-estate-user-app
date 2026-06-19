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
        marginRight: wp('4.3%'),
        marginBottom: hp('1%'),
        borderRadius: wp('3.7%'),
        borderWidth: 0.67,
        padding: wp('2.7%'),
        width: wp('48%'),
        height: hp('40.6%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <View className="w-full overflow-hidden relative" style={{ height: hp('15.8%'), borderRadius: wp('3.2%') }}>
        <Image 
          source={{ uri: image }} 
          className="w-full h-full"
          resizeMode="cover"
        />
        {/* RERA Badge */}
        {isRera && (
          <View className="absolute bg-[#008E96] flex-row items-center" style={{ left: wp('2.1%'), top: hp('1%'), borderRadius: wp('2%'), paddingVertical: hp('0.5%'), paddingHorizontal: wp('2.1%'), gap: wp('1%') }}>
            <Check size={wp('3.2%')} color="#FFFFFF" strokeWidth={3} />
            <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('2.9%'), lineHeight: hp('2%') }} className="text-white">RERA</Text>
          </View>
        )}
        <TouchableOpacity 
          onPress={toggleWishlist}
          className="absolute bg-white/90 rounded-full items-center justify-center"
          style={{ right: wp('2.1%'), top: hp('1%'), width: wp('8.5%'), height: wp('8.5%') }}
        >
          <Heart 
            size={wp('4.8%')} 
            color={isSaved ? "#F04438" : "#4A5565"} 
            fill={isSaved ? "#F04438" : "transparent"} 
            strokeWidth={2} 
          />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: hp('0.7%') }}>
        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.2%'), lineHeight: hp('2.2%'), marginBottom: hp('0.5%') }} className="text-[#6A7282]">
          {possession}
        </Text>
        <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('4.3%'), lineHeight: hp('3%'), marginBottom: hp('0.2%') }} className="text-[#101828]" numberOfLines={1}>
          {title}
        </Text>
        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.5%'), lineHeight: hp('2.5%'), marginBottom: hp('0.5%') }} className="text-[#6A7282]">
          {location}
        </Text>
        <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('4%'), lineHeight: hp('2.7%'), marginBottom: hp('0.2%') }} className="text-[#101828]">
          {price}
        </Text>
        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.5%'), lineHeight: hp('2.5%'), marginBottom: hp('0.2%') }} className="text-[#6A7282]">
          {bhk}
        </Text>
        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.5%'), lineHeight: hp('2.5%'), marginBottom: hp('1%') }} className="text-[#6A7282]">
          {area}
        </Text>

        <View className="flex-row items-center w-full" style={{ gap: wp('2.1%'), height: hp('4.9%') }}>
          <TouchableOpacity 
            className="bg-[#25D366]/10 rounded-full items-center justify-center"
            style={{ width: wp('10.7%'), height: wp('10.7%') }}
          >
            <MessageCircle size={wp('5.3%')} color="#25D366" fill="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 bg-[#008E96]/10 items-center justify-center"
            style={{ height: hp('4.9%'), borderRadius: wp('3.7%') }}
          >
            <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.7%'), lineHeight: hp('2.6%') }} className="text-[#008E96] text-center">
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
          <Text style={{ color: 'white', fontFamily: 'Inter-Medium', fontSize: wp('2.7%'), textAlign: 'center' }}>
            {toast}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default InsightPropertyCard;
