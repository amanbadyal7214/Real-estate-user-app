import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalityAveragePrice } from '../../hooks/useLocalityAveragePrice';
import { useLocation } from '../context/LocationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const formatPricePerSqft = (value) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 'N/A';
  if (numericValue >= 1000) {
    return `${(numericValue / 1000).toFixed(1)}k/sq.ft.`;
  }
  return `${numericValue.toFixed(2)}/sq.ft.`;
};

const formatLocalityName = (value, index) => {
  if (!value || typeof value !== 'string') return `Locality ${index + 1}`;
  const trimmedValue = value.trim();
  if (/^[a-f0-9]{24}$/i.test(trimmedValue)) return `Locality ${index + 1}`;
  return trimmedValue.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const ExploreLocalities = () => {
  const router = useRouter();
  const { currentLocation } = useLocation();
  const { fetchAveragePriceByCity, loading } = useLocalityAveragePrice();
  const [exploreLocalities, setExploreLocalities] = useState([]);

  const loadExploreLocalities = useCallback(async (city) => {
    try {
      const res = await fetchAveragePriceByCity(city || 'Mohali');
      if (res?.success) {
        setExploreLocalities(Array.isArray(res.data) ? res.data : []);
      } else {
        setExploreLocalities([]);
      }
    } catch (err) {
      console.error("Average price API Error:", err);
      setExploreLocalities([]);
    }
  }, [fetchAveragePriceByCity]);

  useEffect(() => {
    loadExploreLocalities(currentLocation?.city);
  }, [currentLocation?.city, loadExploreLocalities]);

  const localities = exploreLocalities.map((item, index) => ({
    id: item.locality || index,
    name: item.localityName || formatLocalityName(item.locality, index),
    price: formatPricePerSqft(item.averagePricePerSqft),
    location: item.city || currentLocation?.city || 'Mohali'
  }));

  const LocalityCard = ({ item, isHotspot = false }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      className="bg-white overflow-hidden"
      style={{
        borderRadius: wp('4%'),
        marginBottom: hp('2%'),
        width: isHotspot ? '100%' : wp('60%'),
        marginRight: isHotspot ? 0 : wp('3%'),
        shadowColor: "#008E96",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#F2F4F7'
      }}
    >
      {/* Visual Header */}
      <LinearGradient
        colors={['#F9FAFB', '#F2F4F7']}
        className="justify-center relative overflow-hidden"
        style={{ height: hp('8%'), paddingHorizontal: wp('3%') }}
      >
        <View style={{ position: 'absolute', right: -wp('2.5%'), top: -hp('1.2%'), opacity: 0.05 }}>
          <MaterialCommunityIcons name="city-variant-outline" size={wp('20%')} color="#008E96" />
        </View>
        <Text className="text-[#101828] font-bold tracking-tight" style={{ fontSize: wp('4%') }}>{item.name}</Text>
        <Text className="text-[#667085] font-normal" style={{ fontSize: wp('2.8%') }}>{item.location}</Text>
      </LinearGradient>

      {/* Content Section */}
      <View style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('1.5%') }}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[#98A2B3] font-medium uppercase tracking-wider" style={{ fontSize: wp('2.5%'), marginBottom: hp('0.3%') }}>Avg. Price</Text>
            <View className="flex-row items-center">
              <View className="bg-[#F0F9F9] rounded-full items-center justify-center" style={{ width: wp('5%'), height: wp('5%'), marginRight: wp('1.5%') }}>
                <FontAwesome5 name="rupee-sign" size={wp('2%')} color="#008E96" />
              </View>
              <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('3.5%') }}>{item.price}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className="flex-1 bg-[#F9FBFC]"
    >
      <StatusBar barStyle="light-content" />

      {/* Modern Gradient Header */}
      <LinearGradient
        colors={['#008E96', '#007A82']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="justify-center"
        style={{ paddingHorizontal: wp('5%'), borderBottomLeftRadius: wp('6%'), borderBottomRightRadius: wp('6%'), paddingTop: hp('2%'), paddingBottom: hp('2.5%') }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white/20 rounded-full items-center justify-center"
            style={{ width: wp('9%'), height: wp('9%') }}
          >
            <Ionicons name="chevron-back" size={wp('5%')} color="white" />
          </TouchableOpacity>

          <View className="items-center flex-1" style={{ paddingTop: hp('1%'), paddingRight: wp('9%') }}>
            <Text className="text-white font-bold" style={{ fontSize: wp('4%') }}>Explore Localities</Text>
            <Text className="text-white/80 font-normal" style={{ fontSize: wp('2.8%') }}>Premium Investment Zones in {currentLocation?.city || 'Mohali'}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1" style={{ marginTop: -hp('2%') }}>
        {/* Popular Section */}
        <View style={{ paddingTop: hp('1.2%') }}>
          <View className="flex-row items-center justify-between" style={{ paddingHorizontal: wp('5%'), marginBottom: hp('1.5%') }}>
            <View>
              <Text className="text-[#101828] font-bold" style={{ fontSize: wp('4.5%') }}>Popular Areas</Text>
              <View className="bg-[#008E96] rounded-full" style={{ height: hp('0.3%'), width: wp('6%'), marginTop: hp('0.3%') }} />
            </View>
            <TouchableOpacity>
              <Text className="text-[#008E96] font-semibold" style={{ fontSize: wp('3.3%') }}>See all</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={{ paddingVertical: hp('5%') }}>
              <ActivityIndicator color="#008E96" />
            </View>
          ) : localities.length > 0 ? (
            <ScrollView
              horizontal
              contentContainerStyle={{ paddingLeft: wp('5%'), paddingRight: wp('1%'), paddingBottom: hp('1%') }}
              showsHorizontalScrollIndicator={false}
            >
              {localities.map((item) => (
                <LocalityCard key={`popular-${item.id}`} item={item} />
              ))}
            </ScrollView>
          ) : (
            <View className="items-center" style={{ paddingHorizontal: wp('5%'), paddingVertical: hp('3%') }}>
              <Text className="text-gray-400 font-medium" style={{ fontSize: wp('3.5%') }}>No localities found for {currentLocation?.city}</Text>
            </View>
          )}
        </View>

        {/* Investment Hotspot Section */}
        <View style={{ marginTop: hp('3%'), paddingHorizontal: wp('5%'), marginBottom: hp('5%') }}>
          <View style={{ marginBottom: hp('2%') }}>
            <Text className="text-[#101828] font-bold" style={{ fontSize: wp('4.5%') }}>Investment Hotspots</Text>
            <Text className="text-[#667085] font-normal" style={{ fontSize: wp('3%'), marginTop: hp('0.3%') }}>Top performing localities this month</Text>
          </View>

          {loading ? (
            <View style={{ paddingVertical: hp('5%') }}>
              <ActivityIndicator color="#008E96" />
            </View>
          ) : localities.length > 0 ? (
            localities.slice(0, 3).map((item) => (
              <LocalityCard key={`hotspot-${item.id}`} item={item} isHotspot={true} />
            ))
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExploreLocalities;