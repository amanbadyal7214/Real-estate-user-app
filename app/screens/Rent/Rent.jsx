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
import { useProject } from '../../../hooks/useProject';
import { useLocalityAveragePrice } from '../../../hooks/useLocalityAveragePrice';
import { usePropertyDiscovery } from '../../../hooks/usePropertyDiscovery';
import { useLocation } from '../../context/LocationContext';
import { formatPrice, formatPricePerSqft } from '../../utils/formatPrice';

const fallbackSuggestions = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600',
    developerName: 'Nirwana Group',
    developerInitial: 'N',
    price: '₹ 45.03 L - 1.11 Cr',
    title: 'Nirwana The Moksha',
    location: 'Khanpur, Mohali',
    config: '1, 2, 3 BHK Flats',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
    developerName: 'Vatika Group',
    developerInitial: 'V',
    price: '₹ 51.9 L - 89.3 L',
    title: 'Vatika Seven Lamps',
    location: 'Sector 82, Mohali',
    config: '2 BHK Flats',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=600',
    developerName: 'DLF Limited',
    developerInitial: 'D',
    price: '₹ 62.5 L - 1.25 Cr',
    title: 'DLF Garden City',
    location: 'Sector 91, Mohali',
    config: '2, 3, 4 BHK Flats',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
    developerName: 'Emaar India',
    developerInitial: 'E',
    price: '₹ 75.2 L - 1.45 Cr',
    title: 'Emaar Palm Heights',
    location: 'Sector 77, Mohali',
    config: '2, 3 BHK Flats',
  },
];

const SUGGESTION_CARD_INTERVAL = 272;

const normalizeSuggestionText = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text || fallback;
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

const normalizeProjectSuggestions = (responseData, defaultCity = 'Mohali') => {
  const projects = Array.isArray(responseData)
    ? responseData
    : Array.isArray(responseData?.data)
      ? responseData.data
      : Array.isArray(responseData?.projects)
        ? responseData.projects
        : Array.isArray(responseData?.results)
          ? responseData.results
          : [];

  return projects.map((item) => {
    const developerName = normalizeSuggestionText(
      item?.builder?.name || item?.developerName || item?.developer?.name || item?.builderName || item?.promoterName,
      'Developer'
    );
    const locationParts = [
      item?.addressLine1,
      item?.state?.name,
    ]
      .map((part) => normalizeSuggestionText(part, ''))
      .filter(Boolean);
    const location = locationParts.join(', ') || normalizeSuggestionText(item?.location || item?.address, defaultCity);
    const avgPriceRate = item?.avgPriceRate ?? item?.averagePriceRate;
    const avgPriceUnit = item?.avgPriceUnit?.label || item?.avgPriceUnit?.name || item?.priceUnit?.label || item?.priceUnit?.name;
    const minPrice = item?.minPrice ?? item?.priceFrom ?? item?.startingPrice;
    const maxPrice = item?.maxPrice ?? item?.priceTo ?? item?.endingPrice;
    const price = item?.priceRange
      || item?.priceText
      || (avgPriceRate !== undefined
        ? `${formatPrice(avgPriceRate)}${avgPriceUnit ? ` / ${avgPriceUnit}` : ''}`
        : '')
      || (minPrice !== undefined && maxPrice !== undefined
        ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
        : formatPrice(item?.price ?? item?.amount ?? item?.budget));

    return {
      id: item?.id || item?._id || item?.projectId,
      image:
        item?.media?.[0]?.fileUrl
        || item?.image
        || item?.coverImage
        || item?.thumbnail
        || item?.images?.[0]
        || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600',
      developerName,
      developerInitial: developerName.charAt(0).toUpperCase() || 'D',
      price: normalizeSuggestionText(price, 'View details'),
      title: normalizeSuggestionText(item?.title || item?.name || item?.projectName, 'Project'),
      location,
      config: normalizeSuggestionText(item?.config || item?.configuration || item?.unitConfig || item?.bhk, ''),
    };
  });
};

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

    const [suggestions, setSuggestions] = useState(fallbackSuggestions);
    const [recommendedProperties, setRecommendedProperties] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [exploreLocalities, setExploreLocalities] = useState([]);
    const { fetchProjects } = useProject();
    const { fetchProperties, fetchSellersByLocation } = usePropertyDiscovery();
    const { fetchAveragePriceByCity, loading: localityLoading, error: localityError } = useLocalityAveragePrice();
    const { currentLocation } = useLocation();

    useEffect(() => {
      let isMounted = true;
      const city = currentLocation?.city || 'Mohali';

      const loadProjects = async () => {
        try {
          const res = await fetchProjects({ city, limit: 5 });
          if (!isMounted) return;
          const normalized = normalizeProjectSuggestions(res, city);
          setSuggestions(normalized.length > 0 ? normalized : fallbackSuggestions);
        } catch (_err) {
          if (isMounted) setSuggestions(fallbackSuggestions);
        }
      };

      loadProjects();

      return () => { isMounted = false; };
    }, [fetchProjects, fetchProperties, currentLocation]);

    useEffect(() => {
      let isMounted = true;
      const city = currentLocation?.city || 'Mohali';

      const loadRecommendedProperties = async () => {
        try {
          const res = await fetchProperties({ city, limit: 4, lookingFor: 'rent', PriceAscending: true });
          if (!isMounted) return;

          const projects = Array.isArray(res)
            ? res
            : Array.isArray(res?.data)
              ? res.data
              : Array.isArray(res?.projects)
                ? res.projects
                : Array.isArray(res?.results)
                  ? res.results
                  : [];

          const mapped = projects.map((property, index) => ({
            id: property._id || property.id || property.projectId || `recommended-${index}`,
            image: property.media?.[0]?.fileUrl || property.images?.[0] || property.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
            price: property.priceRange || property.priceText || (property.avgPriceRate ? `${formatPrice(property.avgPriceRate)}${property.avgPriceUnit?.label ? ` / ${property.avgPriceUnit.label}` : ''}` : (typeof property.price === 'number' ? formatPrice(property.price) : property.price || 'View details')),
            title: property.title || property.projectName || 'Property',
            area: `${property.residential?.bedrooms || property.bhk || property.bedrooms || 'N/A'} BHK • ${property.area || 'N/A'} ${property.areaUnit?.name || property.areaUnit?.label || 'sq.ft.'}`,
            location: formatPropertyLocation(property),
          }));

          setRecommendedProperties(mapped);
        } catch (_err) {
          if (isMounted) setRecommendedProperties([]);
        }
      };

      loadRecommendedProperties();

      return () => { isMounted = false; };
    }, [fetchProperties, currentLocation]);
  
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
    // sellers will be loaded from API

    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
          let nextIndex = (activeIndex + 1) % suggestions.length;
            setActiveIndex(nextIndex);
          scrollRef.current?.scrollTo({ x: nextIndex * SUGGESTION_CARD_INTERVAL, animated: true });
        }, 3000);

        return () => clearInterval(interval);
    }, [activeIndex, suggestions.length]);

    useEffect(() => {
      let isMounted = true;
      const city = currentLocation?.city || 'Mohali';

      const loadSellers = async () => {
        try {
          const res = await fetchSellersByLocation({ city, limit: 6 });
          if (!isMounted) return;

          const items = Array.isArray(res)
            ? res
            : Array.isArray(res?.data)
              ? res.data
              : Array.isArray(res?.results)
                ? res.results
                : [];

          const mapped = items.map((s, i) => ({
            id: s._id || s.id || `seller-${i}`,
            name: s.name || s.user?.name || s.sellerName || 'Seller',
            experienceYears: String(s.experienceYears || s.yearsExperience || s.experience || '5'),
            propertiesCount: String(s.propertiesCount || s.totalProperties || (s.properties && s.properties.length) || '0'),
            locality: s.locality?.name || s.localityName || s.city || 'Mohali',
          }));

          setSellers(mapped);
        } catch (_err) {
          if (isMounted) setSellers([]);
        }
      };

      loadSellers();

      return () => { isMounted = false; };
    }, [fetchSellersByLocation, currentLocation]);

    useEffect(() => {
      let isMounted = true;
      const city = currentLocation?.city || 'Mohali';

      const loadExploreLocalities = async () => {
        try {
          const res = await fetchAveragePriceByCity(city);
          if (!isMounted) return;

          const items = Array.isArray(res?.data) ? res.data : [];

          const mapped = items
            .filter((item) => item?.localityName || item?.locality)
            .map((item) => ({
              locality: item.locality,
              localityName: item.localityName || item.locality,
              avgLabel: 'Avg.\nPrice/sq.ft:',
              averagePrice: formatPricePerSqft(item.averagePricePerSqft),
              priceRange: `${formatPrice(item.minPrice)} - ${formatPrice(item.maxPrice)}`,
              totalProperties: item.totalProperties,
            }))
            .slice(0, 4);

          setExploreLocalities(mapped);
        } catch (_err) {
          if (isMounted) setExploreLocalities([]);
        }
      };

      loadExploreLocalities();

      return () => { isMounted = false; };
    }, [fetchAveragePriceByCity, currentLocation]);

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / SUGGESTION_CARD_INTERVAL);
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
                          Based on your last search in {currentLocation?.city || 'Khanpur'}
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
                        snapToInterval={SUGGESTION_CARD_INTERVAL}
                        decelerationRate="fast"
                    >
                        {suggestions.map((item) => (
                          <PropertySuggestionCard
                            key={item.id}
                            {...item}
                            onPress={() => item.id && router.push({ pathname: '/screens/ProjectDetails', params: { projectId: item.id, source: 'rent' } })}
                          />
                        ))}
                    </ScrollView>
                </View>
                {/* Recommended Properties Section */}
        <View className="px-4 py-6">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="font-inter-bold text-[18px] text-[#101828]">Handpicked for you</Text>
              <Text className="font-inter-regular text-[14px] text-[#667085]">Homes that fit what you’re looking for</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/screens/RecommendedProperties')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
            {sellers.map((seller) => (
              <RecommendedSellerCard
                key={seller.id}
                name={seller.name || 'Seller'}
                experienceYears={seller.experienceYears || '5'}
                propertiesCount={seller.propertiesCount || '0'}
                location={seller.locality || seller.location || 'Mohali'}
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

          {localityLoading ? (
            <View className="items-center justify-center rounded-[20px] bg-white border border-[#F3F4F6]" style={{ height: 132 }}>
              <Text className="font-inter-medium text-[13px] text-[#6A7282]">Loading localities...</Text>
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
                  avgLabel={item.avgLabel}
                  averagePrice={item.averagePrice}
                  priceRange={item.priceRange}
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
