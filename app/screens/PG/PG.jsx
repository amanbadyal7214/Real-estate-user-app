import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { DeviceEventEmitter, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ContinueCards from '../../../components/ContinueCards';
import SearchBox from '../../../components/SearchBox';
import UserHeader from '../../../components/UserHeader';
import { getCategoryRoute, useCategoryTab } from '../../context/CategoryTabContext';
import BottomTabBar from '../../navigation/BottomTabBar';
import CategoryTabs from '../../navigation/CategoryTabs';

const PG = () => {
  const { selectedTab, setSelectedTab } = useCategoryTab();
  const skipFirstRedirect = useRef(true);

  useEffect(() => {
    setSelectedTab('PG');
  }, [setSelectedTab]);

  useEffect(() => {
    if (skipFirstRedirect.current) {
      skipFirstRedirect.current = false;
      return;
    }

    if (selectedTab !== 'PG') {
      const targetRoute = getCategoryRoute(selectedTab);
      if (targetRoute) {
        router.replace(targetRoute);
      }
    }
  }, [selectedTab]);

  const recentSearches = [
    { title: 'PG, Mohali, Sector 70', subtitle: 'Single occupancy, Any budget' },
    { title: 'Boys PG, Phase 7, Mohali', subtitle: 'Food included' },
    { title: 'Girls PG, Sector 91, Mohali', subtitle: 'Attached washroom' },
    { title: 'Co-living, Zirakpur', subtitle: 'Near IT park' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <UserHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        scrollEventThrottle={16}
        onScroll={(e) => {
          DeviceEventEmitter.emit('onBuyScroll', e.nativeEvent.contentOffset.y);
        }}
      >
        <View className="mx-4 mt-2 p-4 rounded-[32px] bg-[#E6F4F5]">
          <CategoryTabs
            activeTab={selectedTab}
            onTabPress={setSelectedTab}
          />

          <SearchBox
            placeholder="Search city, locality, landmark for PG ..."
            onPress={() => router.push('/screens/Buy/BuySearch')}
          />
        </View>

        <ContinueCards data={recentSearches} />

        <View className="mx-4 mt-4 mb-6">
          <LinearGradient
            colors={[
              'rgba(0,142,150,0.08)',
              'rgba(11,155,157,0.08)',
              'rgba(19,165,162,0.08)',
              'rgba(28,178,169,0.08)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="min-h-[247px] rounded-2xl border border-[#008E9626] p-5"
          >
            <Text className="max-w-[285px] font-inter-semibold text-[17px] leading-[21px] text-[#101828]">
              Are you a property owner looking{`\n`}to rent/sell?
            </Text>

            <View className="mt-4 gap-2.5">
              {['Zero Brokerage', 'Genuine, verified leads', 'On demand assistance'].map((item) => (
                <View key={item} className="flex-row items-center gap-2.5">
                  <View className="h-5 w-5 items-center justify-center rounded-full bg-[#008E96]">
                    <Check size={12} color="#FFFFFF" strokeWidth={2.2} />
                  </View>
                  <Text className="font-inter-regular text-[14px] leading-[21px] text-[#4A5565]">
                    {item}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              className="mt-5 h-11 w-[201px] items-center justify-center rounded-xl bg-[#008E96]"
            >
              <Text className="font-inter-semibold text-[15px] leading-[22px] text-white">
                Post property for FREE
              </Text>
            </TouchableOpacity>

            <View
              pointerEvents="none"
              className="absolute -bottom-[2px] -right-[6px] h-[140px] w-[160px] opacity-90"
            >
              <View
                className="absolute left-[56.25%] right-[12.5%] top-[21.43%] bottom-[21.43%] rounded-xl bg-[#008E96] opacity-20"
              />
              <View
                className="absolute left-[68.75%] right-[12.5%] top-[35.71%] bottom-[28.57%] rounded-lg bg-[#1CB2A9] opacity-25"
              />
              <View
                className="absolute left-[59.38%] right-[29.38%] top-[28.57%] bottom-[60.71%] rounded bg-[#008E96] opacity-30"
              />
              <View
                className="absolute left-[73.12%] right-[15.62%] top-[28.57%] bottom-[60.71%] rounded bg-[#008E96] opacity-30"
              />
              <View
                className="absolute left-[59.38%] right-[29.38%] top-[42.86%] bottom-[46.43%] rounded bg-[#008E96] opacity-30"
              />
              <View
                className="absolute left-[73.12%] right-[15.62%] top-[42.86%] bottom-[46.43%] rounded bg-[#008E96] opacity-30"
              />
              <View
                className="absolute left-[71.88%] right-[21.88%] top-[41.43%] bottom-[52.86%] rounded-[3px] bg-[#1CB2A9] opacity-40"
              />
              <View
                className="absolute left-[79.38%] right-[14.38%] top-[41.43%] bottom-[52.86%] rounded-[3px] bg-[#1CB2A9] opacity-40"
              />
              <View
                className="absolute left-[31.25%] right-[37.5%] top-[42.86%] bottom-[21.43%] rounded-full bg-[#EC4899] opacity-15"
              />
              <View
                className="absolute left-[81.25%] right-[9.38%] top-[78.57%] bottom-[7.14%] bg-[#6366F1] opacity-[0.12]"
                style={{ transform: [{ rotate: '36deg' }] }}
              />
            </View>
          </LinearGradient>
        </View>
        
        {/* Popular on Propertize Section */}
        <View className="px-4 mb-6">
         

          {/* Tools Grid Card */}
          <View
            className="bg-white rounded-[24px] w-full min-h-[.5px] p-4 pt-10 shadow-sm mb-6"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 4
            }}
          >
             {/* Section Header */}
          <View className="flex-row items-center gap-2 mb-4">
            <Text className="text-[#FB2C36] text-[20px]">⭐</Text>
            <Text className="font-inter-bold text-[17px] text-[#101828]">Popular on Propertize</Text>
          </View>
            <View className="flex-row justify-around mb-8">
              <TouchableOpacity
                onPress={() => router.push('/screens/Buy/Suggestions')}
                className="items-center w-[100px]"
              >
                <View className="w-12 h-12 bg-[#DBEAEB]/45 rounded-[14px] items-center justify-center mb-2">
                  <Ionicons name="albums-outline" size={24} color="blue" />
                </View>
                <Text className="font-inter-medium text-[12px] text-[#364153] text-center leading-[18px]">Collection</Text>
              </TouchableOpacity>

           

              <TouchableOpacity className="items-center w-[100px]">
                <View className="w-12 h-12 bg-[#DBEAEB]/45 rounded-[14px] items-center justify-center mb-2">
                  <Ionicons name="newspaper-outline" size={24} color="blue" />
                </View>
                <Text className="font-inter-medium text-[12px] text-[#364153] text-center leading-[18px]">News</Text>
              </TouchableOpacity>
                <TouchableOpacity className="items-center w-[100px]">
                <View className="w-12 h-12 bg-[#DBEAEB]/45 rounded-[14px] items-center justify-center mb-2">
                  <Ionicons name="calculator-outline" size={24} color="blue" />
                </View>
                <Text className="font-inter-medium text-[11px] text-[#364153] text-center leading-[14px]">EMI Calculator</Text>
              </TouchableOpacity>
            </View>

            
          </View>

         
        </View>

        {/* Home at First Sight Section */}
        <View className="mt-2 mb-6 w-full" style={{ height: 573 }}>
          {/* Heading */}
          <View className="px-4">
            <Text className="text-[22px] font-inter-semibold text-[#101828] leading-[33px]">
              Home at First Sight
            </Text>
          </View>

          {/* Feature Items Container */}
          <View className="px-4 mt-5 gap-4">
            {/* Feature 1 – Verified */}
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(245, 158, 11, 0.125)' }}
              >
                <MaterialCommunityIcons name="shield-check-outline" size={20} color="#F59E0B" />
              </View>
              <Text className="font-inter-regular text-[15px] leading-[22px] text-[#4A5565]">
                Verified & Onboarded by our experts
              </Text>
            </View>

            {/* Feature 2 – Property Details */}
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(139, 92, 246, 0.125)' }}
              >
                <MaterialCommunityIcons name="home-outline" size={20} color="#8B5CF6" />
              </View>
              <Text className="font-inter-regular text-[15px] leading-[22px] text-[#4A5565]">
                Every property detail on just a click
              </Text>
            </View>

            {/* Feature 3 – Userbase */}
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(236, 72, 153, 0.125)' }}
              >
                <MaterialCommunityIcons name="account-group-outline" size={20} color="#EC4899" />
              </View>
              <Text className="font-inter-regular text-[15px] leading-[22px] text-[#4A5565]">
                Genuine & vast userbase
              </Text>
            </View>
          </View>

          {/* Illustration */}
          <View className="mt-6 self-center items-center justify-center" style={{ width: 358, height: 344 }}>
            <Image
              source={require('../../../assets/images/Icon copy.png')}
              className="self-center"
              style={{ width: 300, height: 280 }}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Benefits of our P.G. Section */}
        <View className="px-4 gap-5 mb-6" style={{ height: 523.75 }}>
          {/* Heading */}
          <Text className="text-[22px] font-inter-semibold text-[#101828] leading-[33px]">
            Benefits of our P.G.
          </Text>

          {/* Cards Grid Container */}
          <View className="relative" style={{ width: 358, height: 470.75 }}>

            {/* Card 1 – Stress Free Search (top-left) */}
            <View className="absolute items-center" style={{ left: 0, top: 0, width: 167, height: 223.38 }}>
              {/* Illustration */}
              <View className="items-center justify-center" style={{ width: 167, height: 120 }}>
                <Image
                  source={require('../../../assets/images/StressFreeSearchIllustration.png')}
                  style={{ width: 110, height: 110 }}
                  resizeMode="contain"
                />
              </View>
              {/* Title */}
              <Text className="font-inter-semibold text-[16px] leading-[20px] text-center text-[#101828] mt-3">
                Stress Free Search
              </Text>
              {/* Description */}
              <Text className="font-inter-regular text-[13px] leading-[21px] text-center text-[#6A7282] mt-2" style={{ width: 167 }}>
                Real property photos and Transparent pricing
              </Text>
            </View>

            {/* Card 2 – Find your Match (top-right) */}
            <View className="absolute items-center" style={{ left: 191, top: 0, width: 167, height: 223.38 }}>
              {/* Illustration */}
              <View className="items-center justify-center" style={{ width: 167, height: 120 }}>
                <Image
                  source={require('../../../assets/images/FindMatchIllustration.png')}
                  style={{ width: 110, height: 110 }}
                  resizeMode="contain"
                />
              </View>
              {/* Title */}
              <Text className="font-inter-semibold text-[16px] leading-[20px] text-center text-[#101828] mt-3">
                Find your Match
              </Text>
              {/* Description */}
              <Text className="font-inter-regular text-[13px] leading-[21px] text-center text-[#6A7282] mt-2" style={{ width: 167 }}>
                Lots of options to choose from (private, twin & multi-sharing)
              </Text>
            </View>

            {/* Card 3 – Bon appétite (bottom-left) */}
            <View className="absolute items-center" style={{ left: 0, top: 247.38, width: 167, height: 223.38 }}>
              {/* Illustration */}
              <View className="items-center justify-center" style={{ width: 167, height: 120 }}>
                <Image
                  source={require('../../../assets/images/BonAppetitIllustration.png')}
                  style={{ width: 110, height: 110 }}
                  resizeMode="contain"
                />
              </View>
              {/* Title */}
              <Text className="font-inter-semibold text-[16px] leading-[20px] text-center text-[#101828] mt-3">
                Bon appétite
              </Text>
              {/* Description */}
              <Text className="font-inter-regular text-[13px] leading-[21px] text-center text-[#6A7282] mt-2" style={{ width: 167 }}>
                Info on meal type and offerings to know what's cooking
              </Text>
            </View>

            {/* Card 4 – Your Life, Your Rules (bottom-right) */}
            <View className="absolute items-center" style={{ left: 191, top: 247.38, width: 167, height: 223.38 }}>
              {/* Illustration */}
              <View className="items-center justify-center" style={{ width: 167, height: 120 }}>
                <Image
                  source={require('../../../assets/images/YourLifeRulesIllustration.png')}
                  style={{ width: 110, height: 110 }}
                  resizeMode="contain"
                />
              </View>
              {/* Title */}
              <Text className="font-inter-semibold text-[16px] leading-[20px] text-center text-[#101828] mt-3">
                Your Life, Your Rules
              </Text>
              {/* Description */}
              <Text className="font-inter-regular text-[13px] leading-[21px] text-center text-[#6A7282] mt-2" style={{ width: 167 }}>
                Advance info on house rules to live like you do
              </Text>
            </View>

          </View>
        </View>

      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
};

export default PG;