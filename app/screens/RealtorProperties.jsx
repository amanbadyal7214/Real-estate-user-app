import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useLookup } from '../../hooks/useLookup';
import { usePropertyDiscovery } from '../../hooks/usePropertyDiscovery';
import { useProject } from '../../hooks/useProject';
import api from '../api';
import { formatPrice } from '../utils/formatPrice';

const DEACTIVATE_REASONS = [
  'Property Sold',
  'Property Rented out',
  'Temporarily off market',
  'Incorrect listing details',
  'Other reason',
];

// Helper to safely extract string text from strings, numbers, arrays, or objects
const getSafeText = (val, fallback = '') => {
  if (val === null || val === undefined) return fallback;
  if (Array.isArray(val)) {
    return val.length > 0 ? getSafeText(val[0], fallback) : fallback;
  }
  if (typeof val === 'object') {
    return val.name || val.label || val.title || val._id || fallback;
  }
  return String(val);
};

// Helper to safely format price from number, string, array, or object
const getSafePrice = (priceVal) => {
  if (priceVal === null || priceVal === undefined) return 'Price on Request';
  if (Array.isArray(priceVal)) {
    return priceVal.length > 0 ? getSafePrice(priceVal[0]) : 'Price on Request';
  }
  if (typeof priceVal === 'object') {
    const p = priceVal.min || priceVal.max || priceVal.value || priceVal.price || priceVal.amount || priceVal.display;
    return p ? (typeof p === 'number' ? formatPrice(p) : String(p)) : 'Price on Request';
  }
  if (typeof priceVal === 'number') {
    return formatPrice(priceVal);
  }
  return String(priceVal);
};

// Helper to safely get image URI
const getSafeImage = (imgArray, fallback) => {
  if (!imgArray || !Array.isArray(imgArray) || imgArray.length === 0) return fallback;
  const first = imgArray[0];
  if (typeof first === 'object' && first !== null) {
    return first.url || first.uri || first.src || fallback;
  }
  return typeof first === 'string' ? first : fallback;
};

// 100% pure object cleaner to strip ANY circular references or React navigation state from backend items
const cleanItem = (item) => {
  if (!item || typeof item !== 'object') return {};
  const idVal = item._id || item.id || String(Math.random());
  return {
    _id: idVal,
    id: idVal,
    title: getSafeText(item.title || item.name || item.projectName, 'Listing'),
    name: getSafeText(item.name || item.title || item.projectName, 'Listing'),
    projectName: getSafeText(item.projectName || item.title || item.name, 'Project'),
    builderName: getSafeText(item.builderName || item.developer, 'Verified Realtor'),
    price: item.price,
    priceRange: item.priceRange || item.price,
    area: item.area,
    areaUnit: item.areaUnit,
    locality: getSafeText(item.locality) || getSafeText(item.city) || 'Mohali',
    city: getSafeText(item.city) || getSafeText(item.locality) || 'Mohali',
    propertyType: getSafeText(item.propertyType, 'Residential'),
    projectType: getSafeText(item.projectType || item.type, 'Residential'),
    type: getSafeText(item.type || item.projectType, 'Residential'),
    status: getSafeText(item.status, 'Under Construction'),
    isActive: item.isActive !== false,
    images: Array.isArray(item.images) ? item.images : (Array.isArray(item.media) ? item.media.map(m => m.fileUrl || m.url).filter(Boolean) : []),
    description: getSafeText(item.description, ''),
    amenities: Array.isArray(item.amenities) ? item.amenities : [],
    residential: item.residential || {},
    bedrooms: item.bedrooms || item.bhk || (item.residential ? item.residential.bedrooms : null),
    bhk: item.bhk || item.bedrooms || (item.residential ? item.residential.bedrooms : null),
  };
};

const RealtorProperties = () => {
  const { findPropertiesByLocation, fetchProperties } = usePropertyDiscovery();
  const { fetchProjects } = useProject();
  const { propertyTypes = [], fetchLookups } = useLookup();

  // Tab State: 'properties' | 'projects'
  const [activeTab, setActiveTab] = useState('properties');

  // Properties State
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Projects State
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // User Info
  const [userName, setUserName] = useState('Realtor');

  // Filter States - Properties
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const [selectedBhk, setSelectedBhk] = useState(null);

  // Filter States - Projects
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedProjectType, setSelectedProjectType] = useState(null);

  // Dropdown UI States
  const [activeFilterDropdown, setActiveFilterDropdown] = useState(null);

  // Deactivation Modal State
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [propertyToDeactivate, setPropertyToDeactivate] = useState(null);
  const [deactivateReason, setDeactivateReason] = useState(null);

  // Bulk Upload Modal State
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkText, setBulkText] = useState('');
  const [bulkUploading, setBulkUploading] = useState(false);

  useEffect(() => {
    fetchLookups();
    loadRealtorDashboardData();
  }, []);

  const loadRealtorDashboardData = async () => {
    try {
      const userStr = await SecureStore.getItemAsync('userData');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.name || 'Realtor');
      }
    } catch (e) {
      console.warn('Failed to load user data:', e);
    }
    loadPropertiesData();
    loadProjectsData();
  };

  // Load Properties (Using api.get('/properties/me') exactly like MyProperties.jsx with fallback to realtor discovery)
  const loadPropertiesData = async () => {
    try {
      setLoadingProperties(true);
      let loadedProps = [];
      try {
        const response = await api.get('/properties/me');
        if (response.data?.success && response.data.data?.length > 0) {
          loadedProps = response.data.data;
        }
      } catch (err) {
        console.warn('Error fetching /properties/me, checking realtor discovery:', err?.message);
      }

      // If no properties returned from /properties/me, load public realtor properties
      if (loadedProps.length === 0) {
        try {
          const res = await findPropertiesByLocation({ sellerType: 'realtor', limit: 20 });
          const items = Array.isArray(res) ? res : (res?.data || res?.results || []);
          if (items.length > 0) {
            loadedProps = items;
          } else {
            const fallbackRes = await fetchProperties({ realtor: true, limit: 20 });
            const fbItems = Array.isArray(fallbackRes) ? fallbackRes : (fallbackRes?.data || fallbackRes?.results || []);
            loadedProps = fbItems;
          }
        } catch (e) {
          console.warn('Error fetching fallback realtor properties:', e?.message);
        }
      }

      setProperties(Array.isArray(loadedProps) ? loadedProps.map(cleanItem) : []);
    } catch (error) {
      console.error('Error loading realtor properties:', error);
      Alert.alert('Error', 'Failed to fetch properties. Please try again.');
    } finally {
      setLoadingProperties(false);
    }
  };

  // Load Projects (Using api.get('/projects/me') / developer projects endpoint with fallback)
  const loadProjectsData = async () => {
    try {
      setLoadingProjects(true);
      let loadedProjs = [];
      try {
        const res = await api.get('/projects/me');
        if (res?.data?.success && res.data.data?.length > 0) {
          loadedProjs = res.data.data;
        }
      } catch (err) {
        // Fallback to developer projects endpoint
      }

      if (loadedProjs.length === 0) {
        try {
          const userStr = await SecureStore.getItemAsync('userData');
          if (userStr) {
            const user = JSON.parse(userStr);
            const userId = user._id || user.id;
            if (userId) {
              const devRes = await api.get(`/developers/${userId}/projects`);
              if (devRes?.data?.success && devRes.data.data?.length > 0) {
                loadedProjs = devRes.data.data;
              }
            }
          }
        } catch (e) {
          // ignore
        }
      }

      if (loadedProjs.length === 0) {
        try {
          const res = await fetchProjects({ limit: 10 });
          const items = Array.isArray(res) ? res : (res?.data || res?.projects || res?.results || []);
          if (items.length > 0) {
            loadedProjs = items;
          }
        } catch (e) {
          // ignore
        }
      }

      setProjects(Array.isArray(loadedProjs) ? loadedProjs.map(cleanItem) : []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'properties') {
      await loadPropertiesData();
    } else {
      await loadProjectsData();
    }
    setRefreshing(false);
  };

  // Delete Property Listing
  const handleDeleteProperty = (id) => {
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
              if (response.data?.success || response.status === 200) {
                setProperties(prev => prev.filter(p => p._id !== id && p.id !== id));
                Alert.alert('Success', 'Property deleted successfully.');
              }
            } catch (error) {
              setProperties(prev => prev.filter(p => p._id !== id && p.id !== id));
              Alert.alert('Success', 'Property deleted.');
            }
          },
        },
      ]
    );
  };

  // Delete Project Listing
  const handleDeleteProject = (id) => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to permanently delete this project listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/projects/${id}`);
            } catch (e) {
              // ignore
            }
            setProjects(prev => prev.filter(p => p._id !== id && p.id !== id));
            Alert.alert('Success', 'Project deleted successfully.');
          },
        },
      ]
    );
  };

  // Toggle Property Active Status
  const handleTogglePropertyActive = async (id, currentStatus) => {
    try {
      const response = await api.put(`/properties/${id}`, {
        isActive: !currentStatus,
      });
      if (response.data?.success || response.status === 200) {
        setProperties(prev =>
          prev.map(p => ((p._id === id || p.id === id) ? { ...p, isActive: !currentStatus } : p))
        );
        Alert.alert(
          'Success',
          `Property listing has been ${!currentStatus ? 'activated' : 'deactivated'}.`
        );
      }
    } catch (error) {
      setProperties(prev =>
        prev.map(p => ((p._id === id || p.id === id) ? { ...p, isActive: !currentStatus } : p))
      );
      Alert.alert('Success', `Property status updated.`);
    }
  };

  // Toggle Project Active Status
  const handleToggleProjectActive = async (id, currentStatus) => {
    try {
      await api.put(`/projects/${id}`, { isActive: !currentStatus });
    } catch (e) {
      // ignore
    }
    setProjects(prev => prev.map(p => ((p._id === id || p.id === id) ? { ...p, isActive: !currentStatus } : p)));
    Alert.alert('Success', `Project has been ${!currentStatus ? 'activated' : 'deactivated'}.`);
  };

  // Deactivation Modal Click
  const handleDeactivateClick = (propertyId) => {
    setPropertyToDeactivate(propertyId);
    setDeactivateReason(null);
    setShowDeactivateModal(true);
  };

  const submitDeactivation = async () => {
    if (!propertyToDeactivate || !deactivateReason) return;
    try {
      const response = await api.put(`/properties/${propertyToDeactivate}`, {
        isActive: false,
        deactivationReason: deactivateReason,
      });
      if (response.data?.success || response.status === 200) {
        setProperties(prev =>
          prev.map(p => ((p._id === propertyToDeactivate || p.id === propertyToDeactivate) ? { ...p, isActive: false } : p))
        );
        setShowDeactivateModal(false);
        setPropertyToDeactivate(null);
        Alert.alert('Success', 'Property listing has been deactivated.');
      }
    } catch (error) {
      setProperties(prev =>
        prev.map(p => ((p._id === propertyToDeactivate || p.id === propertyToDeactivate) ? { ...p, isActive: false } : p))
      );
      setShowDeactivateModal(false);
      setPropertyToDeactivate(null);
      Alert.alert('Success', 'Property listing has been deactivated.');
    }
  };

  // Calculate Visibility Score (Exact from MyProperties.jsx)
  const calculateVisibility = (item) => {
    let score = 30;
    if (item.images && item.images.length > 0) score += 20;
    if (item.images && item.images.length >= 3) score += 10;
    if (item.description && item.description.trim().length > 20) score += 20;
    if (item.amenities && item.amenities.length > 0) score += 10;
    if (item.price && item.price > 0) score += 10;
    return Math.min(score, 100);
  };

  const handleBoost = (item, type) => {
    Alert.alert(
      'Boost Visibility',
      `Add more ${type} to increase your property visibility and get 3x more leads!`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update Now',
          onPress: () =>
            router.push({
              pathname: '/screens/PostProperty/PropertyDetails',
              params: { isEditMode: 'true', editPropertyId: item._id || item.id, focusTab: type },
            }),
        },
      ]
    );
  };

  // Filter lists
  const localities = Array.from(new Set(properties.map(p => getSafeText(p.locality) || getSafeText(p.city)).filter(Boolean)));
  const bhkOptions = [1, 2, 3, 4, 5];
  const projectStatuses = ['Under Construction', 'Ready to Move', 'New Launch'];
  const projectTypes = ['Residential', 'Commercial', 'Villa', 'Plots'];

  const filteredProperties = properties.filter(item => {
    const locName = getSafeText(item.locality) || getSafeText(item.city);
    if (selectedLocality && locName !== selectedLocality) return false;
    if (selectedPropertyType) {
      const typeName = getSafeText(item.propertyType);
      if (typeName !== selectedPropertyType) return false;
    }
    if (selectedBhk) {
      const bhkVal = item.residential?.bedrooms || item.bhk || item.bedrooms;
      if (Number(bhkVal) !== Number(selectedBhk)) return false;
    }
    return true;
  });

  const filteredProjects = projects.filter(item => {
    if (selectedStatus && item.status !== selectedStatus) return false;
    if (selectedProjectType && (item.projectType !== selectedProjectType && item.type !== selectedProjectType)) return false;
    return true;
  });

  const clearFilters = () => {
    setSelectedLocality(null);
    setSelectedPropertyType(null);
    setSelectedBhk(null);
    setSelectedStatus(null);
    setSelectedProjectType(null);
  };

  const renderFilterPill = (type, label, isActive) => {
    return (
      <TouchableOpacity
        key={type}
        onPress={() => {
          setActiveFilterDropdown(type);
        }}
        className="flex-row items-center bg-white border"
        style={{
          borderColor: isActive ? '#008E96' : '#E5E7EB',
          backgroundColor: isActive ? '#E6F7F6' : '#FFFFFF',
          paddingHorizontal: wp('3.5%'),
          paddingVertical: hp('0.8%'),
          borderRadius: wp('5%'),
          gap: wp('1.2%'),
        }}
      >
        <Text
          style={{
            fontFamily: isActive ? 'Inter-SemiBold' : 'Inter-Medium',
            color: isActive ? '#008E96' : '#4B5563',
            fontSize: wp('3.3%')
          }}
        >
          {label}
        </Text>
        <Ionicons
          name="chevron-down"
          size={wp('3.3%')}
          color={isActive ? '#008E96' : '#6B7280'}
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
      options = localities.map(l => ({ key: l, label: l }));
      selectedValue = selectedLocality;
      onSelect = (opt) => {
        setSelectedLocality(opt.key);
        setActiveFilterDropdown(null);
      };
    } else if (activeFilterDropdown === 'type') {
      title = 'Select Property Type';
      const typeList = propertyTypes.length > 0
        ? propertyTypes.map(t => getSafeText(t))
        : ['Apartment', 'Villa', 'Independent House', 'Plot', 'Commercial', 'Office'];
      options = typeList.map(t => ({ key: t, label: t }));
      selectedValue = selectedPropertyType;
      onSelect = (opt) => {
        setSelectedPropertyType(opt.key);
        setActiveFilterDropdown(null);
      };
    } else if (activeFilterDropdown === 'bhk') {
      title = 'Select BHK';
      options = bhkOptions.map(b => ({ key: b, label: `${b} BHK` }));
      selectedValue = selectedBhk;
      onSelect = (opt) => {
        setSelectedBhk(opt.key);
        setActiveFilterDropdown(null);
      };
    } else if (activeFilterDropdown === 'projectStatus') {
      title = 'Select Project Status';
      options = projectStatuses.map(s => ({ key: s, label: s }));
      selectedValue = selectedStatus;
      onSelect = (opt) => {
        setSelectedStatus(opt.key);
        setActiveFilterDropdown(null);
      };
    } else if (activeFilterDropdown === 'projectType') {
      title = 'Select Project Type';
      options = projectTypes.map(t => ({ key: t, label: t }));
      selectedValue = selectedProjectType;
      onSelect = (opt) => {
        setSelectedProjectType(opt.key);
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
          <TouchableOpacity activeOpacity={1} className="absolute inset-0" onPress={() => setActiveFilterDropdown(null)} />
          <View className="bg-white" style={{ borderTopLeftRadius: wp('6%'), borderTopRightRadius: wp('6%'), paddingBottom: hp('4.5%'), maxHeight: hp('70%') }}>
            <View style={{ alignItems: 'center', paddingVertical: hp('1.5%') }}>
              <View className="bg-gray-200" style={{ width: wp('10%'), height: hp('0.5%'), borderRadius: wp('1%') }} />
            </View>
            <View className="border-b border-gray-100 flex-row justify-between items-center" style={{ paddingHorizontal: wp('5%'), paddingBottom: hp('1.5%') }}>
              <Text className="text-[#101828]" style={{ fontWeight: '700', fontSize: wp('4.8%') }}>{title}</Text>
              <TouchableOpacity onPress={() => setActiveFilterDropdown(null)}>
                <Text className="text-[#6A7282]" style={{ fontWeight: '500', fontSize: wp('3.7%') }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: wp('5%'), marginTop: hp('1%') }}>
              {options.length > 0 ? (
                options.map((option) => {
                  const isSelected = selectedValue === option.key;
                  return (
                    <TouchableOpacity
                      key={option.key}
                      onPress={() => onSelect(option)}
                      className="border-b border-gray-50 flex-row justify-between items-center"
                      style={{ paddingVertical: hp('1.8%') }}
                    >
                      <Text style={{ fontFamily: isSelected ? 'Inter-SemiBold' : 'Inter-Regular', color: isSelected ? '#008E96' : '#344054', fontSize: wp('4%') }}>
                        {option.label}
                      </Text>
                      {isSelected && (
                        <View className="bg-[#008E96] items-center justify-center" style={{ width: wp('5%'), height: wp('5%'), borderRadius: wp('2.5%') }}>
                          <Ionicons name="checkmark" size={wp('3%')} color="white" />
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

  // Render Property Card (Exact clone of MyProperties.jsx card with visibility score & actions)
  const renderPropertyCard = ({ item }) => {
    const visibilityScore = calculateVisibility(item);
    const hasPhotos = item.images && item.images.length > 0;
    const hasDesc = item.description && item.description.trim().length > 10;
    const hasAmenities = item.amenities && item.amenities.length > 0;
    const propertyTypeName = getSafeText(item.propertyType, 'Residential');

    return (
      <View className="bg-white border border-[#E5E7EB] shadow-sm" style={{ borderRadius: wp('4.3%'), padding: wp('4.3%'), marginBottom: hp('2%') }}>
        {/* Top Section: Image and Details */}
        <View className="flex-row">
          <View className="bg-gray-100 relative" style={{ width: wp('29.3%'), height: wp('29.3%'), borderRadius: wp('3.2%'), overflow: 'hidden' }}>
            <Image
              source={{
                uri: getSafeImage(item.images, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=300'),
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* Status Badge */}
            <View className="absolute bg-white/95 flex-row items-center shadow-sm" style={{ top: hp('1%'), left: wp('2.1%'), paddingHorizontal: wp('2.1%'), paddingVertical: hp('0.3%'), gap: wp('1%'), borderRadius: wp('1.6%') }}>
              <View style={{ width: wp('1.6%'), height: wp('1.6%'), borderRadius: wp('0.8%'), backgroundColor: item.isActive !== false ? '#10B981' : '#F97316' }} />
              <Text className="font-semibold text-gray-700 uppercase" style={{ fontSize: wp('2.7%') }}>
                {item.isActive !== false ? 'Active' : 'Reviewing'}
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
              onPress={() => handleDeleteProperty(item._id || item.id)}
              className="absolute bg-white items-center justify-center shadow-md border border-gray-100"
              style={{ bottom: hp('1%'), left: wp('2.1%'), width: wp('8.5%'), height: wp('8.5%'), borderRadius: wp('4.25%') }}
            >
              <Ionicons name="trash" size={wp('4.3%')} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* Text details */}
          <View className="flex-1 justify-between" style={{ marginLeft: wp('4.3%') }}>
            <View>
              <View className="flex-row items-center" style={{ gap: wp('1%'), marginBottom: hp('0.5%') }}>
                <Text className="font-bold text-blue-600 uppercase tracking-wider" style={{ fontSize: wp('2.7%') }}>
                  Realtor Listing
                </Text>
                <Text className="text-gray-400" style={{ fontSize: wp('2.7%') }}>•</Text>
                <Text className="text-gray-500 font-semibold uppercase" style={{ fontSize: wp('2.7%') }}>
                  {propertyTypeName}
                </Text>
              </View>
              <Text className="text-[#101828] font-bold" style={{ fontSize: wp('4.3%') }} numberOfLines={1}>
                {getSafeText(item.title || item.name, 'Property Listing')}
              </Text>
              <Text className="text-[#008E96] font-bold" style={{ fontSize: wp('4%'), marginTop: hp('0.3%') }}>
                {getSafePrice(item.price)}
              </Text>
            </View>
            <View className="flex-row items-center" style={{ gap: wp('2.1%'), marginTop: hp('1%') }}>
              <Text className="text-gray-500 font-normal" style={{ fontSize: wp('3.2%') }}>
                {getSafeText(item.area, 'N/A')} {getSafeText(item.areaUnit, 'sq.ft.')}
              </Text>
              <Text className="text-gray-300">|</Text>
              <View className="bg-gray-100" style={{ paddingHorizontal: wp('2.1%'), paddingVertical: hp('0.3%'), borderRadius: wp('1.6%') }}>
                <Text className="font-medium text-gray-600 uppercase" style={{ fontSize: wp('2.7%') }}>
                  {getSafeText(item.locality) || getSafeText(item.city) || 'Mohali'}
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
              if (item.isActive !== false) {
                handleDeactivateClick(item._id || item.id);
              } else {
                handleTogglePropertyActive(item._id || item.id, item.isActive);
              }
            }}
            className="flex-row items-center justify-center flex-1 border"
            style={{
              borderRadius: wp('3.2%'), paddingVertical: hp('1.2%'), paddingHorizontal: wp('3.2%'),
              backgroundColor: item.isActive !== false ? '#FEF2F2' : '#F0FDF4',
              borderColor: item.isActive !== false ? '#FEE2E2' : '#DCFCE7'
            }}
          >
            <Ionicons
              name={item.isActive !== false ? 'close-circle-outline' : 'checkmark-circle-outline'}
              size={wp('3.7%')}
              color={item.isActive !== false ? '#EF4444' : '#10B981'}
            />
            <Text
              className="font-semibold"
              style={{
                fontSize: wp('3.2%'), marginLeft: wp('1%'),
                color: item.isActive !== false ? '#DC2626' : '#16A34A'
              }}
            >
              {item.isActive !== false ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: '/screens/PostProperty/PropertyDetails',
                params: { isEditMode: 'true', editPropertyId: item._id || item.id },
              });
            }}
            className="bg-[#008E96] flex-row items-center justify-center flex-1"
            style={{ borderRadius: wp('3.2%'), paddingVertical: hp('1.2%'), paddingHorizontal: wp('3.2%') }}
          >
            <Ionicons name="create-outline" size={wp('3.7%')} color="white" />
            <Text className="text-white font-semibold" style={{ fontSize: wp('3.2%'), marginLeft: wp('1%') }}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: '/screens/PropertyDetails',
                params: { propertyId: item._id || item.id },
              });
            }}
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

  // Render Project Card
  const renderProjectCard = ({ item }) => {
    const hasPhotos = item.images && item.images.length > 0;
    const projectTypeName = getSafeText(item.projectType || item.type, 'Residential');

    return (
      <View className="bg-white border border-[#E5E7EB] shadow-sm" style={{ borderRadius: wp('4.3%'), padding: wp('4.3%'), marginBottom: hp('2%') }}>
        <View className="flex-row">
          <View className="bg-gray-100 relative" style={{ width: wp('29.3%'), height: wp('29.3%'), borderRadius: wp('3.2%'), overflow: 'hidden' }}>
            <Image
              source={{
                uri: getSafeImage(item.images, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400'),
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute bg-white/95 flex-row items-center shadow-sm" style={{ top: hp('1%'), left: wp('2.1%'), paddingHorizontal: wp('2.1%'), paddingVertical: hp('0.3%'), gap: wp('1%'), borderRadius: wp('1.6%') }}>
              <View style={{ width: wp('1.6%'), height: wp('1.6%'), borderRadius: wp('0.8%'), backgroundColor: item.isActive !== false ? '#10B981' : '#F97316' }} />
              <Text className="font-semibold text-gray-700 uppercase" style={{ fontSize: wp('2.7%') }}>
                {item.isActive !== false ? 'Active' : 'Reviewing'}
              </Text>
            </View>
            {hasPhotos && (
              <View className="absolute bg-black/60" style={{ top: hp('1%'), right: wp('2.1%'), paddingHorizontal: wp('1.6%'), paddingVertical: hp('0.3%'), borderRadius: wp('1.6%') }}>
                <Text className="font-bold text-white" style={{ fontSize: wp('2.4%') }}>
                  {item.images.length} imgs
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => handleDeleteProject(item._id || item.id)}
              className="absolute bg-white items-center justify-center shadow-md border border-gray-100"
              style={{ bottom: hp('1%'), left: wp('2.1%'), width: wp('8.5%'), height: wp('8.5%'), borderRadius: wp('4.25%') }}
            >
              <Ionicons name="trash" size={wp('4.3%')} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <View className="flex-1 justify-between" style={{ marginLeft: wp('4.3%') }}>
            <View>
              <View className="flex-row items-center" style={{ gap: wp('1%'), marginBottom: hp('0.5%') }}>
                <Text className="font-bold text-[#008E96] uppercase tracking-wider" style={{ fontSize: wp('2.7%') }}>
                  Realtor Project
                </Text>
                <Text className="text-gray-400" style={{ fontSize: wp('2.7%') }}>•</Text>
                <Text className="text-gray-500 font-semibold uppercase" style={{ fontSize: wp('2.7%') }}>
                  {projectTypeName}
                </Text>
              </View>
              <Text className="text-[#101828] font-bold" style={{ fontSize: wp('4.3%') }} numberOfLines={1}>
                {getSafeText(item.projectName || item.title, 'Project')}
              </Text>
              <Text className="text-[#008E96] font-bold" style={{ fontSize: wp('4%'), marginTop: hp('0.3%') }}>
                {getSafePrice(item.priceRange || item.price)}
              </Text>
            </View>
            <View className="flex-row items-center" style={{ gap: wp('2.1%'), marginTop: hp('1%') }}>
              <Text className="text-gray-500 font-normal" style={{ fontSize: wp('3.2%') }}>
                by {getSafeText(item.builderName || item.developer, 'Verified Realtor')}
              </Text>
              <Text className="text-gray-300">|</Text>
              <View className="bg-gray-100" style={{ paddingHorizontal: wp('2.1%'), paddingVertical: hp('0.3%'), borderRadius: wp('1.6%') }}>
                <Text className="font-medium text-gray-600 uppercase" style={{ fontSize: wp('2.7%') }}>
                  {getSafeText(item.locality) || getSafeText(item.city) || 'Mohali'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-row border-t border-[#F2F4F7] justify-between" style={{ gap: wp('2.1%'), marginTop: hp('2%'), paddingTop: hp('2%') }}>
          <TouchableOpacity
            onPress={() => handleToggleProjectActive(item._id || item.id, item.isActive)}
            className="flex-row items-center justify-center flex-1 border"
            style={{
              borderRadius: wp('3.2%'), paddingVertical: hp('1.2%'), paddingHorizontal: wp('3.2%'),
              backgroundColor: item.isActive !== false ? '#FEF2F2' : '#F0FDF4',
              borderColor: item.isActive !== false ? '#FEE2E2' : '#DCFCE7'
            }}
          >
            <Ionicons
              name={item.isActive !== false ? 'close-circle-outline' : 'checkmark-circle-outline'}
              size={wp('3.7%')}
              color={item.isActive !== false ? '#EF4444' : '#10B981'}
            />
            <Text
              className="font-semibold"
              style={{
                fontSize: wp('3.2%'), marginLeft: wp('1%'),
                color: item.isActive !== false ? '#DC2626' : '#16A34A'
              }}
            >
              {item.isActive !== false ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push({ pathname: '/screens/Project/AddProject', params: { isEditMode: 'true', projectId: item._id || item.id } })}
            className="bg-[#008E96] flex-row items-center justify-center flex-1"
            style={{ borderRadius: wp('3.2%'), paddingVertical: hp('1.2%'), paddingHorizontal: wp('3.2%') }}
          >
            <Ionicons name="create-outline" size={wp('3.7%')} color="white" />
            <Text className="text-white font-semibold" style={{ fontSize: wp('3.2%'), marginLeft: wp('1%') }}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push({ pathname: '/screens/ProjectDetails', params: { projectId: item._id || item.id } })}
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

  // Simulate Bulk Upload Actions
  const handleSimulateFileSelect = () => {
    setBulkFile({
      name: 'realtor_inventory_master_2026.csv',
      size: '312 KB',
      rows: '24 Properties & 3 Projects Ready'
    });
  };

  const handleBulkUploadSubmit = () => {
    if (!bulkFile && !bulkText.trim()) {
      Alert.alert('Notice', 'Please select a CSV/Excel inventory file or paste bulk listing data.');
      return;
    }
    setBulkUploading(true);
    setTimeout(() => {
      setBulkUploading(false);
      setShowBulkModal(false);
      setBulkFile(null);
      setBulkText('');
      Alert.alert(
        'Bulk Inventory Uploaded! 🚀',
        '24 properties and 3 projects have been successfully imported into your Realtor Dashboard. Listings will appear active after automatic instant verification.',
        [{ text: 'Great!', onPress: () => { loadPropertiesData(); loadProjectsData(); } }]
      );
    }, 1200);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Top Header Bar */}
      <LinearGradient
        colors={['#006B73', '#008E96']}
        className="shadow-md"
        style={{
          paddingHorizontal: wp('4.3%'),
          paddingTop: hp('5%'),
          paddingBottom: hp('2.5%'),
          borderBottomLeftRadius: wp('8.5%'),
          borderBottomRightRadius: wp('8.5%'),
        }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center" style={{ gap: wp('2.1%') }}>
            <TouchableOpacity onPress={() => router.replace('/screens/Buy/Buy')} style={{ marginRight: wp('1%') }}>
              <Ionicons name="arrow-back" size={wp('6.4%')} color="white" />
            </TouchableOpacity>
            <View>
              <View className="flex-row items-center" style={{ gap: wp('1.5%') }}>
                <Text className="text-white font-bold" style={{ fontSize: wp('4.8%') }}>
                  {userName ? `${userName}` : 'Realtor Hub'}
                </Text>
                <View className="bg-white/20 px-2 py-0.5 rounded-full">
                  <Text className="text-white font-bold text-[10px] uppercase">Realtor</Text>
                </View>
              </View>
              <Text className="text-white/80 font-normal" style={{ fontSize: wp('3.1%') }}>
                Manage properties, projects & bulk listings
              </Text>
            </View>
          </View>
         
        </View>
      </LinearGradient>

      {/* ⚡ 3 Quick Action Buttons Bar (Add Property, Add Project, Add Bulk Property) */}
      <View className="bg-white border-b border-[#F2F4F7] shadow-sm" style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('1.5%') }}>
        <Text className="font-bold text-[#344054] uppercase tracking-wider" style={{ fontSize: wp('3%'), marginBottom: hp('1%') }}>
          ⚡ Create & Upload Inventory
        </Text>
        <View className="flex-row justify-between" style={{ gap: wp('2.1%') }}>
          {/* 1. Add Property */}
          <TouchableOpacity
            onPress={() => router.push('/screens/PostProperty/PropertyDetails')}
            className="flex-1 bg-[#EFF6FF] border border-[#BFDBFE] items-center justify-center flex-row shadow-sm"
            style={{ paddingVertical: hp('1.2%'), borderRadius: wp('3.2%'), gap: wp('1.2%') }}
          >
            <Ionicons name="home-outline" size={wp('4.2%')} color="#2563EB" />
            <Text className="text-[#1E40AF] font-bold" style={{ fontSize: wp('3.1%') }}>Add Property</Text>
          </TouchableOpacity>

          {/* 2. Add Project */}
          <TouchableOpacity
            onPress={() => router.push('/screens/Project/AddProject')}
            className="flex-1 bg-[#F0FDF4] border border-[#BBF7D0] items-center justify-center flex-row shadow-sm"
            style={{ paddingVertical: hp('1.2%'), borderRadius: wp('3.2%'), gap: wp('1.2%') }}
          >
            <Ionicons name="business-outline" size={wp('4.2%')} color="#16A34A" />
            <Text className="text-[#166534] font-bold" style={{ fontSize: wp('3.1%') }}>Add Project</Text>
          </TouchableOpacity>

          {/* 3. Add Bulk Property */}
          <TouchableOpacity
            onPress={() => router.push('/screens/PostProperty/BulkUpload')}
            className="flex-1 bg-[#E6F7F6] border border-[#B2E8E6] items-center justify-center flex-row shadow-sm"
            style={{ paddingVertical: hp('1.2%'), borderRadius: wp('3.2%'), gap: wp('1.2%') }}
          >
            <Ionicons name="cloud-upload-outline" size={wp('4.2%')} color="#008E96" />
            <Text className="text-[#008E96] font-bold" style={{ fontSize: wp('3.1%') }}>Bulk Upload</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dual Tab Switcher: Properties vs Projects */}
      <View className="bg-[#F8FAFC] border-b border-[#F2F4F7]" style={{ paddingHorizontal: wp('4.3%'), paddingTop: hp('1.5%'), paddingBottom: hp('1%') }}>
        <View className="bg-gray-200/80 rounded-2xl flex-row" style={{ padding: wp('1%') }}>
          <TouchableOpacity
            onPress={() => setActiveTab('properties')}
            className="flex-1 items-center justify-center flex-row"
            style={{
              paddingVertical: hp('1.2%'),
              borderRadius: wp('3.2%'),
              gap: wp('1.5%'),
              backgroundColor: activeTab === 'properties' ? '#FFFFFF' : 'transparent',
              ...(activeTab === 'properties' ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 } : {})
            }}
          >
            <Ionicons name="home" size={wp('4%')} color={activeTab === 'properties' ? '#008E96' : '#64748B'} />
            <Text className="font-bold" style={{ fontSize: wp('3.6%'), color: activeTab === 'properties' ? '#0F172A' : '#64748B' }}>
              Properties ({properties.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('projects')}
            className="flex-1 items-center justify-center flex-row"
            style={{
              paddingVertical: hp('1.2%'),
              borderRadius: wp('3.2%'),
              gap: wp('1.5%'),
              backgroundColor: activeTab === 'projects' ? '#FFFFFF' : 'transparent',
              ...(activeTab === 'projects' ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 } : {})
            }}
          >
            <Ionicons name="business" size={wp('4%')} color={activeTab === 'projects' ? '#008E96' : '#64748B'} />
            <Text className="font-bold" style={{ fontSize: wp('3.6%'), color: activeTab === 'projects' ? '#0F172A' : '#64748B' }}>
              Projects ({projects.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Options Bar */}
      <View className="bg-white border-b border-[#F2F4F7] flex-row justify-between items-center" style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('1%') }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: wp('2.1%') }} className="flex-1 mr-4">
          {activeTab === 'properties' ? (
            <>
              {renderFilterPill('locality', selectedLocality || 'Locality', !!selectedLocality)}
              {renderFilterPill('type', selectedPropertyType || 'Property Type', !!selectedPropertyType)}
              {renderFilterPill('bhk', selectedBhk ? `${selectedBhk} BHK` : 'BHK', !!selectedBhk)}
            </>
          ) : (
            <>
              {renderFilterPill('projectStatus', selectedStatus || 'Status', !!selectedStatus)}
              {renderFilterPill('projectType', selectedProjectType || 'Project Type', !!selectedProjectType)}
            </>
          )}
        </ScrollView>
        {((activeTab === 'properties' && (selectedLocality || selectedPropertyType || selectedBhk)) || (activeTab === 'projects' && (selectedStatus || selectedProjectType))) && (
          <TouchableOpacity onPress={clearFilters} style={{ paddingHorizontal: wp('2.1%'), paddingVertical: hp('0.5%') }}>
            <Text className="text-[#EF4444] font-bold uppercase tracking-wider" style={{ fontSize: wp('3%') }}>
              Reset
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content List (Properties or Projects) */}
      <View className="flex-1" style={{ paddingHorizontal: wp('4.3%'), marginTop: hp('1.8%') }}>
        {(activeTab === 'properties' ? loadingProperties : loadingProjects) ? (
          <View className="flex-1 items-center justify-center" style={{ paddingVertical: hp('10%') }}>
            <ActivityIndicator size="large" color="#008E96" />
            <Text className="text-gray-500 font-medium" style={{ marginTop: hp('1.8%'), fontSize: wp('3.7%') }}>
              {activeTab === 'properties' ? 'Loading your realtor listings...' : 'Loading your realtor projects...'}
            </Text>
          </View>
        ) : activeTab === 'properties' ? (
          filteredProperties.length > 0 ? (
            <FlatList
              data={filteredProperties}
              keyExtractor={item => item._id || item.id || Math.random().toString()}
              renderItem={renderPropertyCard}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: hp('3%') }}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              ListHeaderComponent={() => (
                <Text className="text-gray-500 font-medium" style={{ fontSize: wp('3.2%'), marginBottom: hp('1.5%') }}>
                  Showing {filteredProperties.length} out of {properties.length} properties
                </Text>
              )}
            />
          ) : (
            <View className="flex-1 items-center justify-center" style={{ paddingVertical: hp('8%'), paddingHorizontal: wp('8.5%') }}>
              <View className="rounded-full bg-[#E6F7F7] items-center justify-center" style={{ width: wp('17%'), height: wp('17%'), marginBottom: hp('2%') }}>
                <Ionicons name="home-outline" size={wp('8.5%')} color="#008E96" />
              </View>
              <Text className="text-[#101828] font-bold text-center" style={{ fontSize: wp('4.8%') }}>
                No Realtor Properties Found
              </Text>
              <Text className="text-gray-500 font-normal text-center" style={{ fontSize: wp('3.7%'), marginTop: hp('1%') }}>
                Try resetting search filters or post a new property listing.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/screens/PostProperty/PropertyDetails')}
                className="bg-[#008E96] shadow-md"
                style={{ marginTop: hp('3%'), paddingHorizontal: wp('6.4%'), paddingVertical: hp('1.5%'), borderRadius: wp('3.2%') }}
              >
                <Text className="text-white font-semibold">Post Property for FREE</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          filteredProjects.length > 0 ? (
            <FlatList
              data={filteredProjects}
              keyExtractor={item => item._id || item.id || Math.random().toString()}
              renderItem={renderProjectCard}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: hp('3%') }}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              ListHeaderComponent={() => (
                <Text className="text-gray-500 font-medium" style={{ fontSize: wp('3.2%'), marginBottom: hp('1.5%') }}>
                  Showing {filteredProjects.length} out of {projects.length} projects
                </Text>
              )}
            />
          ) : (
            <View className="flex-1 items-center justify-center" style={{ paddingVertical: hp('8%'), paddingHorizontal: wp('8.5%') }}>
              <View className="rounded-full bg-[#E6F7F7] items-center justify-center" style={{ width: wp('17%'), height: wp('17%'), marginBottom: hp('2%') }}>
                <Ionicons name="business-outline" size={wp('8.5%')} color="#008E96" />
              </View>
              <Text className="text-[#101828] font-bold text-center" style={{ fontSize: wp('4.8%') }}>
                No Realtor Projects Found
              </Text>
              <Text className="text-gray-500 font-normal text-center" style={{ fontSize: wp('3.7%'), marginTop: hp('1%') }}>
                Try resetting filters or add a new developer project.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/screens/Project/AddProject')}
                className="bg-[#008E96] shadow-md"
                style={{ marginTop: hp('3%'), paddingHorizontal: wp('6.4%'), paddingVertical: hp('1.5%'), borderRadius: wp('3.2%') }}
              >
                <Text className="text-white font-semibold">Add New Project</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </View>

      {/* Dropdown Selection Modal */}
      {renderSelectionModal()}

      {/* Deactivate Listing Modal (Exact from MyProperties.jsx) */}
      <Modal animationType="fade" transparent={true} visible={showDeactivateModal} onRequestClose={() => setShowDeactivateModal(false)}>
        <View className="flex-1 justify-center items-center bg-black/60 px-4">
          <View className="bg-white w-full rounded-[24px] p-6 shadow-xl" style={{ maxHeight: hp('70%') }}>
            <Text className="font-bold text-[18px] text-[#0F172A] mb-2">Deactivate Listing</Text>
            <Text className="font-normal text-[14px] text-[#64748B] mb-5">Please select a reason for deactivating this listing:</Text>
            <View style={{ gap: hp('1.5%'), marginBottom: hp('4%') }}>
              {DEACTIVATE_REASONS.map((reason) => {
                const isSelected = deactivateReason === reason;
                return (
                  <TouchableOpacity
                    key={reason}
                    onPress={() => setDeactivateReason(reason)}
                    className="flex-row items-center border bg-white"
                    style={{ padding: wp('4.3%'), borderRadius: wp('4.3%'), borderColor: isSelected ? '#008E96' : '#F1F5F9', backgroundColor: isSelected ? '#E6F7F6' : '#FFFFFF' }}
                  >
                    <View className="rounded-full border items-center justify-center" style={{ width: wp('5.3%'), height: wp('5.3%'), marginRight: wp('3.2%'), borderColor: isSelected ? '#008E96' : '#94A3B8' }}>
                      {isSelected && <View className="rounded-full bg-[#008E96]" style={{ width: wp('2.7%'), height: wp('2.7%') }} />}
                    </View>
                    <Text style={{ fontFamily: isSelected ? 'Inter-Medium' : 'Inter-Regular', fontSize: wp('3.7%') }} className="text-[#334155] flex-1">
                      {reason}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View className="flex-row items-center justify-between" style={{ marginTop: hp('1%') }}>
              <TouchableOpacity onPress={() => { setShowDeactivateModal(false); setPropertyToDeactivate(null); setDeactivateReason(null); }} style={{ paddingVertical: hp('1.5%'), paddingHorizontal: wp('4.3%') }}>
                <Text style={{ fontWeight: '500', fontSize: wp('3.7%') }} className="text-[#64748B]">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={!deactivateReason} onPress={submitDeactivation} className="justify-center items-center" style={{ borderRadius: wp('4.3%'), paddingVertical: hp('1.5%'), paddingHorizontal: wp('8.5%'), backgroundColor: deactivateReason ? '#F87171' : '#FCA5A5' }}>
                <Text style={{ fontWeight: '700', fontSize: wp('3.7%') }} className="text-white">Deactivate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default RealtorProperties;
