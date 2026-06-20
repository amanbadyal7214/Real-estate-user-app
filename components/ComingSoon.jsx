import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const ComingSoon = () => {
  const router = useRouter();

  // Calculate responsive sizes
  const lottieSize = Math.min(width * 0.55, 250);
  
  return (
    <View className="flex-1 items-center justify-center px-4 py-8">
      <View className="w-full max-w-[400px] rounded-[24px] bg-white border border-[#DCE7E7] p-6 sm:p-8 items-center shadow-sm">
        <LottieView
          source={require('../assets/comming.json')}
          autoPlay
          loop
          style={{ width: lottieSize, height: lottieSize }}
        />

        <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[#101828] text-[24px] sm:text-[28px] text-center mt-4">
          Coming Soon
        </Text>

        <Text
          style={{ fontFamily: 'Inter-Regular' }}
          className="text-[#4A5565] text-[14px] sm:text-[16px] text-center leading-[22px] mt-3"
        >
          We are building something exciting for you. This feature will be available very soon.
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-8 bg-[#008E96] rounded-[14px] px-6 py-3 sm:py-4 w-full items-center active:opacity-80"
        >
          <Text style={{ fontFamily: 'Inter-Medium' }} className="text-white text-[15px] sm:text-[16px]">
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ComingSoon;
