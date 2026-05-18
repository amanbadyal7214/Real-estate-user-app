import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Heart, MessageSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const BHKCard = ({ config, area, price }) => {
  return (
    <View className="w-[120px] h-[128px] p-3 rounded-xl border border-[#E4E7EC] bg-white mr-3">
      <Text className="font-inter-bold text-[14px] text-[#101828] leading-[18px]">{config}</Text>
      <View className="mt-1.5">
        <Text className="font-inter-medium text-[12px] text-[#6A7282] leading-[15px]">Super Builtup Area</Text>
        <Text className="font-inter-regular text-[13px] text-[#4A5565] leading-[16px]">{area}</Text>
      </View>
      <Text className="font-inter-bold text-[14px] text-[#101828] leading-[18px] mt-1.5">{price}</Text>
    </View>
  );
};

const PropertyCard = ({ property }) => {
  const router = useRouter();
  if (!property) return null;

  const navigateToDetails = () => {
    router.push({
      pathname: '/screens/PropertyDetails',
      params: { propertyId: property._id || property.id }
    });
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={navigateToDetails}
      className="bg-white rounded-2xl p-3.5 mb-5 self-center w-full border-2 border-primary"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
      }}
    >
      {/* Image Section */}
      <View className="relative h-[190px] rounded-[14px] overflow-hidden">
        <Image 
          source={{ uri: property.image }} 
          className="w-full h-full"
          resizeMode="cover"
        />
        
        {/* RERA Badge */}
        {property.reraCertified && (
          <View className="absolute left-3 top-3 bg-primary rounded-lg flex-row items-center px-2.5 py-1 gap-1.5">
            <View className="w-3.5 h-3.5 bg-white rounded-full items-center justify-center">
              <View className="w-2 h-2 bg-primary rounded-full" />
            </View>
            <Text className="text-white text-[11px] font-inter-bold tracking-widest">RERA</Text>
          </View>
        )}

        {/* Favorite Button */}
        <TouchableOpacity className="absolute right-3 top-3 w-9 h-9 bg-white/90 rounded-full items-center justify-center">
          <Heart size={20} color="#4A5565" />
        </TouchableOpacity>

        {/* Image Count & Indicator */}
        <View className="absolute left-3 bottom-3 bg-black/60 rounded-lg flex-row items-center px-2.5 py-1 gap-1.5">
          <Text className="text-white text-[12px] font-inter-medium">1/{property.imageCount}</Text>
          <View className="flex-row gap-1">
            <View className="w-1 h-1 bg-white rounded-full" />
            <View className="w-1 h-1 bg-white/40 rounded-full" />
            <View className="w-1 h-1 bg-white/40 rounded-full" />
          </View>
        </View>
      </View>

      {/* Property Details */}
      <View className="mt-3">
        <Text className="text-[12px] text-[#6A7282] font-inter-regular leading-[15px]">
          Possession by {property.possessionDate} • Avg. rate/sq.ft. {property.avgRate}
        </Text>
        <Text className="text-[23px] font-inter-bold text-[#101828] leading-[29px] mt-2">
          {property.projectName}
        </Text>
        <Text className="text-[14px] text-[#4A5565] font-inter-regular leading-[18px] mt-1">
          {property.location}
        </Text>
        <Text className="text-[18px] font-inter-bold text-[#101828] leading-[22px] mt-2">
          {property.priceRange}
        </Text>
        <Text className="text-[13px] text-[#4A5565] font-inter-regular leading-[16px] mt-2">
          {property.bhkFlats}
        </Text>

        {/* BHK Configuration Cards */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mt-3"
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {property.configurations?.map((config, index) => (
            <BHKCard 
              key={index}
              config={config.type} 
              area={config.area} 
              price={config.price} 
            />
          ))}
        </ScrollView>

        {/* Action Buttons */}
        <View className="flex-row mt-4 gap-3">
          <TouchableOpacity className="flex-1 h-12 flex-row justify-center items-center bg-primary/10 rounded-xl gap-2">
            <MessageSquare size={20} color="#008E96" />
            <Text className="text-[14px] font-inter-medium text-primary">Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 h-12 justify-center items-center bg-primary rounded-xl" style={{ elevation: 2 }}>
            <Text className="text-[14px] font-inter-medium text-white">Contact Seller</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PropertyCard;
