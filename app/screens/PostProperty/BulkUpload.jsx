import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBulkProperty } from '../../../hooks/useBulkProperty';
import { useLookup } from '../../../hooks/useLookup';
import { useProject } from '../../../hooks/useProject';
import { useProperty } from '../../../hooks/useProperty';
import api from '../../api';

const BulkUploadScreen = () => {
  // 100% same API hooks as PropertyDetails.jsx
  const {
    propertyTypes: apiPropertyTypes = [],
    subPropertyTypes: apiSubPropertyTypes = [],
    categories: apiCategories = [],
    amenities: apiAmenities = [],
    constructionStatus: apiConstructionStatus = [],
    facingDirections: apiFacingDirections = [],
    zoneTypes: apiZoneTypes = [],
    ownershipTypes: apiOwnershipTypes = [],
    locationHubs: apiLocationHubs = [],
    furnishingStatus: apiFurnishingStatus = [],
    fetchLookups,
    loading: lookupLoading,
  } = useLookup();

  const { fetchProjects, loading: projectsLoading } = useProject();
  const { saveProperty, loading: isSaving } = useProperty();
  const { saveBulkProperties, loading: isBulkSaving } = useBulkProperty();

  // Geography API dynamic lists exactly as in PropertyDetails.jsx
  const [countries, setCountries] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);

  // Current Step: 1 to 5
  const [currentStep, setCurrentStep] = useState(1);
  const scrollViewRef = useRef(null);

  const goToStep = (stepNumber) => {
    const validStep = Math.max(1, Math.min(5, Number(stepNumber)));
    setCurrentStep(validStep);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 10);
  };

  const handleBackStep = () => {
    goToStep(Number(currentStep) - 1);
  };

  const handleNextStep = () => {
    goToStep(Number(currentStep) + 1);
  };

  // Step 1: Common Details State
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [propertyTypeId, setPropertyTypeId] = useState('');
  const [subType, setSubType] = useState('');
  const [subTypeId, setSubTypeId] = useState('');
  const [linkedProject, setLinkedProject] = useState('No Project (Individual Property Listing)');
  const [linkedProjectId, setLinkedProjectId] = useState('');
  const [baseTitlePrefix, setBaseTitlePrefix] = useState('');

  // Step 1: Address & Locality State - EXACTLY matching PropertyDetails.jsx
  const [country, setCountry] = useState('');
  const [countryId, setCountryId] = useState('');
  const [state, setState] = useState('');
  const [stateId, setStateId] = useState('');
  const [city, setCity] = useState('');
  const [cityId, setCityId] = useState('');
  const [pincode, setPincode] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [loadingProjectSuggestions, setLoadingProjectSuggestions] = useState(false);
  const [locality, setLocality] = useState('');
  const [localityId, setLocalityId] = useState('');
  const [localitySuggestions, setLocalitySuggestions] = useState([]);
  const [loadingLocalitySuggestions, setLoadingLocalitySuggestions] = useState(false);

  // Dropdown UI states for country, state, city exactly like PropertyDetails.jsx
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Step 1: Additional Details State
  const [ageOfProperty, setAgeOfProperty] = useState('');
  const [facingDirection, setFacingDirection] = useState('');
  const [constructionStatus, setConstructionStatus] = useState('');
  const [constructionStatusId, setConstructionStatusId] = useState('');
  const [zoneType, setZoneType] = useState('');
  const [zoneTypeId, setZoneTypeId] = useState('');
  const [ownershipType, setOwnershipType] = useState('');
  const [ownershipTypeId, setOwnershipTypeId] = useState('');
  const [locationHub, setLocationHub] = useState('');
  const [locationHubId, setLocationHubId] = useState('');
  const [propertyCondition, setPropertyCondition] = useState('');
  const [furnishingStatus, setFurnishingStatus] = useState('');
  const [furnishingStatusId, setFurnishingStatusId] = useState('');
  const [description, setDescription] = useState('');

  // Step 1: Media & Amenities State
  const [images, setImages] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Step 2-4 State
  const [quantity, setQuantity] = useState('2');
  const [configMode, setConfigMode] = useState('Uniform');
  const [defaultBhk, setDefaultBhk] = useState('Private Office');
  const [defaultPrice, setDefaultPrice] = useState('');
  const [defaultArea, setDefaultArea] = useState('');
  const [defaultFloor, setDefaultFloor] = useState('1');
  const [defaultTotalFloors, setDefaultTotalFloors] = useState('5');
  const [defaultCabins, setDefaultCabins] = useState('');
  const [defaultMeetingRooms, setDefaultMeetingRooms] = useState('');
  const [defaultWashrooms, setDefaultWashrooms] = useState('');
  const [defaultParking, setDefaultParking] = useState('');
  const [defaultCeilingHeight, setDefaultCeilingHeight] = useState('');
  const [defaultSecurityDeposit, setDefaultSecurityDeposit] = useState('');
  const [defaultMaintenance, setDefaultMaintenance] = useState('');
  const [defaultPowerBackup, setDefaultPowerBackup] = useState(false);
  const [customUnits, setCustomUnits] = useState([]);

  const updateCustomUnit = (index, field, value) => {
    setCustomUnits(prev => {
      const copy = [...prev];
      while (copy.length <= index) {
        copy.push({});
      }
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const getCustomUnitField = (index, field, fallback = '') => {
    return customUnits[index]?.[field] ?? fallback;
  };

  // UI Dropdown & Modal States
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch API lookups on mount exactly like PropertyDetails.jsx
  useEffect(() => {
    fetchLookups();
    loadGeoCountries();
    loadMyProjects();
  }, []);

  // Set default category when lookups load
  useEffect(() => {
    if (apiCategories.length > 0 && !category) {
      const firstCat = apiCategories.find(c => (c.label || c.name) === 'Sell') || apiCategories[0];
      setCategory(firstCat.label || firstCat.name);
      setCategoryId(firstCat._id);
    }
  }, [apiCategories]);

  // Set default propertyType when lookups load
  useEffect(() => {
    if (apiPropertyTypes.length > 0 && !propertyType) {
      const firstType = apiPropertyTypes[0];
      setPropertyType(firstType.label || firstType.name);
      setPropertyTypeId(firstType._id);
    }
  }, [apiPropertyTypes]);

  // Set default subPropertyType
  useEffect(() => {
    if (apiSubPropertyTypes.length > 0 && propertyType) {
      const filtered = apiSubPropertyTypes.filter(
        st => st.propertyType?.label === propertyType || st.propertyType?.name === propertyType || st.propertyType === propertyTypeId
      );
      const firstSub = filtered.length > 0 ? filtered[0] : apiSubPropertyTypes[0];
      if (firstSub) {
        setSubType(firstSub.label || firstSub.name);
        setSubTypeId(firstSub._id);
      }
    }
  }, [apiSubPropertyTypes, propertyType]);

  // Set default construction status
  useEffect(() => {
    if (apiConstructionStatus.length > 0 && !constructionStatus) {
      const firstCS = apiConstructionStatus[0];
      setConstructionStatus(firstCS.label || firstCS.name);
      setConstructionStatusId(firstCS._id);
    }
  }, [apiConstructionStatus]);

  // Set default facing direction
  useEffect(() => {
    if (apiFacingDirections.length > 0 && !facingDirection) {
      const firstFD = apiFacingDirections[0];
      setFacingDirection(firstFD.label || firstFD.name);
    }
  }, [apiFacingDirections]);

  // Locality Search Debounce - EXACTLY like PropertyDetails.jsx
  useEffect(() => {
    const timer = setTimeout(() => {
      if (locality && locality.trim().length > 1) {
        searchLocalities();
      } else {
        setLocalitySuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [locality]);

  const searchLocalities = async () => {
    try {
      setLoadingLocalitySuggestions(true);
      const cityParam = (typeof city === 'string' && city.trim())
        ? city.trim().toLowerCase()
        : 'mohali';

      const response = await api.get(`/localities`, {
        params: { city: cityParam }
      });

      if (response.data?.success) {
        const query = locality.toLowerCase();
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

  // Building / Project Search Debounce - EXACTLY like PropertyDetails.jsx
  useEffect(() => {
    const timer = setTimeout(() => {
      if (buildingName && buildingName.trim().length > 1) {
        searchProjects();
      } else {
        setProjectSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [buildingName]);

  const searchProjects = async () => {
    try {
      setLoadingProjectSuggestions(true);
      const cityParam = (typeof city === 'string' && city.trim())
        ? city.trim().toLowerCase()
        : 'mohali';

      const response = await fetchProjects({ city: cityParam });

      if (response?.success) {
        const query = buildingName.toLowerCase();
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

  const loadGeoCountries = async () => {
    try {
      const res = await api.get('/geo/countries');
      const data = res.data?.data ?? res.data;
      if (Array.isArray(data) && data.length > 0) {
        setCountries(data);
      }
    } catch (err) {
      console.error('Error fetching API countries:', err);
    }
  };

  const loadGeoStates = async (cId) => {
    if (!cId) return;
    try {
      const res = await api.get('/geo/states', { params: { country: cId } });
      const data = res.data?.data ?? res.data;
      if (Array.isArray(data) && data.length > 0) {
        setStatesList(data);
      }
    } catch (err) {
      console.error('Error fetching API states:', err);
    }
  };

  const loadGeoCities = async (sId) => {
    if (!sId) return;
    try {
      const res = await api.get('/geo/cities', { params: { state: sId } });
      const data = res.data?.data ?? res.data;
      if (Array.isArray(data) && data.length > 0) {
        setCitiesList(data);
      }
    } catch (err) {
      console.error('Error fetching API cities:', err);
    }
  };

  const loadMyProjects = async () => {
    try {
      const res = await api.get('/projects/all');
      const items = res.data?.data || res.data?.projects || res.data || [];
      if (Array.isArray(items) && items.length > 0) {
        setProjectsList(items);
        return;
      }
    } catch (err) {
      console.warn('Error fetching /projects/all:', err?.message);
    }
    try {
      const resMe = await api.get('/projects/me');
      const itemsMe = resMe.data?.data || resMe.data?.projects || [];
      if (Array.isArray(itemsMe)) {
        setProjectsList(itemsMe);
      }
    } catch (err) {
      try {
        const fallbackRes = await fetchProjects({});
        if (Array.isArray(fallbackRes?.data)) {
          setProjectsList(fallbackRes.data);
        }
      } catch (e) {
        console.warn('Error loading user projects:', e?.message);
      }
    }
  };

  const steps = [
    { id: 1, label: 'Common Details' },
    { id: 2, label: 'Quantity' },
    { id: 3, label: 'Config Mode' },
    { id: 4, label: 'Configurations' },
    { id: 5, label: 'Review & Publish' },
  ];

  const handlePickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Please allow access to your photo gallery to upload images.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: 10,
        quality: 0.8,
        base64: true,
      });
      if (!result.canceled && result.assets) {
        setImages(prev => [...prev, ...result.assets]);
      }
    } catch (e) {
      console.warn('Image pick error:', e);
    }
  };

  const toggleAmenity = (amenityId) => {
    if (selectedAmenities.includes(amenityId)) {
      setSelectedAmenities(prev => prev.filter(a => a !== amenityId));
    } else {
      setSelectedAmenities(prev => [...prev, amenityId]);
    }
  };

  const availablePropertyTypes = apiPropertyTypes;
  const availableSubTypes = apiSubPropertyTypes.filter(
    st => !propertyType || (st.propertyType?.label === propertyType || st.propertyType?.name === propertyType || st.propertyType === propertyTypeId)
  );

  const renderDropdownModal = () => {
    if (!activeDropdown) return null;

    let title = '';
    let items = [];
    let selectedVal = '';
    let onSelect = () => { };

    if (activeDropdown === 'propertyType') {
      title = 'Select Property Type';
      items = availablePropertyTypes.map(t => ({ label: t.label || t.name, id: t._id }));
      selectedVal = propertyType;
      onSelect = (item) => {
        setPropertyType(item.label);
        setPropertyTypeId(item.id);
        const subOpts = apiSubPropertyTypes.filter(st => st.propertyType?._id === item.id || st.propertyType?.label === item.label);
        if (subOpts.length > 0) {
          setSubType(subOpts[0].label || subOpts[0].name);
          setSubTypeId(subOpts[0]._id);
        }
        setActiveDropdown(null);
      };
    } else if (activeDropdown === 'subType') {
      title = 'Select Sub-Type';
      items = (availableSubTypes.length > 0 ? availableSubTypes : apiSubPropertyTypes).map(st => ({ label: st.label || st.name, id: st._id }));
      selectedVal = subType;
      onSelect = (item) => {
        setSubType(item.label);
        setSubTypeId(item.id);
        setActiveDropdown(null);
      };
    } else if (activeDropdown === 'linkedProject') {
      title = 'Link to Existing Project';
      items = [
        { label: 'No Project (Individual Property Listing)', id: '', fullItem: null },
        ...projectsList.map(p => ({ label: p.projectName || p.title || p.name, id: p._id, fullItem: p }))
      ];
      selectedVal = linkedProject;
      onSelect = (item) => {
        setLinkedProject(item.label);
        setLinkedProjectId(item.id);
        if (item.fullItem) {
          const p = item.fullItem;
          if (p.country) {
            setCountry(typeof p.country === 'object' ? p.country.name : p.country);
            setCountryId(typeof p.country === 'object' ? p.country._id : p.country);
          }
          if (p.state) {
            setState(typeof p.state === 'object' ? p.state.name : p.state);
            setStateId(typeof p.state === 'object' ? p.state._id : p.state);
          }
          if (p.city) {
            setCity(typeof p.city === 'object' ? p.city.name : p.city);
            setCityId(typeof p.city === 'object' ? p.city._id : p.city);
          }
          if (p.addressLine1) {
            setLocality(p.addressLine1);
          }
        }
        setActiveDropdown(null);
      };
    } else if (activeDropdown === 'facingDirection') {
      title = 'Select Facing Direction';
      const defaultFacings = ['North', 'East', 'West', 'South', 'North-East', 'North-West', 'South-East', 'South-West'];
      items = (apiFacingDirections?.length ? apiFacingDirections : defaultFacings.map((f, i) => ({ label: f, _id: `f-${i}` }))).map(fd => ({ label: fd.label || fd.name || fd, id: fd._id || fd }));
      selectedVal = facingDirection;
      onSelect = (item) => {
        setFacingDirection(item.label);
        setActiveDropdown(null);
      };
    } else if (activeDropdown === 'constructionStatus') {
      title = 'Select Construction Status';
      const defaultStatus = ['Ready to Move', 'Under Construction', 'New Launch'];
      items = (apiConstructionStatus?.length ? apiConstructionStatus : defaultStatus.map((s, i) => ({ label: s, _id: `s-${i}` }))).map(cs => ({ label: cs.label || cs.name || cs, id: cs._id || cs }));
      selectedVal = constructionStatus;
      onSelect = (item) => {
        setConstructionStatus(item.label);
        setConstructionStatusId(item.id);
        setActiveDropdown(null);
      };
    } else if (activeDropdown === 'zoneType') {
      title = 'Select Zone Type';
      const defaultZones = ['Industrial', 'Commercial', 'Residential', 'Special Economic Zone', 'IT Park'];
      items = (apiZoneTypes?.length ? apiZoneTypes : defaultZones.map((z, i) => ({ label: z, _id: `z-${i}` }))).map(zt => ({ label: zt.label || zt.name || zt, id: zt._id || zt }));
      selectedVal = zoneType;
      onSelect = (item) => {
        setZoneType(item.label);
        setZoneTypeId(item.id);
        setActiveDropdown(null);
      };
    } else if (activeDropdown === 'ownershipType') {
      title = 'Select Ownership Type';
      const defaultOwnerships = ['Freehold', 'Leasehold', 'Power of Attorney', 'Co-operative Society'];
      items = (apiOwnershipTypes?.length ? apiOwnershipTypes : defaultOwnerships.map((o, i) => ({ label: o, _id: `o-${i}` }))).map(ot => ({ label: ot.label || ot.name || ot, id: ot._id || ot }));
      selectedVal = ownershipType;
      onSelect = (item) => {
        setOwnershipType(item.label);
        setOwnershipTypeId(item.id);
        setActiveDropdown(null);
      };
    } else if (activeDropdown === 'locationHub') {
      title = 'Select Location Hub';
      const defaultHubs = ['IT Park', 'Business District', 'Shopping Mall', 'High Street', 'Highway / Main Road'];
      items = (apiLocationHubs?.length ? apiLocationHubs : defaultHubs.map((h, i) => ({ label: h, _id: `h-${i}` }))).map(lh => ({ label: lh.label || lh.name || lh, id: lh._id || lh }));
      selectedVal = locationHub;
      onSelect = (item) => {
        setLocationHub(item.label);
        setLocationHubId(item.id);
        setActiveDropdown(null);
      };
    } else if (activeDropdown === 'furnishingStatus') {
      title = 'Select Furnishing Status';
      const defaultFurnishings = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
      items = (apiFurnishingStatus?.length ? apiFurnishingStatus : defaultFurnishings.map((f, i) => ({ label: f, _id: `f-${i}` }))).map(fs => ({ label: fs.label || fs.name || fs, id: fs._id || fs }));
      selectedVal = furnishingStatus;
      onSelect = (item) => {
        setFurnishingStatus(item.label);
        setFurnishingStatusId(item.id);
        setActiveDropdown(null);
      };
    } else if (activeDropdown === 'country') {
      title = 'Select Country';
      items = countries.map(c => ({ label: c.label || c.name || c.country || c.title || '', id: c._id || c.id }));
      selectedVal = country;
      onSelect = (item) => {
        setCountry(item.label);
        setCountryId(item.id);
        setState('');
        setStateId('');
        setCity('');
        setCityId('');
        setStatesList([]);
        setCitiesList([]);
        loadGeoStates(item.id);
        setActiveDropdown(null);
      };
    } else if (activeDropdown === 'state') {
      title = 'Select State';
      items = statesList.map(s => ({ label: s.label || s.name || '', id: s._id || s.id }));
      selectedVal = state;
      onSelect = (item) => {
        setState(item.label);
        setStateId(item.id);
        setCity('');
        setCityId('');
        setCitiesList([]);
        loadGeoCities(item.id);
        setActiveDropdown(null);
      };
    } else if (activeDropdown === 'city') {
      title = 'Select City';
      items = citiesList.map(c => ({ label: c.label || c.name || '', id: c._id || c.id }));
      selectedVal = city;
      onSelect = (item) => {
        setCity(item.label);
        setCityId(item.id);
        setActiveDropdown(null);
      };
    }

    return (
      <Modal animationType="fade" transparent={true} visible={!!activeDropdown} onRequestClose={() => setActiveDropdown(null)}>
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white w-full max-w-md rounded-[24px] p-5 shadow-2xl" style={{ maxHeight: hp('65%') }}>
            <View className="flex-row justify-between items-center pb-3 border-b border-gray-100">
              <Text className="text-[#101828] font-bold text-[17px]">{title}</Text>
              <TouchableOpacity onPress={() => setActiveDropdown(null)} className="p-1 rounded-full bg-gray-100">
                <Ionicons name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
            <ScrollView className="mt-2" showsVerticalScrollIndicator={false}>
              {items.map((item, index) => {
                const isSelected = selectedVal === item.label;
                return (
                  <TouchableOpacity
                    key={`${item.id || item.label}-${index}`}
                    onPress={() => onSelect(item)}
                    className="flex-row justify-between items-center py-3.5 border-b border-gray-50"
                  >
                    <Text className="text-[14px]" style={{ fontFamily: isSelected ? 'Inter-Bold' : 'Inter-Regular', color: isSelected ? '#008E96' : '#334155' }}>
                      {item.label}
                    </Text>
                    {isSelected && (
                      <View className="w-5 h-5 rounded-full bg-[#008E96] items-center justify-center">
                        <Ionicons name="checkmark" size={13} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderAmenitiesModal = () => (
    <Modal animationType="slide" transparent={true} visible={showAmenitiesModal} onRequestClose={() => setShowAmenitiesModal(false)}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-[28px] p-6" style={{ maxHeight: hp('75%') }}>
          <View className="flex-row justify-between items-center pb-3 border-b border-gray-100">
            <View>
              <Text className="text-[#101828] font-bold text-[18px]">Select Common Amenities</Text>
              <Text className="text-[#64748B] font-normal text-[12px]">Dynamic API amenities will apply to all listings in this batch</Text>
            </View>
            <TouchableOpacity onPress={() => setShowAmenitiesModal(false)} className="p-1.5 rounded-full bg-gray-100">
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
          <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
            <View className="flex-row flex-wrap gap-2.5 pb-4">
              {apiAmenities.map((item) => {
                const label = item.label || item.name;
                const isSelected = selectedAmenities.includes(item._id);
                return (
                  <TouchableOpacity
                    key={item._id || label}
                    onPress={() => toggleAmenity(item._id)}
                    className="flex-row items-center border rounded-xl px-3.5 py-2.5"
                    style={{
                      borderColor: isSelected ? '#008E96' : '#E2E8F0',
                      backgroundColor: isSelected ? '#E6F7F6' : '#FFFFFF',
                    }}
                  >
                    <Ionicons
                      name={isSelected ? 'checkbox' : 'square-outline'}
                      size={18}
                      color={isSelected ? '#008E96' : '#94A3B8'}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={{ fontFamily: isSelected ? 'Inter-SemiBold' : 'Inter-Regular', color: isSelected ? '#008E96' : '#334155', fontSize: 13 }}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={() => setShowAmenitiesModal(false)}
            className="bg-[#008E96] py-3.5 rounded-xl items-center justify-center mt-3"
          >
            <Text className="text-white font-bold text-[15px]">Done ({selectedAmenities.length} Selected)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // REAL API SUBMISSION - Exact same schema format as PropertyDetails.jsx
  const handleFinalPublish = async () => {
    setIsSubmitting(true);
    try {
      const unitsCount = parseInt(quantity, 10) || 1;
      const baseTitle = baseTitlePrefix || `${defaultBhk} BHK ${propertyType}`;
      const numPrice = parseInt(defaultPrice, 10) || 8500000;
      const imagePayload = images.map(img => img.base64 ? `data:image/jpeg;base64,${img.base64}` : img.uri).filter(Boolean);

      const isRent = category?.toLowerCase().includes('rent');
      const isResidential = propertyType?.toLowerCase().includes('apartment') || propertyType?.toLowerCase().includes('villa') || propertyType?.toLowerCase().includes('house');

      const batchListings = Array.from({ length: unitsCount }).map((_, index) => {
        const title = unitsCount > 1 ? `${baseTitle} - Unit ${index + 1}` : baseTitle;
        const payload = {
          name: title,
          title: title,
          country: countryId || country,
          state: stateId || state,
          city: cityId || city,
          locality: localityId || locality || city,
          address: locality || `${city}, ${state}`,
          pincode: pincode || '140301',
          propertyType: propertyTypeId || propertyType,
          category: categoryId || category,
          lookingFor: categoryId || category,
          subPropertyType: subTypeId || subType,
          price: numPrice,
          monthlyRent: isRent ? numPrice : 0,
          constructionStatus: constructionStatusId || constructionStatus,
          ageOfProperty: ageOfProperty || '',
          facingDirection: facingDirection || '',
          zoneType: zoneTypeId || zoneType || '',
          ownershipType: ownershipTypeId || ownershipType || '',
          locationHub: locationHubId || locationHub || '',
          propertyCondition: propertyCondition || '',
          furnishingStatus: furnishingStatusId || furnishingStatus || '',
          projectSociety: projectId || linkedProjectId || buildingName || linkedProject,
          projectName: buildingName || linkedProject,
          description: description || `${title} located in ${locality || city}`,
          amenities: selectedAmenities.map(amId => ({ amenity: amId, count: 1 })),
          images: imagePayload,
          isActive: true,
        };

        if (isResidential) {
          payload.residential = {
            bedrooms: parseInt(defaultBhk, 10) || 3,
            bathrooms: 2,
            balconies: 1,
            floor: 1,
            totalFloors: 5,
          };
        }
        return payload;
      });

      const cleanId = (val) => (val && val !== '' ? val : undefined);

      // Construct commonData payload matching POST /properties/bulk API schema exactly
      const commonData = {
        lookingFor: cleanId(categoryId || category),
        propertyType: cleanId(propertyTypeId || propertyType),
        subPropertyType: cleanId(subTypeId || subType),
        title: baseTitlePrefix || buildingName || linkedProject || `${defaultBhk} BHK ${propertyType}`,
        country: cleanId(countryId || country),
        state: cleanId(stateId || state),
        city: cleanId(cityId || city),
        pincode: pincode || '',
        address: locality || `${city || ''}, ${state || ''}`.trim().replace(/^,|,$/g, ''),
        project: cleanId(projectId || linkedProjectId),
        projectName: buildingName || linkedProject || '',
        description: description || `${baseTitlePrefix || title || 'Property'} located in ${locality || city || ''}`,
        amenities: selectedAmenities,
        images: imagePayload,
        constructionStatus: cleanId(constructionStatusId || constructionStatus),
        possessionStatus: cleanId(constructionStatusId || constructionStatus),
        facingDirection: facingDirection || undefined,
        zoneType: cleanId(zoneTypeId || zoneType),
        ownershipType: cleanId(ownershipTypeId || ownershipType),
        locationHub: cleanId(locationHubId || locationHub),
        furnishingStatus: cleanId(furnishingStatusId || furnishingStatus),
        isActive: true,
      };

      // Post batch via real API hook saveBulkProperties
      try {
        await saveBulkProperties({
          commonData,
          units: batchListings,
          properties: batchListings,
          count: unitsCount,
        });
      } catch (bulkErr) {
        await Promise.all(
          batchListings.map(item =>
            saveProperty(item, {
              isEditMode: false,
              isRent,
              isResidential,
            })
          )
        );
      }

      setIsSubmitting(false);
      Alert.alert(
        'Bulk Batch Published! 🚀',
        `Successfully published ${unitsCount} real API listings.`,
        [{ text: 'View Dashboard', onPress: () => router.replace('/screens/RealtorProperties') }]
      );
    } catch (error) {
      setIsSubmitting(false);
      console.error('Bulk upload API error:', error);
      Alert.alert('Upload Error', error.message || 'Could not publish batch listings via API.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      {lookupLoading && (
        <View className="absolute inset-0 bg-white/85 z-[999] items-center justify-center">
          <ActivityIndicator size="large" color="#008E96" />
          <Text className="text-[#008E96] font-semibold mt-4 text-sm">Loading Live API Lookups...</Text>
        </View>
      )}

      {/* Top Header Bar */}
      <View className="bg-white border-b border-[#E2E8F0] px-4 py-3.5 flex-row justify-between items-center shadow-xs">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-9 h-9 rounded-full bg-[#F1F5F9] items-center justify-center border border-[#E2E8F0]"
          >
            <Ionicons name="arrow-back" size={19} color="#334155" />
          </TouchableOpacity>
          <View>
            <Text className="text-[#0F172A] font-bold text-[17px]">Bulk Property Upload</Text>
            <Text className="text-[#64748B] font-normal text-[11px]">Multi-Step Batch Creator • Live API</Text>
          </View>
        </View>
        <View className="bg-[#E6F7F6] px-3 py-1.5 rounded-full border border-[#B2EBE8]">
          <Text className="text-[#008E96] font-bold text-[11px] uppercase tracking-wider">Step {currentStep} of 5</Text>
        </View>
      </View>

      {/* Thin Animated Top Progress Line */}
      <View className="w-full h-1 bg-[#E2E8F0]">
        <View
          className="h-1 bg-[#008E96]"
          style={{ width: `${(currentStep / 5) * 100}%` }}
        />
      </View>

      {/* Stepper Pill Bar */}
      <View className="bg-white px-4 py-3 border-b border-[#F1F5F9]">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', gap: 10 }}>
          {steps.map((step) => {
            const isCurrent = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <TouchableOpacity
                key={step.id}
                onPress={() => goToStep(step.id)}
                className="flex-row items-center gap-2 px-3 py-1.5 rounded-full border"
                style={{
                  backgroundColor: isCurrent ? '#008E96' : isCompleted ? '#E6F7F6' : '#FFFFFF',
                  borderColor: isCurrent ? '#008E96' : isCompleted ? '#B2EBE8' : '#E2E8F0',
                }}
              >
                <View
                  className="w-5 h-5 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: isCurrent ? 'rgba(255,255,255,0.25)' : isCompleted ? '#008E96' : '#F1F5F9',
                  }}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={11} color="white" />
                  ) : (
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: 10,
                        color: isCurrent ? '#FFFFFF' : '#64748B',
                      }}
                    >
                      {step.id}
                    </Text>
                  )}
                </View>
                <Text
                  style={{
                    fontFamily: isCurrent ? 'Inter-Bold' : 'Inter-Medium',
                    fontSize: 12,
                    color: isCurrent ? '#FFFFFF' : isCompleted ? '#008E96' : '#64748B',
                  }}
                >
                  {step.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Form Body */}
      <ScrollView ref={scrollViewRef} className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {currentStep === 1 && (
          <View className="gap-5">
            {/* 1. Purpose & Property Type Card */}
            <View className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] shadow-xs">
              <View className="flex-row items-center gap-2.5 mb-1">
                <View className="w-8 h-8 rounded-xl bg-[#E6F7F6] items-center justify-center">
                  <Ionicons name="home" size={17} color="#008E96" />
                </View>
                <Text className="text-[#0F172A] font-bold text-[16px]">1. Purpose & Property Category</Text>
              </View>
              <Text className="text-[#64748B] font-normal text-[12px] mb-4">
                Choose the listing purpose and property classification.
              </Text>

              {/* Purpose / Category Selection */}
              <View className="mb-4">
                <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-2">PURPOSE *</Text>
                <View className="flex-row gap-3">
                  {(apiCategories.length > 0 ? apiCategories : [{ label: 'Rent', _id: '1' }, { label: 'Sell', _id: '2' }]).map((cat) => {
                    const label = cat.label || cat.name;
                    const isSelected = category === label;
                    return (
                      <TouchableOpacity
                        key={cat._id || label}
                        onPress={() => {
                          setCategory(label);
                          setCategoryId(cat._id);
                        }}
                        className="flex-1 py-3 rounded-xl border flex-row items-center justify-center gap-2"
                        style={{
                          borderColor: isSelected ? '#008E96' : '#E2E8F0',
                          backgroundColor: isSelected ? '#E6F7F6' : '#F8FAFC',
                        }}
                      >
                        <Ionicons
                          name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                          size={17}
                          color={isSelected ? "#008E96" : "#94A3B8"}
                        />
                        <Text style={{ fontFamily: isSelected ? 'Inter-Bold' : 'Inter-Medium', color: isSelected ? '#008E96' : '#475569', fontSize: 14 }}>
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Property Type & Sub-Type Row */}
              <View className="flex-row gap-3 mb-4">
                <View style={{ flex: 1 }}>
                  <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-2">PROPERTY TYPE *</Text>
                  <TouchableOpacity
                    onPress={() => setActiveDropdown('propertyType')}
                    className="border border-[#E2E8F0] rounded-xl px-3.5 py-3 flex-row justify-between items-center bg-[#F8FAFC]"
                  >
                    <Text className="text-[#0F172A] font-medium text-[13px]" numberOfLines={1}>
                      {propertyType || 'Select Type'}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#64748B" />
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-2">SUB-TYPE *</Text>
                  <TouchableOpacity
                    onPress={() => setActiveDropdown('subType')}
                    className="border border-[#E2E8F0] rounded-xl px-3.5 py-3 flex-row justify-between items-center bg-[#F8FAFC]"
                  >
                    <Text className="text-[#0F172A] font-medium text-[13px]" numberOfLines={1}>
                      {subType || 'Select Sub-Type'}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#64748B" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Link to Existing Project */}
              <View className="mb-4">
                <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-2">LINK TO EXISTING PROJECT (AUTO-FILL LOCATION)</Text>
                <TouchableOpacity
                  onPress={() => setActiveDropdown('linkedProject')}
                  className="border border-[#E2E8F0] rounded-xl px-3.5 py-3 flex-row justify-between items-center bg-[#F8FAFC]"
                >
                  <View className="flex-row items-center gap-2 flex-1 mr-2">
                    <Ionicons name="business-outline" size={16} color="#008E96" />
                    <Text className="text-[#0F172A] font-medium text-[13px]" numberOfLines={1}>
                      {linkedProject}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Base Title Prefix */}
              <View>
                <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-2">BASE TITLE PREFIX *</Text>
                <View className="border border-[#E2E8F0] rounded-xl px-3.5 py-1 bg-[#F8FAFC] flex-row items-center">
                  <Ionicons name="text-outline" size={16} color="#64748B" style={{ marginRight: 8 }} />
                  <TextInput
                    value={baseTitlePrefix}
                    onChangeText={setBaseTitlePrefix}
                    placeholder="e.g. 3 BHK Luxury Apartment in Sector 115"
                    placeholderTextColor="#94A3B8"
                    className="flex-1 py-2.5 text-[13px] text-[#0F172A] font-normal"
                  />
                </View>
              </View>
            </View>

            {/* 2. Address & Locality Card */}
            <View className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] shadow-xs">
              <View className="flex-row items-center gap-2.5 mb-1">
                <View className="w-8 h-8 rounded-xl bg-[#E6F7F6] items-center justify-center">
                  <Ionicons name="location" size={17} color="#008E96" />
                </View>
                <Text className="text-[#0F172A] font-bold text-[16px]">2. Location Details</Text>
              </View>
              <Text className="text-[#64748B] font-normal text-[12px] mb-4">
                Select Country → State → City sequentially.
              </Text>

              {/* Country and Pincode Section */}
              <View className="flex-row gap-3 mb-4">
                <View style={{ flex: 1 }}>
                  <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-1.5">COUNTRY *</Text>
                  <TouchableOpacity
                    onPress={() => setActiveDropdown('country')}
                    className="flex-row items-center justify-between bg-[#F8FAFC] px-3.5 py-3 rounded-xl border border-[#E2E8F0]"
                  >
                    <Text className="text-[#334155] text-[13px] font-medium" numberOfLines={1}>
                      {country || 'Select Country'}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}>
                  <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-1.5">PINCODE *</Text>
                  <View className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-1">
                    <TextInput
                      placeholder="e.g. 140301"
                      placeholderTextColor="#94A3B8"
                      className="text-[13px] py-2 text-[#0F172A] font-normal"
                      keyboardType="numeric"
                      value={pincode}
                      onChangeText={setPincode}
                    />
                  </View>
                </View>
              </View>

              {/* State and City Section */}
              <View className="flex-row gap-3 mb-4">
                <View style={{ flex: 1 }}>
                  <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-1.5">STATE *</Text>
                  {countryId ? (
                    <TouchableOpacity
                      onPress={() => setActiveDropdown('state')}
                      className="flex-row items-center justify-between bg-[#F8FAFC] px-3.5 py-3 rounded-xl border border-[#E2E8F0]"
                    >
                      <Text className="text-[#334155] text-[13px] font-medium" numberOfLines={1}>
                        {state || 'Select State'}
                      </Text>
                      <Ionicons name="chevron-down" size={16} color="#64748B" />
                    </TouchableOpacity>
                  ) : (
                    <View className="px-3.5 py-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl">
                      <Text className="text-[12px] text-[#94A3B8] font-normal">Select country first</Text>
                    </View>
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-1.5">CITY *</Text>
                  {stateId ? (
                    <TouchableOpacity
                      onPress={() => setActiveDropdown('city')}
                      className="flex-row items-center justify-between bg-[#F8FAFC] px-3.5 py-3 rounded-xl border border-[#E2E8F0]"
                    >
                      <Text className="text-[#334155] text-[13px] font-medium" numberOfLines={1}>
                        {city || 'Select City'}
                      </Text>
                      <Ionicons name="chevron-down" size={16} color="#64748B" />
                    </TouchableOpacity>
                  ) : (
                    <View className="px-3.5 py-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl">
                      <Text className="text-[12px] text-[#94A3B8] font-normal">Select state first</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Address Line 1 / Street input */}
              <View>
                <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-1.5">ADDRESS LINE 1 / STREET *</Text>
                <View className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-1 flex-row items-center">
                  <Ionicons name="map-outline" size={16} color="#64748B" style={{ marginRight: 8 }} />
                  <TextInput
                    placeholder="Enter locality, street or sector..."
                    placeholderTextColor="#94A3B8"
                    className="py-2.5 flex-1 text-[13px] text-[#0F172A] font-normal"
                    value={locality}
                    onChangeText={(val) => {
                      setLocality(val);
                      setLocalityId('');
                    }}
                  />
                  {loadingLocalitySuggestions && <ActivityIndicator size="small" color="#008E96" />}
                </View>

                {localitySuggestions.length > 0 && (
                  <View className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg mt-1 max-h-48 overflow-hidden">
                    <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                      {localitySuggestions.map((item) => (
                        <TouchableOpacity
                          key={item._id}
                          onPress={() => {
                            setLocality(item.name);
                            setLocalityId(item._id);
                            setLocalitySuggestions([]);
                          }}
                          className="px-4 py-3 border-b border-[#F1F5F9] flex-row items-center gap-2"
                        >
                          <Ionicons name="location-outline" size={16} color="#008E96" />
                          <Text className="text-sm text-[#334155] font-medium">
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* 3. Additional Details Card */}
            {(() => {
              const isOfficeTypeSelected =
                subType?.toLowerCase().includes('office') ||
                (!subType && propertyType?.toLowerCase().includes('office'));

              const isRetailShopSelected =
                subType?.toLowerCase().includes('retail') ||
                subType?.toLowerCase().includes('shop') ||
                subType?.toLowerCase().includes('store') ||
                subType?.toLowerCase().includes('showroom') ||
                (!subType && (propertyType?.toLowerCase().includes('retail') || propertyType?.toLowerCase().includes('shop')));

              const isResidentialSelected =
                propertyType?.toLowerCase().includes('residential') ||
                propertyType?.toLowerCase().includes('apartment') ||
                propertyType?.toLowerCase().includes('villa') ||
                propertyType?.toLowerCase().includes('house') ||
                propertyType?.toLowerCase().includes('flat');

              return (
                <View className="bg-white rounded-[24px] p-6 border border-[#E2E8F0] shadow-xs mb-5">
                  <View className="flex-row items-center justify-between mb-1.5 flex-wrap gap-2">
                    <View className="flex-row items-center gap-2.5">
                      <View className="w-9 h-9 rounded-xl bg-[#E6F7F6] items-center justify-center">
                        <Ionicons name="options" size={18} color="#008E96" />
                      </View>
                      <Text className="text-[#0F172A] font-bold text-[17px]">
                        3. Additional Details
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      {isOfficeTypeSelected && (
                        <View className="bg-[#E6F7F6] px-3 py-1 rounded-full border border-[#B2EBF2]">
                          <Text className="text-[#008E96] font-bold text-[11px]">OFFICE SPECS</Text>
                        </View>
                      )}
                      {isRetailShopSelected && !isOfficeTypeSelected && (
                        <View className="bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE]">
                          <Text className="text-[#3B82F6] font-bold text-[11px]">RETAIL SHOP SPECS</Text>
                        </View>
                      )}
                      {isResidentialSelected && !isOfficeTypeSelected && !isRetailShopSelected && (
                        <View className="bg-[#F3E8FF] px-3 py-1 rounded-full border border-[#E9D5FF]">
                          <Text className="text-[#9333EA] font-bold text-[11px]">RESIDENTIAL SPECS</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Text className="text-[#64748B] font-normal text-[13px] mb-5">
                    Configure common attributes shared across all these units.
                  </Text>

                  {/* Row 1: Common Across All Types (Age of Property, Facing Direction, Construction Status) */}
                  <View className="flex-row flex-wrap gap-3 mb-4">
                    <View className="flex-1 min-w-[140px]">
                      <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-1.5">
                        Age of Property (Years)
                      </Text>
                      <View className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-1">
                        <TextInput
                          value={ageOfProperty}
                          onChangeText={setAgeOfProperty}
                          placeholder="e.g. 2"
                          placeholderTextColor="#94A3B8"
                          keyboardType="numeric"
                          className="py-2.5 text-[13px] text-[#0F172A] font-medium"
                        />
                      </View>
                    </View>

                    <View className="flex-1 min-w-[140px]">
                      <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-1.5">
                        Facing Direction
                      </Text>
                      <TouchableOpacity
                        onPress={() => setActiveDropdown('facingDirection')}
                        className="border border-[#E2E8F0] rounded-xl px-3.5 py-3.5 flex-row justify-between items-center bg-[#F8FAFC]"
                      >
                        <Text
                          className={`font-medium text-[13px] ${facingDirection ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}
                          numberOfLines={1}
                        >
                          {facingDirection || 'Select Facing Direction'}
                        </Text>
                        <Ionicons name="chevron-down" size={15} color="#64748B" />
                      </TouchableOpacity>
                    </View>

                    <View className="flex-1 min-w-[140px]">
                      <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-1.5">
                        Construction Status
                      </Text>
                      <TouchableOpacity
                        onPress={() => setActiveDropdown('constructionStatus')}
                        className="border border-[#E2E8F0] rounded-xl px-3.5 py-3.5 flex-row justify-between items-center bg-[#F8FAFC]"
                      >
                        <Text
                          className={`font-medium text-[13px] ${constructionStatus ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}
                          numberOfLines={1}
                        >
                          {constructionStatus || 'Select Status'}
                        </Text>
                        <Ionicons name="chevron-down" size={15} color="#64748B" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Row 2: Office, Retail Shop, or Default Commercial (Zone Type, Ownership Type) */}
                  {(isOfficeTypeSelected || isRetailShopSelected || !isResidentialSelected) && (
                    <View className="flex-row flex-wrap gap-3 mb-4">
                      <View className="flex-1 min-w-[140px]">
                        <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-1.5">
                          Zone Type
                        </Text>
                        <TouchableOpacity
                          onPress={() => setActiveDropdown('zoneType')}
                          className="border border-[#E2E8F0] rounded-xl px-3.5 py-3.5 flex-row justify-between items-center bg-[#F8FAFC]"
                        >
                          <Text
                            className={`font-medium text-[13px] ${zoneType ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}
                            numberOfLines={1}
                          >
                            {zoneType || 'Select Zone Type'}
                          </Text>
                          <Ionicons name="chevron-down" size={15} color="#64748B" />
                        </TouchableOpacity>
                      </View>

                      <View className="flex-1 min-w-[140px]">
                        <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-1.5">
                          Ownership Type
                        </Text>
                        <TouchableOpacity
                          onPress={() => setActiveDropdown('ownershipType')}
                          className="border border-[#E2E8F0] rounded-xl px-3.5 py-3.5 flex-row justify-between items-center bg-[#F8FAFC]"
                        >
                          <Text
                            className={`font-medium text-[13px] ${ownershipType ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}
                            numberOfLines={1}
                          >
                            {ownershipType || 'Select Ownership Type'}
                          </Text>
                          <Ionicons name="chevron-down" size={15} color="#64748B" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/* Row 3: Office specific or Default Commercial (Location Hub, Property Condition) */}
                  {(isOfficeTypeSelected || (!isRetailShopSelected && !isResidentialSelected)) && (
                    <View className="flex-row flex-wrap gap-3 mb-4">
                      <View className="flex-1 min-w-[140px]">
                        <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-1.5">
                          Location Hub
                        </Text>
                        <TouchableOpacity
                          onPress={() => setActiveDropdown('locationHub')}
                          className="border border-[#E2E8F0] rounded-xl px-3.5 py-3.5 flex-row justify-between items-center bg-[#F8FAFC]"
                        >
                          <Text
                            className={`font-medium text-[13px] ${locationHub ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}
                            numberOfLines={1}
                          >
                            {locationHub || 'Select Location Hub'}
                          </Text>
                          <Ionicons name="chevron-down" size={15} color="#64748B" />
                        </TouchableOpacity>
                      </View>

                      <View className="flex-1 min-w-[140px]">
                        <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-1.5">
                          Property Condition
                        </Text>
                        <View className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-1">
                          <TextInput
                            value={propertyCondition}
                            onChangeText={setPropertyCondition}
                            placeholder="e.g. Ready to move"
                            placeholderTextColor="#94A3B8"
                            className="py-2.5 text-[13px] text-[#0F172A] font-medium"
                          />
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Row 4: Residential specific or Default (Furnishing Status) */}
                  {(isResidentialSelected || (!isOfficeTypeSelected && !isRetailShopSelected)) && (
                    <View className="flex-row flex-wrap gap-3 mb-4">
                      <View className="flex-1 min-w-[140px]">
                        <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-1.5">
                          Furnishing Status
                        </Text>
                        <TouchableOpacity
                          onPress={() => setActiveDropdown('furnishingStatus')}
                          className="border border-[#E2E8F0] rounded-xl px-3.5 py-3.5 flex-row justify-between items-center bg-[#F8FAFC]"
                        >
                          <Text
                            className={`font-medium text-[13px] ${furnishingStatus ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}
                            numberOfLines={1}
                          >
                            {furnishingStatus || 'Select Furnishing Status'}
                          </Text>
                          <Ionicons name="chevron-down" size={15} color="#64748B" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/* Description field shown for Retail Shop, Residential, and Default (not for Office as requested) */}
                  {!isOfficeTypeSelected && (
                    <View className="w-full">
                      <Text className="text-[#475569] font-bold text-[11px] uppercase tracking-wider mb-1.5">
                        Description
                      </Text>
                      <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Write details about the location, connectivity, amenities and security..."
                        placeholderTextColor="#94A3B8"
                        multiline
                        numberOfLines={3}
                        className="border border-[#E2E8F0] rounded-xl p-3.5 text-[13px] text-[#0F172A] bg-[#F8FAFC] font-normal min-h-[75px]"
                        style={{ textAlignVertical: 'top' }}
                      />
                    </View>
                  )}
                </View>
              );
            })()}

            {/* 4. Common Images Card */}
            <View className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] shadow-xs">
              <View className="flex-row items-center gap-2.5 mb-1">
                <View className="w-8 h-8 rounded-xl bg-[#E6F7F6] items-center justify-center">
                  <Ionicons name="images" size={17} color="#008E96" />
                </View>
                <Text className="text-[#0F172A] font-bold text-[16px]">4. Common Images & Media</Text>
              </View>
              <Text className="text-[#64748B] font-normal text-[12px] mb-4">
                Upload photos that apply to all units in this batch.
              </Text>

              <TouchableOpacity
                onPress={handlePickImages}
                className="border-2 border-dashed border-[#CBD5E1] rounded-2xl py-8 px-4 items-center justify-center bg-[#F8FAFC]"
              >
                <View className="w-12 h-12 rounded-full bg-white border border-[#E2E8F0] items-center justify-center mb-2.5 shadow-xs">
                  <Ionicons name="cloud-upload-outline" size={24} color="#008E96" />
                </View>
                <Text className="font-bold text-[#1E293B] text-[14px]">Click to upload common property photos</Text>
                <Text className="text-[#64748B] font-normal text-[12px] mt-0.5">PNG, JPG, JPEG files supported (max 10)</Text>
              </TouchableOpacity>

              {images.length > 0 && (
                <View className="mt-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-[#1E293B] font-semibold text-[13px]">Uploaded Photos ({images.length})</Text>
                    <TouchableOpacity onPress={() => setImages([])}>
                      <Text className="text-red-500 font-medium text-[12px]">Clear All</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                    {images.map((img, idx) => (
                      <View key={idx} className="relative">
                        <Image
                          source={{ uri: img.uri }}
                          className="w-16 h-16 rounded-xl border border-gray-200"
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          onPress={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute -top-1.5 -right-1.5 bg-white rounded-full shadow-xs"
                        >
                          <Ionicons name="close-circle" size={20} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* 5. Common Amenities Button */}
            <View className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] shadow-xs flex-row justify-between items-center">
              <View className="flex-1 pr-4">
                <View className="flex-row items-center gap-2.5 mb-1">
                  <View className="w-8 h-8 rounded-xl bg-[#E6F7F6] items-center justify-center">
                    <Ionicons name="sparkles" size={17} color="#008E96" />
                  </View>
                  <Text className="text-[#0F172A] font-bold text-[16px]">5. Common Amenities</Text>
                </View>
                <Text className="text-[#64748B] font-normal text-[12px]">
                  Select shared facilities available for these listings.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowAmenitiesModal(true)}
                className="border border-[#008E96] rounded-xl px-4 py-3 bg-[#E6F7F6] flex-row items-center gap-1.5"
              >
                <Text className="text-[#008E96] font-bold text-[13px]">
                  Choose ({selectedAmenities.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 2: QUANTITY - Matching Exact Centered UI */}
        {currentStep === 2 && (
          <View className="bg-white rounded-[24px] p-8 border border-[#E2E8F0] shadow-xs items-center my-2">
            {/* Soft Mint Circular Icon */}
            <View className="w-16 h-16 rounded-full bg-[#E6F7F6] items-center justify-center mb-5">
              <Ionicons name="layers" size={28} color="#008E96" />
            </View>

            {/* Title & Subtitle */}
            <Text className="text-[#0F172A] font-bold text-[22px] text-center mb-1.5">
              Specify Listing Quantity
            </Text>
            <Text className="text-[#64748B] font-normal text-[13px] text-center mb-8">
              How many commercial or residential units do you want to list in this batch?
            </Text>

            {/* Quantity Input Box */}
            <Text className="text-[#94A3B8] font-bold text-[11px] uppercase tracking-widest mb-2.5 text-center">
              QUANTITY OF UNITS
            </Text>
            <View className="border border-[#E2E8F0] rounded-2xl w-64 py-2 bg-white items-center justify-center shadow-xs mb-6">
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="2"
                placeholderTextColor="#94A3B8"
                className="text-center font-bold text-[#0F172A] text-[24px] w-full py-1.5"
              />
            </View>

            {/* Quick Presets Pills */}
            <View className="flex-row gap-2 mb-8">
              {['1', '2', '5', '10', '20'].map((val) => (
                <TouchableOpacity
                  key={val}
                  onPress={() => setQuantity(val)}
                  className="px-4 py-1.5 rounded-full border"
                  style={{
                    backgroundColor: quantity === val ? '#E6F7F6' : '#F8FAFC',
                    borderColor: quantity === val ? '#008E96' : '#E2E8F0',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: quantity === val ? 'Inter-Bold' : 'Inter-Medium',
                      fontSize: 12,
                      color: quantity === val ? '#008E96' : '#64748B',
                    }}
                  >
                    {val}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* STEP 3: CONFIG MODE */}
        {currentStep === 3 && (
          <View className="bg-white rounded-[22px] p-6 border border-[#E2E8F0] shadow-xs gap-5">
            <View className="flex-row items-center gap-3">
              <View className="w-11 h-11 rounded-2xl bg-[#E6F7F6] items-center justify-center">
                <Ionicons name="settings" size={22} color="#008E96" />
              </View>
              <View>
                <Text className="text-[#0F172A] font-bold text-[18px]">Configuration Mode</Text>
                <Text className="text-[#64748B] font-normal text-[13px]">Choose whether all units share the exact same specs</Text>
              </View>
            </View>

            <View className="gap-3.5 mt-1">
              <TouchableOpacity
                onPress={() => setConfigMode('Uniform')}
                className="border-2 rounded-2xl p-5 flex-row items-center justify-between"
                style={{
                  borderColor: configMode === 'Uniform' ? '#008E96' : '#E2E8F0',
                  backgroundColor: configMode === 'Uniform' ? '#E6F7F6' : '#FFFFFF',
                }}
              >
                <View className="flex-1 pr-3">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="cube" size={18} color="#008E96" />
                    <Text className="text-[#0F172A] font-bold text-[15px]">Uniform Specs (All Units Same)</Text>
                  </View>
                  <Text className="text-[#64748B] font-normal text-[12px] mt-1.5 leading-5">
                    Same BHK, Price & Area applied automatically to all {quantity} units. Fast & easy.
                  </Text>
                </View>
                <Ionicons name={configMode === 'Uniform' ? 'radio-button-on' : 'radio-button-off'} size={24} color="#008E96" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setConfigMode('Custom')}
                className="border-2 rounded-2xl p-5 flex-row items-center justify-between"
                style={{
                  borderColor: configMode === 'Custom' ? '#008E96' : '#E2E8F0',
                  backgroundColor: configMode === 'Custom' ? '#E6F7F6' : '#FFFFFF',
                }}
              >
                <View className="flex-1 pr-3">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="options" size={18} color="#64748B" />
                    <Text className="text-[#0F172A] font-bold text-[15px]">Custom Specs</Text>
                  </View>
                  <Text className="text-[#64748B] font-normal text-[12px] mt-1.5 leading-5">
                    Customize pricing, floor number or area individually per listing unit.
                  </Text>
                </View>
                <Ionicons name={configMode === 'Custom' ? 'radio-button-on' : 'radio-button-off'} size={24} color="#008E96" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 4: CONFIGURATIONS - Shared vs Individual Unit Specifications */}
        {currentStep === 4 && (
          <View className="my-2">
            {configMode === 'Uniform' ? (
              /* UNIFORM / SHARED UNIT CONFIGURATION */
              <View className="bg-white rounded-[24px] p-5 md:p-8 border border-[#E2E8F0] shadow-xs">
                {/* Top Header Section */}
                <View className="mb-5">
                  <View className="flex-row items-center gap-3">
                    <View className="w-11 h-11 rounded-2xl bg-[#E6F7F6] items-center justify-center">
                      <Ionicons name="storefront" size={22} color="#008E96" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text className="text-[#0F172A] font-bold text-[19px]">
                        Shared Unit Configuration
                      </Text>
                    </View>
                  </View>

                  {/* Badges Row */}
                  <View className="flex-row flex-wrap items-center gap-2 mt-3 mb-2">
                    <View className="bg-[#EFF6FF] px-3 py-1 rounded-lg">
                      <Text className="text-[#3B82F6] font-bold text-[11px] uppercase">
                        {propertyType || 'COMMERCIAL'}
                      </Text>
                    </View>
                    <View className="bg-[#E6F7F6] px-3 py-1 rounded-lg">
                      <Text className="text-[#008E96] font-bold text-[11px]">
                        Applied to all {quantity || 2} units
                      </Text>
                    </View>
                    <View className="bg-[#F1F5F9] px-3 py-1 rounded-lg border border-[#E2E8F0]">
                      <Text className="text-[#475569] font-bold text-[11px]">
                        1 Shared Template
                      </Text>
                    </View>
                  </View>

                  <Text className="text-[#64748B] font-normal text-[13px] leading-5">
                    Fill in the shared specifications below — this configuration will be automatically cloned to all {quantity || 2} units.
                  </Text>
                </View>

                {/* Inner Polished Template Card */}
                <View className="border border-[#B2EBF2] rounded-[22px] p-4 md:p-6 bg-white shadow-2xs">
                  {/* Template Top Header */}
                  <View className="flex-row items-center justify-between flex-wrap gap-2 mb-5 border-b border-[#F1F5F9] pb-4">
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="checkmark-circle" size={20} color="#008E96" />
                      <Text className="text-[#0F172A] font-bold text-[15px]">
                        Shared Configuration Template
                      </Text>
                    </View>
                    <View className="bg-[#E6F7F6] px-3 py-1 rounded-full">
                      <Text className="text-[#008E96] font-bold text-[11px]">
                        Clones to {quantity || 2} units
                      </Text>
                    </View>
                  </View>

                  {/* Section 1: Core Dimensions & Pricing */}
                  <Text className="text-[#008E96] font-bold text-[12px] uppercase tracking-wider mb-3">
                    1. Core Pricing & Dimensions
                  </Text>

                  <View className="flex-row gap-3 mb-3.5">
                    <View style={{ flex: 1 }}>
                      <Text className="text-[#475569] font-bold text-[11px] uppercase mb-1.5">OFFICE TYPE</Text>
                      <TextInput
                        value={defaultBhk}
                        onChangeText={setDefaultBhk}
                        placeholder="e.g. Private Office"
                        placeholderTextColor="#94A3B8"
                        className="h-12 border border-[#E2E8F0] rounded-xl px-3.5 text-[13px] text-[#0F172A] font-medium bg-[#F8FAFC]"
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text className="text-[#475569] font-bold text-[11px] uppercase mb-1.5">PRICE (INR) *</Text>
                      <View className="h-12 border border-[#E2E8F0] rounded-xl px-3.5 flex-row items-center bg-[#F8FAFC]">
                        <Text className="font-bold text-[#008E96] text-[15px] mr-1.5">₹</Text>
                        <TextInput
                          value={defaultPrice}
                          onChangeText={setDefaultPrice}
                          keyboardType="numeric"
                          placeholder="Price in Rs"
                          placeholderTextColor="#94A3B8"
                          className="flex-1 text-[13px] text-[#0F172A] font-bold"
                        />
                      </View>
                    </View>
                  </View>

                  <View className="flex-row gap-3 mb-3.5">
                    <View style={{ flex: 1 }}>
                      <Text className="text-[#475569] font-bold text-[11px] uppercase mb-1.5">AREA (SQ.FT) *</Text>
                      <TextInput
                        value={defaultArea}
                        onChangeText={setDefaultArea}
                        keyboardType="numeric"
                        placeholder="Sq. Ft."
                        placeholderTextColor="#94A3B8"
                        className="h-12 border border-[#E2E8F0] rounded-xl px-3.5 text-[13px] text-[#0F172A] font-medium bg-[#F8FAFC]"
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text className="text-[#475569] font-bold text-[11px] uppercase mb-1.5">FLOOR LEVEL</Text>
                      <TextInput
                        value={defaultFloor}
                        onChangeText={setDefaultFloor}
                        keyboardType="numeric"
                        placeholder="e.g. 1"
                        placeholderTextColor="#94A3B8"
                        className="h-12 border border-[#E2E8F0] rounded-xl px-3.5 text-[13px] text-[#0F172A] font-medium bg-[#F8FAFC]"
                      />
                    </View>
                  </View>

                  <View className="flex-row gap-3 mb-6">
                    <View style={{ flex: 1 }}>
                      <Text className="text-[#475569] font-bold text-[11px] uppercase mb-1.5">TOTAL FLOORS</Text>
                      <TextInput
                        value={defaultTotalFloors}
                        onChangeText={setDefaultTotalFloors}
                        keyboardType="numeric"
                        placeholder="e.g. 5"
                        placeholderTextColor="#94A3B8"
                        className="h-12 border border-[#E2E8F0] rounded-xl px-3.5 text-[13px] text-[#0F172A] font-medium bg-[#F8FAFC]"
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text className="text-[#475569] font-bold text-[11px] uppercase mb-1.5">CEILING HT (FT)</Text>
                      <TextInput
                        value={defaultCeilingHeight}
                        onChangeText={setDefaultCeilingHeight}
                        keyboardType="numeric"
                        placeholder="e.g. 12"
                        placeholderTextColor="#94A3B8"
                        className="h-12 border border-[#E2E8F0] rounded-xl px-3.5 text-[13px] text-[#0F172A] font-medium bg-[#F8FAFC]"
                      />
                    </View>
                  </View>

                  {/* Section 2: Rooms & Capacity */}
                  <Text className="text-[#008E96] font-bold text-[12px] uppercase tracking-wider mb-3 border-t border-[#F1F5F9] pt-4">
                    2. Rooms & Capacity
                  </Text>

                  <View className="flex-row gap-3 mb-3.5">
                    <View style={{ flex: 1 }}>
                      <Text className="text-[#475569] font-bold text-[11px] uppercase mb-1.5">CABINS</Text>
                      <TextInput
                        value={defaultCabins}
                        onChangeText={setDefaultCabins}
                        keyboardType="numeric"
                        placeholder="e.g. 4"
                        placeholderTextColor="#94A3B8"
                        className="h-12 border border-[#E2E8F0] rounded-xl px-3.5 text-[13px] text-[#0F172A] font-medium bg-[#F8FAFC]"
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text className="text-[#475569] font-bold text-[11px] uppercase mb-1.5">MEETING ROOMS</Text>
                      <TextInput
                        value={defaultMeetingRooms}
                        onChangeText={setDefaultMeetingRooms}
                        keyboardType="numeric"
                        placeholder="e.g. 2"
                        placeholderTextColor="#94A3B8"
                        className="h-12 border border-[#E2E8F0] rounded-xl px-3.5 text-[13px] text-[#0F172A] font-medium bg-[#F8FAFC]"
                      />
                    </View>
                  </View>

                  <View className="flex-row gap-3 mb-6">
                    <View style={{ flex: 1 }}>
                      <Text className="text-[#475569] font-bold text-[11px] uppercase mb-1.5">WASHROOMS</Text>
                      <TextInput
                        value={defaultWashrooms}
                        onChangeText={setDefaultWashrooms}
                        keyboardType="numeric"
                        placeholder="e.g. 3"
                        placeholderTextColor="#94A3B8"
                        className="h-12 border border-[#E2E8F0] rounded-xl px-3.5 text-[13px] text-[#0F172A] font-medium bg-[#F8FAFC]"
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text className="text-[#475569] font-bold text-[11px] uppercase mb-1.5">PARKING SPOTS</Text>
                      <TextInput
                        value={defaultParking}
                        onChangeText={setDefaultParking}
                        placeholder="Slots"
                        placeholderTextColor="#94A3B8"
                        className="h-12 border border-[#E2E8F0] rounded-xl px-3.5 text-[13px] text-[#0F172A] font-medium bg-[#F8FAFC]"
                      />
                    </View>
                  </View>

                  {/* Section 3: Deposit & Utilities */}
                  <Text className="text-[#008E96] font-bold text-[12px] uppercase tracking-wider mb-3 border-t border-[#F1F5F9] pt-4">
                    3. Deposit & Utilities
                  </Text>

                  <View className="flex-row gap-3 mb-4">
                    <View style={{ flex: 1 }}>
                      <Text className="text-[#475569] font-bold text-[11px] uppercase mb-1.5">SECURITY DEPOSIT</Text>
                      <TextInput
                        value={defaultSecurityDeposit}
                        onChangeText={setDefaultSecurityDeposit}
                        keyboardType="numeric"
                        placeholder="Deposit in Rs"
                        placeholderTextColor="#94A3B8"
                        className="h-12 border border-[#E2E8F0] rounded-xl px-3.5 text-[13px] text-[#0F172A] font-medium bg-[#F8FAFC]"
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text className="text-[#475569] font-bold text-[11px] uppercase mb-1.5">MAINTENANCE / MO</Text>
                      <TextInput
                        value={defaultMaintenance}
                        onChangeText={setDefaultMaintenance}
                        placeholder="Rs / month"
                        placeholderTextColor="#94A3B8"
                        className="h-12 border border-[#E2E8F0] rounded-xl px-3.5 text-[13px] text-[#0F172A] font-medium bg-[#F8FAFC]"
                      />
                    </View>
                  </View>

                  {/* Power Backup Toggle Card */}
                  <TouchableOpacity
                    onPress={() => setDefaultPowerBackup(!defaultPowerBackup)}
                    className="flex-row items-center justify-between p-4 rounded-xl border"
                    style={{
                      borderColor: defaultPowerBackup ? '#008E96' : '#E2E8F0',
                      backgroundColor: defaultPowerBackup ? '#E6F7F6' : '#F8FAFC',
                    }}
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className="w-6 h-6 rounded-lg items-center justify-center border"
                        style={{
                          borderColor: defaultPowerBackup ? '#008E96' : '#CBD5E1',
                          backgroundColor: defaultPowerBackup ? '#008E96' : '#FFFFFF',
                        }}
                      >
                        {defaultPowerBackup && <Ionicons name="checkmark" size={15} color="white" />}
                      </View>
                      <View>
                        <Text className="text-[#0F172A] font-bold text-[14px]">
                          24x7 Power Backup Available
                        </Text>
                        <Text className="text-[#64748B] font-normal text-[12px]">
                          Includes generator facility for these commercial units
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* INDIVIDUAL UNIT SPECIFICATIONS (Exact Reference UI) */
              <View className="bg-white rounded-[24px] p-5 md:p-8 border border-[#E2E8F0] shadow-xs">
                {/* Top Header */}
                <View className="mb-6">
                  <View className="flex-row items-center justify-between flex-wrap gap-3">
                    <View className="flex-row items-center gap-2.5">
                      <View className="w-10 h-10 rounded-xl bg-[#E6F7F6] items-center justify-center">
                        <Ionicons name="storefront" size={20} color="#008E96" />
                      </View>
                      <Text className="text-[#0F172A] font-bold text-[20px]">
                        Individual Unit Specifications
                      </Text>
                      <View className="bg-[#EFF6FF] px-3 py-1 rounded-md">
                        <Text className="text-[#3B82F6] font-bold text-[11px] uppercase">
                          {propertyType || 'COMMERCIAL'}
                        </Text>
                      </View>
                    </View>

                    <View className="bg-[#EFF6FF] px-4 py-1.5 rounded-xl border border-[#BFDBFE]">
                      <Text className="text-[#3B82F6] font-bold text-[13px]">
                        {quantity || 2} Units
                      </Text>
                    </View>
                  </View>

                  <Text className="text-[#64748B] font-normal text-[13px] mt-2">
                    Specify Unit No., Floor, Price, Area and commercial details for each unit.
                  </Text>
                </View>

                {/* Per-Unit Form Cards */}
                <View className="gap-6">
                  {Array.from({ length: Math.min(Number(quantity) || 2, 30) }).map((_, idx) => {
                    const unitNumber = idx + 1;
                    const isPowerBackup = getCustomUnitField(idx, 'powerBackup', defaultPowerBackup);

                    return (
                      <View
                        key={idx}
                        className="border border-[#F1F5F9] rounded-[24px] p-5 md:p-6 bg-white shadow-2xs"
                      >
                        {/* Unit Card Header */}
                        <View className="flex-row justify-between items-center mb-5 border-b border-[#F8FAFC] pb-3.5">
                          <Text className="text-[#008E96] font-bold text-[16px]">
                            Commercial Unit #{unitNumber}
                          </Text>
                          <Text className="text-[#94A3B8] font-bold text-[11px] uppercase tracking-wider">
                            CONFIGURE UNIT SPECS
                          </Text>
                        </View>

                        {/* Row 1: 5 Inputs */}
                        <View className="flex-row flex-wrap gap-3 mb-4">
                          <View className="flex-1 min-w-[130px]">
                            <Text className="text-[#94A3B8] font-bold text-[11px] uppercase mb-1.5">UNIT NO *</Text>
                            <TextInput
                              value={getCustomUnitField(idx, 'unitNo', `Unit ${unitNumber}`)}
                              onChangeText={(val) => updateCustomUnit(idx, 'unitNo', val)}
                              placeholder={`Unit ${unitNumber}`}
                              placeholderTextColor="#94A3B8"
                              className="border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0F172A] font-medium bg-white"
                            />
                          </View>

                          <View className="flex-1 min-w-[130px]">
                            <Text className="text-[#94A3B8] font-bold text-[11px] uppercase mb-1.5">OFFICE TYPE</Text>
                            <TextInput
                              value={getCustomUnitField(idx, 'officeType', defaultBhk)}
                              onChangeText={(val) => updateCustomUnit(idx, 'officeType', val)}
                              placeholder="e.g. Private Office"
                              placeholderTextColor="#94A3B8"
                              className="border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0F172A] font-medium bg-white"
                            />
                          </View>

                          <View className="flex-1 min-w-[130px]">
                            <Text className="text-[#94A3B8] font-bold text-[11px] uppercase mb-1.5">PRICE (INR) *</Text>
                            <TextInput
                              value={getCustomUnitField(idx, 'price', defaultPrice)}
                              onChangeText={(val) => updateCustomUnit(idx, 'price', val)}
                              keyboardType="numeric"
                              placeholder="3456788"
                              placeholderTextColor="#94A3B8"
                              className="border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0F172A] font-medium bg-white"
                            />
                          </View>

                          <View className="flex-1 min-w-[130px]">
                            <Text className="text-[#94A3B8] font-bold text-[11px] uppercase mb-1.5">AREA (SQ.FT) *</Text>
                            <TextInput
                              value={getCustomUnitField(idx, 'area', defaultArea)}
                              onChangeText={(val) => updateCustomUnit(idx, 'area', val)}
                              keyboardType="numeric"
                              placeholder="2345"
                              placeholderTextColor="#94A3B8"
                              className="border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0F172A] font-medium bg-white"
                            />
                          </View>

                          <View className="flex-1 min-w-[100px]">
                            <Text className="text-[#94A3B8] font-bold text-[11px] uppercase mb-1.5">FLOOR LEVEL</Text>
                            <TextInput
                              value={getCustomUnitField(idx, 'floor', defaultFloor)}
                              onChangeText={(val) => updateCustomUnit(idx, 'floor', val)}
                              keyboardType="numeric"
                              placeholder="1"
                              placeholderTextColor="#94A3B8"
                              className="border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0F172A] font-medium bg-white"
                            />
                          </View>
                        </View>

                        {/* Row 2: 5 Inputs */}
                        <View className="flex-row flex-wrap gap-3 mb-4">
                          <View className="flex-1 min-w-[130px]">
                            <Text className="text-[#94A3B8] font-bold text-[11px] uppercase mb-1.5">CABINS</Text>
                            <TextInput
                              value={getCustomUnitField(idx, 'cabins', defaultCabins)}
                              onChangeText={(val) => updateCustomUnit(idx, 'cabins', val)}
                              keyboardType="numeric"
                              placeholder="e.g. 4"
                              placeholderTextColor="#94A3B8"
                              className="border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0F172A] font-medium bg-white"
                            />
                          </View>

                          <View className="flex-1 min-w-[130px]">
                            <Text className="text-[#94A3B8] font-bold text-[11px] uppercase mb-1.5">MEETING ROOMS</Text>
                            <TextInput
                              value={getCustomUnitField(idx, 'meetingRooms', defaultMeetingRooms)}
                              onChangeText={(val) => updateCustomUnit(idx, 'meetingRooms', val)}
                              keyboardType="numeric"
                              placeholder="e.g. 2"
                              placeholderTextColor="#94A3B8"
                              className="border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0F172A] font-medium bg-white"
                            />
                          </View>

                          <View className="flex-1 min-w-[130px]">
                            <Text className="text-[#94A3B8] font-bold text-[11px] uppercase mb-1.5">WASHROOMS</Text>
                            <TextInput
                              value={getCustomUnitField(idx, 'washrooms', defaultWashrooms)}
                              onChangeText={(val) => updateCustomUnit(idx, 'washrooms', val)}
                              keyboardType="numeric"
                              placeholder="e.g. 3"
                              placeholderTextColor="#94A3B8"
                              className="border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0F172A] font-medium bg-white"
                            />
                          </View>

                          <View className="flex-1 min-w-[130px]">
                            <Text className="text-[#94A3B8] font-bold text-[11px] uppercase mb-1.5">PARKING SPOTS</Text>
                            <TextInput
                              value={getCustomUnitField(idx, 'parking', defaultParking)}
                              onChangeText={(val) => updateCustomUnit(idx, 'parking', val)}
                              placeholder="Slots"
                              placeholderTextColor="#94A3B8"
                              className="border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0F172A] font-medium bg-white"
                            />
                          </View>

                          <View className="flex-1 min-w-[130px]">
                            <Text className="text-[#94A3B8] font-bold text-[11px] uppercase mb-1.5">CEILING HT (FT)</Text>
                            <TextInput
                              value={getCustomUnitField(idx, 'ceilingHeight', defaultCeilingHeight)}
                              onChangeText={(val) => updateCustomUnit(idx, 'ceilingHeight', val)}
                              keyboardType="numeric"
                              placeholder="e.g. 12"
                              placeholderTextColor="#94A3B8"
                              className="border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0F172A] font-medium bg-white"
                            />
                          </View>
                        </View>

                        {/* Row 3: Security Deposit, Maintenance, Total Floors & Power Backup Checkbox */}
                        <View className="flex-row flex-wrap items-center gap-4">
                          <View className="flex-1 min-w-[150px]">
                            <Text className="text-[#94A3B8] font-bold text-[11px] uppercase mb-1.5">SECURITY DEPOSIT</Text>
                            <TextInput
                              value={getCustomUnitField(idx, 'securityDeposit', defaultSecurityDeposit)}
                              onChangeText={(val) => updateCustomUnit(idx, 'securityDeposit', val)}
                              keyboardType="numeric"
                              placeholder="Rs"
                              placeholderTextColor="#94A3B8"
                              className="border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0F172A] font-medium bg-white"
                            />
                          </View>

                          <View className="flex-1 min-w-[150px]">
                            <Text className="text-[#94A3B8] font-bold text-[11px] uppercase mb-1.5">MAINTENANCE/MO</Text>
                            <TextInput
                              value={getCustomUnitField(idx, 'maintenance', defaultMaintenance)}
                              onChangeText={(val) => updateCustomUnit(idx, 'maintenance', val)}
                              placeholder="Rs/month"
                              placeholderTextColor="#94A3B8"
                              className="border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0F172A] font-medium bg-white"
                            />
                          </View>

                          <View className="flex-1 min-w-[120px]">
                            <Text className="text-[#94A3B8] font-bold text-[11px] uppercase mb-1.5">TOTAL FLOORS</Text>
                            <TextInput
                              value={getCustomUnitField(idx, 'totalFloors', defaultTotalFloors)}
                              onChangeText={(val) => updateCustomUnit(idx, 'totalFloors', val)}
                              keyboardType="numeric"
                              placeholder="5"
                              placeholderTextColor="#94A3B8"
                              className="border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0F172A] font-medium bg-white"
                            />
                          </View>

                          <TouchableOpacity
                            onPress={() => updateCustomUnit(idx, 'powerBackup', !isPowerBackup)}
                            className="flex-row items-center py-2.5 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                          >
                            <View
                              className="w-4 h-4 rounded border items-center justify-center mr-2"
                              style={{
                                borderColor: isPowerBackup ? '#008E96' : '#CBD5E1',
                                backgroundColor: isPowerBackup ? '#008E96' : '#FFFFFF',
                              }}
                            >
                              {isPowerBackup && <Ionicons name="checkmark" size={12} color="white" />}
                            </View>
                            <Text className="text-[#475569] font-bold text-[11px] uppercase">
                              POWER BACKUP
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        )}

        {/* STEP 5: REVIEW & PUBLISH - Matching Exact Reference UI */}
        {currentStep === 5 && (
          <View className="bg-white rounded-[24px] p-5 md:p-8 border border-[#E2E8F0] shadow-xs my-2">
            {/* Top Header */}
            <View className="mb-6">
              <Text className="text-[#0F172A] font-bold text-[22px]">
                Review Batch Details
              </Text>
              <Text className="text-[#64748B] font-normal text-[13px] mt-1">
                Verify details before creating all properties in the system.
              </Text>
            </View>

            {/* Top Row: Common Specs & Batch Summary Cards */}
            <View className="flex-row flex-wrap gap-5 mb-8">
              {/* Left Card: COMMON SPECS */}
              <View className="flex-1 min-w-[280px] border border-[#F1F5F9] rounded-[20px] p-6 bg-white shadow-2xs justify-between gap-4">
                <Text className="text-[#94A3B8] font-bold text-[11px] uppercase tracking-wider">
                  COMMON SPECS
                </Text>
                <View className="gap-3.5">
                  <View className="flex-row justify-between flex-wrap gap-2">
                    <Text className="text-[#64748B] font-medium text-[13px]">
                      Base Title: <Text className="text-[#0F172A] font-bold">{baseTitlePrefix || 'dfgh.'}</Text>
                    </Text>
                    <Text className="text-[#64748B] font-medium text-[13px]">
                      Purpose: <Text className="text-[#0F172A] font-bold">{category || 'Sell'}</Text>
                    </Text>
                  </View>

                  <View className="flex-row justify-between flex-wrap gap-2">
                    <Text className="text-[#64748B] font-medium text-[13px]">
                      Property Type: <Text className="text-[#0F172A] font-bold">{propertyType || 'Commercial'}</Text>
                    </Text>
                    <Text className="text-[#64748B] font-medium text-[13px]">
                      Sub-Type: <Text className="text-[#0F172A] font-bold">{subType || defaultBhk || 'Office'}</Text>
                    </Text>
                  </View>

                  <Text className="text-[#64748B] font-medium text-[13px]">
                    Address: <Text className="text-[#0F172A] font-bold">
                      {city ? `${city.toUpperCase()}, ${state} (${pincode || '160001'})` : 'CHANDIGARH, Jammu, J&K (160001)'}
                    </Text>
                  </Text>

                  <Text className="text-[#64748B] font-medium text-[13px]">
                    Associated Project: <Text className="text-[#0F172A] font-bold">{linkedProject || 'Noble Callista'}</Text>
                  </Text>

                  <View className="flex-row justify-between flex-wrap gap-2 pt-1 border-t border-[#F8FAFC]">
                    <Text className="text-[#64748B] font-medium text-[13px]">
                      Images Uploaded: <Text className="text-[#0F172A] font-bold">{images.length || 0}</Text>
                    </Text>
                    <Text className="text-[#64748B] font-medium text-[13px]">
                      Amenities: <Text className="text-[#0F172A] font-bold">{selectedAmenities.length || 0}</Text>
                    </Text>
                  </View>

                  <View className="flex-row justify-between flex-wrap gap-2 pt-2 border-t border-[#F8FAFC]">
                    {ageOfProperty ? (
                      <Text className="text-[#64748B] font-medium text-[12px]">
                        Age: <Text className="text-[#0F172A] font-bold">{ageOfProperty} Yrs</Text>
                      </Text>
                    ) : null}
                    {facingDirection ? (
                      <Text className="text-[#64748B] font-medium text-[12px]">
                        Facing: <Text className="text-[#0F172A] font-bold">{facingDirection}</Text>
                      </Text>
                    ) : null}
                    {constructionStatus ? (
                      <Text className="text-[#64748B] font-medium text-[12px]">
                        Status: <Text className="text-[#0F172A] font-bold">{constructionStatus}</Text>
                      </Text>
                    ) : null}
                    {zoneType ? (
                      <Text className="text-[#64748B] font-medium text-[12px]">
                        Zone: <Text className="text-[#0F172A] font-bold">{zoneType}</Text>
                      </Text>
                    ) : null}
                    {ownershipType ? (
                      <Text className="text-[#64748B] font-medium text-[12px]">
                        Ownership: <Text className="text-[#0F172A] font-bold">{ownershipType}</Text>
                      </Text>
                    ) : null}
                    {locationHub ? (
                      <Text className="text-[#64748B] font-medium text-[12px]">
                        Hub: <Text className="text-[#0F172A] font-bold">{locationHub}</Text>
                      </Text>
                    ) : null}
                    {propertyCondition ? (
                      <Text className="text-[#64748B] font-medium text-[12px]">
                        Condition: <Text className="text-[#0F172A] font-bold">{propertyCondition}</Text>
                      </Text>
                    ) : null}
                    {furnishingStatus ? (
                      <Text className="text-[#64748B] font-medium text-[12px]">
                        Furnishing: <Text className="text-[#0F172A] font-bold">{furnishingStatus}</Text>
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              {/* Right Card: BATCH SUMMARY */}
              <View className="w-full md:w-[340px] border border-[#F1F5F9] rounded-[20px] p-6 bg-white shadow-2xs justify-between gap-6">
                <View>
                  <Text className="text-[#008E96] font-bold text-[12px] uppercase tracking-wider mb-5">
                    BATCH SUMMARY
                  </Text>

                  <View className="gap-3.5">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-[#475569] font-medium text-[13px]">Total Units:</Text>
                      <Text className="text-[#0F172A] font-bold text-[15px]">{quantity || 2}</Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                      <Text className="text-[#475569] font-medium text-[13px]">Type:</Text>
                      <Text className="text-[#2563EB] font-bold text-[13px] uppercase">
                        {propertyType || 'COMMERCIAL'}
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                      <Text className="text-[#475569] font-medium text-[13px]">Price Range:</Text>
                      <Text className="text-[#0F172A] font-bold text-[13px]">
                        Rs. {parseInt(defaultPrice || '3456788', 10).toLocaleString('en-IN')} - Rs. {parseInt(defaultPrice || '3456788', 10).toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleFinalPublish}
                  disabled={isSubmitting || isSaving}
                  className="bg-[#008E96] py-3.5 px-5 rounded-xl items-center justify-center flex-row gap-2 shadow-xs"
                >
                  {isSubmitting || isSaving ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle-outline" size={18} color="white" />
                      <Text className="text-white font-bold text-[14px]">Publish Batch Listings</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom Section: UNITS BREAKDOWN Table */}
            <Text className="text-[#94A3B8] font-bold text-[12px] uppercase tracking-wider mb-3">
              UNITS BREAKDOWN
            </Text>

            <View className="border border-[#F1F5F9] rounded-[16px] bg-white overflow-hidden shadow-2xs">
              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View className="min-w-[700px]">
                  {/* Table Header */}
                  <View className="flex-row bg-[#F8FAFC] px-5 py-3.5 border-b border-[#F1F5F9]">
                    <Text className="w-[100px] text-[#475569] font-bold text-[13px]">Unit No</Text>
                    <Text className="w-[150px] text-[#475569] font-bold text-[13px]">Price</Text>
                    <Text className="w-[130px] text-[#475569] font-bold text-[13px]">Area</Text>
                    <Text className="w-[130px] text-[#475569] font-bold text-[13px]">Office Type</Text>
                    <Text className="w-[80px] text-[#475569] font-bold text-[13px]">Floor</Text>
                    <Text className="w-[90px] text-[#475569] font-bold text-[13px]">Cabins</Text>
                    <Text className="w-[90px] text-[#475569] font-bold text-[13px]">Parking</Text>
                  </View>

                  {/* Table Rows */}
                  {Array.from({ length: Math.min(Number(quantity) || 2, 30) }).map((_, index) => {
                    const unitNumber = index + 1;
                    const isCustom = configMode === 'Different';

                    const unitName = isCustom ? getCustomUnitField(index, 'unitNo', `Unit ${unitNumber}`) : `Unit ${unitNumber}`;
                    const rawPrice = isCustom ? getCustomUnitField(index, 'price', defaultPrice || '3456788') : (defaultPrice || '3456788');
                    const rawArea = isCustom ? getCustomUnitField(index, 'area', defaultArea || '2345') : (defaultArea || '2345');
                    const rawOfficeType = isCustom ? getCustomUnitField(index, 'officeType', defaultBhk || '-') : (defaultBhk || '-');
                    const rawFloor = isCustom ? getCustomUnitField(index, 'floor', defaultFloor || '1') : (defaultFloor || '1');
                    const rawCabins = isCustom ? getCustomUnitField(index, 'cabins', defaultCabins || '-') : (defaultCabins || '-');
                    const rawParking = isCustom ? getCustomUnitField(index, 'parking', defaultParking || '-') : (defaultParking || '-');

                    const formattedPrice = `Rs. ${parseInt(rawPrice || '0', 10).toLocaleString('en-IN')}`;
                    const formattedArea = `${rawArea} Sq. Ft.`;

                    return (
                      <View
                        key={index}
                        className={`flex-row px-5 py-4 items-center ${index !== (Number(quantity) || 2) - 1 ? 'border-b border-[#F8FAFC]' : ''
                          }`}
                      >
                        <Text className="w-[100px] text-[#0F172A] font-bold text-[13px]">
                          {unitName}
                        </Text>
                        <Text className="w-[150px] text-[#334155] font-medium text-[13px]">
                          {formattedPrice}
                        </Text>
                        <Text className="w-[130px] text-[#334155] font-medium text-[13px]">
                          {formattedArea}
                        </Text>
                        <Text className="w-[130px] text-[#64748B] font-normal text-[13px]">
                          {rawOfficeType}
                        </Text>
                        <Text className="w-[80px] text-[#64748B] font-normal text-[13px]">
                          {rawFloor}
                        </Text>
                        <Text className="w-[90px] text-[#64748B] font-normal text-[13px]">
                          {rawCabins}
                        </Text>
                        <Text className="w-[90px] text-[#64748B] font-normal text-[13px]">
                          {rawParking}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View className="bg-white border-t border-[#E2E8F0] px-5 py-4 flex-row justify-between items-center shadow-md">
        {currentStep > 1 ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBackStep}
            className="flex-row items-center px-5 py-3 rounded-xl border border-[#E2E8F0] bg-white"
          >
            <Ionicons name="chevron-back" size={16} color="#475569" />
            <Text className="text-[#475569] font-bold text-[14px] ml-1">Back</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {currentStep < 5 ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleNextStep}
            className="bg-[#008E96] px-7 py-3.5 rounded-xl flex-row items-center gap-2 shadow-xs"
          >
            <Text className="text-white font-bold text-[14px]">
              Next: {steps[currentStep]?.label}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleFinalPublish}
            disabled={isSubmitting || isSaving}
            className="bg-[#008E96] px-8 py-3.5 rounded-xl flex-row items-center gap-2.5 shadow-md"
          >
            {isSubmitting || isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="rocket" size={17} color="white" />
                <Text className="text-white font-bold text-[15px]">Publish {quantity} Listings</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Modals */}
      {renderDropdownModal()}
      {renderAmenitiesModal()}
    </SafeAreaView>
  );
};

export default BulkUploadScreen;
