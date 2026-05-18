import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Heart, CheckCircle2, MessageSquare, Phone } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { PRIMARY_COLOR } from "../app/constants/theme.js";

const PerfectMatchCard = ({ property }) => {
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
      onPress={navigateToDetails}
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
      <View className="mb-4 relative">
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
              style={{ width: 203, height: 189 }}
            >
              <Image 
                source={{ uri: img }} 
                className="w-full h-full" 
                resizeMode="cover" 
              />
            </View>
          ))}
        </ScrollView>
        
        {/* Overlays (Badges and Heart) */}
        <View className="absolute inset-0 pointer-events-none" style={{ width: 318, height: 189 }}>
          {/* Badges Left */}
          <View className="absolute top-2 left-2 flex-row gap-1.5">
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
          <View className="absolute bottom-2 left-2 bg-black/65 px-2.5 py-1 rounded-[8px] flex-row items-center gap-1.5">
            <Camera size={14} color="white" />
            <Text className="text-white font-inter-semibold text-[13px]">{property.images?.length || 0}</Text>
          </View>

          {/* Heart Button Right */}
          <View className="absolute pointer-events-auto" style={{ right: 0, top: 0.333 }}>
            <TouchableOpacity 
              className="bg-black/50 items-center justify-center"
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 22369600,
                zIndex: 10 
              }}
            >
              <Heart size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View className="px-1">
        <Text className="font-inter-semibold text-[20px] text-[#101828] mb-1">{property.price}</Text>
        <Text className="font-inter-semibold text-[17px] text-[#101828] mb-0.5">{property.name}</Text>
        <Text className="font-inter-regular text-[13px] text-[#6A7282]">{property.developer}</Text>
        <Text className="font-inter-regular text-[13px] text-[#6A7282] mb-2">{property.location}</Text>
        
        <View className="pt-2 border-b border-[#E4E7EC] mb-4">
          <Text className="font-inter-regular text-[13px] text-[#6A7282] pb-3">{property.details}</Text>
        </View>



        {/* Actions */}
        <View className="flex-row gap-2.5">
          <TouchableOpacity className="w-12 h-12 bg-[#008E960D] border border-[#E4E7EC] rounded-[14px] items-center justify-center">
            <MessageSquare size={20} color="#008E96" />
          </TouchableOpacity>
          <TouchableOpacity className="w-12 h-12 bg-[#25D36614] border border-[#E4E7EC] rounded-[14px] items-center justify-center">
            <Phone size={20} color="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-1">
            <LinearGradient
              colors={['#008E96', '#1CB2A9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 14,
                paddingTop: 10.417,
                paddingBottom: 14.583,
                paddingLeft: 58.292,
                paddingRight: 55.042,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-end',
                gap: 5
              }}
            >
              <Phone size={16} color="white" />
              <Text className="text-white font-inter-semibold text-[15px] leading-[22px]">Contact</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PerfectMatchCard;
