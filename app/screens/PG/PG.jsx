import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { DeviceEventEmitter, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ContinueCards from '../../../components/ContinueCards';
import SearchBox from '../../../components/SearchBox';
import TestimonialCardPG from '../../../components/TestimonialCardPG';
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
            mode="PG"
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

        {/* Popular on The Property Wall Section */}
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
              <Text className="font-inter-bold text-[17px] text-[#101828]">Popular on The Property Wall</Text>
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
            <Text className="text-[22px] text-[#101828] leading-[33px]" style={{ fontFamily: 'Inter-SemiBold' }}>
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
          <Text className="text-[22px] text-[#101828] leading-[33px]" style={{ fontFamily: 'Inter-SemiBold' }}>
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
              <Text className="text-[16px] leading-[20px] text-center text-[#101828] mt-3" style={{ fontFamily: 'Inter-SemiBold' }}>
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
              <Text className="text-[16px] leading-[20px] text-center text-[#101828] mt-3" style={{ fontFamily: 'Inter-SemiBold' }}>
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
              <Text className="text-[16px] leading-[20px] text-center text-[#101828] mt-3" style={{ fontFamily: 'Inter-SemiBold' }}>
                Bon appétite
              </Text>
              {/* Description */}
              <Text className="font-inter-regular text-[13px] leading-[21px] text-center text-[#6A7282] mt-2" style={{ width: 167 }}>
                Info on meal type and offerings to know what cooking
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
              <Text className="text-[16px] leading-[20px] text-center text-[#101828] mt-3" style={{ fontFamily: 'Inter-SemiBold' }}>
                Your Life, Your Rules
              </Text>
              {/* Description */}
              <Text className="font-inter-regular text-[13px] leading-[21px] text-center text-[#6A7282] mt-2" style={{ width: 167 }}>
                Advance info on house rules to live like you do
              </Text>
            </View>

          </View>
        </View>

        {/* Featured Collections Section */}
        <View className="mb-6" style={{ gap: 16 }}>
          {/* Header */}
          <View className="px-4" style={{ gap: 4 }}>
            <Text className="text-[22px] text-[#101828] leading-[33px]" style={{ fontFamily: 'Inter-SemiBold' }}>
              Featured Collections
            </Text>
            <Text className="text-[14px] leading-[21px] text-[#6A7282]" style={{ fontFamily: 'Inter-Regular' }}>
              Category suited to your property needs
            </Text>
          </View>

          {/* Cards Row */}
          <View className="flex-row px-4" style={{ gap: 17 }}>
            {/* For Boys Card */}
            <LinearGradient
              colors={['#E9D5FF', '#E7D5FF', '#E4D5FF', '#E2D6FE', '#DFD6FE', '#DDD6FE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl, ml-5"
              style={{ width: 168, height: 130, borderRadius: 16, overflow: 'hidden' }}
            >
              {/* Person Icon Circle */}
              <View
                className="absolute rounded-full items-center justify-center"
                style={{ width: 48, height: 48, left: 16, top: 31, backgroundColor: '#8B5CF6' }}
              >
                <Ionicons name="person" size={24} color="#FFFFFF" />
              </View>

              {/* Decorative White Dots */}
              <View className="absolute" style={{ width: 40, height: 40, left: 112, top: 16 }}>
                <View
                  className="absolute rounded-full bg-white opacity-30"
                  style={{ left: '10%', right: '70%', top: '10%', bottom: '70%' }}
                />
                <View
                  className="absolute rounded-full bg-white opacity-30"
                  style={{ left: '50%', right: '30%', top: '10%', bottom: '70%' }}
                />
                <View
                  className="absolute rounded-full bg-white opacity-30"
                  style={{ left: '10%', right: '70%', top: '50%', bottom: '30%' }}
                />
                <View
                  className="absolute rounded-full bg-white opacity-20"
                  style={{ left: '65%', right: '5%', top: '45%', bottom: '25%' }}
                />
              </View>

              {/* Title */}
              <Text
                className="absolute text-[18px] leading-[27px] text-[#101828]"
                style={{ left: 16, top: 87, fontFamily: 'Inter-SemiBold' }}
              >
                For Boys
              </Text>
            </LinearGradient>

            {/* For Girls Card */}
            <LinearGradient
              colors={['#FCE7F3', '#FCE5F2', '#FCE2F1', '#FCE0F0', '#FCDDEF', '#FCDBEE', '#FCD9EC', '#FBD6EB', '#FBD4EA', '#FBD1E9', '#FBCFE8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl"
              style={{ width: 168, height: 130, borderRadius: 16, overflow: 'hidden' }}
            >
              {/* Person Icon Circle */}
              <View
                className="absolute rounded-full items-center justify-center"
                style={{ width: 48, height: 48, left: 16, top: 31, backgroundColor: '#EC4899' }}
              >
                <Ionicons name="person" size={24} color="#FFFFFF" />
              </View>

              {/* Decorative White Dots */}
              <View className="absolute" style={{ width: 40, height: 40, left: 112, top: 16 }}>
                <View
                  className="absolute rounded-full bg-white opacity-30"
                  style={{ left: '10%', right: '70%', top: '10%', bottom: '70%' }}
                />
                <View
                  className="absolute rounded-full bg-white opacity-30"
                  style={{ left: '50%', right: '30%', top: '10%', bottom: '70%' }}
                />
                <View
                  className="absolute rounded-full bg-white opacity-30"
                  style={{ left: '10%', right: '70%', top: '50%', bottom: '30%' }}
                />
                <View
                  className="absolute rounded-full bg-white opacity-20"
                  style={{ left: '65%', right: '5%', top: '45%', bottom: '25%' }}
                />
              </View>

              {/* Title */}
              <Text
                className="absolute text-[18px] leading-[27px] text-[#101828]"
                style={{ left: 16, top: 87, fontFamily: 'Inter-SemiBold' }}
              >
                For Girls
              </Text>
            </LinearGradient>
          </View>
        </View>

        {/* Our Testimonials Section */}
        <View className="mb-6" style={{ gap: 16 }}>
          {/* Header */}
          <View className="px-4" style={{ gap: 4 }}>
            <Text className="text-[22px] text-[#101828] leading-[33px]" style={{ fontFamily: 'Inter-SemiBold' }}>
              Our Testimonials
            </Text>
            <Text className="text-[14px] leading-[21px] text-[#6A7282]" style={{ fontFamily: 'Inter-Regular' }}>
              Testimonials from our Housing edge customers
            </Text>
          </View>

          {/* Testimonial Cards – Horizontal Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 8, gap: 12 }}
          >
            <TestimonialCardPG
              name="Amit Chakraborty"
              subtitle="Co Living resident since last year"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
              comment="I am one of those who likes a lot of variety in my food. The PG I found through Housing.com offers amazing meal options that change daily. The listing had all the details about food, amenities, and house rules which made my decision so much easier."
            />

            <TestimonialCardPG
              name="Priya Sharma"
              subtitle="PG resident for 2 years"
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
              comment="Finding a safe and comfortable PG was my top priority when I moved to the city. Housing.com made it so easy with verified listings and detailed information about each property. The pictures matched exactly what I saw during the visit."
            />
          </ScrollView>
        </View>

        {/* Stats Card */}
        <View
          className="self-center rounded-2xl mb-6"
          style={{
            width: 358,
            height: 143.5,
            backgroundColor: '#1F2937',
            borderRadius: 16,
            paddingHorizontal: 24,
            paddingTop: 24,
          }}
        >
          <View className="flex-row" style={{ gap: 16 }}>
            {/* 30k+ Properties */}
            <View className="items-center" style={{ width: 92.67 }}>
              <Text
                className="text-[24px] leading-[36px] text-white text-center"
                style={{ fontFamily: 'Inter-Bold' }}
              >
                30k+
              </Text>
              <Text
                className="text-[13px] leading-[20px] text-center mt-1"
                style={{ fontFamily: 'Inter-Regular', color: '#D1D5DB' }}
              >
                Properties
              </Text>
            </View>

            {/* 35+ Cities */}
            <View className="items-center" style={{ width: 92.67 }}>
              <Text
                className="text-[24px] leading-[36px] text-white text-center"
                style={{ fontFamily: 'Inter-Bold' }}
              >
                35+
              </Text>
              <Text
                className="text-[13px] leading-[20px] text-center mt-1"
                style={{ fontFamily: 'Inter-Regular', color: '#D1D5DB' }}
              >
                Cities
              </Text>
            </View>

            {/* 2.5 Lakh+ Monthly Users */}
            <View className="items-center" style={{ width: 92.67 }}>
              <Text
                className="text-[24px] leading-[36px] text-white text-center"
                style={{ fontFamily: 'Inter-Bold' }}
              >
                2.5{'\n'}Lakh+
              </Text>
              <Text
                className="text-[13px] leading-[20px] text-center mt-1"
                style={{ fontFamily: 'Inter-Regular', color: '#D1D5DB' }}
              >
                Monthly Users
              </Text>
            </View>
          </View>
        </View>

        {/* Share App Card */}
        <View className="mb-24 px-4">
          <LinearGradient
            colors={['#FEF3C7', '#FEF0B9', '#FEEEAF', '#FDEA9F', '#FDE68A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl overflow-hidden relative"
            style={{ width: 388, height: 180, borderRadius: 16 }}
          >
            {/* Background Decorative Lines (Vectors) */}
            <View className="absolute inset-0 opacity-10">
              <View
                className="absolute border-[#F59E0B] rounded-full"
                style={{ width: 140, height: 140, left: -60, top: -40, borderWidth: 0.895 }}
              />
              <View
                className="absolute border-[#F59E0B] rounded-full"
                style={{ width: 140, height: 140, right: -60, bottom: -40, borderWidth: 0.895 }}
              />
              <View
                className="absolute border-[#F59E0B] border-dashed rounded-full"
                style={{ width: 100, height: 100, left: '25%', top: '45%', borderWidth: 0.895 }}
              />
            </View>

            <View className="flex-row items-center px-5" style={{ height: 180, gap: 16 }}>
              {/* Left Side: Content */}
              <View style={{ flex: 1, gap: 16 }}>
                <Text
                  className="text-[20px] leading-[25px] text-[#101828]"
                  style={{ fontFamily: 'Inter-SemiBold' }}
                >
                  Like the app?{'\n'}Share the app
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="bg-[#008E96] rounded-[12px] items-center justify-center"
                  style={{ width: 122, height: 44 }}
                >
                  <Text
                    className="text-white text-[15px] leading-[22px]"
                    style={{ fontFamily: 'Inter-SemiBold' }}
                  >
                    Share Now
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Right Side: Illustration */}
              <Image
                source={require('../../../assets/images/Icon (1).png')}
                style={{ width: 140, height: 140 }}
                resizeMode="contain"
              />
            </View>
          </LinearGradient>
        </View>

      </ScrollView>

      <BottomTabBar mode="PG" />
    </SafeAreaView>
  );
};

export default PG;