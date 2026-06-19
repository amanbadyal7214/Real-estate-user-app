import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, MapPin, Search, TrendingUp } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../api';
import { useLocation } from '../../context/LocationContext';

const RentSearch = () => {
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

  const handleSearchSubmit = () => {
    const finalCity = city.trim() || currentLocation?.city || "Mohali";
    const finalLocality = locality.trim();
    
    updateLocation({
      city: finalCity,
      locality: finalLocality,
      display: finalLocality ? `${finalLocality}, ${finalCity}` : finalCity
    });
    // Use replace to avoid GO_BACK errors when there's no history
    router.replace('/screens/Rent/Rent');
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between" style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('1.5%') }}>
        <View className="flex-row items-center" style={{ gap: wp('3.2%') }}>
          <TouchableOpacity 
            onPress={() => router.replace('/screens/Rent/Rent')}
            className="items-center justify-center rounded-full border border-gray-100"
            style={{ width: wp('10.6%'), height: wp('10.6%') }}
          >
            <ArrowLeft size={wp('5.3%')} color="#101828" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('4.8%') }} className="text-[#101828]">Rent</Text>
        </View>
        
        <View 
          className="flex-row items-center bg-gray-50/50 border border-gray-100"
          style={{ paddingHorizontal: wp('3.2%'), paddingVertical: hp('0.7%'), borderRadius: wp('3%'), gap: wp('1.6%') }}
        >
          <MapPin size={wp('3.7%')} color="#008E96" />
          <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.7%') }} className="text-[#4A5565]">
            {currentLocation?.city || 'Mohali'}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Search Section */}
        <View className="bg-white border border-gray-100 shadow-sm" style={{ marginHorizontal: wp('4.3%'), marginVertical: hp('1%'), padding: wp('4.3%'), borderRadius: wp('6.4%') }}>
          <View style={{ gap: hp('1.5%') }}>
            {/* City Input */}
            <View className="flex-row items-center bg-[#F2F4F7]" style={{ height: hp('6%'), paddingHorizontal: wp('4.3%'), borderRadius: wp('3.2%') }}>
              <MapPin size={wp('4.8%')} color="#008E96" />
              <TextInput 
                placeholder="Enter City"
                placeholderTextColor="#6A7282"
                style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.7%'), flex: 1, marginLeft: wp('3.2%') }}
                className="text-[#101828]"
                value={city}
                onChangeText={setCity}
              />
            </View>

            {/* Locality Input */}
            <View style={{ zIndex: 50 }}>
              <View className="flex-row items-center bg-[#F2F4F7]" style={{ height: hp('6%'), paddingHorizontal: wp('4.3%'), borderRadius: wp('3.2%') }}>
                <Search size={wp('4.8%')} color="#667085" />
                <TextInput 
                  placeholder="Enter Locality"
                  placeholderTextColor="#6A7282"
                  style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.7%'), flex: 1, marginLeft: wp('3.2%') }}
                  className="text-[#101828]"
                  value={locality}
                  onChangeText={setLocality}
                  onSubmitEditing={handleSearchSubmit}
                />
                {loadingSuggestions && <ActivityIndicator size="small" color="#008E96" />}
              </View>

              {suggestions.length > 0 && (
                <View className="mt-2 bg-white border border-gray-100 shadow-sm overflow-hidden" style={{ borderRadius: wp('3.2%'), maxHeight: hp('24%') }}>
                  <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                    {suggestions.map((item) => (
                      <TouchableOpacity 
                        key={item._id}
                        onPress={() => {
                          setLocality(item.name);
                          setSuggestions([]);
                        }}
                        className="border-b border-gray-50 flex-row items-center"
                        style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('1.5%'), gap: wp('2.1%') }}
                      >
                        <MapPin size={wp('3.7%')} color="#667085" />
                        <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.7%') }} className="text-[#101828]">
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
              style={{ height: hp('6%'), borderRadius: wp('3.2%'), marginTop: hp('0.5%') }}
            >
              <View className="flex-row items-center" style={{ gap: wp('2.1%') }}>
                <Search size={wp('4.8%')} color="white" />
                <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('4%') }} className="text-white">Search Properties</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Localities Section */}
        <View className="bg-[#EDFBFA]" style={{ marginHorizontal: wp('4.3%'), marginTop: hp('2%'), padding: wp('4.3%'), borderRadius: wp('6.4%') }}>
          <View className="flex-row items-center" style={{ gap: wp('2.1%'), marginBottom: hp('1.5%') }}>
            <TrendingUp size={wp('4.3%')} color="#008E96" />
            <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('4.3%') }} className="text-[#101828]">Popular Localities</Text>
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
                className="bg-[#F7F9FA] border border-[#E4E7EC] shadow-sm"
                style={{ width: wp('37.3%'), padding: wp('3.2%'), marginRight: wp('3.2%'), borderRadius: wp('4.3%') }}
              >
                <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('4%'), marginBottom: hp('0.5%') }} className="text-[#101828]">{locality.name}</Text>
                <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.5%') }} className="text-[#6A7282]">{locality.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Landmarks Section */}
        <View style={{ marginTop: hp('3%') }}>
          <View className="flex-row items-center" style={{ paddingHorizontal: wp('4.3%'), gap: wp('2.1%'), marginBottom: hp('2%') }}>
            <MapPin size={wp('4.3%')} color="#008E96" />
            <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('4.3%') }} className="text-[#101828]">Popular Landmarks</Text>
          </View>
          
          <View className="flex-row flex-wrap" style={{ paddingHorizontal: wp('4.3%'), gap: wp('2.1%') }}>
            {[
              'City Heart', 'Maxim Merry School', 'Mohali Stadium', 
              'Phase 11 Market', 'ISB Campus'
            ].map((landmark, index) => (
              <TouchableOpacity 
                key={index}
                className="flex-row items-center bg-white border border-[#E4E7EC] rounded-full"
                style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('1.2%'), gap: wp('2.1%') }}
              >
                <MapPin size={wp('3.7%')} color="#008E96" />
                <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.5%') }} className="text-[#4A5565]">{landmark}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      

        {/* Explore Nearby Properties Button */}
        <TouchableOpacity 
          onPress={() => router.push('/screens/Rent/Rent')}
          className="flex-row items-center justify-between bg-[#008E96]/10 border border-[#008E96]/20"
          style={{ marginHorizontal: wp('4.3%'), marginVertical: hp('5%'), padding: wp('4.3%'), borderRadius: wp('4.3%') }}
        >
          <View className="flex-row items-center" style={{ gap: wp('3.2%') }}>
            <View className="bg-white items-center justify-center rounded-full border border-gray-100" style={{ width: wp('9.6%'), height: wp('9.6%') }}>
               <ArrowLeft size={wp('4.3%')} color="#008E96" style={{ transform: [{ rotate: '180deg'}] }} />
            </View>
            <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('4%') }} className="text-[#101828]">Explore nearby properties</Text>
          </View>
          <ChevronRight size={wp('5.3%')} color="#008E96" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RentSearch;
