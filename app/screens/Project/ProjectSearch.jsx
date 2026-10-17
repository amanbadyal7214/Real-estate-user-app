import * as Location from 'expo-location';
import { router } from 'expo-router';
import { ArrowLeft, Building2, ChevronRight, LayoutGrid, MapPin, Search, Star, Target, TrendingUp } from 'lucide-react-native';
import { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../api';
import { useLocation } from '../../context/LocationContext';
import { useProject } from '../../../hooks/useProject';
import { formatPrice } from '../../utils/formatPrice';

const ProjectSearch = () => {
  const { currentLocation, updateLocation } = useLocation();
  const [city, setCity] = useState(currentLocation?.city || "");
  const [locality, setLocality] = useState(currentLocation?.locality || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingCurrentLocation, setLoadingCurrentLocation] = useState(false);

  const { fetchProjects, fetchDevelopers } = useProject();
  const [topDevelopers, setTopDevelopers] = useState([]);
  const [trendingProjects, setTrendingProjects] = useState([]);

  useEffect(() => {
    const loadTopDevelopers = async () => {
      try {
        const selectedCity = city.trim() || currentLocation?.city || "Mohali";
        const res = await fetchDevelopers({ city: selectedCity, limit: 5 });
        let devsList = [];
        if (Array.isArray(res)) {
          devsList = res;
        } else if (res) {
          devsList = res.data || res.builders || res.results || [];
        }
        
        const mapped = devsList.map(dev => ({
          id: dev._id || dev.id,
          name: dev.builderInfo?.name || dev.name || dev.builderName || 'Developer',
          projects: dev.projectCount || dev.projectsCount || dev.totalProjects || dev.projects?.length || 0,
          initial: (dev.builderInfo?.name || dev.name || dev.builderName || 'D').charAt(0).toUpperCase()
        }));
        setTopDevelopers(mapped);
      } catch (err) {
        console.error("Error loading top developers:", err);
        setTopDevelopers([]);
      }
    };

    loadTopDevelopers();
  }, [city, currentLocation?.city, fetchDevelopers]);

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

        const mapped = projectsList.map(project => {
          let priceDisplay = 'Price on request';
          
          if (project.minPrice && project.maxPrice) {
            priceDisplay = `${formatPrice(project.minPrice)} - ${formatPrice(project.maxPrice)}`;
          } else if (project.minPrice) {
            priceDisplay = formatPrice(project.minPrice);
          } else if (project.priceRange) {
             priceDisplay = project.priceRange;
          } else if (project.price) {
             priceDisplay = typeof project.price === 'number' ? formatPrice(project.price) : project.price;
          }

          return {
            id: project._id || project.id,
            name: project.projectName || project.title,
            location: project.addressLine1 || project.locality || selectedCity,
            price: priceDisplay,
            image: project.images?.[0] || project.media?.[0]?.fileUrl || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=400'
          };
        });
        setTrendingProjects(mapped);
      } catch (err) {
        console.error("Error loading trending projects:", err);
        setTrendingProjects([]);
      }
    };

    loadTrendingProjects();
  }, [city, currentLocation?.city, fetchProjects]);

  useEffect(() => {
    const searchLocalities = async () => {
      try {
        setLoadingSuggestions(true);
        const response = await api.get(`/localities`, {
          params: { city: city || currentLocation?.city || 'Mohali' }
        });
        
        if (response.data?.success) {
          const filtered = response.data.data.filter(item => 
            item.name.toLowerCase().includes(locality.toLowerCase()) ||
            (item.label || '').toLowerCase().includes(locality.toLowerCase())
          );
          setSuggestions(filtered);
        }
      } catch (err) {
        console.error("Error searching localities:", err);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const timer = setTimeout(() => {
      if (locality.trim().length > 1) {
        searchLocalities();
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [locality, city, currentLocation?.city]);

  const handleLocalitySelect = (localityName) => {
    const selectedCity = city || currentLocation?.city || "Mohali";
    updateLocation({
      city: selectedCity,
      locality: localityName,
      display: `${localityName}, ${selectedCity}`
    });
    router.replace({
      pathname: '/screens/Project/ProjectMatchedHome',
      params: { city: selectedCity, locality: localityName }
    });
  };

  const handleSearchSubmit = () => {
    const finalCity = city.trim() || currentLocation?.city || "Mohali";
    const finalLocality = locality.trim();
    
    updateLocation({
      city: finalCity,
      locality: finalLocality,
      display: finalLocality ? `${finalLocality}, ${finalCity}` : finalCity
    });
    router.replace({
      pathname: '/screens/Project/ProjectMatchedHome',
      params: { city: finalCity, locality: finalLocality }
    });
  };

  const handleExploreNearby = () => {
    const nearbyCity = currentLocation?.city || city.trim() || "Mohali";
    const nearbyLocality = currentLocation?.locality || "";

    updateLocation({
      city: nearbyCity,
      locality: nearbyLocality,
      display: nearbyLocality ? `${nearbyLocality}, ${nearbyCity}` : nearbyCity
    });
    router.replace({
      pathname: '/screens/Project/ProjectMatchedHome',
      params: { city: nearbyCity, locality: nearbyLocality }
    });
  };

  const handleUseCurrentLocation = async () => {
    try {
      setLoadingCurrentLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoadingCurrentLocation(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const geo = reverseGeocode[0];
        const detectedCity = geo.city || geo.district || geo.subregion || 'Mohali';
        const detectedLocality = geo.name || geo.street || geo.subdistrict || '';

        setCity(detectedCity);
        setLocality(detectedLocality);
        updateLocation({
          city: detectedCity,
          locality: detectedLocality,
          pincode: geo.postalCode,
          display: detectedLocality ? `${detectedLocality}, ${detectedCity}` : detectedCity,
        });
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setLoadingCurrentLocation(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center justify-between" style={{ paddingHorizontal: wp('3.5%'), paddingVertical: hp('1.2%') }}>
        <View className="flex-row items-center" style={{ gap: wp('2.5%') }}>
          <TouchableOpacity
            onPress={() => router.replace('/screens/Project/Project')}
            className="items-center justify-center rounded-full border border-gray-100"
            style={{ width: wp('9%'), height: wp('9%') }}
          >
            <ArrowLeft size={wp('4.5%')} color="#101828" />
          </TouchableOpacity>
          <Text style={{ fontWeight: '700', fontSize: wp('4%') }} className="text-[#101828]">Project</Text>
        </View>

        <View
          className="flex-row items-center bg-gray-50/50 border border-gray-100"
          style={{ paddingHorizontal: wp('2.5%'), paddingVertical: hp('0.5%'), borderRadius: wp('2.7%'), gap: wp('1.6%') }}
        >
          <MapPin size={wp('3.2%')} color="#008E96" />
          <Text style={{ fontWeight: '500', fontSize: wp('3.2%') }} className="text-[#4A5565]">
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
                style={{ fontWeight: '500', fontSize: wp('3.2%'), marginLeft: wp('2.5%') }}
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
                  placeholder="Locality, Landmark, Project..."
                  placeholderTextColor="#6A7282"
                  style={{ fontWeight: '500', fontSize: wp('3.2%'), marginLeft: wp('2.5%') }}
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
                        <Text style={{ fontWeight: '500', fontSize: wp('3.2%') }} className="text-[#101828]">
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
                <Text style={{ fontWeight: '700', fontSize: wp('3.4%') }} className="text-white">Search Projects</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Use Current Location */}
        <TouchableOpacity
          onPress={handleUseCurrentLocation}
          disabled={loadingCurrentLocation}
          className="flex-row items-center border-b border-[#E4E7EC]"
          style={{ marginHorizontal: wp('3.5%'), paddingVertical: hp('1.5%'), gap: wp('2%') }}
        >
          {loadingCurrentLocation ? (
            <ActivityIndicator size="small" color="#008E96" />
          ) : (
            <Target size={wp('4.5%')} color="#008E96" />
          )}
          <Text style={{ fontWeight: '500', fontSize: wp('3.4%') }} className="text-[#008E96]">
            {loadingCurrentLocation ? 'Detecting location...' : 'Use my current location'}
          </Text>
        </TouchableOpacity>

        {/* Top Developers Section */}
        <View className="bg-[#F1FFFE]" style={{ marginHorizontal: wp('3.5%'), marginTop: hp('1.5%'), padding: wp('3.5%'), borderRadius: wp('4.8%') }}>
          <View className="flex-row items-center" style={{ gap: wp('1.8%'), marginBottom: hp('1%') }}>
            <Star size={wp('3.7%')} color="#101828" />
            <Text style={{ fontWeight: '500', fontSize: wp('3.7%') }} className="text-[#101828]">Top developers</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {(topDevelopers.length > 0 ? topDevelopers : [
              { id: '1', name: 'Bajwa Group', projects: 17, initial: 'B' },
              { id: '2', name: 'Janta Land Prom...', projects: 9, initial: 'J' },
            ]).map((dev) => (
              <TouchableOpacity 
                key={dev.id} 
                className="flex-row items-center bg-white border border-[#E4E7EC] shadow-sm"
                style={{ width: wp('45%'), padding: wp('2.8%'), marginRight: wp('2.8%'), borderRadius: wp('3.8%'), gap: wp('2.5%') }}
              >
                <View 
                  className="rounded-full bg-[#F3F4F6] justify-center items-center"
                  style={{ width: wp('8%'), height: wp('8%') }}
                >
                  <Text style={{ fontWeight: '700', fontSize: wp('3.4%') }} className="text-[#6A7282]">{dev.initial}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '500', fontSize: wp('3.4%'), marginBottom: hp('0.2%') }} className="text-[#101828]" numberOfLines={1}>{dev.name}</Text>
                  <Text style={{ fontWeight: '400', fontSize: wp('3%') }} className="text-[#6A7282]">{dev.projects} projects</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trending Projects Section */}
        <View style={{ marginTop: hp('3%'), marginBottom: hp('2.5%') }}>
          <View className="flex-row items-center" style={{ paddingHorizontal: wp('3.5%'), gap: wp('1.8%'), marginBottom: hp('1.5%') }}>
            <Building2 size={wp('3.7%')} color="#101828" />
            <Text style={{ fontWeight: '500', fontSize: wp('3.7%') }} className="text-[#101828]">Trending projects</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row" style={{ paddingHorizontal: wp('3.5%') }}>
            {(trendingProjects.length > 0 ? trendingProjects : [
              { id: '1', name: 'Amayra Skycity', location: 'Daun Majra, Mohali', price: '₹5.99k/ sq.ft.' },
              { id: '2', name: 'Hero Homes', location: 'Sector 88, Mohali', price: '₹8.81k/ sq.ft.' },
            ]).map((project) => (
              <TouchableOpacity 
                key={project.id} 
                className="bg-white border border-[#E4E7EC] overflow-hidden shadow-sm"
                style={{ width: wp('39%'), marginRight: wp('2.8%'), borderRadius: wp('3.8%'), padding: wp('2.8%') }}
              >
                <Text style={{ fontWeight: '500', fontSize: wp('3.2%') }} className="text-[#101828]" numberOfLines={1}>{project.name}</Text>
                <Text style={{ fontWeight: '400', fontSize: wp('2.8%'), marginTop: hp('0.2%'), marginBottom: hp('0.8%') }} className="text-[#6A7282]" numberOfLines={1}>{project.location}</Text>
                <View className="bg-[#E4E7EC]" style={{ height: 1, marginBottom: hp('0.8%') }} />
                <Text style={{ fontWeight: '700', fontSize: wp('3%') }} className="text-[#101828]" numberOfLines={1}>{project.price}</Text>
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
            <Text style={{ fontWeight: '500', fontSize: wp('3.4%') }} className="text-[#101828]">Explore nearby properties</Text>
          </View>
          <ChevronRight size={wp('4.5%')} color="#008E96" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProjectSearch;