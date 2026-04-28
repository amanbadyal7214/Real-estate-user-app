import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ExploreLocalities = () => {
  const router = useRouter();

  const localities = [
    { id: 1, name: 'Kharar', price: '6.2k/sq.ft.', growth: '12.68%', location: 'Greater Mohali' },
    { id: 2, name: 'Zirakpur', price: '7.5k/sq.ft.', growth: '15.20%', location: 'Chandigarh South' },
    { id: 3, name: 'Aerocity', price: '9.8k/sq.ft.', growth: '18.45%', location: 'Mohali' },
    { id: 4, name: 'New Chandigarh', price: '8.1k/sq.ft.', growth: '10.30%', location: 'Mullanpur' },
    { id: 5, name: 'Sector 82', price: '11.2k/sq.ft.', growth: '14.12%', location: 'IT City' },
  ];

  const LocalityCard = ({ item, isHotspot = false }) => (
    <TouchableOpacity 
      activeOpacity={0.9}
      className="bg-white rounded-[16px] overflow-hidden mb-[16px]"
      style={{ 
        width: isHotspot ? '100%' : 240,
        marginRight: isHotspot ? 0 : 12,
        shadowColor: "#008E96",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#F2F4F7'
      }}
    >
      {/* Visual Header */}
      <LinearGradient
        colors={['#F9FAFB', '#F2F4F7']}
        className="h-[64px] justify-center px-[12px] relative overflow-hidden"
      >
        <View style={{ position: 'absolute', right: -10, top: -10, opacity: 0.05 }}>
            <MaterialCommunityIcons name="city-variant-outline" size={80} color="#008E96" />
        </View>
        <Text className="text-[#101828] font-inter-bold text-[16px] tracking-tight">{item.name}</Text>
        <Text className="text-[#667085] font-inter-regular text-[11px]">{item.location}</Text>
      </LinearGradient>
      
      {/* Content Section */}
      <View className="px-[12px] py-[12px]">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[#98A2B3] font-inter-medium text-[10px] uppercase tracking-wider mb-[2px]">Avg. Price</Text>
            <View className="flex-row items-center">
              <View className="bg-[#F0F9F9] w-[20px] h-[20px] rounded-full items-center justify-center mr-[6px]">
                <FontAwesome5 name="rupee-sign" size={8} color="#008E96" />
              </View>
              <Text className="text-[#101828] font-inter-semibold text-[14px]">{item.price}</Text>
            </View>
          </View>

          <View className="items-end">
            <Text className="text-[#98A2B3] font-inter-medium text-[10px] uppercase tracking-wider mb-[2px]">Growth</Text>
            <View className="bg-[#ECFDF3] px-[8px] py-[2px] rounded-full flex-row items-center">
              <Ionicons name="trending-up" size={12} color="#027A48" />
              <Text className="text-[#027A48] font-inter-bold text-[11px] ml-[2px]">+{item.growth}</Text>
            </View>
          </View>
        </View>
        
        {/* Progress Bar Gauge */}
        <View className="mt-[12px] h-[4px] bg-[#F2F4F7] rounded-full overflow-hidden">
            <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#008E96', '#00C2CB']}
                style={{ width: '75%', height: '100%', borderRadius: 2}}
            />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView 
      className="flex-1 bg-[#F9FBFC]"
    >
      <StatusBar barStyle="light-content" />
      
      {/* Modern Gradient Header */}
      <LinearGradient
        colors={['#008E96', '#007A82']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        className="px-[20px] rounded-b-[24px] justify-center pt-[15px] pb-[20px]"
      >
        <View className="flex-row items-center justify-between">
            <TouchableOpacity 
            onPress={() => router.back()}
            className="w-[36px] h-[36px] bg-white/20 rounded-full items-center justify-center"
            >
            <Ionicons name="chevron-back" size={20} color="white" />
            </TouchableOpacity>
            
            <View className="items-center flex-1 pt-2 pr-[36px]">
                <Text className="text-white font-inter-bold text-[16px]">Explore Localities</Text>
                <Text className="text-white/80 font-inter-regular text-[11px]">Premium Investment Zones</Text>
            </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mt-[-15px]">
        {/* Popular Section */}
        <View className="pt-[10px]">
          <View className="flex-row items-center justify-between px-[20px] mb-[12px]">
            <View>
                <Text className="text-[#101828] font-inter-bold text-[18px]">Popular Areas</Text>
                <View className="h-[2px] w-[24px] bg-[#008E96] mt-[2px] rounded-full" />
            </View>
            <TouchableOpacity>
                <Text className="text-[#008E96] font-inter-semibold text-[13px]">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 4, paddingBottom: 8 }}
            showsHorizontalScrollIndicator={false} 
          >
            {localities.map((item) => (
              <LocalityCard key={`popular-${item.id}`} item={item} />
            ))}
          </ScrollView>
        </View>

        {/* Investment Hotspot Section */}
        <View className="mt-[24px] px-[20px] mb-[40px]">
          <View className="mb-[16px]">
            <Text className="text-[#101828] font-inter-bold text-[18px]">Investment Hotspots</Text>
            <Text className="text-[#667085] font-inter-regular text-[12px] mt-[2px]">Top performing localities this month</Text>
          </View>
          
          {localities.slice(0, 3).map((item) => (
            <LocalityCard key={`hotspot-${item.id}`} item={item} isHotspot={true} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExploreLocalities;