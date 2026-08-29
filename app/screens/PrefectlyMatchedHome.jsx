import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';

import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, FlatList, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoDataFound from '../../components/NoDataFound';
import PerfectMatchCard from '../../components/PerfectMatchCard';
import { useLocality } from '../../hooks/useLocality';
import { useLookup } from '../../hooks/useLookup';
import { usePropertyDiscovery } from '../../hooks/usePropertyDiscovery';
import { useLocation } from '../context/LocationContext';
import api from '../api';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const PrefectlyMatchedHome = () => {
  const { findPropertiesByLocation } = usePropertyDiscovery();
  const { resolveLocalities, loading: localityLoading } = useLocality();
  const { currentLocation } = useLocation();
  const searchParams = useLocalSearchParams();
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  const loading = isInitialLoading || localityLoading;
  const searchQuery = searchParams.city || currentLocation?.city || '';

  // Modal States
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [localityModalVisible, setLocalityModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Price: High to Low');

  // Animation for Bottom Sheet
  const sheetHeight = useRef(new Animated.Value(0)).current;
  const isFullScreen = useRef(false);

  const openFilter = () => {
    setFilterModalVisible(true);
    Animated.spring(sheetHeight, {
      toValue: SCREEN_HEIGHT * 0.7,
      useNativeDriver: false,
      damping: 20,
    }).start();
  };

  const closeFilter = () => {
    Animated.timing(sheetHeight, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start(() => setFilterModalVisible(false));
  };

  const handleScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;

    if (currentScrollY > 10 && !isFullScreen.current) {
      isFullScreen.current = true;
      Animated.spring(sheetHeight, {
        toValue: SCREEN_HEIGHT * 0.95,
        useNativeDriver: false,
        damping: 20,
      }).start();
    } else if (currentScrollY <= 0 && isFullScreen.current) {
      isFullScreen.current = false;
      Animated.spring(sheetHeight, {
        toValue: SCREEN_HEIGHT * 0.7,
        useNativeDriver: false,
        damping: 20,
      }).start();
    }
  };

  const sortOptions = [
    'Price : Low to High',
    'Price: High to Low',
    'Area: Low to High',
    'Area: High to Low',
    'Relevance'
  ];

  const lookOptions = [
    { label: 'Buy', value: 'sell' },
    { label: 'Rent', value: 'rent' }
  ];

  // Lookups data
  const { propertyTypes = [], subPropertyTypes = [], structures = [], constructionStatus = [], possessionStatus = [], fetchLookups } = useLookup();

  // Filter States
  const [lookingTo, setLookingTo] = useState(searchParams.lookingFor || 'sell'); // default looking to
  const [city, setCity] = useState(searchParams.city || currentLocation?.city || 'Mohali');
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const [selectedSubPropertyType, setSelectedSubPropertyType] = useState(null);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [structureInput, setStructureInput] = useState('');
  const [selectedConstructionStatus, setSelectedConstructionStatus] = useState(null);
  const [selectedPossessionStatus, setSelectedPossessionStatus] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [minArea, setMinArea] = useState(null);
  const [maxArea, setMaxArea] = useState(null);
  const [localitiesList, setLocalitiesList] = useState([]);
  const [loadingLocalities, setLoadingLocalities] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState(searchParams.locality || currentLocation?.locality || null);

  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  useEffect(() => {
    const loadLocalities = async () => {
      const activeCity = city || currentLocation?.city || 'Mohali';
      try {
        setLoadingLocalities(true);
        const response = await api.get(`/localities`, {
          params: { city: activeCity }
        });
        if (response.data?.success) {
          setLocalitiesList(response.data.data || []);
        } else {
          setLocalitiesList([]);
        }
      } catch (err) {
        console.error("Error fetching localities for filter:", err);
        setLocalitiesList([]);
      } finally {
        setLoadingLocalities(false);
      }
    };

    loadLocalities();
  }, [city, currentLocation?.city]);

  // Load properties based on selected filters
  const fetchMatches = async (pageToFetch = 1, isLoadMore = false) => {
    if (isLoadMore && (loadingMore || !hasMore)) return;

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setIsInitialLoading(true);
      setHasMore(true);
      setPage(1);
    }

    try {
      const params = { limit: 10, page: pageToFetch };

      // 1. Looking For
      params.lookingFor = lookingTo;

      // 2. City
      const effectiveCity = city || searchParams.city || currentLocation?.city;
      if (effectiveCity) {
        params.city = effectiveCity;
      }

      // Override with manual search query if present
      if (searchQuery.trim().length > 0) {
        if (/^\d{6}$/.test(searchQuery)) {
          params.pincode = searchQuery;
          delete params.city;
        } else {
          params.city = searchQuery;
        }
      }

      // 3. Property Type & Others
      if (selectedLocality) {
        params.locality = selectedLocality.name || selectedLocality;
      }
      if (selectedPropertyType) params.propertyType = selectedPropertyType;
      if (selectedSubPropertyType) params.subPropertyType = selectedSubPropertyType;
      if (selectedConstructionStatus) params.constructionStatus = selectedConstructionStatus;
      if (selectedPossessionStatus) params.possessionStatus = selectedPossessionStatus;

      if (selectedStructure) {
        params.structure = selectedStructure;
      } else if (structureInput && structureInput.trim().length > 0) {
        params.structure = structureInput.trim();
      }

      if (selectedSort && selectedSort.toLowerCase().includes('price')) {
        params.PriceAscending = selectedSort.toLowerCase().includes('low');
      }

      if (minPrice !== null && minPrice !== undefined && minPrice !== '') params.minPrice = minPrice;
      if (maxPrice !== null && maxPrice !== undefined && maxPrice !== '') params.maxPrice = maxPrice;
      if (minArea !== null && minArea !== undefined && minArea !== '') params.minArea = minArea;
      if (maxArea !== null && maxArea !== undefined && maxArea !== '') params.maxArea = maxArea;

      const res = await findPropertiesByLocation(params);
      if (res.success) {
        let items = res.data;

        if (selectedSort && selectedSort.toLowerCase().includes('area')) {
          const asc = selectedSort.toLowerCase().includes('low');
          items = items.sort((a, b) => {
            const aArea = parseFloat(a.area || a.areaValue || a.builtUpArea || 0) || 0;
            const bArea = parseFloat(b.area || b.areaValue || b.builtUpArea || 0) || 0;
            return asc ? aArea - bArea : bArea - aArea;
          });
        }

        const enriched = await resolveLocalities(items);
        if (isLoadMore) {
          setProperties((prev) => [...prev, ...enriched]);
        } else {
          setProperties(enriched);
        }

        if (enriched.length < params.limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
        setPage(pageToFetch);
      } else {
        if (!isLoadMore) {
          setProperties([]);
        }
        setHasMore(false);
      }
    } catch (err) {
      console.error("Match Fetch Error:", err);
      if (!isLoadMore) {
        setProperties([]);
      }
      setHasMore(false);
    } finally {
      setIsInitialLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchMatches(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, lookingTo, city, selectedLocality, selectedSort, selectedStructure, structureInput, selectedPropertyType, selectedSubPropertyType, selectedConstructionStatus, selectedPossessionStatus, minPrice, maxPrice, minArea, maxArea]);

  const clearAllFilters = () => {
    setSelectedLocality(null);
    setSelectedPropertyType(null);
    setSelectedSubPropertyType(null);
    setSelectedStructure(null);
    setStructureInput('');
    setSelectedConstructionStatus(null);
    setSelectedPossessionStatus(null);
    setMinPrice(null);
    setMaxPrice(null);
    setMinArea(null);
    setMaxArea(null);
    // reload properties after clearing
    fetchMatches(1, false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center h-[64px]" style={{ paddingHorizontal: wp('4%') }}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} className="justify-center items-center" style={{ width: wp('10%'), height: wp('10%'), marginRight: wp('2%') }}>
          <Ionicons name="arrow-back" size={wp('6%')} color="#4A5565" />
        </TouchableOpacity>
        <Text className="font-bold text-[#101828]" style={{ fontSize: wp('5%') }}>Perfectly Matched</Text>
      </View>

      {/* Horizontal Filter Chips */}
      <View style={{ paddingHorizontal: wp('4%'), marginBottom: hp('1.5%') }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: wp('2.5%') }}>
          <TouchableOpacity 
            onPress={openFilter}
            className="flex-row items-center bg-[#008E96] rounded-full"
            style={{ paddingHorizontal: wp('3.5%'), paddingVertical: hp('0.8%') }}
          >
            <Ionicons name="options-outline" size={wp('3.5%')} color="#ffffff" style={{ marginRight: wp('1.5%') }} />
            <Text className="text-white font-medium" style={{ fontSize: wp('3%') }}>Filters</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setSortModalVisible(true)}
            className="flex-row items-center bg-white border border-[#E4E7EC] rounded-full"
            style={{ paddingHorizontal: wp('3.5%'), paddingVertical: hp('0.8%') }}
          >
            <Text className="text-[#4A5565] font-medium" style={{ fontSize: wp('3%') }}>
              Sort: {selectedSort ? selectedSort.split(':')[0] : 'Relevance'}
            </Text>
            <Ionicons name="chevron-down" size={wp('3.5%')} color="#4A5565" style={{ marginLeft: wp('1%') }} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setLocalityModalVisible(true)}
            className="flex-row items-center bg-white border border-[#E4E7EC] rounded-full"
            style={{ paddingHorizontal: wp('3.5%'), paddingVertical: hp('0.8%') }}
          >
            <Text className="text-[#4A5565] font-medium" style={{ fontSize: wp('3%'), maxWidth: wp('25%') }} numberOfLines={1}>
              {selectedLocality ? (typeof selectedLocality === 'string' ? selectedLocality : selectedLocality.name) : 'Locality'}
            </Text>
            <Ionicons name="chevron-down" size={wp('3.5%')} color="#4A5565" style={{ marginLeft: wp('1%') }} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={openFilter}
            className="flex-row items-center bg-white border border-[#E4E7EC] rounded-full"
            style={{ paddingHorizontal: wp('3.5%'), paddingVertical: hp('0.8%') }}
          >
            <Text className="text-[#4A5565] font-medium" style={{ fontSize: wp('3%') }}>
              {(minPrice || maxPrice) ? `₹${minPrice || 0} - ${maxPrice ? '₹'+maxPrice : 'Any'}` : 'Budget'}
            </Text>
            <Ionicons name="chevron-down" size={wp('3.5%')} color="#4A5565" style={{ marginLeft: wp('1%') }} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={openFilter}
            className="flex-row items-center bg-white border border-[#E4E7EC] rounded-full"
            style={{ paddingHorizontal: wp('3.5%'), paddingVertical: hp('0.8%') }}
          >
            <Text className="text-[#4A5565] font-medium" style={{ fontSize: wp('3%') }}>
              {selectedPropertyType ? 'Type Selected' : 'Property Type'}
            </Text>
            <Ionicons name="chevron-down" size={wp('3.5%')} color="#4A5565" style={{ marginLeft: wp('1%') }} />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Property List */}
      <View style={{ flex: 1 }}>
        {loading && properties.length === 0 ? (
          <View className="flex-1 items-center justify-center" style={{ paddingVertical: hp('10%') }}>
            <ActivityIndicator size="large" color="#008E96" />
            <Text className="text-[#6A7282] font-medium" style={{ marginTop: hp('2%'), fontSize: wp('3.5%') }}>Searching...</Text>
          </View>
        ) : properties.length > 0 ? (
          <FlatList
            className="flex-1"
            style={{ paddingHorizontal: wp('4%') }}
            data={properties}
            keyExtractor={(item) => item._id}
            renderItem={({ item: property }) => (
              <View style={{ marginBottom: hp('3%') }}>
                <PerfectMatchCard
                  property={{
                    id: property._id,
                    price: `₹ ${property.price}`,
                    name: property.title,
                    developer: property.projectName || "Unknown Developer",
                    location: [
                      typeof property.locality === 'object' ? (property.locality?.name || '') : (property.localityName || property.locality || ''),
                      typeof property.city === 'object' ? (property.city?.name || '') : (property.city || ''),
                      typeof property.state === 'object' ? (property.state?.name || '') : (property.state || '')
                    ].filter(Boolean).join(', '),
                    details: `${property.residential?.bedrooms || 0} BHK • ${property.area || 0} ${property.areaUnit?.name || 'sq.ft.'}`,
                    seller: property.owner?.name || "Seller",
                    images: property.images?.length > 0 ? property.images : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600'],
                    photoCount: property.images?.length || 0,
                    isRera: true,
                    zeroBrokerage: true,
                    isWishlisted: property.isWishlisted || false
                  }}
                />
              </View>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: hp('12%') }}
            onEndReached={() => {
              if (hasMore && !loadingMore && !loading) {
                fetchMatches(page + 1, true);
              }
            }}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              loadingMore ? (
                <View className="items-center justify-center" style={{ paddingVertical: hp('2%') }}>
                  <ActivityIndicator size="small" color="#008E96" />
                </View>
              ) : null
            }
          />
        ) : (
          <View style={{ flex: 1, paddingHorizontal: wp('4%') }}>
            <NoDataFound />
          </View>
        )}
      </View>



      <Modal
        animationType="none"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={closeFilter}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <TouchableOpacity
            activeOpacity={1}
            className="absolute inset-0"
            onPress={closeFilter}
          >
            <BlurView
              intensity={90}
              tint="dark"
              style={{ flex: 1 }}
            />
          </TouchableOpacity>

          <Animated.View
            style={{
              height: sheetHeight,
              width: '100%',
              backgroundColor: 'white',
              borderTopLeftRadius: wp('6%'),
              borderTopRightRadius: wp('6%'),
              overflow: 'hidden'
            }}
          >
            <SafeAreaView style={{ flex: 1, paddingBottom: hp('2.5%') }}>
              {/* Handle */}
              <View className="items-center" style={{ paddingVertical: hp('1.5%') }}>
                <View className="bg-[#D0D5DD] rounded-full" style={{ width: wp('10%'), height: hp('0.5%') }} />
              </View>

              {/* Header */}
              <View className="flex-row justify-between items-center" style={{ paddingHorizontal: wp('5%'), paddingBottom: hp('2%') }}>
                <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('5%') }}>Filter</Text>
                <TouchableOpacity onPress={clearAllFilters}>
                  <Text className="text-[#008E96] font-medium" style={{ fontSize: wp('3.5%') }}>Clear all</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1"
                style={{ paddingHorizontal: wp('5%') }}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                {/* Searching In */}
                <View className="flex-row justify-between items-center" style={{ marginTop: hp('1.5%') }}>
                  <Text className="text-[#6A7282] font-normal" style={{ fontSize: wp('3.5%') }}>
                    You are currently looking in <Text className="font-semibold text-[#101828]">{city}</Text>
                  </Text>
                  <TouchableOpacity className="flex-row items-center">
                    <Text className="text-[#008E96] font-medium" style={{ fontSize: wp('4%') }}>Change Location</Text>
                    <Ionicons name="chevron-forward" size={wp('4%')} color="#008E96" style={{ marginLeft: wp('1%') }} />
                  </TouchableOpacity>
                </View>

                {/* Filter Applied Tag */}
                <View style={{ marginTop: hp('3%') }}>
                  <Text className="text-[#9CA3AF] font-normal" style={{ fontSize: wp('3.5%') }}>Filter Applied</Text>
                  <View className="flex-row" style={{ marginTop: hp('1%') }}>
                    <View className="flex-row items-center bg-[#008E96]/10 rounded-full" style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('0.8%') }}>
                      <Text className="text-[#008E96] font-medium" style={{ fontSize: wp('3.5%') }}>{city}</Text>
                      <Ionicons name="close-circle" size={wp('4%')} color="#008E96" style={{ marginLeft: wp('1.5%') }} />
                    </View>
                  </View>
                </View>

                {/* I'm Looking to */}
                <View style={{ marginTop: hp('4%') }}>
                  <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('4%') }}>{"I'm Looking to"}</Text>
                  <View className="flex-row flex-wrap" style={{ gap: wp('3%'), marginTop: hp('1.5%') }}>
                    {lookOptions.map(option => {
                      const isActive = lookingTo === option.value;
                      return (
                        <TouchableOpacity
                          key={option.value}
                          onPress={() => setLookingTo(option.value)}
                          className={`border ${isActive ? 'bg-[#008E96]/10 border-[#008E96]' : 'bg-white border-[#E4E7EC]'}`}
                          style={{ paddingHorizontal: wp('4%'), paddingVertical: hp('1.2%'), borderRadius: wp('3%') }}
                        >
                          <Text className={`font-medium ${isActive ? 'text-[#008E96]' : 'text-[#4A5565]'}`} style={{ fontSize: wp('3.5%') }}>
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Locality */}
                <View style={{ marginTop: hp('4%') }}>
                  <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('4%') }}>Locality</Text>
                  <TouchableOpacity 
                    onPress={() => setLocalityModalVisible(true)}
                    className="flex-row justify-between items-center border border-[#E4E7EC] bg-white"
                    style={{ marginTop: hp('1.5%'), paddingHorizontal: wp('4%'), paddingVertical: hp('1.5%'), borderRadius: wp('3%') }}
                  >
                    <Text className={selectedLocality ? "text-[#101828] font-medium" : "text-[#6A7282]"} style={{ fontSize: wp('3.8%') }}>
                      {selectedLocality ? (selectedLocality.name || selectedLocality) : 'Select Locality'}
                    </Text>
                    <Ionicons name="chevron-down" size={wp('5%')} color="#6A7282" />
                  </TouchableOpacity>
                </View>

                {/* Property Type */}
                <View style={{ marginTop: hp('2.5%') }}>
                  <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('4%') }}>Property Type <Ionicons name="information-circle-outline" size={wp('4%')} color="#6A7282" /></Text>
                  <View className="flex-row flex-wrap" style={{ gap: wp('3%'), marginTop: hp('1.5%') }}>
                    {propertyTypes && propertyTypes.length > 0 ? (
                      propertyTypes.map((pt) => {
                        const label = pt.label || pt.name || String(pt);
                        const key = pt._id || label;
                        const isActive = selectedPropertyType === key;
                        return (
                          <TouchableOpacity
                            key={key}
                            onPress={() => { setSelectedPropertyType(isActive ? null : key); setSelectedSubPropertyType(null); }}
                            className={`justify-center ${isActive ? 'bg-[#008E96]/10 border border-[#008E96]' : 'bg-white border border-[#E4E7EC]'}`}
                            style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('1.2%'), borderRadius: wp('3%'), minWidth: wp('22%') }}
                          >
                            <Text className={`font-medium ${isActive ? 'text-[#008E96]' : 'text-[#101828]'}`} style={{ fontSize: wp('3.3%') }}>{label}</Text>
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <Text className="text-[#6A7282]" style={{ fontSize: wp('3.5%') }}>Loading property types...</Text>
                    )}
                  </View>
                </View>

                {/* Sub Property Type */}
                <View style={{ marginTop: hp('2%') }}>
                  <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('4%') }}>Sub Property Type</Text>
                  <View className="flex-row flex-wrap" style={{ gap: wp('3%'), marginTop: hp('1.5%') }}>
                    {subPropertyTypes && subPropertyTypes.length > 0 ? (
                      subPropertyTypes
                        .filter(s => {
                          if (!selectedPropertyType) return true;
                          const ref = s.propertyType || s.property_type || s.parentPropertyType;
                          if (!ref) return true;
                          return (ref._id && ref._id === selectedPropertyType) || (ref.label && ref.label === selectedPropertyType) || (ref.name && ref.name === selectedPropertyType);
                        })
                        .map((s) => {
                          const label = s.label || s.name || String(s);
                          const key = s._id || label;
                          const isActive = selectedSubPropertyType === key;
                          return (
                            <TouchableOpacity
                              key={key}
                              onPress={() => setSelectedSubPropertyType(isActive ? null : key)}
                              className={`justify-center ${isActive ? 'bg-[#008E96]/10 border border-[#008E96]' : 'bg-white border border-[#E4E7EC]'}`}
                              style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('1.2%'), borderRadius: wp('3%'), minWidth: wp('22%') }}
                            >
                              <Text className={`font-medium ${isActive ? 'text-[#008E96]' : 'text-[#101828]'}`} style={{ fontSize: wp('3.3%') }}>{label}</Text>
                            </TouchableOpacity>
                          );
                        })
                    ) : (
                      <Text className="text-[#6A7282]" style={{ fontSize: wp('3.5%') }}>Loading sub property types...</Text>
                    )}
                  </View>
                </View>

                {/* Budget */}
                <View style={{ marginTop: hp('4%') }}>
                  <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('4%') }}>Budget</Text>
                  <View className="flex-row items-center" style={{ gap: wp('3%'), marginTop: hp('1.5%') }}>
                    <TextInput
                      placeholder="Min (₹)"
                      value={minPrice !== null && minPrice !== undefined ? String(minPrice) : ''}
                      onChangeText={(t) => {
                        const digits = String(t).replace(/[^0-9]/g, '');
                        setMinPrice(digits === '' ? null : digits);
                      }}
                      keyboardType="numeric"
                      returnKeyType="done"
                      className="flex-1 border border-[#E4E7EC] bg-white"
                      style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('1.2%'), borderRadius: wp('3%'), fontSize: wp('3.5%') }}
                    />
                    <TextInput
                      placeholder="Max (₹)"
                      value={maxPrice !== null && maxPrice !== undefined ? String(maxPrice) : ''}
                      onChangeText={(t) => {
                        const digits = String(t).replace(/[^0-9]/g, '');
                        setMaxPrice(digits === '' ? null : digits);
                      }}
                      keyboardType="numeric"
                      returnKeyType="done"
                      className="flex-1 border border-[#E4E7EC] bg-white"
                      style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('1.2%'), borderRadius: wp('3%'), fontSize: wp('3.5%') }}
                    />
                  </View>
                </View>

                {/* Built-up Area */}
                <View style={{ marginTop: hp('4%') }}>
                  <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('4%') }}>Built-up Area</Text>
                  <View className="flex-row items-center" style={{ gap: wp('3%'), marginTop: hp('1.5%') }}>
                    <TextInput
                      placeholder="Min Area (Sqft)"
                      value={minArea !== null && minArea !== undefined ? String(minArea) : ''}
                      onChangeText={(t) => {
                        const digits = String(t).replace(/[^0-9]/g, '');
                        setMinArea(digits === '' ? null : digits);
                      }}
                      keyboardType="numeric"
                      returnKeyType="done"
                      className="flex-1 border border-[#E4E7EC] bg-white"
                      style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('1.2%'), borderRadius: wp('3%'), fontSize: wp('3.5%') }}
                    />
                    <TextInput
                      placeholder="Max Area (Sqft)"
                      value={maxArea !== null && maxArea !== undefined ? String(maxArea) : ''}
                      onChangeText={(t) => {
                        const digits = String(t).replace(/[^0-9]/g, '');
                        setMaxArea(digits === '' ? null : digits);
                      }}
                      keyboardType="numeric"
                      returnKeyType="done"
                      className="flex-1 border border-[#E4E7EC] bg-white"
                      style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('1.2%'), borderRadius: wp('3%'), fontSize: wp('3.5%') }}
                    />
                  </View>
                </View>

                {/* Structure Type */}
                <View style={{ marginTop: hp('4%') }}>
                  <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('4%') }}>Structure Type</Text>
                  <View style={{ marginTop: hp('1.5%') }}>
                    <TextInput
                      placeholder="Enter structure (numbers only)"
                      value={structureInput}
                      onChangeText={(t) => {
                        const digits = String(t).replace(/[^0-9]/g, '');
                        setStructureInput(digits);
                        setSelectedStructure(null);
                      }}
                      keyboardType="numeric"
                      returnKeyType="done"
                      maxLength={10}
                      className="border border-[#E4E7EC] bg-white"
                      style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('1.2%'), borderRadius: wp('3%'), fontSize: wp('3.5%') }}
                    />
                  </View>

                  <View className="flex-row flex-wrap" style={{ gap: wp('3%'), marginTop: hp('1.5%') }}>
                    {structures && structures.length > 0 ? (
                      structures.map((st) => {
                        const label = st.label || st.name || String(st);
                        const key = st._id || label;
                        const isActive = selectedStructure === (st._id || label);
                        return (
                          <TouchableOpacity
                            key={key}
                            onPress={() => { setSelectedStructure(isActive ? null : (st._id || label)); setStructureInput(''); }}
                            className={`border justify-center ${isActive ? 'bg-[#008E96]/10 border-[#008E96]' : 'bg-white border-[#E4E7EC]'}`}
                            style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('1.2%'), borderRadius: wp('3%'), minWidth: wp('22%') }}
                          >
                            <Text className={`font-medium ${isActive ? 'text-[#008E96]' : 'text-[#101828]'}`} style={{ fontSize: wp('3.3%') }}>
                              {label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <Text className="text-[#6A7282]" style={{ fontSize: wp('3.5%') }}>Loading structures...</Text>
                    )}
                  </View>
                </View>

                {/* Construction Status */}
                <View style={{ marginTop: hp('2.5%') }}>
                  <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('4%') }}>Construction Status</Text>
                  <View className="flex-row flex-wrap" style={{ gap: wp('3%'), marginTop: hp('1.5%') }}>
                    {constructionStatus && constructionStatus.length > 0 ? (
                      constructionStatus.map((cs) => {
                        const label = cs.label || cs.name || String(cs);
                        const key = cs._id || label;
                        const isActive = selectedConstructionStatus === key;
                        return (
                          <TouchableOpacity
                            key={key}
                            onPress={() => setSelectedConstructionStatus(isActive ? null : key)}
                            className={`justify-center ${isActive ? 'bg-[#008E96]/10 border border-[#008E96]' : 'bg-white border-[#E4E7EC]'}`}
                            style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('1.2%'), borderRadius: wp('3%'), minWidth: wp('22%') }}
                          >
                            <Text className={`font-medium ${isActive ? 'text-[#008E96]' : 'text-[#101828]'}`} style={{ fontSize: wp('3.3%') }}>{label}</Text>
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <Text className="text-[#6A7282]" style={{ fontSize: wp('3.5%') }}>Loading construction statuses...</Text>
                    )}
                  </View>
                </View>

                {/* Possession Status */}
                <View style={{ marginTop: hp('2.5%'), marginBottom: hp('5%') }}>
                  <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('4%') }}>Possession Status</Text>
                  <View className="flex-row flex-wrap" style={{ gap: wp('3%'), marginTop: hp('1.5%') }}>
                    {possessionStatus && possessionStatus.length > 0 ? (
                      possessionStatus.map((ps) => {
                        const label = ps.label || ps.name || String(ps);
                        const key = ps._id || label;
                        const isActive = selectedPossessionStatus === key;
                        return (
                          <TouchableOpacity
                            key={key}
                            onPress={() => setSelectedPossessionStatus(isActive ? null : key)}
                            className={`justify-center ${isActive ? 'bg-[#008E96]/10 border border-[#008E96]' : 'bg-white border-[#E4E7EC]'}`}
                            style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('1.2%'), borderRadius: wp('3%'), minWidth: wp('22%') }}
                          >
                            <Text className={`font-medium ${isActive ? 'text-[#008E96]' : 'text-[#101828]'}`} style={{ fontSize: wp('3.3%') }}>{label}</Text>
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <Text className="text-[#6A7282]" style={{ fontSize: wp('3.5%') }}>Loading possession statuses...</Text>
                    )}
                  </View>
                </View>
              </ScrollView>

              {/* Bottom Fixed Apply Button Container */}
              <View className="bg-white border-t border-[#F2F4F7]" style={{ paddingHorizontal: wp('5%'), paddingVertical: hp('2.5%') }}>
                <TouchableOpacity
                  className="bg-[#008E96] items-center overflow-hidden"
                  style={{
                    marginBottom: hp('1%'),
                    paddingVertical: hp('2%'),
                    borderRadius: wp('3%'),
                    shadowColor: '#008E96',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.4,
                    shadowRadius: 20,
                    elevation: 10,
                  }}
                  onPress={closeFilter}
                >
                  <LinearGradient
                    colors={['#008E96', '#1CB2A9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: wp('3%') }}
                  />
                  <Text className="text-white font-bold" style={{ fontSize: wp('4%') }}>View Properties</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>

      {/* Sort Modal (Based on CSS) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={sortModalVisible}
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View style={{ flex: 1 }}>
          {sortModalVisible && (
            <BlurView
              intensity={50}
              tint="light"
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
          )}
          <Pressable
            className="flex-1 justify-end"
            onPress={() => setSortModalVisible(false)}
          >
            <View className="bg-white" style={{ borderTopLeftRadius: wp('6%'), borderTopRightRadius: wp('6%'), paddingBottom: hp('5%') }}>
              {/* Header section (Frame 8) */}
              <View className="bg-[#E4E7EC]/50" style={{ borderTopLeftRadius: wp('6%'), borderTopRightRadius: wp('6%'), paddingTop: hp('2.5%'), paddingHorizontal: wp('5%'), paddingBottom: hp('2.5%') }}>
                <View className="self-center bg-[#D9D9D9] rounded-full" style={{ width: wp('13.5%'), height: hp('0.8%'), marginBottom: hp('1.5%') }} />
                <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('5%'), lineHeight: wp('7.5%') }}>Sort by</Text>
              </View>

              {/* Options section (Frame 9) */}
              <View style={{ paddingHorizontal: wp('4%'), marginTop: hp('1.2%'), gap: hp('1%') }}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setSelectedSort(option)}
                    className={`items-center rounded-sm ${selectedSort === option ? 'bg-[#1CB2A9]/5' : ''}`}
                    style={{ paddingVertical: hp('1%') }}
                  >
                    <Text className={`font-normal text-center ${selectedSort === option ? 'text-[#008E96]' : 'text-black'}`} style={{ fontSize: wp('3.5%'), lineHeight: wp('5%') }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Apply Button */}
              <View className="items-center" style={{ paddingHorizontal: wp('4%'), marginTop: hp('3%') }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSortModalVisible(false)}
                  className="w-full"
                >
                  <LinearGradient
                    colors={['#008E96', '#1CB2A9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="items-center justify-center"
                    style={{
                      paddingVertical: hp('1.8%'),
                      borderRadius: wp('3%'),
                      shadowColor: '#008E96',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 16,
                      elevation: 4
                    }}
                  >
                    <Text className="text-white font-semibold" style={{ fontSize: wp('4%'), lineHeight: wp('6%') }}>Apply filters</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </View>
      </Modal>

      {/* Locality Dropdown Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={localityModalVisible}
        onRequestClose={() => setLocalityModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <TouchableOpacity 
            activeOpacity={1} 
            className="absolute inset-0"
            onPress={() => setLocalityModalVisible(false)}
          />
          
          <View className="bg-white max-h-[70%]" style={{ borderTopLeftRadius: wp('6%'), borderTopRightRadius: wp('6%'), paddingBottom: hp('5%') }}>
            <View className="items-center" style={{ paddingVertical: hp('1.5%') }}>
              <View className="bg-gray-200 rounded-full" style={{ width: wp('10%'), height: hp('0.5%') }} />
            </View>

            <View className="border-b border-gray-100 flex-row justify-between items-center" style={{ paddingHorizontal: wp('5%'), paddingBottom: hp('1.5%') }}>
              <Text className="text-[#101828] font-bold" style={{ fontSize: wp('4.5%') }}>Select Locality</Text>
              <TouchableOpacity onPress={() => setLocalityModalVisible(false)}>
                <Text className="text-[#6A7282] font-medium" style={{ fontSize: wp('3.5%') }}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: wp('5%'), marginTop: hp('1%') }}>
              {loadingLocalities ? (
                <View className="items-center justify-center" style={{ paddingVertical: hp('5%') }}>
                  <ActivityIndicator size="small" color="#008E96" />
                </View>
              ) : localitiesList && localitiesList.length > 0 ? (
                localitiesList.map((loc) => {
                  const label = loc.name || String(loc);
                  const key = loc._id || label;
                  const isSelected = selectedLocality && (
                    selectedLocality._id === loc._id || 
                    selectedLocality === loc ||
                    (typeof selectedLocality === 'string' && selectedLocality === loc.name) ||
                    (selectedLocality.name && selectedLocality.name === loc.name)
                  );
                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => {
                        setSelectedLocality(isSelected ? null : loc);
                        setLocalityModalVisible(false);
                      }}
                      className="border-b border-gray-50 flex-row justify-between items-center"
                      style={{ paddingVertical: hp('2%') }}
                    >
                      <Text 
                        style={{ fontWeight: isSelected ? '600' : '400', fontSize: wp('3.8%') }}
                        className={isSelected ? 'text-[#008E96]' : 'text-[#344054]'}
                      >
                        {label}
                      </Text>
                      {isSelected && (
                        <View className="rounded-full bg-[#008E96] items-center justify-center" style={{ width: wp('5%'), height: wp('5%') }}>
                          <Text className="text-white font-bold" style={{ fontSize: wp('2.5%') }}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View className="items-center justify-center" style={{ paddingVertical: hp('5%') }}>
                  <Text className="text-gray-400 font-medium" style={{ fontSize: wp('3.5%') }}>No localities found</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PrefectlyMatchedHome;
