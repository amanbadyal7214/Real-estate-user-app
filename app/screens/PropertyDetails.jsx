import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProjectPropertiesSection from '../../components/ProjectPropertiesSection';
import { usePropertyDiscovery } from '../../hooks/usePropertyDiscovery';
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

const PropertyDetails = () => {
  const router = useRouter();
  const { propertyId, property } = useLocalSearchParams();
  const initialProperty = useMemo(() => parseMaybeJson(property), [property]);
  const [propertyData, setPropertyData] = useState(initialProperty);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('Overview');
  const flatListRef = useRef(null);

  const { fetchPropertyById, loading: fetching, error } = usePropertyDiscovery();

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

  const normalizedProperty = propertyData || {};
  const projectInfo = normalizedProperty.project || {};
  const residentialInfo = normalizedProperty.residential || {};
  const sellerInfo = normalizedProperty.user || {};

  const images = (normalizedProperty.images || [])
    .concat(projectInfo.media || [])
    .filter(Boolean);
  const heroImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'];

  const amenities = normalizedProperty.amenities || [];

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get('window').width);
    setCurrentImageIndex(index);
  };

  const getFurnishingLabel = (status) => {
    const name = status?.name || status || '';
    if (name === 'fully_furnished') return 'Fully Furnished';
    if (name === 'semi_furnished') return 'Semi Furnished';
    if (name === 'unfurnished') return 'Unfurnished';
    return name || 'N/A';
  };

  if (fetching && !propertyData) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#008E96" />
        <Text className="text-[#6A7282] mt-4 font-inter-medium">Loading property details...</Text>
      </SafeAreaView>
    );
  }

  if (!propertyData && !fetching) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-red-500 font-inter-medium mb-4">No property data found</Text>
        <TouchableOpacity onPress={() => router.back()} className="bg-[#008E96] px-6 py-2 rounded-lg">
          <Text className="text-white">Go Back</Text>
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
            <View className="w-full h-[320px] rounded-b-[40px] overflow-hidden bg-gray-200">
              <FlatList
                ref={flatListRef}
                data={heroImages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={{ width: Dimensions.get('window').width, height: 320 }}>
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
              <View className="absolute top-0 left-0 right-0 flex-row justify-between items-center px-4 mt-4">
                <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 bg-black/40 rounded-full items-center justify-center">
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View className="flex-row gap-3">
                  <TouchableOpacity className="w-10 h-10 bg-black/40 rounded-full items-center justify-center">
                    <Ionicons name="share-social-outline" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity className="w-10 h-10 bg-black/40 rounded-full items-center justify-center">
                    <Ionicons name="heart-outline" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bottom Left Content */}
              <View className="absolute bottom-10 left-4 gap-1">
                <View className="bg-[#008E96] self-start px-2 py-0.5 rounded-[4px] flex-row items-center gap-1">
                  <Ionicons name="flash" size={10} color="white" />
                  <Text className="text-white text-[10px] font-inter-bold uppercase">
                    {getDisplayValue(normalizedProperty.propertyType) || 'Residential'}
                  </Text>
                </View>
                <Text className="text-white text-[20px] font-inter-semibold" numberOfLines={2}>
                  {normalizedProperty.title || 'Spacious Property'}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="location" size={12} color="white" />
                  <Text className="text-white text-[13px] font-inter-regular">
                    {getDisplayValue(normalizedProperty.city)}, {getDisplayValue(normalizedProperty.state)}
                  </Text>
                </View>
              </View>

              {/* Image Counter */}
              <View className="absolute bottom-6 right-4 bg-black/60 px-3 py-1 rounded-full">
                <Text className="text-white text-[12px] font-inter-regular">
                  {currentImageIndex + 1}/{heroImages.length}
                </Text>
              </View>
            </View>

            {/* Tabs Row */}
            <View className="flex-row gap-2 border-b border-[#E5E7EB] px-4 py-4">
              {['Overview', 'Highlights', 'Property Tour'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-[14px] items-center ${activeTab === tab ? 'bg-[#E6F7F7]' : 'bg-[#F2F4F7]'}`}
                >
                  <Text className={`text-[14px] font-inter-medium ${activeTab === tab ? 'text-[#008E96]' : 'text-[#6A7282]'}`}>{tab}</Text>
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
                        <Text className="text-[#667085] text-[11px] font-inter-medium">Total Price</Text>
                        <Text className="text-[#0A0A0A] text-[18px] font-inter-bold">{formatPrice(normalizedProperty.price)}</Text>
                      </View>
                    </View>
                    <Text className="text-[#6A7282] text-[12px] font-inter-regular">
                      {residentialInfo.bedrooms || 0} BHK • {getFurnishingLabel(residentialInfo.furnishingStatus)}
                    </Text>
                  </View>
                  <View className="bg-[#F0F9FA] rounded-[12px] px-3 py-1.5 border border-[#D2F0F2]">
                    <Text className="text-[#008E96] text-[12px] font-inter-semibold">
                      {formatArea(normalizedProperty.area)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Key Specs Grid */}
              <View className="flex-row flex-wrap gap-3">
                {[
                  { label: 'Bedrooms', value: `${residentialInfo.bedrooms || 0} BHK`, icon: 'bed-outline' },
                  { label: 'Bathrooms', value: residentialInfo.bathrooms || 'N/A', icon: 'water-outline' },
                  { label: 'Floor', value: `${residentialInfo.floor || 'N/A'} of ${residentialInfo.totalFloors || 'N/A'}`, icon: 'layers-outline' },
                  { label: 'Facing', value: getDisplayValue(normalizedProperty.facing) || 'N/A', icon: 'compass-outline' },
                ].map((item, idx) => (
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
                    { label: 'Property Type', value: getDisplayValue(normalizedProperty.propertyType), icon: 'business-outline' },
                    { label: 'Sub Type', value: getDisplayValue(normalizedProperty.subPropertyType), icon: 'home-outline' },
                    // Residential specific
                    ...(normalizedProperty.propertyType?.name === 'residential' ? [
                      { label: 'Configuration', value: `${residentialInfo.bedrooms || 0} BHK`, icon: 'apps-outline' },
                      { label: 'Carpet Area', value: formatArea(residentialInfo.carpetArea?.value), icon: 'move-outline' },
                      { label: 'Furnishing', value: getFurnishingLabel(residentialInfo.furnishingStatus), icon: 'bed-outline' },
                      { label: 'Total Floors', value: residentialInfo.totalFloors, icon: 'layers-outline' },
                    ] : []),
                    // PG specific
                    ...(normalizedProperty.propertyType?.name === 'pg' ? [
                      { label: 'Meals', value: normalizedProperty.pg?.mealsAvailable ? 'Yes' : 'No', icon: 'restaurant-outline' },
                      { label: 'Common Areas', value: (normalizedProperty.pg?.commonAreas || []).length > 0 ? 'Available' : 'None', icon: 'people-outline' },
                    ] : []),
                    // Plot specific
                    ...(normalizedProperty.propertyType?.name === 'plot' ? [
                      { label: 'Boundary Wall', value: normalizedProperty.plot?.isBoundaryWall ? 'Yes' : 'No', icon: 'shield-checkmark-outline' },
                      { label: 'Dimensions', value: normalizedProperty.plot?.dimensions || 'N/A', icon: 'resize-outline' },
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
      <View className="bg-white px-4 py-3 border-t border-[#E5E7EB] flex-row gap-2 items-center">
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/screens/Chat', params: { propertyId } })}
          className="flex-1 h-[48px] border border-[#008E96] rounded-[14px] flex-row items-center justify-center gap-2"
        >
          <Ionicons name="chatbubble-outline" size={20} color="#008E96" />
          <Text className="text-[#008E96] font-inter-medium text-[16px]">Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 h-[48px] border border-[#008E96] rounded-[14px] items-center justify-center">
          <Text className="text-[#008E96] font-inter-medium text-[16px]">View phone</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/screens/ContactSeller', params: { propertyId } })}
          className="flex-[1.5] h-[48px] bg-[#008E96] rounded-[14px] items-center justify-center"
        >
          <Text className="text-white font-inter-medium text-[16px]">Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PropertyDetails;