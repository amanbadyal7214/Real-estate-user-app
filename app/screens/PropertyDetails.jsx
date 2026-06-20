import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ProjectPropertiesSection from '../../components/ProjectPropertiesSection';
import { usePropertyDiscovery } from '../../hooks/usePropertyDiscovery';
import api from '../api';
import { formatPrice } from '../utils/formatPrice';

const parseMaybeJson = (value) => {
  if (!value || typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

// using shared formatPrice

const formatArea = (value, unit = 'sq.ft.') => {
  if (!value) return 'N/A';
  return `${value} ${unit}`;
};

const getDisplayValue = (value) => {
  if (!value) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return value.label || value.name || value.title || value.value || '';
};

const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const getFurnishingLabel = (status) => {
  const name = status?.name || status || '';
  if (name === 'fully_furnished') return 'Fully Furnished';
  if (name === 'semi_furnished') return 'Semi Furnished';
  if (name === 'unfurnished') return 'Unfurnished';
  return name || 'N/A';
};

const PropertyDetails = () => {
  const router = useRouter();
  const { propertyId, property } = useLocalSearchParams();
  const initialProperty = useMemo(() => parseMaybeJson(property), [property]);
  const [propertyData, setPropertyData] = useState(initialProperty);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('Overview');
  const [resolvedFacing, setResolvedFacing] = useState('');
  const [resolvedZoneType, setResolvedZoneType] = useState('');
  const [resolvedLocationHub, setResolvedLocationHub] = useState('');
  const [resolvedOwnership, setResolvedOwnership] = useState('');
  const flatListRef = useRef(null);
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toast, setToast] = useState(null);

  const recordedViewsRef = useRef(new Set());

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  useEffect(() => {
    if (propertyData) {
      setIsWishlisted(!!propertyData.isWishlisted);
    }
  }, [propertyData]);

  const toggleWishlist = async () => {
    const targetId = propertyId || propertyData?._id || propertyData?.id;
    if (!targetId) {
      showToast("Property ID is missing");
      return;
    }
    try {
      const nextState = !isWishlisted;
      setIsWishlisted(nextState);
      const res = nextState 
        ? await api.post(`/properties/wishlist/${targetId}`)
        : await api.delete(`/properties/wishlist/${targetId}`);
      if (res.data?.success) {
        showToast(res.data.message || (nextState ? "Property added to wishlist" : "Property removed from wishlist"));
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      setIsWishlisted(prev => !prev);
      showToast(err.response?.data?.message || err.response?.data?.error || "Failed to update wishlist");
    }
  };

  const { fetchPropertyById, loading: fetching } = usePropertyDiscovery();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!initialProperty && propertyId) {
        try {
          const data = await fetchPropertyById(propertyId);
          if (mounted) {
            const dataToSet = data?.data || data?.property || data;
            setPropertyData(dataToSet);
          }
        } catch (err) {
          console.error('Error fetching property:', err);
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [fetchPropertyById, initialProperty, propertyId]);

  useEffect(() => {
    if (fetching) return;

    const targetId = propertyId || propertyData?._id || propertyData?.id;
    if (targetId && !recordedViewsRef.current.has(targetId)) {
      recordedViewsRef.current.add(targetId);
      const recordView = async () => {
        try {
          await api.post(`/properties/view/${targetId}`);
        } catch (err) {
          console.error("Error logging property view:", err.response?.data || err.message);
        }
      };
      // 500ms delay to make sure GET request transaction is fully completed on the server
      setTimeout(recordView, 500);
    }
  }, [propertyId, propertyData?._id, propertyData?.id, fetching]);

  const normalizedProperty = propertyData || {};
  const projectInfo = normalizedProperty.project || {};
  const residentialInfo = normalizedProperty.residential || {};
  const commercialInfo = normalizedProperty.commercial || {};
  const plotInfo = normalizedProperty.plot || {};
  const pgInfo = normalizedProperty.pg || {};
  const sellerInfo = normalizedProperty.user || {};

  const propType = useMemo(() => {
    const typeObj = normalizedProperty.propertyType;
    if (!typeObj) return 'residential';
    const name = typeof typeObj === 'string' ? typeObj : (typeObj.name || typeObj.label || '');
    return name.toLowerCase();
  }, [normalizedProperty.propertyType]);

  const isRent = useMemo(() => {
    const lookingForObj = normalizedProperty.lookingFor;
    if (!lookingForObj) return false;
    const name = typeof lookingForObj === 'string' ? lookingForObj : (lookingForObj.name || lookingForObj.label || '');
    return name.toLowerCase() === 'rent';
  }, [normalizedProperty.lookingFor]);

  const subtitle = useMemo(() => {
    if (propType === 'residential') {
      const config = residentialInfo.structure?.id?.name || 'BHK';
      return `${residentialInfo.bedrooms || 0} ${config} • ${getFurnishingLabel(residentialInfo.furnishingStatus)}`;
    } else if (propType === 'commercial') {
      const typeLabel = commercialInfo.officeType
        ? capitalize(commercialInfo.officeType)
        : 'Commercial Space';
      return `${typeLabel} • ${resolvedOwnership || 'Commercial'}`;
    } else if (propType === 'plot') {
      return `${plotInfo.isCornerPlot ? 'Corner Plot' : 'Standard Plot'} • Plot`;
    } else if (propType === 'pg') {
      return `PG Accommodation • ${pgInfo.mealsAvailable ? 'Meals Included' : 'No Meals'}`;
    }
    return '';
  }, [propType, residentialInfo, commercialInfo, resolvedOwnership, plotInfo, pgInfo]);

  const overviewSpecs = useMemo(() => {
    if (propType === 'commercial') {
      return [
        { label: 'Office/Shop Type', value: commercialInfo.officeType ? capitalize(commercialInfo.officeType) : 'N/A', icon: 'briefcase-outline' },
        { label: 'Built Up Area', value: formatArea(commercialInfo.builtUpArea?.value || normalizedProperty.area), icon: 'move-outline' },
        { label: 'Meeting Rooms', value: commercialInfo.meetingRooms?.toString() || '0', icon: 'chatbubbles-outline' },
        { label: 'Ownership', value: resolvedOwnership || 'N/A', icon: 'key-outline' },
      ];
    } else if (propType === 'plot') {
      return [
        { label: 'Plot Area', value: formatArea(normalizedProperty.area), icon: 'resize-outline' },
        { label: 'Corner Plot', value: plotInfo.isCornerPlot ? 'Yes' : 'No', icon: 'map-outline' },
        { label: 'Boundary Wall', value: plotInfo.isBoundaryWall ? 'Yes' : 'No', icon: 'shield-checkmark-outline' },
        { label: 'Facing', value: resolvedFacing || getDisplayValue(normalizedProperty.facing) || 'N/A', icon: 'compass-outline' },
      ];
    } else if (propType === 'pg') {
      return [
        { label: 'Meals Available', value: pgInfo.mealsAvailable ? 'Yes' : 'No', icon: 'restaurant-outline' },
        { label: 'Common Areas', value: pgInfo.commonAreas && pgInfo.commonAreas.length > 0 ? 'Available' : 'None', icon: 'people-outline' },
        { label: 'Rooms/Sharing', value: pgInfo.rooms && pgInfo.rooms.length > 0 ? `${pgInfo.rooms.length} Rooms` : 'N/A', icon: 'bed-outline' },
        { label: 'Pincode', value: normalizedProperty.pincode || 'N/A', icon: 'location-outline' },
      ];
    } else {
      // Default / Residential
      return [
        { label: 'Bedrooms', value: `${residentialInfo.bedrooms || 0} BHK`, icon: 'bed-outline' },
        { label: 'Bathrooms', value: residentialInfo.bathrooms || 'N/A', icon: 'water-outline' },
        { label: 'Floor', value: `${residentialInfo.floor || 'N/A'} of ${residentialInfo.totalFloors || 'N/A'}`, icon: 'layers-outline' },
        { label: 'Facing', value: resolvedFacing || getDisplayValue(normalizedProperty.facing) || 'N/A', icon: 'compass-outline' },
      ];
    }
  }, [propType, commercialInfo, plotInfo, pgInfo, residentialInfo, resolvedFacing, resolvedOwnership, normalizedProperty]);

  // Resolve Zone Type
  useEffect(() => {
    let active = true;
    const val = commercialInfo.zoneType;
    if (!val) {
      setResolvedZoneType('');
      return;
    }
    const text = typeof val === 'string' || typeof val === 'number' ? String(val) : getDisplayValue(val);
    const isId = /^[0-9a-fA-F]{24}$/.test(text);
    if (!isId) {
      setResolvedZoneType(capitalize(text));
      return;
    }
    const load = async () => {
      try {
        const response = await api.get(`/zone-types/${text}`);
        const data = response.data?.data || response.data;
        if (active) {
          setResolvedZoneType(capitalize(data?.label || data?.name || text));
        }
      } catch (error) {
        if (active) setResolvedZoneType(capitalize(text));
        console.error('Error resolving zone type:', error);
      }
    };
    load();
    return () => { active = false; };
  }, [commercialInfo.zoneType]);

  // Resolve Location Hub
  useEffect(() => {
    let active = true;
    const val = commercialInfo.locationHub;
    if (!val) {
      setResolvedLocationHub('');
      return;
    }
    const text = typeof val === 'string' || typeof val === 'number' ? String(val) : getDisplayValue(val);
    const isId = /^[0-9a-fA-F]{24}$/.test(text);
    if (!isId) {
      setResolvedLocationHub(capitalize(text));
      return;
    }
    const load = async () => {
      try {
        const response = await api.get(`/location-hubs/${text}`);
        const data = response.data?.data || response.data;
        if (active) {
          setResolvedLocationHub(capitalize(data?.label || data?.name || text));
        }
      } catch (error) {
        if (active) setResolvedLocationHub(capitalize(text));
        console.error('Error resolving location hub:', error);
      }
    };
    load();
    return () => { active = false; };
  }, [commercialInfo.locationHub]);

  // Resolve Ownership Type
  useEffect(() => {
    let active = true;
    const val = commercialInfo.ownershipType;
    if (!val) {
      setResolvedOwnership('');
      return;
    }
    const text = typeof val === 'string' || typeof val === 'number' ? String(val) : getDisplayValue(val);
    const isId = /^[0-9a-fA-F]{24}$/.test(text);
    if (!isId) {
      setResolvedOwnership(capitalize(text));
      return;
    }
    const load = async () => {
      try {
        const response = await api.get(`/ownership-types/${text}`);
        const data = response.data?.data || response.data;
        if (active) {
          setResolvedOwnership(capitalize(data?.label || data?.name || text));
        }
      } catch (error) {
        if (active) setResolvedOwnership(capitalize(text));
        console.error('Error resolving ownership type:', error);
      }
    };
    load();
    return () => { active = false; };
  }, [commercialInfo.ownershipType]);

  const images = (normalizedProperty.images || [])
    .concat(projectInfo.media || [])
    .filter(Boolean);
  const heroImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'];

  const amenities = normalizedProperty.amenities || [];

  useEffect(() => {
    let active = true;

    const facingValue = normalizedProperty.facing;
    if (!facingValue) {
      setResolvedFacing('');
      return undefined;
    }

    const facingText = typeof facingValue === 'string' || typeof facingValue === 'number'
      ? String(facingValue)
      : getDisplayValue(facingValue);

    const looksLikeId = /^[0-9a-fA-F]{24}$/.test(facingText);

    if (!looksLikeId) {
      setResolvedFacing(facingText);
      return undefined;
    }

    const loadFacingLabel = async () => {
      try {
        const response = await api.get(`/facing-directions/${facingText}`);
        const facingData = response.data?.data || response.data;
        const label = facingData?.label || facingData?.name || facingText;
        if (active) {
          setResolvedFacing(label);
        }
      } catch (error) {
        if (active) {
          setResolvedFacing(facingText);
        }
        console.error('Error resolving facing direction:', error);
      }
    };

    loadFacingLabel();

    return () => {
      active = false;
    };
  }, [normalizedProperty.facing]);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get('window').width);
    setCurrentImageIndex(index);
  };

  if (fetching && !propertyData) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#008E96" />
        <Text className="text-[#6A7282] font-inter-medium" style={{ marginTop: hp('2%'), fontSize: wp('4%') }}>Loading property details...</Text>
      </SafeAreaView>
    );
  }

  if (!propertyData && !fetching) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-red-500 font-inter-medium" style={{ marginBottom: hp('2%'), fontSize: wp('4%') }}>No property data found</Text>
        <TouchableOpacity onPress={() => router.back()} className="bg-[#008E96]" style={{ paddingHorizontal: wp('6%'), paddingVertical: hp('1.5%'), borderRadius: wp('2%') }}>
          <Text className="text-white" style={{ fontSize: wp('3.5%') }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-1 bg-[#F9FAFB]">
        <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
          {/* Header Section */}
          <View className="bg-white">
            <View className="w-full overflow-hidden bg-gray-200" style={{ height: hp('40%'), borderBottomLeftRadius: wp('10%'), borderBottomRightRadius: wp('10%') }}>
              <FlatList
                ref={flatListRef}
                data={heroImages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={{ width: wp('100%'), height: hp('40%') }}>
                    <Image
                      source={{ uri: item.startsWith('data:') ? item : item }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </View>
                )}
              />
              <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']} className="absolute inset-0" />

              {/* Top Controls */}
              <View className="absolute top-0 left-0 right-0 flex-row justify-between items-center" style={{ paddingHorizontal: wp('4%'), marginTop: hp('2%') }}>
                <TouchableOpacity onPress={() => router.back()} className="bg-black/40 rounded-full items-center justify-center" style={{ width: wp('12%'), height: wp('12%') }}>
                  <Ionicons name="arrow-back" size={wp('6%')} color="white" />
                </TouchableOpacity>
                <View className="flex-row" style={{ gap: wp('3%') }}>
                  <TouchableOpacity className="bg-black/40 rounded-full items-center justify-center" style={{ width: wp('10%'), height: wp('10%') }}>
                    <Ionicons name="share-social-outline" size={wp('5%')} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={toggleWishlist} className="bg-black/40 rounded-full items-center justify-center" style={{ width: wp('10%'), height: wp('10%') }}>
                    <Ionicons name={isWishlisted ? "heart" : "heart-outline"} size={wp('5%')} color={isWishlisted ? "#F04438" : "white"} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bottom Left Content */}
              <View className="absolute" style={{ bottom: hp('4%'), left: wp('4%'), gap: hp('0.5%') }}>
                <View className="bg-[#008E96] self-start flex-row items-center" style={{ paddingHorizontal: wp('2%'), paddingVertical: hp('0.5%'), borderRadius: wp('1%'), gap: wp('1%') }}>
                  <Ionicons name="flash" size={wp('2.5%')} color="white" />
                  <Text className="text-white font-inter-bold uppercase" style={{ fontSize: wp('2.5%') }}>
                    {capitalize(getDisplayValue(normalizedProperty.propertyType)) || 'Residential'}
                  </Text>
                </View>
                <Text className="text-white font-inter-semibold" numberOfLines={2} style={{ fontSize: wp('5%') }}>
                  {normalizedProperty.title || 'Spacious Property'}
                </Text>
                <View className="flex-row items-center" style={{ gap: wp('1%') }}>
                  <Ionicons name="location" size={wp('3%')} color="white" />
                  <Text className="text-white font-inter-regular" style={{ fontSize: wp('3.5%') }}>
                    {getDisplayValue(normalizedProperty.city)}, {getDisplayValue(normalizedProperty.state)}
                  </Text>
                </View>
              </View>

              {/* Image Counter */}
              <View className="absolute bg-black/60 rounded-full" style={{ bottom: hp('3%'), right: wp('4%'), paddingHorizontal: wp('3%'), paddingVertical: hp('0.5%') }}>
                <Text className="text-white font-inter-regular" style={{ fontSize: wp('3%') }}>
                  {currentImageIndex + 1}/{heroImages.length}
                </Text>
              </View>
            </View>

            {/* Tabs Row */}
            <View className="flex-row border-b border-[#E5E7EB]" style={{ gap: wp('2%'), paddingHorizontal: wp('4%'), paddingVertical: hp('2%') }}>
              {['Overview', 'Highlights', 'Property Tour'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className={`flex-1 items-center ${activeTab === tab ? 'bg-[#E6F7F7]' : 'bg-[#F2F4F7]'}`}
                  style={{ paddingVertical: hp('1%'), borderRadius: wp('3.5%') }}
                >
                  <Text className={`font-inter-medium ${activeTab === tab ? 'text-[#008E96]' : 'text-[#6A7282]'}`} style={{ fontSize: wp('3.5%') }}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {activeTab === 'Overview' ? (
            <View className="p-4 gap-4">
              {/* Price & Summary Card */}
              <View className="bg-white p-4 border rounded-[16px] border-[#E5E7EB] shadow-sm">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <View className="w-8 h-8 rounded-full bg-[#E6F7F7] items-center justify-center">
                        <MaterialCommunityIcons name="cash-multiple" size={16} color="#008E96" />
                      </View>
                      <View>
                        <Text className="text-[#667085] text-[11px] font-inter-medium">
                          {isRent ? 'Monthly Rent' : 'Total Price'}
                        </Text>
                        <Text className="text-[#0A0A0A] text-[18px] font-inter-bold">
                          {formatPrice(normalizedProperty.price)}{isRent ? ' / month' : ''}
                        </Text>
                      </View>
                    </View>
                    {isRent && typeof normalizedProperty.securityDeposit !== 'undefined' && (
                      <View className="flex-row items-center gap-1.5 mt-1 mb-2">
                        <Text className="text-[#667085] text-[11px] font-inter-medium">Security Deposit:</Text>
                        <Text className="text-[#101828] text-[12px] font-inter-semibold">
                          {normalizedProperty.securityDeposit > 0 ? formatPrice(normalizedProperty.securityDeposit) : 'Nil'}
                        </Text>
                      </View>
                    )}
                    <Text className="text-[#6A7282] text-[12px] font-inter-regular">
                      {subtitle}
                    </Text>
                  </View>
                  <View className="bg-[#F0F9FA] rounded-[12px] px-3 py-1.5 border border-[#D2F0F2]">
                    <Text className="text-[#008E96] text-[12px] font-inter-semibold">
                      {formatArea(normalizedProperty.area || commercialInfo.builtUpArea?.value || residentialInfo.builtUpArea?.value)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Key Specs Grid */}
              <View className="flex-row flex-wrap gap-3">
                {overviewSpecs.map((item, idx) => (
                  <View key={idx} className="w-[48%] bg-white rounded-[16px] p-3 border border-[#E5E7EB]">
                    <View className="flex-row items-center gap-2 mb-1.5">
                      <View className="w-7 h-7 rounded-full bg-[#F0F9FA] items-center justify-center">
                        <Ionicons name={item.icon} size={14} color="#008E96" />
                      </View>
                      <Text className="text-[#667085] text-[11px] font-inter-medium">{item.label}</Text>
                    </View>
                    <Text className="text-[#101828] text-[14px] font-inter-semibold">{item.value}</Text>
                  </View>
                ))}
              </View>

              {/* Description Card */}
              <View className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] shadow-sm">
                <Text className="text-[#101828] text-[16px] font-inter-semibold mb-2">Description</Text>
                <Text className="text-[#344054] text-[13px] leading-[22px] font-inter-regular">
                  {normalizedProperty.description || 'This beautifully designed property offers modern living with premium finishes. Located in a prime residential area, it provides the perfect balance of comfort and convenience.'}
                </Text>
              </View>

              {/* Project Link Card */}
              {projectInfo.projectName && (
                <View className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] shadow-sm flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 bg-[#E6F7F7] rounded-full items-center justify-center">
                      <MaterialCommunityIcons name="office-building" size={20} color="#008E96" />
                    </View>
                    <View>
                      <Text className="text-[#667085] text-[11px] font-inter-medium">Part of Project</Text>
                      <Text className="text-[#101828] text-[15px] font-inter-semibold">{projectInfo.projectName}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => router.push({ pathname: '/screens/ProjectDetails', params: { projectId: projectInfo._id } })}
                    className="p-2"
                  >
                    <Ionicons name="chevron-forward" size={20} color="#008E96" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Seller Card */}
              <View className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] shadow-sm flex-row items-center gap-3">
                <View className="w-12 h-12 bg-[#008E96] rounded-full items-center justify-center">
                  <Text className="text-white font-inter-bold text-[18px]">
                    {(sellerInfo.name || 'S').charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-[#101828] text-[15px] font-inter-semibold">{sellerInfo.name || 'Owner'}</Text>
                  <Text className="text-[#667085] text-[12px] font-inter-regular">Posted by Property Owner</Text>
                </View>
                <TouchableOpacity className="bg-[#E6F7F7] p-2 rounded-full">
                  <Ionicons name="call" size={18} color="#008E96" />
                </TouchableOpacity>
              </View>

              <ProjectPropertiesSection
                projectId={projectInfo._id}
                
                cityId={normalizedProperty.city?._id || normalizedProperty.city}
                propertyType={normalizedProperty.propertyType?._id || normalizedProperty.propertyType}
                title="Similar Properties"
              />
            </View>
          ) : activeTab === 'Highlights' ? (
            <View className="p-4 gap-6">
              {/* Amenities Section */}
              <View className="gap-3">
                <Text className="text-[#101828] text-[18px] font-inter-semibold">Amenities</Text>
                <View className="flex-row flex-wrap gap-2">
                  {amenities.length > 0 ? (
                    amenities.map((item, idx) => (
                      <View key={idx} className="w-[31.5%] bg-white border border-[#E5E7EB] rounded-[14px] h-[90px] items-center justify-center p-2 mb-1">
                        <MaterialIcons
                          name={item.amenity?.icon || 'check-circle-outline'}
                          size={24}
                          color="#008E96"
                        />
                        <Text className="text-[#101828] text-[11px] text-center font-inter-medium mt-2" numberOfLines={2}>
                          {item.amenity?.label || item.amenity?.name || 'Amenity'}
                        </Text>
                        {item.count > 1 && (
                          <Text className="text-[#667085] text-[9px] font-inter-regular">Count: {item.count}</Text>
                        )}
                      </View>
                    ))
                  ) : (
                    <Text className="text-[#667085] font-inter-regular italic">No amenities specified</Text>
                  )}
                </View>
              </View>

              {/* Similar Properties in Highlights */}
              <View className="mt-4">
                <ProjectPropertiesSection
                  projectId={projectInfo._id}
                 
                  cityId={normalizedProperty.city?._id || normalizedProperty.city}
                  propertyType={normalizedProperty.propertyType?._id || normalizedProperty.propertyType}
                  title="Related Properties"
                />
              </View>
            </View>
          ) : (
            <View className="p-4 gap-6">
              {/* Property Details Grid Moved to Property Tour */}
              <View className="gap-3">
                <Text className="text-[#101828] text-[18px] font-inter-semibold">Property Facts</Text>
                <View className="flex-row flex-wrap justify-between">
                  {[
                    { label: 'Property Type', value: capitalize(getDisplayValue(normalizedProperty.propertyType)), icon: 'business-outline' },
                    { label: 'Sub Type', value: capitalize(getDisplayValue(normalizedProperty.subPropertyType)), icon: 'home-outline' },
                    // Residential specific
                    ...(propType === 'residential' ? [
                      { label: 'Configuration', value: `${residentialInfo.bedrooms || 0} BHK`, icon: 'apps-outline' },
                      { label: 'Carpet Area', value: formatArea(residentialInfo.carpetArea?.value), icon: 'move-outline' },
                      { label: 'Furnishing', value: getFurnishingLabel(residentialInfo.furnishingStatus), icon: 'bed-outline' },
                      { label: 'Total Floors', value: residentialInfo.totalFloors ? String(residentialInfo.totalFloors) : 'N/A', icon: 'layers-outline' },
                    ] : []),
                    // Commercial specific
                    ...(propType === 'commercial' ? [
                      { label: 'Office/Shop Type', value: commercialInfo.officeType ? capitalize(commercialInfo.officeType) : 'N/A', icon: 'briefcase-outline' },
                      { label: 'Carpet Area', value: formatArea(commercialInfo.carpetArea?.value), icon: 'move-outline' },
                      { label: 'Built Up Area', value: formatArea(commercialInfo.builtUpArea?.value), icon: 'business-outline' },
                      { label: 'Meeting Rooms', value: commercialInfo.meetingRooms?.toString() || '0', icon: 'chatbubbles-outline' },
                      { label: 'Zone Type', value: resolvedZoneType || 'N/A', icon: 'grid-outline' },
                      { label: 'Location Hub', value: resolvedLocationHub || 'N/A', icon: 'navigate-outline' },
                      { label: 'Ownership', value: resolvedOwnership || 'N/A', icon: 'key-outline' },
                      { label: 'Condition', value: commercialInfo.propertyCondition ? capitalize(commercialInfo.propertyCondition) : 'N/A', icon: 'construct-outline' },
                    ] : []),
                    // PG specific
                    ...(propType === 'pg' ? [
                      { label: 'Meals Available', value: pgInfo.mealsAvailable ? 'Yes' : 'No', icon: 'restaurant-outline' },
                      { label: 'Meal Types', value: pgInfo.mealTypes && pgInfo.mealTypes.length > 0 ? pgInfo.mealTypes.map(m => capitalize(m)).join(', ') : 'N/A', icon: 'fast-food-outline' },
                      { label: 'Common Areas', value: pgInfo.commonAreas && pgInfo.commonAreas.length > 0 ? pgInfo.commonAreas.map(c => capitalize(c)).join(', ') : 'None', icon: 'people-outline' },
                      { label: 'Rooms/Sharing', value: pgInfo.rooms && pgInfo.rooms.length > 0 ? `${pgInfo.rooms.length} Rooms` : 'N/A', icon: 'bed-outline' },
                    ] : []),
                    // Plot specific
                    ...(propType === 'plot' ? [
                      { label: 'Corner Plot', value: plotInfo.isCornerPlot ? 'Yes' : 'No', icon: 'map-outline' },
                      { label: 'Boundary Wall', value: plotInfo.isBoundaryWall ? 'Yes' : 'No', icon: 'shield-checkmark-outline' },
                      { label: 'Dimensions', value: plotInfo.dimensions || 'N/A', icon: 'resize-outline' },
                    ] : []),
                    // Rent specific
                    ...(isRent ? [
                      { label: 'Security Deposit', value: normalizedProperty.securityDeposit ? formatPrice(normalizedProperty.securityDeposit) : 'Nil', icon: 'cash-outline' },
                    ] : []),
                    { label: 'Pincode', value: normalizedProperty.pincode, icon: 'location-outline' },
                    { label: 'Available From', value: normalizedProperty.availableFrom ? new Date(normalizedProperty.availableFrom).toLocaleDateString('en-IN') : 'Immediately', icon: 'calendar-outline' },
                  ].map((fact, idx) => (
                    <View key={idx} className="w-[48%] bg-white rounded-[16px] p-3 border border-[#E5E7EB] mb-3">
                      <View className="flex-row items-center gap-2 mb-1.5">
                        <View className="w-8 h-8 rounded-full bg-[#F0F9FA] items-center justify-center">
                          <Ionicons name={fact.icon} size={16} color="#008E96" />
                        </View>
                        <Text className="text-[#667085] text-[10px] font-inter-medium flex-1">{fact.label}</Text>
                      </View>
                      <Text className="text-[#101828] text-[13px] font-inter-semibold" numberOfLines={1}>
                        {fact.value || 'N/A'}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Placeholder for Video/Tour */}
              <View className="bg-white rounded-[16px] p-6 items-center justify-center border border-[#E5E7EB] border-dashed">
                <MaterialCommunityIcons name="video-outline" size={32} color="#008E96" />
                <Text className="text-[#101828] font-inter-medium mt-2">Virtual Tour coming soon</Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Sticky Bottom Bar */}
      <View className="bg-white border-t border-[#E5E7EB] flex-row items-center" style={{ paddingHorizontal: wp('4%'), paddingVertical: hp('1.5%'), gap: wp('2%') }}>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/screens/Chat', params: { propertyId } })}
          className="flex-1 border border-[#008E96] flex-row items-center justify-center" style={{ height: hp('6%'), borderRadius: wp('3.5%'), gap: wp('2%') }}
        >
          <Ionicons name="chatbubble-outline" size={wp('5%')} color="#008E96" />
          <Text className="text-[#008E96] font-inter-medium" style={{ fontSize: wp('4%') }}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 border border-[#008E96] items-center justify-center" style={{ height: hp('6%'), borderRadius: wp('3.5%') }}>
          <Text className="text-[#008E96] font-inter-medium" style={{ fontSize: wp('4%') }}>View phone</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/screens/ContactSeller', params: { propertyId } })}
          className="flex-[1.5] bg-[#008E96] items-center justify-center" style={{ height: hp('6%'), borderRadius: wp('3.5%') }}
        >
          <Text className="text-white font-inter-medium" style={{ fontSize: wp('4%') }}>Contact Seller</Text>
        </TouchableOpacity>
      </View>
      {toast && (
        <View 
          style={{
            position: 'absolute',
            bottom: 140,
            left: 20,
            right: 20,
            backgroundColor: '#1E293B',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }}
        >
          <Text style={{ color: 'white', fontFamily: 'Inter-Medium', fontSize: 13, textAlign: 'center' }}>
            {toast}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default PropertyDetails;