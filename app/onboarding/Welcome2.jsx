import { Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

const Welcome2 = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-8 pt-4">
        {/* Skip Button */}
        <View className="items-end mb-10">
          <TouchableOpacity onPress={() => router.replace('/(auth)/onboard')}>
            <Text className="text-[#99A1AF] text-md font-inter-regular">Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Illustration Container */}
        <View className="flex-1 justify-center items-center mb-10">
          <Image
            source={require('../../assets/images/c2.png')}
            className="w-full h-[313px]"
            resizeMode="contain"
          />
        </View>

        {/* Content Container */}
        <View className="pb-10 items-center">
          {/* Heading */}
          <Text className="text-[24px] font-inter-bold text-[#101828] text-center leading-[30px] mb-4">
            Smart Filters & Search
          </Text>

          {/* Description */}
          <Text className="text-[14px] text-[#6A7282] font-inter-regular text-center leading-[23px] mb-10 px-4">
            Find exactly what you need with powerful filters and instant search
          </Text>

          {/* Pagination Dots */}
          <View className="flex-row gap-2 mb-10">
            <View className="w-2 h-2 bg-[#E5E7EB] rounded-full" />
            <View className="w-8 h-2 bg-primary rounded-full" />
            <View className="w-2 h-2 bg-[#E5E7EB] rounded-full" />
          </View>

          {/* Next Button */}
          <TouchableOpacity 
            className="w-full h-14 bg-primary rounded-2xl  flex-row justify-center items-center shadow-lg shadow-primary/30"
            activeOpacity={0.8}
            onPress={() => router.push('/onboarding/Welcome3')}
          >
            <Text className="text-white text-lg font-inter-bold  mr-2 ml-4">Next</Text>
            <ChevronRight color="white" size={20} strokeWidth={3} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Welcome2;