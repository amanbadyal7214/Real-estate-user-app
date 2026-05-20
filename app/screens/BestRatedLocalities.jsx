import { Feather, Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import LocalityReviewCard from '../../components/LocalityReviewCard'
import ProjectReviewCard from '../../components/ProjectReviewCard'
import { useLocalityAveragePrice } from '../../hooks/useLocalityAveragePrice'
import { useProject } from '../../hooks/useProject'
import { useLocation } from '../context/LocationContext'
import { formatPricePerSqft } from '../utils/formatPrice'

const BestRatedLocalities = () => {
  const [activeTab, setActiveTab] = useState('localities');
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Top Rated');
  const [selectedPropertyType, setSelectedPropertyType] = useState('Apartments');
  const [searchText, setSearchText] = useState('');

  const sortOptions = ['Recommended', 'Top Rated', 'Mostly searched'];
  const propertyTypes = ['Apartments', 'Independent Floor', 'Independent House', 'Villa'];

  const [localitiesData, setLocalitiesData] = useState([]);
  const { fetchAveragePriceByCity, loading: localityLoading } = useLocalityAveragePrice();
  const { currentLocation } = useLocation();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetchAveragePriceByCity(currentLocation?.city || 'Mohali');
        if (!mounted) return;
        if (res?.success) {
          setLocalitiesData(Array.isArray(res.data) ? res.data : []);
        } else {
          setLocalitiesData([]);
        }
      } catch (err) {
        console.error('Error loading localities average price:', err);
        if (mounted) setLocalitiesData([]);
      }
    };

    load();
    return () => { mounted = false; };
  }, [currentLocation?.city, fetchAveragePriceByCity]);

  const { fetchProjects, loading: projectsLoading } = useProject();
  const [projectsData, setProjectsData] = useState([]);

  useEffect(() => {
    let mounted = true;
    const loadProjects = async () => {
      try {
        const res = await fetchProjects({ city: currentLocation?.city || 'Mohali' });
        if (!mounted) return;
        const data = Array.isArray(res) ? res : (res?.data || []);
        const formatted = data.map((project) => ({
          name: project.projectName || project.title || project.projectName || 'Project',
          location: `${project.locality || ''}${project.locality ? ', ' : ''}${project.city?.name || project.city || ''}`,
          price: project.priceRange || (project.avgPriceRate ? `₹ ${project.avgPriceRate} / ${project.avgPriceUnit?.label || 'sq.ft.'}` : 'Price on Request'),
          rating: project.avgRating || project.rating || '—',
          reviewsCount: project.reviewsCount || project.totalReviews || 0,
          image: project.media && project.media.length > 0 ? project.media[0].fileUrl : "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=203&auto=format&fit=crop",
        }));
        setProjectsData(formatted);
      } catch (err) {
        console.error('Error loading projects:', err);
        if (mounted) setProjectsData([]);
      }
    };

    if (activeTab === 'projects') loadProjects();
    return () => { mounted = false; };
  }, [currentLocation?.city, fetchProjects, activeTab]);

  const localitiesDataFiltered = useMemo(() => {
    const q = (searchText || '').trim().toLowerCase();
    if (!q) return localitiesData;
    return localitiesData.filter((item) => {
      const name = (item.localityName || item.locality || '').toString().toLowerCase();
      const city = (item.city?.name || item.city || '').toString().toLowerCase();
      return name.includes(q) || city.includes(q);
    });
  }, [searchText, localitiesData]);

  const projectsDataFiltered = useMemo(() => {
    const q = (searchText || '').trim().toLowerCase();
    if (!q) return projectsData;
    return projectsData.filter((item) => {
      const name = (item.name || '').toString().toLowerCase();
      const location = (item.location || '').toString().toLowerCase();
      return name.includes(q) || location.includes(q);
    });
  }, [searchText, projectsData]);

  return (
    <View className="flex-1 bg-white">
      {/* Header Section */}
      <View className="relative h-[310px]">
        <LinearGradient
          colors={['#008E96', '#1CB2A9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        />
        
        {/* Nav Bar */}
        <View className="flex-row justify-between items-center px-[16px] mt-[16px] h-[72px]">
          <TouchableOpacity onPress={() => router.back()} className="w-[40px] h-[40px] items-center justify-center">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center bg-white/20 px-[12px] py-[6px] rounded-[10px]">
            <Ionicons name="location-outline" size={16} color="white" />
            <Text className="text-white font-inter-medium text-[14px] mx-[4px]">Mohali</Text>
            <Ionicons name="chevron-down" size={16} color="white" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View className="px-[16px] mt-[0px]">
          <Text className="text-white font-inter-semibold text-[22px] leading-[29px]">
            Resident Reviews on{"\n"}Projects and Localities
          </Text>
        </View>

        {/* Search Bar */}
        <View className="px-[16px] mt-[24px]">
            <View className="flex-row items-center bg-white rounded-[12px] px-[16px] h-[48px] shadow-sm">
              <TextInput 
                placeholder="Enter a locality, society or project to search..." 
                placeholderTextColor="rgba(16, 24, 40, 0.5)"
                className="flex-1 font-inter-regular text-[14px]"
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
                returnKeyType="search"
              />
              <TouchableOpacity onPress={() => { /* no-op: instant filtering on change */ }} className="w-[36px] h-[36px] bg-[#008E96] rounded-[8px] items-center justify-center">
                <Feather name="search" size={20} color="white" />
              </TouchableOpacity>
            </View>
        </View>
      </View>

      {/* Content Section */}
      <View className="flex-1 bg-white -mt-[20px] rounded-t-[20px] pt-[20px]">
        {/* Tabs */}
        <View className="flex-row px-[16px] gap-[12px] h-[48px]">
          <TouchableOpacity 
            onPress={() => setActiveTab('localities')}
            className={`flex-1 rounded-[12px] items-center justify-center ${activeTab === 'localities' ? 'bg-[#008E96]/10 border-2 border-[#008E96]' : 'bg-white border border-[#E4E7EC]'}`}
          >
            <Text className={`font-inter-semibold text-[14px] ${activeTab === 'localities' ? 'text-[#008E96]' : 'text-[#6A7282]'}`}>Localities</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('projects')}
            className={`flex-1 rounded-[12px] items-center justify-center ${activeTab === 'projects' ? 'bg-[#008E96]/10 border-2 border-[#008E96]' : 'bg-white border border-[#E4E7EC]'}`}
          >
            <Text className={`font-inter-semibold text-[14px] ${activeTab === 'projects' ? 'text-[#008E96]' : 'text-[#6A7282]'}`}>Projects</Text>
          </TouchableOpacity>
        </View>

        {/* List Header */}
        <View className="px-[16px] mt-[20px]">
          <Text className="text-[#101828] font-inter-semibold text-[18px]">
            Reviews for {activeTab} in Mohali
          </Text>
          
          {activeTab === 'projects' && (
            <View className="flex-row items-center mt-[12px]">
              <Text className="text-[#6A7282] font-inter-regular text-[14px] mr-[8px]">Filter by</Text>
              <TouchableOpacity 
                onPress={() => setIsFilterModalVisible(true)}
                className="flex-row items-center border border-[#008E96] rounded-[10px] px-[12px] py-[8px]"
              >
                <Text className="text-[#008E96] font-inter-medium text-[14px]">{selectedPropertyType}</Text>
                <Ionicons name="chevron-down" size={16} color="#008E96" className="ml-[4px]" />
              </TouchableOpacity>
            </View>
          )}

          <View className="flex-row justify-between items-center mt-[16px]">
            <Text className="text-[#6A7282] font-inter-regular text-[13px]">
              Showing top {activeTab === 'localities' ? (localitiesDataFiltered.length) : (projectsDataFiltered.length)} results
            </Text>
            <TouchableOpacity 
              onPress={() => setIsSortModalVisible(true)}
              className="flex-row items-center gap-[4px]"
            >
              <Text className="text-[#101828] font-inter-medium text-[14px]">{selectedSort}</Text>
              <Ionicons name="chevron-down" size={16} color="#4A5565" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Results List */}
        <ScrollView className="flex-1 px-[16px] mt-[16px]" contentContainerStyle={{ gap: 16, paddingBottom: 20 }}>
          {activeTab === 'localities' ? (
            localitiesDataFiltered.length > 0 ? (
              localitiesDataFiltered.map((item, index) => (
                <LocalityReviewCard 
                  key={index}
                  name={item.localityName || item.locality}
                  location={currentLocation?.city || item.city || ''}
                  price={formatPricePerSqft(item.averagePrice || item.avgPrice || item.price)}
                  rating={item.rating || '—'}
                  reviewsCount={item.totalProperties || 0}
                  propertiesCount={item.totalProperties ? `${item.totalProperties}` : 'N/A'}
                />
              ))
            ) : (
              <View className="items-center py-8">
                <Text className="text-[#6A7282]">No localities match "{searchText}"</Text>
              </View>
            )
          ) : (
            projectsDataFiltered.length > 0 ? (
              projectsDataFiltered.map((item, index) => (
                <ProjectReviewCard 
                  key={index}
                  name={item.name}
                  location={item.location}
                  price={item.price}
                  rating={item.rating}
                  reviewsCount={item.reviewsCount}
                  image={item.image}
                  isProject={true}
                />
              ))
            ) : (
              <View className="items-center py-8">
                <Text className="text-[#6A7282]">No projects match "{searchText}"</Text>
              </View>
            )
          )}
        </ScrollView>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isSortModalVisible}
        onRequestClose={() => setIsSortModalVisible(false)}
      >
        <Pressable 
          className="flex-1" 
          onPress={() => setIsSortModalVisible(false)}
        >
          <BlurView 
            intensity={90} 
            tint="light" 
            className="flex-1"
          >
            <View className="mt-auto bg-white rounded-t-[24px] shadow-2xl">
              {/* Handlebar */}
              <View className="items-center py-[12px]">
                <View className="w-[40px] h-[4px] bg-[#D0D5DD] rounded-full" />
              </View>

              {/* Content */}
              <View className="px-[20px] pb-[40px] pt-[10px]">
                <Text className="text-[#101828] font-inter-semibold text-[20px] mb-[20px]">Sort by</Text>
                <View className="mb-[32px]">
                  {sortOptions.map((option) => (
                    <TouchableOpacity 
                      key={option}
                      onPress={() => setSelectedSort(option)}
                      className={`py-[12px] px-[0px] flex-row justify-between items-center ${selectedSort === option ? '' : ''}`}
                    >
                      <Text className={`font-inter-regular text-[16px] ${selectedSort === option ? 'text-[#008E96]' : 'text-black'}`}>
                        {option}
                      </Text>
                      {selectedSort === option && <Ionicons name="checkmark" size={20} color="#008E96" />}
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity 
                  onPress={() => setIsSortModalVisible(false)}
                  className="h-[52px] rounded-[12px] items-center justify-center overflow-hidden"
                >
                  <LinearGradient
                    colors={['#008E96', '#1CB2A9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                  />
                  <Text className="text-white font-inter-semibold text-[16px]">Apply filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Pressable>
      </Modal>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <Pressable 
          className="flex-1" 
          onPress={() => setIsFilterModalVisible(false)}
        >
          <BlurView 
            intensity={90} 
            tint="light" 
            className="flex-1"
          >
            <View className="mt-auto bg-white rounded-t-[24px] shadow-2xl">
              {/* Handlebar */}
              <View className="items-center py-[12px]">
                <View className="w-[40px] h-[4px] bg-[#D0D5DD] rounded-full" />
              </View>

              {/* Header */}
              <View className="px-[20px] pt-[10px] pb-[20px]">
                <Text className="text-[#101828] font-inter-semibold text-[20px]">Filters</Text>
                <Text className="text-[#6A7282] font-inter-regular text-[14px] mt-[8px]">Searching in <Text className="text-[#101828] font-inter-medium">Mohali</Text></Text>
                
                <TouchableOpacity className="flex-row items-center mt-[16px]">
                  <Text className="text-[#6A7282] font-inter-medium text-[14px]">Filters: </Text>
                  <Text className="text-[#008E96] font-inter-medium text-[14px]">{selectedPropertyType}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#008E96" />
                </TouchableOpacity>
              </View>

              <View className="h-[1px] bg-[#E4E7EC] mx-[20px]" />

              {/* Property Type Section */}
              <View className="px-[20px] py-[24px]">
                <Text className="text-[#101828] font-inter-medium text-[16px] mb-[16px]">Property Type</Text>
                <View className="flex-row flex-wrap gap-[12px]">
                  {propertyTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setSelectedPropertyType(type)}
                      className={`px-[16px] py-[10px] rounded-[12px] border ${
                        selectedPropertyType === type 
                        ? 'bg-[#008E96]/10 border-[#008E96]' 
                        : 'bg-white border-[#D0D5DD]'
                      }`}
                    >
                      <Text className={`font-inter-medium text-[14px] ${
                        selectedPropertyType === type ? 'text-[#008E96]' : 'text-[#101828]'
                      }`}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Footer Button */}
              <View className="px-[16px] py-[16px] border-t border-[#E4E7EC]">
                <TouchableOpacity 
                  onPress={() => setIsFilterModalVisible(false)}
                  className="h-[52px] rounded-[12px] items-center justify-center"
                  style={{ backgroundColor: '#008E96' }}
                >
                  <LinearGradient
                    colors={['#008E96', '#1CB2A9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 12 }}
                  />
                  <Text className="text-white font-inter-semibold text-[16px]">Apply filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Pressable>
      </Modal>
    </View>
  )
}

export default BestRatedLocalities
