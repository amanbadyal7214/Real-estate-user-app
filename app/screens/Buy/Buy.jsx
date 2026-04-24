import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronDown, ChevronRight, Search, User, MapPin, Home, LayoutGrid } from 'lucide-react-native';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, DeviceEventEmitter } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryTabs from '../../../components/CategoryTabs';
import ContinueCards from '../../../components/ContinueCards';
import DeveloperProjectCard from '../../../components/DeveloperProjectCard';
import DeveloperSummaryCard from '../../../components/DeveloperSummaryCard';
import FeaturedCollectionCard from '../../../components/FeaturedCollectionCard';
import HighDemandProjectCard from '../../../components/HighDemandProjectCard';
import LocalityCard from '../../../components/LocalityCard';
import ProjectFocusCard from '../../../components/ProjectFocusCard';
import PropertyMatchedCards from '../../../components/PropertyMatchedCards';
import Spotlight from '../../../components/Spotlight';
import RecommendedPropertyCard from '../../../components/RecommendedPropertyCard';
import RecommendedSellerCard from '../../../components/RecommendedSellerCard';
import BetterPricedPropertyCard from '../../../components/BetterPricedPropertyCard';
import LastSearchedCard from '../../../components/LastSearchedCard';
import ExploreLocalityCard from '../../../components/ExploreLocalityCard';
import NewsCard from '../../../components/NewsCard';
import CalculatorCard from '../../../components/CalculatorCard';
import UserHeader from '../../../components/UserHeader';

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

  const lastSearches = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
      price: "₹ 2.03 Cr - 6.25 Cr",
      title: "Wave Estate Group Housing",
      builder: "by Uppal Chadha Hi Tech De...",
      location: "Patti Sohana, Mohali"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
      price: "₹ 2.03 Cr - 6.25 Cr",
      title: "Wave Estate Group Housing",
      builder: "by Uppal Chadha Hi Tech De...",
      location: "Patti Sohana, Mohali"
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

  const highDemandProjects = [
    {
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400",
      priceRange: "₹51.9 L - 68.9 L",
      title: "Lok Awas",
      developer: "Vara Developers",
      location: "Sector 74 A, Mohali"
    },
    {
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
      priceRange: "₹85.0 L - 1.2 Cr",
      title: "Hero Homes",
      developer: "Hero Realty",
      location: "Sector 88, Mohali"
    }
  ];

  const focusProjects = [
    {
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
      title: 'Nirwana The Moksha',
      location: 'Kharar, Mohali',
      price: '₹45.03 L - 1.11 Cr',
      tag: 'TALLEST LANDMARK',
      developer: 'NIRWANA GROUP',
      badgeType: 'RERA',
      badgeColor: '#155DFC'
    },
    {
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600',
      title: 'Premium Heights',
      location: 'Sector 66, Mohali',
      price: '₹62.50 L - 1.35 Cr',
      tag: 'LUXURY LIVING',
      developer: 'PREET DEVELOPERS',
      badgeType: 'READY',
      badgeColor: '#00A63E'
    },
    {
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
      title: 'Royal Residences',
      location: 'Sector 71, Mohali',
      price: '₹71.20 L - 1.58 Cr',
      tag: 'PREMIUM LIVING',
      developer: 'ROYAL GROUP',
      badgeType: 'RERA',
      badgeColor: '#155DFC'
    }
  ];

  const bestLocalities = [
    { title: 'Sector 115', rating: '4.8', reviews: '3', price: '₹5K/sqft.' },
    { title: 'Sector 82', rating: '4.6', reviews: '12', price: '₹7K/sqft.' },
    { title: 'Sector 66', rating: '4.9', reviews: '8', price: '₹12K/sqft.' },
    { title: 'Sector 71', rating: '4.7', reviews: '5', price: '₹9K/sqft.' },
  ];

  const topDevelopers = {
    summary: [
      { 
        id: 'nirwana',
        name: 'Nirwana Group', 
        logoText: 'NIRWANA',
        logoColor: '#E7000B',
        yearEstd: '2012', 
        projectCount: '15' 
      },
      { 
        id: 'vara',
        name: 'Vara Developers', 
        logoText: 'VARA',
        logoColor: '#008E96',
        yearEstd: '2016', 
        projectCount: '10' 
      },
      { 
        id: 'hero',
        name: 'Hero Realty', 
        logoText: 'HERO',
        logoColor: '#D92D20',
        yearEstd: '2004', 
        projectCount: '45' 
      },
    ],
    projects: {
      nirwana: [
        {
          image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
          logoText: 'N',
          logoColor: '#E7000B',
          title: 'D-Xperanza',
          developerName: 'NIRWANA GROUP',
          rating: '4.8',
          config: '3, 4 BHK Apartment',
          location: 'Sector 82, Mohali',
          priceRange: '₹1.24 Cr - 1.55 Cr',
        },
        {
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
          logoText: 'N',
          logoColor: '#E7000B',
          title: 'Nirwana The Moksha',
          developerName: 'NIRWANA GROUP',
          rating: '4.7',
          config: '2, 3 BHK Apartment',
          location: 'Kharar, Mohali',
          priceRange: '₹45.03 L - 1.11 Cr',
        }
      ],
      vara: [
        {
          image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400',
          logoText: 'V',
          logoColor: '#008E96',
          title: 'Lok Awas',
          developerName: 'Vara Developers',
          rating: '4.6',
          config: '2, 3 BHK Apartment',
          location: 'Sector 74 A, Mohali',
          priceRange: '₹51.9 L - 68.9 L',
        }
      ],
      hero: [
        {
          image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=400',
          logoText: 'H',
          logoColor: '#D92D20',
          title: 'Hero Homes',
          developerName: 'HERO REALTY',
          rating: '4.9',
          config: '2, 3 BHK Apartment',
          location: 'Sector 88, Mohali',
          priceRange: '₹85.0 L - 1.25 Cr',
        }
      ]
    }
  };

  const [activeDeveloperId, setActiveDeveloperId] = useState('nirwana');

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
        <View className="px-4 mt-8 mb-6">
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
        <View className="px-4 mb-6">
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
         {/* High Demand Projects Section */}
        <View className="px-4 mb-6" style={{ gap: 16 }}>
          <View className="flex-row items-center justify-between">
            <View style={{ gap: 1 }}>
              <Text 
                className="font-inter-bold text-[#101828]" 
                style={{ fontSize: 17, lineHeight: 21 }}
              >
                High Demand Projects
              </Text>
              <Text 
                className="font-inter-regular text-[#6A7282]" 
                style={{ fontSize: 13, lineHeight: 20 }}
              >
                Hurry! Only a few units left
              </Text>
            </View>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text 
                className="font-inter-medium text-[#008E96]" 
                style={{ fontSize: 14, lineHeight: 21 }}
              >
                View more
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {highDemandProjects.map((project, index) => (
              <HighDemandProjectCard 
                key={index}
                image={project.image}
                priceRange={project.priceRange}
                title={project.title}
                developer={project.developer}
                location={project.location}
              />
            ))}
          </ScrollView>
        </View>
           {/* Projects in Focus Section */}
        <View className="px-4 mb-6" style={{ gap: 16 }}>
          <View className="flex-row items-center justify-between">
            <View style={{ gap: 1 }}>
              <Text 
                className="font-inter-bold text-[#101828]" 
                style={{ fontSize: 17, lineHeight: 21 }}
              >
                Projects in Focus
              </Text>
              <Text 
                className="font-inter-regular text-[#6A7282]" 
                style={{ fontSize: 13, lineHeight: 20 }}
              >
                Curated projects just for you
              </Text>
            </View>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text 
                className="font-inter-medium text-[#008E96]" 
                style={{ fontSize: 14, lineHeight: 21 }}
              >
                View more
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {focusProjects.map((project, index) => (
              <ProjectFocusCard key={index} {...project} />
            ))}
          </ScrollView>
        </View>

        {/* Best Rated Localities Section */}
        <View className="px-4 mb-4 " >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-inter-bold text-[17px] text-[#101828]">Best rated localities in Mohali</Text>
            <TouchableOpacity>
              <Text className="font-inter-medium text-[14px] text-primary">See all</Text>
            </TouchableOpacity>
          </View>

          <View className="relative">
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 27, paddingRight: 20 }}
            >
              <View className="flex-col gap-3">
                {bestLocalities.slice(0, Math.ceil(bestLocalities.length / 2)).map((locality, index) => (
                  <LocalityCard key={`top-${index}`} {...locality} />
                ))}
              </View>
              <View className="flex-col gap-3">
                {bestLocalities.slice(Math.ceil(bestLocalities.length / 2)).map((locality, index) => (
                  <LocalityCard key={`bottom-${index}`} {...locality} />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Top Rated Developers Section */}
        <View className="px-4 ">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="font-inter-bold text-[17px] text-[#101828]">Top rated developers</Text>
              <Text className="font-inter-regular text-[13px] text-[#6A7282]">Projects from the best developers</Text>
            </View>
            <TouchableOpacity>
              <Text className="font-inter-medium text-[14px] text-primary">View more</Text>
            </TouchableOpacity>
          </View>

          {/* Developer Summary Cards */}
          <View className="flex-row items-center ml-4 justify-between gap-4 mb-6">
            {topDevelopers.summary.slice(0, 2).map((dev, index) => (
              <View key={`dev-summary-${index}`} style={{ flex: 1 }}>
                <DeveloperSummaryCard 
                  {...dev} 
                  isActive={activeDeveloperId === dev.id}
                  onPress={() => setActiveDeveloperId(dev.id)}
                />
              </View>
            ))}
          </View>

          {/* Developer Project Cards */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {topDevelopers.projects[activeDeveloperId]?.map((project, index) => (
              <DeveloperProjectCard key={`dev-project-${activeDeveloperId}-${index}`} {...project} />
            ))}
          </ScrollView>
        </View>
            
        {/* Featured Collections Section */}
        <FeaturedCollectionCard />

          {/* Recommended Properties Section */}
        <View className="px-4 py-6">
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
                image={item.image}
                price={item.price}
                title={item.title}
                area={item.area}
                location={item.location}
              />
            ))}
          </ScrollView>
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

        {/* Better Priced Properties Section */}
        <View className="px-4 mb-3">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="font-inter-semibold text-[17px] text-[#101828]">Better Priced Properties</Text>
              <Text className="font-inter-regular text-[13px] text-[#6A7282] mt-0.5">Based on properties you viewed</Text>
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
            {betterPricedProperties.map((property) => (
              <BetterPricedPropertyCard 
                key={property.id}
                image={property.image}
                title={property.title}
                marketer={property.marketer}
                details={property.details}
                priceRange={property.priceRange}
              />
            ))}
          </ScrollView>
        </View>

        {/* Last Searched Section */}
        <View className="px-4 mb-1">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1 mr-4">
              <Text className="font-inter-semibold text-[17px] text-[#101828]">Last Searched</Text>
              <Text className="font-inter-regular text-[13px] text-[#6A7282] mt-0.5">Collection for Ready to Move-In, Buy, Mohali, ...</Text>
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
            {lastSearches.map((item) => (
              <LastSearchedCard 
                key={item.id}
                image={item.image}
                price={item.price}
                title={item.title}
                builder={item.builder}
                location={item.location}
              />
            ))}
          </ScrollView>
        </View>

        {/* Recommended Insights Section */}
        <View className="px-4 ">
          <View className="mb-4">
            <Text className="font-inter-semibold text-[17px] text-[#101828]">Recommended Insights</Text>
            <Text className="font-inter-regular text-[13px] text-[#6A7282] mt-0.5">Based on your Top Preference</Text>
          </View>
          
          <View className="flex-row justify-center w-full" style={{ gap: 12 }}>
            {/* Locality Card */}
            <View 
              style={{
                flex: 1,
                height: 166.33,
                backgroundColor: '#EDFBFA',
                borderWidth: 0.67,
                borderColor: '#F3F4F6',
                borderRadius: 16,
                padding: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 3,
                elevation: 1.5,
                justifyContent: 'space-between'
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center" style={{ gap: 4 }}>
                  <MapPin size={12} color="#364153" />
                  <Text className="font-inter-semibold text-[13px] text-[#101828]">Locality</Text>
                </View>
                <ChevronRight size={14} color="#4A5565" />
              </View>
              <View>
                <Text className="font-inter-regular text-[13px] text-[#364153] mb-2 leading-5">Sector 91</Text>
                <Text className="font-inter-bold text-[13px] text-[#101828] leading-5">63{'\n'}Properties</Text>
              </View>
            </View>

            {/* Price Range Card */}
            <View 
              style={{
                flex: 1,
                height: 166.33,
                backgroundColor: '#EDFBFA',
                borderWidth: 0.67,
                borderColor: '#F3F4F6',
                borderRadius: 16,
                padding: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 3,
                elevation: 1.5,
                justifyContent: 'space-between'
              }}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-row items-start" style={{ gap: 4 }}>
                  <Home size={12} color="#364153" style={{ marginTop: 2, marginLeft: -2 }} />
                  <Text className="font-inter-semibold text-[13px] text-[#101828] leading-3" style={{ width: 50 }}>Price{'\n'}range</Text>
                </View>
                <ChevronRight size={14} color="#4A5565" style={{ marginTop: 2 }} />
              </View>
              <View>
                <Text className="font-inter-regular text-[13px] text-[#364153] mb-2 leading-5">₹ 75 L - ₹ 1 Cr</Text>
                <Text className="font-inter-bold text-[13px] text-[#101828] leading-5">738{'\n'}Properties</Text>
              </View>
            </View>

            {/* BHK Card */}
            <View 
              style={{
                flex: 1,
                height: 166.33,
                backgroundColor: '#EDFBFA',
                borderWidth: 0.67,
                borderColor: '#F3F4F6',
                borderRadius: 16,
                padding: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 3,
                elevation: 1.5,
                justifyContent: 'space-between'
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center" style={{ gap: 4 }}>
                  <LayoutGrid size={12} color="#364153" />
                  <Text className="font-inter-semibold text-[13px] text-[#101828]">BHK</Text>
                </View>
                <ChevronRight size={14} color="#4A5565" />
              </View>
              <View>
                <Text className="font-inter-regular text-[13px] text-[#364153] mb-2 leading-5">3 BHK</Text>
                <Text className="font-inter-bold text-[13px] text-[#101828] leading-5">1958{'\n'}Properties</Text>
              </View>
            </View>
          </View>
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
    </SafeAreaView>
  );
};

export default Buy;
