import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {  SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { usePostProperty } from '../../context/PostPropertyContext';
import { useLookup } from '../../../hooks/useLookup';
import PriceDetailsSection from './PriceDetailsSection';
import PhotosStep from './PhotosStep';
import AdvancedDetailsStep from './AdvancedDetailsStep';
import VerifyPropertyStep from './VerifyPropertyStep';



// All items from Furnishings screen to match icons exactly
const allFurnishingOptions = [
  // Flat Furnishings
  { name: 'Fridge', icon: 'kitchen', provider: 'MaterialIcons' },
  { name: 'Sofa', icon: 'chair', provider: 'MaterialCommunityIcons' },
  { name: 'Washing Machine', icon: 'local-laundry-service', provider: 'MaterialIcons' },
  { name: 'Cupboard', icon: 'closet', provider: 'MaterialCommunityIcons' },
  { name: 'Microwave', icon: 'microwave', provider: 'MaterialIcons' },
  { name: 'Stove', icon: 'stove', provider: 'MaterialCommunityIcons' },
  { name: 'Dining Table', icon: 'restaurant', provider: 'MaterialIcons' },
  { name: 'Water Purifier', icon: 'water-drop', provider: 'MaterialIcons' },
  { name: 'Modular Kitchen', icon: 'kitchen', provider: 'MaterialIcons' },
  // Society Amenities
  { name: 'Swimming Pool', icon: 'pool', provider: 'MaterialIcons' },
  { name: 'Gym', icon: 'fitness-center', provider: 'MaterialIcons' },
  { name: 'Lift', icon: 'elevator', provider: 'MaterialIcons' },
  { name: 'Power Backup', icon: 'electric-bolt', provider: 'MaterialIcons' },
  { name: 'Intercom', icon: 'contact-phone', provider: 'MaterialIcons' },
  { name: 'Garden', icon: 'park', provider: 'MaterialIcons' },
  { name: 'Sports', icon: 'sports-basketball', provider: 'MaterialIcons' },
  { name: 'Kids Area', icon: 'child-care', provider: 'MaterialIcons' },
  { name: 'Community Hall', icon: 'groups', provider: 'MaterialIcons' },
  { name: 'Gated Community', icon: 'security', provider: 'MaterialIcons' },
  { name: 'Regular Water Supply', icon: 'opacity', provider: 'MaterialIcons' },
  { name: 'Club House', icon: 'nightlife', provider: 'MaterialIcons' },
  { name: 'CCTV', icon: 'videocam', provider: 'MaterialIcons' },
  { name: 'Attached Balcony', icon: 'balcony', provider: 'MaterialIcons' },
  // Counter Items
  { name: 'AC', key: 'AC', icon: 'ac-unit', provider: 'MaterialIcons' },
  { name: 'Bed', key: 'Bed', icon: 'bed', provider: 'MaterialIcons' },
  { name: 'TV', key: 'TV', icon: 'tv', provider: 'MaterialIcons' },
  { name: 'Geyser', key: 'Geyser', icon: 'hot-tub', provider: 'MaterialIcons' },
  { name: 'Wardrobe', key: 'Wardrobe', icon: 'checkroom', provider: 'MaterialIcons' },
];

const RenderIcon = ({ name, size = 32, color = "#008E96" }) => {
  const item = allFurnishingOptions.find(o => o.name === name || o.key === name);
  if (!item) return <MaterialIcons name="grid-view" size={size} color={color} />;
  
  const { provider, icon } = item;
  if (provider === 'MaterialCommunityIcons') return <MaterialCommunityIcons name={icon} size={size} color={color} />;
  if (provider === 'MaterialIcons') return <MaterialIcons name={icon} size={size} color={color} />;
  if (provider === 'FontAwesome5') return <FontAwesome5 name={icon} size={size * 0.8} color={color} />;
  if (provider === 'Ionicons') return <Ionicons name={icon} size={size} color={color} />;
  return null;
};

const PropertyDetails = () => {
  const router = useRouter();
  const { postData, updatePropertyDetails, updatePriceDetails } = usePostProperty();
  const { propertyTypes: apiPropertyTypes, subPropertyTypes: apiSubPropertyTypes, categories: apiCategories, measurementUnits, furnishingStatus, fetchLookups, loading: lookupLoading } = useLookup();
  const [currentStep, setCurrentStep] = useState(1);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  useEffect(() => {
    fetchLookups();
  }, []);

  const { expectedPrice, maintenance, isNegotiable } = postData.priceDetails;
  const { 
    type: selectedPropertyType, 
    bhk: selectedBHK, 
    furnishing: selectedFurnish, 
    subPropertyType: selectedSubPropertyType,
    category: selectedCategory 
  } = postData.propertyDetails;

  const setExpectedPrice = (val) => updatePriceDetails({ expectedPrice: val });
  const setMaintenance = (val) => updatePriceDetails({ maintenance: val });
  const setIsNegotiable = (val) => updatePriceDetails({ isNegotiable: val });

  const setSelectedCategory = (val) => updatePropertyDetails({ category: val });
  const setSelectedPropertyType = (val) => {
    updatePropertyDetails({ type: val, subPropertyType: "" }); // Reset sub-type when main type changes
  };
  const setSelectedSubPropertyType = (val) => updatePropertyDetails({ subPropertyType: val });
  const setSelectedBHK = (val) => updatePropertyDetails({ bhk: val });
  const setSelectedFurnish = (val) => updatePropertyDetails({ furnishing: val });
  const setSelectedUnit = (val) => updatePropertyDetails({ measurementUnit: val });

  const propertyTypes = apiPropertyTypes.map(pt => ({
    id: pt._id,
    label: pt.label || pt.name,
    icon: (pt.label || pt.name).toLowerCase().includes('house') ? 'home-outline' : 
          (pt.label || pt.name).toLowerCase().includes('apartment') ? 'business-outline' :
          (pt.label || pt.name).toLowerCase().includes('villa') ? 'rose-outline' : 'layers-outline'
  }));

  const subPropertyTypes = apiSubPropertyTypes
    .filter(sub => !selectedPropertyType || (sub.propertyType?.label === selectedPropertyType || sub.propertyType?.name === selectedPropertyType.toLowerCase()))
    .map(sub => ({
      id: sub._id,
      label: sub.label || sub.name,
      icon: (sub.label || sub.name).toLowerCase().includes('office') ? 'business-outline' : 
            (sub.label || sub.name).toLowerCase().includes('shop') ? 'cart-outline' : 
            (sub.label || sub.name).toLowerCase().includes('apartment') ? 'business-outline' : 'layers-outline'
    }));

  const bhkOptions = ['1 RK', '1 BHK', '1.5 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK'];

  const isFormValid = postData.propertyDetails.category && postData.propertyDetails.type && postData.propertyDetails.locality && expectedPrice.trim().length > 0;

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      {/* Header Background */}
      <View className="absolute top-0 left-0 right-0 h-[230px] bg-[#008E96]">
        <View className="flex-row items-center px-4 mt-12 justify-between">
          <TouchableOpacity onPress={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-[27px]" style={{ fontFamily: 'Inter-Bold' }}>Post Property</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Stepper */}
        <View className="flex-row justify-between px-8 mt-8">
          {[
            { id: 1, label: 'Property Details' },
            { id: 2, label: 'Price Details' },
            { id: 3, label: 'Photos' },
            { id: 4, label: 'Advanced' },
            { id: 5, label: 'Verify' },
          ].map((step) => (
            <View key={step.id} className="items-center">
            <View 
                className={`w-8 h-8 rounded-full items-center justify-center border ${
                  step.id === currentStep ? 'bg-white border-white' : step.id < currentStep ? 'bg-white border-white' : 'bg-white/10 border-white/30'
                }`}
              >
                {step.id < currentStep || (step.id === 1 && currentStep > 1) ? (
                  <Ionicons name="checkmark-sharp" size={18} color="#008E96" />
                ) : (
                  <Text className={`text-xs ${step.id === currentStep ? 'text-[#008E96]' : 'text-white'}`} style={{ fontFamily: step.id === currentStep ? 'Inter-Bold' : 'Inter-Medium' }}>
                    {step.id}
                  </Text>
                )}
              </View>
              <Text className={`text-[9px] mt-2 ${step.id <= currentStep ? 'text-white' : 'text-white/50'}`} style={{ fontFamily: 'Inter-Medium' }}>{step.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Main Card */}
      <View className={`flex-1 ${currentStep === 3 ? 'mt-[180px]' : 'mt-[200px]'} bg-white rounded-t-[32px] mx-4 shadow-xl overflow-hidden mb-2`}>
        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className={currentStep === 3 ? "p-0" : "p-5"}>
            {currentStep === 1 ? (
              <>
                {/* Category Section (Capsules) */}
                <View className="flex-row gap-2 mb-6">
                  {apiCategories.map((cat) => (
                    <TouchableOpacity
                      key={cat._id}
                      onPress={() => setSelectedCategory(cat.label || cat.name)}
                      className={`px-6 py-2 rounded-full border ${selectedCategory === (cat.label || cat.name) ? 'bg-[#008E96] border-[#008E96]' : 'bg-white border-[#E5E7EB]'}`}
                    >
                      <Text className={`text-sm ${selectedCategory === (cat.label || cat.name) ? 'text-white' : 'text-[#6A7282]'}`} style={{ fontFamily: 'Inter-Medium' }}>
                        {cat.label || cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Property Type Section */}
                <Text className="text-[#6A7282] text-sm mb-4" style={{ fontFamily: 'Inter-Medium' }}>Property Type</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                  <View className="flex-row gap-3">
                    {propertyTypes.map((item) => (
                      <TouchableOpacity 
                        key={item.id}
                        onPress={() => setSelectedPropertyType(item.label)}
                        className={`w-[100px] h-[100px] rounded-2xl items-center justify-center border-2 ${selectedPropertyType === item.label ? 'border-[#008E96] bg-[#F0F9F9]' : 'border-[#E5E7EB] bg-white'}`}
                      >
                        <Ionicons name={item.icon} size={28} color={selectedPropertyType === item.label ? '#008E96' : '#99A1AF'} />
                        <Text className={`text-[11px] text-center mt-1.5 px-1 ${selectedPropertyType === item.label ? 'text-[#008E96]' : 'text-[#364153]'}`} style={{ fontFamily: 'Inter-Medium' }}>{item.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                {/* Sub-Property Type Section */}
                {subPropertyTypes.length > 0 && (
                  <>
                    <Text className="text-[#6A7282] text-sm mb-4" style={{ fontFamily: 'Inter-Medium' }}>Sub Property Type</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                      <View className="flex-row gap-3">
                        {subPropertyTypes.map((item) => (
                          <TouchableOpacity 
                            key={item.id}
                            onPress={() => setSelectedSubPropertyType(item.label)}
                            className={`w-[100px] h-[100px] rounded-2xl items-center justify-center border-2 ${selectedSubPropertyType === item.label ? 'border-[#008E96] bg-[#F0F9F9]' : 'border-[#E5E7EB] bg-white'}`}
                          >
                            <Ionicons name={item.icon} size={28} color={selectedSubPropertyType === item.label ? '#008E96' : '#99A1AF'} />
                            <Text className={`text-[11px] text-center mt-1.5 px-1 ${selectedSubPropertyType === item.label ? 'text-[#008E96]' : 'text-[#364153]'}`} style={{ fontFamily: 'Inter-Medium' }}>{item.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </>
                )}

                {/* Inputs Section */}
                <View className="border-b border-[#D1D5DC] pb-2 mb-6">
                  <TextInput 
                    placeholder="Building/ Project/ Society (Optional)" 
                    placeholderTextColor="#A0A0A0"
                    className="text-base py-1"
                    style={{ fontFamily: 'Inter-Regular' }}
                    value={postData.propertyDetails.buildingName}
                    onChangeText={(val) => updatePropertyDetails({ buildingName: val })}
                  />
                </View>

                <View className="border-b border-[#D1D5DC] pb-2 mb-6">
                  <TextInput 
                    placeholder="Enter Locality" 
                    placeholderTextColor="#A0A0A0"
                    className="text-base py-1"
                    style={{ fontFamily: 'Inter-Regular' }}
                    value={postData.propertyDetails.locality}
                    onChangeText={(val) => updatePropertyDetails({ locality: val })}
                  />
                </View>

                {/* BHK Section */}
                <Text className="text-[#6A7282] text-sm mb-4" style={{ fontFamily: 'Inter-Medium' }}>BHK</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                  <View className="flex-row gap-3">
                    {bhkOptions.map((option) => (
                      <TouchableOpacity 
                        key={option}
                        onPress={() => setSelectedBHK(option)}
                        className={`px-6 py-3 rounded-2xl border-2 ${selectedBHK === option ? 'border-[#008E96] bg-[#F0F9F9]' : 'border-[#E5E7EB] bg-white'}`}
                      >
                        <Text className={`text-base ${selectedBHK === option ? 'text-[#008E96]' : 'text-[#364153]'}`} style={{ fontFamily: 'Inter-Medium' }}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                {/* Built Up Area Section */}
                <Text className="text-[#6A7282] text-sm mb-2" style={{ fontFamily: 'Inter-Medium' }}>Built Up Area</Text>
                <View className="z-50">
                  <View className="flex-row items-center border-b border-[#D1D5DC] pb-2 mb-2">
                    <TextInput 
                      placeholder="Built Up Area" 
                      placeholderTextColor="#A0A0A0"
                      className="flex-1 text-base py-1"
                      keyboardType="numeric"
                      style={{ fontFamily: 'Inter-Regular' }}
                      value={postData.propertyDetails.builtUpArea}
                      onChangeText={(val) => updatePropertyDetails({ builtUpArea: val })}
                    />
                    <TouchableOpacity 
                      onPress={() => setShowUnitDropdown(!showUnitDropdown)}
                      className="flex-row items-center ml-2 bg-[#F3F4F6] px-3 py-1.5 rounded-lg"
                    >
                      <Text className="text-[#364153] text-sm mr-1" style={{ fontFamily: 'Inter-Medium' }}>
                        {postData.propertyDetails.measurementUnit || (measurementUnits[0]?.label || measurementUnits[0]?.name || 'sq. ft.')}
                      </Text>
                      <Ionicons name={showUnitDropdown ? "chevron-up" : "chevron-down"} size={16} color="#6A7282" />
                    </TouchableOpacity>
                  </View>

                  {showUnitDropdown && (
                    <View className="absolute top-[45px] right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-xl w-[150px] overflow-hidden">
                      {measurementUnits.map((unit) => (
                        <TouchableOpacity
                          key={unit._id}
                          onPress={() => {
                            setSelectedUnit(unit.label || unit.name);
                            setShowUnitDropdown(false);
                          }}
                          className={`px-4 py-3 border-b border-[#F3F4F6] ${(postData.propertyDetails.measurementUnit === (unit.label || unit.name)) ? 'bg-[#F0F9F9]' : 'bg-white'}`}
                        >
                          <Text 
                            className={`text-sm ${(postData.propertyDetails.measurementUnit === (unit.label || unit.name)) ? 'text-[#008E96]' : 'text-[#364153]'}`}
                            style={{ fontFamily: (postData.propertyDetails.measurementUnit === (unit.label || unit.name)) ? 'Inter-Bold' : 'Inter-Medium' }}
                          >
                            {unit.label || unit.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Vertical margin to prevent overlap when dropdown is open */}
                <View className="mb-4" />

                {/* Furnish Type Section */}
                <Text className="text-[#6A7282] text-sm mb-4" style={{ fontFamily: 'Inter-Medium' }}>Furnish Type</Text>
                <View className="flex-row gap-3 mb-8">
                  {furnishingStatus.map((status) => (
                    <TouchableOpacity 
                      key={status._id}
                      onPress={() => setSelectedFurnish(status.label || status.name)}
                      className={`flex-1 py-4 rounded-2xl items-center border-2 ${selectedFurnish === (status.label || status.name) ? 'border-[#008E96] bg-[#F0F9F9]' : 'border-[#E5E7EB] bg-white'}`}
                    >
                      <Text className={`text-base ${selectedFurnish === (status.label || status.name) ? 'text-[#008E96]' : 'text-[#364153]'}`} style={{ fontFamily: 'Inter-Medium' }}>{status.label || status.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity 
                  onPress={() => router.push('/screens/PostProperty/Furnishings')}
                 
                >
                  <Text className="text-[#008E96] text-base text-center" style={{ fontFamily: 'Inter-Bold' }}>+ Add Furnishings / Amenities</Text>
                  
                  {(postData.furnishings.selectedItems.length > 0 || Object.values(postData.furnishings.counters).some(v => v > 0)) && (
                    <View className="mt-6 flex-row flex-wrap justify-between">
                      {/* Counter Items (AC, Bed etc) */}
                      {Object.entries(postData.furnishings.counters).map(([key, value]) => (
                        value > 0 && (
                          <View key={key} className="w-[31%] aspect-square mb-4 rounded-2xl border-2 border-[#E5E7EB] bg-white items-center justify-center p-2">
                            <RenderIcon name={key} size={32} />
                            <Text className="text-[#364153] text-[10px] mt-2 leading-tight text-center" style={{ fontFamily: 'Inter-Medium' }} numberOfLines={2}>{key}</Text>
                            <View className="absolute top-2 right-2 bg-[#008E96] w-5 h-5 rounded-full items-center justify-center">
                              <Text className="text-white text-[10px] font-bold">{value}</Text>
                            </View>
                          </View>
                        )
                      ))}

                      {/* Selected Items (Wifi, Garden etc) */}
                      {postData.furnishings.selectedItems.map((item, index) => (
                        <View key={index} className="w-[31%] aspect-square  rounded-2xl border-2 border-[#008E96] bg-[#F0F9F9] items-center justify-center p-2">
                          <RenderIcon name={item} size={32} />
                          <Text className="text-[#008E96] text-[10px] mt-2 leading-tight text-center" style={{ fontFamily: 'Inter-Medium' }} numberOfLines={2}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              </>
            ) : currentStep === 2 ? (
              <View className="mb-4">
                <PriceDetailsSection 
                  expectedPrice={expectedPrice}
                  setExpectedPrice={setExpectedPrice}
                  maintenance={maintenance}
                  setMaintenance={setMaintenance}
                  isNegotiable={isNegotiable}
                  setIsNegotiable={setIsNegotiable}
                />
              </View>
            ) : currentStep === 3 ? (
              <PhotosStep />
            ) : currentStep === 4 ? (
              <AdvancedDetailsStep />
            ) : (
              <VerifyPropertyStep />
            )}
          </View>
        </ScrollView>
      </View>

      {/* Fixed Bottom Button Container */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#F3F4F6] p-4 items-center">
         <TouchableOpacity 
          onPress={() => {
            if (currentStep === 1) {
              setCurrentStep(2);
            } else if (currentStep === 2) {
              setCurrentStep(3);
            } else if (currentStep === 3) {
              setCurrentStep(4);
            } else if (currentStep === 4) {
              setCurrentStep(5);
            } else {
              // Final submission or navigate home
            }
          }}
          className={`w-full py-4 rounded-xl items-center shadow-lg ${currentStep === 1 || currentStep === 3 || currentStep === 4 || currentStep === 5 || (currentStep === 2 && isFormValid) ? 'bg-[#008E96]' : 'bg-[#E5E7EB]'}`}
          disabled={currentStep === 2 && !isFormValid}
        >
          <Text className="text-white text-base" style={{ fontFamily: 'Inter-Bold' }}>
            {currentStep === 1 ? 'Next, Add Price' : currentStep === 2 ? 'Next, Add Photos' : currentStep === 3 ? 'Next, Advanced Details' : currentStep === 4 ? 'Review & Verify' : 'Post Property'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PropertyDetails;