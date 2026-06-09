import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useLookup } from '../../../hooks/useLookup';
import { useProperty } from '../../../hooks/useProperty';
import { useProject } from '../../../hooks/useProject';
import api from '../../api';
import { usePostProperty } from '../../context/PostPropertyContext';
import AdvancedDetailsStep from './AdvancedDetailsStep';
import PhotosStep from './PhotosStep';
import PriceDetailsSection from './PriceDetailsSection';
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

const RenderIcon = ({ name, size = 32, color = "#008E96", apiAmenities = [] }) => {
  // Try to find in API amenities first
  const apiItem = apiAmenities.find(a => a.label === name || a.name === name);
  if (apiItem) {
    return <MaterialIcons name={apiItem.icon || 'grid-view'} size={size} color={color} />;
  }

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
  const { isEditMode, editPropertyId } = useLocalSearchParams();
  const { postData, setPostData, resetPostData, updatePropertyDetails, updatePriceDetails } = usePostProperty();
  const { 
    propertyTypes: apiPropertyTypes, 
    subPropertyTypes: apiSubPropertyTypes, 
    categories: apiCategories, 
    measurementUnits, 
    furnishingStatus,
    possessionStatus,
    constructionStatus,
    zoneTypes,
    locationHubs,
    ownershipTypes,
    amenities: apiAmenities,
    structures: apiStructures,
    fetchLookups, 
    loading: lookupLoading 
  } = useLookup();
  const { saveProperty, loading: isSaving } = useProperty();
  const { fetchProjects, loading: projectsLoading } = useProject();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [loadingProjectSuggestions, setLoadingProjectSuggestions] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showStructureDropdown, setShowStructureDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);
  const [showHubDropdown, setShowHubDropdown] = useState(false);
  const [showOwnershipDropdown, setShowOwnershipDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [countries, setCountries] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [localitySuggestions, setLocalitySuggestions] = useState([]);
  const [loadingLocalitySuggestions, setLoadingLocalitySuggestions] = useState(false);
  const [loadingEditData, setLoadingEditData] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentLocality = postData.propertyDetails.locality;
      if (currentLocality && currentLocality.trim().length > 1) {
        searchLocalities();
      } else {
        setLocalitySuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [postData.propertyDetails.locality]);

  const searchLocalities = async () => {
    try {
      setLoadingLocalitySuggestions(true);
      const cityParam = (typeof postData.propertyDetails.city === 'string' && postData.propertyDetails.city.trim())
        ? postData.propertyDetails.city.trim().toLowerCase()
        : 'mohali';

      const response = await api.get(`/localities`, {
        params: { city: cityParam }
      });
      
      if (response.data?.success) {
        const query = postData.propertyDetails.locality.toLowerCase();
        const filtered = response.data.data.filter(item => 
          item.name.toLowerCase().includes(query) ||
          item.label.toLowerCase().includes(query)
        );
        setLocalitySuggestions(filtered);
      }
    } catch (err) {
      console.error("Error searching localities:", err);
    } finally {
      setLoadingLocalitySuggestions(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentBuilding = postData.propertyDetails.buildingName;
      if (currentBuilding && currentBuilding.trim().length > 1) {
        searchProjects();
      } else {
        setProjectSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [postData.propertyDetails.buildingName]);

  const searchProjects = async () => {
    try {
      setLoadingProjectSuggestions(true);
      const cityParam = (typeof postData.propertyDetails.city === 'string' && postData.propertyDetails.city.trim())
        ? postData.propertyDetails.city.trim().toLowerCase()
        : 'mohali';

      const response = await fetchProjects({ city: cityParam });
      
      if (response?.success) {
        const query = postData.propertyDetails.buildingName.toLowerCase();
        const filtered = response.data.filter(item => 
          (item.projectName || item.name || '').toLowerCase().includes(query)
        );
        setProjectSuggestions(filtered);
      }
    } catch (err) {
      console.error("Error searching projects:", err);
    } finally {
      setLoadingProjectSuggestions(false);
    }
  };


  useEffect(() => {
    checkAuth();
    fetchLookups();
  }, []);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString('en-GB'); // DD/MM/YYYY
      updatePropertyDetails({ availableFrom: formattedDate });
    }
  };

  const getCurrentLocation = async () => {
    // getCurrentLocation functionality commented out per request.
    // Original implementation retained below for reference.
    /*
    try {
      setIsLocating(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        updatePropertyDetails({
          locality: address.district || address.subregion || address.name || "",
          city: address.city || address.subregion || "",
          state: address.region || "",
          country: address.country || "",
          pincode: address.postalCode || ""
        });
      }
    } catch (error) {
      console.error(error);
      alert('Error fetching location');
    } finally {
      setIsLocating(false);
    }
    */
  };

  const checkAuth = async () => {
    const token = await SecureStore.getItemAsync("token");
    if (!token) {
      router.replace("/screens/PostProperty/Register");
    }
  };

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

  const parkingStatusOptions = ['Included', 'Separate'];

  const selectedCountryId = postData.propertyDetails.countryId;
  const selectedStateId = postData.propertyDetails.stateId;
  const selectedCountry = postData.propertyDetails.country;
  const selectedState = postData.propertyDetails.state;
  const availableStates = statesList || [];
  const availableCities = citiesList || [];

  const fetchCountries = async () => {
    try {
      const res = await api.get('/geo/countries');
      const data = res.data?.data ?? res.data;
      setCountries(data || []);
    } catch (err) {
      console.error('Error fetching countries', err);
    }
  };

  const fetchStates = async (countryId) => {
    if (!countryId) return;
    try {
      const res = await api.get('/geo/states', { params: { country: countryId } });
      const data = res.data?.data ?? res.data;
      setStatesList(data || []);
    } catch (err) {
      console.error('Error fetching states', err);
    }
  };

  const fetchCities = async (stateId) => {
    if (!stateId) return;
    try {
      const res = await api.get('/geo/cities', { params: { state: stateId } });
      const data = res.data?.data ?? res.data;
      setCitiesList(data || []);
    } catch (err) {
      console.error('Error fetching cities', err);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    const initForm = async () => {
      if (isEditMode === 'true' && editPropertyId) {
        try {
          setLoadingEditData(true);
          const response = await api.get(`/properties/${editPropertyId}`);
          if (response.data?.success) {
            const prop = response.data.data || response.data.property || response.data;
            
            // Map the property details back into the postData format
            const mappedDetails = {
              category: prop.category?.label || prop.category?.name || prop.category || '',
              type: prop.propertyType?.label || prop.propertyType?.name || prop.propertyType || '',
              subPropertyType: prop.subPropertyType?.label || prop.subPropertyType?.name || prop.subPropertyType || '',
              title: prop.name || prop.title || '',
              bhk: prop.residential?.bedrooms?.toString() || prop.bedrooms?.toString() || prop.bhk?.toString() || '',
              builtUpArea: prop.builtUpArea?.toString() || '',
              measurementUnit: prop.areaUnit?.label || prop.areaUnit?.name || prop.areaUnit || '',
              buildingName: prop.projectName || prop.projectSociety || '',
              locality: prop.locality?.name || prop.locality?.label || prop.locality || '',
              localityId: prop.locality?._id || (typeof prop.locality === 'string' ? prop.locality : ''),
              city: prop.city?.name || prop.city?.label || prop.city || '',
              cityId: prop.city?._id || (typeof prop.city === 'string' ? prop.city : ''),
              state: prop.state?.name || prop.state?.label || prop.state || '',
              stateId: prop.state?._id || (typeof prop.state === 'string' ? prop.state : ''),
              country: prop.country?.name || prop.country?.label || prop.country || '',
              countryId: prop.country?._id || (typeof prop.country === 'string' ? prop.country : ''),
              projectId: prop.project?._id || '',
              furnishing: prop.furnishingStatus?.label || prop.furnishingStatus?.name || prop.furnishingStatus || '',
              description: prop.description || '',
              address: prop.address || '',
              structure: prop.structure?.label || prop.structure?.name || prop.structure || '',
              constructionStatus: prop.constructionStatus?.label || prop.constructionStatus?.name || prop.constructionStatus || '',
              possessionStatus: prop.possessionStatus?.label || prop.possessionStatus?.name || prop.possessionStatus || '',
              zoneType: prop.zoneType?.label || prop.zoneType?.name || prop.zoneType || '',
              locationHub: prop.locationHub?.label || prop.locationHub?.name || prop.locationHub || '',
              ownershipType: prop.ownershipType?.label || prop.ownershipType?.name || prop.ownershipType || '',
              propertyCondition: prop.propertyCondition || '',
            };

            // Map amenities back to furnishings
            const selectedItems = [];
            const counters = { AC: 0, Bed: 0, TV: 0, Geyser: 0, Wardrobe: 0 };
            
            if (prop.amenities && Array.isArray(prop.amenities)) {
              prop.amenities.forEach(item => {
                const amenityObj = item.amenity || {};
                const name = amenityObj.label || amenityObj.name || '';
                const count = item.count || 1;
                if (name) {
                  if (name in counters) {
                    counters[name] = count;
                  } else {
                    selectedItems.push(name);
                  }
                }
              });
            }

            const mappedPrice = {
              expectedPrice: prop.price?.toString() || prop.monthlyRent?.toString() || '',
              maintenance: prop.maintenance?.toString() || '',
              securityDeposit: prop.securityDeposit?.toString() || prop.securityDepositAmount?.toString() || '',
              isNegotiable: !!prop.isNegotiable,
              availableFrom: prop.availableFrom || '',
            };

            const mappedAdvanced = {
              floor: prop.residential?.floor?.toString() || prop.floor?.toString() || '',
              totalFloors: prop.residential?.totalFloors?.toString() || prop.totalFloors?.toString() || '',
              bathrooms: prop.residential?.bathrooms?.toString() || prop.bathrooms?.toString() || '',
              balconies: prop.residential?.balconies?.toString() || prop.balconies?.toString() || '',
              ageOfProperty: prop.ageOfProperty?.toString() || '',
              parking: {
                covered: prop.parking?.covered || 0,
                open: prop.parking?.open || 0
              },
              tenantType: prop.tenantType || [],
              petFriendly: prop.petFriendly !== undefined ? prop.petFriendly : null,
            };

            const mappedPhotos = (prop.images || []).map(img => ({ uri: img }));

            setPostData({
              propertyDetails: mappedDetails,
              furnishings: { selectedItems, counters },
              priceDetails: mappedPrice,
              advancedDetails: mappedAdvanced,
              photos: mappedPhotos
            });

            // Pre-fetch geographical state/city lists
            if (prop.country?._id) {
              fetchStates(prop.country._id);
            }
            if (prop.state?._id) {
              fetchCities(prop.state._id);
            }
          }
        } catch (err) {
          console.error("Error loading property for edit:", err);
        } finally {
          setLoadingEditData(false);
        }
      } else {
        resetPostData();
      }
    };
    initForm();
  }, [isEditMode, editPropertyId]);

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



  const isFormValid = postData.propertyDetails.category && postData.propertyDetails.type && postData.propertyDetails.locality && expectedPrice?.toString().trim().length > 0;

  const isStep1Valid = postData.propertyDetails.category && postData.propertyDetails.type && postData.propertyDetails.locality;

  const handlePostProperty = async () => {
    try {
      // Map postData to the format expected by saveProperty
      const formData = {
        name: postData.propertyDetails.title,
        country: postData.propertyDetails.countryId || postData.propertyDetails.country,
        state: postData.propertyDetails.stateId || postData.propertyDetails.state,
        city: postData.propertyDetails.cityId || postData.propertyDetails.city,
        locality: postData.propertyDetails.localityId || postData.propertyDetails.locality,
        pincode: postData.propertyDetails.pincode,
        address: postData.propertyDetails.address || postData.propertyDetails.locality,
        propertyType: apiPropertyTypes.find(t => (t.label || t.name) === postData.propertyDetails.type)?._id,
        category: apiCategories.find(c => (c.label || c.name) === postData.propertyDetails.category)?._id,
        subPropertyType: apiSubPropertyTypes.find(s => (s.label || s.name) === postData.propertyDetails.subPropertyType)?._id,
        price: postData.priceDetails.expectedPrice,
        monthlyRent: postData.priceDetails.expectedPrice, // for isRent logic
        securityDeposit: postData.priceDetails.securityDeposit,
        securityDepositAmount: postData.priceDetails.securityDeposit, // for isRent logic
        availableFrom: postData.priceDetails.availableFrom,
        constructionStatus: constructionStatus.find(s => (s.label || s.name) === postData.propertyDetails.constructionStatus)?._id,
        possessionStatus: possessionStatus.find(s => (s.label || s.name) === postData.propertyDetails.possessionStatus)?._id,
        amenities: [
          ...postData.furnishings.selectedItems.map(item => ({
            amenity: apiAmenities.find(a => (a.label || a.name) === item)?._id,
            count: 1
          })).filter(a => a.amenity),
          ...Object.entries(postData.furnishings.counters)
            .filter(([_, count]) => count > 0)
            .map(([key, count]) => ({
              amenity: apiAmenities.find(a => (a.label || a.name) === key)?._id,
              count: count
            })).filter(a => a.amenity)
        ],
        projectSociety: postData.propertyDetails.projectId || postData.propertyDetails.buildingName,
        images: postData.photos.map(photo => photo.base64 || photo.uri).filter(Boolean),
        description: postData.propertyDetails.description,
        carpetArea: postData.propertyDetails.builtUpArea, // reused builtUpArea as carpet area if carpet not available
        builtUpArea: postData.propertyDetails.builtUpArea,
        areaUnit: measurementUnits.find(u => (u.label || u.name) === postData.propertyDetails.measurementUnit)?._id,
        
        // Residential fields
        bedrooms: postData.propertyDetails.bedrooms,
        bathrooms: postData.advancedDetails.bathrooms,
        balconies: postData.advancedDetails.balconies,
        floor: postData.propertyDetails.floor || postData.advancedDetails.floor,
        totalFloors: postData.propertyDetails.totalFloors || postData.advancedDetails.totalFloors,
        furnishingStatus: furnishingStatus.find(s => (s.label || s.name) === postData.propertyDetails.furnishing)?._id,
        structure: apiStructures.find(s => (s.label || s.name) === postData.propertyDetails.structure)?._id,

        // Commercial fields
        noOfMeetingRooms: postData.advancedDetails.meetingRooms, // assuming name in context
        zoneType: zoneTypes.find(z => (z.label || z.name) === postData.propertyDetails.zoneType)?._id,
        locationHub: locationHubs.find(l => (l.label || l.name) === postData.propertyDetails.locationHub)?._id,
        propertyCondition: postData.propertyDetails.propertyCondition,
        ownershipType: ownershipTypes.find(o => (o.label || o.name) === postData.propertyDetails.ownershipType)?._id
      };

      const res = await saveProperty(formData, {
        isEditMode: isEditMode === 'true',
        editPropertyId: editPropertyId,
        isRent: postData.propertyDetails.category?.toLowerCase().includes('rent'),
        isResidential: postData.propertyDetails.type?.toLowerCase().includes('residential'),
        isCommercial: postData.propertyDetails.type?.toLowerCase().includes('commercial'),
        getSubPropertyTypeName: postData.propertyDetails.subPropertyType
      });

      if (res.success) {
        alert("Property posted successfully!");
        router.replace("/(tabs)");
      } else {
        alert(res.error || "Failed to post property");
      }
    } catch (err) {
      alert(err.message || "Network error");
      console.error(err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      {(lookupLoading || loadingEditData) && currentStep === 1 && (
        <View className="absolute inset-0 bg-white/80 z-[999] items-center justify-center">
          <ActivityIndicator size="large" color="#008E96" />
          <Text className="text-[#008E96] font-inter-semibold mt-4">Loading listing details...</Text>
        </View>
      )}
      {/* Header Background */}
      <View className="absolute top-0 left-0 right-0 h-[230px] bg-[#008E96]">
        <View className="flex-row items-center px-4 mt-12 justify-between">
          <TouchableOpacity
            onPress={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/screens/PostProperty/MyProperties');
                }
              }
            }}
          >
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
                {/* Category Section (Buttons) */}
                <View className="flex-row gap-3 mb-6">
                  {apiCategories.map((cat) => (
                    <TouchableOpacity
                      key={cat._id}
                      onPress={() => setSelectedCategory(cat.label || cat.name)}
                      className={`flex-1 py-4 rounded-2xl items-center border-2 ${selectedCategory === (cat.label || cat.name) ? 'border-[#008E96] bg-[#F0F9F9]' : 'border-[#E5E7EB] bg-white'}`}
                    >
                      <Text className={`text-base ${selectedCategory === (cat.label || cat.name) ? 'text-[#008E96]' : 'text-[#364153]'}`} style={{ fontFamily: 'Inter-Medium' }}>
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
                    placeholder="Property Title (e.g. 2BHK Apartment in Sector 45)" 
                    placeholderTextColor="#A0A0A0"
                    className="text-base py-1"
                    style={{ fontFamily: 'Inter-Regular' }}
                    value={postData.propertyDetails.title}
                    onChangeText={(val) => updatePropertyDetails({ title: val })}
                  />
                </View>

                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-[#6A7282] text-sm" style={{ fontFamily: 'Inter-Medium' }}>Location Details</Text>
                </View>
                {/* Country and Pincode Section (swapped with City) */}
                <View className="flex-row gap-4 mb-6">
                  <View className="flex-1">
                    <TouchableOpacity 
                      onPress={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex-row items-center justify-between bg-[#F3F4F6] px-3 py-3 rounded-lg border border-[#E5E7EB]"
                    >
                      <Text className="text-[#364153] text-sm" style={{ fontFamily: 'Inter-Medium' }}>
                        {postData.propertyDetails.country || 'Select Country'}
                      </Text>
                      <Ionicons name={showCountryDropdown ? "chevron-up" : "chevron-down"} size={14} color="#6A7282" />
                    </TouchableOpacity>
                    {showCountryDropdown && (
                      <View className="absolute top-[45px] left-0 right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-[80] overflow-hidden">
                        {countries.map((c) => (
                          <TouchableOpacity
                            key={c._id || c.id || c.name}
                            onPress={() => {
                              const label = c.label || c.name || c.country || c.title || c._id || '';
                              updatePropertyDetails({ country: label, countryId: c._id || c.id, state: '', stateId: '', city: '', cityId: '' });
                              setShowCountryDropdown(false);
                              setStatesList([]);
                              setCitiesList([]);
                              fetchStates(c._id || c.id);
                            }}
                            className="px-4 py-3 border-b border-[#F3F4F6]"
                          >
                            <Text className="text-sm text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>{c.label || c.name || c.country || c.title}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                  <View className="flex-1 border-b border-[#D1D5DC] pb-2">
                    <TextInput 
                      placeholder="Pincode" 
                      placeholderTextColor="#A0A0A0"
                      className="text-base py-1"
                      keyboardType="numeric"
                      style={{ fontFamily: 'Inter-Regular' }}
                      value={postData.propertyDetails.pincode}
                      onChangeText={(val) => updatePropertyDetails({ pincode: val })}
                    />
                  </View>
                </View>

                {/* State and Country Section */}
                <View className="flex-row gap-4 mb-6">
                  <View className="flex-1">
                    {selectedCountryId ? (
                      <>
                        <TouchableOpacity 
                          onPress={() => setShowStateDropdown(!showStateDropdown)}
                          className="flex-row items-center justify-between bg-[#F3F4F6] px-3 py-3 rounded-lg border border-[#E5E7EB]"
                        >
                          <Text className="text-[#364153] text-sm" style={{ fontFamily: 'Inter-Medium' }}>
                            {postData.propertyDetails.state || 'Select State'}
                          </Text>
                          <Ionicons name={showStateDropdown ? "chevron-up" : "chevron-down"} size={14} color="#6A7282" />
                        </TouchableOpacity>
                        {showStateDropdown && (
                          <View className="absolute top-[45px] left-0 right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-[85] overflow-hidden">
                            {(availableStates.length > 0 ? availableStates : []).map((s) => (
                              <TouchableOpacity
                                key={s._id || s.id || s.name}
                                onPress={() => { updatePropertyDetails({ state: s.label || s.name, stateId: s._id || s.id, city: '', cityId: '' }); setShowStateDropdown(false); setCitiesList([]); fetchCities(s._id || s.id); }}
                                className="px-4 py-3 border-b border-[#F3F4F6]"
                              >
                                <Text className="text-sm text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>{s.label || s.name}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </>
                    ) : (
                      <View className="px-3 py-3">
                        <Text className="text-sm text-[#9AA0A6]">Select country first</Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-1">
                    {selectedStateId ? (
                      <>
                        <TouchableOpacity 
                          onPress={() => setShowCityDropdown(!showCityDropdown)}
                          className="flex-row items-center justify-between bg-[#F3F4F6] px-3 py-3 rounded-lg border border-[#E5E7EB]"
                        >
                          <Text className="text-[#364153] text-sm" style={{ fontFamily: 'Inter-Medium' }}>
                            {postData.propertyDetails.city || 'Select City'}
                          </Text>
                          <Ionicons name={showCityDropdown ? "chevron-up" : "chevron-down"} size={14} color="#6A7282" />
                        </TouchableOpacity>
                        {showCityDropdown && (
                          <View className="absolute top-[45px] left-0 right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-[90] overflow-hidden">
                            {(availableCities.length > 0 ? availableCities : []).map((c) => (
                              <TouchableOpacity
                                key={c._id || c.id || c.name}
                                onPress={() => { updatePropertyDetails({ city: c.label || c.name, cityId: c._id || c.id }); setShowCityDropdown(false); }}
                                className="px-4 py-3 border-b border-[#F3F4F6]"
                              >
                                <Text className="text-sm text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>{c.label || c.name}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </>
                    ) : (
                      <View className="px-3 py-3">
                        <Text className="text-sm text-[#9AA0A6]">Select state first</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View className="mb-6" style={{ zIndex: 110 }}>
                  <View className="border-b border-[#D1D5DC] pb-2 flex-row items-center">
                    <TextInput 
                      placeholder="Building/ Project/ Society (Optional)" 
                      placeholderTextColor="#A0A0A0"
                      className="text-base py-1 flex-1"
                      style={{ fontFamily: 'Inter-Regular' }}
                      value={postData.propertyDetails.buildingName}
                      onChangeText={(val) => updatePropertyDetails({ buildingName: val, projectId: '' })}
                    />
                    {loadingProjectSuggestions && <ActivityIndicator size="small" color="#008E96" />}
                  </View>

                  {projectSuggestions.length > 0 && (
                    <View className="absolute top-[40px] left-0 right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-[120] max-h-48 overflow-hidden">
                      <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                        {projectSuggestions.map((item) => (
                          <TouchableOpacity 
                            key={item._id}
                            onPress={() => {
                              updatePropertyDetails({ 
                                buildingName: item.projectName || item.name,
                                projectId: item._id 
                              });
                              setProjectSuggestions([]);
                            }}
                            className="px-4 py-3 border-b border-[#F3F4F6] flex-row items-center gap-2"
                          >
                            <Ionicons name="business-outline" size={16} color="#6A7282" />
                            <View className="flex-1">
                              <Text style={{ fontFamily: 'Inter-Medium' }} className="text-sm text-[#364153]">
                                {item.projectName || item.name}
                              </Text>
                              {item.locality && (
                                <Text className="text-[11px] text-[#6A7282]" style={{ fontFamily: 'Inter-Regular' }}>
                                  {item.locality?.name || item.locality}
                                </Text>
                              )}
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                  <View className="mb-6" style={{ zIndex: 100 }}>
                    <View className="border-b border-[#D1D5DC] pb-2 flex-row items-center">
                      <TextInput 
                        placeholder="Enter Locality" 
                        placeholderTextColor="#A0A0A0"
                        className="text-base py-1 flex-1"
                        style={{ fontFamily: 'Inter-Regular' }}
                        value={postData.propertyDetails.locality}
                        onChangeText={(val) => updatePropertyDetails({ locality: val, localityId: '' })}
                      />
                      {loadingLocalitySuggestions && <ActivityIndicator size="small" color="#008E96" />}
                    </View>

                    {localitySuggestions.length > 0 && (
                      <View className="absolute top-[40px] left-0 right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-[110] max-h-48 overflow-hidden">
                        <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                          {localitySuggestions.map((item) => (
                            <TouchableOpacity 
                              key={item._id}
                              onPress={() => {
                                updatePropertyDetails({ 
                                  locality: item.name,
                                  localityId: item._id 
                                });
                                setLocalitySuggestions([]);
                              }}
                              className="px-4 py-3 border-b border-[#F3F4F6] flex-row items-center gap-2"
                            >
                              <Ionicons name="location-outline" size={16} color="#6A7282" />
                              <Text style={{ fontFamily: 'Inter-Medium' }} className="text-sm text-[#364153]">
                                {item.name}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>

                {selectedPropertyType === 'Residential' ? (
                  <>
                    {/* Bedroom & Structure Section */}
                    <Text className="text-[#6A7282] text-sm mb-2" style={{ fontFamily: 'Inter-Medium' }}>Bedroom & Structure</Text>
                    <View className="flex-row gap-4 mb-6 z-[60]">
                      <View className="flex-1 border-b border-[#D1D5DC] pb-2">
                        <TextInput 
                          placeholder="No. of Bedrooms" 
                          placeholderTextColor="#A0A0A0"
                          className="text-base py-1"
                          keyboardType="numeric"
                          style={{ fontFamily: 'Inter-Regular' }}
                          value={postData.propertyDetails.bedrooms?.toString()}
                          onChangeText={(val) => updatePropertyDetails({ bedrooms: val })}
                        />
                      </View>
                      <View className="flex-1">
                        <TouchableOpacity 
                          onPress={() => setShowStructureDropdown(!showStructureDropdown)}
                          className="flex-row items-center justify-between bg-[#F3F4F6] px-3 py-2.5 rounded-lg"
                        >
                          <Text className="text-[#364153] text-sm" style={{ fontFamily: 'Inter-Medium' }}>
                            {postData.propertyDetails.structure || 'Select Structure'}
                          </Text>
                          <Ionicons name={showStructureDropdown ? "chevron-up" : "chevron-down"} size={16} color="#6A7282" />
                        </TouchableOpacity>

                        {showStructureDropdown && (
                          <View className="absolute top-[45px] left-0 right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-[70] overflow-hidden">
                            {(apiStructures && apiStructures.length > 0 ? apiStructures : apiPropertyTypes).map((type) => (
                              <TouchableOpacity
                                key={type._id}
                                onPress={() => {
                                  updatePropertyDetails({ structure: type.label || type.name });
                                  setShowStructureDropdown(false);
                                }}
                                className="px-4 py-3 border-b border-[#F3F4F6]"
                              >
                                <Text className="text-sm text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>{type.label || type.name}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Floor Details Section */}
                    <View className="flex-row gap-4 mb-6">
                      <View className="flex-1 border-b border-[#D1D5DC] pb-2">
                        <TextInput 
                          placeholder="Property on Floor" 
                          placeholderTextColor="#A0A0A0"
                          className="text-base py-1"
                          keyboardType="numeric"
                          style={{ fontFamily: 'Inter-Regular' }}
                          value={postData.propertyDetails.floor?.toString()}
                          onChangeText={(val) => updatePropertyDetails({ floor: val })}
                        />
                      </View>
                      <View className="flex-1 border-b border-[#D1D5DC] pb-2">
                        <TextInput 
                          placeholder="Total Floors" 
                          placeholderTextColor="#A0A0A0"
                          className="text-base py-1"
                          keyboardType="numeric"
                          style={{ fontFamily: 'Inter-Regular' }}
                          value={postData.propertyDetails.totalFloors?.toString()}
                          onChangeText={(val) => updatePropertyDetails({ totalFloors: val })}
                        />
                      </View>
                    </View>

                    {/* Construction Status Section */}
                    <Text className="text-[#6A7282] text-sm mb-2" style={{ fontFamily: 'Inter-Medium' }}>Construction Status</Text>
                    <View className="mb-6 z-[50]">
                      <TouchableOpacity 
                        onPress={() => setShowStatusDropdown(!showStatusDropdown)}
                        className="flex-row items-center justify-between bg-[#F3F4F6] px-3 py-3 rounded-lg border border-[#E5E7EB]"
                      >
                        <Text className="text-[#364153] text-sm" style={{ fontFamily: 'Inter-Medium' }}>
                          {postData.propertyDetails.constructionStatus || 'Select Status'}
                        </Text>
                        <Ionicons name={showStatusDropdown ? "chevron-up" : "chevron-down"} size={16} color="#6A7282" />
                      </TouchableOpacity>

                      {showStatusDropdown && (
                        <View className="absolute top-[50px] left-0 right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-[55] overflow-hidden">
                          {constructionStatus.map((status) => (
                            <TouchableOpacity
                              key={status._id}
                              onPress={() => {
                                updatePropertyDetails({ constructionStatus: status.label || status.name });
                                setShowStatusDropdown(false);
                              }}
                              className="px-4 py-3 border-b border-[#F3F4F6]"
                            >
                              <Text className="text-sm text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>{status.label || status.name}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  </>
                ) : (
                  <>
                    {/* Commercial Specific Fields */}
                    <Text className="text-[#6A7282] text-sm mb-2" style={{ fontFamily: 'Inter-Medium' }}>Possession Status</Text>
                    <View className="mb-6 z-[80]">
                      <TouchableOpacity 
                        onPress={() => setShowStatusDropdown(!showStatusDropdown)}
                        className="flex-row items-center justify-between bg-[#F3F4F6] px-3 py-3 rounded-lg border border-[#E5E7EB]"
                      >
                        <Text className="text-[#364153] text-sm" style={{ fontFamily: 'Inter-Medium' }}>
                          {postData.propertyDetails.possessionStatus || 'Select Status'}
                        </Text>
                        <Ionicons name={showStatusDropdown ? "chevron-up" : "chevron-down"} size={16} color="#6A7282" />
                      </TouchableOpacity>
                      {showStatusDropdown && (
                        <View className="absolute top-[50px] left-0 right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-[85] overflow-hidden">
                          {possessionStatus.map((status) => (
                            <TouchableOpacity
                              key={status._id}
                              onPress={() => {
                                updatePropertyDetails({ possessionStatus: status.label || status.name });
                                setShowStatusDropdown(false);
                              }}
                              className="px-4 py-3 border-b border-[#F3F4F6]"
                            >
                              <Text className="text-sm text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>{status.label || status.name}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>

                    <Text className="text-[#6A7282] text-sm mb-2" style={{ fontFamily: 'Inter-Medium' }}>Available From</Text>
                    <TouchableOpacity 
                      onPress={() => setShowDatePicker(true)}
                      className="border-b border-[#D1D5DC] pb-2 mb-6 flex-row justify-between items-center"
                    >
                      <Text 
                        className={`text-base py-1 ${postData.propertyDetails.availableFrom ? 'text-[#364153]' : 'text-[#A0A0A0]'}`}
                        style={{ fontFamily: 'Inter-Regular' }}
                      >
                        {postData.propertyDetails.availableFrom || "Select Date"}
                      </Text>
                      <Ionicons name="calendar-outline" size={20} color="#008E96" />
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

                    <View className="flex-row gap-4 mb-6">
                      <View className="flex-1">
                        <Text className="text-[#6A7282] text-sm mb-2" style={{ fontFamily: 'Inter-Medium' }}>Zone Type</Text>
                        <TouchableOpacity 
                          onPress={() => setShowZoneDropdown(!showZoneDropdown)}
                          className="flex-row items-center justify-between bg-[#F3F4F6] px-3 py-3 rounded-lg border border-[#E5E7EB]"
                        >
                          <Text className="text-[#364153] text-xs" style={{ fontFamily: 'Inter-Medium' }}>
                            {postData.propertyDetails.zoneType || 'Select Zone'}
                          </Text>
                          <Ionicons name={showZoneDropdown ? "chevron-up" : "chevron-down"} size={14} color="#6A7282" />
                        </TouchableOpacity>
                        {showZoneDropdown && (
                          <View className="absolute top-[70px] left-0 right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-[90] overflow-hidden">
                            {zoneTypes.map((zone) => (
                              <TouchableOpacity
                                key={zone._id}
                                onPress={() => {
                                  updatePropertyDetails({ zoneType: zone.label || zone.name });
                                  setShowZoneDropdown(false);
                                }}
                                className="px-3 py-2 border-b border-[#F3F4F6]"
                              >
                                <Text className="text-xs text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>{zone.label || zone.name}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                      <View className="flex-1">
                        <Text className="text-[#6A7282] text-sm mb-2" style={{ fontFamily: 'Inter-Medium' }}>Location Hub</Text>
                        <TouchableOpacity 
                          onPress={() => setShowHubDropdown(!showHubDropdown)}
                          className="flex-row items-center justify-between bg-[#F3F4F6] px-3 py-3 rounded-lg border border-[#E5E7EB]"
                        >
                          <Text className="text-[#364153] text-xs" style={{ fontFamily: 'Inter-Medium' }}>
                            {postData.propertyDetails.locationHub || 'Select Hub'}
                          </Text>
                          <Ionicons name={showHubDropdown ? "chevron-up" : "chevron-down"} size={14} color="#6A7282" />
                        </TouchableOpacity>
                        {showHubDropdown && (
                          <View className="absolute top-[70px] left-0 right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-[95] overflow-hidden">
                            {locationHubs.map((hub) => (
                              <TouchableOpacity
                                key={hub._id}
                                onPress={() => {
                                  updatePropertyDetails({ locationHub: hub.label || hub.name });
                                  setShowHubDropdown(false);
                                }}
                                className="px-3 py-2 border-b border-[#F3F4F6]"
                              >
                                <Text className="text-xs text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>{hub.label || hub.name}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>

                    <Text className="text-[#6A7282] text-sm mb-2" style={{ fontFamily: 'Inter-Medium' }}>Built Up Area</Text>
                    <View className="flex-row gap-4 mb-6 items-end z-[60]">
                      <View className="flex-1 border-b border-[#D1D5DC] pb-2">
                        <TextInput 
                          placeholder="Area" 
                          placeholderTextColor="#A0A0A0"
                          className="text-base py-1"
                          keyboardType="numeric"
                          style={{ fontFamily: 'Inter-Regular' }}
                          value={postData.propertyDetails.builtUpArea}
                          onChangeText={(val) => updatePropertyDetails({ builtUpArea: val })}
                        />
                      </View>
                      <View className="w-[120px]">
                        <TouchableOpacity 
                          onPress={() => setShowUnitDropdown(!showUnitDropdown)}
                          className="flex-row items-center justify-between bg-[#F3F4F6] px-3 py-2 rounded-lg border border-[#E5E7EB]"
                        >
                          <Text className="text-[#364153] text-sm" style={{ fontFamily: 'Inter-Medium' }}>
                            {postData.propertyDetails.measurementUnit || 'Sq. Ft'}
                          </Text>
                          <Ionicons name={showUnitDropdown ? "chevron-up" : "chevron-down"} size={16} color="#6A7282" />
                        </TouchableOpacity>

                        {showUnitDropdown && (
                          <View className="absolute bottom-[45px] left-0 right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-[65] overflow-hidden">
                            {measurementUnits.map((unit) => (
                              <TouchableOpacity
                                key={unit._id}
                                onPress={() => {
                                  updatePropertyDetails({ measurementUnit: unit.label || unit.name });
                                  setShowUnitDropdown(false);
                                }}
                                className="px-4 py-3 border-b border-[#F3F4F6]"
                              >
                                <Text className="text-sm text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>{unit.label || unit.name}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>

                    <Text className="text-[#6A7282] text-sm mb-2" style={{ fontFamily: 'Inter-Medium' }}>Ownership Type</Text>
                    <View className="mb-6 z-[70]">
                      <TouchableOpacity 
                        onPress={() => setShowOwnershipDropdown(!showOwnershipDropdown)}
                        className="flex-row items-center justify-between bg-[#F3F4F6] px-3 py-3 rounded-lg border border-[#E5E7EB]"
                      >
                        <Text className="text-[#364153] text-sm" style={{ fontFamily: 'Inter-Medium' }}>
                          {postData.propertyDetails.ownershipType || 'Select Type'}
                        </Text>
                        <Ionicons name={showOwnershipDropdown ? "chevron-up" : "chevron-down"} size={16} color="#6A7282" />
                      </TouchableOpacity>
                      {showOwnershipDropdown && (
                        <View className="absolute top-[50px] left-0 right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-[75] overflow-hidden">
                          {ownershipTypes.map((type) => (
                            <TouchableOpacity
                              key={type._id}
                              onPress={() => {
                                updatePropertyDetails({ ownershipType: type.label || type.name });
                                setShowOwnershipDropdown(false);
                              }}
                              className="px-4 py-3 border-b border-[#F3F4F6]"
                            >
                              <Text className="text-sm text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>{type.label || type.name}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  </>
                )}

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
                    <View className="mt-6 flex-row flex-wrap gap-2">
                      {/* Counter Items (AC, Bed etc) as Capsules */}
                      {Object.entries(postData.furnishings.counters).map(([key, value]) => (
                        value > 0 && (
                          <View key={key} className="flex-row items-center bg-[#F0F9F9] border border-[#008E96] px-3 py-1.5 rounded-full">
                            <RenderIcon name={key} size={14} color="#008E96" apiAmenities={apiAmenities} />
                            <Text className="text-[#008E96] text-[12px] ml-1.5" style={{ fontFamily: 'Inter-Medium' }}>
                              {key} ({value})
                            </Text>
                          </View>
                        )
                      ))}

                      {/* Selected Items (Wifi, Garden etc) as Capsules */}
                      {postData.furnishings.selectedItems.map((item, index) => (
                        <View key={index} className="flex-row items-center bg-[#F0F9F9] border border-[#008E96] px-3 py-1.5 rounded-full">
                          <RenderIcon name={item} size={14} color="#008E96" apiAmenities={apiAmenities} />
                          <Text className="text-[#008E96] text-[12px] ml-1.5" style={{ fontFamily: 'Inter-Medium' }}>
                            {item}
                          </Text>
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
              if (isStep1Valid) setCurrentStep(2);
            } else if (currentStep === 2) {
              setCurrentStep(3);
            } else if (currentStep === 3) {
              setCurrentStep(4);
            } else if (currentStep === 4) {
              setCurrentStep(5);
            } else {
              handlePostProperty();
            }
          }}
          className={`w-full py-4 rounded-xl items-center shadow-lg ${(currentStep === 1 && isStep1Valid) || currentStep === 3 || currentStep === 4 || currentStep === 5 || (currentStep === 2 && isFormValid) ? 'bg-[#008E96]' : 'bg-[#E5E7EB]'}`}
          disabled={((currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isFormValid)) || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-base" style={{ fontFamily: 'Inter-Bold' }}>
              {currentStep === 1 ? 'Next, Add Price' : currentStep === 2 ? 'Next, Add Photos' : currentStep === 3 ? 'Next, Advanced Details' : currentStep === 4 ? 'Review & Verify' : 'Post Property'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PropertyDetails;