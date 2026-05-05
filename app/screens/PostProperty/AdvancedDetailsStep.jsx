import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AdvancedDetailsStep = () => {
  const [selectedTenant, setSelectedTenant] = useState('Bachelors');
  const [petFriendly, setPetFriendly] = useState(null);

  const tenantTypes = ['Bachelors', 'Family', 'Company'];

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
        {/* Info Banner */}
        <View className="bg-[#E6F7F6] p-4 rounded-[14px] border border-[#008E96]/20 flex-row items-start gap-2.5">
          <Ionicons name="information-circle-outline" size={20} color="#008E96" />
          <Text className="text-[12px] text-[#364153] flex-1 leading-[16px]" style={{ fontFamily: 'Inter-Regular' }}>
            Providing accurate details helps buyers make informed decisions and increases response rate
          </Text>
        </View>

        {/* Age of Property */}
        <View className="gap-3">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <Ionicons name="calendar-outline" size={18} color="#008E96" />
              <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Age of Property</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="help-circle-outline" size={18} color="#99A1AF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-[14px] h-14 flex-row items-center justify-between px-4">
            <Text className="text-[16px] text-[#101828]/50" style={{ fontFamily: 'Inter-Medium' }}>Select age</Text>
            <Ionicons name="chevron-down" size={20} color="#99A1AF" />
          </TouchableOpacity>
        </View>

        {/* Floor Section */}
        <View className="flex-row gap-4">
          <View className="flex-1 gap-3">
            <View className="flex-row items-center gap-2">
              <Ionicons name="business-outline" size={16} color="#008E96" />
              <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Floor Number</Text>
            </View>
            <TouchableOpacity className="bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-[14px] h-14 flex-row items-center justify-between px-4">
              <Text className="text-[16px] text-[#101828]/50" style={{ fontFamily: 'Inter-Medium' }}>Select</Text>
              <Ionicons name="chevron-down" size={18} color="#99A1AF" />
            </TouchableOpacity>
          </View>
          <View className="flex-1 gap-3">
            <Text className="text-[14px] text-[#101828] h-[20px]" style={{ fontFamily: 'Inter-SemiBold' }}>Total Floors</Text>
            <TouchableOpacity className="bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-[14px] h-14 flex-row items-center justify-between px-4">
              <Text className="text-[16px] text-[#101828]/50" style={{ fontFamily: 'Inter-Medium' }}>Select</Text>
              <Ionicons name="chevron-down" size={18} color="#99A1AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bathrooms */}
        <View className="gap-3">
          <View className="flex-row items-center gap-2">
            <Ionicons name="water-outline" size={18} color="#008E96" />
            <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Bathrooms</Text>
          </View>
          <TouchableOpacity className="bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-[14px] h-14 flex-row items-center justify-between px-4">
            <Text className="text-[16px] text-[#101828]/50" style={{ fontFamily: 'Inter-Medium' }}>Select bathrooms</Text>
            <Ionicons name="chevron-down" size={20} color="#99A1AF" />
          </TouchableOpacity>
        </View>

        {/* Parking Details Card */}
        <LinearGradient
          colors={['#F9FAFB', '#FFFFFF']}
          className="p-5 rounded-[16px] border border-[#E5E7EB] gap-5"
        >
          <View className="flex-row items-center gap-2">
            <Ionicons name="car-outline" size={20} color="#008E96" />
            <Text className="text-[18px] text-[#101828]" style={{ fontFamily: 'Inter-Bold' }}>Parking Details</Text>
          </View>

          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <Ionicons name="radio-button-on" size={16} color="#4A5565" />
              <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Covered Parking</Text>
            </View>
            <TouchableOpacity className="bg-white border-2 border-[#E5E7EB] rounded-[14px] h-14 flex-row items-center justify-between px-4">
              <Text className="text-[16px] text-[#101828]/50" style={{ fontFamily: 'Inter-Medium' }}>Select</Text>
              <Ionicons name="chevron-down" size={20} color="#99A1AF" />
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <Ionicons name="radio-button-on" size={16} color="#4A5565" />
              <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Open Parking</Text>
            </View>
            <TouchableOpacity className="bg-white border-2 border-[#E5E7EB] rounded-[14px] h-14 flex-row items-center justify-between px-4">
              <Text className="text-[16px] text-[#101828]/50" style={{ fontFamily: 'Inter-Medium' }}>Select</Text>
              <Ionicons name="chevron-down" size={20} color="#99A1AF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Tip Banner */}
        <View className="bg-[#EFF6FF] p-4 rounded-[14px] border border-[#BEDBFF]">
          <Text className="text-[12px] text-[#364153] leading-[20px]" style={{ fontFamily: 'Inter-Regular' }}>
            💡 Tip: Properties with accurate parking and bathroom details get 50% more leads.
          </Text>
        </View>

        {/* Offers Section */}
        <View className="gap-6 mt-2">
          <View className="flex-row justify-between items-start">
            <Text className="text-[18px] text-[#101828] flex-1 leading-[27px]" style={{ fontFamily: 'Inter-Bold' }}>
              Offers - Increase upto 50% leads
            </Text>
            <Text className="text-[12px] text-[#6A7282]" style={{ fontFamily: 'Inter-Regular' }}>(optional)</Text>
          </View>

          {/* Legal */}
          <View className="gap-2">
            <Text className="text-[14px] text-[#364153]" style={{ fontFamily: 'Inter-SemiBold' }}>Legal</Text>
            <View className="flex-row flex-wrap gap-2">
              <TouchableOpacity className="px-4 py-3 border-2 border-[#D1D5DC] rounded-full">
                <Text className="text-[14px] text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>Free rental agreement</Text>
              </TouchableOpacity>
              <TouchableOpacity className="px-4 py-3 border-2 border-[#D1D5DC] rounded-full">
                <Text className="text-[14px] text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>Free police verification</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Rentals */}
          <View className="gap-2">
            <Text className="text-[14px] text-[#364153]" style={{ fontFamily: 'Inter-SemiBold' }}>Rentals</Text>
            <View className="flex-row flex-wrap gap-2">
              <TouchableOpacity className="px-4 py-3 border-2 border-[#D1D5DC] rounded-full">
                <Text className="text-[14px] text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>Zero brokerage</Text>
              </TouchableOpacity>
              <TouchableOpacity className="px-4 py-3 border-2 border-[#D1D5DC] rounded-full">
                <Text className="text-[14px] text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>15 days rent off</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Security Deposit */}
          <View className="gap-2">
            <Text className="text-[14px] text-[#364153]" style={{ fontFamily: 'Inter-SemiBold' }}>Security Deposit</Text>
            <View className="flex-row flex-wrap gap-2">
              <TouchableOpacity className="px-4 py-3 border-2 border-[#D1D5DC] rounded-full">
                <Text className="text-[14px] text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>Zero deposit</Text>
              </TouchableOpacity>
              <TouchableOpacity className="px-4 py-3 border-2 border-[#D1D5DC] rounded-full">
                <Text className="text-[14px] text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>Only one month security deposit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Preferred Tenant Type */}
        <View className="gap-3 mt-2">
          <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Preferred Tenant Type</Text>
          <View className="flex-row flex-wrap gap-3">
            {tenantTypes.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setSelectedTenant(type)}
                className={`h-[60px] rounded-[14px] items-center justify-center border-2 ${
                  selectedTenant === type ? 'bg-[#008E96]/10 border-[#008E96]' : 'bg-white border-[#E5E7EB]'
                } ${type === 'Company' ? 'w-full' : 'flex-1'}`}
              >
                <Text className={`text-[16px] ${selectedTenant === type ? 'text-[#008E96]' : 'text-[#364153]'}`} style={{ fontFamily: 'Inter-Medium' }}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pet Friendly */}
        <View className="gap-3 mt-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Pet Friendly?</Text>
            <TouchableOpacity>
              <Ionicons name="help-circle-outline" size={18} color="#99A1AF" />
            </TouchableOpacity>
          </View>
          <View className="flex-row gap-4">
            {['Yes', 'No'].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setPetFriendly(option)}
                className={`flex-1 h-[60px] rounded-[14px] items-center justify-center border-2 ${
                  petFriendly === option ? 'bg-[#008E96]/10 border-[#008E96]' : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <Text className={`text-[16px] ${petFriendly === option ? 'text-[#008E96]' : 'text-[#364153]'}`} style={{ fontFamily: 'Inter-Medium' }}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Carpet Area */}
        <View className="gap-3 mt-2">
          <View className="flex-row justify-between items-center">
            <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Carpet Area</Text>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity>
                <Ionicons name="help-circle-outline" size={18} color="#99A1AF" />
              </TouchableOpacity>
              <Text className="text-[12px] text-[#6A7282]" style={{ fontFamily: 'Inter-Regular' }}>Select Area Unit</Text>
            </View>
          </View>
          <View className="flex-row gap-4">
            <TextInput
              placeholder="Enter area"
              placeholderTextColor="rgba(16, 24, 40, 0.5)"
              className="flex-1 bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-[14px] h-14 px-4 text-[16px]"
              style={{ fontFamily: 'Inter-Medium' }}
            />
            <TouchableOpacity className="w-[106px] bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-[14px] h-14 flex-row items-center justify-between px-4">
              <Text className="text-[16px] text-[#101828]/50" style={{ fontFamily: 'Inter-Medium' }}>Unit</Text>
              <Ionicons name="chevron-down" size={18} color="#99A1AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Flat No. */}
        <View className="gap-2 mt-2 mb-10">
          <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Flat No.</Text>
          <TextInput
            placeholder="Enter flat number"
            placeholderTextColor="rgba(16, 24, 40, 0.5)"
            className="bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-[14px] h-14 px-4 text-[16px]"
            style={{ fontFamily: 'Inter-Medium' }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AdvancedDetailsStep;
