import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Entypo, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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

  const societyAmenities = apiAmenities.filter(a => !a.isCounter).map(amenity => ({
    name: amenity.label || amenity.name,
    icon: amenity.icon || 'grid-view',
    provider: 'MaterialIcons' // Default to MaterialIcons for API icons
  }));

  const counterAmenities = apiAmenities.filter(a => a.isCounter).map(amenity => ({
    name: amenity.label || amenity.name,
    icon: amenity.icon || 'grid-view',
    provider: 'MaterialIcons'
  }));

  const renderIcon = (item) => {
    const { provider, icon } = item;
    const color = selectedItems.includes(item.name) ? '#008E96' : '#6A7282';
    const size = wp('8.5%');

    if (provider === 'MaterialCommunityIcons') return <MaterialCommunityIcons name={icon} size={size} color={color} />;
    if (provider === 'MaterialIcons') return <MaterialIcons name={icon} size={size} color={color} />;
    if (provider === 'FontAwesome5') return <FontAwesome5 name={icon} size={wp('7.5%')} color={color} />;
    if (provider === 'Ionicons') return <Ionicons name={icon} size={size} color={color} />;
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#008E96" />
      
      {/* Header */}
      <View className="bg-[#008E96] flex-row items-center" style={{ paddingHorizontal: wp('4.3%'), paddingTop: hp('6%'), paddingBottom: hp('3%') }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: wp('4.3%') }}>
          <Ionicons name="arrow-back" size={wp('6.4%')} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-semibold" style={{ fontWeight: '600', fontSize: wp('5.3%') }}>
          Add Furnishings and Amenities
        </Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: wp('4.3%'), paddingTop: hp('3%') }} showsVerticalScrollIndicator={false}>
        {/* Society Amenities Section */}
        <Text className="text-[#6A7282] font-medium" style={{ fontWeight: '500', fontSize: wp('4.8%'), marginTop: hp('3%'), marginBottom: hp('2%') }}>
          Society Amenities
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {societyAmenities.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleItem(item.name)}
              className={`aspect-square border-2 items-center justify-center ${
                selectedItems.includes(item.name) ? 'border-[#008E96] bg-[#F0F9F9]' : 'border-[#E5E7EB] bg-white'
              }`}
              style={{ width: wp('31%'), marginBottom: hp('2%'), borderRadius: wp('4.3%'), padding: wp('2.1%') }}
            >
              {renderIcon(item)}
              <Text 
                className={`text-center leading-tight ${selectedItems.includes(item.name) ? 'text-[#008E96]' : 'text-[#364153]'}`}
                style={{ fontWeight: '500', fontSize: wp('2.7%'), marginTop: hp('1%') }}
                numberOfLines={2}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* Dynamic Counter Amenities */}
          {counterAmenities.map((item, index) => (
            <View key={`counter-${index}`} className="aspect-square border-2 border-[#E5E7EB] bg-white items-center justify-between" style={{ width: wp('31%'), marginBottom: hp('2%'), borderRadius: wp('4.3%'), paddingVertical: hp('1%'), paddingHorizontal: wp('1%') }}>
              <MaterialIcons name={item.icon} size={wp('7.5%')} color="#6A7282" />
              <Text className="text-[#364153] font-medium text-center" style={{ fontWeight: '500', fontSize: wp('2.7%') }} numberOfLines={1}>
                {item.name}
              </Text>
              <View className="flex-row items-center" style={{ gap: wp('2.1%') }}>
                <TouchableOpacity onPress={() => updateCounter(item.name, -1)}>
                  <Entypo name="minus" size={wp('4.3%')} color="#99A1AF" />
                </TouchableOpacity>
                <Text className="font-bold text-[#0A0A0A]" style={{ fontSize: wp('4.3%') }}>{counters[item.name] || 0}</Text>
                <TouchableOpacity onPress={() => updateCounter(item.name, 1)}>
                  <Entypo name="plus" size={wp('4.3%')} color="#99A1AF" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
          {/* Default Lift Counter if not in API */}
          {!counterAmenities.some(a => a.name === 'Lifts') && (
            <View className="aspect-square border-2 border-[#E5E7EB] bg-white items-center justify-between" style={{ width: wp('31%'), marginBottom: hp('2%'), borderRadius: wp('4.3%'), paddingVertical: hp('1%') }}>
              <MaterialIcons name="elevator" size={wp('7.5%')} color="#6A7282" />
              <Text className="text-[#364153] font-medium text-center" style={{ fontWeight: '500', fontSize: wp('2.7%') }}>
                Number of Lifts
              </Text>
              <View className="flex-row items-center" style={{ gap: wp('2.1%') }}>
                <TouchableOpacity onPress={() => updateCounter('Lifts', -1)}>
                  <Entypo name="minus" size={wp('4.3%')} color="#99A1AF" />
                </TouchableOpacity>
                <Text className="font-bold text-[#0A0A0A]" style={{ fontSize: wp('4.3%') }}>{counters.Lifts || 0}</Text>
                <TouchableOpacity onPress={() => updateCounter('Lifts', 1)}>
                  <Entypo name="plus" size={wp('4.3%')} color="#99A1AF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={{ height: hp('11.8%') }} />
      </ScrollView>

      {/* Save Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100" style={{ padding: wp('4.3%') }}>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="bg-[#008E96] items-center"
          style={{ paddingVertical: hp('2%'), borderRadius: wp('3.2%') }}
        >
          <Text className="text-white font-bold" style={{ fontWeight: '700', fontSize: wp('4.8%') }}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FurnishingScreen;