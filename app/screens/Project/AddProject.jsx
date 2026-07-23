import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import api from '../../api';
import { useLookup } from '../../../hooks/useLookup';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from '../../../components/Toast';

// ─── Fallback Constants ───────────────────────────────────────────────────────

const FALLBACK_UNITS = [
  { label: 'Sq.ft', value: 'Sq.ft' },
  { label: 'Sq.mt', value: 'Sq.mt' },
  { label: 'Yards', value: 'Yards' },
  { label: 'Acres', value: 'Acres' },
];

const STEPS = [
  { id: 1, title: 'Project Details', icon: 'business' },
  { id: 2, title: 'Schedule & Area', icon: 'event' },
  { id: 3, title: 'Location', icon: 'location-on' },
  { id: 4, title: 'Media', icon: 'perm-media' },
  { id: 5, title: 'Review', icon: 'check-circle' },
];

const EMPTY_FORM = {
  // Step 1 — Project Details
  projectName: '',
  possessionStatus: '',
  description: '',
  gatedCommunity: false,
  reraApproved: false,
  reraNumber: '',
  // Step 2 — Schedule & Area & Pricing
  startDate: '',
  completionDate: '',
  totalArea: '',
  areaUnit: '',
  avgPriceRate: '',
  priceRateUnit: '',
  // Step 3 — Location
  country: '',
  countryName: '',
  state: '',
  stateName: '',
  city: '',
  cityName: '',
  addressLine1: '',
  addressLine2: '',
  // Step 4 — Media
  media: [],       // [{ uri, name, type }]
  // Step 5 — Review (read-only)
};

// ─── Helper Components ────────────────────────────────────────────────────────

const SectionLabel = ({ children, required }) => (
  <Text style={{ fontWeight: '600', color: '#374151', fontSize: wp('3.5%'), marginBottom: hp('0.7%') }}>
    {children}
    {required ? <Text style={{ color: '#EF4444' }}> *</Text> : null}
  </Text>
);

const StyledInput = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  icon,
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: multiline ? 'flex-start' : 'center',
      borderWidth: 1.5,
      borderColor: '#E5E7EB',
      borderRadius: wp('3.2%'),
      backgroundColor: '#F9FAFB',
      paddingHorizontal: wp('3.7%'),
      paddingVertical: multiline ? hp('1.5%') : 0,
      marginBottom: hp('1.7%'),
    }}
  >
    {icon && (
      <MaterialIcons
        name={icon}
        size={wp('4.8%')}
        color="#9CA3AF"
        style={{ marginRight: wp('2.1%'), marginTop: multiline ? hp('0.25%') : 0 }}
      />
    )}
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      style={{
        flex: 1,
        fontWeight: '400',
        fontSize: wp('3.7%'),
        color: '#111827',
        minHeight: multiline ? hp('11%') : hp('6%'),
        textAlignVertical: multiline ? 'top' : 'center',
      }}
    />
  </View>
);

// Chip selector — options = [{ label, value }]
const ChipSelector = ({ options, selected, onSelect }) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: wp('2.1%'), marginBottom: hp('1.7%') }}>
    {options.map((opt) => {
      const isActive = selected === opt.value;
      return (
        <TouchableOpacity
          key={opt.value}
          onPress={() => onSelect(opt.value)}
          style={{
            paddingHorizontal: wp('3.7%'),
            paddingVertical: hp('1%'),
            borderRadius: wp('5.3%'),
            borderWidth: 1.5,
            borderColor: isActive ? '#008E96' : '#E5E7EB',
            backgroundColor: isActive ? '#E6F7F6' : '#FFFFFF',
          }}
        >
          <Text
            style={{
              fontFamily: isActive ? 'Inter-SemiBold' : 'Inter-Regular',
              color: isActive ? '#008E96' : '#6B7280',
              fontSize: wp('3.5%'),
            }}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// Checkbox item — matches the design (checkbox next to label)
const CheckboxItem = ({ label, checked, onToggle }) => (
  <TouchableOpacity
    onPress={onToggle}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp('3.7%'),
      paddingVertical: hp('1.5%'),
      borderRadius: wp('3.2%'),
      borderWidth: 1.5,
      borderColor: checked ? '#008E96' : '#E5E7EB',
      backgroundColor: checked ? '#E6F7F6' : '#FFFFFF',
      flex: 1,
      gap: wp('2.7%'),
    }}
    activeOpacity={0.7}
  >
    <View
      style={{
        width: wp('5.3%'),
        height: wp('5.3%'),
        borderRadius: wp('1.3%'),
        borderWidth: 2,
        borderColor: checked ? '#008E96' : '#D1D5DB',
        backgroundColor: checked ? '#008E96' : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {checked && <MaterialIcons name="check" size={wp('3.5%')} color="white" />}
    </View>
    <Text
      style={{
        fontFamily: checked ? 'Inter-SemiBold' : 'Inter-Regular',
        fontSize: wp('3.5%'),
        color: checked ? '#008E96' : '#374151',
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

// DateInput component — acts like StyledInput but is touchable to trigger picker
const DateInput = ({ placeholder, value, onPress, icon }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: '#E5E7EB',
      borderRadius: wp('3.2%'),
      backgroundColor: '#F9FAFB',
      paddingHorizontal: wp('3.7%'),
      height: hp('6%'),
      marginBottom: hp('1.7%'),
    }}
    activeOpacity={0.7}
  >
    {icon && (
      <MaterialIcons
        name={icon}
        size={wp('4.8%')}
        color="#9CA3AF"
        style={{ marginRight: wp('2.1%') }}
      />
    )}
    <Text
      style={{
        flex: 1,
        fontWeight: '400',
        fontSize: wp('3.7%'),
        color: value ? '#111827' : '#9CA3AF',
      }}
    >
      {value || placeholder}
    </Text>
  </TouchableOpacity>
);

// SelectModal component for dynamic search/pick sheet
const SelectModal = ({ visible, onClose, title, options = [], onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredOptions = options.filter(o => 
    (o.label || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: wp('6.4%'), borderTopRightRadius: wp('6.4%'), height: '60%', padding: wp('5.3%') }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('2%') }}>
            <Text style={{ fontWeight: '700', fontSize: wp('4.3%'), color: '#111827' }}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={wp('6.4%')} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#9CA3AF"
            style={{
              height: hp('5.5%'),
              borderWidth: 1.5,
              borderColor: '#E5E7EB',
              borderRadius: wp('2.7%'),
              paddingHorizontal: wp('3.2%'),
              fontWeight: '400',
              fontSize: wp('3.7%'),
              marginBottom: hp('2%'),
              backgroundColor: '#F9FAFB',
            }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {filteredOptions.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => {
                  onSelect(opt.value, opt.label);
                  setSearchQuery('');
                  onClose();
                }}
                style={{
                  paddingVertical: hp('1.7%'),
                  borderBottomWidth: 1,
                  borderBottomColor: '#F3F4F6',
                }}
              >
                <Text style={{ fontWeight: '500', fontSize: wp('3.7%'), color: '#374151' }}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
            {filteredOptions.length === 0 && (
              <Text style={{ textAlign: 'center', color: '#9CA3AF', marginTop: hp('2.5%'), fontWeight: '400' }}>No results found</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Section card with icon header — used inside each step
const SectionCard = ({ title, icon, children }) => (
  <View
    style={{
      backgroundColor: '#FFFFFF',
      borderRadius: wp('4.3%'),
      borderWidth: 1,
      borderColor: '#E5E7EB',
      padding: wp('4.3%'),
      marginBottom: hp('2%'),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp('2.7%'), marginBottom: hp('1.7%') }}>
      <View
        style={{
          width: wp('9.1%'),
          height: wp('9.1%'),
          borderRadius: wp('2.7%'),
          backgroundColor: '#E6F7F6',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name={icon} size={wp('4.8%')} color="#008E96" />
      </View>
      <Text style={{ fontWeight: '700', fontSize: wp('4%'), color: '#111827' }}>{title}</Text>
    </View>
    {children}
  </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const AddProject = () => {
  const params = useLocalSearchParams();
  const editProjectId = params.projectId;

  const [currentStep, setCurrentStep] = useState(1);
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };
  const [form, setForm] = useState(EMPTY_FORM);
  const [deletedMediaIds, setDeletedMediaIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef(null);

  // Date picker visibility states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showCompletionDatePicker, setShowCompletionDatePicker] = useState(false);

  // Geographical Lists & Dropdowns
  const [countries, setCountries] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

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
    if (params.project) {
      try {
        const projectData = JSON.parse(params.project);
        
        const initialForm = {
          projectName: projectData.projectName || projectData.title || '',
          possessionStatus: projectData.possessionStatus?._id || projectData.possessionStatus || '',
          description: projectData.description || '',
          gatedCommunity: !!projectData.isGated,
          reraApproved: !!projectData.isReraApproved,
          reraNumber: projectData.reraNumber || '',
          
          startDate: projectData.startDate || '',
          completionDate: projectData.completionDate || '',
          totalArea: projectData.area ? String(projectData.area) : '',
          areaUnit: projectData.areaUnit?._id || projectData.areaUnit || '',
          avgPriceRate: projectData.avgPriceRate ? String(projectData.avgPriceRate) : '',
          priceRateUnit: projectData.avgPriceUnit?._id || projectData.avgPriceUnit || '',
          
          country: projectData.country?._id || projectData.country || '',
          countryName: projectData.country?.name || (typeof projectData.country === 'string' ? '' : (projectData.country?.label || '')),
          state: projectData.state?._id || projectData.state || '',
          stateName: projectData.state?.name || (typeof projectData.state === 'string' ? '' : (projectData.state?.label || '')),
          city: projectData.city?._id || projectData.city || '',
          cityName: projectData.city?.name || (typeof projectData.city === 'string' ? projectData.city : (projectData.city?.label || '')),
          addressLine1: projectData.addressLine1 || '',
          addressLine2: projectData.addressLine2 || '',
          
          media: Array.isArray(projectData.media) 
            ? projectData.media.map(m => ({
                uri: m.fileUrl,
                name: m.fileName || m.fileUrl.split('/').pop(),
                type: 'image',
                label: m.label || 'Other',
                isExisting: true,
                _id: m._id || m.id
              }))
            : (Array.isArray(projectData.images)
                ? projectData.images.map((img, idx) => ({
                    uri: img,
                    name: `image_${idx}.jpg`,
                    type: 'image',
                    label: 'Other',
                    isExisting: true
                  }))
                : [])
        };

        setForm(initialForm);
        
        if (projectData.country?._id || projectData.country) {
          fetchStates(projectData.country?._id || projectData.country);
        }
        if (projectData.state?._id || projectData.state) {
          fetchCities(projectData.state?._id || projectData.state);
        }
      } catch (err) {
        console.error("Failed to parse project data for editing:", err);
      }
    }
  }, [params.project]);

  // ─── API Lookups ────────────────────────────────────────────────────────────
  const {
    possessionStatus: apiPossessionStatus,
    measurementUnits: apiMeasurementUnits,
    fetchSingleLookup,
    loading: lookupLoading,
  } = useLookup();

  useEffect(() => {
    fetchSingleLookup('possessionStatus');
    fetchSingleLookup('measurementUnits');
  }, [fetchSingleLookup]);

  // Normalised option arrays
  const possessionStatusOptions =
    apiPossessionStatus && apiPossessionStatus.length > 0
      ? apiPossessionStatus.map((p) => ({ label: p.label || p.name, value: p._id }))
      : [];

  const unitOptions =
    apiMeasurementUnits && apiMeasurementUnits.length > 0
      ? apiMeasurementUnits.map((u) => ({ label: u.label || u.name, value: u._id }))
      : [];


  // ─── Form Helpers ───────────────────────────────────────────────────────────
  const update = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Pick images from library
  const pickImages = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      orderedSelection: true,
      base64: true,
    });
    if (!result.canceled && result.assets) {
      const newFiles = result.assets.map((a) => ({
        uri: a.uri,
        name: a.fileName || `image_${Date.now()}.jpg`,
        type: 'image',
        mimeType: a.mimeType || 'image/jpeg',
        base64: a.base64,
        label: '',
      }));
      setForm((prev) => ({ ...prev, media: [...prev.media, ...newFiles] }));
    }
  }, []);

  const removeMedia = useCallback((uri) => {
    setForm((prev) => {
      const target = prev.media.find((m) => m.uri === uri);
      if (target && target.isExisting && target._id) {
        setDeletedMediaIds(prevIds => [...prevIds, target._id]);
      }
      return { ...prev, media: prev.media.filter((m) => m.uri !== uri) };
    });
  }, []);

  const updateMediaLabel = useCallback((uri, label) => {
    setForm((prev) => ({
      ...prev,
      media: prev.media.map((m) => (m.uri === uri ? { ...m, label } : m)),
    }));
  }, []);

  const parseDate = (str) => {
    if (!str) return new Date();
    const d = new Date(str);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const renderDatePicker = (field, show, setShow) => {
    if (!show) return null;

    const onChange = (event, selectedDate) => {
      if (Platform.OS === 'android') {
        setShow(false);
      }
      if (selectedDate) {
        const yyyy = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const dd = String(selectedDate.getDate()).padStart(2, '0');
        update(field, `${yyyy}-${mm}-${dd}`);
      }
    };

    if (Platform.OS === 'ios') {
      return (
        <View style={{ backgroundColor: '#FFFFFF', padding: wp('2.7%'), borderRadius: wp('3.2%'), borderWidth: 1, borderColor: '#E5E7EB', marginBottom: hp('1.7%') }}>
          <DateTimePicker
            value={parseDate(form[field])}
            mode="date"
            display="spinner"
            onChange={onChange}
          />
          <TouchableOpacity
            onPress={() => setShow(false)}
            style={{
              backgroundColor: '#008E96',
              padding: wp('2.7%'),
              borderRadius: wp('2.1%'),
              alignItems: 'center',
              marginTop: hp('1.2%'),
            }}
          >
            <Text style={{ fontWeight: '600', color: '#FFFFFF', fontSize: wp('3.7%') }}>Done</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <DateTimePicker
        value={parseDate(form[field])}
        mode="date"
        display="default"
        onChange={onChange}
      />
    );
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  // ─── Step Validators ────────────────────────────────────────────────────────
  const step1Valid =
    form.projectName.trim().length >= 3 &&
    !!form.possessionStatus &&
    (!form.reraApproved || form.reraNumber.trim().length > 0);
  const step2Valid = form.startDate.trim().length > 0 && form.completionDate.trim().length > 0;
  const step3Valid = form.country.trim().length > 0 && form.state.trim().length > 0 && form.city.trim().length > 0 && form.addressLine1.trim().length > 0;
  const step4Valid = true; // media optional

  const canProceed = () => {
    if (currentStep === 1) return step1Valid;
    if (currentStep === 2) return step2Valid;
    if (currentStep === 3) return step3Valid;
    if (currentStep === 4) return step4Valid;
    return true;
  };

  // ─── Navigation ─────────────────────────────────────────────────────────────
  const goNext = () => {
    if (!canProceed()) {
      Alert.alert('Incomplete', 'Please fill all required fields before continuing.');
      return;
    }
    if (currentStep < STEPS.length) {
      setCurrentStep((s) => s + 1);
      scrollToTop();
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      scrollToTop();
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/screens/Project/MyProjects');
      }
    }
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const userStr = await SecureStore.getItemAsync('userData');
      const user = userStr ? JSON.parse(userStr) : null;
      const developerId = user?._id || user?.id;

      const payload = {
        projectName: form.projectName.trim(),
        possessionStatus: form.possessionStatus || undefined,
        description: form.description.trim() || undefined,
        startDate: form.startDate.trim() || undefined,
        completionDate: form.completionDate.trim() || undefined,
        area: form.totalArea ? parseFloat(form.totalArea) : undefined,
        areaUnit: form.areaUnit || undefined,
        avgPriceRate: form.avgPriceRate ? parseFloat(form.avgPriceRate) : undefined,
        avgPriceUnit: form.priceRateUnit || undefined,
        country: form.country.trim() || undefined,
        state: form.state.trim() || undefined,
        city: form.city.trim() || undefined,
        addressLine1: form.addressLine1.trim() || undefined,
        addressLine2: form.addressLine2.trim() || undefined,
        isGated: form.gatedCommunity,
        isReraApproved: form.reraApproved,
        reraNumber: form.reraApproved ? form.reraNumber.trim() : undefined,
        developer: developerId,
      };

      const response = editProjectId
        ? await api.put(`/projects/${editProjectId}`, payload)
        : await api.post('/projects', payload);

      if (response.data?.success) {
        const projectId = editProjectId || response.data?.data?._id || response.data?.data?.id || response.data?.project?._id || response.data?.project?.id;

        if (editProjectId && deletedMediaIds.length > 0) {
          for (const mediaId of deletedMediaIds) {
            try {
              await api.delete(`/projects/${editProjectId}/media/${mediaId}`);
            } catch (delErr) {
              console.error('Failed to delete media item:', mediaId, delErr);
            }
          }
        }

        if (projectId && form.media && form.media.length > 0) {
          for (const file of form.media) {
            if (file.isExisting) continue;

            const fileUrl = file.base64 ? `data:${file.mimeType || 'image/jpeg'};base64,${file.base64}` : file.uri;
            
            const mediaPayload = {
              mediaType: 'project_pic',
              label: file.label ? file.label.trim() : 'Other',
              fileName: file.name,
              fileUrl: fileUrl,
            };

            try {
              await api.post(`/projects/${projectId}/media`, mediaPayload);
            } catch (uploadErr) {
              console.error('Failed to upload file:', file.name, uploadErr);
            }
          }
        }

        Alert.alert(
          editProjectId ? '🎉 Project Updated!' : '🎉 Project Listed!',
          editProjectId
            ? `"${form.projectName}" has been successfully updated.`
            : `"${form.projectName}" has been successfully added to your project portfolio.`,
          [
            {
              text: 'View Projects',
              onPress: () => router.replace('/screens/Project/MyProjects'),
            },
          ]
        );
      } else {
        throw new Error(response.data?.message || (editProjectId ? 'Failed to update project' : 'Failed to create project'));
      }
    } catch (err) {
      const errData = err?.response?.data;
      const msg =
        errData?.error ||
        errData?.message ||
        (Array.isArray(errData?.errors)
          ? errData.errors.map((e) => (typeof e === 'string' ? e : e.msg || e.message || JSON.stringify(e))).join(', ')
          : null) ||
        err?.message ||
        'Something went wrong.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Progress Bar ────────────────────────────────────────────────────────────
  const renderProgressBar = () => (
    <View style={{ paddingHorizontal: wp('5.3%'), paddingTop: hp('2.5%'), paddingBottom: hp('1%') }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {STEPS.map((step, idx) => {
          const isDone = currentStep > step.id;
          const isActive = currentStep === step.id;
          return (
            <View key={step.id} style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                {idx > 0 && (
                  <View
                    style={{
                      flex: 1,
                      height: hp('0.25%'),
                      backgroundColor: isDone || isActive ? '#008E96' : '#E5E7EB',
                      borderRadius: wp('0.25%'),
                    }}
                  />
                )}
                <View
                  style={{
                    width: wp('8%'),
                    height: wp('8%'),
                    borderRadius: wp('4%'),
                    backgroundColor: isDone ? '#008E96' : isActive ? '#008E96' : '#E5E7EB',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: isActive ? '#008E96' : 'transparent',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.4,
                    shadowRadius: 4,
                    elevation: isActive ? 4 : 0,
                  }}
                >
                  {isDone ? (
                    <MaterialIcons name="check" size={wp('4%')} color="white" />
                  ) : (
                    <MaterialIcons name={step.icon} size={wp('3.5%')} color={isActive ? 'white' : '#9CA3AF'} />
                  )}
                </View>
                {idx < STEPS.length - 1 && (
                  <View
                    style={{
                      flex: 1,
                      height: hp('0.25%'),
                      backgroundColor: isDone ? '#008E96' : '#E5E7EB',
                      borderRadius: wp('0.25%'),
                    }}
                  />
                )}
              </View>
              <Text
                style={{
                  fontFamily: isActive ? 'Inter-SemiBold' : 'Inter-Regular',
                  fontSize: wp('2.4%'),
                  color: isActive ? '#008E96' : isDone ? '#059669' : '#9CA3AF',
                  marginTop: hp('0.5%'),
                  textAlign: 'center',
                }}
              >
                {step.title}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  // ─── Step 1: Project Details ─────────────────────────────────────────────────
  const renderStep1 = () => (
    <View>
      <Text style={{ fontWeight: '700', fontSize: wp('5.3%'), color: '#111827', marginBottom: hp('0.5%') }}>
        Create New Project
      </Text>
      <Text style={{ fontWeight: '400', fontSize: wp('3.5%'), color: '#6B7280', marginBottom: hp('2.5%') }}>
        Enter the project name, possession status, and description below.
      </Text>

      <SectionCard title="Project Details" icon="business">
        <SectionLabel required>Project Name</SectionLabel>
        <StyledInput
          placeholder="e.g. Skyline Residences"
          value={form.projectName}
          onChangeText={(v) => update('projectName', v)}
          icon="business"
        />

        <SectionLabel required>Possession Status</SectionLabel>
        {lookupLoading && !(apiPossessionStatus && apiPossessionStatus.length > 0) ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp('2.1%'), marginBottom: hp('1.7%') }}>
            <ActivityIndicator size="small" color="#008E96" />
            <Text style={{ fontWeight: '400', fontSize: wp('3.5%'), color: '#9CA3AF' }}>Loading...</Text>
          </View>
        ) : (
          <ChipSelector
            options={possessionStatusOptions}
            selected={form.possessionStatus}
            onSelect={(v) => update('possessionStatus', v)}
          />
        )}

        <SectionLabel>Project Description</SectionLabel>
        <StyledInput
          placeholder="Describe the project vision, amenities, and neighborhood benefits."
          value={form.description}
          onChangeText={(v) => update('description', v)}
          multiline
          numberOfLines={4}
          icon="notes"
        />

        {/* Checkboxes */}
        <View style={{ flexDirection: 'row', gap: wp('2.7%'), flexWrap: 'wrap', marginTop: hp('0.25%') }}>
          <CheckboxItem
            label="Gated Community"
            checked={form.gatedCommunity}
            onToggle={() => update('gatedCommunity', !form.gatedCommunity)}
          />
          <CheckboxItem
            label="RERA Approved"
            checked={form.reraApproved}
            onToggle={() => update('reraApproved', !form.reraApproved)}
          />
        </View>

        {form.reraApproved && (
          <View style={{ marginTop: hp('1.7%') }}>
            <SectionLabel required>RERA Number</SectionLabel>
            <StyledInput
              placeholder="e.g. XRFDD-dfg-IJHGB"
              value={form.reraNumber}
              onChangeText={(v) => update('reraNumber', v)}
              icon="verified"
            />
          </View>
        )}
      </SectionCard>
    </View>
  );

  // ─── Step 2: Schedule & Approvals + Area & Pricing ──────────────────────────
  const renderStep2 = () => (
    <View>
      <Text style={{ fontWeight: '700', fontSize: wp('5.3%'), color: '#111827', marginBottom: hp('0.5%') }}>
        Schedule & Area
      </Text>
      <Text style={{ fontWeight: '400', fontSize: wp('3.5%'), color: '#6B7280', marginBottom: hp('2.5%') }}>
        Timeline, legal approvals, and space metrics.
      </Text>

      {/* Schedule & Approvals */}
      <SectionCard title="Schedule & Approvals" icon="event-note">
        <Text style={{ fontWeight: '400', fontSize: wp('3.2%'), color: '#6B7280', marginBottom: hp('1.7%') }}>
          Timeline and legal approvals.
        </Text>

        <SectionLabel required>Start Date</SectionLabel>
        <DateInput
          placeholder="Select start date"
          value={form.startDate}
          onPress={() => setShowStartDatePicker(true)}
          icon="event"
        />
        {renderDatePicker('startDate', showStartDatePicker, setShowStartDatePicker)}

        <SectionLabel required>Completion Date</SectionLabel>
        <DateInput
          placeholder="Select completion date"
          value={form.completionDate}
          onPress={() => setShowCompletionDatePicker(true)}
          icon="event-available"
        />
        {renderDatePicker('completionDate', showCompletionDatePicker, setShowCompletionDatePicker)}
      </SectionCard>

      {/* Area & Pricing */}
      <SectionCard title="Area & Pricing" icon="straighten">
        <Text style={{ fontWeight: '400', fontSize: wp('3.2%'), color: '#6B7280', marginBottom: hp('1.7%') }}>
          Space metrics and price rates.
        </Text>

        <View style={{ flexDirection: 'row', gap: wp('2.7%') }}>
          <View style={{ flex: 1 }}>
            <SectionLabel required>Total Area</SectionLabel>
            <StyledInput
              placeholder="1650"
              value={form.totalArea}
              onChangeText={(v) => update('totalArea', v)}
              keyboardType="decimal-pad"
              icon="crop-square"
            />
          </View>
          <View style={{ flex: 1 }}>
            <SectionLabel required>Unit</SectionLabel>
            <ChipSelector
              options={unitOptions}
              selected={form.areaUnit}
              onSelect={(v) => update('areaUnit', v)}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: wp('2.7%') }}>
          <View style={{ flex: 1 }}>
            <SectionLabel required>Avg Price Rate</SectionLabel>
            <StyledInput
              placeholder="4500"
              value={form.avgPriceRate}
              onChangeText={(v) => update('avgPriceRate', v)}
              keyboardType="decimal-pad"
              icon="currency-rupee"
            />
          </View>
          <View style={{ flex: 1 }}>
            <SectionLabel required>Rate Unit</SectionLabel>
            <ChipSelector
              options={unitOptions}
              selected={form.priceRateUnit}
              onSelect={(v) => update('priceRateUnit', v)}
            />
          </View>
        </View>
      </SectionCard>
    </View>
  );

  // ─── Step 3: Location Details ────────────────────────────────────────────────
  const renderStep3 = () => (
    <View>
      <Text style={{ fontWeight: '700', fontSize: wp('5.3%'), color: '#111827', marginBottom: hp('0.5%') }}>
        Location Details
      </Text>
      <Text style={{ fontWeight: '400', fontSize: wp('3.5%'), color: '#6B7280', marginBottom: hp('2.5%') }}>
        Exact address and locality information.
      </Text>

      <SectionCard title="Location Details" icon="location-on">
        <SectionLabel required>Country</SectionLabel>
        <DateInput
          placeholder="Select Country"
          value={form.countryName}
          onPress={() => setShowCountryDropdown(true)}
          icon="public"
        />

        <SectionLabel required>State</SectionLabel>
        <DateInput
          placeholder={form.country ? "Select State" : "Select country first"}
          value={form.stateName}
          onPress={() => form.country && setShowStateDropdown(true)}
          icon="map"
        />

        <SectionLabel required>City</SectionLabel>
        <DateInput
          placeholder={form.state ? "Select City" : "Select state first"}
          value={form.cityName}
          onPress={() => form.state && setShowCityDropdown(true)}
          icon="location-city"
        />

        <SectionLabel required>Address Line 1</SectionLabel>
        <StyledInput
          placeholder="e.g. House number, building, street"
          value={form.addressLine1}
          onChangeText={(v) => update('addressLine1', v)}
          icon="place"
        />

        <SectionLabel>Address Line 2</SectionLabel>
        <StyledInput
          placeholder="e.g. Locality, landmark, neighborhood"
          value={form.addressLine2}
          onChangeText={(v) => update('addressLine2', v)}
          icon="near-me"
        />
      </SectionCard>
    </View>
  );

  // ─── Step 4: Project Media ────────────────────────────────────────────────────
  const renderStep4 = () => (
    <View>
      <Text style={{ fontWeight: '700', fontSize: wp('5.3%'), color: '#111827', marginBottom: hp('0.5%') }}>
        Project Media
      </Text>
      <Text style={{ fontWeight: '400', fontSize: wp('3.5%'), color: '#6B7280', marginBottom: hp('2.5%') }}>
        Upload images, brochures, or documents.
      </Text>

      <SectionCard title="Project Media" icon="perm-media">
        {/* Upload button */}
        <TouchableOpacity
          onPress={pickImages}
          style={{
            borderWidth: 1.5,
            borderStyle: 'dashed',
            borderColor: '#008E96',
            borderRadius: wp('3.7%'),
            paddingVertical: hp('3.5%'),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F0FFFE',
            marginBottom: hp('2%'),
            gap: hp('1%'),
          }}
        >
          <View
            style={{
              width: wp('12.8%'),
              height: wp('12.8%'),
              borderRadius: wp('6.4%'),
              backgroundColor: '#E6F7F6',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: hp('0.5%'),
            }}
          >
            <MaterialIcons name="cloud-upload" size={wp('6.9%')} color="#008E96" />
          </View>
          <Text style={{ fontWeight: '600', fontSize: wp('3.7%'), color: '#008E96' }}>
            Tap to Upload Images
          </Text>
          <Text style={{ fontWeight: '400', fontSize: wp('3.2%'), color: '#9CA3AF' }}>
            JPG, PNG • Multiple selection supported
          </Text>
        </TouchableOpacity>

        {/* Selected images list with labels */}
        {form.media.length > 0 && (
          <View style={{ marginBottom: hp('1.2%') }}>
            <Text style={{ fontWeight: '600', fontSize: wp('3.5%'), color: '#374151', marginBottom: hp('1.2%') }}>
              Selected ({form.media.length})
            </Text>
            {form.media.map((item) => (
              <View
                key={item.uri}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#F9FAFB',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: wp('3.2%'),
                  padding: wp('2.7%'),
                  marginBottom: hp('1.2%'),
                  gap: wp('3.2%'),
                }}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={{ width: wp('16%'), height: wp('16%'), borderRadius: wp('2.1%') }}
                  resizeMode="cover"
                />
                
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', fontSize: wp('3.5%'), color: '#374151' }} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {/* Label input field */}
                  <TextInput
                    placeholder="e.g. Logo, Cover, Floor Plan"
                    placeholderTextColor="#9CA3AF"
                    value={item.label}
                    onChangeText={(text) => updateMediaLabel(item.uri, text)}
                    style={{
                      height: hp('4.5%'),
                      borderWidth: 1,
                      borderColor: '#D1D5DB',
                      borderRadius: wp('2.1%'),
                      paddingHorizontal: wp('2.7%'),
                      fontWeight: '400',
                      fontSize: wp('3.2%'),
                      marginTop: hp('0.7%'),
                      backgroundColor: '#FFFFFF',
                      color: '#374151',
                    }}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => removeMedia(item.uri)}
                  style={{
                    width: wp('7.5%'),
                    height: wp('7.5%'),
                    borderRadius: wp('3.7%'),
                    backgroundColor: '#FEE2E2',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MaterialIcons name="delete" size={wp('4.3%')} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Tip */}
        <View
          style={{
            backgroundColor: '#EFF6FF',
            borderRadius: wp('2.7%'),
            padding: wp('3.2%'),
            marginTop: hp('1.7%'),
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: wp('2.1%'),
            borderWidth: 1,
            borderColor: '#BFDBFE',
          }}
        >
          <MaterialIcons name="info" size={wp('4.3%')} color="#3B82F6" style={{ marginTop: hp('0.12%') }} />
          <Text style={{ fontWeight: '400', fontSize: wp('3.2%'), color: '#1E40AF', flex: 1, lineHeight: hp('2.2%') }}>
            Projects with high-quality images receive{' '}
            <Text style={{ fontWeight: '700' }}>2× more enquiries.</Text>{' '}
            Brochures and floor plans also help buyers decide faster.
          </Text>
        </View>
      </SectionCard>
    </View>
  );

  // ─── Step 5: Review & Submit ─────────────────────────────────────────────────
  const ReviewRow = ({ label, value }) => {
    if (!value) return null;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingVertical: hp('1.2%'),
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
          gap: wp('2.1%'),
        }}
      >
        <Text style={{ fontWeight: '500', fontSize: wp('3.5%'), color: '#6B7280', flex: 1 }}>
          {label}
        </Text>
        <Text
          style={{ fontWeight: '600', fontSize: wp('3.5%'), color: '#111827', flex: 2, textAlign: 'right' }}
          numberOfLines={3}
        >
          {value}
        </Text>
      </View>
    );
  };

  const renderStep5 = () => {
    const possessionLabel = possessionStatusOptions.find(o => o.value === form.possessionStatus)?.label || form.possessionStatus;
    const areaUnitLabel = unitOptions.find(o => o.value === form.areaUnit)?.label || form.areaUnit;
    const priceRateUnitLabel = unitOptions.find(o => o.value === form.priceRateUnit)?.label || form.priceRateUnit;

    const sections = [
      {
        title: 'Project Details',
        icon: 'business',
        step: 1,
        rows: [
          { label: 'Project Name', value: form.projectName },
          { label: 'Possession Status', value: possessionLabel },
          { label: 'Description', value: form.description },
          { label: 'Gated Community', value: form.gatedCommunity ? 'Yes' : 'No' },
          { label: 'RERA Approved', value: form.reraApproved ? 'Yes' : 'No' },
          ...(form.reraApproved ? [{ label: 'RERA Number', value: form.reraNumber }] : []),
        ],
      },
      {
        title: 'Schedule & Area',
        icon: 'event',
        step: 2,
        rows: [
          { label: 'Start Date', value: form.startDate },
          { label: 'Completion Date', value: form.completionDate },
          { label: 'Total Area', value: form.totalArea ? `${form.totalArea} ${areaUnitLabel}` : '' },
          { label: 'Avg Price Rate', value: form.avgPriceRate ? `₹${form.avgPriceRate} / ${priceRateUnitLabel}` : '' },
        ],
      },
      {
        title: 'Location',
        icon: 'location-on',
        step: 3,
        rows: [
          { label: 'Country', value: form.countryName },
          { label: 'State', value: form.stateName },
          { label: 'City', value: form.cityName },
          { label: 'Address Line 1', value: form.addressLine1 },
          { label: 'Address Line 2', value: form.addressLine2 },
        ],
      },
      {
        title: 'Media',
        icon: 'perm-media',
        step: 4,
        rows: [
          {
            label: 'Files',
            value: (() => {
              if (form.media.length === 0) return 'None';
              const counts = {};
              form.media.forEach((m) => {
                const lbl = m.label ? m.label.trim() : 'Unlabeled';
                counts[lbl] = (counts[lbl] || 0) + 1;
              });
              const summary = Object.entries(counts)
                .map(([lbl, count]) => `${count} ${lbl}`)
                .join(', ');
              return `${form.media.length} file(s) (${summary})`;
            })(),
          },
        ],
      },
    ];

    return (
      <View>
        <Text style={{ fontWeight: '700', fontSize: wp('5.3%'), color: '#111827', marginBottom: hp('0.5%') }}>
          Review & Submit
        </Text>
        <Text style={{ fontWeight: '400', fontSize: wp('3.5%'), color: '#6B7280', marginBottom: hp('2.5%') }}>
          Double-check your project details before publishing.
        </Text>

        {sections.map((section) => (
          <View
            key={section.title}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: wp('4.3%'),
              borderWidth: 1,
              borderColor: '#E5E7EB',
              padding: wp('4.3%'),
              marginBottom: hp('1.7%'),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp('2.1%'), marginBottom: hp('1%') }}>
              <View
                style={{
                  width: wp('8%'),
                  height: wp('8%'),
                  borderRadius: wp('2.1%'),
                  backgroundColor: '#E6F7F6',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name={section.icon} size={wp('4.3%')} color="#008E96" />
              </View>
              <Text style={{ fontWeight: '700', fontSize: wp('3.7%'), color: '#374151' }}>
                {section.title}
              </Text>
              <TouchableOpacity
                onPress={() => { setCurrentStep(section.step); scrollToTop(); }}
                style={{ marginLeft: 'auto' }}
              >
                <Text style={{ fontWeight: '600', fontSize: wp('3.2%'), color: '#008E96' }}>Edit</Text>
              </TouchableOpacity>
            </View>
            {section.rows.map((row) => (
              <ReviewRow key={row.label} label={row.label} value={row.value} />
            ))}
          </View>
        ))}

        <View
          style={{
            backgroundColor: '#FFFBEB',
            borderRadius: wp('3.2%'),
            padding: wp('3.7%'),
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: wp('2.7%'),
            borderWidth: 1,
            borderColor: '#FDE68A',
            marginBottom: hp('1%'),
          }}
        >
          <MaterialIcons name="warning" size={wp('4.8%')} color="#D97706" style={{ marginTop: hp('0.12%') }} />
          <Text style={{ fontWeight: '400', fontSize: wp('3.2%'), color: '#92400E', flex: 1, lineHeight: hp('2.2%') }}>
            Once submitted, your project will be reviewed by our team before appearing in search results.
          </Text>
        </View>
      </View>
    );
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  const stepContent = () => {
    if (currentStep === 1) return renderStep1();
    if (currentStep === 2) return renderStep2();
    if (currentStep === 3) return renderStep3();
    if (currentStep === 4) return renderStep4();
    return renderStep5();
  };

  const isLastStep = currentStep === STEPS.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <LinearGradient
        colors={['#006B73', '#008E96']}
        style={{
          paddingTop: Platform.OS === 'android' ? hp('6%') : hp('2%'),
          paddingBottom: hp('2.5%'),
          paddingHorizontal: wp('5.3%'),
          flexDirection: 'row',
          alignItems: 'center',
          gap: wp('3.2%'),
        }}
      >
        <TouchableOpacity
          onPress={goBack}
          style={{
            width: wp('9.6%'),
            height: wp('9.6%'),
            borderRadius: wp('4.8%'),
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="arrow-back" size={wp('5.3%')} color="white" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700', fontSize: wp('4.8%'), color: 'white' }}>
            {editProjectId ? 'Edit Project' : 'Add New Project'}
          </Text>
          <Text style={{ fontWeight: '400', fontSize: wp('3.2%'), color: 'rgba(255,255,255,0.75)', marginTop: hp('0.12%') }}>
            Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].title}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.25)',
            paddingHorizontal: wp('2.7%'),
            paddingVertical: hp('0.5%'),
            borderRadius: wp('5.3%'),
          }}
        >
          <Text style={{ fontWeight: '700', fontSize: wp('3.2%'), color: 'white' }}>
            {currentStep}/{STEPS.length}
          </Text>
        </View>
      </LinearGradient>

      {/* Progress Bar */}
      <View style={{ backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
        {renderProgressBar()}
      </View>

      {/* Form Content */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: wp('5.3%'), paddingBottom: hp('15%') }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {stepContent()}
        </ScrollView>

        {/* Select Modals */}
        <SelectModal
          visible={showCountryDropdown}
          onClose={() => setShowCountryDropdown(false)}
          title="Select Country"
          options={countries.map((c) => ({ label: c.label || c.name, value: c._id }))}
          onSelect={(val, label) => {
            update('country', val);
            update('countryName', label);
            update('state', '');
            update('stateName', '');
            update('city', '');
            update('cityName', '');
            fetchStates(val);
          }}
        />

        <SelectModal
          visible={showStateDropdown}
          onClose={() => setShowStateDropdown(false)}
          title="Select State"
          options={statesList.map((s) => ({ label: s.label || s.name, value: s._id }))}
          onSelect={(val, label) => {
            update('state', val);
            update('stateName', label);
            update('city', '');
            update('cityName', '');
            fetchCities(val);
          }}
        />

        <SelectModal
          visible={showCityDropdown}
          onClose={() => setShowCityDropdown(false)}
          title="Select City"
          options={citiesList.map((c) => ({ label: c.label || c.name, value: c._id }))}
          onSelect={(val, label) => {
            update('city', val);
            update('cityName', label);
          }}
        />

        {/* Bottom Action Bar */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            padding: wp('4.3%'),
            flexDirection: 'row',
            gap: wp('2.7%'),
          }}
        >
          {currentStep > 1 && (
            <TouchableOpacity
              onPress={goBack}
              style={{
                flex: 1,
                height: hp('6.2%'),
                borderRadius: wp('3.2%'),
                borderWidth: 1.5,
                borderColor: '#E5E7EB',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: wp('1.6%'),
              }}
            >
              <Ionicons name="arrow-back" size={wp('4.3%')} color="#6B7280" />
              <Text style={{ fontWeight: '600', color: '#6B7280', fontSize: wp('3.7%') }}>Back</Text>
            </TouchableOpacity>
          )}

          {!isLastStep ? (
            <TouchableOpacity
              onPress={goNext}
              disabled={!canProceed()}
              style={{
                flex: 2,
                height: hp('6.2%'),
                borderRadius: wp('3.2%'),
                backgroundColor: canProceed() ? '#008E96' : '#E5E7EB',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: wp('2.1%'),
                shadowColor: canProceed() ? '#008E96' : 'transparent',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: canProceed() ? 4 : 0,
              }}
            >
              <Text style={{ fontWeight: '700', color: canProceed() ? 'white' : '#9CA3AF', fontSize: wp('4%') }}>
                Continue
              </Text>
              <Ionicons name="arrow-forward" size={wp('4.3%')} color={canProceed() ? 'white' : '#9CA3AF'} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting}
              style={{
                flex: 2,
                height: hp('6.2%'),
                borderRadius: wp('3.2%'),
                backgroundColor: '#008E96',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: wp('2.1%'),
                shadowColor: '#008E96',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              {submitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <MaterialIcons name="rocket-launch" size={wp('4.8%')} color="white" />
                  <Text style={{ fontWeight: '700', color: 'white', fontSize: wp('4%') }}>
                    {editProjectId ? 'Update Project' : 'Publish Project'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
      <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />
    </SafeAreaView>
  );
};

export default AddProject;
