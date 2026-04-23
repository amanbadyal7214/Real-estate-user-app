import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronDown, ChevronRight, Search, User } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryTabs from '../../../components/CategoryTabs';
import ContinueCards from '../../../components/ContinueCards';
import PropertyMatchedCards from '../../../components/PropertyMatchedCards';
import Spotlight from '../../../components/Spotlight';

const Buy = () => {
  const recentSearches = [
    { title: 'Commercial, Buy, Mohali,', subtitle: 'Any price, Any area' },
    { title: 'Buy, Sector 62', subtitle: 'Any price' },
    { title: 'Apartment, Rent, Zirakpur', subtitle: 'Min ₹15K, 2+ BHK' },
    { title: 'Plot, Buy, Kharar', subtitle: '100-150 sq.yd' },
  ];

  const matchedHomes = [
    {
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
      tag: 'TALLEST LANDMARK',
      developer: 'NIRWANA GROUP',
      title: 'D-Xperanza',
      location: 'Sector 82, Mohali',
      priceRange: '1.24 Cr. - 1.55 Cr',
    },
    {
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
      tag: 'LUXURY LIVING',
      developer: 'SKY HEIGHTS',
      title: 'Sky Terrace',
      location: 'Sector 66, Mohali',
      priceRange: '2.5 Cr. - 4.2 Cr',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center gap-2">
          <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
            <User color="white" size={20} />
          </View>
          <View className="flex-row items-center">
            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[18px] text-[#101828]">Hi Prerna!</Text>
            <ChevronDown size={18} color="#101828" className="ml-1" />
          </View>
        </View>
        <TouchableOpacity className="flex-row items-center bg-[#F2F4F7] px-4 py-2 rounded-full h-10">
          <Text className="font-inter-medium text-[13px] text-[#101828] mr-2">Post Property</Text>
          <View className="bg-primary px-1.5 py-0.5 rounded-md">
            <Text className="font-inter-bold text-[9px] text-white">FREE</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Main Category Blue Container */}
        <View className="mx-4 mt-2 p-4 rounded-[32px] bg-[#E6F4F5]">
          <CategoryTabs 
            activeTab="Buy" 
            onTabPress={(tabId) => {
              if (tabId !== 'Buy') {
                router.push(`/screens/Buy/${tabId}`);
              }
            }} 
          />

          {/* Search Box inside container */}
          <View className="bg-white p-5 rounded-[24px]">
            <View className="flex-row items-center justify-between mb-4">
              <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[16px] text-[#101828]">
                Searching in <Text className="font-inter-bold">Mohali</Text>
              </Text>
              <ChevronDown size={20} color="#667085" />
            </View>
            
            <TouchableOpacity 
              onPress={() => router.push('/screens/Buy/BuySearch')}
              className="flex-row items-center bg-[#F2F4F7] h-12 px-4 rounded-full"
            >
              <Text className="font-inter-regular flex-1 text-[#667085] text-[14px]">
                Search city, locality, landmark ...
              </Text>
              <View className="w-9 h-9 bg-primary rounded-full items-center justify-center">
                <Search size={18} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Continue where you left Section */}
        <ContinueCards data={recentSearches} />

        {/* Locality Banner */}
        <View className="mx-4 mt-6 p-4 rounded-2xl bg-[#F0FBFA] flex-row items-center justify-between">
          <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[14px] text-[#344054]">Not sure about locality?</Text>
          <TouchableOpacity className="flex-row items-center">
            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[14px] text-[#101828] underline mr-1">Explore options</Text>
            <ChevronRight size={16} color="#101828" />
          </TouchableOpacity>
        </View>

        {/* Matches Section */}
        <View className="px-4 mt-8 mb-10">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-inter-bold text-[18px] text-[#101828]">Perfectly matched home...</Text>
            <TouchableOpacity>
              <Text className="font-inter-medium text-[14px] text-primary">View more</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[14px] text-[#667085] mb-4">Projects from the best developers</Text>

          <PropertyMatchedCards data={matchedHomes} />
          <Spotlight />
        </View>

        {/* Popular on Propertize Section */}
        <View className="px-4 mb-20">
          {/* Section Header */}
          <View className="flex-row items-center gap-2 mb-4">
            <Text className="text-[#FB2C36] text-[20px]">⭐</Text>
            <Text className="font-inter-bold text-[17px] text-[#101828]">Popular on Propertize</Text>
          </View>

          {/* Tools Grid Card */}
          <View 
            className="bg-white rounded-[24px] w-full min-h-[221.5px] p-4 pt-10 shadow-sm mb-6"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 4
            }}
          >
            <View className="flex-row justify-around mb-8">
              <TouchableOpacity className="items-center w-[100px]">
                <View className="w-12 h-12 bg-[#DBEAEB]/45 rounded-[14px] items-center justify-center mb-2">
                  <Ionicons name="bulb-outline" size={24} color="#008E96" />
                </View>
                <Text className="font-inter-medium text-[12px] text-[#364153] text-center leading-[18px]">Suggestions</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center w-[100px]">
                <View className="w-12 h-12 bg-[#DBEAEB]/45 rounded-[14px] items-center justify-center mb-2">
                  <Ionicons name="pricetag-outline" size={24} color="#008E96" />
                </View>
                <Text className="font-inter-medium text-[12px] text-[#364153] text-center leading-[18px]">Deals</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center w-[100px]">
                <View className="w-12 h-12 bg-[#DBEAEB]/45 rounded-[14px] items-center justify-center mb-2">
                  <Ionicons name="newspaper-outline" size={24} color="#008E96" />
                </View>
                <Text className="font-inter-medium text-[12px] text-[#364153] text-center leading-[18px]">News</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-around">
              <TouchableOpacity className="items-center w-[100px]">
                <View className="w-12 h-12 bg-[#DBEAEB]/45 rounded-[14px] items-center justify-center mb-2">
                  <Ionicons name="calculator-outline" size={24} color="#008E96" />
                </View>
                <Text className="font-inter-medium text-[11px] text-[#364153] text-center leading-[14px]">EMI Calculator</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center w-[100px]">
                <View className="w-12 h-12 bg-[#DBEAEB]/45 rounded-[14px] items-center justify-center mb-2">
                  <Ionicons name="stats-chart-outline" size={24} color="#008E96" />
                </View>
                <Text className="font-inter-medium text-[11px] text-[#364153] text-center leading-[14px]">Affordability Calculator</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center w-[100px]">
                <View className="w-12 h-12 bg-[#DBEAEB]/45 rounded-[14px] items-center justify-center mb-2">
                  <Ionicons name="checkmark-done-circle-outline" size={24} color="#008E96" />
                </View>
                <Text className="font-inter-medium text-[11px] text-[#364153] text-center leading-[14px]">Eligibility Calculator</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Property Owner Banner */}
          <LinearGradient
            colors={['#DAEAEB', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className=" p-4 rounded-2xl overflow-hidden border-[#1CB2A9] flex-row items-center justify-between"
            style={{
              height: 150.33,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <View className="flex-1 pr-2" style={{ height: 117, gap: 12 }}>
              <Text 
                className="font-inter-bold text-[14px] text-[#101828] leading-[21px]"
                style={{ width: 193, height: 63 }}
              >
                Are you a property owner looking to rent/sell?
              </Text>
              
              <View style={{ gap: 6 }}>
                <View className="flex-row items-center" style={{ gap: 8 }}>
                  <View className="w-4 h-4 bg-[#008E96] rounded-full items-center justify-center">
                    <MaterialCommunityIcons name="check" size={10} color="white" />
                  </View>
                  <Text className="font-inter-regular text-[12px] text-[#364153] leading-[18px]">Free Brokerage</Text>
                </View>

                <View className="flex-row items-center" style={{ gap: 8 }}>
                  <View className="w-4 h-4 bg-[#008E96] rounded-full items-center justify-center">
                    <MaterialCommunityIcons name="check" size={10} color="white" />
                  </View>
                  <Text className="font-inter-regular text-[12px] text-[#364153] leading-[18px]">Genuine, verified leads</Text>
                </View>
              </View>
            </View>

            {/* Detailed Grid Pattern Icon */}
            <View style={{ width: 96, height: 96, justifyContent: 'center', alignItems: 'center' }}>
              <LinearGradient
                colors={['#8B5CF6', '#6366F1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: 12, 
                  borderTopLeftRadius: 12,
                  borderBottomLeftRadius: 12,
                  borderTopRightRadius: 4,
                  borderBottomRightRadius: 4,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <View className="flex-row flex-wrap justify-center items-center" style={{ width: 60, height: 60, gap: 4 }}>
                  {[...Array(20)].map((_, i) => (
                    <View 
                      key={i} 
                      style={{ 
                        width: 8, 
                        height: 8, 
                        backgroundColor: '#FFFFFF', 
                        opacity: 0.6,
                        borderRadius: 1 
                      }} 
                    />
                  ))}
                </View>
              </LinearGradient>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Buy;
