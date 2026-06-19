import { Feather, Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
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
  const { fetchAveragePriceByCity } = useLocalityAveragePrice();
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

  const { fetchProjects } = useProject();
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
      <View style={{ height: hp('38.2%') }} className="relative">
        <LinearGradient
          colors={['#008E96', '#1CB2A9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        />
        
        {/* Nav Bar */}
        <View className="flex-row justify-between items-center" style={{ paddingHorizontal: wp('4.3%'), marginTop: hp('2%'), height: hp('8.9%') }}>
          <TouchableOpacity onPress={() => router.back()} className="items-center justify-center" style={{ width: wp('10.6%'), height: wp('10.6%') }}>
            <Ionicons name="arrow-back" size={wp('6.4%')} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-row items-center bg-white/20"
            style={{ paddingHorizontal: wp('3.2%'), paddingVertical: hp('0.7%'), borderRadius: wp('2.7%') }}
          >
            <Ionicons name="location-outline" size={wp('4.3%')} color="white" />
            <Text className="text-white font-inter-medium" style={{ fontSize: wp('3.7%'), marginHorizontal: wp('1%') }}>Mohali</Text>
            <Ionicons name="chevron-down" size={wp('4.3%')} color="white" />
          </TouchableOpacity>
        </View>
 
        {/* Title */}
        <View style={{ paddingHorizontal: wp('4.3%'), marginTop: 0 }}>
          <Text className="text-white font-inter-semibold" style={{ fontSize: wp('5.9%'), lineHeight: wp('7.7%') }}>
            Resident Reviews on{"\n"}Projects and Localities
          </Text>
        </View>
 
        {/* Search Bar */}
        <View style={{ paddingHorizontal: wp('4.3%'), marginTop: hp('3%') }}>
            <View className="flex-row items-center bg-white shadow-sm" style={{ borderRadius: wp('3.2%'), paddingHorizontal: wp('4.3%'), height: hp('5.9%') }}>
              <TextInput 
                placeholder="Enter a locality, society or project to search..." 
                placeholderTextColor="rgba(16, 24, 40, 0.5)"
                className="flex-1 font-inter-regular"
                style={{ fontSize: wp('3.7%') }}
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
                returnKeyType="search"
              />
              <TouchableOpacity onPress={() => { /* no-op: instant filtering on change */ }} className="bg-[#008E96] items-center justify-center" style={{ width: wp('9.6%'), height: wp('9.6%'), borderRadius: wp('2.1%') }}>
                <Feather name="search" size={wp('5.3%')} color="white" />
              </TouchableOpacity>
            </View>
        </View>
      </View>

      {/* Content Section */}
      <View className="flex-1 bg-white" style={{ marginTop: -wp('5.3%'), borderTopLeftRadius: wp('5.3%'), borderTopRightRadius: wp('5.3%'), paddingTop: hp('2.5%') }}>
        {/* Tabs */}
        <View className="flex-row" style={{ paddingHorizontal: wp('4.3%'), gap: wp('3.2%'), height: hp('5.9%') }}>
          <TouchableOpacity 
            onPress={() => setActiveTab('localities')}
            className={`flex-1 items-center justify-center ${activeTab === 'localities' ? 'bg-[#008E96]/10 border-2 border-[#008E96]' : 'bg-white border border-[#E4E7EC]'}`}
            style={{ borderRadius: wp('3.2%') }}
          >
            <Text className="font-inter-semibold" style={{ fontSize: wp('3.7%'), color: activeTab === 'localities' ? '#008E96' : '#6A7282' }}>Localities</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('projects')}
            className={`flex-1 items-center justify-center ${activeTab === 'projects' ? 'bg-[#008E96]/10 border-2 border-[#008E96]' : 'bg-white border border-[#E4E7EC]'}`}
            style={{ borderRadius: wp('3.2%') }}
          >
            <Text className="font-inter-semibold" style={{ fontSize: wp('3.7%'), color: activeTab === 'projects' ? '#008E96' : '#6A7282' }}>Projects</Text>
          </TouchableOpacity>
        </View>
 
        {/* List Header */}
        <View style={{ paddingHorizontal: wp('4.3%'), marginTop: hp('2.5%') }}>
          <Text className="text-[#101828] font-inter-semibold" style={{ fontSize: wp('4.8%') }}>
            Reviews for {activeTab} in Mohali
          </Text>
          
          {activeTab === 'projects' && (
            <View className="flex-row items-center" style={{ marginTop: hp('1.5%') }}>
              <Text className="text-[#6A7282] font-inter-regular" style={{ fontSize: wp('3.7%'), marginRight: wp('2.1%') }}>Filter by</Text>
              <TouchableOpacity 
                onPress={() => setIsFilterModalVisible(true)}
                className="flex-row items-center border border-[#008E96]"
                style={{ borderRadius: wp('2.7%'), paddingHorizontal: wp('3.2%'), paddingVertical: hp('1%') }}
              >
                <Text className="text-[#008E96] font-inter-medium" style={{ fontSize: wp('3.7%') }}>{selectedPropertyType}</Text>
                <Ionicons name="chevron-down" size={wp('4.3%')} color="#008E96" style={{ marginLeft: wp('1%') }} />
              </TouchableOpacity>
            </View>
          )}
 
          <View className="flex-row justify-between items-center" style={{ marginTop: hp('2%') }}>
            <Text className="text-[#6A7282] font-inter-regular" style={{ fontSize: wp('3.5%') }}>
              Showing top {activeTab === 'localities' ? (localitiesDataFiltered.length) : (projectsDataFiltered.length)} results
            </Text>
            <TouchableOpacity 
              onPress={() => setIsSortModalVisible(true)}
              className="flex-row items-center"
              style={{ gap: wp('1%') }}
            >
              <Text className="text-[#101828] font-inter-medium" style={{ fontSize: wp('3.7%') }}>{selectedSort}</Text>
              <Ionicons name="chevron-down" size={wp('4.3%')} color="#4A5565" />
            </TouchableOpacity>
          </View>
        </View>
 
        {/* Results List */}
        <ScrollView className="flex-1" style={{ paddingHorizontal: wp('4.3%'), marginTop: hp('2%') }} contentContainerStyle={{ gap: 16, paddingBottom: 20 }}>
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
                <Text className="text-[#6A7282]">No localities match &quot;{searchText}&quot;</Text>
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
                <Text className="text-[#6A7282]">No projects match &quot;{searchText}&quot;</Text>
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
            <View className="mt-auto bg-white shadow-2xl" style={{ borderTopLeftRadius: wp('6.4%'), borderTopRightRadius: wp('6.4%') }}>
              {/* Handlebar */}
              <View className="items-center" style={{ paddingVertical: hp('1.5%') }}>
                <View className="bg-[#D0D5DD] rounded-full" style={{ width: wp('10.6%'), height: hp('0.5%') }} />
              </View>
 
              {/* Content */}
              <View style={{ paddingHorizontal: wp('5.3%'), paddingBottom: hp('4.9%'), paddingTop: hp('1.2%') }}>
                <Text className="text-[#101828] font-inter-semibold" style={{ fontSize: wp('5.3%'), marginBottom: hp('2.5%') }}>Sort by</Text>
                <View style={{ marginBottom: hp('3.9%') }}>
                  {sortOptions.map((option) => (
                    <TouchableOpacity 
                      key={option}
                      onPress={() => setSelectedSort(option)}
                      className="flex-row justify-between items-center"
                      style={{ paddingVertical: hp('1.5%') }}
                    >
                      <Text className="font-inter-regular" style={{ fontSize: wp('4.3%'), color: selectedSort === option ? '#008E96' : 'black' }}>
                        {option}
                      </Text>
                      {selectedSort === option && <Ionicons name="checkmark" size={wp('5.3%')} color="#008E96" />}
                    </TouchableOpacity>
                  ))}
                </View>
 
                <TouchableOpacity 
                  onPress={() => setIsSortModalVisible(false)}
                  className="items-center justify-center overflow-hidden"
                  style={{ height: hp('6.4%'), borderRadius: wp('3.2%') }}
                >
                  <LinearGradient
                    colors={['#008E96', '#1CB2A9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                  />
                  <Text className="text-white font-inter-semibold" style={{ fontSize: wp('4.3%') }}>Apply filters</Text>
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
            <View className="mt-auto bg-white shadow-2xl" style={{ borderTopLeftRadius: wp('6.4%'), borderTopRightRadius: wp('6.4%') }}>
              {/* Handlebar */}
              <View className="items-center" style={{ paddingVertical: hp('1.5%') }}>
                <View className="bg-[#D0D5DD] rounded-full" style={{ width: wp('10.6%'), height: hp('0.5%') }} />
              </View>
 
              {/* Header */}
              <View style={{ paddingHorizontal: wp('5.3%'), paddingTop: hp('1.2%'), paddingBottom: hp('2.5%') }}>
                <Text className="text-[#101828] font-inter-semibold" style={{ fontSize: wp('5.3%') }}>Filters</Text>
                <Text className="text-[#6A7282] font-inter-regular" style={{ fontSize: wp('3.7%'), marginTop: hp('1%') }}>Searching in <Text className="text-[#101828] font-inter-medium">Mohali</Text></Text>
                
                <TouchableOpacity className="flex-row items-center" style={{ marginTop: hp('2%') }}>
                  <Text className="text-[#6A7282] font-inter-medium" style={{ fontSize: wp('3.7%') }}>Filters: </Text>
                  <Text className="text-[#008E96] font-inter-medium" style={{ fontSize: wp('3.7%') }}>{selectedPropertyType}</Text>
                  <Ionicons name="chevron-forward" size={wp('4.3%')} color="#008E96" />
                </TouchableOpacity>
              </View>
 
              <View className="h-[1px] bg-[#E4E7EC]" style={{ marginHorizontal: wp('5.3%') }} />
 
              {/* Property Type Section */}
              <View style={{ paddingHorizontal: wp('5.3%'), paddingVertical: hp('3%') }}>
                <Text className="text-[#101828] font-inter-medium" style={{ fontSize: wp('4.3%'), marginBottom: hp('2%') }}>Property Type</Text>
                <View className="flex-row flex-wrap" style={{ gap: wp('3.2%') }}>
                  {propertyTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setSelectedPropertyType(type)}
                      className={`border ${
                        selectedPropertyType === type 
                        ? 'bg-[#008E96]/10 border-[#008E96]' 
                        : 'bg-white border-[#D0D5DD]'
                      }`}
                      style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('1.2%'), borderRadius: wp('3.2%') }}
                    >
                      <Text className="font-inter-medium" style={{ fontSize: wp('3.7%'), color: selectedPropertyType === type ? '#008E96' : '#101828' }}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
 
              {/* Footer Button */}
              <View className="border-t border-[#E4E7EC]" style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('2%') }}>
                <TouchableOpacity 
                  onPress={() => setIsFilterModalVisible(false)}
                  className="items-center justify-center"
                  style={{ backgroundColor: '#008E96', height: hp('6.4%'), borderRadius: wp('3.2%') }}
                >
                  <LinearGradient
                    colors={['#008E96', '#1CB2A9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: wp('3.2%') }}
                  />
                  <Text className="text-white font-inter-semibold" style={{ fontSize: wp('4.3%') }}>Apply filters</Text>
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
