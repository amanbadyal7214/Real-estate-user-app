import { router } from 'expo-router';
import { ChevronDown, Search } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const SearchBox = ({ 
  location = "Mohali", 
  placeholder = "Search city, locality, landmark ...",
  onPress = () => router.push('/screens/Buy/BuySearch')
}) => {
  return (
    <View className="bg-white p-5 rounded-[24px]">
      <View className="flex-row items-center mb-4">
        <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[16px] text-[#101828]">
          Searching in <Text className="font-inter-bold">{location}</Text>
        </Text>
        <ChevronDown size={20} color="#101828" style={{ marginLeft: 4 }} />
      </View>

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
