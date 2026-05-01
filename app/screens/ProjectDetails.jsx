import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('Overview');
  const flatListRef = useRef(null);

  const images = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=400'
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
                <TouchableOpacity onPress={() => {}} className="w-12 h-12 bg-black/40 rounded-full items-center justify-center">
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
                  <Text className="text-white text-[12px] font-inter-regular">RERA</Text>
                </View>
                <Text className="text-white text-[24px] font-inter-medium">Vamana Riseonic</Text>
                <View className="flex-row justify-between items-center w-[358px]">
                  <Text className="text-white text-[14px] font-inter-regular">New Chandigarh, Chandigarh</Text>
                  <TouchableOpacity className="bg-white/20 px-4 py-2 rounded-[10px] flex-row items-center gap-2">
                    <Ionicons name="location-outline" size={16} color="white" />
                    <Text className="text-white font-inter-medium text-[14px]">See on Map</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="absolute bottom-6 right-4 bg-black/60 px-3 py-1 rounded-full">
                <Text className="text-white text-[14px] font-inter-regular">{currentImageIndex + 1}/{images.length}</Text>
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
                <Text className="text-[#6A7282] text-[12px] mb-2 font-inter-regular">Zero Brokerage • Possession by Feb, 2031 • Avg. rate ₹ 9.87K - ₹ 10.50K / sq.ft.</Text>
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="text-[#0A0A0A] text-[20px] font-inter-medium">₹ 3.24 Cr - ₹ 5.01 Cr</Text>
                  <Text className="text-[#6A7282] text-[16px] font-inter-regular">ⓘ</Text>
                </View>
                <Text className="text-[#6A7282] text-[14px] font-inter-regular">3, 5 BHK Apartments</Text>
              </View>
              <View>
                <Text className="text-[#101828] text-[18px] font-inter-medium mb-3">Project Configurations</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {configData.map((item, index) => (
                    <ProjectConfigCard key={index} title={item.title} areaRange={item.areaRange} priceRange={item.priceRange} />
                  ))}
                </ScrollView>
              </View>
              <ProjectSellerCard sellerName="Passionate Developers" postedBy="Passionate Developers Pvt Ltd" />
              <View className="bg-white rounded-[16px] p-4 gap-2 shadow-sm border border-[#E5E7EB]">
                <Text className="text-[#101828] text-[18px] font-inter-medium">About Vamana Riseonic</Text>
                <Text className="text-[#000] text-[13px] leading-[27px] font-inter-regular">
                  • Modern 3BHK apartment in a prime location with spacious, well-lit interiors and premium finishes{"\n"}
                  • Equipped with essential amenities like 24/7 security, parking, and landscaped surroundings
                </Text>
              </View>
              <InvestmentInsightsCard appreciation="127.6%" appreciationYear="2021" currentValue="3.24 Cr" projectedValue="4.08 Cr" roi="26.0%" potentialGain="84.18 L" />
              <ProjectBrochureCard />
              <ProjectMapCard />
              <ProjectContactFormCard sellerName="Passionate Developers Pvt Ltd" sellerPhone="72180XXXXX" />
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