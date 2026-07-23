import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, DeviceEventEmitter, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
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

const formatProjectLocation = (item, fallback = '') => {
  if (!item) return fallback;
  const address1 = formatLocation(item?.addressLine1);
  const address2 = formatLocation(item?.addressLine2);
  const locality = formatLocation(item?.localityName || item?.locality);
  const city = formatLocation(item?.city || item?.district);
  const state = formatLocation(item?.state);

  const parts = [address1, address2, locality, city, state].filter(Boolean);
  const uniqueParts = parts.filter(
    (part, index) => parts.findIndex((p) => p.toLowerCase() === part.toLowerCase()) === index
  );

  return uniqueParts.join(', ') || fallback;
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
    const location = formatProjectLocation(item, defaultCity);

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

const enrichProjectsWithMedia = async (projectsArray) => {
  if (!Array.isArray(projectsArray)) return projectsArray;
  return Promise.all(
    projectsArray.map(async (project) => {
      try {
        const projectId = project._id || project.id;
        if (!projectId) return project;
        const mediaRes = await api.get(`/projects/${projectId}/media`);

        let mediaArray = [];
        if (mediaRes?.data) {
          if (Array.isArray(mediaRes.data)) {
            mediaArray = mediaRes.data;
          } else if (Array.isArray(mediaRes.data?.data)) {
            mediaArray = mediaRes.data.data;
          } else if (Array.isArray(mediaRes.data?.media)) {
            mediaArray = mediaRes.data.media;
          }
        }

        const mediaUrls = mediaArray
          .filter(m => m.fileUrl)
          .map(m => m.fileUrl);

        return {
          ...project,
          media: mediaArray,
          images: mediaUrls.length > 0 ? mediaUrls : (project.images || [])
        };
      } catch (e) {
        console.warn(`Failed to fetch media for project ${project._id || project.id}:`, e?.message);
      }
      return project;
    })
  );
};

const enrichResponseData = async (rawData) => {
  if (Array.isArray(rawData)) {
    return await enrichProjectsWithMedia(rawData);
  } else if (rawData && typeof rawData === 'object') {
    const keysToEnrich = ['data', 'projects', 'results'];
    const enrichedObj = { ...rawData };
    for (const key of keysToEnrich) {
      if (Array.isArray(rawData[key])) {
        enrichedObj[key] = await enrichProjectsWithMedia(rawData[key]);
      }
    }
    return enrichedObj;
  }
  return rawData;
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
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View className="p-4">
            <Text className="font-bold text-[16px] text-[#101828]">Something went wrong</Text>
            <Text className="font-normal text-[13px] text-[#6A7282] mt-2">{String(this.state.error)}</Text>
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

  const fetchProjects = useCallback(async (params = {}) => {
    setMatchedHomesLoading(true);
    setMatchedHomesError(null);
    try {
      const response = await api.get('/projects/city', { params });
      const enrichedData = await enrichResponseData(response.data);
      const normalizedProjects = normalizeMatchedProjects(enrichedData, params.city || currentLocation?.city || 'Mohali');

      if (normalizedProjects.length > 0) {
        setMatchedHomes(normalizedProjects);
      } else {
        setMatchedHomes(fallbackMatchedHomes);
      }

      return enrichedData;
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

  const CARD_WIDTH = wp('53.3%');
  const CARD_MARGIN = wp('3.2%');
  const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN;

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SNAP_INTERVAL);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % suggestions.length;
        scrollRef.current?.scrollTo({
          x: nextIndex * SNAP_INTERVAL,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [suggestions.length, SNAP_INTERVAL]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
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
        <View
          className="bg-[#E6F4F5]"
          style={{
            marginHorizontal: wp('4.3%'),
            marginTop: hp('1%'),
            padding: wp('4.3%'),
            borderRadius: wp('8.5%'),
          }}
        >
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
        <View
          style={{
            paddingHorizontal: wp('4.3%'),
            marginTop: hp('4%'),
            marginBottom: hp('3%'),
          }}
        >
          <View
            className="flex-row items-center justify-between"
            style={{ marginBottom: hp('1%') }}
          >
            <Text
              className="font-bold text-[#101828]"
              style={{ fontSize: wp('3.7%') }}
            >Perfectly matched home...</Text>
            <TouchableOpacity onPress={() => handleProtectedViewMore({ pathname: '/screens/Project/ProjectMatchedHome', params: { city: currentLocation?.city || 'Mohali' } })}>
              <Text
                className="font-medium text-primary"
                style={{ fontSize: wp('3.2%') }}
              >View more</Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontWeight: '400',
              fontSize: wp('3.2%'),
              marginBottom: hp('2%'),
            }}
            className="text-[#667085]"
          >Projects from the best developers</Text>

          {matchedHomesLoading ? (
            <Text
              style={{
                fontWeight: '400',
                fontSize: wp('3.7%'),
                marginBottom: hp('2%'),
              }}
              className="text-[#667085]"
            >Loading projects...</Text>
          ) : matchedHomesError ? (
            <Text
              style={{
                fontWeight: '400',
                fontSize: wp('3.7%'),
                marginBottom: hp('2%'),
              }}
              className="text-[#667085]"
            >Showing available projects for now.</Text>
          ) : null}

          <PropertyMatchedCards data={matchedHomes} destination="project" />
        </View>



        {/* Smart Suggestions Section */}
        <View style={{ marginBottom: hp('3%') }}>
          <View
            style={{
              paddingHorizontal: wp('4.3%'),
              marginBottom: hp('2%'),
            }}
          >
            <View className="flex-row justify-between items-center">
              <Text
                className="font-bold text-[#101828]"
                style={{ fontSize: wp('3.7%') }}
              >Smart Suggestions</Text>
              <TouchableOpacity onPress={() => handleProtectedViewMore({ pathname: '/screens/Project/Suggestions', params: { city: currentLocation?.city || 'Mohali' } })}>
                <Text
                  className="font-semibold text-[#008E96]"
                  style={{ fontSize: wp('3.2%') }}
                >See all</Text>
              </TouchableOpacity>
            </View>
            <Text
              className="font-normal text-[#6A7282]"
              style={{ fontSize: wp('3.2%'), marginTop: hp('0.5%') }}
            >
              Based on your last search in Khanpur
            </Text>
          </View>

          <View
            className="flex-row"
            style={{
              gap: wp('2%'),
              paddingHorizontal: wp('4.3%'),
              marginBottom: hp('3%'),
            }}
          >
            {suggestions.map((_, index) => (
              <View
                key={index}
                className="rounded-full"
                style={{
                  width: wp('10.7%'),
                  height: hp('0.5%'),
                  backgroundColor: index === activeIndex ? '#008E96' : '#E4E7EC'
                }}
              />
            ))}
          </View>

          <ScrollView
            ref={scrollRef}
            horizontal
            onMomentumScrollEnd={handleScroll}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: wp('4.3%'), paddingRight: wp('2.1%') }}
            snapToInterval={SNAP_INTERVAL}
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
                className="font-bold text-[#101828]"
                style={{ fontSize: 17, lineHeight: 21 }}
              >
                Projects in Focus
              </Text>
              <Text
                className="font-normal text-[#6A7282]"
                style={{ fontSize: 13, lineHeight: 20 }}
              >
                Curated projects just for you
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push({ pathname: '/screens/HighDemandProduct', params: { city: currentLocation?.city || 'Mohali' } })} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text
                className="font-medium text-[#008E96]"
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

        {/* Popular on HousingMania Section */}
        <View style={{ marginBottom: hp('3%') }}>
          {/* Section Header */}
          <View
            className="flex-row items-center"
            style={{ gap: wp('2%'), marginBottom: hp('2%'), paddingHorizontal: wp('4.3%') }}
          >
            <Text style={{ fontSize: wp('5.3%') }}>⭐</Text>
            <Text
              className="font-bold text-[#101828]"
              style={{ fontSize: wp('3.7%') }}
            >Popular on HousingMania</Text>
          </View>

          {/* Tools Grid Card */}
          <View
            className="bg-white shadow-sm"
            style={{
              borderRadius: wp('6.4%'),
              padding: wp('4.3%'),
              paddingTop: hp('4%'),
              marginBottom: hp('3%'),
              marginHorizontal: wp('4.3%'),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: hp('0.5%') },
              shadowOpacity: 0.25,
              shadowRadius: wp('1.1%'),
              elevation: 4
            }}
          >
            <View className="flex-row justify-around" style={{ marginBottom: hp('3%') }}>
              <TouchableOpacity
                onPress={() => handleProtectedViewMore('/screens/Buy/Suggestions')}
                className="items-center"
                style={{ width: wp('24%') }}
              >
                <View
                  className="bg-[#DBEAEB]/45 items-center justify-center"
                  style={{
                    width: wp('12%'),
                    height: wp('12%'),
                    borderRadius: wp('3.7%'),
                    marginBottom: hp('1%')
                  }}
                >
                  <Ionicons name="bulb-outline" size={wp('6.4%')} color="#008E96" />
                </View>
                <Text
                  className="font-medium text-[#364153] text-center"
                  style={{ fontSize: wp('3.2%'), lineHeight: hp('2.2%') }}
                >Suggestions</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center" style={{ width: wp('24%') }}>
                <View
                  className="bg-[#DBEAEB]/45 items-center justify-center"
                  style={{
                    width: wp('12%'),
                    height: wp('12%'),
                    borderRadius: wp('3.7%'),
                    marginBottom: hp('1%')
                  }}
                >
                  <Ionicons name="pricetag-outline" size={wp('6.4%')} color="#008E96" />
                </View>
                <Text
                  className="font-medium text-[#364153] text-center"
                  style={{ fontSize: wp('3.2%'), lineHeight: hp('2.2%') }}
                >Deals</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center" style={{ width: wp('24%') }}>
                <View
                  className="bg-[#DBEAEB]/45 items-center justify-center"
                  style={{
                    width: wp('12%'),
                    height: wp('12%'),
                    borderRadius: wp('3.7%'),
                    marginBottom: hp('1%')
                  }}
                >
                  <Ionicons name="newspaper-outline" size={wp('6.4%')} color="#008E96" />
                </View>
                <Text
                  className="font-medium text-[#364153] text-center"
                  style={{ fontSize: wp('3.2%'), lineHeight: hp('2.2%') }}
                >News</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-around">
              <TouchableOpacity className="items-center" style={{ width: wp('24%') }}>
                <View
                  className="bg-[#DBEAEB]/45 items-center justify-center"
                  style={{
                    width: wp('12%'),
                    height: wp('12%'),
                    borderRadius: wp('3.7%'),
                    marginBottom: hp('1%')
                  }}
                >
                  <Ionicons name="calculator-outline" size={wp('6.4%')} color="#008E96" />
                </View>
                <Text
                  className="font-medium text-[#364153] text-center"
                  style={{ fontSize: wp('2.9%'), lineHeight: hp('1.8%') }}
                >EMI Calculator</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center" style={{ width: wp('24%') }}>
                <View
                  className="bg-[#DBEAEB]/45 items-center justify-center"
                  style={{
                    width: wp('12%'),
                    height: wp('12%'),
                    borderRadius: wp('3.7%'),
                    marginBottom: hp('1%')
                  }}
                >
                  <Ionicons name="stats-chart-outline" size={wp('6.4%')} color="#008E96" />
                </View>
                <Text
                  className="font-medium text-[#364153] text-center"
                  style={{ fontSize: wp('2.9%'), lineHeight: hp('1.8%') }}
                >Affordability Calculator</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center" style={{ width: wp('24%') }}>
                <View
                  className="bg-[#DBEAEB]/45 items-center justify-center"
                  style={{
                    width: wp('12%'),
                    height: wp('12%'),
                    borderRadius: wp('3.7%'),
                    marginBottom: hp('1%')
                  }}
                >
                  <Ionicons name="checkmark-done-circle-outline" size={wp('6.4%')} color="#008E96" />
                </View>
                <Text
                  className="font-medium text-[#364153] text-center"
                  style={{ fontSize: wp('2.9%'), lineHeight: hp('1.8%') }}
                >Eligibility Calculator</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Property Owner Banner */}
          <LinearGradient
            colors={['#DAEAEB', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              minHeight: hp('18.5%'),
              padding: wp('4.3%'),
              marginHorizontal: wp('4.3%'),
              borderRadius: 16,
              overflow: 'hidden',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: hp('0.1%') },
              shadowOpacity: 0.1,
              shadowRadius: wp('0.8%'),
              elevation: 2,
            }}
          >
            <View style={{ flex: 1, paddingRight: 8, gap: hp('1.5%') }}>
              <Text
                style={{ fontWeight: '700', color: '#101828', fontSize: wp('3.7%'), lineHeight: hp('2.5%') }}
              >
                Are you a property owner looking to rent/sell?
              </Text>

              <View style={{ gap: hp('0.8%') }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp('2.1%') }}>
                  <View
                    style={{ backgroundColor: '#008E96', borderRadius: 999, alignItems: 'center', justifyContent: 'center', width: wp('4.3%'), height: wp('4.3%') }}
                  >
                    <MaterialCommunityIcons name="check" size={wp('2.7%')} color="white" />
                  </View>
                  <Text style={{ fontWeight: '400', color: '#364153', fontSize: wp('3.2%'), lineHeight: hp('2.2%') }}>Free Brokerage</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp('2.1%') }}>
                  <View
                    style={{ backgroundColor: '#008E96', borderRadius: 999, alignItems: 'center', justifyContent: 'center', width: wp('4.3%'), height: wp('4.3%') }}
                  >
                    <MaterialCommunityIcons name="check" size={wp('2.7%')} color="white" />
                  </View>
                  <Text style={{ fontWeight: '400', color: '#364153', fontSize: wp('3.2%'), lineHeight: hp('2.2%') }}>Genuine, verified leads</Text>
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
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', width: wp('16%'), height: wp('16%'), gap: wp('1%') }}>
                  {[...Array(20)].map((_, i) => (
                    <View
                      key={i}
                      style={{
                        width: wp('2.1%'),
                        height: wp('2.1%'),
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
        <View style={{ paddingHorizontal: wp('4.3%'), marginBottom: hp('2%') }}>
          <View
            className="flex-row items-center justify-between"
            style={{ marginBottom: hp('2%') }}
          >
            <Text
              className="font-bold text-[#101828]"
              style={{ fontSize: wp('3.7%') }}
            >Top-rated neighborhoods</Text>
            <TouchableOpacity onPress={() => handleProtectedViewMore('/screens/BestRatedLocalities')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text
                className="font-medium text-primary"
                style={{ fontSize: wp('3.2%') }}
              >See all</Text>
            </TouchableOpacity>
          </View>

          {localityLoading ? (
            <View
              className="items-center justify-center bg-white border border-[#F3F4F6]"
              style={{ height: hp('15.6%'), borderRadius: wp('5.3%') }}
            >
              <ActivityIndicator size="small" color="#008E96" />
            </View>
          ) : localityError ? (
            <View
              className="bg-[#FFF5F5] border border-[#FEE2E2]"
              style={{
                borderRadius: wp('5.3%'),
                paddingHorizontal: wp('4.3%'),
                paddingVertical: hp('1.5%'),
              }}
            >
              <Text
                className="font-medium text-[#B42318]"
                style={{ fontSize: wp('3.5%') }}
              >{localityError}</Text>
            </View>
          ) : visibleLocalities.length === 0 ? (
            <View
              className="bg-white border border-[#F3F4F6]"
              style={{
                borderRadius: wp('5.3%'),
                paddingHorizontal: wp('4.3%'),
                paddingVertical: hp('2.5%'),
              }}
            >
              <Text
                className="font-medium text-[#6A7282]"
                style={{ fontSize: wp('3.5%') }}
              >No best-rated locality data available right now.</Text>
            </View>
          ) : (
            <View className="relative">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: wp('7.2%'), paddingRight: wp('5.3%') }}
              >
                <View className="flex-col" style={{ gap: hp('1.2%') }}>
                  {visibleLocalities.slice(0, Math.ceil(visibleLocalities.length / 2)).map((locality, index) => (
                    <LocalityCard key={`top-${index}`} {...locality} />
                  ))}
                </View>
                <View className="flex-col" style={{ gap: hp('1.2%') }}>
                  {visibleLocalities.slice(Math.ceil(visibleLocalities.length / 2)).map((locality, index) => (
                    <LocalityCard key={`bottom-${index}`} {...locality} />
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
        {/* High Demand Projects Section */}
        <View style={{ paddingHorizontal: wp('4.3%'), marginBottom: hp('3%'), gap: hp('2%') }}>
          <View className="flex-row items-center justify-between">
            <View style={{ gap: hp('0.1%') }}>
              <Text
                className="font-bold text-[#101828]"
                style={{ fontSize: wp('3.7%'), lineHeight: hp('2.5%') }}
              >
                High Demand Projects
              </Text>
              <Text
                className="font-normal text-[#6A7282]"
                style={{ fontSize: wp('3.2%'), lineHeight: hp('2.2%') }}
              >
                Hurry! Only a few units left
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleProtectedViewMore({ pathname: '/screens/HighDemandProduct', params: { city: currentLocation?.city || 'Mohali' } })} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text
                className="font-medium text-[#008E96]"
                style={{ fontSize: wp('3.2%'), lineHeight: hp('2.5%') }}
              >
                View more
              </Text>
            </TouchableOpacity>
          </View>

          {highDemandLoading ? (
            <View
              className="items-center justify-center bg-white border border-[#F3F4F6]"
              style={{ height: hp('28%'), borderRadius: wp('5.3%') }}
            >
              <ActivityIndicator size="small" color="#008E96" />
            </View>
          ) : highDemandError ? (
            <View
              className="bg-[#FFF5F5] border border-[#FEE2E2]"
              style={{
                borderRadius: wp('5.3%'),
                paddingHorizontal: wp('4.3%'),
                paddingVertical: hp('1.5%'),
              }}
            >
              <Text
                className="font-medium text-[#B42318]"
                style={{ fontSize: wp('3.5%') }}
              >{highDemandError}</Text>
            </View>
          ) : highDemandProjects.length === 0 ? (
            <View
              className="bg-white border border-[#F3F4F6]"
              style={{
                borderRadius: wp('5.3%'),
                paddingHorizontal: wp('4.3%'),
                paddingVertical: hp('2.5%'),
              }}
            >
              <Text
                className="font-medium text-[#6A7282]"
                style={{ fontSize: wp('3.5%') }}
              >No high demand projects available right now.</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: wp('4.3%') }}
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
        <View style={{ paddingHorizontal: wp('4.3%'), marginBottom: hp('2.5%') }}>
          <View
            className="flex-row items-center justify-between"
            style={{ marginBottom: hp('2%') }}
          >
            <View>
              <Text
                className="font-bold text-[#101828]"
                style={{ fontSize: wp('3.7%') }}
              >Top rated developers</Text>
              <Text
                className="font-normal text-[#6A7282]"
                style={{ fontSize: wp('3.2%'), marginTop: hp('0.2%') }}
              >Projects from the best developers</Text>
            </View>
          </View>

          <View
            className="flex-row items-stretch"
            style={{ gap: wp('4.3%'), marginBottom: hp('3%') }}
          >
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
              <Text
                className="font-normal text-[#6A7282]"
                style={{ fontSize: wp('3.5%') }}
              >No top developers available right now.</Text>
            )}
          </View>

          <View style={{ marginTop: hp('0.5%') }}>
            {activeDeveloperProjectsLoading ? (
              <ActivityIndicator color="#008E96" />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: wp('4.3%'), paddingBottom: hp('1%') }}
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
                      location={formatProjectLocation(project)}
                      priceRange={project.priceRange || project.price || 'View details'}
                    />
                  ))
                ) : (
                  <Text
                    className="font-normal text-[#6A7282]"
                    style={{ fontSize: wp('3.5%') }}
                  >No projects found for this developer.</Text>
                )}
              </ScrollView>
            )}
          </View>
        </View>

        {/* Explore Localities Section */}
        <View style={{ paddingHorizontal: wp('4.3%'), marginTop: hp('3%') }}>
          <View
            className="flex-row items-center justify-between"
            style={{ marginBottom: hp('2%') }}
          >
            <View>
              <Text
                className="font-semibold text-[#101828]"
                style={{ fontSize: wp('3.7%') }}
              >Explore Localities</Text>
              <Text
                className="font-normal text-[#6A7282]"
                style={{ fontSize: wp('3.2%'), marginTop: hp('0.2%') }}
              >See Insights and videos in {currentLocation?.city || 'Mohali'}</Text>
            </View>
            <TouchableOpacity onPress={() => handleProtectedViewMore('/screens/ExploreLocalities')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text
                className="font-medium text-primary"
                style={{ fontSize: wp('3.2%') }}
              >See all</Text>
            </TouchableOpacity>
          </View>

          {localityLoading ? (
            <View
              className="items-center justify-center bg-white border border-[#F3F4F6]"
              style={{ height: hp('14.8%'), borderRadius: wp('5.3%') }}
            >
              <ActivityIndicator size="small" color="#008E96" />
            </View>
          ) : localityError ? (
            <View
              className="bg-[#FFF5F5] border border-[#FEE2E2]"
              style={{
                borderRadius: wp('5.3%'),
                paddingHorizontal: wp('4.3%'),
                paddingVertical: hp('1.5%'),
              }}
            >
              <Text
                className="font-medium text-[#B42318]"
                style={{ fontSize: wp('3.5%') }}
              >{localityError}</Text>
            </View>
          ) : exploreLocalities.length === 0 ? (
            <View
              className="bg-white border border-[#F3F4F6]"
              style={{
                borderRadius: wp('5.3%'),
                paddingHorizontal: wp('4.3%'),
                paddingVertical: hp('2.5%'),
              }}
            >
              <Text
                className="font-medium text-[#6A7282]"
                style={{ fontSize: wp('3.5%') }}
              >No locality pricing data available right now.</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: hp('1%'), gap: wp('3.2%') }}
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
        <View style={{ paddingHorizontal: wp('4.3%'), marginTop: hp('2%') }}>
          <View
            className="flex-row items-center justify-between"
            style={{ marginBottom: hp('2%') }}
          >
            <View>
              <Text
                className="font-semibold text-[#101828]"
                style={{ fontSize: wp('3.7%') }}
              >News For You</Text>
              <Text
                className="font-normal text-[#6A7282]"
                style={{ fontSize: wp('3.2%'), marginTop: hp('0.2%') }}
              >Read whats happening in real estate</Text>
            </View>
            <TouchableOpacity>
              <Text
                className="font-medium text-primary"
                style={{ fontSize: wp('3.2%') }}
              >See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: hp('1%') }}
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
        <View style={{ paddingHorizontal: wp('4.3%'), marginBottom: hp('12%'), marginTop: hp('2%') }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: hp('1%') }}
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
