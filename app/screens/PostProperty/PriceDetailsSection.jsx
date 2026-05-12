import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { usePostProperty } from '../../context/PostPropertyContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const PriceDetailsSection = ({ 
  expectedPrice, 
  setExpectedPrice, 
  maintenance, 
  setMaintenance, 
  isNegotiable, 
  setIsNegotiable 
}) => {
  const { postData, updatePriceDetails, updatePropertyDetails } = usePostProperty();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [securityType, setSecurityType] = useState(postData.priceDetails.securityType || 'None');
  const [maintenanceType, setMaintenanceType] = useState(postData.priceDetails.maintenanceType || 'Include');
  const [parkingType, setParkingType] = useState(postData.priceDetails.parkingType || 'Include');

  const securityOptions = ['None', '1 month', '2 month', 'Custom'];
  const toggleOptions = ['Include', 'Separate'];

  const handleDepositChange = (val) => {
    updatePriceDetails({ securityDeposit: val });
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString('en-GB'); // DD/MM/YYYY
      updatePropertyDetails({ availableFrom: formattedDate });
    }
  };

  const handleSecuritySelect = (type) => {
    setSecurityType(type);
    updatePriceDetails({ securityType: type });
    if (type === '1 month') {
        const amount = (parseFloat(expectedPrice) || 0).toString();
        updatePriceDetails({ securityDeposit: amount });
    } else if (type === '2 month') {
        const amount = ((parseFloat(expectedPrice) || 0) * 2).toString();
        updatePriceDetails({ securityDeposit: amount });
    } else if (type === 'None') {
        updatePriceDetails({ securityDeposit: '0' });
    }
  };

  const isRent = postData.propertyDetails.category === 'Rent';

  return (
    <View className="flex-1 gap-y-6">
      {/* Price/Rent Card */}
      <View className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="receipt-long" size={20} color="#008E96" />
          <Text className="text-[#101828] text-lg font-semibold ml-2" style={{ fontFamily: 'Inter-Medium' }}>
            {isRent ? 'Monthly Rent' : 'Expected Price'}
          </Text>
          <Text className="text-[#FB2C36] ml-1">*</Text>
        </View>
        
        <View className="bg-[#F9FAFB] rounded-xl flex-row items-center px-4 py-2.5 mb-2">
          <Text className="text-[#99A1AF] text-base mr-2">₹</Text>
          <TextInput
            placeholder="Enter Amount"
            placeholderTextColor="#99A1AF"
            className="flex-1 text-base text-[#101828]"
            keyboardType="numeric"
            value={expectedPrice}
            onChangeText={setExpectedPrice}
            style={{ fontFamily: 'Inter-Regular' }}
          />
        </View>
        <Text className="text-[#6A7282] text-xs" style={{ fontFamily: 'Inter-Regular' }}>
          {isRent ? 'This is the monthly base rent' : 'Total price including all government charges'}
        </Text>
      </View>

      {/* Available From (for both Rent and Sell) */}
      <View className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
        <View className="flex-row items-center mb-4">
          <Ionicons name="calendar-outline" size={20} color="#008E96" />
          <Text className="text-[#101828] text-lg font-semibold ml-2" style={{ fontFamily: 'Inter-Medium' }}>Available From</Text>
          <Text className="text-[#FB2C36] ml-1">*</Text>
        </View>

        <TouchableOpacity 
          onPress={() => setShowDatePicker(true)}
          className="bg-[#F9FAFB] rounded-xl flex-row items-center justify-between px-4 py-3"
        >
          <Text className={`text-base ${postData.propertyDetails.availableFrom ? 'text-[#101828]' : 'text-[#99A1AF]'}`} style={{ fontFamily: 'Inter-Regular' }}>
            {postData.propertyDetails.availableFrom || 'mm/dd/yyyy'}
          </Text>
          <Ionicons name="calendar-sharp" size={18} color="#008E96" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={onDateChange}
          />
        )}
      </View>

      {/* Security Deposit (for Rent only) */}
      {isRent && (
        <View className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
          <View className="flex-row items-center mb-4">
            <MaterialIcons name="security" size={20} color="#008E96" />
            <Text className="text-[#101828] text-lg font-semibold ml-2" style={{ fontFamily: 'Inter-Medium' }}>Security Deposit</Text>
          </View>

          <View className="flex-row flex-wrap gap-2 mb-4">
            {securityOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => handleSecuritySelect(opt)}
                className={`flex-1 min-w-[22%] py-2.5 rounded-lg border items-center ${securityType === opt ? 'bg-[#E6F7F7] border-[#008E96]' : 'bg-white border-[#E5E7EB]'}`}
              >
                <Text className={`text-xs ${securityType === opt ? 'text-[#008E96]' : 'text-[#6A7282]'}`} style={{ fontFamily: 'Inter-Medium' }}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {securityType === 'Custom' && (
             <View className="bg-[#F9FAFB] rounded-xl flex-row items-center px-4 py-2.5">
                <Text className="text-[#99A1AF] text-base mr-2">₹</Text>
                <TextInput
                    placeholder="Enter Amount"
                    placeholderTextColor="#99A1AF"
                    className="flex-1 text-base text-[#101828]"
                    keyboardType="numeric"
                    value={postData.priceDetails.securityDeposit}
                    onChangeText={handleDepositChange}
                    style={{ fontFamily: 'Inter-Regular' }}
                />
            </View>
          )}
        </View>
      )}

      {/* Maintenance */}
      {isRent && (
        <View className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
          <View className="flex-row items-center mb-4">
            <Feather name="settings" size={18} color="#008E96" />
            <Text className="text-[#101828] text-lg font-semibold ml-2" style={{ fontFamily: 'Inter-Medium' }}>Maintenance</Text>
          </View>

          <View className="flex-row gap-2 mb-4">
              {toggleOptions.map((opt) => (
                  <TouchableOpacity
                      key={opt}
                      onPress={() => {
                          setMaintenanceType(opt);
                          updatePriceDetails({ maintenanceType: opt });
                      }}
                      className={`flex-1 py-2.5 rounded-lg border items-center ${maintenanceType === opt ? 'bg-[#E6F7F7] border-[#008E96]' : 'bg-white border-[#E5E7EB]'}`}
                  >
                      <Text className={`text-sm ${maintenanceType === opt ? 'text-[#008E96]' : 'text-[#6A7282]'}`} style={{ fontFamily: 'Inter-Medium' }}>{opt}</Text>
                  </TouchableOpacity>
              ))}
          </View>

          {maintenanceType === 'Separate' && (
              <View className="bg-[#F9FAFB] rounded-xl flex-row items-center px-4 py-2.5">
                  <Text className="text-[#99A1AF] text-base mr-2">₹</Text>
                  <TextInput
                      placeholder="Monthly Amount"
                      placeholderTextColor="#99A1AF"
                      className="flex-1 text-base text-[#101828]"
                      keyboardType="numeric"
                      value={maintenance}
                      onChangeText={setMaintenance}
                      style={{ fontFamily: 'Inter-Regular' }}
                  />
              </View>
          )}
        </View>
      )}

      {/* Parking */}
      {isRent && (
        <View className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm mb-4">
          <View className="flex-row items-center mb-4">
            <Ionicons name="car-outline" size={20} color="#008E96" />
            <Text className="text-[#101828] text-lg font-semibold ml-2" style={{ fontFamily: 'Inter-Medium' }}>Parking</Text>
          </View>

          <View className="flex-row gap-2 mb-4">
              {toggleOptions.map((opt) => (
                  <TouchableOpacity
                      key={opt}
                      onPress={() => {
                          setParkingType(opt);
                          updatePriceDetails({ parkingType: opt });
                      }}
                      className={`flex-1 py-2.5 rounded-lg border items-center ${parkingType === opt ? 'bg-[#E6F7F7] border-[#008E96]' : 'bg-white border-[#E5E7EB]'}`}
                  >
                      <Text className={`text-sm ${parkingType === opt ? 'text-[#008E96]' : 'text-[#6A7282]'}`} style={{ fontFamily: 'Inter-Medium' }}>{opt}</Text>
                  </TouchableOpacity>
              ))}
          </View>

          {parkingType === 'Separate' && (
              <View className="bg-[#F9FAFB] rounded-xl flex-row items-center px-4 py-2.5">
                  <Text className="text-[#99A1AF] text-base mr-2">₹</Text>
                  <TextInput
                      placeholder="Parking Amount"
                      placeholderTextColor="#99A1AF"
                      className="flex-1 text-base text-[#101828]"
                      keyboardType="numeric"
                      value={postData.priceDetails.parkingAmount}
                      onChangeText={(val) => updatePriceDetails({ parkingAmount: val })}
                      style={{ fontFamily: 'Inter-Regular' }}
                  />
              </View>
          )}
        </View>
      )}

      {/* Negotiable Section */}
      <TouchableOpacity 
        onPress={() => setIsNegotiable(!isNegotiable)}
        className="flex-row items-center gap-3 px-2 mb-4"
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
