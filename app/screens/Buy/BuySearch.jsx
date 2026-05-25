import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, LayoutGrid, MapPin, Search, TrendingUp } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../api';
import { useLocation } from '../../context/LocationContext';

const BuySearch = () => {
  const { currentLocation, updateLocation } = useLocation();
  const [city, setCity] = useState(currentLocation?.city || "");
  const [locality, setLocality] = useState(currentLocation?.locality || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

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
    router.back();
  };

  const handleSearchSubmit = () => {
    const finalCity = city.trim() || currentLocation?.city || "Mohali";
    const finalLocality = locality.trim();
    
    updateLocation({
      city: finalCity,
      locality: finalLocality,
      display: finalLocality ? `${finalLocality}, ${finalCity}` : finalCity
    });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 justify-between">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity 
            onPress={() => router.push('/screens/Buy/Buy')}
            className="w-10 h-10 items-center justify-center rounded-full border border-gray-100"
          >
            <ArrowLeft size={20} color="#101828" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[18px] text-[#101828]">Buy</Text>
        </View>

        <View 
          className="flex-row items-center bg-gray-50/50 px-3 py-1.5 rounded-xl border border-gray-100 gap-1.5"
        >
          <MapPin size={14} color="#008E96" />
          <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[14px] text-[#4A5565]">
            {currentLocation?.city || 'Mohali'}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Search Section */}
        <View className="mx-4 my-2 p-4 bg-white border border-gray-100 rounded-[24px] shadow-sm">
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
                  placeholder="Enter Locality"
                  placeholderTextColor="#6A7282"
                  style={{ fontFamily: 'Inter-Medium' }}
                  className="flex-1 ml-3 text-[14px] text-[#101828]"
                  value={locality}
                  onChangeText={(text) => {
                    setLocality(text);
                  }}
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
                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white text-[15px]">Search Properties</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Localities Section */}
        <View className="mx-4 mt-4 p-4 rounded-3xl bg-[#EDFBFA]">
          <View className="flex-row items-center gap-2 mb-3">
            <TrendingUp size={16} color="#008E96" />
            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[16px] text-[#101828]">Popular Localities</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {[
              { name: 'Kharar', price: '₹6.2K/sq.ft.' },
              { name: 'Zirakpur', price: '₹7.5K/sq.ft.' },
              { name: 'Sector 125', price: '₹8.9K/sq.ft.' },
              { name: 'Derabassi', price: '₹5.4K/sq.ft.' },
            ].map((locality, index) => (
              <TouchableOpacity 
                key={index}
                onPress={() => handleLocalitySelect(locality.name)}
                className="w-[140px] p-3 mr-3 bg-[#F7F9FA] border border-[#E4E7EC] rounded-2xl shadow-sm"
              >
                <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[15px] text-[#101828] mb-1">{locality.name}</Text>
                <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[13px] text-[#6A7282]">{locality.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Landmarks Section */}
        <View className="mt-6">
          <View className="flex-row items-center px-4 gap-2 mb-4">
            <MapPin size={16} color="#008E96" />
            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[16px] text-[#101828]">Popular Landmarks</Text>
          </View>
          
          <View className="flex-row flex-wrap px-4 gap-2">
            {[
              'City Heart', 'Maxim Merry School', 'Mohali Stadium', 
              'Phase 11 Market', 'ISB Campus'
            ].map((landmark, index) => (
              <TouchableOpacity 
                key={index}
                onPress={() => handleLocalitySelect(landmark)}
                className="flex-row items-center px-4 py-2.5 bg-white border border-[#E4E7EC] rounded-full gap-2"
              >
                <MapPin size={14} color="#008E96" />
                <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[13px] text-[#4A5565]">{landmark}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trending Projects Section */}
        <View className="mt-8 mb-6">
          <View className="flex-row items-center px-4 gap-2 mb-4">
            <LayoutGrid size={16} color="#008E96" />
            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[16px] text-[#101828]">Trending Projects</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row px-4">
            {[
              { name: 'Woodland Heights', area: 'Sambalki, Mohali', price: '₹7.8K/sq.ft.' },
              { name: 'Green Valley', area: 'Sector 117, Mohali', price: '₹9.2K/sq.ft.' },
              { name: 'Palm Residency', area: 'Kharar Road', price: '₹6.5K/sq.ft.' },
            ].map((project, index) => (
              <TouchableOpacity 
                key={index}
                className="w-[170px] mr-3 bg-white border border-[#E4E7EC] rounded-2xl overflow-hidden shadow-sm"
              >
                <View className="w-full h-24 bg-gray-100">
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=400' }} 
                    className="w-full h-full"
                  />
                </View>
                <View className="p-3">
                  <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[14px] text-[#101828]">{project.name}</Text>
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[12px] text-[#6A7282] mt-0.5">{project.area}</Text>
                  <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[13px] text-[#008E96] mt-2">{project.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Explore Nearby Properties Button */}
        <TouchableOpacity 
          onPress={handleSearchSubmit}
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

export default BuySearch;
