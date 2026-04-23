import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, ScrollView, Text, View } from 'react-native';

const Spotlight = ({ data }) => {
  // Mock data if none provided
  const spotlightData = data || [
    {
      id: 1,
      developer: {
        name: 'NIRWANA GROUP',
        estd: '2024',
        projects: '2'
      },
      property: {
        title: 'Nirwana Heights',
        location: 'Khanpur, Mohali',
        config: '3, 4 BHK Apartment, Duplexes',
        priceRange: '88.0 L - 1.99 Cr',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop'
      }
    },
    {
      id: 2,
      developer: {
        name: 'NIRWANA GROUP',
        estd: '2024',
        projects: '2'
      },
      property: {
        title: 'Nirwana Heights',
        location: 'Khanpur, Mohali',
        config: '3, 4 BHK Apartment, Duplexes',
        priceRange: '88.0 L - 1.99 Cr',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop'
      }
    }
  ];

  return (
    <View className="mt-6 gap-4">
      {/* Header Section */}
      <View>
        <Text className="font-inter-bold text-[17px] text-[#101828]">
          Spotlight
        </Text>
        <Text className="font-inter-regular text-[13px] text-[#6A7282]">
          Projects from the best developer in Mohali
        </Text>
      </View>

      {/* Main Container - Relative to parent for triangle positioning */}
      <View className="relative">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-1">
          {spotlightData.map((item, index) => (
            <View key={index} className="mr-5 ml-1">
              {/* Developer Info Card Container for Shadow */}
              <View 
                className="w-[338px] h-[95.5px] rounded-[20px] bg-white shadow-sm elevation-2 z-[1]"
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
                  className="flex-1 rounded-[20px] flex-row items-center px-4 gap-3"
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
                  <View className="w-[238px] h-[63.5px] gap-2">
                    <View className="flex-row gap-6 h-[34.5px] items-center">
                      {/* Year Estd */}
                      <View className="w-[53px] h-[34.5px]">
                        <Text className="font-inter-bold text-[12px] leading-[18px] text-[#101828]">
                          {item.developer.estd}
                        </Text>
                        <Text className="font-inter-regular text-[11px] leading-[16px] text-[#6A7282]">
                          Year estd.
                        </Text>
                      </View>
                      {/* Projects */}
                      <View className="w-[43px] h-[34.5px]">
                        <Text className="font-inter-bold text-[12px] leading-[18px] text-[#101828]">
                          {item.developer.projects}
                        </Text>
                        <Text className="font-inter-regular text-[11px] leading-[16px] text-[#6A7282]">
                          Projects
                        </Text>
                      </View>
                    </View>
                    {/* Developer Name */}
                    <Text className="font-inter-bold text-[14px] leading-[21px] text-[#101828]">
                      {item.developer.name}
                    </Text>
                  </View>
                </LinearGradient>
              </View>

              {/* Property Card */}
              <View 
                className="mt-[12px] rounded-[20px] overflow-hidden bg-white w-[338px] h-[200px] shadow-md elevation-5"
                style={{ 
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
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
                  
                  <View className="absolute w-[306px] h-[96.5px] left-4 top-[87.5px]">
                    <Text className="font-inter-bold text-[16px] h-6 leading-6 text-white">
                      {item.property.title}
                    </Text>
                    <Text className="font-inter-regular text-[12px] h-[18px] leading-[18px] text-white/90 mt-1">
                      {item.property.location}
                    </Text>
                    <Text className="font-inter-regular text-[11px] h-[16.5px] leading-4 text-white/80 mt-[2px]">
                      {item.property.config}
                    </Text>
                    <Text className="font-inter-bold text-[16px] h-6 leading-6 text-white mt-2">
                      ₹{item.property.priceRange}
                    </Text>
                  </View>
                </ImageBackground>
              </View>
            </View>
          ))}
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
      <View 
        className="h-[97px] mt-4 rounded-[20px] overflow-hidden shadow-md elevation-5"
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
      </View>
    </View>
  );
};

export default Spotlight;
