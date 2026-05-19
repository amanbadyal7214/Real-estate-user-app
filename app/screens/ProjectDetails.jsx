import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProjectConfigCard from '../../components/ProjectConfigCard';
import ProjectContactFormCard from '../../components/ProjectContactFormCard';
import ProjectDisclaimerCard from '../../components/ProjectDisclaimerCard';
import ProjectFinancialServicesCard from '../../components/ProjectFinancialServicesCard';
import ProjectMapCard from '../../components/ProjectMapCard';
import ProjectPropertiesSection from '../../components/ProjectPropertiesSection';
import ProjectSellerCard from '../../components/ProjectSellerCard';
import { useProjectDetails } from '../../hooks/useProjectDetails';

const ProjectDetails = () => {
  const router = useRouter();
  const { projectId } = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeFloorTab, setActiveFloorTab] = useState('All');
  const flatListRef = useRef(null);

  // Use custom hook for project details
  const {
    projectData: rawProjectData,
    loading,
    error,
    images,
    location,
    builderName,
    possessionDate,
    averagePricePerSqFt,
    summaries
  } = useProjectDetails(projectId);
  const projectData = Array.isArray(rawProjectData) ? rawProjectData[0] || {} : rawProjectData || {};

  const summariesArray = Array.isArray(summaries) ? summaries : (summaries ? [summaries] : []);
  const summariesData = summariesArray[0] || null;

  const floorPlanData = [
    { type: '5 BHK', info: 'Super Builtup Area', area: '5280.0 sq.ft.', price: '₹ 5.02 Cr', bhk: '5 BHK', image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=400' },
    { type: '5 BHK', info: 'Super Builtup Area', area: '5150.0 sq.ft.', price: '₹ 4.89 Cr', bhk: '5 BHK', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=400' }
  ];

  const configData = [
    { title: '3 BHK Apartment', areaRange: '1835 - 1950 sq.ft.', priceRange: '₹ 3.24 Cr - ₹ 3.44 Cr' },
    { title: '5 BHK Apartment', areaRange: '2800 - 3200 sq.ft.', priceRange: '₹ 4.50 Cr - ₹ 5.01 Cr' }
  ];

  // If summaries are available, derive configuration cards from summaries.summaries
  const derivedConfigData = (summariesData && summariesData.summaries && summariesData.summaries.length > 0)
    ? summariesData.summaries.map((s) => {
      const unit = s.areaUnit?.label || s.areaUnit?.name || '';
      let areaRange = 'N/A';
      if (s.areaMin && s.areaMax) areaRange = `${s.areaMin} - ${s.areaMax} ${unit}`;
      else if (s.area) areaRange = `${s.area} ${unit}`;

      let priceRange = 'N/A';
      if (s.minPrice && s.maxPrice) priceRange = `₹ ${s.minPrice} - ₹ ${s.maxPrice}`;
      else if (s.price) priceRange = `₹ ${s.price}`;

      const structureLabel = s.structure?.value || s.structure?.label || '';
      const titleBase = s.propertyItem?.label || s.propertyItem?.name || 'Configuration';
      const title = structureLabel ? `${titleBase} • ${structureLabel}` : titleBase;

      return {
        title,
        areaRange,
        priceRange
      };
    })
    : configData;

  const dummyTourImage = 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&q=80&w=900';

  const propertyTourData = (summariesData && summariesData.summaries && summariesData.summaries.length > 0)
    ? summariesData.summaries.map((s, index) => {
      const bhkValue = s.structure?.value ? `${s.structure.value} BHK` : 'Flat';
      const areaUnit = s.areaUnit?.label || s.areaUnit?.name || '';

      return {
        id: s._id || index,
        bhk: bhkValue,
        info: s.propertyItem?.label || s.propertyItem?.name || 'Flat',
        area: `${s.area || 'N/A'} ${areaUnit}`.trim(),
        price: '₹ XX Cr',
        image: dummyTourImage,
        quantity: s.quantity,
        activeTabKey: bhkValue,
      };
    })
    : floorPlanData;

  const propertyTourTabs = summariesData && summariesData.summaries && summariesData.summaries.length > 0
    ? [
      { label: 'All', count: propertyTourData.length },
      ...Array.from(new Map(propertyTourData.map((item) => [item.activeTabKey, item])).values()).map((item) => ({
        label: item.activeTabKey,
        count: propertyTourData.filter((tourItem) => tourItem.activeTabKey === item.activeTabKey).length,
      }))
    ]
    : [
      { label: 'All', count: 6 },
      { label: '3 BHK', count: 4 },
      { label: '5 BHK', count: 2 }
    ];

  const visiblePropertyTourData = activeFloorTab === 'All'
    ? propertyTourData
    : propertyTourData.filter((item) => item.activeTabKey === activeFloorTab);



  const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatPricePerSqFt = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return 'N/A';

    if (numericValue >= 1000) {
      return `₹ ${(numericValue / 1000).toFixed(1)}K/ sq.ft.`;
    }

    return `₹ ${numericValue.toFixed(0)}/ sq.ft.`;
  };

  const getDisplayValue = (value) => {
    if (!value) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value.label || value.name || value.title || value.value || value.cityName || value.stateName || value.districtName || '';
  };

  const formatArea = () => {
    if (!projectData?.area) return 'N/A';
    const unit = projectData.areaUnit?.label || projectData.areaUnit?.name || '';
    return `${projectData.area}${unit ? ` ${unit}` : ''}`;
  };

  const formatAddress = () => {
    const parts = [
      getDisplayValue(projectData?.addressLine1),
      getDisplayValue(projectData?.addressLine2),
      getDisplayValue(projectData?.district),
      getDisplayValue(projectData?.city),
      getDisplayValue(projectData?.state)
    ].filter(Boolean);
    return parts.length ? parts.join(', ') : 'N/A';
  };

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get('window').width);
    setCurrentImageIndex(index);
  };

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center" edges={['top']}>
        <ActivityIndicator size="large" color="#008E96" />
        <Text className="text-[#6A7282] mt-4">Loading project details...</Text>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error || (!loading && !rawProjectData)) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center" edges={['top']}>
        <Text className="text-red-600 text-center px-4 mb-4">{error || 'Failed to load project'}</Text>
        <TouchableOpacity onPress={() => router.back()} className="bg-[#008E96] px-6 py-3 rounded-lg">
          <Text className="text-white font-inter-medium">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-1 bg-[#F9FAFB]">
        <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
          <View className="bg-white">
            <View className="w-full h-[320px] rounded-b-[40px] overflow-hidden bg-gray-200">
              <FlatList
                ref={flatListRef}
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item }}
                    style={{ width: Dimensions.get('window').width, height: 320 }}
                    resizeMode="cover"
                  />
                )}
              />
              <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']} className="absolute inset-0" />
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
                  <TouchableOpacity className="w-10 h-10 bg-black/40 rounded-full items-center justify-center">
                    <Ionicons name="chatbubble-outline" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
              <View className="absolute bottom-10 left-4 gap-2">
                <View className="bg-[#008E96] self-start px-2 py-1 rounded-[4px] flex-row items-center gap-1">
                  <Ionicons name="checkmark" size={12} color="white" />
                  <Text className="text-white text-[12px] font-inter-regular">
                    {projectData.isReraApproved ? 'RERA' : 'NON-RERA'}
                  </Text>
                </View>
                <Text className="text-white text-[24px] font-inter-medium">{projectData.projectName}</Text>
                <View className="flex-row justify-between items-center w-[358px]">
                  <Text className="text-white text-[14px] font-inter-regular">{location}</Text>
                  <TouchableOpacity className="bg-white/20 px-4 py-2 rounded-[10px] flex-row items-center gap-2">
                    <Ionicons name="location-outline" size={16} color="white" />
                    <Text className="text-white font-inter-medium text-[14px]">See on Map</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="absolute bottom-6 right-4 bg-black/60 px-3 py-1 rounded-full">
                <Text className="text-white text-[14px] font-inter-regular">{currentImageIndex + 1}/{images.length || 1}</Text>
              </View>
            </View>
            <View className="flex-row gap-2 border-b border-[#E5E7EB] px-4 py-4">
              {/* Data Insights tab hidden for now */}
              {['Overview', 'Highlights', 'Property Tour'].map((tab) => (
                <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} className={`flex-1 py-2 rounded-[14px] items-center ${activeTab === tab ? 'bg-[#E6F7F7]' : 'bg-[#F2F4F7]'}`}>
                  <Text className={`text-[14px] font-inter-medium ${activeTab === tab ? 'text-[#008E96]' : 'text-[#6A7282]'}`}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {activeTab === 'Overview' ? (
            <View className="p-4 gap-4">
              <View className="bg-white p-4 border rounded-[16px] border-[#E5E7EB]">
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-2">
                      <View className="w-9 h-9 rounded-full bg-[#E6F7F7] items-center justify-center">
                        <MaterialCommunityIcons name="cash-multiple" size={18} color="#008E96" />
                      </View>
                      <View>
                        <Text className="text-[#667085] text-[12px] font-inter-medium">Starting from</Text>
                        <Text className="text-[#0A0A0A] text-[16px] font-inter-semibold">{formatPricePerSqFt(averagePricePerSqFt || projectData.costPerSqft)}</Text>
                      </View>
                    </View>
                    <Text className="text-[#6A7282] text-[12px] mb-3 font-inter-regular">
                      Zero Brokerage • Possession by {possessionDate}
                    </Text>
                    <Text className="text-[#6A7282] text-[12px] mb-3 font-inter-regular">
                      Avg. price per sq.ft. {formatPricePerSqFt(averagePricePerSqFt || projectData.costPerSqft)}
                    </Text>
                  </View>
                  <View className="bg-[#F0F9FA] rounded-[16px] px-3 py-2 border border-[#D2F0F2]">
                    <Text className="text-[#008E96] text-[12px] font-inter-semibold text-center">{projectData.bhkType || 'Apartments'}</Text>
                  </View>
                </View>

              </View>
              <View>
                <Text className="text-[#101828] text-[18px] font-inter-medium mb-3">Project Configurations</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {derivedConfigData.map((item, index) => (
                    <ProjectConfigCard key={index} title={item.title} areaRange={item.areaRange} priceRange={item.priceRange} />
                  ))}
                </ScrollView>
              </View>
              <ProjectSellerCard sellerName={builderName} postedBy={projectData.builder?.designation || 'Developer'} />
              <View className="bg-white rounded-[16px] p-4 gap-2 shadow-sm border border-[#E5E7EB]">
                <Text className="text-[#101828] text-[18px] font-inter-medium">{projectData.projectName}</Text>
                <Text className="text-[#000] text-[13px] leading-[27px] font-inter-regular">
                  {projectData.description || 'Modern apartments in a prime location with premium amenities and finishes.'}
                </Text>
              </View>
              {summariesData ? (
                <View className="bg-white rounded-[16px] p-4 gap-3 border border-[#E5E7EB]">
                  <Text className="text-[#101828] text-[18px] font-inter-medium">Project Summary</Text>
                  {summariesData.amenities && summariesData.amenities.length > 0 && (
                    <View className="flex-row flex-wrap gap-2">
                      {summariesData.amenities.map((am) => (
                        <View key={am._id} className="px-3 py-2 bg-[#F2F4F7] rounded-[12px] flex-row items-center gap-2">
                          <MaterialIcons name={am.icon || am.name || 'check'} size={18} color="#008E96" />
                          <Text className="text-[#101828] text-[12px]">{am.label}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {summariesData.summaries && summariesData.summaries.length > 0 && (
                    <View className="mt-2">
                      {summariesData.summaries.map((s) => (
                        <View key={s._id} className="flex-row items-center justify-between py-2 border-b border-[#F2F4F7]">
                          <View>
                            <Text className="text-[#101828] text-[14px] font-inter-semibold">{s.propertyItem?.label} • {s.structure?.value}{s.structure?.id?.name ? ` ${s.structure.id.name}` : ''}</Text>
                            <Text className="text-[#667085] text-[12px]">{s.area} {s.areaUnit?.label} • {s.quantity} units</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ) : null}
              <View className="bg-white rounded-[24px] overflow-hidden border border-[#D7F0F0] shadow-sm">
                <LinearGradient colors={['#F0F9FA', '#FFFFFF']} className="px-4 py-4 border-b border-[#E5F4F4]">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-2">
                      <View className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm border border-[#D7F0F0]">
                        <MaterialCommunityIcons name="home-city-outline" size={20} color="#008E96" />
                      </View>
                      <View>
                        <Text className="text-[#101828] text-[16px] font-inter-semibold">Project Snapshot</Text>
                        <Text className="text-[#667085] text-[12px] font-inter-regular">Quick facts at a glance</Text>
                      </View>
                    </View>
                    {projectData.isReraApproved ? (
                      <View className="px-3 py-1 bg-[#EAFBF1] rounded-full border border-[#B7EBC8]">
                        <Text className="text-[#078345] text-[12px] font-inter-semibold">RERA Approved</Text>
                      </View>
                    ) : (
                      <View className="px-3 py-1 bg-[#FFF4E5] rounded-full border border-[#FFD7A8]">
                        <Text className="text-[#B54708] text-[12px] font-inter-semibold">RERA Pending</Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row flex-wrap gap-3">
                    {[
                      { label: 'Builder', value: projectData.builder?.name || 'N/A', icon: 'account-tie-outline' },
                      { label: 'Possession', value: projectData.possessionStatus?.label || projectData.possessionStatus?.name || 'N/A', icon: 'calendar-clock-outline' },
                      { label: 'Area', value: formatArea(), icon: 'ruler-square-compass' },
                      { label: 'RERA No.', value: projectData.reraNumber || 'N/A', icon: 'file-document-outline' }
                    ].map((item) => (
                      <View key={item.label} className="w-[48%] bg-white rounded-[18px] p-3 border border-[#E5E7EB]">
                        <View className="flex-row items-center gap-2 mb-2">
                          <View className="w-8 h-8 rounded-full bg-[#F0F9FA] items-center justify-center">
                            <MaterialCommunityIcons name={item.icon} size={16} color="#008E96" />
                          </View>
                          <Text className="text-[#667085] text-[12px] font-inter-medium">{item.label}</Text>
                        </View>
                        <Text className="text-[#101828] text-[14px] font-inter-semibold" numberOfLines={2}>{item.value}</Text>
                      </View>
                    ))}
                  </View>
                </LinearGradient>

                <View className="p-4 gap-3">

                  <View className="flex-row items-center justify-between">
                    <Text className="text-[#101828] text-[14px] font-inter-medium">Gated Community</Text>
                    <Text className="text-[#344054] text-[14px] font-inter-semibold">{projectData.isGated ? 'Yes' : 'No'}</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[#101828] text-[14px] font-inter-medium">Start Date</Text>
                    <Text className="text-[#344054] text-[14px] font-inter-semibold">{formatDate(projectData.startDate)}</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[#101828] text-[14px] font-inter-medium">Completion Date</Text>
                    <Text className="text-[#344054] text-[14px] font-inter-semibold">{formatDate(projectData.completionDate)}</Text>
                  </View>
                  <View className="pt-2 border-t border-dashed border-[#E5E7EB]">
                    <Text className="text-[#667085] text-[12px] font-inter-medium mb-1">Address</Text>
                    <Text className="text-[#101828] text-[14px] font-inter-regular leading-5">{formatAddress()}</Text>
                  </View>
                </View>
              </View>
              {/* <InvestmentInsightsCard appreciation="127.6%" appreciationYear="2021" currentValue={projectData.basePrice || '3.24 Cr'} projectedValue="4.08 Cr" roi="26.0%" potentialGain="84.18 L" />
              <ProjectBrochureCard
                brochureUrl={brochureUrl}
                previewImages={brochureImages}
                totalPages={brochurePages}
              /> */}
              <ProjectMapCard />
              <ProjectContactFormCard sellerName={builderName} sellerPhone={projectData.builder?.phone || '1800XXXXXX'} />
              <ProjectPropertiesSection projectId={projectId} />

              <ProjectFinancialServicesCard />
              <ProjectDisclaimerCard />
            </View>
          ) : activeTab === 'Highlights' ? (
            <View className="p-4 gap-6">
              <View className="gap-3">
                <Text className="text-[#101828] text-[18px] font-inter-medium">Nearby landmarks in Vamana Riseonic</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                  <TouchableOpacity className="w-[200px] bg-white border border-[#E5E7EB] rounded-[14px] p-3 gap-2 mr-3">
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="school-outline" size={20} color="#101828" />
                      <Text className="text-[#101828] text-[14px] font-inter-regular underline">School</Text>
                      <Ionicons name="chevron-forward" size={14} color="#101828" />
                    </View>
                    <Text className="text-[#6A7282] text-[14px] font-inter-regular h-[40px]">SHRIRAM e - TECHNO SCHOOL</Text>
                    <Text className="text-[#101828] text-[16px] font-inter-medium">800 m</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="w-[200px] bg-white border border-[#E5E7EB] rounded-[14px] p-3 gap-2 mr-3">
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="medkit-outline" size={20} color="#101828" />
                      <Text className="text-[#101828] text-[14px] font-inter-regular underline">Hospital</Text>
                      <Ionicons name="chevron-forward" size={14} color="#101828" />
                    </View>
                    <Text className="text-[#6A7282] text-[14px] font-inter-regular h-[40px]">Homi Bhabha Cancer Hospital a...</Text>
                    <Text className="text-[#101828] text-[16px] font-inter-medium">2.6 km</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
              <View className="gap-3">
                <Text className="text-[#101828] text-[18px] font-inter-medium">Amenities</Text>
                <View className="flex-row flex-wrap gap-2">
                  {summariesData && summariesData.amenities && summariesData.amenities.length > 0 ? (
                    summariesData.amenities.map((am) => (
                      <View key={am._id || am.label} className="w-[31%] bg-white border border-[#E5E7EB] rounded-[14px] h-[90px] items-center justify-center p-2 mb-2">
                        <View className="items-center">
                          <MaterialIcons name={am.icon || am.name || 'check'} size={28} color="#008E96" />
                          <Text className="text-[#101828] text-[12px] text-center font-inter-regular mt-2" numberOfLines={2}>{am.label}</Text>
                        </View>
                      </View>
                    ))
                  ) : (
                    [
                      { icon: '🏊‍♂️', title: 'Swimming Pool' },
                      { icon: '🌳', title: 'Landscape' },
                      { icon: '🏋️', title: 'Gymnasium' },
                      { icon: '🏊‍♂️', title: "Kid's Pool" },
                      { icon: '💧', title: '24X7 Water' },
                      { icon: '+20', title: 'More amenities', isMore: true }
                    ].map((item, index) => (
                      <View key={index} className="w-[31%] bg-white border border-[#E5E7EB] rounded-[14px] h-[90px] items-center justify-center p-2 mb-2">
                        {item.isMore ? (
                          <View className="items-center">
                            <Text className="text-[#101828] text-[20px] font-inter-medium">+20</Text>
                            <Text className="text-[#101828] text-[12px] font-inter-regular underline">More amenities</Text>
                          </View>
                        ) : (
                          <>
                            <Text className="text-[24px] mb-1">{item.icon}</Text>
                            <Text className="text-[#101828] text-[12px] text-center font-inter-regular" numberOfLines={1}>{item.title}</Text>
                          </>
                        )}
                      </View>
                    ))
                  )}
                </View>
              </View>
              {/* <View className="gap-3">
                <Text className="text-[#101828] text-[18px] font-inter-medium">Construction details</Text> */}
              {/* <View className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 gap-6">
                  {/* Floor & Counter Section 
                  <View className="gap-4">
                    <View className="flex-row items-center gap-2">
                      <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/619/619153.png' }} style={{ width: 24, height: 24 }} />
                      <Text className="text-[#101828] text-[18px] font-inter-medium">Floor & Counter</Text>
                    </View>
                    
                    <View className="flex-row justify-between mb-4">
                      <View className="flex-1">
                        <Text className="text-[#98A2B3] text-[16px] mb-1">Living or dining</Text>
                        <Text className="text-[#101828] text-[18px] font-inter-medium">Vitrified Tiles</Text>
                      </View>
                      <View className="flex-1 ml-4">
                        <Text className="text-[#98A2B3] text-[16px] mb-1">Master bedroom</Text>
                        <Text className="text-[#101828] text-[18px] font-inter-medium">Vitrified Tiles</Text>
                      </View>
                    </View>

                    <View className="flex-row justify-between">
                      <View className="flex-1">
                        <Text className="text-[#98A2B3] text-[16px] mb-1">Other bedroom</Text>
                        <Text className="text-[#101828] text-[18px] font-inter-medium">Vitrified Tiles</Text>
                      </View>
                      <View className="flex-1 ml-4">
                        <Text className="text-[#98A2B3] text-[16px] mb-1">Kitchen</Text>
                        <Text className="text-[#101828] text-[18px] font-inter-medium">Vitrified Tiles</Text>
                      </View>
                    </View>
                  </View>

                  <View className="h-[1px] bg-[#F2F4F7]" />

                  {/* Walls Section 
                  <View className="gap-4">
                    <View className="flex-row items-center gap-2">
                      <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3050/3050218.png' }} style={{ width: 24, height: 24 }} />
                      <Text className="text-[#101828] text-[18px] font-inter-medium">Walls</Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <View className="flex-1">
                        <Text className="text-[#98A2B3] text-[16px] mb-1">Interior</Text>
                        <Text className="text-[#101828] text-[18px] font-inter-medium">Acrylic Paint</Text>
                      </View>
                      <View className="flex-1 ml-4">
                        <Text className="text-[#98A2B3] text-[16px] mb-1">Exterior</Text>
                        <Text className="text-[#101828] text-[18px] font-inter-medium">Weather Coat Paint</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity className="mt-2">
                    <Text className="text-[#008E96] text-[18px] font-inter-medium border-b border-[#008E96] self-start">Show full details →</Text>
                  </TouchableOpacity>
                </View> */}
              <ProjectPropertiesSection projectId={projectId} />
            </View>) : activeTab === 'Property Tour' ? (
              <View className="p-4 gap-4">
                <View className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] gap-4">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-[#101828] text-[18px] font-inter-bold">Floor plan & pricing</Text>
                    <Text className="text-[#6A7282] text-[12px] font-inter-regular">*1 Sq.m = 10.76 Sq.ft</Text>
                  </View>

                  {/* Floor Tabs */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row border border-[#E5E7EB] rounded-[14px] overflow-hidden">
                    {propertyTourTabs.map((tab, index) => (
                      <TouchableOpacity
                        key={tab.label}
                        onPress={() => setActiveFloorTab(tab.label)}
                        className={`items-center py-3 px-5 ${activeFloorTab === tab.label ? 'bg-[#E6F7F6]' : 'bg-white'} ${index < propertyTourTabs.length - 1 ? 'border-r border-[#E5E7EB]' : ''}`}
                        style={{ minWidth: 92 }}
                      >
                        <Text className={`text-[14px] font-inter-medium ${activeFloorTab === tab.label ? 'text-[#008E96]' : 'text-[#364153]'}`}>{tab.label}</Text>
                        <Text className="text-[#6A7282] text-[12px] font-inter-medium">{tab.count} Sizes</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Floor Cards */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4">
                    {visiblePropertyTourData.map((item, index) => (
                      <View key={index} className="w-[200px] border border-[#E5E7EB] rounded-[14px] p-2 gap-2 mr-4">
                        <View className="w-full h-[128px] bg-[#F3F4F6] rounded-[10px] overflow-hidden relative">
                          <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                          <TouchableOpacity className="absolute top-2 right-2 w-8 h-8 bg-[#101828] rounded-full items-center justify-center">
                            <MaterialCommunityIcons name="arrow-expand-all" size={16} color="white" />
                          </TouchableOpacity>
                        </View>
                        <View className="px-1 gap-1">
                          <Text className="text-[#101828] text-[16px] font-inter-bold">{item.bhk}</Text>
                          <Text className="text-[#6A7282] text-[12px] font-inter-regular">{item.info}</Text>
                          <Text className="text-[#101828] text-[14px] font-inter-medium">{item.area}</Text>
                          <Text className="text-[#101828] text-[16px] font-inter-bold">{item.price}</Text>
                        </View>
                        <View className="flex-row gap-2 mt-1">
                          <TouchableOpacity className="w-10 h-10 border border-[#D1D5DC] rounded-[10px] items-center justify-center">
                            <FontAwesome name="whatsapp" size={20} color="#00C950" />
                          </TouchableOpacity>
                          <TouchableOpacity className="flex-1 h-10 border-2 border-[#008E96] rounded-[10px] items-center justify-center">
                            <Text className="text-[#008E96] text-[14px] font-inter-medium">Contact</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </ScrollView>

                  {/* Feedback Section */}
                  <View className="flex-row justify-between items-center pt-4 border-t border-[#F3F4F6]">
                    <Text className="text-[#364153] text-[14px] font-inter-regular">Was this information helpful?</Text>
                    <View className="flex-row gap-3">
                      <TouchableOpacity className="flex-row items-center gap-1.5">
                        <Ionicons name="thumbs-up-outline" size={18} color="#4A5565" />
                        <Text className="text-[#4A5565] text-[14px] font-inter-medium">Yes</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-row items-center gap-1.5">
                        <Ionicons name="thumbs-down-outline" size={18} color="#4A5565" />
                        <Text className="text-[#4A5565] text-[14px] font-inter-medium">No</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
            <View className="p-20 items-center justify-center">
              <Text className="text-gray-400 font-inter-medium">{activeTab} Content Coming Soon</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <View className="bg-white px-4 py-3 border-t border-[#E5E7EB] flex-row gap-2 items-center">
        <TouchableOpacity className="flex-1 h-[48px] border border-[#008E96] rounded-[14px] flex-row items-center justify-center gap-2">
          <Ionicons name="chatbubble-outline" size={20} color="#008E96" />
          <Text className="text-[#008E96] font-inter-medium text-[16px]">Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 h-[48px] border border-[#008E96] rounded-[14px] items-center justify-center">
          <Text className="text-[#008E96] font-inter-medium text-[16px]">View phone</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-[1.5] h-[48px] bg-[#008E96] rounded-[14px] items-center justify-center">
          <Text className="text-white font-inter-medium text-[16px]">Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProjectDetails;