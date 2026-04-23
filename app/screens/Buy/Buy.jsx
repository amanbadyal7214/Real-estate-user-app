import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronDown, ChevronRight, Search, User } from 'lucide-react-native';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
        <View className="px-4 mb-10">
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
        <View className="px-4 mb-10" style={{ gap: 16 }}>
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
        <View className="px-4 mb-10" style={{ gap: 16 }}>
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
        <View className="px-4 " style={{ height: 359 }}>
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
        <View className="px-4 mb-10">
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
              <Text className="font-inter-bold text-[20px] text-[#101828]">Recommended Properties</Text>
              <Text className="font-inter-regular text-[14px] text-[#667085]">Properties matching your requirements</Text>
            </View>
            <TouchableOpacity>
              <Text className="font-inter-semibold text-[16px] text-[#008E96]">See all</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {recommendedProperties.map((item) => (
              <View key={item.id} className="mr-4 bg-white rounded-[24px] p-3 flex-row items-center border border-gray-100 shadow-sm" style={{ width: 340 }}>
                <Image 
                  source={{ uri: item.image }} 
                  className="w-[140px] h-[140px] rounded-[16px]"
                  resizeMode="cover"
                />
                <View className="flex-1 ml-4 py-1">
                  <Text className="font-inter-bold text-[18px] text-[#101828] mb-1">{item.price}</Text>
                  <Text className="font-inter-semibold text-[15px] text-[#101828] mb-2" numberOfLines={1}>{item.title}</Text>
                  <Text className="font-inter-regular text-[13px] text-[#667085] mb-1">{item.area}</Text>
                  <Text className="font-inter-regular text-[13px] text-[#667085]" numberOfLines={1}>{item.location}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Buy;
