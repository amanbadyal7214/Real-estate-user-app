import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const ComingSoon = () => {
  const router = useRouter();

  return (
    <View className="items-center justify-center px-4 py-8">
      <View className="w-full max-w-[360px] rounded-[24px] bg-white border border-[#DCE7E7] p-5 items-center shadow-sm">
        <LottieView
          source={require('../assets/comming.json')}
          autoPlay
          loop
          style={{ width: 220, height: 220 }}
        />

        <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[#101828] text-[28px] text-center mt-2">
          Coming Soon
        </Text>

        <Text
          style={{ fontFamily: 'Inter-Regular' }}
          className="text-[#4A5565] text-[15px] text-center leading-[22px] mt-3"
        >
          We are building something exciting for you. This feature will be available very soon.
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-[#008E96] rounded-[14px] px-6 py-3 w-full items-center"
        >
          <Text style={{ fontFamily: 'Inter-Medium' }} className="text-white text-[15px]">
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ComingSoon;
