import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ChevronRight, Home, LayoutGrid, MapPin } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ActivityIndicator, DeviceEventEmitter, Dimensions, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BetterPricedPropertyCard from '../../../components/BetterPricedPropertyCard';
import CalculatorCard from '../../../components/CalculatorCard';
import ContinueCards from '../../../components/ContinueCards';
import DeveloperProjectCard from '../../../components/DeveloperProjectCard';
import DeveloperSummaryCard from '../../../components/DeveloperSummaryCard';
import ExploreLocalityCard from '../../../components/ExploreLocalityCard';
import HighDemandProjectCard from '../../../components/HighDemandProjectCard';
import LastSearchedCard from '../../../components/LastSearchedCard';
import LocalityCard from '../../../components/LocalityCard';
import NewsCard from '../../../components/NewsCard';
import ProjectFocusCard from '../../../components/ProjectFocusCard';
import PropertyMatchedCards from '../../../components/PropertyMatchedCards';
import RecommendedPropertyCard from '../../../components/RecommendedPropertyCard';
import RecommendedSellerCard from '../../../components/RecommendedSellerCard';
import SearchBox from '../../../components/SearchBox';
import Spotlight from '../../../components/Spotlight';
import UserHeader from '../../../components/UserHeader';
import { useLocalityAveragePrice } from '../../../hooks/useLocalityAveragePrice';
import { useProject } from '../../../hooks/useProject';
import { usePropertyDiscovery } from '../../../hooks/usePropertyDiscovery';
import { useUserActivity } from '../../../hooks/useUserActivity';
import { getCategoryRoute, useCategoryTab } from '../../context/CategoryTabContext';
import { useLocation } from '../../context/LocationContext';
import BottomTabBar from '../../navigation/BottomTabBar';
import CategoryTabs from '../../navigation/CategoryTabs';

import { formatPrice, formatPricePerSqft } from '../../utils/formatPrice';

const developerProjectsCache = new Map();

const formatLocalityName = (value, index) => {
  if (!value || typeof value !== 'string') {
    return `Locality ${index + 1}`;
  }

  const trimmedValue = value.trim();
  const looksLikeId = /^[a-f0-9]{24}$/i.test(trimmedValue);

  if (looksLikeId) {
    return `Locality ${index + 1}`;
  }

  return trimmedValue
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

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

const Buy = () => {
  const isFocused = useIsFocused();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { fetchRecentlyViewed, recentlyViewed } = useUserActivity();

  useEffect(() => {
    const checkLogin = async () => {
      const token = await SecureStore.getItemAsync('token');
      setIsLoggedIn(!!token);
      if (token) {
        fetchRecentlyViewed().catch(err => console.error("Error fetching recently viewed in Buy screen:", err));
      }
    };
    if (isFocused) {
      checkLogin();
    }
  }, [isFocused, fetchRecentlyViewed]);

  const { selectedTab, setSelectedTab } = useCategoryTab();
  const { currentLocation } = useLocation();
  const { findPropertiesByLocation, fetchHighDemandProperties, fetchSellersByLocation, fetchBetterPricedProperties, fetchCityStats, loading: discoveryLoading } = usePropertyDiscovery();
  const { fetchAveragePriceByCity, loading: localityLoading, error: localityError } = useLocalityAveragePrice();
  const { fetchProjects, fetchDevelopers, fetchDeveloperProjects } = useProject();
  const [properties, setProperties] = useState([]);
  const [highDemandProperties, setHighDemandProperties] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [betterPricedProperties, setBetterPricedProperties] = useState([]);
  const [cityStats, setCityStats] = useState(null);
  const [exploreLocalities, setExploreLocalities] = useState([]);
  const [focusProjects, setFocusProjects] = useState([]);
  const [topDevelopersList, setTopDevelopersList] = useState([]);
  const [developerProjectsById, setDeveloperProjectsById] = useState({});
  const [activeDeveloperId, setActiveDeveloperId] = useState(null);
  const [activeDeveloperProjectsLoading, setActiveDeveloperProjectsLoading] = useState(false);
  const skipFirstRedirect = useRef(true);

  

  const handleProtectedViewMore = useCallback(async (destination) => {
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
  }, []);

  useEffect(() => {
    setSelectedTab('Buy');
  }, [setSelectedTab]);

  const fetchData = useCallback(async (locationParams = {}) => {
    try {
      const res = await findPropertiesByLocation({
        lookingFor: 'sell',
        limit: 4,
        ...locationParams
      });
      if (res.success) setProperties(res.data);
    } catch (err) {
      console.error("Discovery API Error:", err);
    }
  }, [findPropertiesByLocation]);

  const loadHighDemand = useCallback(async (locationParams = {}) => {
    try {
      const res = await fetchHighDemandProperties({
        limit: 4,
        lookingFor: 'sell', // Filtering for Buy/Sell as this is the Buy screen
        ...locationParams
      });
      if (res.success) setHighDemandProperties(res.data);
    } catch (err) {
      console.error("High Demand API Error:", err);
    }
  }, [fetchHighDemandProperties]);

  const loadSellers = useCallback(async (locationParams = {}) => {
    try {
      const res = await fetchSellersByLocation({
        limit: 10,
        ...locationParams
      });
      if (res.success) setSellers(res.data);
    } catch (err) {
      console.error("Sellers API Error:", err);
    }
  }, [fetchSellersByLocation]);

  const loadBetterPriced = useCallback(async (locationParams = {}) => {
    try {
      const res = await fetchBetterPricedProperties({
        limit: 4,
        city: currentLocation?.city || 'Mohali',
        lookingFor: 'sell',
        PriceAscending: true,
        ...locationParams,
      });

      const source = Array.isArray(res) ? res : (res?.data || []);
      const transformed = source.slice(0, 4).map((property, index) => ({
        id: property._id || property.id || `better-priced-${index}`,
        image: property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
        title: property.address || property.locality || property.title || 'Property',
        marketer: property.sellerName || property.projectName || 'Developer',
        details: `${property.area || 'N/A'} sq.ft. • ${formatPropertyLocation(property)}`,
        priceRange: property.price || property.priceRange || 'View details'
      }));

      setBetterPricedProperties(transformed);
    } catch (err) {
      console.error("Better Priced API Error:", err);
      setBetterPricedProperties([]);
    }
  }, [fetchBetterPricedProperties, currentLocation?.city]);

  const loadCityStats = useCallback(async (city) => {
    try {
      const res = await fetchCityStats({ city: city || 'Mohali' });
      if (res?.success) setCityStats(res.data);
    } catch (err) {
      console.error("City Stats API Error:", err);
    }
  }, [fetchCityStats]);

  const loadExploreLocalities = useCallback(async (city) => {
    try {
      const res = await fetchAveragePriceByCity(city || 'Mohali');
      if (res?.success) {
        setExploreLocalities(Array.isArray(res.data) ? res.data : []);
      } else {
        setExploreLocalities([]);
      }
    } catch (err) {
      console.error("Average price API Error:", err);
      setExploreLocalities([]);
    }
  }, [fetchAveragePriceByCity]);

  const loadFocusProjects = useCallback(async (locationParams = {}) => {
    try {
      const res = await fetchProjects({
        isFocus: true, // Assuming your API supports this flag for "Project in Focus"
        limit: 5,
        ...locationParams
      });
      // Handle array response based on your API structure (the tool showed response.data)
      if (res) setFocusProjects(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      console.error("Projects API Error:", err);
    }
  }, [fetchProjects]);

  const loadTopDevelopers = useCallback(async (locationParams = {}) => {
    try {
      const res = await fetchDevelopers({
        ...locationParams
      });

      if (res.success) {
        setTopDevelopersList(res.data);
        if (!activeDeveloperId && res.data.length > 0) {
          setActiveDeveloperId(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error("Developers API Error:", err);
    }
  }, [fetchDevelopers, activeDeveloperId]);

  const loadDeveloperProjects = useCallback(async (developerId) => {
    if (!developerId) {
      return;
    }

    if (developerProjectsCache.has(developerId)) {
      setDeveloperProjectsById((current) => ({
        ...current,
        [developerId]: developerProjectsCache.get(developerId),
      }));
      return developerProjectsCache.get(developerId);
    }

    setActiveDeveloperProjectsLoading(true);
    try {
      const res = await fetchDeveloperProjects(developerId);
      const projects = res?.data || [];
      developerProjectsCache.set(developerId, projects);
      setDeveloperProjectsById((current) => ({
        ...current,
        [developerId]: projects,
      }));
      return projects;
    } catch (err) {
      console.error("Developer Projects API Error:", err);
      setDeveloperProjectsById((current) => ({
        ...current,
        [developerId]: [],
      }));
      return [];
    } finally {
      setActiveDeveloperProjectsLoading(false);
    }
  }, [fetchDeveloperProjects]);

  const spotlightData = topDevelopersList.slice(0, 2).map((dev) => {
    const developerProjects = developerProjectsById[dev._id] || [];
    const firstProject = developerProjects[0] || {};


    return {
      id: dev._id,
      developer: {
        name: dev.builderInfo?.name || 'Developer',
        estd: '2024',
        projects: String(dev.projectCount || developerProjects.length || 1),
      },
      property: {
        id: firstProject._id,
        title: firstProject.projectName || firstProject.title || 'Project',
        location: `${firstProject.addressLine1 || firstProject.locality || ''}, ${firstProject.district || firstProject.city || ''}`,
        config: firstProject.config || firstProject.possessionStatus?.label || 'Project',
        priceRange: firstProject.priceRange || firstProject.price || 'View details',
        image: firstProject.media?.[0]?.fileUrl || firstProject.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop',
      }
    };
  });

  const handleDeveloperSelect = useCallback((developerId) => {
    setActiveDeveloperId(developerId);
    loadDeveloperProjects(developerId);
  }, [loadDeveloperProjects]);

  useEffect(() => {
    if (!activeDeveloperId) {
      return;
    }

    if (developerProjectsById[activeDeveloperId]) {
      return;
    }

    loadDeveloperProjects(activeDeveloperId);
  }, [activeDeveloperId, developerProjectsById, loadDeveloperProjects]);

  // Preload projects for top 2 developers for spotlight section
  useEffect(() => {
    if (topDevelopersList.length < 2) {
      return;
    }

    const firstDevId = topDevelopersList[0]._id;
    const secondDevId = topDevelopersList[1]._id;

    const loadBoth = async () => {
      if (!developerProjectsById[firstDevId]) {
        await loadDeveloperProjects(firstDevId);
      }
      if (!developerProjectsById[secondDevId]) {
        await loadDeveloperProjects(secondDevId);
      }
    };

    loadBoth();
  }, [topDevelopersList, developerProjectsById, loadDeveloperProjects]);

  useEffect(() => {
    const locationCity = currentLocation?.city || 'Mohali';

    fetchData({ city: locationCity });
    loadHighDemand({ city: locationCity });
    loadSellers({ city: locationCity });
    loadBetterPriced({ city: locationCity });
    loadExploreLocalities(locationCity);
    loadFocusProjects({ city: locationCity });
    loadCityStats(locationCity);
    loadTopDevelopers({ city: locationCity });
  }, [currentLocation?.city, fetchData, loadHighDemand, loadSellers, loadBetterPriced, loadExploreLocalities, loadFocusProjects, loadCityStats, loadTopDevelopers]);

  const handleLocationUpdate = (loc) => {
    // Location updating is now handled by LocationContext inside SearchBox
    console.log("📍 Dashboard notified of location change:", loc);
  };

  useEffect(() => {
    if (skipFirstRedirect.current) {
      skipFirstRedirect.current = false;
      return;
    }

    if (selectedTab !== 'Buy') {
      const targetRoute = getCategoryRoute(selectedTab);
      if (targetRoute) {
        router.replace(targetRoute);
      }
    }
  }, [selectedTab]);



  const continueData = recentlyViewed.slice(0, 4).map((item) => {
    const property = item.property || item;
    return {
      id: property._id || property.id,
      title: property.title || property.projectName || 'Property',
      subtitle: formatPropertyLocation(property) || 'Mohali',
    };
  });

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

  const lastSearchedData = recentlyViewed.length > 0 ? recentlyViewed.slice(0, 4).map((item) => {
    const property = item.property || item;
    return {
      id: property._id || property.id,
      image: property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400&auto=format&fit=crop&q=80&w=400',
      price: typeof property.price === 'number' ? formatPrice(property.price) : (property.priceRange || property.price || 'Price on Request'),
      title: property.title || property.projectName || 'Property',
      builder: property.sellerName || property.projectName || 'Developer',
      location: formatPropertyLocation(property) || 'Mohali',
    };
  }) : lastSearches;

  const recommendedProperties = properties.slice(0, 4).map((property, index) => ({
    id: property._id || property.id || `recommended-${index}`,
    image: property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
    price: typeof property.price === 'number' ? `₹ ${property.price}` : property.price || property.priceRange || 'View details',
    title: property.title || property.projectName || 'Property',
    area: `${property.residential?.bedrooms || property.bhk || property.bedrooms || 'N/A'} BHK • ${property.area || 'N/A'} ${property.areaUnit?.name || 'sq.ft.'}`,
    location: formatPropertyLocation(property),
  }));


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

  const bestLocalities = [...exploreLocalities]
    .sort((a, b) => (Number(b.averagePricePerSqft) || 0) - (Number(a.averagePricePerSqft) || 0))
    .slice(0, 6)
    .map((item, index) => ({
      title: item.localityName || formatLocalityName(item.locality, index),
      rating: '4.5',
      reviews: String(item.totalProperties || 0),
      price: formatPricePerSqft(item.averagePricePerSqft),
    }));

  const visibleLocalities = bestLocalities.slice(0, 4);

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
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
      >
        {/* Main Category Blue Container */}
        <View className="mx-2 mt-2 p-3 rounded-[24px] bg-[#E6F4F5]">
          <CategoryTabs
            activeTab={selectedTab}
            onTabPress={setSelectedTab}
          />

          <SearchBox onLocationUpdate={handleLocationUpdate} />
        </View>

        {/* Continue where you left Section */}
        {isLoggedIn && <ContinueCards data={continueData} />}



        {/* Matches Section */}
        <View className="px-4 mt-8 mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-inter-bold text-[16px] text-[#101828]">Top picks for you</Text>
            <TouchableOpacity
              onPress={() => handleProtectedViewMore({
                pathname: '/screens/PrefectlyMatchedHome',
                params: {
                  city: currentLocation?.city,
                  pincode: currentLocation?.pincode,
                  locality: currentLocation?.locality
                }
              })}
            >
              <Text className="font-inter-medium text-[12px] text-primary">View more</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[12px] text-[#667085] mb-4">Homes built by people you can trust</Text>

          {discoveryLoading ? (
            <ActivityIndicator color="#008E96" />
          ) : (
            <PropertyMatchedCards
              data={properties.map(p => ({
                id: p._id,
                _id: p._id,
                images: p.images?.length > 0 ? p.images : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400'],
                developer: p.projectName || "Standard",
                title: p.title,
                location: formatPropertyLocation(p),
                priceRange: p.price,
              }))}
            />
          )}
          <Spotlight data={spotlightData} />
        </View>



        {/* Popular on The Property Wall Section */}
        <View className="px-4 mb-6">
          {/* Section Header */}
          <View className="flex-row items-center gap-2 mb-4">
            <Text className="text-[#FB2C36] text-[18px]">⭐</Text>
            <Text className="font-inter-bold text-[15px] text-[#101828]">Popular on The Property Wall</Text>
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
              <TouchableOpacity
                onPress={() => handleProtectedViewMore('/screens/Buy/Suggestions')}
                className="items-center"
                style={{ width: wp('26.7%') }}
              >
                <View className="w-12 h-12 bg-[#DBEAEB]/45 rounded-[14px] items-center justify-center mb-2" style={{ width: wp('12.8%'), height: wp('12.8%'), borderRadius: wp('3.7%') }}>
                  <Ionicons name="bulb-outline" size={wp('6.4%')} color="#008E96" />
                </View>
                <Text className="font-inter-medium text-[12px] text-[#364153] text-center leading-[18px]">Top Picks</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleProtectedViewMore('/screens/BestPriceProperty')}
                className="items-center" style={{ width: wp('26.7%') }}>
                <View className="w-12 h-12 bg-[#DBEAEB]/45 rounded-[14px] items-center justify-center mb-2" style={{ width: wp('12.8%'), height: wp('12.8%'), borderRadius: wp('3.7%') }}>
                  <Ionicons name="pricetag-outline" size={wp('6.4%')} color="#008E96" />
                </View>
                <Text className="font-inter-medium text-[12px] text-[#364153] text-center leading-[18px]">Best Offers</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleProtectedViewMore('/screens/NewsForYou')}
                className="items-center" style={{ width: wp('26.7%') }}>
                <View className="w-12 h-12 bg-[#DBEAEB]/45 rounded-[14px] items-center justify-center mb-2" style={{ width: wp('12.8%'), height: wp('12.8%'), borderRadius: wp('3.7%') }}>
                  <Ionicons name="newspaper-outline" size={wp('6.4%')} color="#008E96" />
                </View>
                <Text className="font-inter-medium text-[12px] text-[#364153] text-center leading-[18px]">Market Updates</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-around">
              <TouchableOpacity
                onPress={() => router.push('/screens/EMICalculator')}
                className="items-center" style={{ width: wp('26.7%') }}>
                <View className="w-12 h-12 bg-[#DBEAEB]/45 rounded-[14px] items-center justify-center mb-2" style={{ width: wp('12.8%'), height: wp('12.8%'), borderRadius: wp('3.7%') }}>
                  <Ionicons name="calculator-outline" size={wp('6.4%')} color="#008E96" />
                </View>
                <Text className="font-inter-medium text-[11px] text-[#364153] text-center leading-[14px]">Payment Plan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/screens/AffordabilityCalculator')}
                className="items-center" style={{ width: wp('26.7%') }}>
                <View className="w-12 h-12 bg-[#DBEAEB]/45 rounded-[14px] items-center justify-center mb-2" style={{ width: wp('12.8%'), height: wp('12.8%'), borderRadius: wp('3.7%') }}>
                  <Ionicons name="stats-chart-outline" size={wp('6.4%')} color="#008E96" />
                </View>
                <Text className="font-inter-medium text-[11px] text-[#364153] text-center leading-[14px]">What&apos;s my budget?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/screens/ECalculator')}
                className="items-center" style={{ width: wp('26.7%') }}>
                <View className="w-12 h-12 bg-[#DBEAEB]/45 rounded-[14px] items-center justify-center mb-2" style={{ width: wp('12.8%'), height: wp('12.8%'), borderRadius: wp('3.7%') }}>
                  <Ionicons name="checkmark-done-circle-outline" size={wp('6.4%')} color="#008E96" />
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
              height: hp('18.5%'),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <View className="flex-1 pr-2" style={{ height: 117, gap: 12 }}>
              <Text
                className="font-inter-bold text-[12px] text-[#101828] leading-[18px]"
                style={{ width: wp('51.5%'), height: hp('7.8%') }}
              >
                Want to sell or rent out your place?
              </Text>

              <View style={{ gap: 6 }}>
                <View className="flex-row items-center" style={{ gap: 8 }}>
                  <View className="w-4 h-4 bg-[#008E96] rounded-full items-center justify-center">
                    <MaterialCommunityIcons name="check" size={10} color="white" />
                  </View>
                  <Text className="font-inter-regular text-[12px] text-[#364153] leading-[18px]">Pay zero fees</Text>
                </View>

                <View className="flex-row items-center" style={{ gap: 8 }}>
                  <View className="w-4 h-4 bg-[#008E96] rounded-full items-center justify-center">
                    <MaterialCommunityIcons name="check" size={10} color="white" />
                  </View>
                  <Text className="font-inter-regular text-[12px] text-[#364153] leading-[18px]">Talk to real, verified buyers</Text>
                </View>
              </View>
            </View>

            {/* Detailed Grid Pattern Icon */}
            <View style={{ width: wp('25.6%'), height: wp('25.6%'), justifyContent: 'center', alignItems: 'center' }}>
              <LinearGradient
                colors={['#8B5CF6', '#6366F1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: wp('21.3%'),
                  height: wp('21.3%'),
                  borderRadius: wp('3.2%'),
                  borderTopLeftRadius: wp('3.2%'),
                  borderBottomLeftRadius: wp('3.2%'),
                  borderTopRightRadius: wp('1.1%'),
                  borderBottomRightRadius: wp('1.1%'),
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <View className="flex-row flex-wrap justify-center items-center" style={{ width: wp('16%'), height: wp('16%'), gap: wp('1.1%') }}>
                  {[...Array(20)].map((_, i) => (
                    <View
                      key={i}
                      style={{
                        width: wp('2.1%'),
                        height: wp('2.1%'),
                        backgroundColor: '#FFFFFF',
                        opacity: 0.6,
                        borderRadius: wp('0.3%')
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
                style={{ fontSize: 15, lineHeight: 18 }}
              >
                Most popular right now
              </Text>
              <Text
                className="font-inter-regular text-[#6A7282]"
                style={{ fontSize: 11, lineHeight: 16 }}
              >
                Limited homes available — don&apos;t miss out
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleProtectedViewMore({
                pathname: '/screens/HighDemandProduct',
                params: {
                  city: currentLocation?.city,
                }
              })}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
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
            {highDemandProperties.map((p, index) => (
              <HighDemandProjectCard
                key={index}
                projectId={p._id}
                image={p.images?.[0] || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400"}
                priceRange={p.price}
                title={p.title}
                developer={p.projectName || "Standard"}
                location={formatPropertyLocation(p)}
                onPress={() => router.push({ pathname: '/screens/PropertyDetails', params: { propertyId: p._id } })}
              />
            ))}
          </ScrollView>
        </View>

        <View className="px-4 mb-6" style={{ gap: 16 }}>
          <View className="flex-row items-center justify-between">
            <View style={{ gap: 1 }}>
              <Text
                className="font-inter-bold text-[#101828]"
                style={{ fontSize: 17, lineHeight: 21 }}
              >
                Expert&apos;s choice
              </Text>
              <Text
                className="font-inter-regular text-[#6A7282]"
                style={{ fontSize: 13, lineHeight: 20 }}
              >
                The best places to live for you and your family
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleProtectedViewMore({
                pathname: '/screens/ProjectInFocus',
                params: {
                  city: currentLocation?.city,
                  pincode: currentLocation?.pincode,
                  locality: currentLocation?.locality
                }
              })}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
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
              <ProjectFocusCard
                key={index}
                projectId={project._id}
                images={project.media?.map(m => m.fileUrl) || []}
                title={project.projectName || project.title}
                location={`${project.addressLine1 || project.locality || ''}`}
                price={project.priceRange || project.price}
                tag={project.tag || "PREMIUM"}
                developer={project.builder?.name || project.projectName}
                badgeType={project.badgeType}
                badgeColor={project.badgeColor}
              />
            ))}
          </ScrollView>
        </View>

        {/* Best Rated Localities Section */}
        <View className="px-4 mb-4 " >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-inter-bold text-[15px] text-[#101828]">Top-rated neighborhoods</Text>
            <TouchableOpacity onPress={() => handleProtectedViewMore('/screens/BestRatedLocalities')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text className="font-inter-medium text-[14px] text-primary">See all</Text>
            </TouchableOpacity>
          </View>

          {localityLoading ? (
            <View className="items-center justify-center rounded-[20px] bg-white border border-[#F3F4F6]" style={{ height: hp('15.6%') }}>
              <ActivityIndicator size="small" color="#008E96" />
            </View>
          ) : visibleLocalities.length === 0 ? (
            <View className="rounded-[20px] bg-white border border-[#F3F4F6] px-4 py-5">
              <Text className="font-inter-medium text-[13px] text-[#6A7282]">No best-rated locality data available right now.</Text>
            </View>
          ) : (
            <View className="relative">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 27, paddingRight: 20 }}
              >
                <View className="flex-col gap-3">
                  {visibleLocalities.slice(0, Math.ceil(visibleLocalities.length / 2)).map((locality, index) => (
                    <LocalityCard key={`top-${index}`} {...locality} />
                  ))}
                </View>
                <View className="flex-col gap-3">
                  {visibleLocalities.slice(Math.ceil(visibleLocalities.length / 2)).map((locality, index) => (
                    <LocalityCard key={`bottom-${index}`} {...locality} />
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>

        {/* Top Rated Developers Section */}
        <View className="px-4 ">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="font-inter-bold text-[15px] text-[#101828]">Trusted Home Builders</Text>
              <Text className="font-inter-regular text-[11px] text-[#6A7282]">Builders with the best track record</Text>
            </View>
            <TouchableOpacity onPress={() => handleProtectedViewMore('/screens/TopRatedDevelopers')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text className="font-inter-medium text-[14px] text-primary">View more</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-stretch gap-4 mb-6">
            {topDevelopersList.length > 0 ? (
              topDevelopersList.slice(0, 2).map((dev, index) => (
                <View key={dev._id} style={{ flex: 1 }}>
                  <DeveloperSummaryCard
                    name={dev.builderInfo?.name || 'Developer'}
                    logoText={dev.builderInfo?.name?.substring(0, 2).toUpperCase() || 'DEV'}
                    logoColor={index === 0 ? '#E7000B' : '#008E96'}
                    yearEstd="2012"
                    projectCount={String(dev.projectCount || 0)}
                    isActive={activeDeveloperId === dev._id}
                    onPress={() => handleDeveloperSelect(dev._id)}
                  />
                </View>
              ))
            ) : (
              <Text className="font-inter-regular text-[13px] text-[#6A7282]">No top developers available right now.</Text>
            )}
          </View>

          <View className="mt-1">

            {activeDeveloperProjectsLoading ? (
              <ActivityIndicator color="#008E96" />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 16, paddingBottom: 8 }}
              >
                {(developerProjectsById[activeDeveloperId] || []).length > 0 ? (
                  developerProjectsById[activeDeveloperId].map((project, index) => (
                    <DeveloperProjectCard
                      key={project._id || `dev-project-${activeDeveloperId}-${index}`}
                      projectId={project._id}
                      image={project.media?.[0]?.fileUrl || project.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400'}
                      logoText={(topDevelopersList.find((dev) => dev._id === activeDeveloperId)?.builderInfo?.name || 'D').substring(0, 1).toUpperCase()}
                      logoColor="#008E96"
                      title={project.projectName || project.title || 'Project'}
                      developerName={topDevelopersList.find((dev) => dev._id === activeDeveloperId)?.builderInfo?.name || 'Developer'}
                      rating={project.rating || '4.8'}
                      config={project.config || project.possessionStatus?.label || 'Project'}
                      location={`${project.addressLine1 || project.locality || ''}, ${project.district || project.city || ''}`}
                      priceRange={project.priceRange || project.price || 'View details'}
                    />
                  ))
                ) : (
                  <Text className="font-inter-regular text-[13px] text-[#6A7282]">No projects found for this developer.</Text>
                )}
              </ScrollView>
            )}
          </View>
        </View>


        {/* Recommended Properties Section */}
        <View className="px-4 py-6">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="font-inter-bold text-[16px] text-[#101828]">Handpicked for you</Text>
              <Text className="font-inter-regular text-[12px] text-[#667085]">Homes that fit what you’re looking for</Text>
            </View>
            <TouchableOpacity onPress={() => handleProtectedViewMore({ pathname: '/screens/RecommendedProperties', params: { lookingFor: 'sell' } })} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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

        {/* Recommended Sellers Section */}
        <View className="px-4 mb-3">
          <View className="mb-4">
            <Text className="font-inter-semibold text-[15px] text-[#101828]">Recommended Sellers</Text>
            <Text className="font-inter-regular text-[11px] text-[#6A7282] mt-0.5">Sellers with complete knowledge about locality</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
          >
            {sellers.map((seller, index) => (
              <RecommendedSellerCard
                key={index}
                name={seller.name || "Seller"}
                experienceYears={seller.experienceYears || "5"}
                propertiesCount={seller.propertyCount || "0"}
                location={seller.locality || seller.city || "Mohali"}
              />
            ))}
          </ScrollView>
        </View>

        {/* Better Priced Properties Section */}
        <View className="px-4 mb-3">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="font-inter-semibold text-[15px] text-[#101828]">Better Priced Properties</Text>
              <Text className="font-inter-regular text-[11px] text-[#6A7282] mt-0.5">Based on properties you viewed</Text>
            </View>
            <TouchableOpacity onPress={() => handleProtectedViewMore('/screens/BestPriceProperty')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text className="font-inter-medium text-[14px] text-primary">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            {betterPricedProperties.map((property, index) => (
              <BetterPricedPropertyCard
                key={property.id || `better-priced-${index}`}
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

        {/* Last Searched Section */}
        {isLoggedIn && (
          <View className="px-4 mb-1">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1 mr-4">
                <Text className="font-inter-semibold text-[15px] text-[#101828]">Last Searched</Text>
                <Text className="font-inter-regular text-[11px] text-[#6A7282] mt-0.5">Collection for Ready to Move-In, Buy, Mohali, ...</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/screens/LastSearched')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} >
                <Text className="font-inter-medium text-[14px] text-primary">See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 8 }}
            >
              {lastSearchedData.map((item) => (
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
        )}

        {/* Recommended Insights Section */}
        <View className="px-4 ">
          <View className="mb-4">
            <Text className="font-inter-semibold text-[15px] text-[#101828]">Recommended Insights</Text>
            <Text className="font-inter-regular text-[11px] text-[#6A7282] mt-0.5">Based on your Top Preference</Text>
          </View>

          <View className="flex-row justify-center w-full" style={{ gap: 12 }}>
            {/* Locality Card */}
            <TouchableOpacity
              onPress={() => router.push({
                pathname: '/screens/LastSearched',
                params: {
                  city: currentLocation?.city,
                  locality: currentLocation?.locality
                }
              })}
              activeOpacity={0.7}
              style={{ flex: 1 }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#EDFBFA',
                  borderWidth: 0.67,
                  borderColor: '#F3F4F6',
                  borderRadius: 16,
                  padding: 12,
                  paddingVertical: 14,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 3,
                  elevation: 1.5,
                  justifyContent: 'flex-start',
                  gap: 16
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
                  <Text className="font-inter-regular text-[12px] text-[#364153] mb-0.5 leading-4">
                    {currentLocation?.locality || 'Mohali'}
                  </Text>
                  <Text className="font-inter-bold text-[12px] text-[#101828] leading-4">View Properties</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Price Range Card */}
            <TouchableOpacity
              onPress={() => router.push({
                pathname: '/screens/LastSearched',
                params: {
                  city: currentLocation?.city,
                  minPrice: cityStats?.minPrice,
                  maxPrice: cityStats?.maxPrice,
                  lookingFor: 'sell'
                }
              })}
              activeOpacity={0.7}
              style={{ flex: 1 }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#EDFBFA',
                  borderWidth: 0.67,
                  borderColor: '#F3F4F6',
                  borderRadius: 16,
                  padding: 12,
                  paddingVertical: 14,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 3,
                  elevation: 1.5,
                  justifyContent: 'flex-start',
                  gap: 16
                }}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-row items-start" style={{ gap: 4 }}>
                    <Home size={12} color="#364153" style={{ marginTop: 2, marginLeft: -2 }} />
                    <Text className="font-inter-semibold text-[13px] text-[#101828] leading-4" style={{ width: 50 }}>Price range</Text>
                  </View>
                  <ChevronRight size={14} color="#4A5565" style={{ marginTop: 2 }} />
                </View>
                <View>
                  <Text className="font-inter-regular text-[12px] text-[#364153] mb-0.5 leading-4">
                    {cityStats ? `${formatPrice(cityStats.minPrice)} - ${formatPrice(cityStats.maxPrice)}` : '₹ 75 L - ₹ 1 Cr'}
                  </Text>
                  <Text className="font-inter-bold text-[12px] text-[#101828] leading-4">
                    {cityStats ? `${cityStats.totalProperties} Properties` : '738 Properties'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* BHK Card */}
            <TouchableOpacity
              onPress={() => router.push({
                pathname: '/screens/LastSearched',
                params: {
                  city: currentLocation?.city,
                  bhk: '3 BHK',
                  lookingFor: 'sell'
                }
              })}
              activeOpacity={0.7}
              style={{ flex: 1 }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#EDFBFA',
                  borderWidth: 0.67,
                  borderColor: '#F3F4F6',
                  borderRadius: 16,
                  padding: 12,
                  paddingVertical: 14,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 3,
                  elevation: 1.5,
                  justifyContent: 'flex-start',
                  gap: 16
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
                  <Text className="font-inter-regular text-[12px] text-[#364153] mb-0.5 leading-4">3 BHK</Text>
                  <Text className="font-inter-bold text-[12px] text-[#101828] leading-4">View Properties</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Explore Localities Section */}
        <View className="px-4  mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="font-inter-semibold text-[15px] text-[#101828]">Explore Localities</Text>
              <Text className="font-inter-regular text-[11px] text-[#6A7282] mt-0.5">See insights and videos in {currentLocation?.city || 'Mohali'}</Text>
            </View>
            <TouchableOpacity onPress={() => handleProtectedViewMore('/screens/ExploreLocalities')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text className="font-inter-medium text-[14px] text-primary">See all</Text>
            </TouchableOpacity>
          </View>

          {localityLoading ? (
            <View className="items-center justify-center rounded-[20px] bg-white border border-[#F3F4F6]" style={{ height: hp('16.3%') }}>
              <ActivityIndicator size="small" color="#008E96" />
            </View>
          ) : localityError ? (
            <View className="rounded-[20px] bg-[#FFF5F5] border border-[#FEE2E2] px-4 py-3">
              <Text className="font-inter-medium text-[13px] text-[#B42318]">{localityError}</Text>
            </View>
          ) : exploreLocalities.length === 0 ? (
            <View className="rounded-[20px] bg-white border border-[#F3F4F6] px-4 py-5">
              <Text className="font-inter-medium text-[13px] text-[#6A7282]">No locality pricing data available right now.</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 8, gap: 12 }}
            >
              {exploreLocalities.map((item, index) => (
                <ExploreLocalityCard
                  key={`${item.locality || 'locality'}-${index}`}
                  title={item.localityName || formatLocalityName(item.locality, index)}
                  avgLabel={"Avg.\nPrice/sq.ft:"}
                  averagePrice={formatPricePerSqft(item.averagePricePerSqft)}
                  priceRange={`${formatPrice(item.minPrice)} - ${formatPrice(item.maxPrice)}`}
                  totalProperties={item.totalProperties}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* News For You Section */}
        <View className="px-4  mt-4">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="font-inter-semibold text-[15px] text-[#101828]">News For You</Text>
              <Text className="font-inter-regular text-[11px] text-[#6A7282] mt-0.5">Read whats happening in real estate</Text>
            </View>
            <TouchableOpacity onPress={() => handleProtectedViewMore('/screens/NewsForYou')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} >
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
        <View className="px-4  mt-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            <CalculatorCard
              titlePrefix="EMI"
              description="EMI starts at ₹10.60K"
              vectorsConfig={emiVectors}
              onPress={() => router.push('/screens/EMICalculator')}
            />
            <CalculatorCard
              titlePrefix="Affordability"
              description="Find the best budget for your home"
              vectorsConfig={affordabilityVectors}
              onPress={() => router.push('/screens/AffordabilityCalculator')}
            />
            <CalculatorCard
              titlePrefix=" Eligibility Calculator "
              description="Find the best budget for your home"
              vectorsConfig={affordabilityVectors}
              onPress={() => router.push('/screens/ECalculator')}
            />
          </ScrollView>
        </View>

      </ScrollView>
      <BottomTabBar />
    </SafeAreaView>
  );
};

export default Buy;
