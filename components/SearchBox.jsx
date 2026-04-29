import * as Location from 'expo-location';
import { router } from 'expo-router';
import { ChevronDown, Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const SearchBox = ({ 
  location: initialLocation = "Mohali", 
  placeholder = "Search city, locality, landmark ...",
  onPress = () => router.push('/screens/Buy/BuySearch')
}) => {
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }

        // Use last known position for immediate result, then update with current
        let lastKnown = await Location.getLastKnownPositionAsync({});
        if (lastKnown) {
          updateCity(lastKnown.coords.latitude, lastKnown.coords.longitude);
        }

        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        updateCity(currentLocation.coords.latitude, currentLocation.coords.longitude);

      } catch (error) {
        console.error("Error fetching location:", error);
      }
    })();
  }, []);

  const updateCity = async (latitude, longitude) => {
    try {
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const city = reverseGeocode[0].city || reverseGeocode[0].district || reverseGeocode[0].subregion;
        if (city) {
          setLocation(city);
        }
      }
    } catch (e) {
      console.log("Reverse geocode error:", e);
    }
  };

  return (
    <View className="bg-white p-5 rounded-[24px]">
      <TouchableOpacity 
        onPress={() => router.push('/screens/LocationSelection')}
        className="flex-row items-center mb-4"
      >
        <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[16px] text-[#101828]">
          Searching in <Text className="font-inter-bold">{location}</Text>
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
