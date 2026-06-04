
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Check, TrendingUp } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, DeviceEventEmitter, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import NewsCard from '../../../components/NewsCard';
import PropertyCardSmall from '../../../components/PropertyCardSmall';
import SearchBox from '../../../components/SearchBox';
import SellerCard from '../../../components/SellerCard';

import UserHeader from '../../../components/UserHeader';
import { useLookup } from '../../../hooks/useLookup';
import { usePropertyDiscovery } from '../../../hooks/usePropertyDiscovery';
import { getCategoryRoute, useCategoryTab } from '../../context/CategoryTabContext';
import { useLocation } from '../../context/LocationContext';
import BottomTabBar from '../../navigation/BottomTabBar';
import CategoryTabs from '../../navigation/CategoryTabs';
import { formatPrice } from '../../utils/formatPrice';

const getLocationLabel = (value) => {
  if (!value) return '';

  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    if (!trimmedValue || /^[a-f0-9]{24}$/i.test(trimmedValue)) return '';
    return trimmedValue;
  }

  if (typeof value === 'object') {
    return value.name || value.label || value.title || '';
  }

  return '';
};

const formatPropertyLocation = (property) => {
  const directAddress = typeof property?.address === 'string' ? property.address.trim() : '';
  if (directAddress) return directAddress;

  const locality = getLocationLabel(property?.localityName || property?.locality);
  const city = getLocationLabel(property?.city);
  const state = getLocationLabel(property?.state);

  return [locality, city, state].filter(Boolean).join(', ') || 'Location not available';
};

const Commercial = () => {
  const { selectedTab, setSelectedTab } = useCategoryTab();
  const skipFirstRedirect = useRef(true);
  const [recentlyAddedTab, setRecentlyAddedTab] = useState('Lease');
  const { propertyTypes, fetchSingleLookup } = useLookup();
  const { findPropertiesByLocation, fetchSellersByLocation } = usePropertyDiscovery();
  const { currentLocation } = useLocation();

  const [recentlyAddedProperties, setRecentlyAddedProperties] = useState({
    Buy: [],
    Lease: []
  });
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [sellers, setSellers] = useState([]);
  const [recommendedForYou, setRecommendedForYou] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(false);

  const loadRecommended = useCallback(async (locationParams = {}, commercialTypeId = null) => {
    setLoadingRecommended(true);
    try {
      const params = {
        limit: 6,
        ...locationParams
      };
      if (commercialTypeId) {
        params.propertyType = commercialTypeId;
      }
      const res = await findPropertiesByLocation(params);
      const data = Array.isArray(res) ? res : (res?.data || []);
      const mapped = data.map((p, index) => ({
        id: p._id || p.id || `rec-${index}`,
        image: p.images?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=900',
        price: typeof p.price === 'number' ? `₹ ${formatPrice(p.price)}` : p.price || p.priceRange || 'Price on Request',
        title: p.title || p.projectName || 'Commercial Space',
        area: `${p.area || 'N/A'} ${p.areaUnit?.name || p.areaUnit?.label || 'sqft'}`,
        location: formatPropertyLocation(p)
      }));
      setRecommendedForYou(mapped);
    } catch (err) {
      console.error("Recommended Properties API Error:", err);
    } finally {
      setLoadingRecommended(false);
    }
  }, [findPropertiesByLocation]);

  const loadSellers = useCallback(async (locationParams = {}) => {
    try {
      const res = await fetchSellersByLocation({
        limit: 10,
        ...locationParams
      });
      if (res.success) {
        const data = Array.isArray(res.data) ? res.data : [];
        const mapped = data.map((seller, index) => ({
          id: seller._id || seller.id || `seller-${index}`,
          name: seller.name || seller.user?.name || seller.sellerName || 'Seller',
          experienceYears: String(seller.experienceYears || seller.yearsExperience || seller.experience || '5'),
          propertiesCount: String(seller.propertyCount || seller.propertiesCount || seller.totalProperties || (seller.properties && seller.properties.length) || '0'),
          avatar: seller.avatar || seller.user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
          tags: seller.tags || ['Commercial', 'Verified']
        }));
        setSellers(mapped);
      }
    } catch (err) {
      console.error("Sellers API Error:", err);
    }
  }, [fetchSellersByLocation]);

  const loadRecentlyAdded = useCallback(async (locationParams = {}, commercialTypeId = null) => {
    setLoadingProperties(true);
    try {
      const paramsBuy = {
        limit: 4,
        lookingFor: 'sell',
        propertyType: '69eb2e93fbd6e001ae0e5ab7',
        ...locationParams
      };
      const paramsLease = {
        limit: 4,
        lookingFor: 'rent',
        propertyType: '69eb2e93fbd6e001ae0e5ab7',
        ...locationParams
      };

      if (commercialTypeId) {
        paramsBuy.propertyType = commercialTypeId;
        paramsLease.propertyType = commercialTypeId;
      }

      const [buyRes, leaseRes] = await Promise.all([
        findPropertiesByLocation(paramsBuy).catch(err => { console.error(err); return null; }),
        findPropertiesByLocation(paramsLease).catch(err => { console.error(err); return null; })
      ]);

      const mapProperties = (res) => {
        const data = Array.isArray(res) ? res : (res?.data || []);
        return data.map((p, index) => ({
          id: p._id || p.id || `commercial-${index}`,
          image: p.images?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=900',
          price: typeof p.price === 'number' ? `₹ ${formatPrice(p.price)}` : p.price || p.priceRange || 'Price on Request',
          title: p.title || p.projectName || 'Commercial Space',
          area: `${p.area || 'N/A'} ${p.areaUnit?.name || p.areaUnit?.label || 'sqft'}`,
          location: formatPropertyLocation(p)
        }));
      };

      setRecentlyAddedProperties({
        Buy: buyRes ? mapProperties(buyRes) : [],
        Lease: leaseRes ? mapProperties(leaseRes) : []
      });
    } catch (err) {
      console.error("Error loading recently added commercial properties:", err);
    } finally {
      setLoadingProperties(false);
    }
  }, [findPropertiesByLocation]);

  useEffect(() => {
    fetchSingleLookup('propertyTypes');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!propertyTypes || propertyTypes.length === 0) return;
    const commercialType = propertyTypes.find(pt =>
      (pt.label || pt.name || '').toLowerCase() === 'commercial'
    );
    const city = currentLocation?.city || 'Mohali';
    loadRecentlyAdded({ city }, commercialType?._id);
    loadSellers({ city });
    loadRecommended({ city }, commercialType?._id);
  }, [currentLocation?.city, propertyTypes, loadRecentlyAdded, loadSellers, loadRecommended]);

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



  const sellerColumns = sellers.reduce((cols, seller, index) => {
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
              onPress={() => router.push('/screens/PostProperty/PropertyDetails')}
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
            <TouchableOpacity
              onPress={() => {
                const commercialType = propertyTypes.find(pt => 
                  (pt.label || pt.name || '').toLowerCase() === 'commercial'
                );
                router.push({
                  pathname: '/screens/RecentlyAddedProperties',
                  params: {
                    city: currentLocation?.city || 'Mohali',
                    lookingFor: recentlyAddedTab === 'Buy' ? 'sell' : 'rent',
                    propertyType: commercialType?._id || ''
                  }
                });
              }}
            >
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

          {loadingProperties ? (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator color="#008E96" />
            </View>
          ) : recentlyAddedProperties[recentlyAddedTab] && recentlyAddedProperties[recentlyAddedTab].length > 0 ? (
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
          ) : (
            <View className="rounded-[12px] bg-white border border-[#F3F4F6] px-4 py-6 items-center justify-center">
              <Text className="font-inter-medium text-[13px] text-[#6A7282] text-center">No properties available in this location.</Text>
            </View>
          )}
        </View>






        {/* Recommended Sellers Section */}
        <View className="px-4 my-3">
          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text className="font-inter-semibold text-[17px] text-[#101828]">Recommended Sellers</Text>
              <Text className="font-inter-regular text-[13px] text-[#6A7282] mt-0.5">Sellers with complete knowledge about locality</Text>
            </View>
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
            <TouchableOpacity
              onPress={() => {
                const commercialType = propertyTypes.find(pt =>
                  (pt.label || pt.name || '').toLowerCase() === 'commercial'
                );
                router.push({
                  pathname: '/screens/RecommendedProperties',
                  params: {
                    city: currentLocation?.city || 'Mohali',
                    propertyType: commercialType?._id || ''
                  }
                });
              }}
            >
              <Text className="font-inter-semibold text-[14px] leading-[21px] text-[#008E96]">See all</Text>
            </TouchableOpacity>
          </View>

          {loadingRecommended ? (
            <View className="py-6 items-center justify-center">
              <ActivityIndicator color="#008E96" />
            </View>
          ) : recommendedForYou.length > 0 ? (
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
          ) : (
            <View className="mx-4 rounded-[12px] bg-white border border-[#F3F4F6] px-4 py-6 items-center justify-center">
              <Text className="font-inter-medium text-[13px] text-[#6A7282] text-center">No recommendations available in this location.</Text>
            </View>
          )}
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
                  onPress={() => {
                    const commercialType = propertyTypes.find(pt => 
                      (pt.label || pt.name || '').toLowerCase() === 'commercial'
                    );
                    const subPropertyType = collection.id === 1 
                      ? '69eb2e93fbd6e001ae0e5ab7' // Office Space
                      : '69eb37240c4ec2f23333732f'; // Retail Shop / Showroom
                    
                    router.push({
                      pathname: '/screens/CuratedProperties',
                      params: {
                        title: collection.title,
                        subPropertyType,
                        city: currentLocation?.city || 'Mohali',
                        propertyType: commercialType?._id || ''
                      }
                    });
                  }}
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
