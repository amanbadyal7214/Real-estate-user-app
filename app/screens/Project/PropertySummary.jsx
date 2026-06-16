import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import api from '../../api';

// Custom Label Component
const SectionLabel = ({ children, required }) => (
  <Text style={{ fontFamily: 'Inter-SemiBold', color: '#374151', fontSize: 13, marginBottom: 6 }}>
    {children}
    {required ? <Text style={{ color: '#EF4444' }}> *</Text> : null}
  </Text>
);

// Custom Searchable Picker Component
const CustomPicker = ({ label, placeholder, value, options, onSelect, disabled }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOption = options.find(opt => opt.value === value);
  const filteredOptions = options.filter(opt =>
    (opt.label || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="mb-4">
      {label && <SectionLabel>{label}</SectionLabel>}
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          setSearchQuery('');
          setModalVisible(true);
        }}
        className={`flex-row justify-between items-center h-12 rounded-xl border border-gray-200 px-3 bg-white ${
          disabled ? 'opacity-50 bg-gray-50' : ''
        }`}
      >
        <Text
          style={{ fontFamily: 'Inter-Regular' }}
          className={`text-sm ${selectedOption ? 'text-[#101828]' : 'text-gray-400'}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
            className="absolute inset-0"
          />
          <View className="bg-white rounded-t-3xl h-[60%] p-5 pb-8 shadow-2xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text style={{ fontFamily: 'Inter-Bold' }} className="text-base text-[#101828]">
                Select {label || 'Option'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="p-1">
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center border border-gray-200 rounded-xl bg-gray-50 px-3 h-11 mb-4">
              <Ionicons name="search-outline" size={16} color="#9CA3AF" />
              <TextInput
                placeholder="Search options..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{ fontFamily: 'Inter-Regular' }}
                className="flex-1 text-sm text-[#101828] h-full ml-2"
              />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {filteredOptions.length > 0 ? (
                filteredOptions.map(item => (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => {
                      onSelect(item.value);
                      setModalVisible(false);
                    }}
                    className="py-3.5 border-b border-gray-50 flex-row justify-between items-center"
                  >
                    <Text
                      style={{ fontFamily: item.value === value ? 'Inter-SemiBold' : 'Inter-Medium' }}
                      className={`text-sm ${item.value === value ? 'text-[#008E96]' : 'text-gray-700'}`}
                    >
                      {item.label}
                    </Text>
                    {item.value === value && (
                      <Ionicons name="checkmark" size={18} color="#008E96" />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View className="py-10 items-center justify-center">
                  <Text style={{ fontFamily: 'Inter-Medium' }} className="text-gray-400">
                    No options found
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default function PropertySummary() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { projectId, projectName, mode } = params;

  // Tabs: 'add' or 'view'
  const [activeTab, setActiveTab] = useState(mode === 'view' ? 'view' : 'add');
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Lookups lists
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [subPropertyTypes, setSubPropertyTypes] = useState([]);
  const [propertyItems, setPropertyItems] = useState([]);
  const [measurementUnits, setMeasurementUnits] = useState([]);
  const [structures, setStructures] = useState([]);
  const [fetchedAmenities, setFetchedAmenities] = useState([]);

  // Form selections
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [selectedSubPropertyType, setSelectedSubPropertyType] = useState('');
  const [subPropertyObj, setSubPropertyObj] = useState(null);

  // Group Tower inputs
  const [totalTowers, setTotalTowers] = useState('');
  const [floorsPerTower, setFloorsPerTower] = useState('');

  // Amenities selections (list of IDs)
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Dynamic Specification line items
  const [rows, setRows] = useState([
    {
      id: Date.now(),
      propertyItem: '',
      area: '',
      areaUnit: '',
      structureValue: '1',
      structureId: '',
      quantity: '1',
      price: '',
      images: [], // base64 strings
    },
  ]);

  // View Summary states
  const [summaries, setSummaries] = useState([]);
  const [expandedPtId, setExpandedPtId] = useState('');
  const [activeSubPtId, setActiveSubPtId] = useState('');
  const [lightboxImage, setLightboxImage] = useState(null);

  // Load configuration options and summary items
  const fetchInitialData = useCallback(async () => {
    try {
      setLoadingMetadata(true);
      const [ptRes, unitsRes, structRes, amenRes, summariesRes] = await Promise.all([
        api.get('/property-types?activeOnly=true'),
        api.get('/measurement-units'),
        api.get('/structures?activeOnly=true'),
        api.get('/amenities?activeOnly=true').catch(() => ({ data: { success: true, data: [] } })),
        api.get(`/projects/${projectId}/summaries`).catch(() => ({ data: { success: true, data: [] } })),
      ]);

      if (ptRes.data?.success) setPropertyTypes(ptRes.data.data || []);
      if (unitsRes.data?.success) setMeasurementUnits(unitsRes.data.data || []);
      if (structRes.data?.success) setStructures(structRes.data.data || []);
      if (amenRes.data?.success) setFetchedAmenities(amenRes.data.data || []);

      if (summariesRes.data?.success) {
        const summariesList = summariesRes.data.data || [];
        setSummaries(summariesList);

        if (summariesList.length > 0) {
          const firstPt = summariesList[0].propertyType?._id || summariesList[0].propertyType;
          setExpandedPtId(firstPt);

          const firstSubPt = summariesList[0].subPropertyType?._id || summariesList[0].subPropertyType;
          setActiveSubPtId(firstSubPt);

          // Extract amenities and set selection
          const prevAmenities = [];
          summariesList.forEach(s => {
            if (s.amenities && Array.isArray(s.amenities)) {
              s.amenities.forEach(a => {
                const aId = a._id || a;
                if (aId && !prevAmenities.includes(aId)) {
                  prevAmenities.push(aId);
                }
              });
            }
          });
          setSelectedAmenities(prevAmenities);
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load property summary config lookups.');
    } finally {
      setLoadingMetadata(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Load sub-properties when property type changes
  useEffect(() => {
    if (selectedPropertyType) {
      api.get(`/sub-property-types?propertyTypeId=${selectedPropertyType}&activeOnly=true`)
        .then(res => setSubPropertyTypes(res.data.data || []))
        .catch(err => console.error('Error loading sub property types:', err));
    } else {
      setSubPropertyTypes([]);
    }
  }, [selectedPropertyType]);

  // Load items when sub-property changes
  useEffect(() => {
    if (selectedSubPropertyType) {
      const sub = subPropertyTypes.find(s => s._id === selectedSubPropertyType);
      setSubPropertyObj(sub);

      api.get(`/property-items?subPropertyTypeId=${selectedSubPropertyType}&activeOnly=true`)
        .then(res => setPropertyItems(res.data.data || []))
        .catch(err => console.error('Error loading property items:', err));
    } else {
      setSubPropertyObj(null);
      setPropertyItems([]);
      setTotalTowers('');
      setFloorsPerTower('');
    }
  }, [selectedSubPropertyType, subPropertyTypes]);

  // Evaluate fields to show based on Sub Property Type name and label
  const getFieldsConfig = () => {
    if (!subPropertyObj) return { showItem: false, showBhk: false, isGroupTower: false };
    const name = subPropertyObj.name?.toLowerCase() || '';
    const label = subPropertyObj.label?.toLowerCase() || '';

    const isApartment = name.includes('apartment') || label.includes('apartment');
    const isGroupTower = name.includes('group_tower') || label.includes('group tower') || label.includes('tower');
    const isHouseOrVilla = name.includes('independent_house') || name.includes('villa') || label.includes('house') || label.includes('villa') || label.includes('independent');

    return {
      showItem: isApartment || isGroupTower,
      showBhk: isApartment || isGroupTower || isHouseOrVilla,
      isGroupTower: isGroupTower,
    };
  };

  const { showItem, showBhk, isGroupTower } = getFieldsConfig();

  // Dynamic row mutations
  const handleAddRow = () => {
    setRows(prev => [
      ...prev,
      {
        id: Date.now(),
        propertyItem: '',
        area: '',
        areaUnit: '',
        structureValue: '1',
        structureId: '',
        quantity: '1',
        price: '',
        images: [],
      },
    ]);
  };

  const handleRemoveRow = id => {
    if (rows.length > 1) {
      setRows(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleRowChange = (id, field, value) => {
    setRows(prev =>
      prev.map(r => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // Image picking using expo-image-picker
  const handlePickRowImages = async rowId => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please grant library permissions to pick row photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets) {
      const base64List = result.assets.map(asset => {
        return `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`;
      });

      setRows(prev =>
        prev.map(r => (r.id === rowId ? { ...r, images: [...r.images, ...base64List] } : r))
      );
    }
  };

  const handleRemoveRowImage = (rowId, imgIdx) => {
    setRows(prev =>
      prev.map(r => (r.id === rowId ? { ...r, images: r.images.filter((_, i) => i !== imgIdx) } : r))
    );
  };

  // Amenities selection toggle
  const handleAmenityToggle = id => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(aId => aId !== id) : [...prev, id]
    );
  };

  // Submit property specifications setup
  const handleSubmit = async () => {
    if (!selectedPropertyType || !selectedSubPropertyType) {
      Alert.alert('Missing Fields', 'Please select Property Type and Sub Property Type.');
      return;
    }

    if (isGroupTower && (!totalTowers || !floorsPerTower)) {
      Alert.alert('Missing Layout Details', 'Please fill total towers and floors.');
      return;
    }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.area || !row.areaUnit || !row.quantity) {
        Alert.alert('Row Incomplete', `Please enter Area, Unit, and Quantity for Specification Row #${i + 1}.`);
        return;
      }
      if (showItem && !row.propertyItem) {
        Alert.alert('Row Incomplete', `Please select Item Type for Specification Row #${i + 1}.`);
        return;
      }
      if (showBhk && (!row.structureId || !row.structureValue)) {
        Alert.alert('Row Incomplete', `Please choose Bedroom Structure Type for Specification Row #${i + 1}.`);
        return;
      }
    }

    try {
      setSubmitting(true);
      const payload = {
        propertyType: selectedPropertyType,
        subPropertyType: selectedSubPropertyType,
        ...(isGroupTower && {
          totalTowers: Number(totalTowers),
          floorsPerTower: Number(floorsPerTower),
        }),
        amenities: selectedAmenities,
        summaries: rows.map(r => ({
          propertyItem: showItem ? r.propertyItem : undefined,
          area: Number(r.area),
          areaUnit: r.areaUnit,
          structure: showBhk ? {
            value: Number(r.structureValue),
            id: r.structureId,
          } : undefined,
          quantity: Number(r.quantity),
          price: r.price ? Number(r.price) : 0,
          images: r.images || [],
        })),
      };

      const res = await api.post(`/projects/${projectId}/summaries`, payload);
      if (res.data?.success) {
        Alert.alert(
          'Success 🎉',
          'Property summaries added successfully!',
          [
            {
              text: 'View Setup',
              onPress: () => {
                fetchInitialData();
                setActiveTab('view');
              },
            },
          ]
        );

        // Reset inputs
        setRows([
          {
            id: Date.now(),
            propertyItem: '',
            area: '',
            areaUnit: '',
            structureValue: '1',
            structureId: '',
            quantity: '1',
            price: '',
            images: [],
          },
        ]);
        setSelectedPropertyType('');
        setSelectedSubPropertyType('');
        setTotalTowers('');
        setFloorsPerTower('');
        setSelectedAmenities([]);
      } else {
        throw new Error(res.data?.message || 'Error occurred while saving summaries.');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Something went wrong.';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    Alert.alert('Reset Form', 'Are you sure you want to clear all inputs?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          setRows([
            {
              id: Date.now(),
              propertyItem: '',
              area: '',
              areaUnit: '',
              structureValue: '1',
              structureId: '',
              quantity: '1',
              price: '',
              images: [],
            },
          ]);
          setSelectedPropertyType('');
          setSelectedSubPropertyType('');
          setTotalTowers('');
          setFloorsPerTower('');
          setSelectedAmenities([]);
        },
      },
    ]);
  };

  // Delete summaries handler
  const handleDeleteSummary = summaryId => {
    Alert.alert(
      'Delete Specifications Group',
      'Are you sure you want to permanently delete this property summary group?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoadingMetadata(true);
              const res = await api.delete(`/projects/${projectId}/summaries/${summaryId}`);
              if (res.data?.success) {
                Alert.alert('Deleted', 'Summary group has been deleted successfully.');
                fetchInitialData();
              }
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Failed to delete summary group.');
            } finally {
              setLoadingMetadata(false);
            }
          },
        },
      ]
    );
  };

  // Grouped summaries lookup sorting
  const groupedByPropertyType = summaries.reduce((acc, curr) => {
    const ptId = curr.propertyType?._id || curr.propertyType;
    if (!ptId) return acc;
    if (!acc[ptId]) {
      acc[ptId] = {
        details: curr.propertyType,
        items: [],
      };
    }
    acc[ptId].items.push(curr);
    return acc;
  }, {});

  const activeSummaries = summaries.filter(
    s => (s.propertyType?._id || s.propertyType) === expandedPtId &&
         (s.subPropertyType?._id || s.subPropertyType) === activeSubPtId
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      {/* Header bar */}
      <LinearGradient colors={['#006B73', '#008E96']} className="px-4 pt-10 pb-5 rounded-b-[28px] shadow-sm">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white text-lg leading-snug">
              Property Specifications
            </Text>
            <Text style={{ fontFamily: 'Inter-Regular' }} className="text-white/85 text-xs">
              Project: {projectName || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Tab switcher */}
        <View className="flex-row bg-black/15 rounded-xl p-1 mt-4">
          <TouchableOpacity
            onPress={() => setActiveTab('add')}
            className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'add' ? 'bg-white shadow-sm' : ''}`}
          >
            <Text
              style={{ fontFamily: activeTab === 'add' ? 'Inter-SemiBold' : 'Inter-Medium' }}
              className={`text-xs ${activeTab === 'add' ? 'text-[#008E96]' : 'text-white'}`}
            >
              Add Summary
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('view')}
            className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'view' ? 'bg-white shadow-sm' : ''}`}
          >
            <Text
              style={{ fontFamily: activeTab === 'view' ? 'Inter-SemiBold' : 'Inter-Medium' }}
              className={`text-xs ${activeTab === 'view' ? 'text-[#008E96]' : 'text-white'}`}
            >
              View Summaries
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loadingMetadata ? (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#008E96" />
          <Text style={{ fontFamily: 'Inter-Medium' }} className="mt-4 text-gray-500">
            Loading summaries context data...
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          className="flex-1"
        >
          {activeTab === 'add' ? (
            /* --- ADD SUMMARY TAB --- */
            <View>
              {/* Category selections */}
              <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[#008E96] text-xs uppercase tracking-wider mb-3">
                  Category Selections
                </Text>

                <CustomPicker
                  label="Property Type *"
                  placeholder="Select Property Type"
                  value={selectedPropertyType}
                  options={propertyTypes.map(t => ({ label: t.label || t.name, value: t._id }))}
                  onSelect={val => {
                    setSelectedPropertyType(val);
                    setSelectedSubPropertyType('');
                  }}
                />

                <CustomPicker
                  label="Sub Property Type *"
                  placeholder="Select Sub Property Type"
                  value={selectedSubPropertyType}
                  options={subPropertyTypes.map(t => ({ label: t.label || t.name, value: t._id }))}
                  onSelect={setSelectedSubPropertyType}
                  disabled={!selectedPropertyType}
                />

                {isGroupTower && (
                  <View className="flex-row gap-3 pt-2 mt-2 border-t border-gray-50">
                    <View className="flex-1">
                      <SectionLabel required>Total Towers</SectionLabel>
                      <TextInput
                        placeholder="e.g. 5"
                        keyboardType="numeric"
                        value={totalTowers}
                        onChangeText={setTotalTowers}
                        style={{ fontFamily: 'Inter-Regular' }}
                        className="h-12 border border-gray-200 rounded-xl px-3 bg-white text-sm text-[#101828]"
                      />
                    </View>
                    <View className="flex-1">
                      <SectionLabel required>Floors Per Tower</SectionLabel>
                      <TextInput
                        placeholder="e.g. 12"
                        keyboardType="numeric"
                        value={floorsPerTower}
                        onChangeText={setFloorsPerTower}
                        style={{ fontFamily: 'Inter-Regular' }}
                        className="h-12 border border-gray-200 rounded-xl px-3 bg-white text-sm text-[#101828]"
                      />
                    </View>
                  </View>
                )}
              </View>

              {/* Dynamic rows */}
              <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
                <View className="flex-row justify-between items-center border-b border-gray-100 pb-3 mb-4">
                  <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[#008E96] text-xs uppercase tracking-wider">
                    Inventory Specification Lines
                  </Text>
                  <TouchableOpacity
                    onPress={handleAddRow}
                    className="flex-row items-center bg-[#E6F7F6] px-3 py-1.5 rounded-lg border border-[#008E96]/20"
                  >
                    <Ionicons name="add" size={14} color="#008E96" />
                    <Text style={{ fontFamily: 'Inter-SemiBold' }} className="text-[#008E96] text-xs ml-1">
                      Add Row
                    </Text>
                  </TouchableOpacity>
                </View>

                {rows.map((row, index) => (
                  <View key={row.id} className={`pb-6 mb-6 border-b border-gray-100 ${index === rows.length - 1 ? 'border-b-0 pb-0 mb-0' : ''}`}>
                    <View className="flex-row justify-between items-center mb-3">
                      <Text style={{ fontFamily: 'Inter-Bold' }} className="text-gray-500 text-xs bg-gray-100 px-2 py-0.5 rounded-md">
                        Specification #{index + 1}
                      </Text>
                      {rows.length > 1 && (
                        <TouchableOpacity onPress={() => handleRemoveRow(row.id)}>
                          <Text style={{ fontFamily: 'Inter-Medium' }} className="text-red-500 text-xs">
                            Remove Line
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {showItem && (
                      <CustomPicker
                        label="Item Type *"
                        placeholder="Select Item"
                        value={row.propertyItem}
                        options={propertyItems.map(item => ({ label: item.label || item.name, value: item._id }))}
                        onSelect={val => handleRowChange(row.id, 'propertyItem', val)}
                        disabled={!selectedSubPropertyType}
                      />
                    )}

                    <View className="flex-row gap-3 mb-3">
                      <View className="flex-1">
                        <SectionLabel required>Area</SectionLabel>
                        <TextInput
                          placeholder="e.g. 1200"
                          keyboardType="numeric"
                          value={row.area}
                          onChangeText={val => handleRowChange(row.id, 'area', val)}
                          style={{ fontFamily: 'Inter-Regular' }}
                          className="h-12 border border-gray-200 rounded-xl px-3 bg-white text-sm text-[#101828]"
                        />
                      </View>
                      <View style={{ width: 100 }}>
                        <CustomPicker
                          label="Unit *"
                          placeholder="Unit"
                          value={row.areaUnit}
                          options={measurementUnits.map(unit => ({ label: unit.label || unit.name, value: unit._id }))}
                          onSelect={val => handleRowChange(row.id, 'areaUnit', val)}
                        />
                      </View>
                    </View>

                    {showBhk && (
                      <View className="flex-row gap-3 mb-3">
                        <View style={{ width: 100 }}>
                          <SectionLabel required>Value</SectionLabel>
                          <TextInput
                            placeholder="e.g. 3"
                            keyboardType="numeric"
                            value={row.structureValue}
                            onChangeText={val => handleRowChange(row.id, 'structureValue', val)}
                            style={{ fontFamily: 'Inter-Regular' }}
                            className="h-12 border border-gray-200 rounded-xl px-3 bg-white text-sm text-[#101828]"
                          />
                        </View>
                        <View className="flex-1">
                          <CustomPicker
                            label="Structure Type *"
                            placeholder="Select Type"
                            value={row.structureId}
                            options={structures.map(st => ({ label: st.label || st.name, value: st._id }))}
                            onSelect={val => handleRowChange(row.id, 'structureId', val)}
                          />
                        </View>
                      </View>
                    )}

                    <View className="flex-row gap-3 mb-3">
                      <View className="flex-1">
                        <SectionLabel required>Quantity (Units)</SectionLabel>
                        <TextInput
                          placeholder="e.g. 1"
                          keyboardType="numeric"
                          value={row.quantity}
                          onChangeText={val => handleRowChange(row.id, 'quantity', val)}
                          style={{ fontFamily: 'Inter-Regular' }}
                          className="h-12 border border-gray-200 rounded-xl px-3 bg-white text-sm text-[#101828]"
                        />
                      </View>
                      <View className="flex-1">
                        <SectionLabel>Price (₹)</SectionLabel>
                        <View className="flex-row items-center border border-gray-200 rounded-xl bg-white px-3 h-12">
                          <Text style={{ fontFamily: 'Inter-Medium' }} className="text-gray-500 text-sm mr-1.5">
                            ₹
                          </Text>
                          <TextInput
                            placeholder="e.g. 4500000"
                            keyboardType="numeric"
                            value={row.price}
                            onChangeText={val => handleRowChange(row.id, 'price', val)}
                            style={{ fontFamily: 'Inter-Regular' }}
                            className="flex-1 text-sm text-[#101828] h-full"
                          />
                        </View>
                      </View>
                    </View>

                    {/* Image selection */}
                    <View className="mt-2">
                      <SectionLabel>Images (Photos of this Row)</SectionLabel>
                      <TouchableOpacity
                        onPress={() => handlePickRowImages(row.id)}
                        className="h-11 border border-dashed border-gray-300 rounded-xl bg-gray-50 flex-row items-center justify-center gap-2"
                      >
                        <Ionicons name="camera-outline" size={16} color="#008E96" />
                        <Text style={{ fontFamily: 'Inter-SemiBold' }} className="text-[#008E96] text-xs">
                          Choose Photos
                        </Text>
                      </TouchableOpacity>

                      {row.images && row.images.length > 0 && (
                        <ScrollView horizontal className="flex-row mt-3" showsHorizontalScrollIndicator={false}>
                          {row.images.map((base64, bIdx) => (
                            <View key={bIdx} className="w-16 h-16 rounded-xl mr-3 border border-gray-200 overflow-hidden relative bg-gray-50">
                              <Image source={{ uri: base64 }} className="w-full h-full" resizeMode="cover" />
                              <TouchableOpacity
                                onPress={() => handleRemoveRowImage(row.id, bIdx)}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600/90 items-center justify-center shadow-md"
                              >
                                <Ionicons name="close" size={12} color="white" />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </ScrollView>
                      )}
                    </View>
                  </View>
                ))}
              </View>

              {/* Amenities block */}
              {fetchedAmenities.length > 0 && (
                <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
                  <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[#008E96] text-xs uppercase tracking-wider mb-3">
                    Include Category Amenities
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {fetchedAmenities.map(am => {
                      const isSelected = selectedAmenities.includes(am._id);
                      return (
                        <TouchableOpacity
                          key={am._id}
                          onPress={() => handleAmenityToggle(am._id)}
                          className={`px-3 py-2.5 rounded-xl border flex-row items-center gap-1.5 mr-1 mb-1 bg-white ${
                            isSelected ? 'bg-[#E6F7F6] border-[#008E96]' : 'border-gray-200'
                          }`}
                        >
                          <Text
                            style={{ fontFamily: isSelected ? 'Inter-SemiBold' : 'Inter-Regular' }}
                            className={`text-xs ${isSelected ? 'text-[#008E96]' : 'text-gray-600'}`}
                          >
                            {am.label || am.name}
                          </Text>
                          {isSelected && <Ionicons name="checkmark" size={12} color="#008E96" />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Submission control */}
              <View className="flex-row gap-4 mb-10">
                <TouchableOpacity
                  disabled={submitting}
                  onPress={handleSubmit}
                  className="flex-1 h-12 bg-[#008E96] rounded-xl items-center justify-center shadow-md shadow-[#008E96]/20 flex-row gap-2"
                >
                  {submitting && <ActivityIndicator size="small" color="white" />}
                  <Text style={{ fontFamily: 'Inter-SemiBold' }} className="text-white text-sm">
                    Submit Setup
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleResetForm}
                  className="w-28 h-12 bg-gray-200 rounded-xl items-center justify-center"
                >
                  <Text style={{ fontFamily: 'Inter-SemiBold' }} className="text-gray-700 text-sm">
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* --- VIEW SUMMARIES TAB --- */
            <View>
              {Object.keys(groupedByPropertyType).length === 0 ? (
                <View className="items-center justify-center py-20 px-8">
                  <View className="w-16 h-16 rounded-full bg-[#E6F7F6] items-center justify-center mb-4">
                    <MaterialCommunityIcons name="home-city" size={32} color="#008E96" />
                  </View>
                  <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[#101828] text-base text-center">
                    No specifications added yet
                  </Text>
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-gray-500 text-xs text-center mt-2">
                    Add configurations, sizes, prices, and photos for the property types inside this project.
                  </Text>
                  <TouchableOpacity
                    onPress={() => setActiveTab('add')}
                    className="mt-6 bg-[#008E96] px-5 py-3 rounded-xl shadow-md"
                  >
                    <Text style={{ fontFamily: 'Inter-SemiBold' }} className="text-white text-xs uppercase tracking-wider">
                      Add First Setup
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                Object.keys(groupedByPropertyType).map(ptId => {
                  const pt = groupedByPropertyType[ptId];
                  const isExpanded = expandedPtId === ptId;

                  // Find sub property types under this property type
                  const subPts = pt.items.reduce((acc, curr) => {
                    const subPt = curr.subPropertyType;
                    const subId = subPt?._id || subPt;
                    if (subId && !acc.some(s => s._id === subId)) {
                      acc.push(subPt);
                    }
                    return acc;
                  }, []);

                  // Calculate total units in this property type
                  const ptTotalUnits = pt.items.reduce((sum, item) => {
                    const rowSum = item.summaries?.reduce((rSum, r) => rSum + (r.quantity || 0), 0) || 0;
                    return sum + rowSum;
                  }, 0);

                  return (
                    <View key={ptId} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-4">
                      {/* Accordion header */}
                      <TouchableOpacity
                        onPress={() => {
                          setExpandedPtId(isExpanded ? '' : ptId);
                          if (subPts.length > 0) {
                            setActiveSubPtId(subPts[0]._id || subPts[0]);
                          }
                        }}
                        className="bg-[#008E96]/5 px-4 py-4 flex-row justify-between items-center border-b border-gray-50"
                      >
                        <View className="flex-row items-center gap-2">
                          <Ionicons name="business" size={16} color="#008E96" />
                          <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[#101828] text-sm truncate max-w-[200px]">
                            {pt.details?.label || pt.details?.name || 'Property Group'}
                          </Text>
                          <View className="bg-[#E6F7F6] border border-[#008E96]/20 px-2 py-0.5 rounded-full">
                            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[#008E96] text-[10px]">
                              {ptTotalUnits} Units
                            </Text>
                          </View>
                        </View>
                        <Ionicons
                          name={isExpanded ? 'chevron-up' : 'chevron-down'}
                          size={18}
                          color="#6B7280"
                        />
                      </TouchableOpacity>

                      {isExpanded && (
                        <View className="p-4">
                          {/* Horizontal tabs */}
                          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row border-b border-gray-100 pb-3 mb-4">
                            {subPts.map(subPt => {
                              const subId = subPt._id || subPt;
                              const isActive = activeSubPtId === subId;

                              // Total units in active sub property type
                              const subTotalUnits = pt.items
                                .filter(s => (s.subPropertyType?._id || s.subPropertyType) === subId)
                                .reduce((sum, item) => {
                                  const rowSum = item.summaries?.reduce((rSum, r) => rSum + (r.quantity || 0), 0) || 0;
                                  return sum + rowSum;
                                }, 0);

                              return (
                                <TouchableOpacity
                                  key={subId}
                                  onPress={() => setActiveSubPtId(subId)}
                                  className={`px-3 py-1.5 rounded-lg border mr-2 flex-row items-center gap-1.5 ${
                                    isActive ? 'bg-[#008E96] border-[#008E96]' : 'bg-white border-gray-200'
                                  }`}
                                >
                                  <Text
                                    style={{ fontFamily: isActive ? 'Inter-SemiBold' : 'Inter-Medium' }}
                                    className={`text-xs ${isActive ? 'text-white' : 'text-gray-500'}`}
                                  >
                                    {subPt.label || subPt.name}
                                  </Text>
                                  <View className={`px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                                    <Text
                                      style={{ fontFamily: 'Inter-Bold' }}
                                      className={`text-[9px] ${isActive ? 'text-white' : 'text-gray-600'}`}
                                    >
                                      {subTotalUnits}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              );
                            })}
                          </ScrollView>

                          {/* Specification Items list */}
                          {activeSummaries.length === 0 ? (
                            <View className="py-6 items-center">
                              <Text style={{ fontFamily: 'Inter-Medium' }} className="text-gray-400 text-xs">
                                Select a sub-category tab above to view specification rows.
                              </Text>
                            </View>
                          ) : (
                            activeSummaries.map(summaryGroup => {
                              const totalQty = summaryGroup.summaries?.reduce((sum, r) => sum + (r.quantity || 0), 0) || 0;

                              return (
                                <View key={summaryGroup._id} className="mb-4">
                                  {summaryGroup.summaries?.map((row, rIdx) => {
                                    const structText = row.structure?.id
                                      ? `${row.structure.value} ${row.structure.id?.name || row.structure.id?.label || ''}`
                                      : null;

                                    return (
                                      <View key={row._id || rIdx} className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 mb-3">
                                        <View className="flex-row justify-between items-start mb-2">
                                          <View className="flex-row items-center gap-1.5">
                                            <View className="w-5 h-5 rounded-full bg-gray-200 items-center justify-center">
                                              <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[10px] text-gray-600">
                                                {rIdx + 1}
                                              </Text>
                                            </View>
                                            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[#101828] text-sm">
                                              {structText || row.propertyItem?.label || row.propertyItem?.name || 'Specification'}
                                            </Text>
                                            {structText && row.propertyItem && (
                                              <Text style={{ fontFamily: 'Inter-Regular' }} className="text-gray-400 text-xs">
                                                ({row.propertyItem?.label})
                                              </Text>
                                            )}
                                          </View>
                                          <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[#008E96] text-sm">
                                            {row.price ? `₹${row.price.toLocaleString('en-IN')}` : 'Price on Request'}
                                          </Text>
                                        </View>

                                        <View className="flex-row justify-between items-center">
                                          <View className="flex-row items-center gap-4">
                                            <View className="flex-row items-center gap-1">
                                              <Ionicons name="expand-outline" size={13} color="#6B7280" />
                                              <Text style={{ fontFamily: 'Inter-Medium' }} className="text-gray-500 text-xs">
                                                {row.area} {row.areaUnit?.label || 'Sq. Ft.'}
                                              </Text>
                                            </View>
                                            <View className="flex-row items-center gap-1">
                                              <Ionicons name="grid-outline" size={13} color="#6B7280" />
                                              <Text style={{ fontFamily: 'Inter-Medium' }} className="text-gray-500 text-xs">
                                                {row.quantity} Units
                                              </Text>
                                            </View>
                                          </View>

                                          {row.images && row.images.length > 0 && (
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                              {row.images.map((img, iIdx) => (
                                                <TouchableOpacity
                                                  key={iIdx}
                                                  onPress={() => setLightboxImage(img)}
                                                  className="w-7 h-7 rounded border border-gray-200 overflow-hidden ml-1"
                                                >
                                                  <Image source={{ uri: img }} className="w-full h-full" resizeMode="cover" />
                                                </TouchableOpacity>
                                              ))}
                                            </ScrollView>
                                          )}
                                        </View>
                                      </View>
                                    );
                                  })}

                                  {/* Summary group amenities */}
                                  {summaryGroup.amenities && summaryGroup.amenities.length > 0 && (
                                    <View className="p-3 bg-teal-50/40 rounded-xl border border-teal-100/50 mb-3">
                                      <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[10px] text-teal-800 uppercase tracking-widest mb-1.5">
                                        Included Amenities
                                      </Text>
                                      <View className="flex-row flex-wrap gap-1.5">
                                        {summaryGroup.amenities.map(am => (
                                          <View
                                            key={am._id || am}
                                            className="bg-white border border-teal-100 px-2 py-0.5 rounded shadow-sm"
                                          >
                                            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[10px] text-teal-700">
                                              {am.label || am.name || 'Amenity'}
                                            </Text>
                                          </View>
                                        ))}
                                      </View>
                                    </View>
                                  )}

                                  {/* Delete specification row group card */}
                                  <View className="flex-row justify-between items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                                    <View className="flex-row items-center gap-1.5">
                                      <Text style={{ fontFamily: 'Inter-Bold' }} className="text-gray-700 text-xs">
                                        Group Total:
                                      </Text>
                                      <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[#101828] text-xs">
                                        {totalQty} Units
                                      </Text>
                                    </View>
                                    <TouchableOpacity
                                      onPress={() => handleDeleteSummary(summaryGroup._id)}
                                      className="flex-row items-center bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg"
                                    >
                                      <Ionicons name="trash-outline" size={13} color="#EF4444" />
                                      <Text style={{ fontFamily: 'Inter-SemiBold' }} className="text-[#EF4444] text-xs ml-1">
                                        Delete Group
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              );
                            })
                          )}
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </View>
          )}
        </ScrollView>
      )}

      {/* Lightbox full screen viewer */}
      {lightboxImage && (
        <Modal
          visible={!!lightboxImage}
          transparent
          animationType="fade"
          onRequestClose={() => setLightboxImage(null)}
        >
          <View className="flex-1 bg-black/90 justify-center items-center p-4">
            <TouchableOpacity
              onPress={() => setLightboxImage(null)}
              className="absolute top-10 right-5 w-10 h-10 rounded-full bg-white/20 items-center justify-center z-50"
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <Image
              source={{ uri: lightboxImage }}
              style={{ width: Dimensions.get('window').width - 32, height: Dimensions.get('window').height * 0.7 }}
              resizeMode="contain"
            />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}
