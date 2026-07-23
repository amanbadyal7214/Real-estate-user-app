import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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
    <View className="flex-1" style={{ gap: hp('3%') }}>
      {/* Price/Rent Card */}
      <View className="bg-white border border-[#E5E7EB] shadow-sm" style={{ padding: wp('5.3%'), borderRadius: wp('4.3%') }}>
        <View className="flex-row items-center" style={{ marginBottom: hp('2%') }}>
          <MaterialIcons name="receipt-long" size={wp('5.3%')} color="#008E96" />
          <Text className="text-[#101828] font-semibold" style={{ fontWeight: '500', fontSize: wp('4.8%'), marginLeft: wp('2.1%') }}>
            {isRent ? 'Monthly Rent' : 'Expected Price'}
          </Text>
          <Text className="text-[#FB2C36]" style={{ marginLeft: wp('1%') }}>*</Text>
        </View>
        
        <View className="bg-[#F9FAFB] flex-row items-center" style={{ borderRadius: wp('3.2%'), paddingHorizontal: wp('4.3%'), paddingVertical: hp('1.2%'), marginBottom: hp('1%') }}>
          <Text className="text-[#99A1AF]" style={{ fontSize: wp('4.3%'), marginRight: wp('2.1%') }}>₹</Text>
          <TextInput
            placeholder="Enter Amount"
            placeholderTextColor="#99A1AF"
            className="flex-1 text-[#101828]"
            keyboardType="numeric"
            value={expectedPrice}
            onChangeText={setExpectedPrice}
            style={{ fontWeight: '400', fontSize: wp('4.3%') }}
          />
        </View>
        <Text className="text-[#6A7282]" style={{ fontWeight: '400', fontSize: wp('3.2%') }}>
          {isRent ? 'This is the monthly base rent' : 'Total price including all government charges'}
        </Text>
      </View>

      {/* Available From (for both Rent and Sell) */}
      <View className="bg-white border border-[#E5E7EB] shadow-sm" style={{ padding: wp('5.3%'), borderRadius: wp('4.3%') }}>
        <View className="flex-row items-center" style={{ marginBottom: hp('2%') }}>
          <Ionicons name="calendar-outline" size={wp('5.3%')} color="#008E96" />
          <Text className="text-[#101828] font-semibold" style={{ fontWeight: '500', fontSize: wp('4.8%'), marginLeft: wp('2.1%') }}>Available From</Text>
          <Text className="text-[#FB2C36]" style={{ marginLeft: wp('1%') }}>*</Text>
        </View>

        <TouchableOpacity 
          onPress={() => setShowDatePicker(true)}
          className="bg-[#F9FAFB] flex-row items-center justify-between"
          style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('1.5%'), borderRadius: wp('3.2%') }}
        >
          <Text className={`${postData.propertyDetails.availableFrom ? 'text-[#101828]' : 'text-[#99A1AF]'}`} style={{ fontWeight: '400', fontSize: wp('4.3%') }}>
            {postData.propertyDetails.availableFrom || 'mm/dd/yyyy'}
          </Text>
          <Ionicons name="calendar-sharp" size={wp('4.8%')} color="#008E96" />
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
        <View className="bg-white border border-[#E5E7EB] shadow-sm" style={{ padding: wp('5.3%'), borderRadius: wp('4.3%') }}>
          <View className="flex-row items-center" style={{ marginBottom: hp('2%') }}>
            <MaterialIcons name="security" size={wp('5.3%')} color="#008E96" />
            <Text className="text-[#101828] font-semibold" style={{ fontWeight: '500', fontSize: wp('4.8%'), marginLeft: wp('2.1%') }}>Security Deposit</Text>
          </View>

          <View className="flex-row flex-wrap" style={{ gap: wp('2.1%'), marginBottom: hp('2%') }}>
            {securityOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => handleSecuritySelect(opt)}
                className={`flex-1 border items-center ${securityType === opt ? 'bg-[#E6F7F7] border-[#008E96]' : 'bg-white border-[#E5E7EB]'}`}
                style={{ minWidth: wp('22%'), paddingVertical: hp('1.2%'), borderRadius: wp('2.1%') }}
              >
                <Text className={`${securityType === opt ? 'text-[#008E96]' : 'text-[#6A7282]'}`} style={{ fontWeight: '500', fontSize: wp('3.2%') }}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {securityType === 'Custom' && (
             <View className="bg-[#F9FAFB] flex-row items-center" style={{ borderRadius: wp('3.2%'), paddingHorizontal: wp('4.3%'), paddingVertical: hp('1.2%') }}>
                <Text className="text-[#99A1AF]" style={{ fontSize: wp('4.3%'), marginRight: wp('2.1%') }}>₹</Text>
                <TextInput
                    placeholder="Enter Amount"
                    placeholderTextColor="#99A1AF"
                    className="flex-1 text-[#101828]"
                    keyboardType="numeric"
                    value={postData.priceDetails.securityDeposit}
                    onChangeText={handleDepositChange}
                    style={{ fontWeight: '400', fontSize: wp('4.3%') }}
                />
            </View>
          )}
        </View>
      )}

      {/* Maintenance */}
      {isRent && (
        <View className="bg-white border border-[#E5E7EB] shadow-sm" style={{ padding: wp('5.3%'), borderRadius: wp('4.3%') }}>
          <View className="flex-row items-center" style={{ marginBottom: hp('2%') }}>
            <Feather name="settings" size={wp('4.8%')} color="#008E96" />
            <Text className="text-[#101828] font-semibold" style={{ fontWeight: '500', fontSize: wp('4.8%'), marginLeft: wp('2.1%') }}>Maintenance</Text>
          </View>

          <View className="flex-row" style={{ gap: wp('2.1%'), marginBottom: hp('2%') }}>
              {toggleOptions.map((opt) => (
                  <TouchableOpacity
                      key={opt}
                      onPress={() => {
                          setMaintenanceType(opt);
                          updatePriceDetails({ maintenanceType: opt });
                      }}
                      className={`flex-1 border items-center ${maintenanceType === opt ? 'bg-[#E6F7F7] border-[#008E96]' : 'bg-white border-[#E5E7EB]'}`}
                      style={{ paddingVertical: hp('1.2%'), borderRadius: wp('2.1%') }}
                  >
                      <Text className={`${maintenanceType === opt ? 'text-[#008E96]' : 'text-[#6A7282]'}`} style={{ fontWeight: '500', fontSize: wp('3.7%') }}>{opt}</Text>
                  </TouchableOpacity>
              ))}
          </View>

          {maintenanceType === 'Separate' && (
              <View className="bg-[#F9FAFB] flex-row items-center" style={{ borderRadius: wp('3.2%'), paddingHorizontal: wp('4.3%'), paddingVertical: hp('1.2%') }}>
                  <Text className="text-[#99A1AF]" style={{ fontSize: wp('4.3%'), marginRight: wp('2.1%') }}>₹</Text>
                  <TextInput
                      placeholder="Monthly Amount"
                      placeholderTextColor="#99A1AF"
                      className="flex-1 text-[#101828]"
                      keyboardType="numeric"
                      value={maintenance}
                      onChangeText={setMaintenance}
                      style={{ fontWeight: '400', fontSize: wp('4.3%') }}
                  />
              </View>
          )}
        </View>
      )}

      {/* Parking */}
      {isRent && (
        <View className="bg-white border border-[#E5E7EB] shadow-sm" style={{ padding: wp('5.3%'), borderRadius: wp('4.3%'), marginBottom: hp('2%') }}>
          <View className="flex-row items-center" style={{ marginBottom: hp('2%') }}>
            <Ionicons name="car-outline" size={wp('5.3%')} color="#008E96" />
            <Text className="text-[#101828] font-semibold" style={{ fontWeight: '500', fontSize: wp('4.8%'), marginLeft: wp('2.1%') }}>Parking</Text>
          </View>

          <View className="flex-row" style={{ gap: wp('2.1%'), marginBottom: hp('2%') }}>
              {toggleOptions.map((opt) => (
                  <TouchableOpacity
                      key={opt}
                      onPress={() => {
                          setParkingType(opt);
                          updatePriceDetails({ parkingType: opt });
                      }}
                      className={`flex-1 border items-center ${parkingType === opt ? 'bg-[#E6F7F7] border-[#008E96]' : 'bg-white border-[#E5E7EB]'}`}
                      style={{ paddingVertical: hp('1.2%'), borderRadius: wp('2.1%') }}
                  >
                      <Text className={`${parkingType === opt ? 'text-[#008E96]' : 'text-[#6A7282]'}`} style={{ fontWeight: '500', fontSize: wp('3.7%') }}>{opt}</Text>
                  </TouchableOpacity>
              ))}
          </View>

          {parkingType === 'Separate' && (
              <View className="bg-[#F9FAFB] flex-row items-center" style={{ borderRadius: wp('3.2%'), paddingHorizontal: wp('4.3%'), paddingVertical: hp('1.2%') }}>
                  <Text className="text-[#99A1AF]" style={{ fontSize: wp('4.3%'), marginRight: wp('2.1%') }}>₹</Text>
                  <TextInput
                      placeholder="Parking Amount"
                      placeholderTextColor="#99A1AF"
                      className="flex-1 text-[#101828]"
                      keyboardType="numeric"
                      value={postData.priceDetails.parkingAmount}
                      onChangeText={(val) => updatePriceDetails({ parkingAmount: val })}
                      style={{ fontWeight: '400', fontSize: wp('4.3%') }}
                  />
              </View>
          )}
        </View>
      )}

      {/* Negotiable Section */}
      <TouchableOpacity 
        onPress={() => setIsNegotiable(!isNegotiable)}
        className="flex-row items-center"
        style={{ gap: wp('3.2%'), paddingHorizontal: wp('2.1%'), marginBottom: hp('2%') }}
      >
        <Ionicons 
          name={isNegotiable ? "checkbox" : "square-outline"} 
          size={wp('6.4%')} 
          color={isNegotiable ? "#008E96" : "#99A1AF"} 
        />
        <Text className="text-[#364153]" style={{ fontWeight: '500', fontSize: wp('4.3%') }}>Price is Negotiable</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PriceDetailsSection;
