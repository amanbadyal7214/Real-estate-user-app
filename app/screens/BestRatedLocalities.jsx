import { Feather, Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import LocalityReviewCard from '../../components/LocalityReviewCard'
import ProjectReviewCard from '../../components/ProjectReviewCard'

const BestRatedLocalities = () => {
  const [activeTab, setActiveTab] = useState('localities');
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Top Rated');
  const [selectedPropertyType, setSelectedPropertyType] = useState('Apartments');

  const sortOptions = ['Recommended', 'Top Rated', 'Mostly searched'];
  const propertyTypes = ['Apartments', 'Independent Floor', 'Independent House', 'Villa'];

  const localitiesData = [
    { name: "Kurali, Mohali", location: "Mohali, Sahibzada Ajit ...", price: "₹6,723/ sq.ft.", rating: "5.0", reviewsCount: 2, propertiesCount: "100+" },
    { name: "Khanpur, Mohali", location: "Mohali, Sahibzada Ajit ...", price: "₹5,107/ sq.ft.", rating: "5.0", reviewsCount: 2, propertiesCount: "90+" },
    { name: "Aujala, Mohali", location: "Mohali, Sahibzada Ajit ...", price: "₹4,850/ sq.ft.", rating: "5.0", reviewsCount: 3, propertiesCount: "80+" },
    { name: "Sector 67, Mohali", location: "Mohali, Sahibzada Ajit ...", price: "₹7,200/ sq.ft.", rating: "4.8", reviewsCount: 5, propertiesCount: "120+" },
  ];

  const projectsData = [
    { name: "Homeland Heights", location: "Sector 70, Mohali", price: "₹15,903/ sq.ft.", rating: "4.9", reviewsCount: 5, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop" },
    { name: "Emaar The Views", location: "Sector 105, Mohali", price: "₹5,792/ sq.ft.", rating: "4.7", reviewsCount: 5, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop" },
    { name: "Hero Homes", location: "Sector 88, Mohali", price: "₹6,200/ sq.ft.", rating: "4.8", reviewsCount: 12, image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1000&auto=format&fit=crop" },
  ];

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
          <TouchableOpacity className="w-[40px] h-[40px] items-center justify-center">
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
              placeholder="Enter a locality, society to read review..." 
              placeholderTextColor="rgba(16, 24, 40, 0.5)"
              className="flex-1 font-inter-regular text-[14px]"
            />
            <TouchableOpacity className="w-[36px] h-[36px] bg-[#008E96] rounded-[8px] items-center justify-center">
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
              Showing top {activeTab === 'localities' ? localitiesData.length : projectsData.length} results
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
            localitiesData.map((item, index) => (
              <LocalityReviewCard 
                key={index}
                name={item.name}
                location={item.location}
                price={item.price}
                rating={item.rating}
                reviewsCount={item.reviewsCount}
                propertiesCount={item.propertiesCount}
              />
            ))
          ) : (
            projectsData.map((item, index) => (
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
