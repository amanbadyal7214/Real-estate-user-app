import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown, ChevronUp, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoDataFound from '../../components/NoDataFound';
import PerfectMatchCard from '../../components/PerfectMatchCard';
import { useLocality } from '../../hooks/useLocality';
import { usePropertyDiscovery } from '../../hooks/usePropertyDiscovery';
import { useLocation } from '../context/LocationContext';
import { useLookup } from '../../hooks/useLookup';
import api from '../api';
import { formatPrice } from '../utils/formatPrice';

const BestPriceProperty = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const { currentLocation } = useLocation();
  const { fetchBetterPricedProperties, loading: discoveryLoading } = usePropertyDiscovery();
  const { resolveLocalities, loading: localityLoading } = useLocality();
  const loading = discoveryLoading || localityLoading;

  const [properties, setProperties] = useState([]);

  // Filter States
  const [propertyType, setPropertyType] = useState(null);
  const [lookingFor, setLookingFor] = useState(searchParams.lookingFor || 'sell'); // 'sell' -> Buy, 'rent' -> Rent
  const [city, setCity] = useState(searchParams.city || currentLocation?.city || 'Mohali');
  const [locality, setLocality] = useState(null);
  const [budget, setBudget] = useState(null);

  // Dropdown UI States
  const [activeFilterDropdown, setActiveFilterDropdown] = useState(null);
  const [localitiesList, setLocalitiesList] = useState([]);
  const [loadingLocalities, setLoadingLocalities] = useState(false);

  // Lookups data
  const { propertyTypes = [], fetchLookups } = useLookup();

  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  // Fetch localities when selected city changes
  useEffect(() => {
    const loadLocalities = async () => {
      const activeCity = city || currentLocation?.city || 'Mohali';
      try {
        setLoadingLocalities(true);
        const response = await api.get(`/localities`, {
          params: { city: activeCity }
        });
        if (response.data?.success) {
          setLocalitiesList(response.data.data || []);
        } else {
          setLocalitiesList([]);
        }
      } catch (err) {
        console.error("Error fetching localities for filter:", err);
        setLocalitiesList([]);
      } finally {
        setLoadingLocalities(false);
      }
    };

    loadLocalities();
  }, [city, currentLocation?.city]);

  // Load properties based on selected filters
  const fetchMatches = useCallback(async () => {
    try {
      const params = { 
        limit: 20, 
        PriceAscending: true 
      };

      // 1. Looking For
      params.lookingFor = lookingFor;

      // 2. City
      const effectiveCity = city || searchParams.city || currentLocation?.city;
      if (effectiveCity) {
        params.city = effectiveCity;
      }

      // 3. Property Type
      if (propertyType) {
        params.propertyType = propertyType._id;
      }

      // 4. Locality
      if (locality) {
        params.locality = locality.name || locality;
      }

      // 5. Budget
      if (budget) {
        if (budget.minPrice !== null && budget.minPrice !== undefined) {
          params.minPrice = budget.minPrice;
        }
        if (budget.maxPrice !== null && budget.maxPrice !== undefined) {
          params.maxPrice = budget.maxPrice;
        }
      }

      const res = await fetchBetterPricedProperties(params);
      if (res.success) {
        const enriched = await resolveLocalities(res.data);
        setProperties(enriched);
      }
    } catch (err) {
      console.error("Best Price Fetch Error:", err);
    }
  }, [lookingFor, city, searchParams.city, currentLocation?.city, propertyType, locality, budget, fetchBetterPricedProperties, resolveLocalities]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const clearFilter = (type) => {
    if (type === 'propertyType') setPropertyType(null);
    else if (type === 'lookingFor') setLookingFor('sell'); // default to Buy
    else if (type === 'city') setCity('Mohali'); // reset to Mohali
    else if (type === 'locality') setLocality(null);
    else if (type === 'budget') setBudget(null);
    
    setActiveFilterDropdown(null);
  };

  // Dropdown Options
  const propertyTypeOptions = propertyTypes.length > 0 ? propertyTypes : [
    { _id: 'apartment', label: 'Apartment' },
    { _id: 'independent-house', label: 'Independent House' },
    { _id: 'independent-floor', label: 'Independent Floor' },
    { _id: 'villa', label: 'Villa' },
    { _id: 'commercial', label: 'Commercial' },
    { _id: 'plot', label: 'Plot' }
  ];

  const lookingForOptions = [
    { value: 'sell', label: 'Buy' },
    { value: 'rent', label: 'Rent' }
  ];

  const cityOptions = [
    { value: 'Mohali', label: 'Mohali' },
    { value: 'Kharar', label: 'Kharar' },
    { value: 'Zirakpur', label: 'Zirakpur' },
    { value: 'Sector 125', label: 'Sector 125' },
    { value: 'Derabassi', label: 'Derabassi' },
    { value: 'New Chandigarh', label: 'New Chandigarh' }
  ];

  const buyBudgetOptions = [
    { label: 'Any Budget', minPrice: null, maxPrice: null },
    { label: 'Under ₹30 Lakhs', minPrice: 0, maxPrice: 3000000 },
    { label: '₹30 - ₹50 Lakhs', minPrice: 3000000, maxPrice: 5000000 },
    { label: '₹50 - ₹80 Lakhs', minPrice: 5000000, maxPrice: 8000000 },
    { label: '₹80 Lakhs - ₹1.5 Cr', minPrice: 8000000, maxPrice: 15000000 },
    { label: '₹1.5 - ₹3 Cr', minPrice: 15000000, maxPrice: 30000000 },
    { label: '₹3 - ₹5 Cr', minPrice: 30000000, maxPrice: 50000000 },
    { label: 'Above ₹5 Cr', minPrice: 50000000, maxPrice: 999000000 }
  ];

  const rentBudgetOptions = [
    { label: 'Any Budget', minPrice: null, maxPrice: null },
    { label: 'Under ₹10,000', minPrice: 0, maxPrice: 10000 },
    { label: '₹10,000 - ₹20,000', minPrice: 10000, maxPrice: 20000 },
    { label: '₹20,000 - ₹35,000', minPrice: 20000, maxPrice: 35000 },
    { label: '₹35,000 - ₹50,000', minPrice: 35000, maxPrice: 50000 },
    { label: 'Above ₹50,000', minPrice: 50000, maxPrice: 9999999 }
  ];

  const renderFilterPill = (type, label, isActive) => {
    const isDropdownOpen = activeFilterDropdown === type;
    
    return (
      <TouchableOpacity
        key={type}
        onPress={() => setActiveFilterDropdown(isDropdownOpen ? null : type)}
        className={`flex-row items-center border rounded-full px-4 py-2 justify-center gap-1.5 ${
          isActive 
            ? 'bg-[#008E96] border-[#008E96]' 
            : isDropdownOpen
              ? 'bg-[#008E96]/10 border-[#008E96]'
              : 'bg-white border-[#E4E7EC]'
        }`}
      >
        <Text 
          style={{ fontFamily: isActive ? 'Inter-SemiBold' : 'Inter-Medium' }}
          className={`text-[13px] leading-5 ${
            isActive 
              ? 'text-white' 
              : isDropdownOpen
                ? 'text-[#008E96]'
                : 'text-[#4A5565]'
          }`}
        >
          {label}
        </Text>
        {isActive && type !== 'lookingFor' ? (
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              clearFilter(type);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="ml-1 w-4 h-4 rounded-full bg-white/20 items-center justify-center"
          >
            <X size={10} color="white" strokeWidth={3} />
          </TouchableOpacity>
        ) : null}
        
        {isDropdownOpen ? (
          <ChevronUp size={14} color={isActive ? 'white' : '#008E96'} />
        ) : (
          <ChevronDown size={14} color={isActive ? 'white' : '#6A7282'} />
        )}
      </TouchableOpacity>
    );
  };

  const renderCityPill = () => {
    const type = 'city';
    const label = city || searchParams.city || currentLocation?.city || 'Mohali';
    const isDropdownOpen = activeFilterDropdown === type;
    const isActive = true;
    
    return (
      <TouchableOpacity
        key={type}
        onPress={() => setActiveFilterDropdown(isDropdownOpen ? null : type)}
        className={`flex-row items-center border rounded-full px-4 py-2 justify-center gap-1.5 ${
          isActive 
            ? 'bg-[#008E96] border-[#008E96]' 
            : isDropdownOpen
              ? 'bg-[#008E96]/10 border-[#008E96]'
              : 'bg-white border-[#E4E7EC]'
        }`}
      >
        <Text 
          style={{ fontFamily: 'Inter-SemiBold' }}
          className="text-[13px] leading-5 text-white"
        >
          {label}
        </Text>
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            clearFilter('city');
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="ml-1 w-4 h-4 rounded-full bg-white/20 items-center justify-center"
        >
          <X size={10} color="white" strokeWidth={3} />
        </TouchableOpacity>
        {isDropdownOpen ? (
          <ChevronUp size={14} color="white" />
        ) : (
          <ChevronDown size={14} color="white" />
        )}
      </TouchableOpacity>
    );
  };

  const renderSelectionModal = () => {
    if (!activeFilterDropdown) return null;

    let title = '';
    let options = [];
    let selectedValue = null;
    let onSelect = () => {};

    if (activeFilterDropdown === 'propertyType') {
      title = 'Select Property Type';
      options = propertyTypeOptions.map(opt => ({
        key: opt._id || opt.value || opt.label || String(opt),
        label: opt.label || opt.name || String(opt),
        data: opt
      }));
      selectedValue = propertyType?._id || propertyType?.value || propertyType?.label || propertyType?.name || propertyType;
      onSelect = (item) => {
        setPropertyType(item.data);
        setActiveFilterDropdown(null);
      };
    } else if (activeFilterDropdown === 'lookingFor') {
      title = 'Looking For';
      options = lookingForOptions.map(opt => ({
        key: opt.value,
        label: opt.label,
        data: opt.value
      }));
      selectedValue = lookingFor;
      onSelect = (item) => {
        setLookingFor(item.data);
        setBudget(null);
        setActiveFilterDropdown(null);
      };
    } else if (activeFilterDropdown === 'city') {
      title = 'Select City';
      options = cityOptions.map(opt => ({
        key: opt.value,
        label: opt.label,
        data: opt.value
      }));
      selectedValue = city || searchParams.city || currentLocation?.city || 'Mohali';
      onSelect = (item) => {
        setCity(item.data);
        setLocality(null);
        setActiveFilterDropdown(null);
      };
    } else if (activeFilterDropdown === 'locality') {
      title = `Select Locality in ${city || currentLocation?.city || 'Mohali'}`;
      options = localitiesList.map(opt => ({
        key: opt._id || opt.name,
        label: opt.name,
        data: opt
      }));
      selectedValue = locality?._id || locality?.name || locality;
      onSelect = (item) => {
        setLocality(item.data);
        setActiveFilterDropdown(null);
      };
    } else if (activeFilterDropdown === 'budget') {
      title = 'Select Budget';
      const rawOptions = lookingFor === 'sell' ? buyBudgetOptions : rentBudgetOptions;
      options = rawOptions.map(opt => ({
        key: opt.label,
        label: opt.label,
        data: opt
      }));
      selectedValue = budget?.label;
      onSelect = (item) => {
        setBudget(item.data.minPrice === null ? null : item.data);
        setActiveFilterDropdown(null);
      };
    }

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!activeFilterDropdown}
        onRequestClose={() => setActiveFilterDropdown(null)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <TouchableOpacity 
            activeOpacity={1} 
            className="absolute inset-0"
            onPress={() => setActiveFilterDropdown(null)}
          />
          
          <View className="bg-white rounded-t-[24px] pb-10 max-h-[70%]">
            <View className="items-center py-3">
              <View className="w-10 h-1 bg-gray-200 rounded-full" />
            </View>

            <View className="px-5 pb-3 border-b border-gray-100 flex-row justify-between items-center">
              <Text className="text-[#101828] font-inter-bold text-[18px]">{title}</Text>
              <TouchableOpacity onPress={() => setActiveFilterDropdown(null)}>
                <Text className="text-[#6A7282] font-inter-medium text-[14px]">Cancel</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="px-5 mt-2" showsVerticalScrollIndicator={false}>
              {activeFilterDropdown === 'locality' && loadingLocalities ? (
                <View className="py-10 items-center justify-center">
                  <ActivityIndicator size="small" color="#008E96" />
                </View>
              ) : options.length > 0 ? (
                options.map((option) => {
                  const isSelected = selectedValue === option.key || 
                                     selectedValue === option.label || 
                                     (selectedValue && typeof selectedValue === 'object' && selectedValue._id === option.key);
                  return (
                    <TouchableOpacity
                      key={option.key}
                      onPress={() => onSelect(option)}
                      className="py-4 border-b border-gray-50 flex-row justify-between items-center"
                    >
                      <Text 
                        style={{ fontFamily: isSelected ? 'Inter-SemiBold' : 'Inter-Regular' }}
                        className={`text-[15px] ${isSelected ? 'text-[#008E96]' : 'text-[#344054]'}`}
                      >
                        {option.label}
                      </Text>
                      {isSelected && (
                        <View className="w-5 h-5 rounded-full bg-[#008E96] items-center justify-center">
                          <Text className="text-white text-[10px] font-bold">✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View className="py-10 items-center justify-center">
                  <Text className="text-gray-400 font-inter-medium">No options available</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const formattedProperties = properties.map((property, index) => {
    const id = property._id || property.id || `best-${index}`;
    const priceVal = property.price?.$numberDecimal || property.price || property.priceRange || 0;
    const formattedPrice = typeof priceVal === 'number' 
      ? formatPrice(priceVal) 
      : (typeof priceVal === 'string' && priceVal.trim().startsWith('₹') ? priceVal : 'Price on Request');
      
    const area = property.area || property.residential?.carpetArea?.value || 'N/A';
    const areaUnitStr = property.areaUnit?.name || property.areaUnit || 'sq.ft.';

    return {
      id,
      price: formattedPrice,
      name: property.title || property.projectName || 'Property',
      developer: property.projectName ? `by ${property.projectName}` : `by ${property.owner?.name || property.seller?.name || 'Developer'}`,
      location: [property.localityName || property.locality?.name || property.locality, property.city?.name || property.city, property.state?.name || property.state].filter(Boolean).join(', ') || 'Location not available',
      details: `${property.residential?.bedrooms || property.bhk || property.bedrooms || 'N/A'} BHK • ${area} ${areaUnitStr}`,
      seller: property.owner?.name || property.seller?.name || 'Seller',
      images: property.images?.length > 0 ? property.images : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600'],
      photoCount: property.images?.length || 0,
      isRera: property.isRera || true,
      zeroBrokerage: property.zeroBrokerage || true,
      isWishlisted: property.isWishlisted || false
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 justify-center items-center">
          <ArrowLeft size={28} color="#101828" />
        </TouchableOpacity>
        <Text className="ml-2 text-[20px] text-[#101828] font-inter-semibold">Better Price Properties</Text>
      </View>

      {/* Scrollable Filter Bar */}
      <View className="mb-4 bg-white border-b border-[#F2F4F7] pb-3">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center' }}
        >
          {/* Property Type Pill */}
          {renderFilterPill(
            'propertyType',
            propertyType ? propertyType.label || propertyType.name : 'Property Type',
            !!propertyType
          )}

          {/* Looking For Pill */}
          {renderFilterPill(
            'lookingFor',
            lookingFor === 'sell' ? 'Buy' : 'Rent',
            true
          )}

          {/* City Pill */}
          {renderCityPill()}

          {/* Locality Pill */}
          {renderFilterPill(
            'locality',
            locality ? locality.name || locality : 'Locality',
            !!locality
          )}

          {/* Budget Pill */}
          {renderFilterPill(
            'budget',
            budget ? budget.label : 'Budget',
            !!budget
          )}

        </ScrollView>
      </View>

      {/* Property List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        {loading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#008E96" />
            <Text className="mt-4 text-[#6A7282] font-inter-medium">Finding best prices...</Text>
          </View>
        ) : formattedProperties.length > 0 ? (
          formattedProperties.map((property) => (
            <PerfectMatchCard key={property.id} property={property} />
          ))
        ) : (
          <NoDataFound />
        )}
      </ScrollView>

      {/* Dropdown Modals */}
      {renderSelectionModal()}
    </SafeAreaView>
  );
};

export default BestPriceProperty;
