import { router } from 'expo-router';
import { ArrowLeft, Building2, ChevronRight, MapPin, Search, Star } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import api from '../../api';
import { useLocation } from '../../context/LocationContext';

const ProjectSearch = () => {
  const { currentLocation, updateLocation } = useLocation();
  const [city, setCity] = useState(currentLocation?.city || "");
  const [locality, setLocality] = useState(currentLocation?.locality || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const topDevelopers = [
    { id: 1, name: 'Bajwa Group', projects: 17, initial: 'B' },
    { id: 2, name: 'Janta Land Prom...', projects: 9, initial: 'J' },
  ];

  const trendingProjects = [
    { id: 1, name: 'Amayra Skycity', location: 'Daun Majra, Mohali', price: '₹5.99k/ sq.ft.' },
    { id: 2, name: 'Hero Homes', location: 'Sector 88, Mohali', price: '₹8.81k/ sq.ft.' },
  ];

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

  const handleSearchSubmit = () => {
    const finalCity = city.trim() || currentLocation?.city || "Mohali";
    const finalLocality = locality.trim();
    
    updateLocation({
      city: finalCity,
      locality: finalLocality,
      display: finalLocality ? `${finalLocality}, ${finalCity}` : finalCity
    });
    router.replace('/screens/Project/Project');
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View 
        className="flex-row justify-between items-center"
        style={{
          paddingHorizontal: wp('4.3%'),
          paddingVertical: hp('1.5%'),
          height: hp('7.5%'),
        }}
      >
        <View className="flex-row items-center" style={{ gap: wp('3.2%') }}>
          <TouchableOpacity 
            onPress={() => router.replace('/screens/Project/Project')} 
            className="justify-center items-center"
            style={{
              width: wp('9.6%'),
              height: wp('9.6%'),
              borderRadius: wp('4.8%'),
            }}
          >
            <ArrowLeft size={wp('5.3%')} color="#101828" />
          </TouchableOpacity>
          <Text 
            style={{ fontFamily: 'Inter-Bold', fontSize: wp('4.8%') }} 
            className="text-[#101828]"
          >
            Project
          </Text>
        </View>
        <TouchableOpacity className="flex-row items-center" style={{ gap: wp('1.6%') }}>
          <MapPin size={wp('4.3%')} color="#008E96" />
          <Text 
            style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.7%') }} 
            className="text-[#4A5565]"
          >
            {currentLocation?.city || 'Mohali'}
          </Text>
          <ChevronRight size={wp('4.3%')} color="#6A7282" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: hp('3%') }}
      >
        {/* Search Section */}
        <View style={{ paddingHorizontal: wp('4.3%'), paddingTop: hp('1.5%'), marginBottom: hp('2.5%') }}>
          <View style={{ gap: hp('1.5%') }}>
            {/* City Input */}
            <View 
              className="flex-row items-center bg-[#F2F4F7]"
              style={{
                height: hp('6%'),
                paddingHorizontal: wp('4.3%'),
                borderRadius: wp('3.2%'),
              }}
            >
              <MapPin size={wp('4.8%')} color="#008E96" />
              <TextInput 
                placeholder="Enter City"
                placeholderTextColor="#6A7282"
                style={{ fontFamily: 'Inter-Medium', marginLeft: wp('3.2%'), fontSize: wp('3.7%') }}
                className="flex-1 text-[#101828]"
                value={city}
                onChangeText={setCity}
              />
            </View>

            {/* Locality Input */}
            <View style={{ zIndex: 50 }}>
              <View 
                className="flex-row items-center bg-[#F2F4F7]"
                style={{
                  height: hp('6%'),
                  paddingHorizontal: wp('4.3%'),
                  borderRadius: wp('3.2%'),
                }}
              >
                <Search size={wp('4.8%')} color="#667085" />
                <TextInput 
                  placeholder="Locality, Landmark, Project..."
                  placeholderTextColor="#6A7282"
                  style={{ fontFamily: 'Inter-Medium', marginLeft: wp('3.2%'), fontSize: wp('3.7%') }}
                  className="flex-1 text-[#101828]"
                  value={locality}
                  onChangeText={setLocality}
                  onSubmitEditing={handleSearchSubmit}
                />
                {loadingSuggestions && <ActivityIndicator size="small" color="#008E96" />}
              </View>

              {suggestions.length > 0 && (
                <View 
                  className="bg-white border border-gray-100 shadow-sm overflow-hidden"
                  style={{
                    marginTop: hp('1%'),
                    borderRadius: wp('3.2%'),
                    maxHeight: hp('24%'),
                  }}
                >
                  <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                    {suggestions.map((item) => (
                      <TouchableOpacity 
                        key={item._id}
                        onPress={() => {
                          setLocality(item.name);
                          setSuggestions([]);
                        }}
                        className="border-b border-gray-50 flex-row items-center"
                        style={{
                          paddingHorizontal: wp('4.3%'),
                          paddingVertical: hp('1.5%'),
                          gap: wp('2.1%'),
                        }}
                      >
                        <MapPin size={wp('3.7%')} color="#667085" />
                        <Text 
                          style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.7%') }} 
                          className="text-[#101828]"
                        >
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
              style={{
                height: hp('6%'),
                borderRadius: wp('3.2%'),
                marginTop: hp('0.5%'),
              }}
            >
              <View className="flex-row items-center" style={{ gap: wp('2.1%') }}>
                <Search size={wp('4.8%')} color="white" />
                <Text 
                  style={{ fontFamily: 'Inter-Bold', fontSize: wp('4%') }} 
                  className="text-white"
                >
                  Search Projects
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Top Developers Section */}
        <View 
          className="bg-[#F1FFFE]"
          style={{
            marginHorizontal: wp('3.2%'),
            padding: wp('4.3%'),
            borderRadius: wp('4.3%'),
            marginBottom: hp('2.5%'),
          }}
        >
          <View className="flex-row items-center" style={{ gap: wp('2.1%'), marginBottom: hp('2%') }}>
            <Star size={wp('5.3%')} color="#101828" />
            <Text 
              style={{ fontFamily: 'Inter-Medium', fontSize: wp('4.5%') }} 
              className="text-[#101828]"
            >
              Top developers
            </Text>
          </View>
          <View className="flex-row" style={{ gap: wp('3.2%') }}>
            {topDevelopers.map((dev) => (
              <TouchableOpacity 
                key={dev.id} 
                className="flex-1 flex-row items-center bg-white border-[0.67px] border-[#E4E7EC]"
                style={{
                  padding: wp('3.2%'),
                  borderRadius: wp('3.2%'),
                  height: hp('9.5%'),
                  gap: wp('3.2%'),
                }}
              >
                <View 
                  className="rounded-full bg-[#F3F4F6] justify-center items-center"
                  style={{ width: wp('10.7%'), height: wp('10.7%'), borderRadius: wp('5.3%') }}
                >
                  <Text 
                    style={{ fontFamily: 'Inter-Bold', fontSize: wp('4.3%') }} 
                    className="text-[#6A7282]"
                  >
                    {dev.initial}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text 
                    style={{ fontFamily: 'Inter-Medium', fontSize: wp('4%'), lineHeight: hp('2.5%') }} 
                    className="text-[#101828]" 
                    numberOfLines={2}
                  >
                    {dev.name}
                  </Text>
                  <Text 
                    style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.5%') }} 
                    className="text-[#6A7282]"
                  >
                    {dev.projects} projects
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trending Projects Section */}
        <View 
          className="bg-[#EDFBFA]"
          style={{
            marginHorizontal: wp('4.3%'),
            padding: wp('4.3%'),
            borderRadius: wp('4.3%'),
            marginBottom: hp('2.5%'),
          }}
        >
          <View className="flex-row items-center" style={{ gap: wp('2.1%'), marginBottom: hp('2%') }}>
            <Building2 size={wp('5.3%')} color="#101828" />
            <Text 
              style={{ fontFamily: 'Inter-Medium', fontSize: wp('4.5%') }} 
              className="text-[#101828]"
            >
              Trending projects
            </Text>
          </View>
          <View className="flex-row" style={{ gap: wp('3.2%') }}>
            {trendingProjects.map((project) => (
              <TouchableOpacity 
                key={project.id} 
                className="flex-1 bg-white border-[0.67px] border-[#E4E7EC]"
                style={{
                  padding: wp('4%'),
                  borderRadius: wp('3.2%'),
                  height: hp('15.5%'),
                }}
              >
                <Text 
                  style={{ fontFamily: 'Inter-Medium', fontSize: wp('4%'), marginBottom: hp('0.5%') }} 
                  className="text-[#101828]"
                >
                  {project.name}
                </Text>
                <Text 
                  style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.5%'), marginBottom: hp('1%') }} 
                  className="text-[#6A7282]"
                >
                  {project.location}
                </Text>
                <View 
                  className="bg-[#E4E7EC]" 
                  style={{ height: 1, marginBottom: hp('1%') }}
                />
                <Text 
                  style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.7%') }} 
                  className="text-[#101828]"
                >
                  {project.price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Explore Nearby Properties Button */}
        <TouchableOpacity 
          onPress={() => router.replace('/screens/Project/Project')}
          className="flex-row items-center justify-between bg-[#008E96]/10 border border-[#008E96]/20"
          style={{
            marginHorizontal: wp('4.3%'),
            marginBottom: hp('5%'),
            padding: wp('4.3%'),
            borderRadius: wp('4.3%'),
          }}
        >
          <View className="flex-row items-center" style={{ gap: wp('3.2%') }}>
            <View 
              className="bg-white items-center justify-center rounded-full border border-gray-100"
              style={{
                width: wp('9.6%'),
                height: wp('9.6%'),
                borderRadius: wp('4.8%'),
              }}
            >
              <ArrowLeft size={wp('4.3%')} color="#008E96" style={{ transform: [{ rotate: '180deg'}] }} />
            </View>
            <Text 
              style={{ fontFamily: 'Inter-Medium', fontSize: wp('4%') }} 
              className="text-[#101828]"
            >
              Explore nearby properties
            </Text>
          </View>
          <ChevronRight size={wp('5.3%')} color="#008E96" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProjectSearch;