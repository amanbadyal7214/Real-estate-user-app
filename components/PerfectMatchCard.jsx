import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Camera, Heart, MessageSquare, Phone } from 'lucide-react-native';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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

  const IMG_WIDTH = wp('45.3%');
  const IMG_HEIGHT = hp('18.5%');
  const IMG_GAP = wp('2.7%');
  const SNAP_INTERVAL = IMG_WIDTH + IMG_GAP;

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={onPress || navigateToDetails}
      className="bg-white"
      style={{ 
        borderRadius: wp('4.3%'),
        marginBottom: hp('3%'),
        padding: wp('3.2%'),
        borderWidth: 0.667,
        borderColor: '#F3F4F6',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: hp('0.5%') }, 
        shadowOpacity: 0.06, 
        shadowRadius: wp('4.3%'), 
        elevation: 3 
      }}
    >
      {/* Image Section */}
      <View className="mb-3 relative">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          decelerationRate="fast"
          snapToInterval={SNAP_INTERVAL}
          snapToAlignment="start"
          contentContainerStyle={{ gap: IMG_GAP, paddingRight: wp('5.3%') }}
        >
          {property.images?.map((img, index) => (
            <View 
              key={index} 
              className="overflow-hidden"
              style={{ width: IMG_WIDTH, height: IMG_HEIGHT, borderRadius: wp('3.7%') }}
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
        <View 
          className="absolute flex-row" 
          style={{ top: hp('1%'), left: wp('2.1%'), gap: wp('1.5%') }}
          pointerEvents="none"
        >
          {property.zeroBrokerage && (
            <View 
              className="bg-black/65"
              style={{
                paddingHorizontal: wp('3%'),
                paddingVertical: hp('0.5%'),
                borderRadius: wp('2.1%'),
              }}
            >
              <Text className="text-white font-semibold" style={{ fontSize: wp('3.2%') }}>Zero Brokerage</Text>
            </View>
          )}
          {property.isRera && (
            <View 
              className="bg-[#22C55EE6] flex-row items-center"
              style={{
                paddingHorizontal: wp('3%'),
                paddingVertical: hp('0.5%'),
                borderRadius: wp('2.1%'),
                gap: wp('1%'),
              }}
            >
              <View 
                className="rounded-full bg-white"
                style={{ width: wp('1.5%'), height: wp('1.5%') }}
              />
              <Text className="text-white font-bold" style={{ fontSize: wp('2.9%') }}>RERA</Text>
            </View>
          )}
        </View>

        {/* Photo Count Bottom Left */}
        <View 
          className="absolute bg-black/65 flex-row items-center"
          style={{
            bottom: hp('1%'),
            left: wp('2.1%'),
            paddingHorizontal: wp('2%'),
            paddingVertical: hp('0.5%'),
            borderRadius: wp('2.1%'),
            gap: wp('1%'),
          }}
          pointerEvents="none"
        >
          <Camera size={wp('3.7%')} color="white" />
          <Text className="text-white font-semibold" style={{ fontSize: wp('3.2%') }}>{property.images?.length || 0}</Text>
        </View>

        {/* Heart Button Right */}
        {showWishlist && (
          <View className="absolute" style={{ right: wp('2.1%'), top: hp('1%') }}>
            <TouchableOpacity 
              onPress={toggleWishlist}
              className="bg-black/50 items-center justify-center"
              style={{ 
                width: wp('9.6%'), 
                height: wp('9.6%'), 
                borderRadius: wp('4.8%'),
                zIndex: 10 
              }}
            >
              <Heart 
                size={wp('5.3%')} 
                color={isSaved ? "#F04438" : "white"} 
                fill={isSaved ? "#F04438" : "transparent"} 
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={{ paddingHorizontal: wp('1%') }}>
        <Text 
          className="font-semibold text-[#101828]" 
          style={{ fontSize: wp('4.3%'), marginBottom: hp('0.5%') }}
        >{property.price}</Text>
        <Text 
          className="font-semibold text-[#101828]"
          style={{ fontSize: wp('3.7%'), marginBottom: hp('0.2%') }}
        >{property.name}</Text>
        <Text 
          className="font-normal text-[#6A7282]"
          style={{ fontSize: wp('3.2%') }}
        >{property.developer}</Text>
        <Text 
          className="font-normal text-[#6A7282]"
          style={{ fontSize: wp('3.2%'), marginBottom: hp('1%') }}
        >{property.location}</Text>
        
        <View 
          className="border-b border-[#E4E7EC]"
          style={{ paddingTop: hp('1%'), marginBottom: hp('2%') }}
        >
          <Text 
            className="font-normal text-[#6A7282]" 
            style={{ fontSize: wp('3.2%'), paddingBottom: hp('1.5%') }}
          >{property.details}</Text>
        </View>

        {/* Actions */}
        <View className="flex-row" style={{ gap: wp('2.7%') }}>
          <TouchableOpacity 
            className="bg-[#008E960D] border border-[#E4E7EC] items-center justify-center"
            style={{ width: wp('10.7%'), height: wp('10.7%'), borderRadius: wp('3.2%') }}
          >
            <MessageSquare size={wp('5.3%')} color="#008E96" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-[#25D36614] border border-[#E4E7EC] items-center justify-center"
            style={{ width: wp('10.7%'), height: wp('10.7%'), borderRadius: wp('3.2%') }}
          >
            <Phone size={wp('5.3%')} color="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-1">
            <LinearGradient
              colors={['#008E96', '#1CB2A9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: wp('3.2%'),
                paddingVertical: hp('1.4%'),
                paddingHorizontal: wp('5.8%'),
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: wp('1.6%'),
              }}
            >
              <Phone size={wp('4.3%')} color="white" />
              <Text 
                className="text-white font-semibold"
                style={{ fontSize: wp('3.5%'), lineHeight: hp('2.4%') }}
              >Contact</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      {toast && (
        <View 
          style={{
            position: 'absolute',
            bottom: hp('7.5%'),
            left: wp('5.3%'),
            right: wp('5.3%'),
            backgroundColor: '#1E293B',
            paddingVertical: hp('1.2%'),
            paddingHorizontal: wp('4.3%'),
            borderRadius: wp('6.7%'),
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: hp('0.2%') },
            shadowOpacity: 0.25,
            shadowRadius: wp('1%'),
            elevation: 5,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '500', fontSize: wp('3.5%'), textAlign: 'center' }}>
            {toast}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PerfectMatchCard;
