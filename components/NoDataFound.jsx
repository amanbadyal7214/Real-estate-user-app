import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const { height: screenHeight } = Dimensions.get('window');

const NoDataFound = () => {
  return (
    <View className="flex-1 items-center justify-center px-8 bg-white" style={{ minHeight: screenHeight * 0.6 }}>
      <LottieView
        source={require('../assets/nothing.json')}
        autoPlay
        loop
        style={{ width: 280, height: 280 }}
      />
      <Text className="font-inter-semibold text-[18px] text-[#101828] mt-6 text-center">
        No Properties Found
      </Text>
      <Text className="font-inter-regular text-[14px] text-[#6A7282] mt-2 text-center">
        Try adjusting your filters or search criteria to find what you're looking for.
      </Text>
    </View>
  );
};

export default NoDataFound;
