import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, DeviceEventEmitter, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalculatorCard from '../../../components/CalculatorCard';
import ContinueCards from '../../../components/ContinueCards';
import DeveloperProjectCard from '../../../components/DeveloperProjectCard';
import DeveloperSummaryCard from '../../../components/DeveloperSummaryCard';
import ExploreLocalityCard from '../../../components/ExploreLocalityCard';

import HighDemandProjectCard from '../../../components/HighDemandProjectCard';
import LocalityCard from '../../../components/LocalityCard';
import NewsCard from '../../../components/NewsCard';
import PropertyMatchedCards from '../../../components/PropertyMatchedCards';
import PropertySuggestionCard from '../../../components/PropertySuggestionCard';
import SearchBox from '../../../components/SearchBox';
import UserHeader from '../../../components/UserHeader';
import { useLocalityAveragePrice } from '../../../hooks/useLocalityAveragePrice';
import { useProject } from '../../../hooks/useProject';
import { usePropertyDiscovery } from '../../../hooks/usePropertyDiscovery';
import api from '../../api';
import { getCategoryRoute, useCategoryTab } from '../../context/CategoryTabContext';
import { useLocation } from '../../context/LocationContext';
import BottomTabBar from '../../navigation/BottomTabBar';
import CategoryTabs from '../../navigation/CategoryTabs';
import { formatPrice, formatPricePerSqft } from '../../utils/formatPrice';

const fallbackMatchedHomes = [
  {
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400'
    ],
    tag: 'TALLEST LANDMARK',
    developer: 'NIRWANA GROUP',
    title: 'D-Xperanza',
    location: 'Sector 82, Mohali',
    priceRange: '1.24 Cr. - 1.55 Cr',
  },
  {
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400'
    ],
    tag: 'LUXURY LIVING',
    developer: 'SKY HEIGHTS',
    title: 'Sky Terrace',
    location: 'Sector 66, Mohali',
    priceRange: '2.5 Cr. - 4.2 Cr',
  },
];

const formatLocation = (value) => {
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

const formatDisplayValue = (value, fallback = '') => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    return trimmedValue || fallback;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'object') {
    return value.name || value.label || value.title || fallback;
  }

  return fallback;
};

const normalizeMatchedProjects = (responseData, defaultCity = 'Mohali') => {
  const projects = Array.isArray(responseData)
    ? responseData
    : Array.isArray(responseData?.data)
      ? responseData.data
      : Array.isArray(responseData?.projects)
        ? responseData.projects
        : Array.isArray(responseData?.results)
          ? responseData.results
          : [];

  return projects.map((item, index) => {
    const locality = formatLocation(item?.localityName || item?.locality);
    const city = formatLocation(item?.city) || defaultCity;
    const state = formatLocation(item?.state);
    const location = [locality, city, state].filter(Boolean).join(', ') || defaultCity;

    // Extract images from multiple possible sources
    let images = [];
    if (item?.images?.length) {
      images = item.images;
    } else if (item?.image) {
      images = [item.image];
    } else if (item?.media?.length) {
      // Handle API response with media array containing fileUrl
      images = item.media
        .filter((m) => m?.fileUrl)
        .map((m) => m.fileUrl);
    }

    return {
      id: item?._id || item?.id || item?.projectId || index,
      images,
      tag: item?.tag || item?.category || 'PROJECT',
      developer: item?.developer?.name || item?.builder?.name || item?.developerName || item?.builderName || 'Developer',
      title: item?.title || item?.name || item?.projectName || 'Untitled Project',
      location,
      priceRange: item?.priceRange || item?.price || item?.priceText || item?.budget || '',
    };
  });
};

const developerProjectsCache = new Map();

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught error in Project screen:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <SafeAreaView className="flex-1 bg-white">
          <View className="p-4">
            <Text className="font-inter-bold text-[16px] text-[#101828]">Something went wrong</Text>
            <Text className="font-inter-regular text-[13px] text-[#6A7282] mt-2">{String(this.state.error)}</Text>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const Project = () => {
  const { selectedTab, setSelectedTab } = useCategoryTab();
  const { currentLocation } = useLocation();
  const { fetchHighDemandProperties } = usePropertyDiscovery();
  const { fetchAveragePriceByCity, loading: localityLoading, error: localityError } = useLocalityAveragePrice();
  const { fetchDevelopers, fetchDeveloperProjects } = useProject();
  const skipFirstRedirect = useRef(true);
  const [matchedHomes, setMatchedHomes] = useState(fallbackMatchedHomes);
  const [matchedHomesLoading, setMatchedHomesLoading] = useState(false);
  const [matchedHomesError, setMatchedHomesError] = useState(null);
  const [exploreLocalities, setExploreLocalities] = useState([]);
  const [highDemandProjects, setHighDemandProjects] = useState([]);
  const [topDevelopersList, setTopDevelopersList] = useState([]);
  const [developerProjectsById, setDeveloperProjectsById] = useState({});
  const [activeDeveloperId, setActiveDeveloperId] = useState(null);
  const [activeDeveloperProjectsLoading, setActiveDeveloperProjectsLoading] = useState(false);
  const [highDemandLoading, setHighDemandLoading] = useState(false);
  const [highDemandError, setHighDemandError] = useState(null);

  useEffect(() => {
    console.log('Project screen mounted');
    setSelectedTab('Project');
  }, [setSelectedTab]);

  useEffect(() => {
    if (skipFirstRedirect.current) {
      skipFirstRedirect.current = false;
      return;
    }

    if (selectedTab !== 'Project') {
      const targetRoute = getCategoryRoute(selectedTab);
      if (targetRoute) {
        router.replace(targetRoute);
      }
    }
  }, [selectedTab]);

  const fetchProjects = useCallback(async (params = {}) => {
    setMatchedHomesLoading(true);
    setMatchedHomesError(null);
    try {
      const response = await api.get('/projects/city', { params });
      const normalizedProjects = normalizeMatchedProjects(response.data, params.city || currentLocation?.city || 'Mohali');

      if (normalizedProjects.length > 0) {
        setMatchedHomes(normalizedProjects);
      } else {
        setMatchedHomes(fallbackMatchedHomes);
      }

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch projects';
      setMatchedHomesError(errorMessage);
      setMatchedHomes(fallbackMatchedHomes);
    } finally {
      setMatchedHomesLoading(false);
    }
  }, [currentLocation?.city]);

  const loadExploreLocalities = useCallback(async (city) => {
    try {
      const res = await fetchAveragePriceByCity(city || 'Mohali');
      if (res?.success) {
        setExploreLocalities(Array.isArray(res.data) ? res.data : []);
      } else {
        setExploreLocalities([]);
      }
    } catch (err) {
      console.error('Average price API Error:', err);
      setExploreLocalities([]);
    }
  }, [fetchAveragePriceByCity]);

  const loadHighDemandProjects = useCallback(async (locationParams = {}) => {
    setHighDemandLoading(true);
    setHighDemandError(null);
    try {
      const res = await fetchHighDemandProperties({
        limit: 4,
        lookingFor: 'sell',
        ...locationParams,
      });

      const projects = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];

      setHighDemandProjects(projects);
    } catch (err) {
      console.error('High Demand API Error:', err);
      setHighDemandError(err?.message || 'Failed to fetch high demand projects');
      setHighDemandProjects([]);
    } finally {
      setHighDemandLoading(false);
    }
  }, [fetchHighDemandProperties]);

  const loadTopDevelopers = useCallback(async (locationParams = {}) => {
    try {
      const res = await fetchDevelopers({
        ...locationParams
      });

      if (res.success) {
        setTopDevelopersList(res.data);
        if (!activeDeveloperId && res.data.length > 0) {
          const firstDevId = res.data[0]._id;
          setActiveDeveloperId(firstDevId);
          try {
            await loadDeveloperProjects(firstDevId);
          } catch (e) {
            // ignore - individual load will surface errors elsewhere
            console.error('Failed to preload developer projects:', e);
          }
        }
      }
    } catch (err) {
      console.error("Developers API Error:", err);
    }
  }, [fetchDevelopers, activeDeveloperId, loadDeveloperProjects]);

  useEffect(() => {
    if (activeDeveloperId && !developerProjectsById[activeDeveloperId]) {
      loadDeveloperProjects(activeDeveloperId).catch((e) => {
        console.error('Error loading developer projects on active change:', e);
      });
    }
  }, [activeDeveloperId, developerProjectsById, loadDeveloperProjects]);

  const loadDeveloperProjects = useCallback(async (developerId) => {
    if (!developerId) {
      return;
    }

    if (developerProjectsById[developerId]) {
      setActiveDeveloperId(developerId);
      return;
    }

    if (developerProjectsCache.has(developerId)) {
      setDeveloperProjectsById((current) => ({
        ...current,
        [developerId]: developerProjectsCache.get(developerId),
      }));
      setActiveDeveloperId(developerId);
      return;
    }

    setActiveDeveloperProjectsLoading(true);
    try {
      const res = await fetchDeveloperProjects(developerId);
      const projects = res?.data || [];

      developerProjectsCache.set(developerId, projects);
      setDeveloperProjectsById((prev) => ({
        ...prev,
        [developerId]: projects
      }));
      setActiveDeveloperId(developerId);
    } catch (err) {
      console.error("Developer Projects API Error:", err);
      setDeveloperProjectsById((current) => ({
        ...current,
        [developerId]: [],
      }));
    } finally {
      setActiveDeveloperProjectsLoading(false);
    }
  }, [fetchDeveloperProjects, developerProjectsById]);

  useEffect(() => {
    fetchProjects({
      city: currentLocation?.city || 'Mohali',
      limit: 6,
    }).catch(() => {
      // Fallback data already applied above.
    });

    loadExploreLocalities(currentLocation?.city || 'Mohali');
    loadHighDemandProjects({ city: currentLocation?.city || 'Mohali' });
    
    loadTopDevelopers({
      city: currentLocation?.city || 'Mohali',
      limit: 10
    });
  }, [currentLocation, fetchProjects, loadExploreLocalities, loadHighDemandProjects, loadTopDevelopers]);

  const recentSearches = [
    { title: 'Commercial, Buy, Mohali,', subtitle: 'Any price, Any area' },
    { title: 'Buy, Sector 62', subtitle: 'Any price' },
    { title: 'Apartment, Rent, Zirakpur', subtitle: 'Min ₹15K, 2+ BHK' },
    { title: 'Plot, Buy, Kharar', subtitle: '100-150 sq.yd' },
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

  const bestLocalities = [...exploreLocalities]
    .sort((a, b) => (Number(b.averagePricePerSqft) || 0) - (Number(a.averagePricePerSqft) || 0))
    .slice(0, 6)
    .map((item, index) => ({
      title: item.localityName || item.locality || `Locality ${index + 1}`,
      rating: '4.5',
      reviews: String(item.totalProperties || 0),
      price: formatPricePerSqft(item.averagePricePerSqft),
    }));

  const visibleLocalities = bestLocalities.slice(0, 4);

  const suggestions = matchedHomes.map((item) => ({
    id: item.id || item._id || `${item.title || item.name || 'project'}-${item.location || 'location'}`,
    image: item.images?.[0] || item.image,
    developerName: item.developer || 'Developer',
    developerInitial: (item.developer || 'D').charAt(0).toUpperCase(),
    price: item.priceRange || '',
    title: item.title || 'Untitled Project',
    location: item.location || '',
    config: item.tag || 'PROJECT'
  }));

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / 296);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % suggestions.length;
        scrollRef.current?.scrollTo({
          x: nextIndex * 296,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [suggestions.length]);

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
          />

          <SearchBox 
            onPress={() => router.push('/screens/Project/ProjectSearch')}
          />
        </View>

        {/* Continue where you left Section */}
        <ContinueCards data={recentSearches} />

        {/* Matches Section */}
        <View className="px-4 mt-8 mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-inter-bold text-[18px] text-[#101828]">Perfectly matched home...</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: '/screens/Project/ProjectMatchedHome', params: { city: currentLocation?.city || 'Mohali' } })}>
              <Text className="font-inter-medium text-[14px] text-primary">View more</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[14px] text-[#667085] mb-4">Projects from the best developers</Text>

          {matchedHomesLoading ? (
            <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[14px] text-[#667085] mb-4">Loading projects...</Text>
          ) : matchedHomesError ? (
            <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[14px] text-[#667085] mb-4">Showing available projects for now.</Text>
          ) : null}

          <PropertyMatchedCards data={matchedHomes} destination="project" />
        </View>

        

        {/* Smart Suggestions Section */}
        <View className=" mb-6">
          <View className="px-4 mb-4">
            <View className="flex-row justify-between items-center">
              <Text className="font-inter-bold text-[22px] text-[#101828]">Smart Suggestions</Text>
              <TouchableOpacity onPress={() => router.push({ pathname: '/screens/Project/Suggestions', params: { city: currentLocation?.city || 'Mohali' } })}>
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
            {suggestions.map((item, index) => (
              <PropertySuggestionCard key={item.id || `${item.title || 'suggestion'}-${index}`} {...item} />
            ))}
          </ScrollView>
        </View>

        {/* Projects in Focus Section */}
        {/* <View className="px-4 mb-6" style={{ gap: 16 }}>
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
            <TouchableOpacity onPress={() => router.push({ pathname: '/screens/HighDemandProduct', params: { city: currentLocation?.city || 'Mohali' } })} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
        </View> */}

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
              <TouchableOpacity
                onPress={() => router.push('/screens/Buy/Suggestions')}
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

        {/* Best Rated Localities Section */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-inter-bold text-[17px] text-[#101828]">Top-rated neighborhoods</Text>
            <TouchableOpacity onPress={() => router.push('/screens/BestRatedLocalities')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text className="font-inter-medium text-[14px] text-primary">See all</Text>
            </TouchableOpacity>
          </View>

          {localityLoading ? (
            <View className="items-center justify-center rounded-[20px] bg-white border border-[#F3F4F6]" style={{ height: 127 }}>
              <ActivityIndicator size="small" color="#008E96" />
            </View>
          ) : localityError ? (
            <View className="rounded-[20px] bg-[#FFF5F5] border border-[#FEE2E2] px-4 py-3">
              <Text className="font-inter-medium text-[13px] text-[#B42318]">{localityError}</Text>
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

          {highDemandLoading ? (
            <View className="items-center justify-center rounded-[20px] bg-white border border-[#F3F4F6]" style={{ height: 227 }}>
              <ActivityIndicator size="small" color="#008E96" />
            </View>
          ) : highDemandError ? (
            <View className="rounded-[20px] bg-[#FFF5F5] border border-[#FEE2E2] px-4 py-3">
              <Text className="font-inter-medium text-[13px] text-[#B42318]">{highDemandError}</Text>
            </View>
          ) : highDemandProjects.length === 0 ? (
            <View className="rounded-[20px] bg-white border border-[#F3F4F6] px-4 py-5">
              <Text className="font-inter-medium text-[13px] text-[#6A7282]">No high demand projects available right now.</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            >
              {highDemandProjects.map((project, index) => (
                <HighDemandProjectCard
                  key={project._id || project.id || `high-demand-${index}`}
                  projectId={project._id || project.id}
                  image={project.images?.[0] || project.image || project.media?.[0]?.fileUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400'}
                  priceRange={formatDisplayValue(project.priceRange || project.price, 'View details')}
                  title={formatDisplayValue(project.title || project.name || project.projectName, 'Project')}
                  developer={formatDisplayValue(project.developer?.name || project.builder?.name || project.developerName || project.builderName, 'Developer')}
                  location={formatDisplayValue(project.localityName || project.locality || project.city, 'Mohali')}
                />
              ))}
            </ScrollView>
          )}
        </View>



       {/* Top Rated Developers Section */}
        <View className="px-4 mb-4 ">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="font-inter-bold text-[17px] text-[#101828]">Top rated developers</Text>
              <Text className="font-inter-regular text-[13px] text-[#6A7282]">Projects from the best developers</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/screens/TopRatedDevelopers')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
                    onPress={() => loadDeveloperProjects(dev._id)}
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
                  developerProjectsById[activeDeveloperId].slice(0, 2).map((project, index) => (
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

        {/* Better Priced Properties Section */}
        {/* <View className="px-4 mb-3">
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
                id={property.id || property._id}
                image={property.image}
                title={property.title}
                marketer={property.marketer}
                details={property.details}
                priceRange={property.priceRange}
              />
            ))}
          </ScrollView>
        </View> */}

        {/* Last Searched Section */}
        {/* <View className="px-4 mb-1">
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
        </View> */}


        {/* Explore Localities Section */}
        <View className="px-4  mt-6">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="font-inter-semibold text-[17px] text-[#101828]">Explore Localities</Text>
                <Text className="font-inter-regular text-[13px] text-[#6A7282] mt-0.5">See Insights and videos in {currentLocation?.city || 'Mohali'}</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/screens/ExploreLocalities')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text className="font-inter-medium text-[14px] text-primary">See all</Text>
              </TouchableOpacity>
            </View>

            {localityLoading ? (
              <View className="items-center justify-center rounded-[20px] bg-white border border-[#F3F4F6]" style={{ height: 127 }}>
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
                    title={item.localityName || item.locality}
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
              onPress={() => router.push('/screens/EMICalculator')}
            />
            <CalculatorCard
              titlePrefix="Affordability"
              description="Find the best budget for your home"
              vectorsConfig={affordabilityVectors}
              onPress={() => router.push('/screens/AffordabilityCalculator')}
            />
            
          </ScrollView>
        </View>

      </ScrollView>
      <BottomTabBar activeTab="Search" mode="Project" />
    </SafeAreaView>
  );
};

const ProjectWithBoundary = () => (
  <ErrorBoundary>
    <Project />
  </ErrorBoundary>
);

export default ProjectWithBoundary;
