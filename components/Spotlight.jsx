import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const Spotlight = ({ data }) => {
  const spotlightData = data || [];

  return (
    <View className="mt-6 gap-4">
      {/* Header Section */}
      <View>
        <Text className="font-inter-bold text-[17px] text-[#101828]">
          Spotlight
        </Text>
        <Text className="font-inter-regular text-[13px] text-[#6A7282]">
          Projects from the best developers in Mohali
        </Text>
      </View>

      {/* Main Container - Relative to parent for triangle positioning */}
      <View className="relative">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-1">
          {spotlightData.length > 0 ? spotlightData.map((item, index) => (
            <View key={item.id || index} className="mr-4 ml-1">
              {/* Developer Info Card - Clickable to Developer/Project Details */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => item.id && router.push({ pathname: '/screens/ProjectDetails', params: { projectId: item.id } })}
                className="w-[278px] h-[88px] rounded-[18px] bg-white shadow-sm elevation-2 z-[1] overflow-hidden"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                }}
              >
                <LinearGradient
                  colors={['#FFFFFF', 'rgba(135, 214, 210, 0.08)', 'rgba(28, 178, 169, 0)']}
                  start={{ x: 0.3, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  locations={[0.064, 0.5258, 1]}
                  className="flex-1 flex-row items-center px-4 gap-3"
                >
                  {/* Icon Container */}
                  <View className="w-14 h-14 bg-[#CCEFED] rounded-[14px] items-center justify-center">
                    <View className="w-8 h-8 opacity-80">
                      <View className="absolute left-[12.5%] top-[12.5%] w-[37.5%] h-[37.5%] bg-[#1CB2A9] rounded-[1px]" />
                      <View className="absolute right-[12.5%] top-[12.5%] w-[37.5%] h-[37.5%] bg-[#1CB2A9] rounded-[1px]" />
                      <View className="absolute left-[12.5%] bottom-[12.5%] w-[37.5%] h-[37.5%] bg-[#1CB2A9] rounded-[1px]" />
                      <View className="absolute right-[12.5%] bottom-[12.5%] w-[37.5%] h-[37.5%] bg-[#1CB2A9] rounded-[1px]" />
                    </View>
                  </View>

                  {/* Stats Section */}
                  <View className="w-[198px] h-[58px] gap-2">
                    <View className="flex-row gap-6 h-[34.5px] items-center">
                      <View className="w-[53px] h-[34.5px]">
                        <Text className="font-inter-bold text-[12px] leading-[18px] text-[#101828]">
                          {item.developer.estd || '2024'}
                        </Text>
                        <Text className="font-inter-regular text-[11px] leading-[16px] text-[#6A7282]">
                          Year estd.
                        </Text>
                      </View>
                      <View className="w-[43px] h-[34.5px]">
                        <Text className="font-inter-bold text-[12px] leading-[18px] text-[#101828]">
                          {item.developer.projects || '1'}
                        </Text>
                        <Text className="font-inter-regular text-[11px] leading-[16px] text-[#6A7282]">
                          Projects
                        </Text>
                      </View>
                    </View>
                    <Text className="font-inter-bold text-[13px] leading-[18px] text-[#101828]">
                      {item.developer.name}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Property Card - Clickable to PropertyDetails */}
              <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => item.property.id && router.push({ pathname: '/screens/PropertyDetails', params: { propertyId: item.property.id } })}
                className="mt-[10px] rounded-[18px] overflow-hidden bg-white w-[278px] h-[160px] shadow-md elevation-5"
                style={{ 
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.08,
                  shadowRadius: 4,
                }}
              >
                <ImageBackground 
                  source={{ uri: item.property.image }} 
                  className="w-full h-full"
                  resizeMode="cover"
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.8)']}
                    className="absolute inset-0"
                    locations={[0, 0.5, 1]}
                  />
                  
                  <View className="absolute w-[246px] h-[76px] left-4 top-[66px]">
                    <Text className="font-inter-bold text-[14px] h-6 leading-5 text-white">
                      {item.property.title}
                    </Text>
                    <Text className="font-inter-regular text-[11px] h-[16px] leading-[16px] text-white/90 mt-1">
                      {item.property.location}
                    </Text>
                    <Text className="font-inter-regular text-[10px] h-[14px] leading-4 text-white/80 mt-[2px]">
                      {item.property.config}
                    </Text>
                    <Text className="font-inter-bold text-[14px] h-6 leading-5 text-white mt-2">
                      {item.property.priceRange}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          )) : (
            <Text className="font-inter-regular text-[13px] text-[#6A7282] ml-1">
              No spotlight projects available right now.
            </Text>
          )}
        </ScrollView>

        {/* Fixed Triangle indicator in the center of the viewport */}
        <View 
          className="absolute left-1/2 -ml-[10px] top-[95.5px] z-[10]"
          pointerEvents="none"
          style={{
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderLeftWidth: 10,
            borderRightWidth: 10,
            borderBottomWidth: 12,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: '#008E96',
            transform: [{ rotate: '180deg' }],
          }}
        />
      </View>

      {/* Housing Assist Card */}
      {/* <View 
        className="h-[97px]  rounded-[20px] overflow-hidden shadow-md elevation-5"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        }}
      >
        <LinearGradient
          colors={['#1CB2A9', '#61BCBA', '#4DD5DD']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="flex-1 flex-row justify-between items-center px-4"
        >
          <View className="w-[110.46px] h-[45.5px] gap-[2px]">
            <Text className="font-inter-regular text-[13px] leading-5 text-white">
              Introducing
            </Text>
            <View className="flex-row items-center">
              <Text className="font-inter-bold text-[16px] leading-6 text-white">
                Housing{' '}
              </Text>
              <Text className="font-inter-bold text-[16px] leading-6 text-[#FFD700]">
                Assist
              </Text>
            </View>
          </View>
          
          <View className="w-5 h-5 items-center justify-center">
            <MaterialCommunityIcons name="chevron-right" size={24} color="#FFFFFF" />
          </View>
        </LinearGradient>
      </View> */}
    </View>
  );
};

export default Spotlight;
