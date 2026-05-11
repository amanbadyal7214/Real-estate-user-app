import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { usePostProperty } from '../../context/PostPropertyContext';

const PriceDetailsSection = ({ 
  expectedPrice, 
  setExpectedPrice, 
  maintenance, 
  setMaintenance, 
  isNegotiable, 
  setIsNegotiable 
}) => {
  const { postData, updatePriceDetails } = usePostProperty();
  const [securityDeposit, setSecurityDeposit] = useState(postData.priceDetails.securityDeposit || '');

  const availableOptions = ['Immediately', 'Within 15 days', 'After 1 month'];

  const handleDepositChange = (val) => {
    setSecurityDeposit(val);
    updatePriceDetails({ securityDeposit: val });
  };

  const handleAvailableFrom = (option) => {
    updatePriceDetails({ availableFrom: option });
  };

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

      {/* Security Deposit Card */}
      <View className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="security" size={20} color="#008E96" />
          <Text className="text-[#101828] text-lg font-semibold ml-2" style={{ fontFamily: 'Inter-Medium' }}>Security Deposit</Text>
        </View>

        <View className="bg-[#F9FAFB] rounded-xl flex-row items-center px-4 py-2.5">
          <Text className="text-[#99A1AF] text-base mr-2">₹</Text>
          <TextInput
            placeholder="Enter security deposit"
            placeholderTextColor="#99A1AF"
            className="flex-1 text-base"
            keyboardType="numeric"
            value={securityDeposit}
            onChangeText={handleDepositChange}
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

        <View className="flex-row justify-between">
          {availableOptions.map((option) => (
            <TouchableOpacity 
              key={option}
              onPress={() => handleAvailableFrom(option)}
              className={`px-1 py-3 rounded-lg flex-row items-center justify-center ${postData.priceDetails.availableFrom === option ? 'bg-[#E6F7F6]' : 'bg-[#F3F4F6]'}`}
              style={{ width: '31%' }}
            >
              <Text 
                className={`text-[11px] text-center ${postData.priceDetails.availableFrom === option ? 'text-[#008E96]' : 'text-[#364153]'}`}
                style={{ fontFamily: 'Inter-Medium' }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Negotiable Section */}
      <TouchableOpacity 
        onPress={() => setIsNegotiable(!isNegotiable)}
        className="flex-row items-center gap-3 px-2"
      >
        <Ionicons 
          name={isNegotiable ? "checkbox" : "square-outline"} 
          size={24} 
          color={isNegotiable ? "#008E96" : "#99A1AF"} 
        />
        <Text className="text-[#364153] text-base" style={{ fontFamily: 'Inter-Medium' }}>Price is Negotiable</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PriceDetailsSection;
