import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const formatLocationLabel = (val) => {
  if (!val) return '';
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed || /^[a-f0-9]{24}$/i.test(trimmed)) return '';
    return trimmed;
  }
  if (typeof val === 'object') {
    return val.name || val.label || val.title || '';
  }
  return '';
};

const formatPropertyDisplayLocation = (prop) => {
  if (!prop) return 'Location not available';
  if (typeof prop.location === 'string' && prop.location.trim() && !prop.location.includes('[object Object]')) {
    return prop.location;
  }
  const address1 = formatLocationLabel(prop.addressLine1 || prop.location);
  const locality = formatLocationLabel(prop.localityName || prop.locality);
  const city = formatLocationLabel(prop.city || prop.district);
  const state = formatLocationLabel(prop.state);

  const parts = [address1, locality, city, state].filter(Boolean);
  const uniqueParts = parts.filter(
    (part, idx) => parts.findIndex((p) => p.toLowerCase() === part.toLowerCase()) === idx
  );

  return uniqueParts.join(', ') || 'Location not available';
};

const formatPropertyConfig = (config) => {
  if (!config) return 'Project';
  if (typeof config === 'object') return config.label || config.name || 'Project';
  return String(config);
};

const Spotlight = ({ data }) => {
  const spotlightData = data || [];

  return (
    <View style={{ marginTop: hp('3%'), gap: wp('4.3%') }}>
      {/* Header Section */}
      <View>
        <Text style={{ fontWeight: '700', color: '#101828', fontSize: wp('3.8%') }}>
          Featured Builder
        </Text>
        <Text style={{ fontWeight: '400', color: '#6A7282', fontSize: wp('3.0%') }}>
          Highly rated builders in your area
        </Text>
      </View>

      {/* Main Container */}
      <View style={{ position: 'relative' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 4 }}>
          {spotlightData.length > 0 ? spotlightData.map((item, index) => (
            <View key={item.id || index} style={{ marginRight: wp('4.3%'), marginLeft: wp('1.1%') }}>

              {/* Developer Info Card */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => item.id && router.push({ pathname: '/screens/ProjectDetails', params: { projectId: item.id } })}
                style={{
                  width: wp('55%'),
                  minHeight: hp('9.2%'),
                  borderRadius: wp('4%'),
                  backgroundColor: '#fff',
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: hp('0.1%') },
                  shadowOpacity: 0.1,
                  shadowRadius: wp('0.5%'),
                  elevation: 2,
                  zIndex: 1,
                }}
              >
                <LinearGradient
                  colors={['#FFFFFF', 'rgba(135, 214, 210, 0.08)', 'rgba(28, 178, 169, 0)']}
                  start={{ x: 0.3, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  locations={[0.064, 0.5258, 1]}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: wp('4.3%'),
                    paddingVertical: wp('3%'),
                    gap: wp('3.2%'),
                  }}
                >
                  {/* Icon Container */}
                  <View style={{
                    width: wp('14.9%'),
                    height: wp('14.9%'),
                    borderRadius: wp('3.7%'),
                    backgroundColor: '#CCEFED',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <View style={{ width: wp('8.5%'), height: wp('8.5%'), opacity: 0.8, position: 'relative' }}>
                      {/* 2x2 grid dots */}
                      <View style={{ position: 'absolute', left: '12.5%', top: '12.5%', width: '37.5%', height: '37.5%', backgroundColor: '#1CB2A9', borderRadius: 1 }} />
                      <View style={{ position: 'absolute', right: '12.5%', top: '12.5%', width: '37.5%', height: '37.5%', backgroundColor: '#1CB2A9', borderRadius: 1 }} />
                      <View style={{ position: 'absolute', left: '12.5%', bottom: '12.5%', width: '37.5%', height: '37.5%', backgroundColor: '#1CB2A9', borderRadius: 1 }} />
                      <View style={{ position: 'absolute', right: '12.5%', bottom: '12.5%', width: '37.5%', height: '37.5%', backgroundColor: '#1CB2A9', borderRadius: 1 }} />
                    </View>
                  </View>

                  {/* Stats Section */}
                  <View style={{ flex: 1 }}>
                    {/* Year + Projects row */}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
                      <View style={{ width: wp('14.1%'), marginRight: wp('5%') }}>
                        <Text style={{ fontWeight: '700', color: '#101828', fontSize: wp('2.9%') }}>
                          {item.developer?.estd || '2024'}
                        </Text>
                        <Text style={{ fontWeight: '400', color: '#6A7282', fontSize: wp('2.5%') }}>
                          Year estd.
                        </Text>
                      </View>
                      <View style={{ width: wp('11.5%') }}>
                        <Text style={{ fontWeight: '700', color: '#101828', fontSize: wp('2.9%') }}>
                          {item.developer?.projects || '1'}
                        </Text>
                        <Text style={{ fontWeight: '400', color: '#6A7282', fontSize: wp('2.5%') }}>
                          Projects
                        </Text>
                      </View>
                    </View>

                    {/* Developer Name */}
                    <Text
                      numberOfLines={1}
                      style={{ fontWeight: '700', color: '#101828', fontSize: wp('3.2%') }}
                    >
                      {item.developer?.name ? String(item.developer.name) : 'Developer'}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Property Card */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => item.property?.id && router.push({ pathname: '/screens/ProjectDetails', params: { projectId: item.property.id } })}
                style={{
                  marginTop: hp('1.2%'),
                  borderRadius: wp('4%'),
                  width: wp('64%'),
                  height: hp('16.8%'),
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: hp('0.4%') },
                  shadowOpacity: 0.08,
                  shadowRadius: wp('1.1%'),
                  elevation: 5,
                }}
              >
                <ImageBackground
                  source={{ uri: item.property?.image }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.8)']}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                    locations={[0, 0.5, 1]}
                  />

                  <View style={{
                    position: 'absolute',
                    width: wp('55.4%'),
                    left: wp('4.3%'),
                    top: hp('6.2%'),
                    bottom: wp('3%'),
                  }}>
                    <Text
                      numberOfLines={1}
                      style={{ fontWeight: '700', color: '#fff', fontSize: wp('3.2%'), marginBottom: 2 }}
                    >
                      {item.property?.title ? String(item.property.title) : ''}
                    </Text>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ fontWeight: '400', color: 'rgba(255,255,255,0.9)', fontSize: wp('2.6%'), marginBottom: 2 }}
                    >
                      {formatPropertyDisplayLocation(item.property)}
                    </Text>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ fontWeight: '400', color: 'rgba(255,255,255,0.8)', fontSize: wp('2.4%'), marginBottom: 4 }}
                    >
                      {formatPropertyConfig(item.property?.config)}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{ fontWeight: '700', color: '#fff', fontSize: wp('3.2%') }}
                    >
                      {item.property?.priceRange ? String(item.property.priceRange) : ''}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>

            </View>
          )) : (
            <Text style={{ fontWeight: '400', color: '#6A7282', fontSize: wp('3.5%'), marginLeft: wp('1.1%') }}>
              No spotlight projects available right now.
            </Text>
          )}
        </ScrollView>

        {/* Triangle indicator */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            zIndex: 10,
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
