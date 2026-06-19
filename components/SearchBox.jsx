import * as Location from 'expo-location';
import { router } from 'expo-router';
import { ChevronDown, Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useLocation } from '../app/context/LocationContext';

const SearchBox = ({ 
  placeholder = "Search city, locality, landmark ...",
  onPress = () => router.push('/screens/Buy/BuySearch'),
  onLocationUpdate = () => {}
}) => {
  const { currentLocation, updateLocation } = useLocation();
  const [location, setLocation] = useState(currentLocation?.city || "Mohali");

  useEffect(() => {
    if (currentLocation?.city) {
      setLocation(currentLocation.city);
    }
  }, [currentLocation]);

  useEffect(() => {
    (async () => {
      try {
        if (currentLocation) return; // Hook already has location

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        let lastKnown = await Location.getLastKnownPositionAsync({});
        if (lastKnown) {
          updateAddress(lastKnown.coords.latitude, lastKnown.coords.longitude);
        }

        let current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        updateAddress(current.coords.latitude, current.coords.longitude);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    })();
  }, []);

  const updateAddress = async (latitude, longitude) => {
    try {
      let reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (reverseGeocode.length > 0) {
        const geo = reverseGeocode[0];
        const city = geo.city || geo.district || geo.subregion;
        const locality = geo.name || geo.street || geo.subdistrict;
        
        if (city) {
          const locObj = { city, locality, pincode: geo.postalCode };
          updateLocation(locObj);
          onLocationUpdate(locObj);
        }
      }
    } catch (error) {
      console.error("Reverse Geocode Error:", error);
    }
  };

  return (
    <View className="bg-white" style={{ padding: wp('5.3%'), borderRadius: wp('6.4%') }}>
      <TouchableOpacity 
        onPress={() => router.push('/screens/Buy/BuySearch')}
        className="flex-row items-center"
        style={{ marginBottom: hp('2%') }}
      >
        <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('4.3%') }} className="text-[#101828]">
          Currently looking in <Text className="font-inter-bold">{currentLocation?.display || currentLocation?.city || location}</Text>
        </Text>
        <ChevronDown size={wp('5.3%')} color="#101828" style={{ marginLeft: wp('1.1%') }} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center bg-[#F2F4F7] rounded-full"
        style={{ height: hp('5.9%'), paddingHorizontal: wp('4.3%') }}
      >
        <Text className="font-inter-regular flex-1 text-[#667085]" style={{ fontSize: wp('3.7%') }}>
          {placeholder}
        </Text>
        <View className="bg-primary rounded-full items-center justify-center" style={{ width: wp('9.6%'), height: wp('9.6%') }}>
          <Search size={wp('4.8%')} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SearchBox;
