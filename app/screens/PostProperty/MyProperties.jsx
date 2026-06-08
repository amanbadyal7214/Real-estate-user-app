import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../api';
import { formatPrice } from '../../utils/formatPrice';
import { useLookup } from '../../../hooks/useLookup';

const getLocalityName = (locality) => {
  if (!locality) return '';
  if (typeof locality === 'object') {
    return locality.name || locality.label || '';
  }
  return locality;
};

const DEACTIVATE_REASONS = [
  'Sold/Rented out via Propertize',
  'Sold/Rented out via other source',
  'I don\'t want to sell/rent anymore',
  'Duplicate Listing',
  'Incorrect Details',
];

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Deactivate Modal States
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [propertyToDeactivate, setPropertyToDeactivate] = useState(null);
  const [deactivateReason, setDeactivateReason] = useState(null);

  // Filter States
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const [selectedBhk, setSelectedBhk] = useState(null);
  
  // Dropdown UI States
  const [activeFilterDropdown, setActiveFilterDropdown] = useState(null);

  // Lookups data
  const { propertyTypes = [], fetchLookups } = useLookup();

  useEffect(() => {
    fetchLookups();
    loadMyProperties();
  }, []);

  const loadMyProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get('/properties/me');
      if (response.data?.success) {
        setProperties(response.data.data || []);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error('Error loading my properties:', error);
      Alert.alert('Error', 'Failed to fetch your properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await api.get('/properties/me');
      if (response.data?.success) {
        setProperties(response.data.data || []);
      }
    } catch (error) {
      console.error('Error refreshing my properties:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to permanently delete this property listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await api.delete(`/properties/${id}`);
              if (response.data?.success) {
                setProperties(prev => prev.filter(p => p._id !== id));
                Alert.alert('Success', 'Property deleted successfully.');
              }
            } catch (error) {
              console.error('Error deleting property:', error);
              Alert.alert('Error', 'Failed to delete property. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const response = await api.put(`/properties/${id}`, {
        isActive: !currentStatus,
      });
      if (response.data?.success) {
        setProperties(prev =>
          prev.map(p => (p._id === id ? { ...p, isActive: !currentStatus } : p))
        );
        Alert.alert(
          'Success',
          `Property listing has been ${!currentStatus ? 'activated' : 'deactivated'}.`
        );
      }
    } catch (error) {
      console.error('Error updating property status:', error);
      Alert.alert('Error', 'Failed to update property status. Please try again.');
    }
  };

  const handleDeactivateClick = (propertyId) => {
    setPropertyToDeactivate(propertyId);
    setDeactivateReason(null);
    setShowDeactivateModal(true);
  };

  const submitDeactivation = async () => {
    if (!propertyToDeactivate || !deactivateReason) return;
    try {
      setLoading(true);
      const response = await api.put(`/properties/${propertyToDeactivate}`, {
        isActive: false,
        deactivationReason: deactivateReason,
      });
      if (response.data?.success) {
        setProperties(prev =>
          prev.map(p => (p._id === propertyToDeactivate ? { ...p, isActive: false } : p))
        );
        setShowDeactivateModal(false);
        setPropertyToDeactivate(null);
        setDeactivateReason(null);
        Alert.alert('Success', 'Property listing has been deactivated.');
      }
    } catch (error) {
      console.error('Error deactivating property:', error);
      Alert.alert('Error', 'Failed to deactivate property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (property) => {
    router.push({
      pathname: '/screens/PostProperty/PropertyDetails',
      params: { isEditMode: 'true', editPropertyId: property._id },
    });
  };

  const handleBoost = (property, type) => {
    // Navigate user to the edit page where the task can be completed
    router.push({
      pathname: '/screens/PostProperty/PropertyDetails',
      params: { isEditMode: 'true', editPropertyId: property._id, focusTab: type },
    });
  };

  const calculateVisibility = (property) => {
    let score = 45; // base score for basic details
    if (property.images && property.images.length > 0) score += 15;
    if (property.description && property.description.trim().length > 10) score += 30;
    if (property.amenities && property.amenities.length > 0) score += 10;
    return Math.min(score, 100);
  };

  const clearFilters = () => {
    setSelectedLocality(null);
    setSelectedPropertyType(null);
    setSelectedBhk(null);
  };

  // Get unique localities from properties list
  const localitiesList = Array.from(
    new Set(properties.map(p => getLocalityName(p.locality)).filter(Boolean))
  );

  const getFilteredProperties = () => {
    return properties.filter(p => {
      if (selectedLocality && getLocalityName(p.locality) !== selectedLocality) return false;
      if (selectedPropertyType) {
        const typeId = p.propertyType?._id || p.propertyType;
        if (typeId !== selectedPropertyType._id) return false;
      }
      if (selectedBhk) {
        const bhkCount = p.residential?.bedrooms || p.bhk;
        if (bhkCount !== selectedBhk) return false;
      }
      return true;
    });
  };

  const filteredProperties = getFilteredProperties();

  const renderFilterPill = (type, label, isActive, options = []) => {
    const isDropdownOpen = activeFilterDropdown === type;
    return (
      <TouchableOpacity
        key={type}
        onPress={() => setActiveFilterDropdown(isDropdownOpen ? null : type)}
        className="flex-row items-center border rounded-full px-4 py-2 justify-center gap-1.5"
        style={{
          backgroundColor: isActive 
            ? '#008E96' 
            : isDropdownOpen 
              ? 'rgba(0, 142, 150, 0.1)' 
              : '#FFFFFF',
          borderColor: isActive 
            ? '#008E96' 
            : isDropdownOpen 
              ? '#008E96' 
              : '#E4E7EC'
        }}
      >
        <Text
          style={{ 
            fontFamily: isActive ? 'Inter-SemiBold' : 'Inter-Medium',
            color: isActive ? '#FFFFFF' : isDropdownOpen ? '#008E96' : '#4A5565'
          }}
          className="text-[13px] leading-5"
        >
          {label}
        </Text>
        <Ionicons
          name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
          size={14}
          color={isActive ? 'white' : isDropdownOpen ? '#008E96' : '#6A7282'}
        />
      </TouchableOpacity>
    );
  };

  const renderSelectionModal = () => {
    if (!activeFilterDropdown) return null;

    let title = '';
    let options = [];
    let selectedValue = null;
    let onSelect = () => {};

    if (activeFilterDropdown === 'locality') {
      title = 'Select Locality';
      options = localitiesList.map(loc => ({ key: loc, label: loc, data: loc }));
      selectedValue = selectedLocality;
      onSelect = (item) => {
        setSelectedLocality(item.data);
        setActiveFilterDropdown(null);
      };
    } else if (activeFilterDropdown === 'propertyType') {
      title = 'Select Property Type';
      options = propertyTypes.map(opt => ({
        key: opt._id,
        label: opt.label || opt.name,
        data: opt,
      }));
      selectedValue = selectedPropertyType?._id;
      onSelect = (item) => {
        setSelectedPropertyType(item.data);
        setActiveFilterDropdown(null);
      };
    } else if (activeFilterDropdown === 'bhk') {
      title = 'Select BHK';
      options = [1, 2, 3, 4].map(num => ({ key: num, label: `${num} BHK`, data: num }));
      selectedValue = selectedBhk;
      onSelect = (item) => {
        setSelectedBhk(item.data);
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
              {options.length > 0 ? (
                options.map((option) => {
                  const isSelected = selectedValue === option.key;
                  return (
                    <TouchableOpacity
                      key={option.key}
                      onPress={() => onSelect(option)}
                      className="py-4 border-b border-gray-50 flex-row justify-between items-center"
                    >
                      <Text
                        style={{ 
                          fontFamily: isSelected ? 'Inter-SemiBold' : 'Inter-Regular',
                          color: isSelected ? '#008E96' : '#344054'
                        }}
                        className="text-[15px]"
                      >
                        {option.label}
                      </Text>
                      {isSelected && (
                        <View className="w-5 h-5 rounded-full bg-[#008E96] items-center justify-center">
                          <Ionicons name="checkmark" size={12} color="white" />
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

  const renderDeactivateModal = () => {
    return (
      <Modal
        visible={showDeactivateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowDeactivateModal(false);
          setPropertyToDeactivate(null);
          setDeactivateReason(null);
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white rounded-[28px] p-6 w-full max-w-[360px] shadow-2xl">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
              <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-[#0F172A]">
                Deactivate Listing
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  setShowDeactivateModal(false);
                  setPropertyToDeactivate(null);
                  setDeactivateReason(null);
                }}
                className="p-1"
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Subtitle */}
            <Text style={{ fontFamily: 'Inter-Regular' }} className="text-sm text-[#64748B] mb-6 leading-5">
              Please tell us why you are deactivating this property. This helps us improve our service.
            </Text>

            {/* Reasons List */}
            <View className="gap-3 mb-8">
              {DEACTIVATE_REASONS.map((reason) => {
                const isSelected = deactivateReason === reason;
                return (
                  <TouchableOpacity
                    key={reason}
                    onPress={() => setDeactivateReason(reason)}
                    className="flex-row items-center p-4 border rounded-2xl bg-white"
                    style={{
                      borderColor: isSelected ? '#008E96' : '#F1F5F9',
                      backgroundColor: isSelected ? '#E6F7F6' : '#FFFFFF'
                    }}
                  >
                    {/* Radio Button */}
                    <View 
                      className="w-5 h-5 rounded-full border items-center justify-center mr-3"
                      style={{
                        borderColor: isSelected ? '#008E96' : '#94A3B8'
                      }}
                    >
                      {isSelected && (
                        <View className="w-2.5 h-2.5 rounded-full bg-[#008E96]" />
                      )}
                    </View>
                    <Text 
                      style={{ fontFamily: isSelected ? 'Inter-Medium' : 'Inter-Regular' }}
                      className="text-[#334155] text-sm flex-1"
                    >
                      {reason}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Actions Footer */}
            <View className="flex-row items-center justify-between mt-2">
              <TouchableOpacity 
                onPress={() => {
                  setShowDeactivateModal(false);
                  setPropertyToDeactivate(null);
                  setDeactivateReason(null);
                }}
                className="py-3 px-4"
              >
                <Text style={{ fontFamily: 'Inter-Medium' }} className="text-sm text-[#64748B]">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                disabled={!deactivateReason || loading}
                onPress={submitDeactivation}
                className="rounded-2xl py-3 px-8 justify-center items-center"
                style={{
                  backgroundColor: deactivateReason ? '#F87171' : '#FCA5A5'
                }}
              >
                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white text-sm">
                  Deactivate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderPropertyCard = ({ item }) => {
    const visibilityScore = calculateVisibility(item);
    const hasPhotos = item.images && item.images.length > 0;
    const hasDesc = item.description && item.description.trim().length > 10;
    const hasAmenities = item.amenities && item.amenities.length > 0;

    const propertyTypeName = item.propertyType?.name || item.propertyType?.label || 'Residential';

    return (
      <View className="bg-white border border-[#E5E7EB] rounded-2xl p-4 mb-4 shadow-sm">
        {/* Top Section: Image and Details */}
        <View className="flex-row">
          {/* Property Image with overlays */}
          <View className="w-[110px] h-[110px] rounded-xl overflow-hidden bg-gray-100 relative">
            <Image
              source={{
                uri: hasPhotos
                  ? item.images[0]
                  : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=300',
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* Status Badge */}
            <View className="absolute top-2 left-2 bg-white/95 px-2 py-0.5 rounded-full flex-row items-center gap-1 shadow-sm">
              <View 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: item.isActive ? '#10B981' : '#F97316' }}
              />
              <Text className="text-[10px] font-inter-semibold text-gray-700 uppercase">
                {item.isActive ? 'Active' : 'Reviewing'}
              </Text>
            </View>
            {/* Photo Count */}
            {hasPhotos && (
              <View className="absolute top-2 right-2 bg-black/60 px-1.5 py-0.5 rounded-md">
                <Text className="text-[9px] font-inter-bold text-white">
                  {item.images.length} imgs
                </Text>
              </View>
            )}
            {/* Delete button */}
            <TouchableOpacity
              onPress={() => handleDelete(item._id)}
              className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-white items-center justify-center shadow-md border border-gray-100"
            >
              <Ionicons name="trash" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* Text details */}
          <View className="flex-1 ml-4 justify-between">
            <View>
              <View className="flex-row items-center gap-1 mb-1">
                <Text className="text-[10px] font-inter-bold text-blue-600 uppercase tracking-wider">
                  Featured Listing
                </Text>
                <Text className="text-gray-400 text-[10px]">•</Text>
                <Text className="text-gray-500 text-[10px] font-inter-semibold uppercase">
                  {propertyTypeName}
                </Text>
              </View>
              <Text className="text-[#101828] text-base font-inter-bold" numberOfLines={1}>
                {item.title || 'Property on Sale'}
              </Text>
              <Text className="text-[#008E96] text-[15px] font-inter-bold mt-0.5">
                {formatPrice(item.price)}
              </Text>
            </View>
            <View className="flex-row items-center gap-2 mt-2">
              <Text className="text-gray-500 text-xs font-inter-regular">
                {item.area || 'N/A'} {item.areaUnit?.name || 'sq.ft.'}
              </Text>
              <Text className="text-gray-300">|</Text>
              <View className="bg-gray-100 px-2 py-0.5 rounded-md">
                <Text className="text-[10px] font-inter-medium text-gray-600 uppercase">
                  {getLocalityName(item.locality) || 'Sector 71'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Live Visibility score bar */}
        <View className="mt-4 pt-3 border-t border-gray-50">
          <View className="flex-row justify-between items-center mb-1.5">
            <View className="flex-row items-center gap-1">
              <Text className="text-gray-500 text-[11px] font-inter-bold uppercase tracking-wider">
                Live Visibility
              </Text>
              <Ionicons name="information-circle-outline" size={13} color="#98A2B3" />
            </View>
            <Text className="text-[#101828] text-sm font-inter-bold">
              {visibilityScore}%
            </Text>
          </View>
          <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <View
              className="h-full"
              style={{ 
                width: `${visibilityScore}%`,
                backgroundColor: visibilityScore === 100 ? '#10B981' : '#F59E0B'
              }}
            />
          </View>
          <View className="flex-row justify-between mt-1 px-0.5">
            {['0%', '30%', '60%', '90%', '100%'].map(mark => (
              <Text key={mark} className="text-gray-400 text-[9px] font-inter-medium">
                {mark}
              </Text>
            ))}
          </View>
        </View>

        {/* Visibility Optimization Alert/Box */}
        {visibilityScore < 100 && (
          <View className="mt-4 p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex-row items-center justify-between">
            <View className="flex-1 pr-3 flex-row items-center gap-2">
              <Ionicons name="warning" size={16} color="#D08700" />
              <View className="flex-1">
                <Text className="text-gray-800 text-[11px] font-inter-semibold">
                  Visibility Optimization
                </Text>
                <Text className="text-gray-500 text-[9px] font-inter-regular mt-0.5">
                  Listing is average. Complete tasks to boost views.
                </Text>
              </View>
            </View>
            <View className="flex-row gap-1">
              {!hasPhotos && (
                <TouchableOpacity
                  onPress={() => handleBoost(item, 'photos')}
                  className="bg-white border border-gray-200 px-2 py-1 rounded-lg flex-row items-center gap-1 shadow-sm"
                >
                  <Ionicons name="camera-outline" size={10} color="#10B981" />
                  <Text className="text-green-600 text-[9px] font-inter-semibold">+15%</Text>
                </TouchableOpacity>
              )}
              {!hasAmenities && (
                <TouchableOpacity
                  onPress={() => handleBoost(item, 'amenities')}
                  className="bg-white border border-gray-200 px-2 py-1 rounded-lg flex-row items-center gap-1 shadow-sm"
                >
                  <Ionicons name="checkmark-circle-outline" size={10} color="#10B981" />
                  <Text className="text-green-600 text-[9px] font-inter-semibold">+10%</Text>
                </TouchableOpacity>
              )}
              {!hasDesc && (
                <TouchableOpacity
                  onPress={() => handleBoost(item, 'description')}
                  className="bg-white border border-gray-200 px-2 py-1 rounded-lg flex-row items-center gap-1 shadow-sm"
                >
                  <Ionicons name="document-text-outline" size={10} color="#10B981" />
                  <Text className="text-green-600 text-[9px] font-inter-semibold">+30%</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Action Buttons Row */}
        <View className="flex-row gap-2 mt-4 border-t border-[#F2F4F7] pt-4 justify-between">

          <TouchableOpacity
            onPress={() => {
              if (item.isActive) {
                handleDeactivateClick(item._id);
              } else {
                handleToggleActive(item._id, item.isActive);
              }
            }}
            className="rounded-xl flex-row items-center justify-center py-2.5 px-3 flex-1 border"
            style={{
              backgroundColor: item.isActive ? '#FEF2F2' : '#F0FDF4',
              borderColor: item.isActive ? '#FEE2E2' : '#DCFCE7'
            }}
          >
            <Ionicons
              name={item.isActive ? 'close-circle-outline' : 'checkmark-circle-outline'}
              size={14}
              color={item.isActive ? '#EF4444' : '#10B981'}
            />
            <Text
              className="text-xs font-inter-semibold ml-1"
              style={{
                color: item.isActive ? '#DC2626' : '#16A34A'
              }}
            >
              {item.isActive ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleEdit(item)}
            className="bg-[#008E96] rounded-xl flex-row items-center justify-center py-2.5 px-3 flex-1"
          >
            <Ionicons name="create-outline" size={14} color="white" />
            <Text className="text-white text-xs font-inter-semibold ml-1">Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/screens/PropertyDetails',
                params: { 
                  propertyId: item._id || item.id,
                  property: JSON.stringify(item)
                },
              })
            }
            className="bg-white border border-[#008E96] rounded-xl flex-row items-center justify-center py-2.5 px-3 flex-1"
          >
            <Ionicons name="open-outline" size={14} color="#008E96" />
            <Text className="text-[#008E96] text-xs font-inter-semibold ml-1">View</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      {/* Header Bar */}
      <LinearGradient colors={['#006B73', '#008E96']} className="px-4 pt-10 pb-6 rounded-b-[32px] shadow-md">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center gap-2">
            <TouchableOpacity onPress={() => router.back()} className="mr-1">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-inter-bold">My Listings</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/screens/PostProperty/PropertyDetails')}
            className="bg-white/25 px-3 py-1.5 rounded-full flex-row items-center gap-1"
          >
            <Ionicons name="add" size={16} color="white" />
            <Text className="text-white text-xs font-inter-semibold">Add New</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Filter Options */}
      <View className="px-4 py-3 bg-white border-b border-[#F2F4F7] flex-row justify-between items-center">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          className="flex-1 mr-4"
        >
          {renderFilterPill(
            'locality',
            selectedLocality || 'Locality',
            !!selectedLocality
          )}
          {renderFilterPill(
            'propertyType',
            selectedPropertyType ? selectedPropertyType.label || selectedPropertyType.name : 'Property Type',
            !!selectedPropertyType
          )}
          {renderFilterPill(
            'bhk',
            selectedBhk ? `${selectedBhk} BHK` : 'BHK',
            !!selectedBhk
          )}
        </ScrollView>
        {(selectedLocality || selectedPropertyType || selectedBhk) && (
          <TouchableOpacity onPress={clearFilters} className="px-2 py-1">
            <Text className="text-[#EF4444] text-[11px] font-inter-bold uppercase tracking-wider">
              Reset
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Properties List */}
      <View className="flex-1 px-4 mt-4">
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#008E96" />
            <Text className="mt-4 text-gray-500 font-inter-medium">Loading your listings...</Text>
          </View>
        ) : filteredProperties.length > 0 ? (
          <FlatList
            data={filteredProperties}
            keyExtractor={item => item._id}
            renderItem={renderPropertyCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListHeaderComponent={() => (
              <Text className="text-gray-500 text-xs font-inter-medium mb-3">
                Showing {filteredProperties.length} out of {properties.length} properties
              </Text>
            )}
          />
        ) : (
          <View className="flex-1 items-center justify-center py-20 px-8">
            <View className="w-16 h-16 rounded-full bg-[#E6F7F7] items-center justify-center mb-4">
              <Ionicons name="home-outline" size={32} color="#008E96" />
            </View>
            <Text className="text-[#101828] text-lg font-inter-bold text-center">
              No Listings Found
            </Text>
            <Text className="text-gray-500 text-sm font-inter-regular text-center mt-2">
              {properties.length > 0
                ? 'Try resetting or changing your search filters.'
                : "You haven't posted any property listings yet. Click below to post."}
            </Text>
            {properties.length === 0 && (
              <TouchableOpacity
                onPress={() => router.push('/screens/PostProperty/PropertyDetails')}
                className="mt-6 bg-[#008E96] px-6 py-3 rounded-xl shadow-md"
              >
                <Text className="text-white font-inter-semibold">Post Property for FREE</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Dropdown Modals */}
      {renderSelectionModal()}

      {/* Deactivate Listing Modal */}
      {renderDeactivateModal()}
    </SafeAreaView>
  );
};

export default MyProperties;
