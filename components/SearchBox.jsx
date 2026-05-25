import * as Location from 'expo-location';
import { router } from 'expo-router';
import { ChevronDown, Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
    <View className="bg-white p-5 rounded-[24px]">
      <TouchableOpacity 
        onPress={() => router.push('/screens/Buy/BuySearch')}
        className="flex-row items-center mb-4"
      >
        <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[16px] text-[#101828]">
          Currently looking in <Text className="font-inter-bold">{currentLocation?.display || currentLocation?.city || location}</Text>
        </Text>
        <ChevronDown size={20} color="#101828" style={{ marginLeft: 4 }} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center bg-[#F2F4F7] h-12 px-4 rounded-full"
      >
        <Text className="font-inter-regular flex-1 text-[#667085] text-[14px]">
          {placeholder}
        </Text>
        <View className="w-9 h-9 bg-primary rounded-full items-center justify-center">
          <Search size={18} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SearchBox;
