import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePostProperty } from '../../context/PostPropertyContext';
import { useLookup } from '../../../hooks/useLookup';

const AdvancedDetailsStep = () => {
  const { postData, updateAdvancedDetails, updatePropertyDetails } = usePostProperty();
  const { measurementUnits: measurementUnitsData, facingDirections: facingData, fetchSingleLookup } = useLookup();
  const [showFacingDropdown, setShowFacingDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  useEffect(() => {
    fetchSingleLookup('measurementUnits');
    fetchSingleLookup('facingDirections');
  }, []);

  const { bathrooms, balconies, ageOfProperty, carpetArea, measurementUnit, reraId, facing } = postData.advancedDetails;
  const isResidential = postData.propertyDetails.type === 'Residential';
  const structureType = postData.propertyDetails.structure || '';
  const numBedrooms = parseInt(postData.propertyDetails.bedrooms) || 0;
  
  // Custom logic for bathroom options based on structure type
  let bathroomOptions = [];
  const isStudio = structureType.toLowerCase().includes('studio');
  const isSingleRoom = structureType.toLowerCase() === 'single room';
  const isServantRoom = structureType.toLowerCase().includes('servant');

  if (isStudio) {
    // For Studio, show an input field instead of numbers (handled in UI)
    bathroomOptions = [];
  } else if (isSingleRoom) {
    // For Single Room, fix to 1 bathroom
    bathroomOptions = ['1'];
    // Auto-update if not already 1
    useEffect(() => {
      if (bathrooms !== '1') updateAdvancedDetails({ bathrooms: '1' });
    }, [structureType]);
  } else if (isServantRoom) {
    // For BHK with servant room, show X+1 options (e.g., 2+1, 3+1, 4+1)
    // We show options from 1+1 up to (numBedrooms+1)+1
    const limit = Math.max(4, numBedrooms + 1);
    bathroomOptions = Array.from({ length: limit }, (_, i) => `${i + 1}+1`);
  } else {
    // Standard BHK logic: bedrooms + 1
    bathroomOptions = Array.from({ length: Math.max(4, numBedrooms + 1) }, (_, i) => (i + 1).toString());
  }

  // Conditionally show detailed address and description only if bedroom/structure is filled (for Residential)
  const isBasicsFilled = !isResidential || (postData.propertyDetails.bedrooms && postData.propertyDetails.structure);

  const balconyOptions = ['0', '1', '2', '3'];
  const facingOptions = facingData && facingData.length > 0
    ? facingData.map(f => ({ label: f.label || f.name, value: f.label || f.name }))
    : [
        { label: 'North', value: 'North' },
        { label: 'South', value: 'South' },
        { label: 'East', value: 'East' },
        { label: 'West', value: 'West' },
        { label: 'North-East', value: 'North-East' },
        { label: 'North-West', value: 'North-West' },
        { label: 'South-East', value: 'South-East' },
        { label: 'South-West', value: 'South-West' }
      ];
  const measurementUnits = measurementUnitsData && measurementUnitsData.length > 0 
    ? measurementUnitsData.map(u => ({ label: u.label || u.unit_name || u.name, value: u.label || u.unit_name || u.name }))
    : [
        { label: 'Sq. Ft', value: 'Sq. Ft' },
        { label: 'Sq. Yards', value: 'Sq. Yards' },
        { label: 'Sq. Meter', value: 'Sq. Meter' },
        { label: 'Acre', value: 'Acre' },
        { label: 'Marla', value: 'Marla' },
        { label: 'Kanal', value: 'Kanal' }
      ];

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 24, paddingBottom: 24 }}>
        {/* Info Banner */}
        <View className="bg-[#E6F7F6] p-4 rounded-[14px] border border-[#008E96]/20 flex-row items-start gap-2.5">
          <Ionicons name="information-circle-outline" size={20} color="#008E96" />
          <Text className="text-[12px] text-[#364153] flex-1 leading-[16px]" style={{ fontFamily: 'Inter-Regular' }}>
            Providing accurate details helps buyers make informed decisions and increases response rate
          </Text>
        </View>

        {isResidential && (
          <>
            {/* Bathrooms Selection */}
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="shower" size={18} color="#008E96" />
                <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Bathrooms</Text>
              </View>
              {isStudio ? (
                <View className="bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-[14px] h-14 px-4 flex-row items-center">
                  <TextInput
                    placeholder="Enter number of bathrooms"
                    placeholderTextColor="#A0A0A0"
                    className="flex-1 text-[16px] text-[#101828]"
                    style={{ fontFamily: 'Inter-Medium' }}
                    value={bathrooms}
                    onChangeText={(val) => updateAdvancedDetails({ bathrooms: val })}
                    keyboardType="numeric"
                  />
                </View>
              ) : (
                <View className="flex-row flex-wrap gap-2">
                  {bathroomOptions.map(opt => (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => updateAdvancedDetails({ bathrooms: opt })}
                      className={`h-12 px-4 rounded-xl border items-center justify-center ${bathrooms === opt ? 'bg-[#E6F7F6] border-[#008E96]' : 'bg-white border-[#E5E7EB]'}`}
                      style={{ minWidth: 60 }}
                    >
                      <Text className={`text-sm ${bathrooms === opt ? 'text-[#008E96]' : 'text-[#6A7282]'}`} style={{ fontFamily: 'Inter-Medium' }}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Balconies Selection */}
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="balcony" size={18} color="#008E96" />
                <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Balconies</Text>
              </View>
              <View className="flex-row gap-2">
                {balconyOptions.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => updateAdvancedDetails({ balconies: opt })}
                    className={`flex-1 h-12 rounded-xl border items-center justify-center ${balconies === opt ? 'bg-[#E6F7F7] border-[#008E96]' : 'bg-white border-[#E5E7EB]'}`}
                  >
                    <Text className={`text-sm ${balconies === opt ? 'text-[#008E96]' : 'text-[#6A7282]'}`} style={{ fontFamily: 'Inter-Medium' }}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Age of Property */}
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="calendar-clock" size={18} color="#008E96" />
                <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Property Age (Years)</Text>
              </View>
              <View className="border-b border-[#D1D5DC] pb-2">
                <TextInput
                  placeholder="e.g. 5"
                  placeholderTextColor="#A0A0A0"
                  className="text-base py-1 text-[#101828]"
                  keyboardType="numeric"
                  style={{ fontFamily: 'Inter-Regular' }}
                  value={ageOfProperty}
                  onChangeText={(val) => updateAdvancedDetails({ ageOfProperty: val })}
                />
              </View>
            </View>

            {/* Carpet Area Section */}
            <View className="gap-3 z-[60]">
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="floor-plan" size={18} color="#008E96" />
                <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Carpet Area</Text>
              </View>
              <View className="flex-row gap-4">
                <View className="flex-1 border-b border-[#D1D5DC] pb-2">
                  <TextInput
                    placeholder="Area"
                    placeholderTextColor="#A0A0A0"
                    className="text-base py-1 text-[#101828]"
                    keyboardType="numeric"
                    style={{ fontFamily: 'Inter-Regular' }}
                    value={carpetArea}
                    onChangeText={(val) => updateAdvancedDetails({ carpetArea: val })}
                  />
                </View>
                <View className="w-[120px]">
                  <TouchableOpacity
                    onPress={() => setShowUnitDropdown(!showUnitDropdown)}
                    className="flex-row items-center justify-between bg-[#F3F4F6] px-3 py-2 rounded-lg border border-[#E5E7EB]"
                  >
                    <Text className="text-[#364153] text-sm" style={{ fontFamily: 'Inter-Medium' }}>
                      {measurementUnit || 'Sq. Ft'}
                    </Text>
                    <Ionicons name={showUnitDropdown ? "chevron-up" : "chevron-down"} size={16} color="#6A7282" />
                  </TouchableOpacity>
                  {showUnitDropdown && (
                    <View className="absolute bottom-[45px] left-0 right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-[65] overflow-hidden">
                      {measurementUnits.map((unit, index) => (
                        <TouchableOpacity
                          key={unit.id || `unit-${index}`}
                          onPress={() => {
                            updateAdvancedDetails({ measurementUnit: unit.value });
                            setShowUnitDropdown(false);
                          }}
                          className="px-4 py-3 border-b border-[#F3F4F6]"
                        >
                          <Text className="text-sm text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>{unit.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* RERA ID Section */}
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <Ionicons name="shield-checkmark-outline" size={18} color="#008E96" />
                <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>RERA ID</Text>
              </View>
              <TextInput
                placeholder="RERA Number"
                placeholderTextColor="#A0A0A0"
                className="bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-[14px] h-14 px-4 text-[16px] text-[#101828]"
                style={{ fontFamily: 'Inter-Medium' }}
                value={reraId}
                onChangeText={(val) => updateAdvancedDetails({ reraId: val })}
              />
            </View>

            {/* Facing Dropdown */}
            <View className="gap-3 z-[50]">
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="compass-outline" size={18} color="#008E96" />
                <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Facing</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowFacingDropdown(!showFacingDropdown)}
                className="flex-row items-center justify-between bg-[#F3F4F6] px-4 py-3.5 rounded-xl border border-[#E5E7EB]"
              >
                <Text className="text-[#364153] text-[16px]" style={{ fontFamily: 'Inter-Medium' }}>
                  {facing || 'East'}
                </Text>
                <Ionicons name={showFacingDropdown ? "chevron-up" : "chevron-down"} size={20} color="#6A7282" />
              </TouchableOpacity>
              {showFacingDropdown && (
                <View className="absolute top-[85px] left-0 right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-[55] overflow-hidden">
                  {facingOptions.map((face, index) => (
                    <TouchableOpacity
                      key={face.id || `face-${index}`}
                      onPress={() => {
                        updateAdvancedDetails({ facing: face.value });
                        setShowFacingDropdown(false);
                      }}
                      className="px-4 py-3.5 border-b border-[#F3F4F6]"
                    >
                      <Text className="text-[16px] text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>{face.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Detailed Address Section */}
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <Ionicons name="location-outline" size={18} color="#008E96" />
                <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Detailed Address</Text>
              </View>
              <TextInput
                placeholder="e.g. Flat 101, Sector 45, CHANDIGARH"
                placeholderTextColor="#A0A0A0"
                multiline
                numberOfLines={2}
                className="bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-[14px] py-4 px-4 text-[16px] text-[#101828] text-start"
                style={{ fontFamily: 'Inter-Medium', height: 80 }}
                value={postData.propertyDetails.detailedAddress}
                onChangeText={(val) => updatePropertyDetails({ detailedAddress: val })}
              />
            </View>

            {/* Property Description */}
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <Ionicons name="document-text-outline" size={18} color="#008E96" />
                <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Property Description</Text>
              </View>
              <TextInput
                placeholder="Tell us more about your property..."
                placeholderTextColor="#A0A0A0"
                multiline
                numberOfLines={4}
                className="bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-[14px] py-4 px-4 text-[16px] text-[#101828] text-start"
                style={{ fontFamily: 'Inter-Medium', height: 120, textAlignVertical: 'top' }}
                value={postData.propertyDetails.description}
                onChangeText={(val) => updatePropertyDetails({ description: val })}
              />
            </View>
          </>
        )}

        {/* Commercial Details */}
        {!isResidential && (
          <View className="gap-6">
            {/* Full Address */}
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <Ionicons name="location-outline" size={18} color="#008E96" />
                <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Full Address</Text>
              </View>
              <TextInput
                placeholder="Enter complete address..."
                placeholderTextColor="#A0A0A0"
                multiline
                className="bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-[14px] py-4 px-4 text-[16px] text-[#101828] text-start"
                style={{ fontFamily: 'Inter-Medium', height: 80 }}
                value={postData.propertyDetails.detailedAddress}
                onChangeText={(val) => updatePropertyDetails({ detailedAddress: val })}
              />
            </View>

            {/* About the Property */}
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <Ionicons name="document-text-outline" size={18} color="#008E96" />
                <Text className="text-[14px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>About the Property</Text>
              </View>
              <TextInput
                placeholder="Tell us more about your property..."
                placeholderTextColor="#A0A0A0"
                multiline
                numberOfLines={4}
                className="bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-[14px] py-4 px-4 text-[16px] text-[#101828] text-start"
                style={{ fontFamily: 'Inter-Medium', height: 120, textAlignVertical: 'top' }}
                value={postData.propertyDetails.description}
                onChangeText={(val) => updatePropertyDetails({ description: val })}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default AdvancedDetailsStep;