import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Spotlight = ({ data }) => {
  const spotlightData = data || [];

  return (
    <View style={{ marginTop: hp('3%'), gap: wp('4.3%') }}>
      {/* Header Section */}
      <View>
        <Text className="font-inter-bold text-[#101828]" style={{ fontSize: wp('3.8%') }}>
          Featured Builder
        </Text>
        <Text className="font-inter-regular text-[#6A7282]" style={{ fontSize: wp('3.0%') }}>
          Highly rated builders in your area
        </Text>
      </View>

      {/* Main Container - Relative to parent for triangle positioning */}
      <View className="relative">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-1">
          {spotlightData.length > 0 ? spotlightData.map((item, index) => (
            <View key={item.id || index} style={{ marginRight: wp('4.3%'), marginLeft: wp('1.1%') }}>
              {/* Developer Info Card - Clickable to Developer/Project Details */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => item.id && router.push({ pathname: '/screens/ProjectDetails', params: { projectId: item.id } })}
                className="bg-white elevation-2 z-[1] overflow-hidden"
                style={{
                  width: wp('64%'),
                  height: hp('9.2%'),
                  borderRadius: wp('4%'),
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: hp('0.1%') },
                  shadowOpacity: 0.1,
                  shadowRadius: wp('0.5%'),
                }}
              >
                <LinearGradient
                  colors={['#FFFFFF', 'rgba(135, 214, 210, 0.08)', 'rgba(28, 178, 169, 0)']}
                  start={{ x: 0.3, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  locations={[0.064, 0.5258, 1]}
                  className="flex-1 flex-row items-center"
                  style={{ paddingHorizontal: wp('4.3%'), gap: wp('3.2%') }}
                >
                  {/* Icon Container */}
                  <View className="bg-[#CCEFED] items-center justify-center" style={{ width: wp('14.9%'), height: wp('14.9%'), borderRadius: wp('3.7%') }}>
                    <View className="opacity-80" style={{ width: wp('8.5%'), height: wp('8.5%') }}>
                      <View className="absolute left-[12.5%] top-[12.5%] w-[37.5%] h-[37.5%] bg-[#1CB2A9] rounded-[1px]" />
                      <View className="absolute right-[12.5%] top-[12.5%] w-[37.5%] h-[37.5%] bg-[#1CB2A9] rounded-[1px]" />
                      <View className="absolute left-[12.5%] bottom-[12.5%] w-[37.5%] h-[37.5%] bg-[#1CB2A9] rounded-[1px]" />
                      <View className="absolute right-[12.5%] bottom-[12.5%] w-[37.5%] h-[37.5%] bg-[#1CB2A9] rounded-[1px]" />
                    </View>
                  </View>

                  {/* Stats Section */}
                  <View style={{ flex: 1, height: hp('6.2%'), gap: wp('1.5%') }}>
                    <View className="flex-row items-center" style={{ gap: wp('5%'), height: hp('3.5%') }}>
                      <View style={{ width: wp('14.1%'), height: hp('3.5%') }}>
                        <Text className="font-inter-bold text-[#101828]" style={{ fontSize: wp('2.9%'), lineHeight: hp('1.8%') }}>
                          {item.developer.estd || '2024'}
                        </Text>
                        <Text className="font-inter-regular text-[#6A7282]" style={{ fontSize: wp('2.5%'), lineHeight: hp('1.7%') }}>
                          Year estd.
                        </Text>
                      </View>
                      <View style={{ width: wp('11.5%'), height: hp('3.5%') }}>
                        <Text className="font-inter-bold text-[#101828]" style={{ fontSize: wp('2.9%'), lineHeight: hp('1.8%') }}>
                          {item.developer.projects || '1'}
                        </Text>
                        <Text className="font-inter-regular text-[#6A7282]" style={{ fontSize: wp('2.5%'), lineHeight: hp('1.7%') }}>
                          Projects
                        </Text>
                      </View>
                    </View>
                    <Text className="font-inter-bold text-[#101828]" style={{ fontSize: wp('3.2%'), lineHeight: hp('2%') }} numberOfLines={1}>
                      {item.developer.name}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => item.property.id && router.push({ pathname: '/screens/ProjectDetails', params: { projectId: item.property.id } })}
                className="overflow-hidden bg-white elevation-5"
                style={{
                  marginTop: hp('1.2%'),
                  borderRadius: wp('4%'),
                  width: wp('64%'),
                  height: hp('16.8%'),
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: hp('0.4%') },
                  shadowOpacity: 0.08,
                  shadowRadius: wp('1.1%'),
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

                  <View className="absolute" style={{ width: wp('55.4%'), height: hp('8.2%'), left: wp('4.3%'), top: hp('6.2%') }}>
                    <Text className="font-inter-bold text-white" style={{ fontSize: wp('3.2%'), height: hp('2.5%'), lineHeight: hp('2%') }} numberOfLines={1}>
                      {item.property.title}
                    </Text>
                    <Text className="font-inter-regular text-white/90" style={{ fontSize: wp('2.6%'), height: hp('1.8%'), lineHeight: hp('1.8%'), marginTop: hp('0.3%') }} numberOfLines={1}>
                      {item.property.location}
                    </Text>
                    <Text className="font-inter-regular text-white/80" style={{ fontSize: wp('2.4%'), height: hp('1.5%'), lineHeight: hp('1.5%'), marginTop: hp('0.1%') }} numberOfLines={1}>
                      {item.property.config}
                    </Text>
                    <Text className="font-inter-bold text-white" style={{ fontSize: wp('3.2%'), height: hp('2.5%'), lineHeight: hp('2%'), marginTop: hp('0.6%') }} numberOfLines={1}>
                      {item.property.priceRange}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          )) : (
            <Text className="font-inter-regular text-[#6A7282]" style={{ fontSize: wp('3.5%'), marginLeft: wp('1.1%') }}>
              No spotlight projects available right now.
            </Text>
          )}
        </ScrollView>

        {/* Fixed Triangle indicator in the center of the viewport */}
        <View
          className="absolute z-[10]"
          pointerEvents="none"
          style={{
            left: '50%',
            marginLeft: wp('-2.7%'),
            top: hp('9.8%'),
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderLeftWidth: wp('2.7%'),
            borderRightWidth: wp('2.7%'),
            borderBottomWidth: hp('1.5%'),
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: '#008E96',
            transform: [{ rotate: '180deg' }],
          }}
        />
      </View>
    </View>
  );
};

export default Spotlight;
