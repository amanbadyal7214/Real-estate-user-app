import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState, useEffect } from 'react';
import { Animated, Dimensions, Image, Modal, Pressable, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import PropertyListingCard from '../../components/PropertyListingCard';
import { usePropertyDiscovery } from '../../hooks/usePropertyDiscovery';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LastSearched = () => {
  const router = useRouter();
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Price: High to Low');
  const [lookingTo, setLookingTo] = useState('Buy');

  // Animation for Bottom Sheet
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const lastScrollY = useRef(0);
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

  const filters = ['Area Sqft.', 'Availability', 'Listed By', 'Any Price', 'Property type'];
  
  const sortOptions = [
    'Price : Low to High',
    'Price: High to Low',
    'Area: Low to High',
    'Area: High to Low',
    'Relevance'
  ];

  const lookOptions = ['Buy', 'Rent', 'Commercial', 'PG/Co-living'];
  const propertyTypes = ['Apartments', 'Independent House', 'Builder Floor', 'Plot', 'Studio', 'Duplex', 'Penthouse'];
  const bhkTypes = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '5+ BHK'];
  const availabilityOptions = ['Within a week', 'Within 15 days', 'Within a month'];
  const listedBy = ['Agent', 'Owner', 'Builder', 'Featured Properties'];


  const { fetchProperties, loading } = usePropertyDiscovery();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const response = await fetchProperties({ city: 'Mohali', limit: 10 });
      if (response?.data) {
        setProperties(response.data);
      }
    } catch (err) {
      console.error("Error loading properties:", err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="flex-1">
        {/* Header Container (Based on CSS) */}
        <View className="flex-row justify-between items-center px-[16px] pt-[24px] pb-[16px] h-[64px]">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#4A5565" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          {/* Location Selector (Based on CSS) */}
          <View className="flex-row items-center px-[16px] h-[33px] mt-[10px]">
            <TouchableOpacity className="flex-row items-center bg-[#008E96]/10 px-[12px] py-[6px] rounded-[20px]">
              <Text className="text-[#008E96] font-inter-medium text-[14px]">+ Add</Text>
            </TouchableOpacity>
            <View className="ml-[8px]">
              <Text className="text-[#008E96] font-inter-semibold text-[16px]">Mohali</Text>
            </View>
          </View>

          {/* Filter Pills */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            className="mt-[20px] px-[16px]"
            contentContainerStyle={{ gap: 12, paddingRight: 32 }}
          >
            {filters.map((filter, index) => (
              <TouchableOpacity 
                key={index}
                className="flex-row items-center border border-[#D0D5DD] bg-white px-[12px] py-[8px] rounded-[12px]"
              >
                <Text className="text-[#101828] font-inter-medium text-[14px]">{filter}</Text>
                <Ionicons name="chevron-down" size={16} color="#101828" />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Shop Card (Based on CSS) */}
          <View 
            className="mx-[27px] mt-[24px] bg-white p-[12px] rounded-[12px] border border-[#E4E7EC] flex-row items-start h-[116px]"
            style={{ 
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2 
            }}
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000' }} 
              className="w-[80px] h-[80px] rounded-[8px]"
            />
            <View className="flex-1 ml-[12px] justify-between h-[84.67px]">
              <View>
                <View className="flex-row justify-between items-start w-full">
                  <Text className="text-[#101828] font-inter-medium text-[16px] leading-[24px]">Shop</Text>
                  <View className="bg-[#FEE4E2] px-[8px] py-[4px] rounded-[6px]">
                    <Text className="text-[#D92D20] font-inter-medium text-[12px] leading-[18px]">Popular</Text>
                  </View>
                </View>
                <Text className="text-[#6A7282] font-inter-regular text-[13px] leading-[20px] mt-[4px]">Gmada Aerocity, Mohali</Text>
                <Text className="text-[#6A7282] font-inter-regular text-[12px] leading-[18px]">200 sq.ft. • Ground Floor</Text>
              </View>
              <Text className="text-[#101828] font-inter-bold text-[16px] leading-[24px]">₹ 30,000</Text>
            </View>
            <View className="ml-[12px] items-end justify-end h-[84.67px]">
              <TouchableOpacity className="bg-[#34C38F] px-[14px] py-[8px] rounded-[8px] flex-row items-center">
                <Text className="text-white font-inter-medium text-[13px] leading-[20px]">Contact</Text>
                <MaterialIcons name="arrow-forward" size={14} color="white" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Listings Container (Based on CSS Frame 21) */}
          <View className="px-[16px] mt-[24px] gap-[23px] pb-[100px]">
            {loading ? (
                <View className="py-10 items-center">
                    <Text className="text-[#667085] font-inter-medium italic">Loading listings...</Text>
                </View>
            ) : properties.length > 0 ? (
                properties.map((item) => (
                    <PropertyListingCard key={item._id} data={item} />
                ))
            ) : (
                <View className="py-20 items-center">
                    <Ionicons name="home-outline" size={48} color="#D0D5DD" />
                    <Text className="text-[#667085] font-inter-medium mt-4">No listings found for Mohali</Text>
                </View>
            )}
          </View>
        </ScrollView>
      </View>


      {/* Floating Action Buttons */}
      <View 
        className="absolute bottom-[30px] self-center flex-row bg-white rounded-full border border-[#E4E7EC]" 
        style={{ 
          width: 220, 
          height: 56,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 5
        }}
      >
        <TouchableOpacity 
          className="flex-1 items-center justify-center flex-row gap-[4px]"
          onPress={() => setSortModalVisible(true)}
        >
          <MaterialIcons name="sort" size={20} color="#008E96" />
          <Text className="text-[#008E96] font-inter-medium text-[13px]">Sort</Text>
        </TouchableOpacity>
        <View className="w-[1px] h-[32px] bg-[#E4E7EC] self-center" />
        <TouchableOpacity 
          className="flex-1 items-center justify-center flex-row gap-[4px]"
          onPress={openFilter}
        >
          <Ionicons name="options-outline" size={20} color="#008E96" />
          <Text className="text-[#008E96] font-inter-medium text-[13px]">Filters</Text>
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
            <View className="bg-white rounded-t-[24px] flex-1" style={{ paddingBottom: 20 }}>
              {/* Handle */}
              <View className="items-center py-[12px]">
                <View className="w-[40px] h-[4px] bg-[#D0D5DD] rounded-full" />
              </View>

              {/* Header */}
              <View className="flex-row justify-between items-center px-[20px] pb-[16px]">
                <Text className="text-[#101828] font-inter-semibold text-[20px]">Filter</Text>
                <TouchableOpacity onPress={() => {}}>
                  <Text className="text-[#008E96] font-inter-medium text-[14px]">Clear all</Text>
                </TouchableOpacity>
              </View>

              <ScrollView 
                showsVerticalScrollIndicator={false} 
                className="flex-1 px-[20px]"
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                {/* Searching In */}
                <View className="flex-row justify-between items-center mt-[12px]">
                  <Text className="text-[#6A7282] font-inter-regular text-[14px]">
                    You are searching in <Text className="font-inter-semibold text-[#101828]">Mohali</Text>
                  </Text>
                  <TouchableOpacity className="flex-row items-center">
                    <Text className="text-[#008E96] font-inter-medium text-[16px]">Change Location</Text>
                    <Ionicons name="chevron-forward" size={16} color="#008E96" />
                  </TouchableOpacity>
                </View>

                {/* Filter Applied Tag */}
                <View className="mt-[24px]">
                  <Text className="text-[#9CA3AF] font-inter-regular text-[14px]">Filter Applied</Text>
                  <View className="flex-row mt-[8px]">
                    <View className="flex-row items-center bg-[#008E96]/10 px-[12px] py-[6px] rounded-[16px]">
                      <Text className="text-[#008E96] font-inter-medium text-[14px]">Mohali</Text>
                      <Ionicons name="close-circle" size={16} color="#008E96" style={{ marginLeft: 6 }} />
                    </View>
                  </View>
                </View>

                {/* I'm Looking to */}
                <View className="mt-[32px]">
                  <Text className="text-[#101828] font-inter-semibold text-[16px]">I'm Looking to</Text>
                  <View className="flex-row flex-wrap gap-[12px] mt-[12px]">
                    {lookOptions.map(option => (
                      <TouchableOpacity 
                        key={option}
                        onPress={() => setLookingTo(option)}
                        className={`px-[16px] py-[10px] rounded-[12px] border ${lookingTo === option ? 'bg-[#008E96]/10 border-[#008E96]' : 'bg-white border-[#D0D5DD]'}`}
                      >
                        <Text className={`font-inter-medium text-[14px] ${lookingTo === option ? 'text-[#008E96]' : 'text-[#101828]'}`}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Localities */}
                <View className="mt-[32px]">
                  <Text className="text-[#101828] font-inter-semibold text-[16px]">Localities</Text>
                  <View className="flex-row items-center gap-[12px] mt-[12px]">
                    <TouchableOpacity 
                      className="flex-row items-center px-[16px] py-[10px] rounded-[12px]"
                      style={{ backgroundColor: '#008E96' }}
                    >
                      <LinearGradient
                        colors={['#008E96', '#1CB2A9']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="absolute inset-0 rounded-[12px]"
                      />
                      <Text className="text-white font-inter-semibold text-[14px]">+ Add More</Text>
                    </TouchableOpacity>
                    <View className="flex-row items-center bg-[#008E96]/10 px-[12px] py-[6px] rounded-[16px]">
                      <Text className="text-[#008E96] font-inter-medium text-[14px]">Mohali</Text>
                      <Ionicons name="close-circle" size={16} color="#008E96" style={{ marginLeft: 6 }} />
                    </View>
                  </View>
                </View>

                {/* Property Type */}
                <View className="mt-[32px]">
                  <Text className="text-[#101828] font-inter-semibold text-[16px]">Property Type <Ionicons name="information-circle-outline" size={16} color="#6A7282" /></Text>
                  <View className="flex-row flex-wrap gap-[12px] mt-[12px]">
                    {propertyTypes.map(type => (
                      <TouchableOpacity 
                        key={type}
                        className="flex-row items-center border border-[#E4E7EC] bg-white px-[12px] py-[10px] rounded-[12px]"
                      >
                        <View className="w-[18px] h-[18px] border-[1.5px] border-[#D0D5DD] rounded-[4px] mr-[8px] items-center justify-center" />
                        <Text className="text-[#101828] font-inter-medium text-[13px]">{type}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Budget */}
                <View className="mt-[32px]">
                  <Text className="text-[#101828] font-inter-semibold text-[16px]">Budget</Text>
                  <View className="flex-row justify-between mt-[12px]">
                    <Text className="text-[#008E96] font-inter-medium text-[13px]">Min : ₹ 0.0 K</Text>
                    <Text className="text-[#008E96] font-inter-medium text-[13px]">Max : ₹ 200.0 L+</Text>
                  </View>
                  <View className="h-[24px] justify-center mt-[8px]">
                    <View className="h-[4px] bg-[#008E96] rounded-full flex-row justify-between items-center px-[0px]">
                      <View className="w-[20px] h-[20px] bg-[#008E96] rounded-full border-[2px] border-white" />
                      <View className="w-[20px] h-[20px] bg-[#008E96] rounded-full border-[2px] border-white" />
                    </View>
                  </View>
                </View>

                {/* Built-up Area */}
                <View className="mt-[32px]">
                  <Text className="text-[#101828] font-inter-semibold text-[16px]">Built-up Area</Text>
                  <View className="flex-row justify-between mt-[12px]">
                    <Text className="text-[#008E96] font-inter-medium text-[13px]">Min : 0 Sqft</Text>
                    <Text className="text-[#008E96] font-inter-medium text-[13px]">Max : 5000 Sqft+</Text>
                  </View>
                  <View className="h-[24px] justify-center mt-[8px]">
                    <View className="h-[4px] bg-[#008E96] rounded-full flex-row justify-between items-center px-[0px]">
                      <View className="w-[20px] h-[20px] bg-[#008E96] rounded-full border-[2px] border-white" />
                      <View className="w-[20px] h-[20px] bg-[#008E96] rounded-full border-[2px] border-white" />
                    </View>
                  </View>
                </View>

                {/* BHK Type */}
                <View className="mt-[32px]">
                  <Text className="text-[#101828] font-inter-semibold text-[16px]">BHK Type</Text>
                  <View className="flex-row flex-wrap gap-[12px] mt-[12px]">
                    {bhkTypes.map(type => (
                      <TouchableOpacity 
                        key={type}
                        className="flex-row items-center border border-[#F2F4F7] bg-white px-[12px] py-[12px] rounded-[12px] min-w-[75px] justify-center"
                        style={{
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.05,
                          shadowRadius: 2,
                          elevation: 1
                        }}
                      >
                        <View className="w-[18px] h-[18px] border-[1.5px] border-[#D0D5DD] rounded-[4px] mr-[8px]" />
                        <Text className="text-[#101828] font-inter-medium text-[13px] text-center">{type}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Available */}
                <View className="mt-[32px]">
                  <Text className="text-[#101828] font-inter-semibold text-[16px]">Available</Text>
                  <View className="flex-row flex-wrap gap-[12px] mt-[12px]">
                    {availabilityOptions.map(option => (
                      <TouchableOpacity 
                        key={option}
                        className="bg-white border border-[#E4E7EC] px-[16px] py-[12px] rounded-[12px]"
                      >
                        <Text className="text-[#101828] font-inter-medium text-[14px]">{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Listed By */}
                <View className="mt-[32px] mb-[40px]">
                  <Text className="text-[#101828] font-inter-semibold text-[16px]">Listed By</Text>
                  <View className="flex-row flex-wrap gap-[12px] mt-[12px]">
                    {listedBy.map(option => (
                      <TouchableOpacity 
                        key={option}
                        className="flex-row items-center border border-[#F2F4F7] bg-white px-[12px] py-[10px] rounded-[12px]"
                      >
                        <View className="w-[18px] h-[18px] border-[1.5px] border-[#D0D5DD] rounded-[4px] mr-[8px]" />
                        <Text className="text-[#101828] font-inter-medium text-[13px]">{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>

              {/* Bottom Fixed Apply Button Container */}
              <View className="px-[20px] py-[20px] bg-white border-t border-[#F2F4F7]">
                <TouchableOpacity 
                  className="bg-[#008E96] mb-2 py-[16px] rounded-[12px] items-center overflow-hidden"
                  style={{ 
                    shadowColor: '#008E96', 
                    shadowOffset: { width: 0, height: 10 }, 
                    shadowOpacity: 0.4, 
                    shadowRadius: 20, 
                    elevation: 10,
                    borderRadius: 12
                  }}
                  onPress={closeFilter}
                >
                  <LinearGradient
                    colors={['#008E96', '#1CB2A9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 12 }}
                  />
                  <Text className="text-white font-inter-bold text-[16px]">View 540 Properties</Text>
                </TouchableOpacity>
              </View>
            </View>
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
            <View className="bg-white rounded-t-[24px] pb-[40px]">
              {/* Header section (Frame 8) */}
              <View className="bg-[#E4E7EC]/50 rounded-t-[24px] pt-[21px] px-[19px] pb-[20px]">
                <View className="self-center w-[54px] h-[7px] bg-[#D9D9D9] rounded-full mb-[12px]" />
                <Text className="text-[#101828] font-inter-semibold text-[20px] leading-[30px]">Sort by</Text>
              </View>
              
              {/* Options section (Frame 9) */}
              <View className="px-[16px] mt-[10px] gap-[8px]">
                {sortOptions.map((option) => (
                  <TouchableOpacity 
                    key={option}
                    onPress={() => setSelectedSort(option)}
                    className={`py-[8px] items-center rounded-sm ${selectedSort === option ? 'bg-[#1CB2A9]/5' : ''}`}
                  >
                    <Text className={`font-inter-regular text-[14px] leading-[21px] text-center ${selectedSort === option ? 'text-[#008E96]' : 'text-black'}`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Apply Button */}
              <View className="px-[16px] mt-[24px] items-center">
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={() => setSortModalVisible(false)}
                  className="w-full"
                >
                  <LinearGradient
                    colors={['#008E96', '#1CB2A9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="py-[14px] rounded-[12px] items-center justify-center"
                    style={{ 
                      shadowColor: '#008E96',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 16,
                      elevation: 4
                    }}
                  >
                    <Text className="text-white font-inter-semibold text-[16px] leading-[24px]">Apply filters</Text>
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
