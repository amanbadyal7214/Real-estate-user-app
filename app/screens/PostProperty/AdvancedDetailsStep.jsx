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
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView contentContainerStyle={{ padding: wp('4.3%'), gap: hp('3%'), paddingBottom: hp('3%') }}>
        {/* Info Banner */}
        <View className="bg-[#E6F7F6] border border-[#008E96]/20 flex-row items-start" style={{ padding: wp('4.3%'), borderRadius: wp('3.7%'), gap: wp('2.7%') }}>
          <Ionicons name="information-circle-outline" size={wp('5.3%')} color="#008E96" />
          <Text style={{ fontWeight: '400', fontSize: wp('3.2%'), lineHeight: hp('2%') }} className="text-[#364153] flex-1">
            Providing accurate details helps buyers make informed decisions and increases response rate
          </Text>
        </View>

        {isResidential && (
          <>
            {/* Bathrooms Selection */}
            <View style={{ gap: hp('1.5%') }}>
              <View className="flex-row items-center" style={{ gap: wp('2.1%') }}>
                <MaterialCommunityIcons name="shower" size={wp('4.8%')} color="#008E96" />
                <Text style={{ fontWeight: '600', fontSize: wp('3.7%') }} className="text-[#101828]">Bathrooms</Text>
              </View>
              {isStudio ? (
                <View className="bg-[#F9FAFB] border-2 border-[#E5E7EB] flex-row items-center" style={{ borderRadius: wp('3.7%'), height: hp('6.9%'), paddingHorizontal: wp('4.3%') }}>
                  <TextInput
                    placeholder="Enter number of bathrooms"
                    placeholderTextColor="#A0A0A0"
                    className="flex-1 text-[#101828]"
                    style={{ fontWeight: '500', fontSize: wp('4.3%') }}
                    value={bathrooms}
                    onChangeText={(val) => updateAdvancedDetails({ bathrooms: val })}
                    keyboardType="numeric"
                  />
                </View>
              ) : (
                <View className="flex-row flex-wrap" style={{ gap: wp('2.1%') }}>
                  {bathroomOptions.map(opt => (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => updateAdvancedDetails({ bathrooms: opt })}
                      className={`border items-center justify-center ${bathrooms === opt ? 'bg-[#E6F7F6] border-[#008E96]' : 'bg-white border-[#E5E7EB]'}`}
                      style={{ height: hp('5.9%'), paddingHorizontal: wp('4.3%'), borderRadius: wp('3.2%'), minWidth: wp('16%') }}
                    >
                      <Text style={{ fontWeight: '500', fontSize: wp('3.7%') }} className={`${bathrooms === opt ? 'text-[#008E96]' : 'text-[#6A7282]'}`}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Balconies Selection */}
            <View style={{ gap: hp('1.5%') }}>
              <View className="flex-row items-center" style={{ gap: wp('2.1%') }}>
                <MaterialCommunityIcons name="balcony" size={wp('4.8%')} color="#008E96" />
                <Text style={{ fontWeight: '600', fontSize: wp('3.7%') }} className="text-[#101828]">Balconies</Text>
              </View>
              <View className="flex-row" style={{ gap: wp('2.1%') }}>
                {balconyOptions.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => updateAdvancedDetails({ balconies: opt })}
                    className={`flex-1 border items-center justify-center ${balconies === opt ? 'bg-[#E6F7F7] border-[#008E96]' : 'bg-white border-[#E5E7EB]'}`}
                    style={{ height: hp('5.9%'), borderRadius: wp('3.2%') }}
                  >
                    <Text style={{ fontWeight: '500', fontSize: wp('3.7%') }} className={`${balconies === opt ? 'text-[#008E96]' : 'text-[#6A7282]'}`}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Age of Property */}
            <View style={{ gap: hp('1.5%') }}>
              <View className="flex-row items-center" style={{ gap: wp('2.1%') }}>
                <MaterialCommunityIcons name="calendar-clock" size={wp('4.8%')} color="#008E96" />
                <Text style={{ fontWeight: '600', fontSize: wp('3.7%') }} className="text-[#101828]">Property Age (Years)</Text>
              </View>
              <View className="border-b border-[#D1D5DC]" style={{ paddingBottom: hp('1%') }}>
                <TextInput
                  placeholder="e.g. 5"
                  placeholderTextColor="#A0A0A0"
                  className="text-[#101828]"
                  keyboardType="numeric"
                  style={{ fontWeight: '400', fontSize: wp('4.3%'), paddingVertical: hp('0.5%') }}
                  value={ageOfProperty}
                  onChangeText={(val) => updateAdvancedDetails({ ageOfProperty: val })}
                />
              </View>
            </View>

            {/* Carpet Area Section */}
            <View className="z-[60]" style={{ gap: hp('1.5%') }}>
              <View className="flex-row items-center" style={{ gap: wp('2.1%') }}>
                <MaterialCommunityIcons name="floor-plan" size={wp('4.8%')} color="#008E96" />
                <Text style={{ fontWeight: '600', fontSize: wp('3.7%') }} className="text-[#101828]">Carpet Area</Text>
              </View>
              <View className="flex-row" style={{ gap: wp('4.3%') }}>
                <View className="flex-1 border-b border-[#D1D5DC]" style={{ paddingBottom: hp('1%') }}>
                  <TextInput
                    placeholder="Area"
                    placeholderTextColor="#A0A0A0"
                    className="text-[#101828]"
                    keyboardType="numeric"
                    style={{ fontWeight: '400', fontSize: wp('4.3%'), paddingVertical: hp('0.5%') }}
                    value={carpetArea}
                    onChangeText={(val) => updateAdvancedDetails({ carpetArea: val })}
                  />
                </View>
                <View style={{ width: wp('32%') }}>
                  <TouchableOpacity
                    onPress={() => setShowUnitDropdown(!showUnitDropdown)}
                    className="flex-row items-center justify-between bg-[#F3F4F6] border border-[#E5E7EB]"
                    style={{ paddingHorizontal: wp('3.2%'), paddingVertical: hp('1%'), borderRadius: wp('2.1%') }}
                  >
                    <Text style={{ fontWeight: '500', fontSize: wp('3.7%') }} className="text-[#364153]">
                      {measurementUnit || 'Sq. Ft'}
                    </Text>
                    <Ionicons name={showUnitDropdown ? "chevron-up" : "chevron-down"} size={wp('4.3%')} color="#6A7282" />
                  </TouchableOpacity>
                  {showUnitDropdown && (
                    <View className="absolute left-0 right-0 bg-white border border-[#E5E7EB] shadow-xl z-[65] overflow-hidden" style={{ bottom: hp('5.5%'), borderRadius: wp('3.2%') }}>
                      {measurementUnits.map((unit, index) => (
                        <TouchableOpacity
                          key={unit.id || `unit-${index}`}
                          onPress={() => {
                            updateAdvancedDetails({ measurementUnit: unit.value });
                            setShowUnitDropdown(false);
                          }}
                          className="border-b border-[#F3F4F6]"
                          style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('1.5%') }}
                        >
                          <Text style={{ fontWeight: '500', fontSize: wp('3.7%') }} className="text-[#364153]">{unit.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* RERA ID Section */}
            <View style={{ gap: hp('1.5%') }}>
              <View className="flex-row items-center" style={{ gap: wp('2.1%') }}>
                <Ionicons name="shield-checkmark-outline" size={wp('4.8%')} color="#008E96" />
                <Text style={{ fontWeight: '600', fontSize: wp('3.7%') }} className="text-[#101828]">RERA ID</Text>
              </View>
              <TextInput
                placeholder="RERA Number"
                placeholderTextColor="#A0A0A0"
                className="bg-[#F9FAFB] border-2 border-[#E5E7EB] text-[#101828]"
                style={{ fontWeight: '500', borderRadius: wp('3.7%'), height: hp('6.9%'), paddingHorizontal: wp('4.3%'), fontSize: wp('4.3%') }}
                value={reraId}
                onChangeText={(val) => updateAdvancedDetails({ reraId: val })}
              />
            </View>

            {/* Facing Dropdown */}
            <View className="z-[50]" style={{ gap: hp('1.5%') }}>
              <View className="flex-row items-center" style={{ gap: wp('2.1%') }}>
                <MaterialCommunityIcons name="compass-outline" size={wp('4.8%')} color="#008E96" />
                <Text style={{ fontWeight: '600', fontSize: wp('3.7%') }} className="text-[#101828]">Facing</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowFacingDropdown(!showFacingDropdown)}
                className="flex-row items-center justify-between bg-[#F3F4F6] border border-[#E5E7EB]"
                style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('1.7%'), borderRadius: wp('3.2%') }}
              >
                <Text style={{ fontWeight: '500', fontSize: wp('4.3%') }} className="text-[#364153]">
                  {facing || 'East'}
                </Text>
                <Ionicons name={showFacingDropdown ? "chevron-up" : "chevron-down"} size={wp('5.3%')} color="#6A7282" />
              </TouchableOpacity>
              {showFacingDropdown && (
                <View className="absolute left-0 right-0 bg-white border border-[#E5E7EB] shadow-xl z-[55] overflow-hidden" style={{ top: hp('10.5%'), borderRadius: wp('3.2%') }}>
                  {facingOptions.map((face, index) => (
                    <TouchableOpacity
                      key={face.id || `face-${index}`}
                      onPress={() => {
                        updateAdvancedDetails({ facing: face.value });
                        setShowFacingDropdown(false);
                      }}
                      className="border-b border-[#F3F4F6]"
                      style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('1.7%') }}
                    >
                      <Text style={{ fontWeight: '500', fontSize: wp('4.3%') }} className="text-[#364153]">{face.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Detailed Address Section */}
            <View style={{ gap: hp('1.5%') }}>
              <View className="flex-row items-center" style={{ gap: wp('2.1%') }}>
                <Ionicons name="location-outline" size={wp('4.8%')} color="#008E96" />
                <Text style={{ fontWeight: '600', fontSize: wp('3.7%') }} className="text-[#101828]">Detailed Address</Text>
              </View>
              <TextInput
                placeholder="e.g. Flat 101, Sector 45, CHANDIGARH"
                placeholderTextColor="#A0A0A0"
                multiline
                numberOfLines={2}
                className="bg-[#F9FAFB] border-2 border-[#E5E7EB] text-[#101828] text-start"
                style={{ fontWeight: '500', height: hp('9.9%'), borderRadius: wp('3.7%'), paddingVertical: hp('2%'), paddingHorizontal: wp('4.3%'), fontSize: wp('4.3%') }}
                value={postData.propertyDetails.detailedAddress}
                onChangeText={(val) => updatePropertyDetails({ detailedAddress: val })}
              />
            </View>

            {/* Property Description */}
            <View style={{ gap: hp('1.5%') }}>
              <View className="flex-row items-center" style={{ gap: wp('2.1%') }}>
                <Ionicons name="document-text-outline" size={wp('4.8%')} color="#008E96" />
                <Text style={{ fontWeight: '600', fontSize: wp('3.7%') }} className="text-[#101828]">Property Description</Text>
              </View>
              <TextInput
                placeholder="Tell us more about your property..."
                placeholderTextColor="#A0A0A0"
                multiline
                numberOfLines={4}
                className="bg-[#F9FAFB] border-2 border-[#E5E7EB] text-[#101828] text-start"
                style={{ fontWeight: '500', height: hp('14.8%'), textAlignVertical: 'top', borderRadius: wp('3.7%'), paddingVertical: hp('2%'), paddingHorizontal: wp('4.3%'), fontSize: wp('4.3%') }}
                value={postData.propertyDetails.description}
                onChangeText={(val) => updatePropertyDetails({ description: val })}
              />
            </View>
          </>
        )}

        {/* Commercial Details */}
        {!isResidential && (
          <View style={{ gap: hp('3%') }}>
            {/* Full Address */}
            <View style={{ gap: hp('1.5%') }}>
              <View className="flex-row items-center" style={{ gap: wp('2.1%') }}>
                <Ionicons name="location-outline" size={wp('4.8%')} color="#008E96" />
                <Text style={{ fontWeight: '600', fontSize: wp('3.7%') }} className="text-[#101828]">Full Address</Text>
              </View>
              <TextInput
                placeholder="Enter complete address..."
                placeholderTextColor="#A0A0A0"
                multiline
                className="bg-[#F9FAFB] border-2 border-[#E5E7EB] text-[#101828] text-start"
                style={{ fontWeight: '500', height: hp('9.9%'), borderRadius: wp('3.7%'), paddingVertical: hp('2%'), paddingHorizontal: wp('4.3%'), fontSize: wp('4.3%') }}
                value={postData.propertyDetails.detailedAddress}
                onChangeText={(val) => updatePropertyDetails({ detailedAddress: val })}
              />
            </View>

            {/* About the Property */}
            <View style={{ gap: hp('1.5%') }}>
              <View className="flex-row items-center" style={{ gap: wp('2.1%') }}>
                <Ionicons name="document-text-outline" size={wp('4.8%')} color="#008E96" />
                <Text style={{ fontWeight: '600', fontSize: wp('3.7%') }} className="text-[#101828]">About the Property</Text>
              </View>
              <TextInput
                placeholder="Tell us more about your property..."
                placeholderTextColor="#A0A0A0"
                multiline
                numberOfLines={4}
                className="bg-[#F9FAFB] border-2 border-[#E5E7EB] text-[#101828] text-start"
                style={{ fontWeight: '500', height: hp('14.8%'), textAlignVertical: 'top', borderRadius: wp('3.7%'), paddingVertical: hp('2%'), paddingHorizontal: wp('4.3%'), fontSize: wp('4.3%') }}
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