import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProjectDetails } from '../../hooks/useProjectDetails';
import InvestmentInsightsCard from '../../components/InvestmentInsightsCard';
import ProjectBrochureCard from '../../components/ProjectBrochureCard';
import ProjectComparisonSection from '../../components/ProjectComparisonSection';
import ProjectConfigCard from '../../components/ProjectConfigCard';
import ProjectContactFormCard from '../../components/ProjectContactFormCard';
import ProjectDisclaimerCard from '../../components/ProjectDisclaimerCard';
import ProjectFinancialServicesCard from '../../components/ProjectFinancialServicesCard';
import ProjectMapCard from '../../components/ProjectMapCard';
import ProjectSellerCard from '../../components/ProjectSellerCard';

const ProjectDetails = () => {
  const router = useRouter();
  const { projectId } = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeFloorTab, setActiveFloorTab] = useState('All');
  const flatListRef = useRef(null);

  // Use custom hook for project details
  const { projectData, loading, error, images, brochureUrl, brochureImages, brochurePages, location, builderName, possessionDate } = useProjectDetails(projectId);

  const floorPlanData = [
    { type: '5 BHK', info: 'Super Builtup Area', area: '5280.0 sq.ft.', price: '₹ 5.02 Cr', bhk: '5 BHK', image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=400' },
    { type: '5 BHK', info: 'Super Builtup Area', area: '5150.0 sq.ft.', price: '₹ 4.89 Cr', bhk: '5 BHK', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=400' }
  ];

  const configData = [
    { title: '3 BHK Apartment', areaRange: '1835 - 1950 sq.ft.', priceRange: '₹ 3.24 Cr - ₹ 3.44 Cr' },
    { title: '5 BHK Apartment', areaRange: '2800 - 3200 sq.ft.', priceRange: '₹ 4.50 Cr - ₹ 5.01 Cr' }
  ];

  const comparisonData = [
    {
      image: 'https://images.unsplash.com/photo-1512915922686-57c11f9ad6b3?auto=format&fit=crop&q=80&w=400',
      possession: 'Feb, 2031',
      name: 'Vamana Riseonic',
      locality: 'New Chandigarh, Chandigarh',
      bhk: '3, 5 BHK',
      area: '1835.0 - 5500.0 sq.ft',
      price: '3.24 Cr'
    },
    {
      image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=400',
      possession: 'Apr, 2029',
      name: 'The Tiara',
      locality: 'New Chandigarh, Chandigarh',
      bhk: '4 BHK',
      area: '4079.0 sq.ft',
      price: '4.49 Cr'
    }
  ];

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
  if (error || !projectData) {
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-4 gap-2 border-b border-[#E5E7EB]">
              {['Overview', 'Highlights', 'Property Tour', 'Data Insights'].map((tab) => (
                <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} className={`px-4 py-2 rounded-[14px] ${activeTab === tab ? 'bg-[#E6F7F7]' : 'bg-[#F2F4F7]'} mr-2`}>
                  <Text className={`text-[14px] font-inter-medium ${activeTab === tab ? 'text-[#008E96]' : 'text-[#6A7282]'}`}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {activeTab === 'Overview' ? (
            <View className="p-4 gap-4">
              <View className="bg-white p-4 border rounded-[16px] border-[#E5E7EB]">
                <Text className="text-[#6A7282] text-[12px] mb-2 font-inter-regular">
                  Zero Brokerage • Possession by {possessionDate} • Avg. rate ₹ {projectData.costPerSqft || 'N/A'} / sq.ft.
                </Text>
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="text-[#0A0A0A] text-[20px] font-inter-medium">
                    ₹ {projectData.basePrice || 'N/A'}
                  </Text>
                  <Text className="text-[#6A7282] text-[16px] font-inter-regular">ⓘ</Text>
                </View>
                <Text className="text-[#6A7282] text-[14px] font-inter-regular">
                  {projectData.bhkType || 'Apartments'}
                </Text>
              </View>
              <View>
                <Text className="text-[#101828] text-[18px] font-inter-medium mb-3">Project Configurations</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {configData.map((item, index) => (
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
              <InvestmentInsightsCard appreciation="127.6%" appreciationYear="2021" currentValue={projectData.basePrice || '3.24 Cr'} projectedValue="4.08 Cr" roi="26.0%" potentialGain="84.18 L" />
              <ProjectBrochureCard
                brochureUrl={brochureUrl}
                previewImages={brochureImages}
                totalPages={brochurePages}
              />
              <ProjectMapCard />
              <ProjectContactFormCard sellerName={builderName} sellerPhone={projectData.builder?.phone || '1800XXXXXX'} />
              <ProjectComparisonSection properties={comparisonData} />
              
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
                  {[
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
                  ))}
                </View>
              </View>
              <View className="gap-3">
                <Text className="text-[#101828] text-[18px] font-inter-medium">Construction details</Text>
                <View className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 gap-6">
                  {/* Floor & Counter Section */}
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

                  {/* Walls Section */}
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
                </View>
                <View className="gap-3 mt-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-[#101828] text-[18px] font-inter-medium">Resale properties in Vamana Riseonic</Text>
                  <TouchableOpacity><Text className="text-[#008E96] text-[14px] font-inter-medium">See all</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                  {[
                    { price: '2.96 Cr', type: '3 BHK Flat', area: '3100.0 sq.ft.', rate: '9k/ sq.ft.', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400' },
                    { price: '3.35 Cr', type: '3 BHK Flat', area: '1730.0 sq.ft.', rate: '19.3k/ sq.ft.', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400' }
                  ].map((item, index) => (
                    <View key={index} className="w-[300px] bg-white border border-[#E5E7EB] rounded-[24px] overflow-hidden mr-4">
                      <View className="w-full h-[180px] relative">
                        <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                        <View className="absolute top-3 left-3 bg-[#008E96] px-2 py-1 rounded-[4px] flex-row items-center gap-1">
                          <Ionicons name="checkmark" size={12} color="white" />
                          <Text className="text-white text-[10px] font-inter-regular">RERA</Text>
                        </View>
                        <TouchableOpacity className="absolute top-3 right-3 w-8 h-8 bg-black/20 rounded-full items-center justify-center">
                          <Ionicons name="heart-outline" size={18} color="white" />
                        </TouchableOpacity>
                      </View>
                      <View className="p-4 gap-2">
                        <Text className="text-[#101828] text-[22px] font-inter-medium">₹ {item.price}</Text>
                        <Text className="text-[#667085] text-[16px] font-inter-regular">{item.type}</Text>
                        <Text className="text-[#98A2B3] text-[14px] font-inter-regular">{item.area} • ₹ {item.rate}</Text>
                        <View className="flex-row gap-2 mt-2">
                          <TouchableOpacity className="w-[48px] h-[48px] border border-[#008E96] rounded-[12px] items-center justify-center">
                            <Ionicons name="chatbubble-outline" size={20} color="#008E96" />
                          </TouchableOpacity>
                          <TouchableOpacity className="flex-1 h-[48px] border border-[#008E96] rounded-[12px] items-center justify-center">
                            <Text className="text-[#008E96] font-inter-medium text-[16px]">View phone</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
              </View>
            </View>          ) : activeTab === 'Data Insights' ? (
            <View className="p-4 gap-4">
              {/* Price Trends Section */}
              <View className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] gap-4">
                <Text className="text-[#101828] text-[18px] font-inter-bold leading-[28px]">Price trends for Apartments in New Chandigarh</Text>
                
                {/* Appreciation Card */}
                <View className="flex-row items-center border border-[#E5E7EB] rounded-[14px] p-3 gap-2 bg-white">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="trending-up" size={20} color="#00A63E" />
                    <Text className="text-[#101828] text-[16px] font-inter-bold">11.72%</Text>
                  </View>
                  <Text className="text-[#6A7282] text-[12px] font-inter-regular flex-1">
                    (Appreciation in last 1 year for New Chandigarh)
                  </Text>
                </View>

                {/* Rates Header */}
                <View className="flex-row items-center gap-1">
                  <Text className="text-[#364153] text-[14px] font-inter-medium">Rates in</Text>
                  <TouchableOpacity className="flex-row items-center">
                    <Text className="text-[#364153] text-[14px] font-inter-bold underline">Last 1 year</Text>
                    <Ionicons name="chevron-down" size={16} color="#364153" />
                  </TouchableOpacity>
                </View>

                {/* Chart Mockup */}
                <View className="h-[215px] bg-white rounded-[14px] relative overflow-hidden">
                   <LinearGradient 
                    colors={['#E6F7F6', '#FFFFFF']} 
                    className="absolute inset-0"
                   />
                   
                   {/* Y-Axis Labels */}
                   <View className="absolute left-2 top-2 bottom-6 justify-between py-2">
                     {['₹10K', '₹8K', '₹6K', '₹5K', '₹3K', '₹2K', '₹0'].map((label, idx) => (
                       <Text key={idx} className="text-[#4A5565] text-[12px] font-inter-regular">{label}</Text>
                     ))}
                   </View>

                   {/* Grid Lines and Data Visualization Area */}
                   <View className="ml-12 mt-4 mr-4 h-[160px] relative">
                     {[...Array(7)].map((_, i) => (
                       <View key={i} className="absolute w-full h-[0.5px] bg-gray-300" style={{ top: `${(i / 6) * 100}%` }} />
                     ))}
                     
                     {/* Data Line (SVG representation or styled View) */}
                     <View className="absolute inset-0 overflow-hidden">
                       <View 
                        className="absolute bottom-[-10px] left-[-20px] w-[150%] h-[120px]" 
                        style={{ 
                          borderTopWidth: 3, 
                          borderColor: '#008E96',
                          backgroundColor: 'rgba(0, 142, 150, 0.15)',
                          transform: [{ rotate: '-12deg' }]
                        }} 
                       />
                       {/* Floating Label */}
                       <View className="absolute left-[40%] top-[45%] bg-white border border-[#E5E7EB] rounded-[10px] p-2 shadow-lg z-20 w-[127px]">
                         <View className="flex-row items-center gap-2 mb-1">
                           <View className="w-1.5 h-1.5 bg-[#008E96] rounded-full" />
                           <Text className="text-[#364153] text-[12px] font-inter-regular">New Chan...</Text>
                           <Text className="text-[#0A0A0A] text-[12px] font-inter-bold">₹9K/sq.ft</Text>
                         </View>
                         <Text className="text-[#6A7282] text-[10px] font-inter-regular text-center">Jan, 2026</Text>
                       </View>
                     </View>
                   </View>

                   {/* X-Axis Labels */}
                   <View className="absolute left-12 right-4 bottom-1 flex-row justify-between">
                     {['Jul, 25', 'Oct, 25', 'Jan, 26', 'Apr, 26'].map((label, idx) => (
                       <Text key={idx} className="text-[#4A5565] text-[10px] font-inter-regular">{label}</Text>
                     ))}
                   </View>
                </View>

                {/* Property Rates Table */}
                <View className="gap-3 mt-4">
                  <Text className="text-[#101828] text-[14px] font-inter-medium">Property rates over the years</Text>
                  <View className="border border-[#E5E7EB] rounded-[14px] overflow-hidden">
                    <View className="flex-row bg-white border-b border-[#E5E7EB] py-3 px-4">
                      <Text className="flex-1 text-[#4A5565] text-[12px] font-inter-medium">Locality</Text>
                      <Text className="w-[100px] text-[#4A5565] text-[12px] font-inter-medium">Current Price</Text>
                      <Text className="w-[80px] text-[#4A5565] text-[12px] font-inter-medium">Last 1 Yr</Text>
                    </View>
                    <View className="flex-row bg-white py-4 px-4 items-center">
                      <View className="flex-row items-center gap-2 flex-1">
                        <View className="w-2 h-2 bg-[#5E35B1] rounded-full" />
                        <Text className="text-[#101828] text-[14px] font-inter-regular" numberOfLines={1}>New Chandi...</Text>
                      </View>
                      <Text className="w-[100px] text-[#101828] text-[14px] font-inter-medium">₹ 9.6K/sq.ft</Text>
                      <View className="w-[80px] flex-row items-center gap-1">
                        <Ionicons name="trending-up" size={14} color="#00A63E" />
                        <Text className="text-[#00A63E] text-[14px] font-inter-medium">11.72%</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Locality Insights Section */}
              <View className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] gap-4">
                <Text className="text-[#101828] text-[18px] font-inter-bold">Explore this locality</Text>
                <View className="flex-row gap-3">
                  <View className="w-20 h-20 bg-purple-100 rounded-[10px] items-center justify-center">
                    <Text className="text-[#C27AFF] text-[10px] font-inter-bold text-center">NO PHOTOS</Text>
                  </View>
                  <View className="flex-1 gap-1">
                    <Text className="text-[#101828] text-[14px] font-inter-medium">New Chandigarh, Chandigarh</Text>
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="trending-up" size={14} color="#00A63E" />
                      <Text className="text-[#00A63E] text-[14px] font-inter-bold">12.96% YoY</Text>
                    </View>
                    <Text className="text-[#364153] text-[14px] font-inter-regular">Avg. rate ₹9.9K/sq.ft.</Text>
                  </View>
                </View>
                <TouchableOpacity className="flex-row items-center gap-1 mt-1">
                  <Text className="text-[#101828] text-[14px] font-inter-bold underline">Get more insights</Text>
                  <MaterialIcons name="open-in-new" size={16} color="#101828" />
                </TouchableOpacity>
              </View>

              {/* Reviews Section */}
              <View className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] gap-4">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-[#101828] text-[18px] font-inter-bold" numberOfLines={1}>Reviews for New Chandig...</Text>
                    <View className="bg-[#F0FDF4] border border-[#00A63E] rounded-[10px] px-2 py-1 flex-row items-center gap-1">
                      <Ionicons name="star" size={12} color="#00A63E" />
                      <Text className="text-[#00A63E] text-[14px] font-inter-bold">4.9</Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Text className="text-[#008E96] text-[14px] font-inter-bold">See all</Text>
                  </TouchableOpacity>
                </View>

                {/* Review Card */}
                <View className="border border-[#E5E7EB] rounded-[14px] p-4 gap-4">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-row items-center gap-3">
                      <LinearGradient colors={['#FFF085', '#FDC700']} className="w-12 h-12 rounded-full items-center justify-center">
                        <Text className="text-[24px]">👤</Text>
                      </LinearGradient>
                      <View>
                        <Text className="text-[#101828] text-[14px] font-inter-bold">Aditya Singh</Text>
                        <Text className="text-[#6A7282] text-[12px] font-inter-regular">Owner | a month ago</Text>
                      </View>
                    </View>
                    <View className="bg-[#F0FDF4] border border-[#00A63E] rounded-[10px] px-2 py-1 flex-row items-center gap-1">
                      <Ionicons name="star" size={10} color="#00A63E" />
                      <Text className="text-[#00A63E] text-[14px] font-inter-bold">4.8</Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    <View className="flex-row items-center gap-2">
                      <View className="bg-[#E5E7EB] rounded-[4px] px-1">
                        <Text className="text-[12px]">✓</Text>
                      </View>
                      <Text className="text-[#364153] text-[12px] font-inter-bold uppercase">GOOD THINGS HERE</Text>
                    </View>
                    <Text className="text-[#4A5565] text-[14px] font-inter-regular leading-[23px]">
                      New chandigrah is under siginficant physical and social development.
                    </Text>
                  </View>

                  <View className="gap-2">
                    <View className="flex-row items-center gap-2">
                      <View className="bg-[#E5E7EB] rounded-[4px] px-1">
                        <Text className="text-[12px]">🔧</Text>
                      </View>
                      <Text className="text-[#364153] text-[12px] font-inter-bold uppercase">THINGS NEED IMPROVEMENT</Text>
                    </View>
                    <Text className="text-[#4A5565] text-[14px] font-inter-regular leading-[23px]">
                      Chandigrah roads are getting crowed. Many people are moving...
                    </Text>
                    <TouchableOpacity className="flex-row items-center gap-1 mt-1">
                      <Text className="text-[#101828] text-[14px] font-inter-bold">Read more</Text>
                      <Ionicons name="chevron-forward" size={14} color="#101828" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Write Review Button */}
                <TouchableOpacity className="border-2 border-[#008E96] rounded-[14px] h-[48px] items-center justify-center">
                  <Text className="text-[#008E96] text-[14px] font-inter-bold">Write your review</Text>
                </TouchableOpacity>
              </View>
            </View>          ) : activeTab === 'Property Tour' ? (
            <View className="p-4 gap-4">
              <View className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] gap-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-[#101828] text-[18px] font-inter-bold">Floor plan & pricing</Text>
                  <Text className="text-[#6A7282] text-[12px] font-inter-regular">*1 Sq.m = 10.76 Sq.ft</Text>
                </View>

                {/* Floor Tabs */}
                <View className="flex-row border border-[#E5E7EB] rounded-[14px] overflow-hidden">
                  <TouchableOpacity 
                    onPress={() => setActiveFloorTab('All')}
                    className={`flex-1 items-center py-3 border-r border-[#E5E7EB] ${activeFloorTab === 'All' ? 'bg-white' : 'bg-white'}`}
                  >
                    <Text className={`text-[14px] font-inter-medium ${activeFloorTab === 'All' ? 'text-[#364153]' : 'text-[#364153]'}`}>All</Text>
                    <Text className="text-[#6A7282] text-[12px] font-inter-medium">6 Sizes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setActiveFloorTab('3 BHK')}
                    className={`flex-1 items-center py-3 border-r border-[#E5E7EB] ${activeFloorTab === '3 BHK' ? 'bg-white' : 'bg-white'}`}
                  >
                    <Text className={`text-[14px] font-inter-medium ${activeFloorTab === '3 BHK' ? 'text-[#364153]' : 'text-[#364153]'}`}>3 BHK</Text>
                    <Text className="text-[#6A7282] text-[12px] font-inter-medium">4 Sizes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setActiveFloorTab('5 BHK')}
                    className={`flex-1 items-center py-3 ${activeFloorTab === '5 BHK' ? 'bg-[#E6F7F6]' : 'bg-white'}`}
                  >
                    <Text className={`text-[14px] font-inter-medium ${activeFloorTab === '5 BHK' ? 'text-[#008E96]' : 'text-[#364153]'}`}>5 BHK</Text>
                    <Text className="text-[#6A7282] text-[12px] font-inter-medium">2 Sizes</Text>
                  </TouchableOpacity>
                </View>

                {/* Floor Cards */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4">
                  {floorPlanData.map((item, index) => (
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