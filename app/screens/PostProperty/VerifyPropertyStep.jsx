import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const VerifyPropertyStep = () => {
  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{  gap: 24 }}>
        
        {/* How it works Card */}
        <View className="bg-[#F5F5F7] p-[24px_16px_0px] rounded-[14px] gap-6 pb-6">
          <View className="flex-row justify-between items-center">
            <Text className="text-[16px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>How it works</Text>
            <TouchableOpacity>
              <Text className="text-[12px] text-[#008E96] underline" style={{ fontFamily: 'Inter-Medium' }}>
                Why should you verify?
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between items-center h-[128px]">
            {/* Step 1 */}
            <View className="items-center w-[82px]">
              <View className="w-16 h-16 bg-[#E6F7F6] border-2 border-[#008E96] rounded-xl items-center justify-center relative">
                <Ionicons name="shield-checkmark-outline" size={32} color="#008E96" />
                <View className="absolute top-2 right-2 w-4 h-4 bg-[#008E96]/30 rounded-full" />
                <View className="absolute bottom-2 left-2 w-4 h-2 bg-[#008E96] border-2 border-[#008E96] rounded-sm" />
              </View>
              <Text className="text-[12px] text-[#364153] text-center mt-3 leading-[16px]" style={{ fontFamily: 'Inter-Medium' }}>
                Visit the{"\n"}property
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={16} color="#008E96" />

            {/* Step 2 */}
            <View className="items-center w-[82px]">
              <View className="w-16 h-16 bg-[#E6F7F6] border-2 border-[#008E96] rounded-xl items-center justify-center">
                <MaterialCommunityIcons name="cellphone-check" size={32} color="#008E96" />
              </View>
              <Text className="text-[12px] text-[#364153] text-center mt-3 leading-[16px]" style={{ fontFamily: 'Inter-Medium' }}>
                Open link{"\n"}shared{"\n"}on phone
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={16} color="#008E96" />

            {/* Step 3 */}
            <View className="items-center w-[82px]">
              <View className="w-16 h-16 bg-[#E6F7F6] border-2 border-[#008E96] rounded-xl items-center justify-center">
                <Ionicons name="camera-outline" size={32} color="#008E96" />
              </View>
              <Text className="text-[12px] text-[#364153] text-center mt-3 leading-[16px]" style={{ fontFamily: 'Inter-Medium' }}>
                Click photos{"\n"}& submit
              </Text>
            </View>
          </View>
        </View>

        {/* Verification Options Section */}
        <View className="flex-row items-center justify-center relative px-2">
          {/* I will visit */}
          <View className="flex-1 bg-white border border-[#E5E7EB] rounded-[14px] p-4 gap-4 mr-[-7px]">
            <Text className="text-[14px] text-[#101828] text-center leading-[20px]" style={{ fontFamily: 'Inter-SemiBold' }}>
              I will visit the{"\n"}property
            </Text>
            <View className="gap-1.5">
              <Text className="text-[12px] text-[#4A5565]" style={{ fontFamily: 'Inter-Medium' }}>Select Date *</Text>
              <TextInput 
                placeholder="DD/MM/YYYY" 
                placeholderTextColor="#99A1AF"
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] h-[48px] px-3 text-[14px] text-[#101828]"
                style={{ fontFamily: 'Inter-Regular' }}
              />
            </View>
            <TouchableOpacity className="bg-[#99A1AF] h-[48px] rounded-[10px] items-center justify-center mt-auto">
              <Text className="text-white text-[14px]" style={{ fontFamily: 'Inter-SemiBold' }}>Set Reminder</Text>
            </TouchableOpacity>
          </View>

          {/* OR Circle */}
          <View 
            className="w-10 h-10 bg-white border-2 border-[#D1D5DC] rounded-full items-center justify-center z-10"
          >
            <Text className="text-[12px] text-[#4A5565]" style={{ fontFamily: 'Inter-Bold' }}>OR</Text>
          </View>

          {/* Share link */}
          <View className="flex-1 bg-white border border-[#E5E7EB] rounded-[14px] p-4 gap-4 ml-[-7px] min-h-[225px]">
            <Text className="text-[14px] text-[#101828] text-center leading-[20px]" style={{ fontFamily: 'Inter-SemiBold' }}>
              Share link with{"\n"}someone else
            </Text>
            <View className="gap-1.5">
              <Text className="text-[12px] text-[#4A5565]" style={{ fontFamily: 'Inter-Medium' }}>Enter Phone Number *</Text>
              <TextInput 
                placeholder="+91" 
                placeholderTextColor="#99A1AF"
                keyboardType="phone-pad"
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] h-[48px] px-3 text-[14px] text-[#101828]"
                style={{ fontFamily: 'Inter-Regular' }}
              />
            </View>
            <TouchableOpacity className="bg-[#99A1AF] h-[48px] rounded-[10px] items-center justify-center mt-auto">
              <Text className="text-white text-[14px]" style={{ fontFamily: 'Inter-SemiBold' }}>Share Link</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Link */}
        <TouchableOpacity className="items-center py-2 mb-10">
          <Text className="text-[14px] text-[#4A5565] underline" style={{ fontFamily: 'Inter-Regular' }}>
            Continue without verification
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

export default VerifyPropertyStep;
