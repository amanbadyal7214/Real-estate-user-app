import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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
import api from '../../api';

// Custom Label Component
const SectionLabel = ({ children, required }) => (
  <Text style={{ fontWeight: '600', color: '#374151', fontSize: wp('3.5%'), marginBottom: hp('0.7%') }}>
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
        style={{ height: hp('6%'), borderRadius: wp('3%'), paddingHorizontal: wp('3%') }}
        className={`flex-row justify-between items-center border border-gray-200 bg-white ${disabled ? 'opacity-50 bg-gray-50' : ''
          }`}
      >
        <Text
          style={{ fontWeight: '400', fontSize: wp('3.5%') }}
          className={`${selectedOption ? 'text-[#101828]' : 'text-gray-400'}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={wp('4%')} color="#6B7280" />
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
          <View style={{ padding: wp('5%'), paddingBottom: hp('3%'), borderTopLeftRadius: wp('7%'), borderTopRightRadius: wp('7%'), height: '60%' }} className="bg-white shadow-2xl">
            <View style={{ marginBottom: hp('1.8%') }} className="flex-row justify-between items-center">
              <Text style={{ fontWeight: '700', fontSize: wp('4%') }} className="text-[#101828]">
                Select {label || 'Option'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: wp('1%') }}>
                <Ionicons name="close" size={wp('6%')} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={{ height: hp('5.5%'), borderRadius: wp('3%'), paddingHorizontal: wp('3%'), marginBottom: hp('1.8%') }} className="flex-row items-center border border-gray-200 bg-gray-50">
              <Ionicons name="search-outline" size={wp('4%')} color="#9CA3AF" />
              <TextInput
                placeholder="Search options..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{ fontWeight: '400', fontSize: wp('3.5%'), marginLeft: wp('2%') }}
                className="flex-1 text-[#101828] h-full"
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
                    style={{ paddingVertical: hp('1.6%') }}
                    className="border-b border-gray-50 flex-row justify-between items-center"
                  >
                    <Text
                      style={{ fontFamily: item.value === value ? 'Inter-SemiBold' : 'Inter-Medium', fontSize: wp('3.5%') }}
                      className={`${item.value === value ? 'text-[#008E96]' : 'text-gray-700'}`}
                    >
                      {item.label}
                    </Text>
                    {item.value === value && (
                      <Ionicons name="checkmark" size={wp('4.5%')} color="#008E96" />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View className="py-10 items-center justify-center">
                  <Text style={{ fontWeight: '500' }} className="text-gray-400">
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
  const [editSummaryGroupId, setEditSummaryGroupId] = useState('');

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

  // Handle Edit Mode Prefill
  useEffect(() => {
    if (mode === 'edit' && params.summaryGroup) {
      try {
        const group = JSON.parse(params.summaryGroup);
        setEditSummaryGroupId(group._id);
        setSelectedPropertyType(group.propertyType?._id || group.propertyType);
        setSelectedSubPropertyType(group.subPropertyType?._id || group.subPropertyType);
        if (group.totalTowers) setTotalTowers(String(group.totalTowers));
        if (group.floorsPerTower) setFloorsPerTower(String(group.floorsPerTower));
        
        const prevAmenities = [];
        if (group.amenities && Array.isArray(group.amenities)) {
           group.amenities.forEach(a => {
              const aId = a._id || a;
              if (aId) prevAmenities.push(aId);
           });
        }
        setSelectedAmenities(prevAmenities);

        if (group.summaries && group.summaries.length > 0) {
          const loadedRows = group.summaries.map((s, idx) => ({
            id: s._id || Date.now() + idx,
            propertyItem: s.propertyItem?._id || s.propertyItem || '',
            area: s.area ? String(s.area) : '',
            areaUnit: s.areaUnit?._id || s.areaUnit || '',
            structureValue: s.structure?.value ? String(s.structure.value) : '1',
            structureId: s.structure?.id?._id || s.structure?.id || '',
            quantity: s.quantity ? String(s.quantity) : '1',
            price: s.price ? String(s.price) : '',
            images: s.images || [],
          }));
          setRows(loadedRows);
        }
        
        setActiveTab('add');
      } catch (err) {
        console.error("Failed to parse edit summary group:", err);
      }
    }
  }, [mode, params.summaryGroup]);

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

      const res = editSummaryGroupId
        ? await api.put(`/projects/${projectId}/summaries/${editSummaryGroupId}`, payload)
        : await api.post(`/projects/${projectId}/summaries`, payload);
        
      if (res.data?.success) {
        Alert.alert(
          'Success 🎉',
          editSummaryGroupId ? 'Property summaries updated successfully!' : 'Property summaries added successfully!',
          [
            {
              text: 'View Setup',
              onPress: () => {
                if (mode === 'edit') {
                  router.back();
                } else {
                  fetchInitialData();
                  setActiveTab('view');
                }
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
        setEditSummaryGroupId('');
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header bar */}
      <LinearGradient colors={['#006B73', '#008E96']} style={{ paddingHorizontal: wp('4%'), paddingTop: hp('5%'), paddingBottom: hp('2.5%'), borderBottomLeftRadius: wp('7%'), borderBottomRightRadius: wp('7%') }} className="shadow-sm">
        <View style={{ gap: wp('3%') }} className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} style={{ padding: wp('1%') }}>
            <Ionicons name="arrow-back" size={wp('6%')} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700', fontSize: wp('4.8%'), lineHeight: wp('6%') }} className="text-white">
              Property Specifications
            </Text>
            <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-white/85">
              Project: {projectName || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Tab switcher */}
        <View style={{ borderRadius: wp('3%'), padding: wp('1%'), marginTop: hp('1.8%') }} className="flex-row bg-black/15">
          <TouchableOpacity
            onPress={() => setActiveTab('add')}
            style={{ paddingVertical: hp('1%'), borderRadius: wp('2%') }}
            className={`flex-1 items-center ${activeTab === 'add' ? 'bg-white shadow-sm' : ''}`}
          >
            <Text
              style={{ fontFamily: activeTab === 'add' ? 'Inter-SemiBold' : 'Inter-Medium', fontSize: wp('3.2%') }}
              className={`${activeTab === 'add' ? 'text-[#008E96]' : 'text-white'}`}
            >
              Add Summary
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('view')}
            style={{ paddingVertical: hp('1%'), borderRadius: wp('2%') }}
            className={`flex-1 items-center ${activeTab === 'view' ? 'bg-white shadow-sm' : ''}`}
          >
            <Text
              style={{ fontFamily: activeTab === 'view' ? 'Inter-SemiBold' : 'Inter-Medium', fontSize: wp('3.2%') }}
              className={`${activeTab === 'view' ? 'text-[#008E96]' : 'text-white'}`}
            >
              View Summaries
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loadingMetadata ? (
        <View style={{ paddingVertical: hp('8%') }} className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#008E96" />
          <Text style={{ fontWeight: '500', marginTop: hp('1.8%'), fontSize: wp('3.5%') }} className="text-gray-500">
            Loading summaries context data...
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: wp('4%'), paddingBottom: hp('5%') }}
          className="flex-1"
        >
          {activeTab === 'add' ? (
            /* --- ADD SUMMARY TAB --- */
            <View>
              {/* Category selections */}
              <View style={{ borderRadius: wp('4%'), padding: wp('4%'), marginBottom: hp('1.8%') }} className="bg-white border border-gray-100 shadow-sm">
                <Text style={{ fontWeight: '700', fontSize: wp('3.2%'), marginBottom: hp('1.2%'), letterSpacing: 1 }} className="text-[#008E96] uppercase">
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
                  <View style={{ gap: wp('3%'), paddingTop: hp('0.8%'), marginTop: hp('0.8%') }} className="flex-row border-t border-gray-50">
                    <View style={{ flex: 1 }}>
                      <SectionLabel required>Total Towers</SectionLabel>
                      <TextInput
                        placeholder="e.g. 5"
                        keyboardType="numeric"
                        value={totalTowers}
                        onChangeText={setTotalTowers}
                        style={{ fontWeight: '400', height: hp('6%'), borderRadius: wp('3%'), paddingHorizontal: wp('3%'), fontSize: wp('3.5%') }}
                        className="border border-gray-200 bg-white text-[#101828]"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <SectionLabel required>Floors Per Tower</SectionLabel>
                      <TextInput
                        placeholder="e.g. 12"
                        keyboardType="numeric"
                        value={floorsPerTower}
                        onChangeText={setFloorsPerTower}
                        style={{ fontWeight: '400', height: hp('6%'), borderRadius: wp('3%'), paddingHorizontal: wp('3%'), fontSize: wp('3.5%') }}
                        className="border border-gray-200 bg-white text-[#101828]"
                      />
                    </View>
                  </View>
                )}
              </View>

              {/* Dynamic rows */}
              <View style={{ borderRadius: wp('4%'), padding: wp('4%'), marginBottom: hp('1.8%') }} className="bg-white border border-gray-100 shadow-sm">
                <View style={{ paddingBottom: hp('1.2%'), marginBottom: hp('1.8%') }} className="flex-row justify-between items-center border-b border-gray-100">
                  <Text style={{ fontWeight: '700', fontSize: wp('3.2%'), letterSpacing: 1 }} className="text-[#008E96] uppercase">
                    Inventory Specification Lines
                  </Text>
                  <TouchableOpacity
                    onPress={handleAddRow}
                    style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('0.7%'), borderRadius: wp('2%') }}
                    className="flex-row items-center bg-[#E6F7F6] border border-[#008E96]/20"
                  >
                    <Ionicons name="add" size={wp('3.5%')} color="#008E96" />
                    <Text style={{ fontWeight: '600', fontSize: wp('3.2%'), marginLeft: wp('1%') }} className="text-[#008E96]">
                      Add Row
                    </Text>
                  </TouchableOpacity>
                </View>

                {rows.map((row, index) => (
                  <View key={row.id} style={{ paddingBottom: index === rows.length - 1 ? 0 : hp('2.5%'), marginBottom: index === rows.length - 1 ? 0 : hp('2.5%') }} className={`border-b border-gray-100 ${index === rows.length - 1 ? 'border-b-0' : ''}`}>
                    <View style={{ marginBottom: hp('1.2%') }} className="flex-row justify-between items-center">
                      <Text style={{ fontWeight: '700', fontSize: wp('3.2%'), paddingHorizontal: wp('2%'), paddingVertical: hp('0.3%'), borderRadius: wp('1.5%') }} className="text-gray-500 bg-gray-100">
                        Specification #{index + 1}
                      </Text>
                      {rows.length > 1 && (
                        <TouchableOpacity onPress={() => handleRemoveRow(row.id)}>
                          <Text style={{ fontWeight: '500', fontSize: wp('3.2%') }} className="text-red-500">
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

                    <View style={{ gap: wp('3%'), marginBottom: hp('1.2%') }} className="flex-row">
                      <View style={{ flex: 1 }}>
                        <SectionLabel required>Area</SectionLabel>
                        <TextInput
                          placeholder="e.g. 1200"
                          keyboardType="numeric"
                          value={row.area}
                          onChangeText={val => handleRowChange(row.id, 'area', val)}
                          style={{ fontWeight: '400', height: hp('6%'), borderRadius: wp('3%'), paddingHorizontal: wp('3%'), fontSize: wp('3.5%') }}
                          className="border border-gray-200 bg-white text-[#101828]"
                        />
                      </View>
                      <View style={{ width: wp('26%') }}>
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
                      <View style={{ gap: wp('3%'), marginBottom: hp('1.2%') }} className="flex-row">
                        <View style={{ width: wp('26%') }}>
                          <SectionLabel required>Value</SectionLabel>
                          <TextInput
                            placeholder="e.g. 3"
                            keyboardType="numeric"
                            value={row.structureValue}
                            onChangeText={val => handleRowChange(row.id, 'structureValue', val)}
                            style={{ fontWeight: '400', height: hp('6%'), borderRadius: wp('3%'), paddingHorizontal: wp('3%'), fontSize: wp('3.5%') }}
                            className="border border-gray-200 bg-white text-[#101828]"
                          />
                        </View>
                        <View style={{ flex: 1 }}>
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

                    <View style={{ gap: wp('3%'), marginBottom: hp('1.2%') }} className="flex-row">
                      <View style={{ flex: 1 }}>
                        <SectionLabel required>Quantity (Units)</SectionLabel>
                        <TextInput
                          placeholder="e.g. 1"
                          keyboardType="numeric"
                          value={row.quantity}
                          onChangeText={val => handleRowChange(row.id, 'quantity', val)}
                          style={{ fontWeight: '400', height: hp('6%'), borderRadius: wp('3%'), paddingHorizontal: wp('3%'), fontSize: wp('3.5%') }}
                          className="border border-gray-200 bg-white text-[#101828]"
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <SectionLabel>Price (₹)</SectionLabel>
                        <View style={{ height: hp('6%'), borderRadius: wp('3%'), paddingHorizontal: wp('3%') }} className="flex-row items-center border border-gray-200 bg-white">
                          <Text style={{ fontWeight: '500', fontSize: wp('3.5%'), marginRight: wp('1.5%') }} className="text-gray-500">
                            ₹
                          </Text>
                          <TextInput
                            placeholder="e.g. 4500000"
                            keyboardType="numeric"
                            value={row.price}
                            onChangeText={val => handleRowChange(row.id, 'price', val)}
                            style={{ fontWeight: '400', fontSize: wp('3.5%') }}
                            className="flex-1 text-[#101828] h-full"
                          />
                        </View>
                      </View>
                    </View>

                    {/* Image selection */}
                    <View style={{ marginTop: hp('0.8%') }}>
                      <SectionLabel>Images (Photos of this Row)</SectionLabel>
                      <TouchableOpacity
                        onPress={() => handlePickRowImages(row.id)}
                        style={{ height: hp('5.5%'), borderRadius: wp('3%'), gap: wp('2%') }}
                        className="border border-dashed border-gray-300 bg-gray-50 flex-row items-center justify-center"
                      >
                        <Ionicons name="camera-outline" size={wp('4%')} color="#008E96" />
                        <Text style={{ fontWeight: '600', fontSize: wp('3.2%') }} className="text-[#008E96]">
                          Choose Photos
                        </Text>
                      </TouchableOpacity>

                      {row.images && row.images.length > 0 && (
                        <ScrollView horizontal style={{ marginTop: hp('1.2%') }} className="flex-row" showsHorizontalScrollIndicator={false}>
                          {row.images.map((base64, bIdx) => (
                            <View key={bIdx} style={{ width: wp('16%'), height: wp('16%'), borderRadius: wp('3%'), marginRight: wp('3%') }} className="border border-gray-200 overflow-hidden relative bg-gray-50">
                              <Image source={{ uri: base64 }} className="w-full h-full" resizeMode="cover" />
                              <TouchableOpacity
                                onPress={() => handleRemoveRowImage(row.id, bIdx)}
                                style={{ top: wp('1%'), right: wp('1%'), width: wp('5%'), height: wp('5%') }}
                                className="absolute rounded-full bg-red-600/90 items-center justify-center shadow-md"
                              >
                                <Ionicons name="close" size={wp('3%')} color="white" />
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
                <View style={{ borderRadius: wp('4%'), padding: wp('4%'), marginBottom: hp('2.5%') }} className="bg-white border border-gray-100 shadow-sm">
                  <Text style={{ fontWeight: '700', fontSize: wp('3.2%'), marginBottom: hp('1.2%'), letterSpacing: 1 }} className="text-[#008E96] uppercase">
                    Include Category Amenities
                  </Text>
                  <View style={{ gap: wp('2%') }} className="flex-row flex-wrap">
                    {fetchedAmenities.map(am => {
                      const isSelected = selectedAmenities.includes(am._id);
                      return (
                        <TouchableOpacity
                          key={am._id}
                          onPress={() => handleAmenityToggle(am._id)}
                          style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('1.2%'), borderRadius: wp('3%'), gap: wp('1.5%'), marginRight: wp('1%'), marginBottom: hp('0.5%') }}
                          className={`border flex-row items-center bg-white ${isSelected ? 'bg-[#E6F7F6] border-[#008E96]' : 'border-gray-200'
                            }`}
                        >
                          <Text
                            style={{ fontFamily: isSelected ? 'Inter-SemiBold' : 'Inter-Regular', fontSize: wp('3.2%') }}
                            className={`${isSelected ? 'text-[#008E96]' : 'text-gray-600'}`}
                          >
                            {am.label || am.name}
                          </Text>
                          {isSelected && <Ionicons name="checkmark" size={wp('3%')} color="#008E96" />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Submission control */}
              <View style={{ gap: wp('4%'), marginBottom: hp('4%') }} className="flex-row">
                <TouchableOpacity
                  disabled={submitting}
                  onPress={handleSubmit}
                  style={{ height: hp('6%'), borderRadius: wp('3%'), gap: wp('2%') }}
                  className="flex-1 bg-[#008E96] items-center justify-center shadow-md shadow-[#008E96]/20 flex-row"
                >
                  {submitting && <ActivityIndicator size="small" color="white" />}
                  <Text style={{ fontWeight: '600', fontSize: wp('3.5%') }} className="text-white">
                    Submit Setup
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleResetForm}
                  style={{ width: wp('28%'), height: hp('6%'), borderRadius: wp('3%') }}
                  className="bg-gray-200 items-center justify-center"
                >
                  <Text style={{ fontWeight: '600', fontSize: wp('3.5%') }} className="text-gray-700">
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* --- VIEW SUMMARIES TAB --- */
            <View>
              {Object.keys(groupedByPropertyType).length === 0 ? (
                <View style={{ paddingVertical: hp('8%'), paddingHorizontal: wp('8%') }} className="items-center justify-center">
                  <View style={{ width: wp('16%'), height: wp('16%'), marginBottom: hp('1.8%') }} className="rounded-full bg-[#E6F7F6] items-center justify-center">
                    <MaterialCommunityIcons name="home-city" size={wp('8%')} color="#008E96" />
                  </View>
                  <Text style={{ fontWeight: '700', fontSize: wp('4%') }} className="text-[#101828] text-center">
                    No specifications added yet
                  </Text>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%'), marginTop: hp('0.8%') }} className="text-gray-500 text-center">
                    Add configurations, sizes, prices, and photos for the property types inside this project.
                  </Text>
                  <TouchableOpacity
                    onPress={() => setActiveTab('add')}
                    style={{ marginTop: hp('2.5%'), paddingHorizontal: wp('5%'), paddingVertical: hp('1.5%'), borderRadius: wp('3%') }}
                    className="bg-[#008E96] shadow-md"
                  >
                    <Text style={{ fontWeight: '600', fontSize: wp('3.2%'), letterSpacing: 1 }} className="text-white uppercase">
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
                    <View key={ptId} style={{ borderRadius: wp('4%'), marginBottom: hp('1.8%') }} className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                      {/* Accordion header */}
                      <TouchableOpacity
                        onPress={() => {
                          setExpandedPtId(isExpanded ? '' : ptId);
                          if (subPts.length > 0) {
                            setActiveSubPtId(subPts[0]._id || subPts[0]);
                          }
                        }}
                        style={{ paddingHorizontal: wp('4%'), paddingVertical: hp('1.8%') }}
                        className="bg-[#008E96]/5 flex-row justify-between items-center border-b border-gray-50"
                      >
                        <View style={{ gap: wp('2%') }} className="flex-row items-center">
                          <Ionicons name="business" size={wp('4%')} color="#008E96" />
                          <Text style={{ fontWeight: '700', fontSize: wp('3.5%'), maxWidth: wp('50%') }} className="text-[#101828]" numberOfLines={1}>
                            {pt.details?.label || pt.details?.name || 'Property Group'}
                          </Text>
                          <View style={{ paddingHorizontal: wp('2%'), paddingVertical: hp('0.3%') }} className="bg-[#E6F7F6] border border-[#008E96]/20 rounded-full">
                            <Text style={{ fontWeight: '700', fontSize: wp('2.7%') }} className="text-[#008E96]">
                              {ptTotalUnits} Units
                            </Text>
                          </View>
                        </View>
                        <Ionicons
                          name={isExpanded ? 'chevron-up' : 'chevron-down'}
                          size={wp('4.5%')}
                          color="#6B7280"
                        />
                      </TouchableOpacity>

                      {isExpanded && (
                        <View style={{ padding: wp('4%') }}>
                          {/* Horizontal tabs */}
                          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingBottom: hp('1.2%'), marginBottom: hp('1.8%') }} className="flex-row border-b border-gray-100">
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
                                  style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('0.7%'), borderRadius: wp('2%'), marginRight: wp('2%'), gap: wp('1.5%') }}
                                  className={`border flex-row items-center ${isActive ? 'bg-[#008E96] border-[#008E96]' : 'bg-white border-gray-200'
                                    }`}
                                >
                                  <Text
                                    style={{ fontFamily: isActive ? 'Inter-SemiBold' : 'Inter-Medium', fontSize: wp('3.2%') }}
                                    className={`${isActive ? 'text-white' : 'text-gray-500'}`}
                                  >
                                    {subPt.label || subPt.name}
                                  </Text>
                                  <View style={{ paddingHorizontal: wp('1.5%'), paddingVertical: hp('0.25%') }} className={`rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                                    <Text
                                      style={{ fontWeight: '700', fontSize: wp('2.4%') }}
                                      className={`${isActive ? 'text-white' : 'text-gray-600'}`}
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
                            <View style={{ paddingVertical: hp('2.5%') }} className="items-center">
                              <Text style={{ fontWeight: '500', fontSize: wp('3.2%') }} className="text-gray-400">
                                Select a sub-category tab above to view specification rows.
                              </Text>
                            </View>
                          ) : (
                            activeSummaries.map(summaryGroup => {
                              const totalQty = summaryGroup.summaries?.reduce((sum, r) => sum + (r.quantity || 0), 0) || 0;

                              return (
                                <View key={summaryGroup._id} style={{ marginBottom: hp('1.8%') }}>
                                  {summaryGroup.summaries?.map((row, rIdx) => {
                                    const structText = row.structure?.id
                                      ? `${row.structure.value} ${row.structure.id?.name || row.structure.id?.label || ''}`
                                      : null;

                                    return (
                                      <View key={row._id || rIdx} style={{ padding: wp('3%'), borderRadius: wp('3%'), marginBottom: hp('1.2%') }} className="border border-gray-100 bg-gray-50/50">
                                        <View style={{ marginBottom: hp('0.8%') }} className="flex-row justify-between items-start">
                                          <View style={{ gap: wp('1.5%') }} className="flex-row items-center">
                                            <View style={{ width: wp('5%'), height: wp('5%') }} className="rounded-full bg-gray-200 items-center justify-center">
                                              <Text style={{ fontWeight: '700', fontSize: wp('2.7%') }} className="text-gray-600">
                                                {rIdx + 1}
                                              </Text>
                                            </View>
                                            <Text style={{ fontWeight: '700', fontSize: wp('3.5%') }} className="text-[#101828]">
                                              {structText || row.propertyItem?.label || row.propertyItem?.name || 'Specification'}
                                            </Text>
                                            {structText && row.propertyItem && (
                                              <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-gray-400">
                                                ({row.propertyItem?.label})
                                              </Text>
                                            )}
                                          </View>
                                          <Text style={{ fontWeight: '700', fontSize: wp('3.5%') }} className="text-[#008E96]">
                                            {row.price ? `₹${row.price.toLocaleString('en-IN')}` : 'Price on Request'}
                                          </Text>
                                        </View>

                                        <View className="flex-row justify-between items-center">
                                          <View style={{ gap: wp('4%') }} className="flex-row items-center">
                                            <View style={{ gap: wp('1%') }} className="flex-row items-center">
                                              <Ionicons name="expand-outline" size={wp('3.5%')} color="#6B7280" />
                                              <Text style={{ fontWeight: '500', fontSize: wp('3.2%') }} className="text-gray-500">
                                                {row.area} {row.areaUnit?.label || 'Sq. Ft.'}
                                              </Text>
                                            </View>
                                            <View style={{ gap: wp('1%') }} className="flex-row items-center">
                                              <Ionicons name="grid-outline" size={wp('3.5%')} color="#6B7280" />
                                              <Text style={{ fontWeight: '500', fontSize: wp('3.2%') }} className="text-gray-500">
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
                                                  style={{ width: wp('7%'), height: wp('7%'), borderRadius: wp('1%'), marginLeft: wp('1%') }}
                                                  className="border border-gray-200 overflow-hidden"
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
                                    <View style={{ padding: wp('3%'), borderRadius: wp('3%'), marginBottom: hp('1.2%') }} className="bg-teal-50/40 border border-teal-100/50">
                                      <Text style={{ fontWeight: '700', fontSize: wp('2.7%'), marginBottom: hp('0.7%'), letterSpacing: 1.5 }} className="text-teal-800 uppercase">
                                        Included Amenities
                                      </Text>
                                      <View style={{ gap: wp('1.5%') }} className="flex-row flex-wrap">
                                        {summaryGroup.amenities.map(am => (
                                          <View
                                            key={am._id || am}
                                            style={{ paddingHorizontal: wp('2%'), paddingVertical: hp('0.3%'), borderRadius: wp('1%') }}
                                            className="bg-white border border-teal-100 shadow-sm"
                                          >
                                            <Text style={{ fontWeight: '500', fontSize: wp('2.7%') }} className="text-teal-700">
                                              {am.label || am.name || 'Amenity'}
                                            </Text>
                                          </View>
                                        ))}
                                      </View>
                                    </View>
                                  )}

                                  {/* Delete specification row group card */}
                                  <View style={{ paddingHorizontal: wp('4%'), paddingVertical: hp('1.2%'), borderRadius: wp('3%') }} className="flex-row justify-between items-center bg-gray-50 border border-gray-100">
                                    <View style={{ gap: wp('1.5%') }} className="flex-row items-center">
                                      <Text style={{ fontWeight: '700', fontSize: wp('3.2%') }} className="text-gray-700">
                                        Group Total:
                                      </Text>
                                      <Text style={{ fontWeight: '700', fontSize: wp('3.2%') }} className="text-[#101828]">
                                        {totalQty} Units
                                      </Text>
                                    </View>
                                    <TouchableOpacity
                                      onPress={() => handleDeleteSummary(summaryGroup._id)}
                                      style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('0.7%'), borderRadius: wp('2%') }}
                                      className="flex-row items-center bg-red-50 border border-red-100"
                                    >
                                      <Ionicons name="trash-outline" size={wp('3.5%')} color="#EF4444" />
                                      <Text style={{ fontWeight: '600', fontSize: wp('3.2%'), marginLeft: wp('1%') }} className="text-[#EF4444]">
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
          <View style={{ padding: wp('4%') }} className="flex-1 bg-black/90 justify-center items-center">
            <TouchableOpacity
              onPress={() => setLightboxImage(null)}
              style={{ top: hp('5%'), right: wp('5%'), width: wp('10%'), height: wp('10%') }}
              className="absolute rounded-full bg-white/20 items-center justify-center z-50"
            >
              <Ionicons name="close" size={wp('6%')} color="white" />
            </TouchableOpacity>
            <Image
              source={{ uri: lightboxImage }}
              style={{ width: wp('92%'), height: hp('70%') }}
              resizeMode="contain"
            />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}
