import { router } from 'expo-router';
import { ArrowLeft, Building2, ChevronRight, MapPin, Search, Star } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      <View className="flex-row justify-between items-center px-4 py-3 h-[60px]">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity 
            onPress={() => router.replace('/screens/Project/Project')} 
            className="w-9 h-9 rounded-full justify-center items-center"
          >
            <ArrowLeft size={20} color="#101828" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[18px] text-[#101828]">Project</Text>
        </View>
        <TouchableOpacity className="flex-row items-center gap-1.5">
          <MapPin size={16} color="#008E96" />
          <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[14px] text-[#4A5565]">{currentLocation?.city || 'Mohali'}</Text>
          <ChevronRight size={16} color="#6A7282" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Search Section */}
        <View className="px-4 pt-3 mb-5">
          <View className="gap-3">
            {/* City Input */}
            <View className="h-12 px-4 flex-row items-center bg-[#F2F4F7] rounded-xl">
              <MapPin size={18} color="#008E96" />
              <TextInput 
                placeholder="Enter City"
                placeholderTextColor="#6A7282"
                style={{ fontFamily: 'Inter-Medium' }}
                className="flex-1 ml-3 text-[14px] text-[#101828]"
                value={city}
                onChangeText={setCity}
              />
            </View>

            {/* Locality Input */}
            <View style={{ zIndex: 50 }}>
              <View className="h-12 px-4 flex-row items-center bg-[#F2F4F7] rounded-xl">
                <Search size={18} color="#667085" />
                <TextInput 
                  placeholder="Locality, Landmark, Project..."
                  placeholderTextColor="#6A7282"
                  style={{ fontFamily: 'Inter-Medium' }}
                  className="flex-1 ml-3 text-[14px] text-[#101828]"
                  value={locality}
                  onChangeText={setLocality}
                  onSubmitEditing={handleSearchSubmit}
                />
                {loadingSuggestions && <ActivityIndicator size="small" color="#008E96" />}
              </View>

              {suggestions.length > 0 && (
                <View className="mt-2 bg-white border border-gray-100 rounded-xl shadow-sm max-h-48 overflow-hidden">
                  <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                    {suggestions.map((item) => (
                      <TouchableOpacity 
                        key={item._id}
                        onPress={() => {
                          setLocality(item.name);
                          setSuggestions([]);
                        }}
                        className="px-4 py-3 border-b border-gray-50 flex-row items-center gap-2"
                      >
                        <MapPin size={14} color="#667085" />
                        <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[14px] text-[#101828]">
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
              className="h-12 bg-[#008E96] items-center justify-center rounded-xl mt-1 shadow-sm shadow-[#008E96]/20"
            >
              <View className="flex-row items-center gap-2">
                <Search size={18} color="white" />
                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white text-[15px]">Search Projects</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Top Developers Section */}
        <View className="m-3 p-4 bg-[#F1FFFE] rounded-[16px] mb-5">
          <View className="flex-row items-center gap-2 mb-4">
            <Star size={20} color="#101828" />
            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[17px] text-[#101828]">Top developers</Text>
          </View>
          <View className="flex-row gap-3">
            {topDevelopers.map((dev) => (
              <TouchableOpacity key={dev.id} className="flex-1 flex-row items-center p-3 bg-white border-[0.67px] border-[#E4E7EC] rounded-[12px] h-[76px] gap-3">
                <View className="w-10 h-10 rounded-full bg-[#F3F4F6] justify-center items-center">
                  <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[16px] text-[#6A7282]">{dev.initial}</Text>
                </View>
                <View className="flex-1">
                  <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[15px] text-[#101828] leading-[19px]" numberOfLines={2}>{dev.name}</Text>
                  <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[13px] text-[#6A7282]">{dev.projects} projects</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trending Projects Section */}
        <View className="mx-4 p-4 bg-[#EDFBFA] rounded-[16px] mb-5">
          <View className="flex-row items-center gap-2 mb-4">
            <Building2 size={20} color="#101828" />
            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[17px] text-[#101828]">Trending projects</Text>
          </View>
          <View className="flex-row gap-3">
            {trendingProjects.map((project) => (
              <TouchableOpacity key={project.id} className="flex-1 p-5 bg-white border-[0.67px] border-[#E4E7EC] rounded-[12px] h-[124px]">
                <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[15px] text-[#101828] mb-1">{project.name}</Text>
                <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[13px] text-[#6A7282] mb-2">{project.location}</Text>
                <View className="h-[1px] bg-[#E4E7EC] mb-2" />
                <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[14px] text-[#101828]">{project.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
  {/* Explore Nearby Properties Button */}
        <TouchableOpacity 
          onPress={() => router.replace('/screens/Project/Project')}
          className="mx-4 mb-10 p-4 flex-row items-center justify-between bg-[#008E96]/10 border border-[#008E96]/20 rounded-2xl"
        >
          <View className="flex-row items-center gap-3">
            <View className="w-9 h-9 bg-white items-center justify-center rounded-full border border-gray-100">
               <ArrowLeft size={16} color="#008E96" style={{ transform: [{ rotate: '180deg'}] }} />
            </View>
            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[15px] text-[#101828]">Explore nearby properties</Text>
          </View>
          <ChevronRight size={20} color="#008E96" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProjectSearch;