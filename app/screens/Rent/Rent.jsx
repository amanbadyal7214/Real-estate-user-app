import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalculatorCard from '../../../components/CalculatorCard';
import ContinueCards from '../../../components/ContinueCards';
import ExploreLocalityCard from '../../../components/ExploreLocalityCard';
import FurnishedPropertiesSection from '../../../components/FurnishedPropertiesSection';
import NewsCard from '../../../components/NewsCard';
import PropertySuggestionCard from '../../../components/PropertySuggestionCard';
import RecommendedPropertyCard from '../../../components/RecommendedPropertyCard';
import RecommendedSellerCard from '../../../components/RecommendedSellerCard';
import SearchBox from '../../../components/SearchBox';
import UserHeader from '../../../components/UserHeader';
import { getCategoryRoute, useCategoryTab } from '../../context/CategoryTabContext';
import BottomTabBar from '../../navigation/BottomTabBar';
import CategoryTabs from '../../navigation/CategoryTabs';

const Rent = () => {
  const { selectedTab, setSelectedTab } = useCategoryTab();
  const skipFirstRedirect = useRef(true);

  useEffect(() => {
    setSelectedTab('Rent');
  }, [setSelectedTab]);

  useEffect(() => {
    if (skipFirstRedirect.current) {
      skipFirstRedirect.current = false;
      return;
    }

    if (selectedTab !== 'Rent') {
      const targetRoute = getCategoryRoute(selectedTab);
      if (targetRoute) {
        router.replace(targetRoute);
      }
    }
  }, [selectedTab]);

    const recentSearches = [
        { title: 'Apartment, Rent, Mohali,', subtitle: 'Min ₹15K, 2+ BHK' },
        { title: 'Rent, Sector 66', subtitle: 'Max ₹40K' },
        { title: 'Independent House, Rent, Zirakpur', subtitle: '3 BHK' },
    ];

    const suggestions = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600',
            developerName: 'Nirwana Group',
            developerInitial: 'N',
            price: '₹ 45.03 L - 1.11 Cr',
            title: 'Nirwana The Moksha',
            location: 'Khanpur, Mohali',
            config: '1, 2, 3 BHK Flats'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
            developerName: 'Vatika Group',
            developerInitial: 'V',
            price: '₹ 51.9 L - 89.3 L',
            title: 'Vatika Seven Lamps',
            location: 'Sector 82, Mohali',
            config: '2 BHK Flats'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=600',
            developerName: 'DLF Limited',
            developerInitial: 'D',
            price: '₹ 62.5 L - 1.25 Cr',
            title: 'DLF Garden City',
            location: 'Sector 91, Mohali',
            config: '2, 3, 4 BHK Flats'
        },
        {
            id: 4,
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
            developerName: 'Emaar India',
            developerInitial: 'E',
            price: '₹ 75.2 L - 1.45 Cr',
            title: 'Emaar Palm Heights',
            location: 'Sector 77, Mohali',
            config: '2, 3 BHK Flats'
        }
    ];
    

  const recommendedProperties = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=400',
      price: '₹ 4.25 Cr',
      title: '5 BHK Independent House',
      area: '2000 sq.ft.',
      location: 'Janta Sector 90 A, Mohali',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
      price: '₹ 2.10 Cr',
      title: '3 BHK Modern Villa',
      area: '1800 sq.ft.',
      location: 'Sector 82, Mohali',
    }
  ]; 
  
const emiVectors = [
    { left: 10, right: 10, top: 25, bottom: -25, background: '#FFF4E6', roundedTop: true },
    { left: 30, right: 52.5, top: 25, bottom: 18.75, background: '#D4A574' },
    { left: 32.5, right: 55, top: 31.25, bottom: 62.5, background: '#8B6F47' },
    { left: 32.5, right: 55, top: 41.25, bottom: 52.5, background: '#8B6F47' },
    { left: 32.5, right: 60, top: 51.25, bottom: 42.5, background: '#8B6F47' },
    { left: 20, right: 70, top: 50, bottom: 37.5, borderWidth: 2, borderColor: '#8B6F47' },
    { left: 52.5, right: 32.5, top: 43.75, bottom: 25, background: '#D4A574' },
    { left: 56, right: 36, top: 48.75, bottom: 31.25, background: '#FFF4E6', isDot: true }
  ];
   const affordabilityVectors = [
    { left: 10, right: 10, top: 25, bottom: -25, background: '#FFF4E6', roundedTop: true },
    { left: 35, right: 45, top: 31.25, bottom: 25, background: '#D4A574' },
    { left: 37.5, right: 47.5, top: 37.5, bottom: 57.5, background: '#8B6F47' },
    { left: 37.5, right: 47.5, top: 47.5, bottom: 47.5, background: '#8B6F47' },
    { left: 37.5, right: 52.5, top: 57.5, bottom: 37.5, background: '#8B6F47' }
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
    const recommendedSellers = [
    {
      id: 1,
      name: 'Priya Sharma',
      experienceYears: '29',
      propertiesCount: '15',
      location: 'Nabha',
    },
    {
      id: 2,
      name: 'Rahul Verma',
      experienceYears: '12',
      propertiesCount: '8',
      location: 'Sector 66, Mohali',
    }
  ];

    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = (activeIndex + 1) % suggestions.length;
            setActiveIndex(nextIndex);
            scrollRef.current?.scrollTo({ x: nextIndex * 296, animated: true });
        }, 3000);

        return () => clearInterval(interval);
    }, [activeIndex, suggestions.length]);

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / 296);
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Top Header */}
            <UserHeader />

            {/* Scrollable Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1"
            >
                {/* Main Category Blue Container */}
                <View className="mx-4 mt-2 p-4 rounded-[32px] bg-[#E6F4F5]">
                    <CategoryTabs
                    activeTab={selectedTab}
                    onTabPress={setSelectedTab}
                    />

                    <SearchBox
                        placeholder="Search city, locality, landmark for rent ..."
                        onPress={() => router.push('/screens/Buy/BuySearch')} // Using BuySearch as common search screen
                    />
                </View>

                <ContinueCards data={recentSearches} />

                {/* Smart Suggestions Section */}
                <View className="mt-8">
                    <View className="px-4 mb-4">
                        <View className="flex-row justify-between items-center">
                            <Text className="font-inter-bold text-[22px] text-[#101828]">Smart Suggestions</Text>
                            <TouchableOpacity>
                                <Text className="font-inter-semibold text-[15px] text-[#008E96]">See all</Text>
                            </TouchableOpacity>
                        </View>
                        <Text className="font-inter-regular text-[14px] text-[#6A7282] mt-1">
                            Based on your last search in Khanpur
                        </Text>
                    </View>

                    <View className="flex-row gap-2 px-4 mb-6">
                        {suggestions.map((_, index) => (
                            <View 
                                key={index}
                                className={`w-10 h-1 rounded-full ${index === activeIndex ? 'bg-[#008E96]' : 'bg-[#E4E7EC]'}`} 
                            />
                        ))}
                    </View>

                    <ScrollView
                        ref={scrollRef}
                        horizontal
                        onMomentumScrollEnd={handleScroll}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
                        snapToInterval={296}
                        decelerationRate="fast"
                    >
                        {suggestions.map((item) => (
                            <PropertySuggestionCard key={item.id} {...item} />
                        ))}
                    </ScrollView>
                </View>
                {/* Recommended Properties Section */}
        <View className="px-4 pt-6">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="font-inter-bold text-[18px] text-[#101828]">Recommended Properties</Text>
              <Text className="font-inter-regular text-[14px] text-[#667085]">Properties matching your requirements</Text>
            </View>
            <TouchableOpacity>
              <Text className="font-inter-regular text-[16px] text-[#008E96]">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
          >
            {recommendedProperties.map((item) => (
              <RecommendedPropertyCard
                key={item.id}
                id={item.id || item._id}
                image={item.image}
                price={item.price}
                title={item.title}
                area={item.area}
                location={item.location}
              />
            ))}
          </ScrollView>
        </View>
       
        <FurnishedPropertiesSection />

        {/* Popular on Propertize Section */}
        <View className="px-4 pt-12 mb-6 items-center">
          <View
            style={{
              width: 320,
              height: 154,
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            {/* Section Header */}
            <View className="flex-row items-center gap-2 mb-6">
              <Text style={{ fontSize: 16 }}>⭐</Text>
              <Text className="font-inter-semibold text-[17px] text-[#101828]">Popular on Propertize</Text>
            </View>

            <View className="flex-row justify-around">
              {/* Suggestions */}
              <TouchableOpacity
                onPress={() => router.push('/screens/Buy/Suggestions')}
                className="items-center"
              >
                <View className="w-10 h-10 bg-[#DBEAEB]/45 rounded-[14px] items-center justify-center mb-2">
                  <Ionicons name="bulb-outline" size={24} color="#008E96" />
                </View>
                <Text className="font-inter-medium text-[12px] text-[#364153]">Suggestions</Text>
              </TouchableOpacity>

              {/* News */}
              <TouchableOpacity className="items-center">
                <View className="w-10 h-10 bg-[#DBEAEB]/45 rounded-[14px] items-center justify-center mb-2">
                  <Ionicons name="newspaper-outline" size={24} color="#008E96" />
                </View>
                <Text className="font-inter-medium text-[12px] text-[#364153]">News</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recommended Sellers Section */}
        <View className="px-4 mb-3">
          <View className="mb-4">
            <Text className="font-inter-semibold text-[17px] text-[#101828]">Recommended Sellers</Text>
            <Text className="font-inter-regular text-[13px] text-[#6A7282] mt-0.5">Sellers with complete knowledge about locality</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
          >
            {recommendedSellers.map((seller) => (
              <RecommendedSellerCard
                key={seller.id}
                name={seller.name}
                experienceYears={seller.experienceYears}
                propertiesCount={seller.propertiesCount}
                location={seller.location}
              />
            ))}
          </ScrollView>
        </View>

            {/* Explore Localities Section */}
        <View className="px-4  mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="font-inter-semibold text-[17px] text-[#101828]">Explore Localities</Text>
              <Text className="font-inter-regular text-[13px] text-[#6A7282] mt-0.5">See Insights and videos in Mohali</Text>
            </View>
            <TouchableOpacity>
              <Text className="font-inter-medium text-[14px] text-primary">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8, gap: 12 }}
          >
            <ExploreLocalityCard
              title="Kharar"
              avgPrice="Avg. Price:"
              priceSqft="₹6.2K/ sq.ft."
              growth="+12.68% ▲"
            />
            <ExploreLocalityCard
              title="Sector 115"
              avgPrice="Avg. Price:"
              priceSqft="₹5.1K/ sq.ft."
              growth="+7.25% ▲"
            />
            <ExploreLocalityCard
              title="Zirakpur"
              avgPrice="Avg. Price:"
              priceSqft="₹4.8K/ sq.ft."
              growth="+5.12% ▲"
            />
            <ExploreLocalityCard
              title="Aerocity"
              avgPrice="Avg. Price:"
              priceSqft="₹8.5K/ sq.ft."
              growth="+15.30% ▲"
            />
          </ScrollView>
        </View>

        {/* News For You Section */}
        <View className="px-4  mt-4">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="font-inter-semibold text-[17px] text-[#101828]">News For You</Text>
              <Text className="font-inter-regular text-[13px] text-[#6A7282] mt-0.5">Read whats happening in real estate</Text>
            </View>
            <TouchableOpacity>
              <Text className="font-inter-medium text-[14px] text-primary">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
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

        {/* Calculators Section */}
        <View className="px-4 mb-24 mt-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            <CalculatorCard
              titlePrefix="EMI"
              description="EMI starts at ₹10.60K"
              vectorsConfig={emiVectors}
            />
            <CalculatorCard
              titlePrefix="Affordability"
              description="Find the best budget for your home"
              vectorsConfig={affordabilityVectors}
            />
          </ScrollView>
        </View>
            </ScrollView>
            <BottomTabBar mode="Rent" />
        </SafeAreaView>
        
    );
};

export default Rent;
