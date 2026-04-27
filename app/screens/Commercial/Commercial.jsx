
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Check, TrendingUp } from 'lucide-react-native';
import { useEffect, useRef, useState, } from 'react';
import { DeviceEventEmitter, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import NewsCard from '../../../components/NewsCard';
import PropertyCardSmall from '../../../components/PropertyCardSmall';
import SearchBox from '../../../components/SearchBox';
import SellerCard from '../../../components/SellerCard';

import UserHeader from '../../../components/UserHeader';
import { getCategoryRoute, useCategoryTab } from '../../context/CategoryTabContext';
import BottomTabBar from '../../navigation/BottomTabBar';
import CategoryTabs from '../../navigation/CategoryTabs';

const Commercial = () => {
  const { selectedTab, setSelectedTab } = useCategoryTab();
  const skipFirstRedirect = useRef(true);
  const [recentlyAddedTab, setRecentlyAddedTab] = useState('Lease');
  const [activeCollectionId, setActiveCollectionId] = useState(null);

  useEffect(() => {
    setSelectedTab('Commercial');
  }, [setSelectedTab]);

  useEffect(() => {
    if (skipFirstRedirect.current) {
      skipFirstRedirect.current = false;
      return;
    }

    if (selectedTab !== 'Commercial') {
      const targetRoute = getCategoryRoute(selectedTab);
      if (targetRoute) {
        router.replace(targetRoute);
      }
    }
  }, [selectedTab]);



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

  const recentlyAddedProperties = {
    Buy: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=900',
        price: '₹40 L',
        title: 'Office Space',
        area: '800 sqft',
        location: 'Sector 62, Mohali',
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&q=80&w=900',
        price: '₹85 L',
        title: 'Showroom',
        area: '1200 sqft',
        location: 'Phase 7, Mohali',
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=900',
        price: '₹55 L',
        title: 'Co-working Space',
        area: '950 sqft',
        location: 'IT Park, Mohali',
      },
      {
        id: 4,
        image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=900',
        price: '₹65 L',
        title: 'Retail Shop',
        area: '600 sqft',
        location: 'Sector 70, Mohali',
      },
    ],
    Lease: [
      {
        id: 5,
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=900',
        price: '₹40 L',
        title: 'Office Space',
        area: '800 sqft',
        location: 'Sector 62, Mohali',
      },
      {
        id: 6,
        image: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&q=80&w=900',
        price: '₹85 L',
        title: 'Showroom',
        area: '1200 sqft',
        location: 'Phase 7, Mohali',
      },
      {
        id: 7,
        image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=900',
        price: '₹55 L',
        title: 'Co-working Space',
        area: '950 sqft',
        location: 'IT Park, Mohali',
      },
      
    ],
  };

  const recommendedForYou = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=900',
      price: '₹40 L',
      title: 'Office Space',
      area: '800 sqft',
      location: 'Sector 62, Mohali',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=900',
      price: '₹85 L',
      title: 'Showroom',
      area: '1200 sqft',
      location: 'Phase 7, Mohali',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=900',
      price: '₹55 L',
      title: 'Co-working Space',
      area: '950 sqft',
      location: 'IT Park, Mohali',
    },
  ];

  const curatedCollections = [
    {
      id: 1,
      title: 'Office Space',
      subtitle: 'Under 50 Lacs',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=900',
    },
    {
      id: 2,
      title: 'Retail Shop',
      subtitle: 'High Footfall',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=900',
    },
    {
      id: 3,
      title: 'Showroom',
      subtitle: 'Prime Location',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=900',
    },
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
        <View className="mx-4 mt-2  p-4 rounded-[32px] bg-[#E6F4F5]">
          <CategoryTabs
            activeTab={selectedTab}
            onTabPress={setSelectedTab}
            mode="Commercial"
          />

          <SearchBox onPress={() => router.push('/screens/Commercial/CommercialSearch')} />
          
        </View>

        <View className="mt-3 mx-4">
            <View
              className="w-full flex-row items-center gap-3 rounded-xl border border-[#E4E7EC] bg-white p-3"
              style={{
                minHeight: 73,
                borderWidth: 0.6667,
              }}
            >
              <LinearGradient
                colors={[
                  '#FEF3C7',
                  '#FEF2C2',
                  '#FEF1BD',
                  '#FEEFB4',
                  '#FEEEAF',
                  '#FDECA5',
                  '#FDEA9F',
                  '#FDE895',
                  '#FDE68A',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-12 w-12 items-center justify-center rounded-[10px]"
              >
                <TrendingUp size={24} color="#F59E0B" strokeWidth={2} />
              </LinearGradient>

              <View className="flex-1">
                <Text className="font-inter-semibold text-[15px] leading-[19px] text-[#101828]">
                  Properties with Great Returns!
                </Text>
                <Text className="mt-0.5 font-inter-regular text-[13px] leading-[16px] text-[#6A7282]">
                  Explore high ROI investments
                </Text>
              </View>
            </View>
          </View>

        <View className="mx-4 pb-2 my-4">
          <LinearGradient
            colors={[
              'rgba(0,142,150,0.08)',
              'rgba(11,155,157,0.08)',
              'rgba(19,165,162,0.08)',
              'rgba(28,178,169,0.08)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl border border-[#008E9633] p-4"
            style={{ minHeight: 231, borderWidth: 0.6667 }}
          >
            <Text className="font-inter-semibold text-[17px] leading-[23px] text-[#101828]">
              Are you a property owner looking to{`\n`}rent/sell?
            </Text>

            <View className="mt-5 gap-2">
              {['Zero Brokerage', 'Verified leads', 'On-demand assistance'].map((item) => (
                <View key={item} className="flex-row items-center">
                  <View className="h-5 w-5 items-center justify-center rounded-full bg-[#008E96]">
                    <Check size={12} color="#FFFFFF" strokeWidth={2.2} />
                  </View>
                  <Text className="ml-2 font-inter-regular text-[14px] leading-[21px] text-[#4A5565]">
                    {item}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              className="mt-5 h-11 items-center justify-center rounded-xl bg-[#008E96]"
            >
              <Text className="font-inter-semibold text-[15px] leading-[22px] text-white">
                Post property for FREE
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View className="mt-1 px-4">
          <View className="mb-2 flex-row items-start justify-between">
            <View>
              <Text className="font-inter-semibold text-[22px] leading-[33px] text-[#101828]">
                Recently Added
              </Text>
              <Text className="font-inter-regular text-[13px] leading-5 text-[#6A7282]">
                Fresh listings in your area
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="font-inter-semibold text-[14px] leading-[21px] text-[#008E96]">See all</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-3 mt-1 flex-row items-center gap-2">
            {['Buy', 'Lease'].map((tab) => {
              const isActive = recentlyAddedTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  activeOpacity={0.85}
                  onPress={() => setRecentlyAddedTab(tab)}
                  className="h-[38px] items-center justify-center rounded-full px-9"
                  style={{
                    borderWidth: 0.6667,
                    borderColor: isActive ? '#008E96' : '#E4E7EC',
                    backgroundColor: isActive ? 'rgba(0, 142, 150, 0.1)' : '#FFFFFF',
                  }}
                >
                  <Text
                    className="font-inter-medium text-[14px] leading-[21px]"
                    style={{ color: isActive ? '#008E96' : '#4A5565' }}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-4">
            {recentlyAddedProperties[recentlyAddedTab].map((property) => (
              <View key={property.id} className="w-[48%]">
                <PropertyCardSmall
                  image={property.image}
                  price={property.price}
                  title={property.title}
                  area={property.area}
                  location={property.location}
                />
              </View>
            ))}
          </View>
        </View>

       

     


          {/* Recommended Sellers Section */}
        <View className="px-4 my-3">
          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text className="font-inter-semibold text-[17px] text-[#101828]">Recommended Sellers</Text>
              <Text className="font-inter-regular text-[13px] text-[#6A7282] mt-0.5">Sellers with complete knowledge about locality</Text>
            </View>
            <TouchableOpacity>
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

        <View className="mt-1 mb-4">
          <View className="px-4 mb-4 flex-row items-center justify-between">
            <View>
              <Text className="font-inter-semibold text-[22px] leading-[33px] text-[#101828]">
                Recommended for You
              </Text>
              <Text className="font-inter-regular text-[13px] leading-5 text-[#6A7282]">
                Based on your preferences
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="font-inter-semibold text-[14px] leading-[21px] text-[#008E96]">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {recommendedForYou.map((property) => (
              <View key={property.id} style={{ width: 168, height: 257.08, marginRight: 12 }}>
                <PropertyCardSmall
                  image={property.image}
                  price={property.price}
                  title={property.title}
                  area={property.area}
                  location={property.location}
                  containerStyle={{ width: '100%' }}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="mt-1 mb-4">
          <View className="px-4 mb-3 flex-row items-center justify-between">
            <View>
              <Text className="font-inter-semibold text-[22px] leading-[33px] text-[#101828]">
                Curated Collections
              </Text>
              <Text className="font-inter-regular text-[13px] leading-5 text-[#6A7282]">
                Handpicked properties for you
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 18, gap: 18 }}
          >
            {curatedCollections.map((collection, index) => {
              const isActive = activeCollectionId === collection.id;

              return (
                <Pressable
                  key={collection.id}
                  onPressIn={() => setActiveCollectionId(collection.id)}
                  onPressOut={() => setActiveCollectionId(null)}
                  onHoverIn={() => setActiveCollectionId(collection.id)}
                  onHoverOut={() => setActiveCollectionId(null)}
                  style={{
                    width: index === 0 ? 168 : 161,
                    height: 180,
                    borderRadius: 16,
                    overflow: 'hidden',
                    backgroundColor: 'rgba(0, 142, 150, 0.15)',
                  }}
                >
                  <ImageBackground
                    source={{ uri: collection.image }}
                    resizeMode="cover"
                    style={{ flex: 1, opacity: isActive ? 1 : 0.4 }}
                  >
                    <LinearGradient
                      colors={isActive ? ['rgba(0,0,0,0)', 'rgba(0,0,0,0.12)'] : ['rgba(0,0,0,0)', 'rgba(0,142,150,0.3)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={StyleSheet.absoluteFillObject}
                    />

                    <View className="absolute inset-0 justify-end p-4">
                      <Text
                        className="font-inter-semibold text-[17px] leading-[21px] text-center"
                        style={{ color: isActive ? '#FFFFFF' : '#101828' }}
                        numberOfLines={1}
                      >
                        {collection.title}
                      </Text>
                      <Text
                        className="font-inter-medium text-[13px] leading-5 text-center"
                        style={{ color: isActive ? '#FFFFFF' : '#4A5565' }}
                        numberOfLines={1}
                      >
                        {collection.subtitle}
                      </Text>
                    </View>
                  </ImageBackground>
                </Pressable>
              );
            })}
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


      </ScrollView>
      <BottomTabBar mode="Commercial" activeTab="Search" />
    </SafeAreaView>
  );
};

export default Commercial;
