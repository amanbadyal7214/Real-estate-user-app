import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Dimensions, Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { formatPrice } from '../app/utils/formatPrice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PropertyListingCard = ({ data }) => {
  const router = useRouter();
  if (!data) return null;

  const navigateToDetails = () => {
    router.push({
      pathname: '/screens/PropertyDetails',
      params: { propertyId: data._id }
    });
  };

  // use shared formatPrice

  const formatDate = (dateString) => {
    if (!dateString) return "Immediate";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
  };

  const handleCall = () => {
    if (data.user?.phone) {
      Linking.openURL(`tel:${data.user.phone}`);
    }
  };

  const handleWhatsApp = () => {
    if (data.user?.phone) {
      const text = encodeURIComponent(`Hi ${data.user.name}, I saw your listing "${data.title}" on the app and I'm interested. Can you provide more details?`);
      Linking.openURL(`whatsapp://send?phone=${data.user.phone}&text=${text}`);
    }
  };

  const defaultImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000';
  const images = data.images?.length > 0 ? data.images : [defaultImage];

  // Helper to map amenity names to icons
  const getAmenityIcon = (name) => {
    switch (name?.toLowerCase()) {
      case 'gym': return <MaterialCommunityIcons name="dumbbell" size={14} color="#667085" />;
      case 'swimming_pool': return <MaterialIcons name="pool" size={14} color="#667085" />;
      case 'parking': return <MaterialIcons name="local-parking" size={14} color="#667085" />;
      case 'security': return <MaterialCommunityIcons name="shield-check" size={14} color="#667085" />;
      case 'ac': return <MaterialCommunityIcons name="air-conditioner" size={14} color="#667085" />;
      case 'wardrobe': return <MaterialCommunityIcons name="wardrobe" size={14} color="#667085" />;
      default: return <Ionicons name="apps-outline" size={14} color="#667085" />;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={navigateToDetails}
      className="bg-white rounded-[20px] overflow-hidden mb-[23px] border border-[#EAECF0]"
      style={{
        shadowColor: '#101828',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3
      }}
    >
      {/* Image Carousel Section */}
      <View className="relative h-[200px]">
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          className="w-full h-full"
        >
          {images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img }}
              className="h-full"
              style={{ width: SCREEN_WIDTH - 32 }} // Subtracting horizontal padding of container
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Badges Overlay */}
        <View className="absolute top-[12px] left-[12px] flex-row gap-[8px]">
          <View className="bg-black/50 backdrop-blur-md px-[10px] py-[5px] rounded-[8px] flex-row items-center border border-white/20">
            <View className="w-[6px] h-[6px] bg-[#34D399] rounded-full mr-[6px]" />
            <Text className="text-white font-semibold text-[11px] uppercase tracking-[0.4px]">Seen</Text>
          </View>
        </View>

        <TouchableOpacity className="absolute top-[12px] right-[12px] w-[36px] h-[36px] bg-black/40 backdrop-blur-md rounded-full items-center justify-center border border-white/20">
          <Ionicons name="heart-outline" size={20} color="white" />
        </TouchableOpacity>

        <View className="absolute bottom-[12px] left-[12px] bg-black/60 px-[10px] py-[5px] rounded-[8px] border border-white/10">
          <Text className="text-white font-medium text-[11px]">1/{images.length} Photos</Text>
        </View>

        <View className="absolute bottom-[12px] right-[12px] bg-white px-[10px] py-[5px] rounded-[8px] flex-row items-center shadow-sm">
          <Ionicons name="flash" size={12} color="#F59E0B" />
          <Text className="text-[#101828] font-bold text-[10px] ml-[4px]">ZERO BROKERAGE</Text>
        </View>
      </View>

      {/* Content Section */}
      <View className="p-[16px]">
        <View className="flex-row justify-between items-start">
          <View style={{ flex: 1 }}>
            <Text className="text-[#101828] font-bold text-[22px] tracking-[-0.5px]">
              {formatPrice(data.price)}
            </Text>
            <Text className="text-[#101828] font-semibold text-[16px] mt-[4px]" numberOfLines={1}>
              {data.title}
            </Text>
          </View>
          <View className="bg-[#F9FAFB] px-[10px] py-[6px] rounded-[8px] border border-[#EAECF0]">
            <Text className="text-[#344054] font-semibold text-[12px] uppercase">
              {data.lookingFor?.label || 'Sale'}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mt-[8px]">
          <Ionicons name="location-sharp" size={14} color="#008E96" />
          <Text className="text-[#667085] font-normal text-[13px] ml-[4px]">
            {data.projectName}, {data.city?.name}
          </Text>
        </View>

        <View className="flex-row items-center mt-[8px] gap-[12px]">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={14} color="#667085" />
            <Text className="text-[#667085] font-normal text-[12px] ml-[4px]">
              Available From: {formatDate(data.availableFrom)}
            </Text>
          </View>
        </View>

        {/* Amenities Row */}
        <View className="flex-row items-center flex-wrap mt-[12px] gap-[12px]">
          <View className="flex-row items-center bg-[#F2F4F7] px-[8px] py-[4px] rounded-[6px]">
            <Ionicons name="cube-outline" size={14} color="#475467" />
            <Text className="text-[#475467] font-medium text-[12px] ml-[4px]">{data.area} sqft</Text>
          </View>
          {data.amenities?.slice(0, 3).map((item, idx) => (
            <View key={idx} className="flex-row items-center bg-[#F2F4F7] px-[8px] py-[4px] rounded-[6px]">
              {getAmenityIcon(item.amenity?.name)}
              <Text className="text-[#475467] font-medium text-[12px] ml-[4px]">
                {item.count > 1 ? item.count : ''} {item.amenity?.name.replace('_', ' ')}
              </Text>
            </View>
          ))}
        </View>

        <View className="h-[1px] bg-[#F2F4F7] my-[16px]" />

        {/* Footer */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center flex-1">
            <View className="relative">
              <LinearGradient
                colors={['#008E96', '#1CB2A9']}
                className="w-[40px] h-[40px] rounded-full items-center justify-center opacity-90"
              >
                <Text className="text-white font-bold text-[15px]">
                  {(data.user?.name || 'A').charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
              <View className="absolute bottom-0 right-0 w-[12px] h-[12px] bg-[#34D399] border-2 border-white rounded-full" />
            </View>
            <View className="ml-[10px] flex-1">
              <Text className="text-[#101828] font-semibold text-[14px]">{data.user?.name || 'Partner'}</Text>
              <Text className="text-[#667085] font-normal text-[11px]">Certified Partner</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-[10px]">
            <TouchableOpacity
              onPress={handleWhatsApp}
              className="w-[42px] h-[42px] bg-[#25D366]/10 rounded-[12px] items-center justify-center border border-[#25D366]/20"
            >
              <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCall}
              className="flex-row items-center bg-[#008E96] px-[16px] py-[10px] rounded-[12px] gap-[8px]"
              style={{
                shadowColor: '#008E96',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
              }}
            >
              <Ionicons name="call" size={18} color="white" />
              <Text className="text-white font-bold text-[14px]">Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PropertyListingCard;
