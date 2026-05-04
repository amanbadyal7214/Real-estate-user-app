import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

const PriceDetailsSection = ({ 
  expectedPrice, 
  setExpectedPrice, 
  maintenance, 
  setMaintenance, 
  isNegotiable, 
  setIsNegotiable 
}) => {
  const [availableFrom, setAvailableFrom] = useState('Immediately');
  const [securityDeposit, setSecurityDeposit] = useState('None');

  return (
    <View className="flex-1 gap-y-6">
      {/* Monthly Rent Card */}
      <View className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="receipt-long" size={20} color="#008E96" />
          <Text className="text-[#101828] text-lg font-semibold ml-2" style={{ fontFamily: 'Inter-Medium' }}>Monthly Rent</Text>
          <Text className="text-[#FB2C36] ml-1">*</Text>
        </View>
        
        <View className="bg-[#F9FAFB] rounded-xl flex-row items-center px-4 py-2.5 mb-2">
          <Text className="text-[#99A1AF] text-base mr-2">₹</Text>
          <TextInput
            placeholder="Enter monthly rent"
            placeholderTextColor="#99A1AF"
            className="flex-1 text-base"
            keyboardType="numeric"
            value={expectedPrice}
            onChangeText={setExpectedPrice}
            style={{ fontFamily: 'Inter-Regular' }}
          />
        </View>
        <Text className="text-[#6A7282] text-xs" style={{ fontFamily: 'Inter-Regular' }}>
          This is the base rent amount excluding maintenance
        </Text>
      </View>

      {/* Maintenance Charges Card */}
      <View className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
        <View className="flex-row items-center mb-4">
          <Feather name="trending-up" size={18} color="#6A7282" />
          <Text className="text-[#101828] text-lg font-medium ml-2" style={{ fontFamily: 'Inter-Medium' }}>Maintenance Charges</Text>
          <Text className="text-[#6A7282] text-xs ml-2">(Optional)</Text>
        </View>

        <View className="bg-[#F9FAFB] rounded-xl flex-row items-center px-4 py-2.5">
          <Text className="text-[#99A1AF] text-base mr-2">₹</Text>
          <TextInput
            placeholder="Enter amount"
            placeholderTextColor="#99A1AF"
            className="flex-1 text-base"
            keyboardType="numeric"
            value={maintenance}
            onChangeText={setMaintenance}
            style={{ fontFamily: 'Inter-Regular' }}
          />
        </View>
      </View>

      {/* Available From Card */}
      <View className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
        <View className="flex-row items-center mb-4">
          <Ionicons name="calendar-outline" size={20} color="#008E96" />
          <Text className="text-[#101828] text-lg font-semibold ml-2" style={{ fontFamily: 'Inter-Medium' }}>Available From</Text>
          <Text className="text-[#FB2C36] ml-1">*</Text>
        </View>

        <TouchableOpacity className="bg-[#F9FAFB] rounded-xl flex-row items-center px-4 py-2.5 mb-4">
          <Ionicons name="calendar" size={18} color="#99A1AF" />
          <Text className="text-[#99A1AF] text-sm ml-3" style={{ fontFamily: 'Inter-Medium' }}>Select date</Text>
        </TouchableOpacity>

        <View className="flex-row justify-between">
          {['Immediately', 'Within 15 days', 'After 1 month'].map((option) => (
            <TouchableOpacity 
              key={option}
              onPress={() => setAvailableFrom(option)}
              className={`px-1 py-3 rounded-lg flex-row items-center justify-center ${availableFrom === option ? 'bg-[#E6F7F6]' : 'bg-[#F3F4F6]'}`}
              style={{ width: '31%' }}
            >
              <Text 
                className={`text-[11px] text-center ${availableFrom === option ? 'text-[#008E96]' : 'text-[#364153]'}`}
                style={{ fontFamily: 'Inter-Medium' }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Security Deposit Card */}
      <View className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-row flex-1">
            <MaterialIcons name="security" size={20} color="#008E96" />
            <View className="ml-2">
              <Text className="text-[#101828] text-lg font-semibold" style={{ fontFamily: 'Inter-Medium' }}>Security Deposit</Text>
              <Text className="text-[#6A7282] text-xs" style={{ fontFamily: 'Inter-Regular' }}>One-time refundable amount</Text>
            </View>
          </View>
          <TouchableOpacity>
             <MaterialIcons name="edit" size={18} color="#99A1AF" />
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap justify-between gap-y-3">
          {[
            { label: 'None', sub: 'No deposit' },
            { label: '1 Month', sub: 'Most common' },
            { label: '2 Months', sub: 'Higher security' },
            { label: 'Custom', sub: 'Your amount' }
          ].map((item) => (
            <TouchableOpacity 
              key={item.label}
              onPress={() => setSecurityDeposit(item.label)}
              className={`p-4 rounded-xl border-2 items-center justify-center ${securityDeposit === item.label ? 'border-[#008E96] bg-[#F0F9F9]' : 'border-[#E5E7EB] bg-white'}`}
              style={{ width: '48%' }}
            >
              <Text className={`text-base font-Medium ${securityDeposit === item.label ? 'text-[#008E96]' : 'text-[#101828]'}`} style={{ fontFamily: 'Inter-SemiBold' }}>{item.label}</Text>
              <Text className="text-[#6A7282] text-[10px]" style={{ fontFamily: 'Inter-Medium' }}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Negotiable Checkbox */}
      <TouchableOpacity 
        onPress={() => setIsNegotiable(!isNegotiable)}
        className="flex-row items-center ml-1"
      >
        <View className={`w-5 h-5 rounded border ${isNegotiable ? 'bg-[#008E96] border-[#008E96]' : 'border-[#D1D5DC]'} items-center justify-center mr-2`}>
          {isNegotiable && <Ionicons name="checkmark" size={14} color="white" />}
        </View>
        <Text className="text-[#364153] text-sm font-medium" style={{ fontFamily: 'Inter-Medium' }}>Price is Negotiable</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PriceDetailsSection;
