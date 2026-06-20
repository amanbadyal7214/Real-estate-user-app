import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, FlatList, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import PropertyListingCard from '../../components/PropertyListingCard';
import { useLookup } from '../../hooks/useLookup';
import { usePropertyDiscovery } from '../../hooks/usePropertyDiscovery';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LastSearched = () => {
  const router = useRouter();
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Price: High to Low');
  // Lock searching to Buy (which maps to API lookingFor: 'sell') and prevent changes
  const [lookingTo] = useState('sell');

  // Animation for Bottom Sheet
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const isFullScreen = useRef(false);

  const openFilter = () => {
    setFilterModalVisible(true);
    Animated.spring(translateY, {
      toValue: SCREEN_HEIGHT * 0.4, // Open to 60% of screen (staring at 40% from top)
      useNativeDriver: true,
      damping: 20,
    }).start();
  };

  const closeFilter = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setFilterModalVisible(false));
  };

  const handleScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    if (currentScrollY > 10 && !isFullScreen.current) {
      isFullScreen.current = true;
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT * 0.05, // Almost full screen
        useNativeDriver: true,
        damping: 20,
      }).start();
    } else if (currentScrollY <= 0 && isFullScreen.current) {
      isFullScreen.current = false;
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT * 0.4,
        useNativeDriver: true,
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

  // Only show Buy as available and keep it selected (disabled for changes)
  const lookOptions = ['Buy'];
  // propertyTypes, subPropertyTypes, structures and statuses will be fetched from lookup API
  const { propertyTypes = [], subPropertyTypes = [], structures = [], constructionStatus = [], possessionStatus = [], fetchLookups } = useLookup();
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

  const { fetchProperties, loading: apiLoading } = usePropertyDiscovery();
  const [properties, setProperties] = useState([]);

  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  const loading = isInitialLoading || apiLoading;

  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  const loadProperties = async (pageToFetch = 1, isLoadMore = false) => {
    if (isLoadMore && (loadingMore || !hasMore)) return;

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setIsInitialLoading(true);
      setHasMore(true);
      setPage(1);
    }

    try {
      const params = { city: 'Mohali', lookingFor: lookingTo, limit: 10, page: pageToFetch };

      // include selected property/sub-property/structure in params when present
      if (selectedPropertyType) params.propertyType = selectedPropertyType;
      if (selectedSubPropertyType) params.subPropertyType = selectedSubPropertyType;
      if (selectedConstructionStatus) params.constructionStatus = selectedConstructionStatus;
      if (selectedPossessionStatus) params.possessionStatus = selectedPossessionStatus;

      // include selected structure (from dropdown) or freeform input
      if (selectedStructure) {
        params.structure = selectedStructure;
      } else if (structureInput && structureInput.trim().length > 0) {
        params.structure = structureInput.trim();
      }

      // Map selected sort to API params when possible
      if (selectedSort && selectedSort.toLowerCase().includes('price')) {
        // Price : Low to High -> PriceAscending: true
        params.PriceAscending = selectedSort.toLowerCase().includes('low');
      }

      // include price & area ranges when present
      if (minPrice !== null && minPrice !== undefined && minPrice !== '') params.minPrice = minPrice;
      if (maxPrice !== null && maxPrice !== undefined && maxPrice !== '') params.maxPrice = maxPrice;
      if (minArea !== null && minArea !== undefined && minArea !== '') params.minArea = minArea;
      if (maxArea !== null && maxArea !== undefined && maxArea !== '') params.maxArea = maxArea;

      const response = await fetchProperties(params);
      if (response?.data) {
        let items = response.data;

        // If sorting by area, perform client-side sort (server may not support it)
        if (selectedSort && selectedSort.toLowerCase().includes('area')) {
          const asc = selectedSort.toLowerCase().includes('low');
          items = items.sort((a, b) => {
            const aArea = parseFloat(a.area || a.areaValue || a.builtUpArea || 0) || 0;
            const bArea = parseFloat(b.area || b.areaValue || b.builtUpArea || 0) || 0;
            return asc ? aArea - bArea : bArea - aArea;
          });
        }

        if (isLoadMore) {
          setProperties((prev) => [...prev, ...items]);
        } else {
          setProperties(items);
        }

        if (items.length < params.limit) {
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
      console.error("Error loading properties:", err);
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
    loadProperties(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookingTo, selectedSort, selectedStructure, structureInput, selectedPropertyType, selectedSubPropertyType, selectedConstructionStatus, selectedPossessionStatus, minPrice, maxPrice, minArea, maxArea]);

  const clearAllFilters = () => {
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
    loadProperties(1, false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="flex-1">
        {/* Header Container (Based on CSS) */}
        <View className="flex-row justify-between items-center h-[64px]" style={{ paddingHorizontal: wp('4%') }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={wp('6%')} color="#4A5565" />
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        {loading && properties.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#008E96" />
            <Text className="text-[#667085] font-inter-medium" style={{ marginTop: hp('2%'), fontSize: wp('3.5%') }}>Loading listings...</Text>
          </View>
        ) : (
          <FlatList
            className="flex-1"
            style={{ paddingHorizontal: wp('4%') }}
            data={properties}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={{ marginBottom: hp('3%') }}>
                <PropertyListingCard data={item} />
              </View>
            )}
            ListHeaderComponent={
              <View className="flex-row items-center" style={{ marginTop: hp('1%'), marginBottom: hp('3%'), height: hp('4%') }}>
                <TouchableOpacity className="flex-row items-center bg-[#008E96]/10 rounded-full" style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('0.8%') }}>
                  <Text className="text-[#008E96] font-inter-medium" style={{ fontSize: wp('3.5%') }}>+ Add</Text>
                </TouchableOpacity>
                <View style={{ marginLeft: wp('2%') }}>
                  <Text className="text-[#008E96] font-inter-semibold" style={{ fontSize: wp('4%') }}>Mohali</Text>
                </View>
              </View>
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: hp('12%') }}
            onEndReached={() => {
              if (hasMore && !loadingMore && !loading) {
                loadProperties(page + 1, true);
              }
            }}
            onEndReachedThreshold={0.2}
            ListEmptyComponent={
              <View className="items-center" style={{ paddingVertical: hp('10%') }}>
                <Ionicons name="home-outline" size={wp('12%')} color="#D0D5DD" />
                <Text className="text-[#667085] font-inter-medium" style={{ marginTop: hp('2%'), fontSize: wp('3.5%') }}>No listings found for Mohali</Text>
              </View>
            }
            ListFooterComponent={
              loadingMore ? (
                <View className="items-center justify-center" style={{ paddingVertical: hp('2%') }}>
                  <ActivityIndicator size="small" color="#008E96" />
                </View>
              ) : null
            }
          />
        )}
      </View>

      {/* Floating Action Buttons */}
      <View 
        className="absolute self-center flex-row bg-white rounded-full border border-[#E4E7EC]" 
        style={{ 
          bottom: hp('3.5%'),
          width: wp('55%'), 
          height: hp('7%'),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 5
        }}
      >
        <TouchableOpacity 
          className="flex-1 items-center justify-center flex-row"
          style={{ gap: wp('1%') }}
          onPress={() => setSortModalVisible(true)}
        >
          <MaterialIcons name="sort" size={wp('5%')} color="#008E96" />
          <Text className="text-[#008E96] font-inter-medium" style={{ fontSize: wp('3.3%') }}>Sort</Text>
        </TouchableOpacity>
        <View className="bg-[#E4E7EC] self-center" style={{ width: 1, height: hp('4%') }} />
        <TouchableOpacity 
          className="flex-1 items-center justify-center flex-row"
          style={{ gap: wp('1%') }}
          onPress={openFilter}
        >
          <Ionicons name="options-outline" size={wp('5%')} color="#008E96" />
          <Text className="text-[#008E96] font-inter-medium" style={{ fontSize: wp('3.3%') }}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={closeFilter}
      >
        <View className="flex-1">
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
              transform: [{ translateY }],
              height: SCREEN_HEIGHT,
              width: '100%',
              position: 'absolute'
            }}
          >
            <SafeAreaView className="bg-white" style={{ borderTopLeftRadius: wp('6%'), borderTopRightRadius: wp('6%'), flex: 1, paddingBottom: hp('2.5%') }}>
              {/* Handle */}
              <View className="items-center" style={{ paddingVertical: hp('1.5%') }}>
                <View className="bg-[#D0D5DD] rounded-full" style={{ width: wp('10%'), height: hp('0.5%') }} />
              </View>

              {/* Header */}
              <View className="flex-row justify-between items-center" style={{ paddingHorizontal: wp('5%'), paddingBottom: hp('2%') }}>
                <Text className="text-[#101828] font-inter-semibold" style={{ fontSize: wp('5%') }}>Filter</Text>
                <TouchableOpacity onPress={clearAllFilters}>
                  <Text className="text-[#008E96] font-inter-medium" style={{ fontSize: wp('3.5%') }}>Clear all</Text>
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
                  <Text className="text-[#6A7282] font-inter-regular" style={{ fontSize: wp('3.5%') }}>
                    You are currently looking in <Text className="font-inter-semibold text-[#101828]">Mohali</Text>
                  </Text>
                  <TouchableOpacity className="flex-row items-center">
                    <Text className="text-[#008E96] font-inter-medium" style={{ fontSize: wp('4%') }}>Change Location</Text>
                    <Ionicons name="chevron-forward" size={wp('4%')} color="#008E96" style={{ marginLeft: wp('1%') }} />
                  </TouchableOpacity>
                </View>

                {/* Filter Applied Tag */}
                <View style={{ marginTop: hp('3%') }}>
                  <Text className="text-[#9CA3AF] font-inter-regular" style={{ fontSize: wp('3.5%') }}>Filter Applied</Text>
                  <View className="flex-row" style={{ marginTop: hp('1%') }}>
                    <View className="flex-row items-center bg-[#008E96]/10 rounded-full" style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('0.8%') }}>
                      <Text className="text-[#008E96] font-inter-medium" style={{ fontSize: wp('3.5%') }}>Mohali</Text>
                      <Ionicons name="close-circle" size={wp('4%')} color="#008E96" style={{ marginLeft: wp('1.5%') }} />
                    </View>
                  </View>
                </View>

                {/* I'm Looking to */}
                <View style={{ marginTop: hp('4%') }}>
                  <Text className="text-[#101828] font-inter-semibold" style={{ fontSize: wp('4%') }}>{"I'm Looking to"}</Text>
                  <View className="flex-row flex-wrap" style={{ gap: wp('3%'), marginTop: hp('1.5%') }}>
                    {lookOptions.map(option => (
                      <TouchableOpacity 
                        key={option}
                        activeOpacity={1}
                        className={`border bg-[#008E96]/10 border-[#008E96]`}
                        style={{ paddingHorizontal: wp('4%'), paddingVertical: hp('1.2%'), borderRadius: wp('3%') }}
                      >
                        <Text className={`font-inter-medium text-[#008E96]`} style={{ fontSize: wp('3.5%') }}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Localities */}
                <View style={{ marginTop: hp('4%') }}>
                  <Text className="text-[#101828] font-inter-semibold" style={{ fontSize: wp('4%') }}>Localities</Text>
                  <View className="flex-row items-center" style={{ gap: wp('3%'), marginTop: hp('1.5%') }}>
                    <TouchableOpacity 
                      className="flex-row items-center overflow-hidden"
                      style={{ backgroundColor: '#008E96', paddingHorizontal: wp('4%'), paddingVertical: hp('1.2%'), borderRadius: wp('3%') }}
                    >
                      <LinearGradient
                        colors={['#008E96', '#1CB2A9']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: wp('3%') }}
                      />
                      <Text className="text-white font-inter-semibold" style={{ fontSize: wp('3.5%') }}>+ Add More</Text>
                    </TouchableOpacity>
                    <View className="flex-row items-center bg-[#008E96]/10 rounded-full" style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('0.8%') }}>
                      <Text className="text-[#008E96] font-inter-medium" style={{ fontSize: wp('3.5%') }}>Mohali</Text>
                      <Ionicons name="close-circle" size={wp('4%')} color="#008E96" style={{ marginLeft: wp('1.5%') }} />
                    </View>
                  </View>
                </View>

                {/* Property Type */}
                <View style={{ marginTop: hp('2.5%') }}>
                  <Text className="text-[#101828] font-inter-semibold" style={{ fontSize: wp('4%') }}>Property Type <Ionicons name="information-circle-outline" size={wp('4%')} color="#6A7282" /></Text>
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
                            <Text className={`font-inter-medium ${isActive ? 'text-[#008E96]' : 'text-[#101828]'}`} style={{ fontSize: wp('3.3%') }}>{label}</Text>
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
                  <Text className="text-[#101828] font-inter-semibold" style={{ fontSize: wp('4%') }}>Sub Property Type</Text>
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
                              <Text className={`font-inter-medium ${isActive ? 'text-[#008E96]' : 'text-[#101828]'}`} style={{ fontSize: wp('3.3%') }}>{label}</Text>
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
                  <Text className="text-[#101828] font-inter-semibold" style={{ fontSize: wp('4%') }}>Budget</Text>
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
                  <Text className="text-[#101828] font-inter-semibold" style={{ fontSize: wp('4%') }}>Built-up Area</Text>
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
                  <Text className="text-[#101828] font-inter-semibold" style={{ fontSize: wp('4%') }}>Structure Type</Text>
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
                            <Text className={`font-inter-medium ${isActive ? 'text-[#008E96]' : 'text-[#101828]'}`} style={{ fontSize: wp('3.3%') }}>
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
                  <Text className="text-[#101828] font-inter-semibold" style={{ fontSize: wp('4%') }}>Construction Status</Text>
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
                            <Text className={`font-inter-medium ${isActive ? 'text-[#008E96]' : 'text-[#101828]'}`} style={{ fontSize: wp('3.3%') }}>{label}</Text>
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
                  <Text className="text-[#101828] font-inter-semibold" style={{ fontSize: wp('4%') }}>Possession Status</Text>
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
                            <Text className={`font-inter-medium ${isActive ? 'text-[#008E96]' : 'text-[#101828]'}`} style={{ fontSize: wp('3.3%') }}>{label}</Text>
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
                  <Text className="text-white font-inter-bold" style={{ fontSize: wp('4%') }}>View Properties</Text>
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
        <View className="flex-1">
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
                <Text className="text-[#101828] font-inter-semibold" style={{ fontSize: wp('5%'), lineHeight: wp('7.5%') }}>Sort by</Text>
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
                    <Text className={`font-inter-regular text-center ${selectedSort === option ? 'text-[#008E96]' : 'text-black'}`} style={{ fontSize: wp('3.5%'), lineHeight: wp('5%') }}>
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
                    <Text className="text-white font-inter-semibold" style={{ fontSize: wp('4%'), lineHeight: wp('6%') }}>Apply filters</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default LastSearched;
