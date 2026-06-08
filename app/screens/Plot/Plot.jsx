import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, } from 'react';
import { DeviceEventEmitter, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BetterPricedPropertyCard from '../../../components/BetterPricedPropertyCard';
import FeaturedCollectionCard from '../../../components/FeaturedCollectionCard';
import NewsCard from '../../../components/NewsCard';
import SearchBox from '../../../components/SearchBox';
import SellerCard from '../../../components/SellerCard';
import Spotlight from '../../../components/Spotlight';
import UserHeader from '../../../components/UserHeader';
import { getCategoryRoute, useCategoryTab } from '../../context/CategoryTabContext';
import BottomTabBar from '../../navigation/BottomTabBar';
import CategoryTabs from '../../navigation/CategoryTabs';
import ComingSoon from '../../../components/ComingSoon';

const Plot = () => {
  const { selectedTab, setSelectedTab } = useCategoryTab();
  const skipFirstRedirect = useRef(true);

  useEffect(() => {
    setSelectedTab('Plot');
  }, [setSelectedTab]);

  useEffect(() => {
    if (skipFirstRedirect.current) {
      skipFirstRedirect.current = false;
      return;
    }

    if (selectedTab !== 'Plot') {
      const targetRoute = getCategoryRoute(selectedTab);
      if (targetRoute) {
        router.replace(targetRoute);
      }
    }
  }, [selectedTab]);

  const handleProtectedViewMore = async (destination) => {
    const token = await SecureStore.getItemAsync('token');
    const redirectTo = encodeURIComponent(JSON.stringify(destination));

    if (!token) {
      router.replace({
        pathname: '/(auth)/Login',
        params: { redirectTo },
      });
      return;
    }

    router.push(destination);
  };



  const recommendedSellers = [
    {
      id: 1,
      name: 'Mohali Realty',
      experienceYears: '8',
      propertiesCount: '45',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      tags: ['Commercial', 'Verified'],
    },
    {
      id: 2,
      name: 'Skyline Associates',
      experienceYears: '12',
      propertiesCount: '31',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      tags: ['Residential', 'Verified'],
    },
    {
      id: 3,
      name: 'Urban Nest Realty',
      experienceYears: '10',
      propertiesCount: '52',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
      tags: ['Commercial', 'Trusted'],
    },
    {
      id: 4,
      name: 'PrimeKeys Mohali',
      experienceYears: '6',
      propertiesCount: '27',
      avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200',
      tags: ['Residential', 'Verified'],
    },
    {
      id: 5,
      name: 'Elite Plot Experts',
      experienceYears: '14',
      propertiesCount: '63',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      tags: ['Plots', 'Verified'],
    },
    {
      id: 6,
      name: 'TrueNorth Advisors',
      experienceYears: '9',
      propertiesCount: '39',
      avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=200',
      tags: ['Luxury', 'Trusted'],
    },
  ];

  const sellerColumns = recommendedSellers.reduce((cols, seller, index) => {
    const columnIndex = Math.floor(index / 2);
    if (!cols[columnIndex]) {
      cols[columnIndex] = [];
    }
    cols[columnIndex].push(seller);
    return cols;
  }, []);

  const betterPricedProperties = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
      title: "Ubber Mews Gate",
      marketer: "rising star builtec",
      details: "2, 3, 4 BHK ... • Aujala, Mohali",
      priceRange: "₹ 69.43 L - 1.22 Cr"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
      title: "Green Valley Estate",
      marketer: "Green Developers",
      details: "3, 4 BHK ... • Sector 88, Mohali",
      priceRange: "₹ 85.50 L - 1.45 Cr"
    }
  ];



  const newsArticles = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600",
      title: "How to apply for Mumbai Mhada Lottery?",
      meta: "Posted on 25 Jan • 12 min read",
      description: "The Mhada Mumbai Board lucky draw provides low-cost housing options for various income groups across the city."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=600",
      title: "Real Estate Trends to Watch in 2024",
      meta: "Posted on 22 Jan • 8 min read",
      description: "Discover the emerging trends in the real estate market, from sustainable building to AI-driven virtual tours."
    }
  ];









  
   


  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top Header */}
      <UserHeader />

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        scrollEventThrottle={16}
        onScroll={(e) => {
          DeviceEventEmitter.emit('onBuyScroll', e.nativeEvent.contentOffset.y);
        }}
      >
        {/* Main Category Blue Container */}
        <View className="mx-4 mt-2 p-4 rounded-[32px] bg-[#E6F4F5]">
          <CategoryTabs
            activeTab={selectedTab}
            onTabPress={setSelectedTab}
            mode="Plot"
          />

          <SearchBox />
        </View>


        {/* Coming Soon Section */}
        <ComingSoon />

        {/* Matches Section
        <View className="px-4 mt-8 mb-6">
          <Spotlight />
        </View>
        */}

        {/* Popular on Propertize Section
        <View className="px-4 mb-6">
          <View className="flex-row items-center gap-2 mb-4">
            <Text className="text-[#FB2C36] text-[20px]">⭐</Text>
            <Text className="font-inter-bold text-[17px] text-[#101828]">Popular on Propertize</Text>
          </View>

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
              <TouchableOpacity
                onPress={() => handleProtectedViewMore('/screens/Buy/Suggestions')}
                className="items-center w-[100px]"
              >
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
        </View>
        */}

        {/* Recommended Sellers Section
        <View className="px-4 mb-3">
          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text className="font-inter-semibold text-[17px] text-[#101828]">Recommended Sellers</Text>
              <Text className="font-inter-regular text-[13px] text-[#6A7282] mt-0.5">Sellers with complete knowledge about locality</Text>
            </View>
            <TouchableOpacity onPress={() => handleProtectedViewMore('/screens/RecommendedSellers')}>
              <Text className="font-inter-medium text-[14px] text-[#008E96]">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingBottom: 8, paddingRight: 8 }}
          >
            {sellerColumns.map((column, columnIndex) => (
              <View key={`seller-col-${columnIndex}`} style={{ width: 340, gap: 12 }}>
                {column.map((seller) => (
                  <SellerCard
                    key={seller.id}
                    name={seller.name}
                    experienceYears={seller.experienceYears}
                    propertiesCount={seller.propertiesCount}
                    avatar={seller.avatar}
                    tags={seller.tags}
                  />
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
        */}

        {/* Featured Collections Section
        <View className=" mb-6">
          <FeaturedCollectionCard />
        </View>
        */}

        {/* Better Priced Properties Section
        <View className="px-4 mb-3">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="font-inter-semibold text-[17px] text-[#101828]">Most Popular</Text>
              <Text className="font-inter-regular text-[13px] text-[#6A7282] mt-0.5">Handpicked for you</Text>
            </View>
            <TouchableOpacity onPress={() => handleProtectedViewMore('/screens/MostPopularPlots')}>
              <Text className="font-inter-medium text-[14px] text-primary">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            {betterPricedProperties.map((property) => (
              <BetterPricedPropertyCard
                key={property.id}
                id={property.id || property._id}
                image={property.image}
                title={property.title}
                marketer={property.marketer}
                details={property.details}
                priceRange={property.priceRange}
              />
            ))}
          </ScrollView>
        </View>
        */}

        {/* News For You Section
        <View className="px-4  mt-4">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="font-inter-semibold text-[17px] text-[#101828]">News For You</Text>
              <Text className="font-inter-regular text-[13px] text-[#6A7282] mt-0.5">Read whats happening in real estate</Text>
            </View>
            <TouchableOpacity onPress={() => handleProtectedViewMore('/screens/NewsForYou')}>
              <Text className="font-inter-medium text-[14px] text-primary">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 70 }}
          >
            {newsArticles.map((item) => (
              <NewsCard
                key={item.id}
                image={item.image}
                title={item.title}
                meta={item.meta}
                description={item.description}
              />
            ))}
          </ScrollView>
        </View>
        */}


      </ScrollView>
      <BottomTabBar mode="Plot" activeTab="Search" />
    </SafeAreaView>
  );
};

export default Plot;
