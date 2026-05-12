import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Entypo, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePostProperty } from '../../context/PostPropertyContext';
import { useLookup } from '../../../hooks/useLookup';

const FurnishingScreen = () => {
  const router = useRouter();
  const { postData, updateFurnishings } = usePostProperty();
  const { amenities: apiAmenities, fetchLookups } = useLookup();

  useEffect(() => {
    fetchLookups();
  }, []);
  
  const { counters, selectedItems } = postData.furnishings;

  const setCounters = (updater) => {
    const newCounters = typeof updater === 'function' ? updater(counters) : updater;
    updateFurnishings({ counters: newCounters });
  };

  const setSelectedItems = (updater) => {
    const newItems = typeof updater === 'function' ? updater(selectedItems) : updater;
    updateFurnishings({ selectedItems: newItems });
  };

  const toggleItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const updateCounter = (key, delta) => {
    setCounters((prev) => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta),
    }));
  };

  const societyAmenities = apiAmenities.map(amenity => ({
    name: amenity.label || amenity.name,
    icon: amenity.icon || 'grid-view',
    provider: 'MaterialIcons' // Default to MaterialIcons for API icons
  }));

  const renderIcon = (item) => {
    const { provider, icon } = item;
    const color = selectedItems.includes(item.name) ? '#008E96' : '#6A7282';
    const size = 32;

    if (provider === 'MaterialCommunityIcons') return <MaterialCommunityIcons name={icon} size={size} color={color} />;
    if (provider === 'MaterialIcons') return <MaterialIcons name={icon} size={size} color={color} />;
    if (provider === 'FontAwesome5') return <FontAwesome5 name={icon} size={28} color={color} />;
    if (provider === 'Ionicons') return <Ionicons name={icon} size={size} color={color} />;
    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#008E96" />
      
      {/* Header */}
      <View className="bg-[#008E96] px-4 pt-12 pb-6 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>
          Add Furnishings and Amenities
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        {/* Society Amenities Section */}
        <Text className="text-[#6A7282] text-lg font-medium mt-6 mb-4" style={{ fontFamily: 'Inter-Medium' }}>
          Society Amenities
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {societyAmenities.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleItem(item.name)}
              className={`w-[31%] aspect-square mb-4 rounded-2xl border-2 items-center justify-center p-2 ${
                selectedItems.includes(item.name) ? 'border-[#008E96] bg-[#F0F9F9]' : 'border-[#E5E7EB] bg-white'
              }`}
            >
              {renderIcon(item)}
              <Text 
                className={`text-[10px] text-center mt-2 leading-tight ${selectedItems.includes(item.name) ? 'text-[#008E96]' : 'text-[#364153]'}`}
                style={{ fontFamily: 'Inter-Medium' }}
                numberOfLines={2}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* Number of Lifts (Counter) */}
          <View className="w-[31%] aspect-square mb-4 rounded-2xl border-2 border-[#E5E7EB] bg-white items-center justify-between py-2">
            <MaterialIcons name="elevator" size={28} color="#6A7282" />
            <Text className="text-[10px] text-[#364153] font-medium text-center" style={{ fontFamily: 'Inter-Medium' }}>
              Number of Lifts
            </Text>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity onPress={() => updateCounter('Lifts', -1)}>
                <Entypo name="minus" size={16} color="#99A1AF" />
              </TouchableOpacity>
              <Text className="text-base font-bold text-[#0A0A0A]">{counters.Lifts}</Text>
              <TouchableOpacity onPress={() => updateCounter('Lifts', 1)}>
                <Entypo name="plus" size={16} color="#99A1AF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="h-24" />
      </ScrollView>

      {/* Save Button */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="bg-[#008E96] py-4 rounded-xl items-center"
        >
          <Text className="text-white text-lg font-bold" style={{ fontFamily: 'Inter-Bold' }}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FurnishingScreen;