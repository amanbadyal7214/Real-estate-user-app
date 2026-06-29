import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, LayoutGrid, MapPin, Search, TrendingUp } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalityAveragePrice } from '../../../hooks/useLocalityAveragePrice';
import { useProject } from '../../../hooks/useProject';
import api from '../../api';
import { useLocation } from '../../context/LocationContext';
import { formatPricePerSqft } from '../../utils/formatPrice';

const CommercialSearch = () => {
  const { currentLocation, updateLocation } = useLocation();
  const [city, setCity] = useState(currentLocation?.city || "");
  const [locality, setLocality] = useState(currentLocation?.locality || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const { fetchAveragePriceByCity } = useLocalityAveragePrice();
  const [popularLocalities, setPopularLocalities] = useState([]);

  const { fetchProjects } = useProject();
  const [trendingProjects, setTrendingProjects] = useState([]);

  useEffect(() => {
    const loadTrendingProjects = async () => {
      try {
        const selectedCity = city.trim() || currentLocation?.city || "Mohali";
        const res = await fetchProjects({ city: selectedCity, limit: 5 });
        let projectsList = [];
        if (Array.isArray(res)) {
          projectsList = res;
        } else if (res) {
          projectsList = res.data || res.projects || res.results || [];
        }

        const mapped = projectsList.map(project => ({
          id: project._id || project.id,
          name: project.projectName || project.title,
          area: project.addressLine1 || project.locality || selectedCity,
          price: project.priceRange || project.price || 'Price on request',
          image: project.images?.[0] || project.media?.[0]?.fileUrl || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=400'
        }));
        setTrendingProjects(mapped);
      } catch (err) {
        console.error("Error loading trending projects:", err);
        setTrendingProjects([]);
      }
    };

    loadTrendingProjects();
  }, [city, currentLocation?.city, fetchProjects]);

  useEffect(() => {
    const loadPopularLocalities = async () => {
      try {
        const selectedCity = city.trim() || currentLocation?.city || "Mohali";
        const res = await fetchAveragePriceByCity(selectedCity);
        if (res?.success && Array.isArray(res.data)) {
          const mapped = res.data.map(item => ({
            name: item.localityName || item.locality,
            price: item.averagePricePerSqft ? formatPricePerSqft(item.averagePricePerSqft) : 'Price on request'
          }));
          setPopularLocalities(mapped);
        } else {
          setPopularLocalities([]);
        }
      } catch (err) {
        console.error("Error loading popular localities:", err);
        setPopularLocalities([]);
      }
    };

    loadPopularLocalities();
  }, [city, currentLocation?.city, fetchAveragePriceByCity]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (locality.trim().length > 1) {
        searchLocalities();
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [locality]);

  const searchLocalities = async () => {
    try {
      setLoadingSuggestions(true);
      const response = await api.get(`/localities`, {
        params: { city: city || currentLocation?.city || 'Mohali' }
      });

      if (response.data?.success) {
        const filtered = response.data.data.filter(item =>
          item.name.toLowerCase().includes(locality.toLowerCase()) ||
          item.label.toLowerCase().includes(locality.toLowerCase())
        );
        setSuggestions(filtered);
      }
    } catch (err) {
      console.error("Error searching localities:", err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleLocalitySelect = (localityName) => {
    const selectedCity = city || currentLocation?.city || "Mohali";
    updateLocation({
      city: selectedCity,
      locality: localityName,
      display: `${localityName}, ${selectedCity}`
    });
    router.replace('/screens/Commercial/Commercial');
  };

  const handleSearchSubmit = () => {
    const finalCity = city.trim() || currentLocation?.city || "Mohali";
    const finalLocality = locality.trim();

    updateLocation({
      city: finalCity,
      locality: finalLocality,
      display: finalLocality ? `${finalLocality}, ${finalCity}` : finalCity
    });
    router.replace('/screens/Commercial/Commercial');
  };

  const handleExploreNearby = () => {
    const nearbyCity = currentLocation?.city || city.trim() || "Mohali";
    const nearbyLocality = currentLocation?.locality || "";

    updateLocation({
      city: nearbyCity,
      locality: nearbyLocality,
      display: nearbyLocality ? `${nearbyLocality}, ${nearbyCity}` : nearbyCity
    });
    router.replace('/screens/Commercial/Commercial');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between" style={{ paddingHorizontal: wp('3.5%'), paddingVertical: hp('1.2%') }}>
        <View className="flex-row items-center" style={{ gap: wp('2.5%') }}>
          <TouchableOpacity
            onPress={() => router.push('/screens/Commercial/Commercial')}
            className="items-center justify-center rounded-full border border-gray-100"
            style={{ width: wp('9%'), height: wp('9%') }}
          >
            <ArrowLeft size={wp('4.5%')} color="#101828" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('4%') }} className="text-[#101828]">Commercial</Text>
        </View>

        <View
          className="flex-row items-center bg-gray-50/50 border border-gray-100"
          style={{ paddingHorizontal: wp('2.5%'), paddingVertical: hp('0.5%'), borderRadius: wp('2.7%'), gap: wp('1.6%') }}
        >
          <MapPin size={wp('3.2%')} color="#008E96" />
          <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.2%') }} className="text-[#4A5565]">
            {currentLocation?.city || 'Mohali'}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Search Section */}
        <View className="bg-white border border-gray-100 shadow-sm" style={{ marginHorizontal: wp('3.5%'), marginVertical: hp('0.8%'), padding: wp('3.5%'), borderRadius: wp('4.8%') }}>
          <View style={{ gap: wp('2.5%') }}>
            {/* City Input */}
            <View className="flex-row items-center bg-[#F2F4F7]" style={{ height: hp('5%'), paddingHorizontal: wp('3.5%'), borderRadius: wp('2.7%') }}>
              <MapPin size={wp('4%')} color="#008E96" />
              <TextInput
                placeholder="Enter City"
                placeholderTextColor="#6A7282"
                style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.2%'), marginLeft: wp('2.5%') }}
                className="flex-1 text-[#101828]"
                value={city}
                onChangeText={setCity}
              />
            </View>

            {/* Locality Input */}
            <View style={{ zIndex: 50 }}>
              <View className="flex-row items-center bg-[#F2F4F7]" style={{ height: hp('5%'), paddingHorizontal: wp('3.5%'), borderRadius: wp('2.7%') }}>
                <Search size={wp('4%')} color="#667085" />
                <TextInput
                  placeholder="Enter Locality"
                  placeholderTextColor="#6A7282"
                  style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.2%'), marginLeft: wp('2.5%') }}
                  className="flex-1 text-[#101828]"
                  value={locality}
                  onChangeText={(text) => {
                    setLocality(text);
                  }}
                  onSubmitEditing={handleSearchSubmit}
                />
                {loadingSuggestions && <ActivityIndicator size="small" color="#008E96" />}
              </View>

              {suggestions.length > 0 && (
                <View className="bg-white border border-gray-100 shadow-sm overflow-hidden" style={{ marginTop: hp('1%'), borderRadius: wp('2.7%'), maxHeight: hp('23.6%') }}>
                  <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                    {suggestions.map((item) => (
                      <TouchableOpacity
                        key={item._id}
                        onPress={() => {
                          setLocality(item.name);
                          setSuggestions([]);
                        }}
                        className="border-b border-gray-50 flex-row items-center"
                        style={{ paddingHorizontal: wp('3.5%'), paddingVertical: hp('1.1%'), gap: wp('1.8%') }}
                      >
                        <MapPin size={wp('3.2%')} color="#667085" />
                        <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.2%') }} className="text-[#101828]">
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Search Button */}
            <TouchableOpacity
              onPress={handleSearchSubmit}
              className="bg-[#008E96] items-center justify-center shadow-sm shadow-[#008E96]/20"
              style={{ height: hp('5%'), borderRadius: wp('2.7%'), marginTop: hp('0.5%') }}
            >
              <View className="flex-row items-center" style={{ gap: wp('1.8%') }}>
                <Search size={wp('4%')} color="white" />
                <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('3.4%') }} className="text-white">Search Properties</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Localities Section */}
        <View className="bg-[#EDFBFA]" style={{ marginHorizontal: wp('3.5%'), marginTop: hp('1.5%'), padding: wp('3.5%'), borderRadius: wp('4.8%') }}>
          <View className="flex-row items-center" style={{ gap: wp('1.8%'), marginBottom: hp('1%') }}>
            <TrendingUp size={wp('3.7%')} color="#008E96" />
            <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.7%') }} className="text-[#101828]">Popular Localities</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {(popularLocalities.length > 0 ? popularLocalities : [
              { name: 'Kharar', price: '₹6.2K/sq.ft.' },
              { name: 'Aerocity', price: '₹7.5K/sq.ft.' },
              { name: 'Sector 62', price: '₹8.9K/sq.ft.' },
              { name: 'Sector 116', price: '₹5.4K/sq.ft.' },
            ]).map((loc, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleLocalitySelect(loc.name)}
                className="bg-[#F7F9FA] border border-[#E4E7EC] shadow-sm"
                style={{ width: wp('32%'), padding: wp('2.8%'), marginRight: wp('2.8%'), borderRadius: wp('3.8%') }}
              >
                <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.4%'), marginBottom: hp('0.3%') }} className="text-[#101828]" numberOfLines={1}>{loc.name}</Text>
                <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3%') }} className="text-[#6A7282]">{loc.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trending Projects Section */}
        <View style={{ marginTop: hp('3%'), marginBottom: hp('2.5%') }}>
          <View className="flex-row items-center" style={{ paddingHorizontal: wp('3.5%'), gap: wp('1.8%'), marginBottom: hp('1.5%') }}>
            <LayoutGrid size={wp('3.7%')} color="#008E96" />
            <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.7%') }} className="text-[#101828]">Trending Projects</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row" style={{ paddingHorizontal: wp('3.5%') }}>
            {(trendingProjects.length > 0 ? trendingProjects : [
              { name: 'STJ Mohali Citi Centre 3', area: 'Gmada Aerocity, Mohali', price: 'Price On Request', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400' },
              { name: 'Icon Downtown Mohali', area: 'Sector 62, Mohali', price: 'Price On Request', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400' },
              { name: 'Emaar Mohali Hills', area: 'Sector 105, Mohali', price: 'Price On Request', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400' },
            ]).map((project, index) => (
              <TouchableOpacity
                key={project.id || index}
                onPress={() => project.id && router.push({ pathname: '/screens/ProjectDetails', params: { projectId: project.id } })}
                className="bg-white border border-[#E4E7EC] overflow-hidden shadow-sm"
                style={{ width: wp('39%'), marginRight: wp('2.8%'), borderRadius: wp('3.8%') }}
              >
                <View className="w-full bg-gray-100" style={{ height: hp('10%') }}>
                  <Image
                    source={{ uri: project.image }}
                    className="w-full h-full"
                  />
                </View>
                <View style={{ padding: wp('2.8%') }}>
                  <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.2%') }} className="text-[#101828]" numberOfLines={1}>{project.name}</Text>
                  <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('2.8%'), marginTop: hp('0.2%') }} className="text-[#6A7282]" numberOfLines={1}>{project.area}</Text>
                  <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('3%'), marginTop: hp('0.8%') }} className="text-[#008E96]" numberOfLines={1}>{project.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Explore Nearby Properties Button */}
        <TouchableOpacity
          onPress={handleExploreNearby}
          className="flex-row items-center justify-between bg-[#008E96]/10 border border-[#008E96]/20"
          style={{ marginHorizontal: wp('3.5%'), marginBottom: hp('4%'), padding: wp('3.5%'), borderRadius: wp('3.8%') }}
        >
          <View className="flex-row items-center" style={{ gap: wp('2.5%') }}>
            <View className="bg-white items-center justify-center rounded-full border border-gray-100" style={{ width: wp('8%'), height: wp('8%') }}>
              <ArrowLeft size={wp('3.7%')} color="#008E96" style={{ transform: [{ rotate: '180deg' }] }} />
            </View>
            <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.4%') }} className="text-[#101828]">Explore nearby properties</Text>
          </View>
          <ChevronRight size={wp('4.5%')} color="#008E96" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CommercialSearch;
