import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePostProperty } from '../../context/PostPropertyContext';

const AdvancedDetailsStep = () => {
  const { postData, updateAdvancedDetails } = usePostProperty();
  const { floor, totalFloors, bathrooms, balconies, ageOfProperty, tenantType, petFriendly } = postData.advancedDetails;

  const tenantOptions = ['Bachelors', 'Family', 'Company'];
  const ageOptions = ['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'];

  const toggleTenant = (type) => {
    let newTenants = [...tenantType];
    if (newTenants.includes(type)) {
      newTenants = newTenants.filter(t => t !== type);
    } else {
      newTenants.push(type);
    }
    updateAdvancedDetails({ tenantType: newTenants });
  };

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

        {/* Floor Section */}
        <View className="flex-row gap-4">
          <View className="flex-1 gap-3">
            <View className="flex-row items-center gap-2">
              <Ionicons name="business-outline" size={16} color="#008E96" />
              <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Floor Number</Text>
            </View>
            <TextInput
              keyboardType="numeric"
              placeholder="e.g. 2"
              value={floor}
              onChangeText={(val) => updateAdvancedDetails({ floor: val })}
              className="bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-[14px] h-14 px-4 text-[16px]"
              style={{ fontFamily: 'Inter-Medium' }}
            />
          </View>
          <View className="flex-1 gap-3">
            <Text className="text-[14px] text-[#101828] h-[20px]" style={{ fontFamily: 'Inter-SemiBold' }}>Total Floors</Text>
            <TextInput
              keyboardType="numeric"
              placeholder="e.g. 5"
              value={totalFloors}
              onChangeText={(val) => updateAdvancedDetails({ totalFloors: val })}
              className="bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-[14px] h-14 px-4 text-[16px]"
              style={{ fontFamily: 'Inter-Medium' }}
            />
          </View>
        </View>

        {/* Bathrooms & Balconies */}
        <View className="flex-row gap-4">
          <View className="flex-1 gap-3">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name="shower" size={18} color="#008E96" />
              <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Bathrooms</Text>
            </View>
            <TextInput
              keyboardType="numeric"
              placeholder="Count"
              value={bathrooms}
              onChangeText={(val) => updateAdvancedDetails({ bathrooms: val })}
              className="bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-[14px] h-14 px-4 text-[16px]"
              style={{ fontFamily: 'Inter-Medium' }}
            />
          </View>
          <View className="flex-1 gap-3">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name="balcony" size={18} color="#008E96" />
              <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Balconies</Text>
            </View>
            <TextInput
              keyboardType="numeric"
              placeholder="Count"
              value={balconies}
              onChangeText={(val) => updateAdvancedDetails({ balconies: val })}
              className="bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-[14px] h-14 px-4 text-[16px]"
              style={{ fontFamily: 'Inter-Medium' }}
            />
          </View>
        </View>

        {/* Age of Property */}
        <View className="gap-3">
          <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Age of Property</Text>
          <View className="flex-row flex-wrap gap-2">
            {ageOptions.map(option => (
              <TouchableOpacity
                key={option}
                onPress={() => updateAdvancedDetails({ ageOfProperty: option })}
                className={`px-4 py-2 rounded-full border ${ageOfProperty === option ? 'bg-[#008E96] border-[#008E96]' : 'bg-white border-[#E5E7EB]'}`}
              >
                <Text className={`text-xs ${ageOfProperty === option ? 'text-white' : 'text-[#6A7282]'}`} style={{ fontFamily: 'Inter-Medium' }}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tenant Type */}
        <View className="gap-3">
          <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Preferred Tenant</Text>
          <View className="flex-row gap-2">
            {tenantOptions.map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => toggleTenant(type)}
                className={`flex-1 py-3 rounded-xl border-2 items-center ${tenantType.includes(type) ? 'border-[#008E96] bg-[#F0F9F9]' : 'border-[#E5E7EB] bg-white'}`}
              >
                <Text className={`text-sm ${tenantType.includes(type) ? 'text-[#008E96]' : 'text-[#364153]'}`} style={{ fontFamily: 'Inter-Medium' }}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pet Friendly */}
        <View className="gap-3">
          <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Pet Friendly?</Text>
          <View className="flex-row gap-4">
            <TouchableOpacity 
              onPress={() => updateAdvancedDetails({ petFriendly: true })}
              className={`flex-1 py-3 rounded-xl border-2 flex-row items-center justify-center gap-2 ${petFriendly === true ? 'border-[#008E96] bg-[#F0F9F9]' : 'border-[#E5E7EB] bg-white'}`}
            >
              <Ionicons name="checkmark-circle" size={20} color={petFriendly === true ? "#008E96" : "#E5E7EB"} />
              <Text className={`text-sm ${petFriendly === true ? 'text-[#008E96]' : 'text-[#364153]'}`} style={{ fontFamily: 'Inter-Medium' }}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => updateAdvancedDetails({ petFriendly: false })}
              className={`flex-1 py-3 rounded-xl border-2 flex-row items-center justify-center gap-2 ${petFriendly === false ? 'border-[#008E96] bg-[#F0F9F9]' : 'border-[#E5E7EB] bg-white'}`}
            >
              <Ionicons name="close-circle" size={20} color={petFriendly === false ? "#008E96" : "#E5E7EB"} />
              <Text className={`text-sm ${petFriendly === false ? 'text-[#008E96]' : 'text-[#364153]'}`} style={{ fontFamily: 'Inter-Medium' }}>No</Text>
            </TouchableOpacity>
          </View>
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

          <View className="flex-row gap-4">
            <View className="flex-1 gap-2">
              <Text className="text-[12px] text-[#6A7282]" style={{ fontFamily: 'Inter-Medium' }}>Covered Parking</Text>
              <TextInput
                keyboardType="numeric"
                placeholder="0"
                value={postData.advancedDetails.parking.covered.toString()}
                onChangeText={(val) => updateAdvancedDetails({ parking: { ...postData.advancedDetails.parking, covered: parseInt(val) || 0 } })}
                className="bg-white border border-[#E5E7EB] rounded-lg h-10 px-3"
              />
            </View>
            <View className="flex-1 gap-2">
              <Text className="text-[12px] text-[#6A7282]" style={{ fontFamily: 'Inter-Medium' }}>Open Parking</Text>
              <TextInput
                keyboardType="numeric"
                placeholder="0"
                value={postData.advancedDetails.parking.open.toString()}
                onChangeText={(val) => updateAdvancedDetails({ parking: { ...postData.advancedDetails.parking, open: parseInt(val) || 0 } })}
                className="bg-white border border-[#E5E7EB] rounded-lg h-10 px-3"
              />
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

export default AdvancedDetailsStep;
