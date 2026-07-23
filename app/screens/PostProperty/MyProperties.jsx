import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useLookup } from '../../../hooks/useLookup';
import api from '../../api';
import { formatPrice } from '../../utils/formatPrice';

const getLocalityName = (locality) => {
  if (!locality) return '';
  if (typeof locality === 'object') {
    return locality.name || locality.label || '';
  }
  return locality;
};

const DEACTIVATE_REASONS = [
  'Sold/Rented out via HousingMania',
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
        className="flex-row items-center border rounded-full justify-center"
        style={{
          paddingHorizontal: wp('4.3%'),
          paddingVertical: hp('1%'),
          gap: wp('1.6%'),
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
            color: isActive ? '#FFFFFF' : isDropdownOpen ? '#008E96' : '#4A5565',
            fontSize: wp('3.5%'),
            lineHeight: hp('2.5%')
          }}
        >
          {label}
        </Text>
        <Ionicons
          name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
          size={wp('3.7%')}
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
    let onSelect = () => { };

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
          <View className="bg-white" style={{ borderTopLeftRadius: wp('6.4%'), borderTopRightRadius: wp('6.4%'), paddingBottom: hp('5%'), maxHeight: hp('70%') }}>
            <View className="items-center" style={{ paddingVertical: hp('1.5%') }}>
              <View className="bg-gray-200 rounded-full" style={{ width: wp('10.7%'), height: hp('0.5%') }} />
            </View>
            <View className="border-b border-gray-100 flex-row justify-between items-center" style={{ paddingHorizontal: wp('5.3%'), paddingBottom: hp('1.5%') }}>
              <Text className="text-[#101828] font-bold" style={{ fontSize: wp('4.8%') }}>{title}</Text>
              <TouchableOpacity onPress={() => setActiveFilterDropdown(null)}>
                <Text className="text-[#6A7282] font-medium" style={{ fontSize: wp('3.7%') }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ paddingHorizontal: wp('5.3%'), marginTop: hp('1%') }} showsVerticalScrollIndicator={false}>
              {options.length > 0 ? (
                options.map((option) => {
                  const isSelected = selectedValue === option.key;
                  return (
                    <TouchableOpacity
                      key={option.key}
                      onPress={() => onSelect(option)}
                      className="border-b border-gray-50 flex-row justify-between items-center"
                      style={{ paddingVertical: hp('2%') }}
                    >
                      <Text
                        style={{
                          fontFamily: isSelected ? 'Inter-SemiBold' : 'Inter-Regular',
                          color: isSelected ? '#008E96' : '#344054',
                          fontSize: wp('4%')
                        }}
                      >
                        {option.label}
                      </Text>
                      {isSelected && (
                        <View className="rounded-full bg-[#008E96] items-center justify-center" style={{ width: wp('5.3%'), height: wp('5.3%') }}>
                          <Ionicons name="checkmark" size={wp('3.2%')} color="white" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View className="items-center justify-center" style={{ paddingVertical: hp('5%') }}>
                  <Text className="text-gray-400 font-medium">No options available</Text>
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
          <View className="bg-white shadow-2xl w-full" style={{ borderRadius: wp('7.5%'), padding: wp('6.4%'), maxWidth: wp('96%') }}>
            {/* Header */}
            <View className="flex-row justify-between items-center" style={{ marginBottom: hp('2%') }}>
              <Text style={{ fontWeight: '700', fontSize: wp('5.3%') }} className="text-[#0F172A]">
                Deactivate Listing
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowDeactivateModal(false);
                  setPropertyToDeactivate(null);
                  setDeactivateReason(null);
                }}
                style={{ padding: wp('1%') }}
              >
                <Ionicons name="close" size={wp('5.9%')} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Subtitle */}
            <Text style={{ fontWeight: '400', fontSize: wp('3.7%'), marginBottom: hp('3%'), lineHeight: hp('2.5%') }} className="text-[#64748B]">
              Please tell us why you are deactivating this property. This helps us improve our service.
            </Text>

            {/* Reasons List */}
            <View style={{ gap: hp('1.5%'), marginBottom: hp('4%') }}>
              {DEACTIVATE_REASONS.map((reason) => {
                const isSelected = deactivateReason === reason;
                return (
                  <TouchableOpacity
                    key={reason}
                    onPress={() => setDeactivateReason(reason)}
                    className="flex-row items-center border bg-white"
                    style={{
                      padding: wp('4.3%'),
                      borderRadius: wp('4.3%'),
                      borderColor: isSelected ? '#008E96' : '#F1F5F9',
                      backgroundColor: isSelected ? '#E6F7F6' : '#FFFFFF'
                    }}
                  >
                    {/* Radio Button */}
                    <View
                      className="rounded-full border items-center justify-center"
                      style={{
                        width: wp('5.3%'), height: wp('5.3%'), marginRight: wp('3.2%'),
                        borderColor: isSelected ? '#008E96' : '#94A3B8'
                      }}
                    >
                      {isSelected && (
                        <View className="rounded-full bg-[#008E96]" style={{ width: wp('2.7%'), height: wp('2.7%') }} />
                      )}
                    </View>
                    <Text
                      style={{ fontFamily: isSelected ? 'Inter-Medium' : 'Inter-Regular', fontSize: wp('3.7%') }}
                      className="text-[#334155] flex-1"
                    >
                      {reason}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Actions Footer */}
            <View className="flex-row items-center justify-between" style={{ marginTop: hp('1%') }}>
              <TouchableOpacity
                onPress={() => {
                  setShowDeactivateModal(false);
                  setPropertyToDeactivate(null);
                  setDeactivateReason(null);
                }}
                style={{ paddingVertical: hp('1.5%'), paddingHorizontal: wp('4.3%') }}
              >
                <Text style={{ fontWeight: '500', fontSize: wp('3.7%') }} className="text-[#64748B]">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!deactivateReason || loading}
                onPress={submitDeactivation}
                className="justify-center items-center"
                style={{
                  borderRadius: wp('4.3%'), paddingVertical: hp('1.5%'), paddingHorizontal: wp('8.5%'),
                  backgroundColor: deactivateReason ? '#F87171' : '#FCA5A5'
                }}
              >
                <Text style={{ fontWeight: '700', fontSize: wp('3.7%') }} className="text-white">
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
      <View className="bg-white border border-[#E5E7EB] shadow-sm" style={{ borderRadius: wp('4.3%'), padding: wp('4.3%'), marginBottom: hp('2%') }}>
        {/* Top Section: Image and Details */}
        <View className="flex-row">
          {/* Property Image with overlays */}
          <View className="overflow-hidden bg-gray-100 relative" style={{ width: wp('29.3%'), height: wp('29.3%'), borderRadius: wp('3.2%') }}>
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
            <View className="absolute bg-white/95 flex-row items-center shadow-sm" style={{ top: hp('1%'), left: wp('2.1%'), paddingHorizontal: wp('2.1%'), paddingVertical: hp('0.3%'), gap: wp('1%'), borderRadius: wp('1.6%') }}>
              <View
                className="rounded-full"
                style={{ width: wp('1.6%'), height: wp('1.6%'), backgroundColor: item.isActive ? '#10B981' : '#F97316' }}
              />
              <Text className="font-semibold text-gray-700 uppercase" style={{ fontSize: wp('2.7%') }}>
                {item.isActive ? 'Active' : 'Reviewing'}
              </Text>
            </View>
            {/* Photo Count */}
            {hasPhotos && (
              <View className="absolute bg-black/60" style={{ top: hp('1%'), right: wp('2.1%'), paddingHorizontal: wp('1.6%'), paddingVertical: hp('0.3%'), borderRadius: wp('1.6%') }}>
                <Text className="font-bold text-white" style={{ fontSize: wp('2.4%') }}>
                  {item.images.length} imgs
                </Text>
              </View>
            )}
            {/* Delete button */}
            <TouchableOpacity
              onPress={() => handleDelete(item._id)}
              className="absolute bg-white items-center justify-center shadow-md border border-gray-100 rounded-full"
              style={{ bottom: hp('1%'), left: wp('2.1%'), width: wp('8.5%'), height: wp('8.5%') }}
            >
              <Ionicons name="trash" size={wp('4.3%')} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* Text details */}
          <View className="flex-1 justify-between" style={{ marginLeft: wp('4.3%') }}>
            <View>
              <View className="flex-row items-center" style={{ gap: wp('1%'), marginBottom: hp('0.5%') }}>
                <Text className="font-bold text-blue-600 uppercase tracking-wider" style={{ fontSize: wp('2.7%') }}>
                  Featured Listing
                </Text>
                <Text className="text-gray-400" style={{ fontSize: wp('2.7%') }}>•</Text>
                <Text className="text-gray-500 font-semibold uppercase" style={{ fontSize: wp('2.7%') }}>
                  {propertyTypeName}
                </Text>
              </View>
              <Text className="text-[#101828] font-bold" style={{ fontSize: wp('4.3%') }} numberOfLines={1}>
                {item.title || 'Property on Sale'}
              </Text>
              <Text className="text-[#008E96] font-bold" style={{ fontSize: wp('4%'), marginTop: hp('0.3%') }}>
                {formatPrice(item.price)}
              </Text>
            </View>
            <View className="flex-row items-center" style={{ gap: wp('2.1%'), marginTop: hp('1%') }}>
              <Text className="text-gray-500 font-normal" style={{ fontSize: wp('3.2%') }}>
                {item.area || 'N/A'} {item.areaUnit?.name || 'sq.ft.'}
              </Text>
              <Text className="text-gray-300">|</Text>
              <View className="bg-gray-100" style={{ paddingHorizontal: wp('2.1%'), paddingVertical: hp('0.3%'), borderRadius: wp('1.6%') }}>
                <Text className="font-medium text-gray-600 uppercase" style={{ fontSize: wp('2.7%') }}>
                  {getLocalityName(item.locality) || 'Sector 71'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Live Visibility score bar */}
        <View className="border-t border-gray-50" style={{ marginTop: hp('2%'), paddingTop: hp('1.5%') }}>
          <View className="flex-row justify-between items-center" style={{ marginBottom: hp('0.7%') }}>
            <View className="flex-row items-center" style={{ gap: wp('1%') }}>
              <Text className="text-gray-500 font-bold uppercase tracking-wider" style={{ fontSize: wp('2.9%') }}>
                Live Visibility
              </Text>
              <Ionicons name="information-circle-outline" size={wp('3.5%')} color="#98A2B3" />
            </View>
            <Text className="text-[#101828] font-bold" style={{ fontSize: wp('3.7%') }}>
              {visibilityScore}%
            </Text>
          </View>
          <View className="bg-gray-100 rounded-full overflow-hidden" style={{ height: hp('1%') }}>
            <View
              className="h-full"
              style={{
                width: `${visibilityScore}%`,
                backgroundColor: visibilityScore === 100 ? '#10B981' : '#F59E0B'
              }}
            />
          </View>
          <View className="flex-row justify-between" style={{ marginTop: hp('0.5%'), paddingHorizontal: wp('0.5%') }}>
            {['0%', '30%', '60%', '90%', '100%'].map(mark => (
              <Text key={mark} className="text-gray-400 font-medium" style={{ fontSize: wp('2.4%') }}>
                {mark}
              </Text>
            ))}
          </View>
        </View>

        {/* Visibility Optimization Alert/Box */}
        {visibilityScore < 100 && (
          <View className="bg-amber-50/50 border border-amber-100 flex-row items-center justify-between" style={{ marginTop: hp('2%'), padding: wp('3.2%'), borderRadius: wp('3.2%') }}>
            <View className="flex-1 flex-row items-center" style={{ paddingRight: wp('3.2%'), gap: wp('2.1%') }}>
              <Ionicons name="warning" size={wp('4.3%')} color="#D08700" />
              <View style={{ flex: 1 }}>
                <Text className="text-gray-800 font-semibold" style={{ fontSize: wp('2.9%') }}>
                  Visibility Optimization
                </Text>
                <Text className="text-gray-500 font-normal" style={{ fontSize: wp('2.4%'), marginTop: hp('0.3%') }}>
                  Listing is average. Complete tasks to boost views.
                </Text>
              </View>
            </View>
            <View className="flex-row" style={{ gap: wp('1%') }}>
              {!hasPhotos && (
                <TouchableOpacity
                  onPress={() => handleBoost(item, 'photos')}
                  className="bg-white border border-gray-200 flex-row items-center shadow-sm"
                  style={{ paddingHorizontal: wp('2.1%'), paddingVertical: hp('0.5%'), borderRadius: wp('2.1%'), gap: wp('1%') }}
                >
                  <Ionicons name="camera-outline" size={wp('2.7%')} color="#10B981" />
                  <Text className="text-green-600 font-semibold" style={{ fontSize: wp('2.4%') }}>+15%</Text>
                </TouchableOpacity>
              )}
              {!hasAmenities && (
                <TouchableOpacity
                  onPress={() => handleBoost(item, 'amenities')}
                  className="bg-white border border-gray-200 flex-row items-center shadow-sm"
                  style={{ paddingHorizontal: wp('2.1%'), paddingVertical: hp('0.5%'), borderRadius: wp('2.1%'), gap: wp('1%') }}
                >
                  <Ionicons name="checkmark-circle-outline" size={wp('2.7%')} color="#10B981" />
                  <Text className="text-green-600 font-semibold" style={{ fontSize: wp('2.4%') }}>+10%</Text>
                </TouchableOpacity>
              )}
              {!hasDesc && (
                <TouchableOpacity
                  onPress={() => handleBoost(item, 'description')}
                  className="bg-white border border-gray-200 flex-row items-center shadow-sm"
                  style={{ paddingHorizontal: wp('2.1%'), paddingVertical: hp('0.5%'), borderRadius: wp('2.1%'), gap: wp('1%') }}
                >
                  <Ionicons name="document-text-outline" size={wp('2.7%')} color="#10B981" />
                  <Text className="text-green-600 font-semibold" style={{ fontSize: wp('2.4%') }}>+30%</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Action Buttons Row */}
        <View className="flex-row border-t border-[#F2F4F7] justify-between" style={{ gap: wp('2.1%'), marginTop: hp('2%'), paddingTop: hp('2%') }}>

          <TouchableOpacity
            onPress={() => {
              if (item.isActive) {
                handleDeactivateClick(item._id);
              } else {
                handleToggleActive(item._id, item.isActive);
              }
            }}
            className="flex-row items-center justify-center flex-1 border"
            style={{
              borderRadius: wp('3.2%'), paddingVertical: hp('1.2%'), paddingHorizontal: wp('3.2%'),
              backgroundColor: item.isActive ? '#FEF2F2' : '#F0FDF4',
              borderColor: item.isActive ? '#FEE2E2' : '#DCFCE7'
            }}
          >
            <Ionicons
              name={item.isActive ? 'close-circle-outline' : 'checkmark-circle-outline'}
              size={wp('3.7%')}
              color={item.isActive ? '#EF4444' : '#10B981'}
            />
            <Text
              className="font-semibold"
              style={{
                fontSize: wp('3.2%'), marginLeft: wp('1%'),
                color: item.isActive ? '#DC2626' : '#16A34A'
              }}
            >
              {item.isActive ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleEdit(item)}
            className="bg-[#008E96] flex-row items-center justify-center flex-1"
            style={{ borderRadius: wp('3.2%'), paddingVertical: hp('1.2%'), paddingHorizontal: wp('3.2%') }}
          >
            <Ionicons name="create-outline" size={wp('3.7%')} color="white" />
            <Text className="text-white font-semibold" style={{ fontSize: wp('3.2%'), marginLeft: wp('1%') }}>Edit</Text>
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
            className="bg-white border border-[#008E96] flex-row items-center justify-center flex-1"
            style={{ borderRadius: wp('3.2%'), paddingVertical: hp('1.2%'), paddingHorizontal: wp('3.2%') }}
          >
            <Ionicons name="open-outline" size={wp('3.7%')} color="#008E96" />
            <Text className="text-[#008E96] font-semibold" style={{ fontSize: wp('3.2%'), marginLeft: wp('1%') }}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header Bar */}
      <LinearGradient colors={['#006B73', '#008E96']} className="shadow-md" style={{ paddingHorizontal: wp('4.3%'), paddingTop: hp('5%'), paddingBottom: hp('3%'), borderBottomLeftRadius: wp('8.5%'), borderBottomRightRadius: wp('8.5%') }}>
        <View className="flex-row justify-between items-center" style={{ marginBottom: hp('2%') }}>
          <View className="flex-row items-center" style={{ gap: wp('2.1%') }}>
            <TouchableOpacity
              onPress={() => {
                router.replace('/screens/Buy/Buy');
              }}
              style={{ marginRight: wp('1%') }}
            >
              <Ionicons name="arrow-back" size={wp('6.4%')} color="white" />
            </TouchableOpacity>
            <Text className="text-white font-bold" style={{ fontSize: wp('4.8%') }}>My Listings</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/screens/PostProperty/PropertyDetails')}
            className="bg-white/25 flex-row items-center rounded-full"
            style={{ paddingHorizontal: wp('3.2%'), paddingVertical: hp('0.7%'), gap: wp('1%') }}
          >
            <Ionicons name="add" size={wp('4.3%')} color="white" />
            <Text className="text-white font-semibold" style={{ fontSize: wp('3.2%') }}>Add New</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Filter Options */}
      <View className="bg-white border-b border-[#F2F4F7] flex-row justify-between items-center" style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('1.5%') }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: wp('2.1%') }}
          className="flex-1"
          style={{ marginRight: wp('4.3%') }}
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
          <TouchableOpacity onPress={clearFilters} style={{ paddingHorizontal: wp('2.1%'), paddingVertical: hp('0.5%') }}>
            <Text className="text-[#EF4444] font-bold uppercase tracking-wider" style={{ fontSize: wp('2.9%') }}>
              Reset
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Properties List */}
      <View style={{ flex: 1, paddingHorizontal: wp('4.3%'), marginTop: hp('2%') }}>
        {loading ? (
          <View className="flex-1 items-center justify-center" style={{ paddingVertical: hp('10%') }}>
            <ActivityIndicator size="large" color="#008E96" />
            <Text className="text-gray-500 font-medium" style={{ marginTop: hp('2%') }}>Loading your listings...</Text>
          </View>
        ) : filteredProperties.length > 0 ? (
          <FlatList
            data={filteredProperties}
            keyExtractor={item => item._id}
            renderItem={renderPropertyCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: hp('11.8%') }}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListHeaderComponent={() => (
              <Text className="text-gray-500 font-medium" style={{ fontSize: wp('3.2%'), marginBottom: hp('1.5%') }}>
                Showing {filteredProperties.length} out of {properties.length} properties
              </Text>
            )}
          />
        ) : (
          <View className="flex-1 items-center justify-center" style={{ paddingVertical: hp('10%'), paddingHorizontal: wp('8.5%') }}>
            <View className="rounded-full bg-[#E6F7F7] items-center justify-center" style={{ width: wp('17%'), height: wp('17%'), marginBottom: hp('2%') }}>
              <Ionicons name="home-outline" size={wp('8.5%')} color="#008E96" />
            </View>
            <Text style={{ color: '#101828', fontWeight: '700', textAlign: 'center', fontSize: wp('4.8%') }}>
              No Listings Found
            </Text>
            <Text className="text-gray-500 font-normal text-center" style={{ fontSize: wp('3.7%'), marginTop: hp('1%') }}>
              {properties.length > 0
                ? 'Try resetting or changing your search filters.'
                : "You haven't posted any property listings yet. Click below to post."}
            </Text>
            {properties.length === 0 && (
              <TouchableOpacity
                onPress={() => router.push('/screens/PostProperty/PropertyDetails')}
                className="bg-[#008E96] shadow-md"
                style={{ marginTop: hp('3%'), paddingHorizontal: wp('6.4%'), paddingVertical: hp('1.5%'), borderRadius: wp('3.2%') }}
              >
                <Text className="text-white font-semibold">Post Property for FREE</Text>
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
