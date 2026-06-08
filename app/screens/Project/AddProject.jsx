import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../api';
import { useLookup } from '../../../hooks/useLookup';

// ─── Fallback Constants (used when API returns nothing) ─────────────────────────

const FALLBACK_PROJECT_TYPES = [
  { label: 'Residential', value: 'Residential' },
  { label: 'Commercial', value: 'Commercial' },
  { label: 'Mixed-Use', value: 'Mixed-Use' },
  { label: 'Industrial', value: 'Industrial' },
  { label: 'Retail', value: 'Retail' },
];

const FALLBACK_STATUSES = [
  { label: 'Planning', value: 'Planning' },
  { label: 'Under Construction', value: 'Under Construction' },
  { label: 'Ready to Move', value: 'Ready to Move' },
  { label: 'Completed', value: 'Completed' },
];

const FALLBACK_AMENITIES = [
  { _id: 'gym', label: 'Gym', icon: 'fitness-center' },
  { _id: 'pool', label: 'Swimming Pool', icon: 'pool' },
  { _id: 'parking', label: 'Parking', icon: 'local-parking' },
  { _id: 'powerBackup', label: 'Power Backup', icon: 'electric-bolt' },
  { _id: 'lift', label: 'Lift / Elevator', icon: 'elevator' },
  { _id: 'security', label: 'Gated Security', icon: 'security' },
  { _id: 'clubhouse', label: 'Club House', icon: 'nightlife' },
  { _id: 'garden', label: 'Garden / Park', icon: 'park' },
  { _id: 'cctv', label: 'CCTV', icon: 'videocam' },
  { _id: 'sportsComplex', label: 'Sports Complex', icon: 'sports-basketball' },
  { _id: 'kidsArea', label: "Kids' Play Area", icon: 'child-care' },
  { _id: 'communityHall', label: 'Community Hall', icon: 'groups' },
];

// Map a MaterialIcons icon name to an API amenity by label keywords
const getAmenityIcon = (amenity) => {
  const lbl = (amenity.label || amenity.name || '').toLowerCase();
  if (lbl.includes('gym') || lbl.includes('fitness')) return 'fitness-center';
  if (lbl.includes('pool') || lbl.includes('swim')) return 'pool';
  if (lbl.includes('park') || lbl.includes('garden')) return 'park';
  if (lbl.includes('lift') || lbl.includes('elevator')) return 'elevator';
  if (lbl.includes('power') || lbl.includes('backup')) return 'electric-bolt';
  if (lbl.includes('secur') || lbl.includes('gate')) return 'security';
  if (lbl.includes('club')) return 'nightlife';
  if (lbl.includes('cctv') || lbl.includes('camera')) return 'videocam';
  if (lbl.includes('sport')) return 'sports-basketball';
  if (lbl.includes('kid') || lbl.includes('play')) return 'child-care';
  if (lbl.includes('communit') || lbl.includes('hall')) return 'groups';
  if (lbl.includes('parking') || lbl.includes('car')) return 'local-parking';
  if (lbl.includes('water')) return 'water-drop';
  if (lbl.includes('intercom')) return 'contact-phone';
  return 'star-outline';
};

const STEPS = [
  { id: 1, title: 'Basic Info', icon: 'business' },
  { id: 2, title: 'Location', icon: 'location-on' },
  { id: 3, title: 'Amenities', icon: 'star' },
  { id: 4, title: 'Review', icon: 'check-circle' },
];

const EMPTY_FORM = {
  // Step 1
  projectName: '',
  description: '',
  projectType: '',
  status: '',
  totalUnits: '',
  // Step 2
  address: '',
  city: '',
  state: '',
  pincode: '',
  startDate: '',
  completionDate: '',
  averagePricePerSqFt: '',
  // Step 3
  amenities: [],
  // Step 4 — read-only review
};

// ─── Helper Components ──────────────────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <Text
    style={{ fontFamily: 'Inter-SemiBold', color: '#374151', fontSize: 13, marginBottom: 6 }}
  >
    {children}
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
      borderRadius: 12,
      backgroundColor: '#F9FAFB',
      paddingHorizontal: 14,
      paddingVertical: multiline ? 12 : 0,
      marginBottom: 14,
    }}
  >
    {icon && (
      <MaterialIcons
        name={icon}
        size={18}
        color="#9CA3AF"
        style={{ marginRight: 8, marginTop: multiline ? 2 : 0 }}
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
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#111827',
        minHeight: multiline ? 80 : 48,
        textAlignVertical: multiline ? 'top' : 'center',
      }}
    />
  </View>
);

// options = array of { label, value } objects
const ChipSelector = ({ options, selected, onSelect }) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
    {options.map((opt) => {
      const isActive = selected === opt.value;
      return (
        <TouchableOpacity
          key={opt.value}
          onPress={() => onSelect(opt.value)}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1.5,
            borderColor: isActive ? '#008E96' : '#E5E7EB',
            backgroundColor: isActive ? '#E6F7F6' : '#FFFFFF',
          }}
        >
          <Text
            style={{
              fontFamily: isActive ? 'Inter-SemiBold' : 'Inter-Regular',
              color: isActive ? '#008E96' : '#6B7280',
              fontSize: 13,
            }}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ─── Main Component ─────────────────────────────────────────────────────────────

const AddProject = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef(null);

  // ─── API Lookups ────────────────────────────────────────────────────────────
  const {
    propertyTypes: apiPropertyTypes,
    constructionStatus: apiConstructionStatus,
    amenities: apiAmenitiesRaw,
    fetchSingleLookup,
    loading: lookupLoading,
  } = useLookup();

  useEffect(() => {
    fetchSingleLookup('propertyTypes');
    fetchSingleLookup('constructionStatus');
    fetchSingleLookup('amenities');
  }, [fetchSingleLookup]);

  // Build normalised option arrays — API objects use .label or .name fields
  const projectTypeOptions =
    apiPropertyTypes && apiPropertyTypes.length > 0
      ? apiPropertyTypes.map((t) => ({ label: t.label || t.name, value: t.label || t.name }))
      : FALLBACK_PROJECT_TYPES;

  const statusOptions =
    apiConstructionStatus && apiConstructionStatus.length > 0
      ? apiConstructionStatus.map((s) => ({ label: s.label || s.name, value: s.label || s.name }))
      : FALLBACK_STATUSES;

  // Amenities: API objects have _id, label/name, optional icon
  const amenitiesList =
    apiAmenitiesRaw && apiAmenitiesRaw.length > 0
      ? apiAmenitiesRaw.map((a) => ({
          _id: a._id || a.label || a.name,
          label: a.label || a.name,
          icon: a.icon || getAmenityIcon(a),
        }))
      : FALLBACK_AMENITIES;

  // ─── Form Helpers ───────────────────────────────────────────────────────────
  const update = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleAmenity = useCallback((id) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((a) => a !== id)
        : [...prev.amenities, id],
    }));
  }, []);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  // ─── Step Validators ──────────────────────────────────────────────────────────

  const step1Valid =
    form.projectName.trim().length >= 3 && form.projectType && form.status;

  const step2Valid =
    form.city.trim().length >= 2 && form.state.trim().length >= 2;

  const step3Valid = true; // amenities are optional

  const canProceed = () => {
    if (currentStep === 1) return step1Valid;
    if (currentStep === 2) return step2Valid;
    if (currentStep === 3) return step3Valid;
    return true;
  };

  // ─── Navigation ───────────────────────────────────────────────────────────────

  const goNext = () => {
    if (!canProceed()) {
      Alert.alert('Incomplete', 'Please fill all required fields before continuing.');
      return;
    }
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
      scrollToTop();
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      scrollToTop();
    } else {
      router.back();
    }
  };

  // ─── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const userStr = await SecureStore.getItemAsync('userData');
      const user = userStr ? JSON.parse(userStr) : null;
      const developerId = user?._id || user?.id;

      const payload = {
        projectName: form.projectName.trim(),
        description: form.description.trim(),
        projectType: form.projectType,
        status: form.status,
        totalUnits: form.totalUnits ? parseInt(form.totalUnits) : undefined,
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        startDate: form.startDate.trim() || undefined,
        completionDate: form.completionDate.trim() || undefined,
        avgPriceRate: form.averagePricePerSqFt ? parseFloat(form.averagePricePerSqFt) : undefined,
        amenities: form.amenities,
        developer: developerId,
      };

      const response = await api.post('/projects', payload);

      if (response.data?.success) {
        Alert.alert(
          '🎉 Project Listed!',
          `"${form.projectName}" has been successfully added to your project portfolio.`,
          [
            {
              text: 'View Projects',
              onPress: () => router.replace('/screens/Project/MyProjects'),
            },
          ]
        );
      } else {
        throw new Error(response.data?.message || 'Failed to create project');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Something went wrong.';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Step Progress Bar ────────────────────────────────────────────────────────

  const renderProgressBar = () => (
    <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {STEPS.map((step, idx) => {
          const isDone = currentStep > step.id;
          const isActive = currentStep === step.id;
          return (
            <View key={step.id} style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                {/* Connector left */}
                {idx > 0 && (
                  <View
                    style={{
                      flex: 1,
                      height: 2,
                      backgroundColor: isDone || isActive ? '#008E96' : '#E5E7EB',
                      borderRadius: 1,
                    }}
                  />
                )}
                {/* Circle */}
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
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
                    <MaterialIcons name="check" size={16} color="white" />
                  ) : (
                    <MaterialIcons name={step.icon} size={14} color={isActive ? 'white' : '#9CA3AF'} />
                  )}
                </View>
                {/* Connector right */}
                {idx < STEPS.length - 1 && (
                  <View
                    style={{
                      flex: 1,
                      height: 2,
                      backgroundColor: isDone ? '#008E96' : '#E5E7EB',
                      borderRadius: 1,
                    }}
                  />
                )}
              </View>
              <Text
                style={{
                  fontFamily: isActive ? 'Inter-SemiBold' : 'Inter-Regular',
                  fontSize: 10,
                  color: isActive ? '#008E96' : isDone ? '#059669' : '#9CA3AF',
                  marginTop: 4,
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

  // ─── Step 1: Basic Info ───────────────────────────────────────────────────────

  const renderStep1 = () => (
    <View>
      <Text style={{ fontFamily: 'Inter-Bold', fontSize: 20, color: '#111827', marginBottom: 4 }}>
        Basic Information
      </Text>
      <Text style={{ fontFamily: 'Inter-Regular', fontSize: 13, color: '#6B7280', marginBottom: 20 }}>
        Tell buyers what your project is about.
      </Text>

      <SectionLabel>Project Name *</SectionLabel>
      <StyledInput
        placeholder="e.g. SBP Homes Phase 2"
        value={form.projectName}
        onChangeText={(v) => update('projectName', v)}
        icon="business"
      />

      <SectionLabel>Description</SectionLabel>
      <StyledInput
        placeholder="Describe your project — amenities, USPs, connectivity..."
        value={form.description}
        onChangeText={(v) => update('description', v)}
        multiline
        numberOfLines={4}
        icon="notes"
      />

      <SectionLabel>Project Type *</SectionLabel>
      {lookupLoading && projectTypeOptions === FALLBACK_PROJECT_TYPES ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <ActivityIndicator size="small" color="#008E96" />
          <Text style={{ fontFamily: 'Inter-Regular', fontSize: 13, color: '#9CA3AF' }}>Loading types...</Text>
        </View>
      ) : (
        <ChipSelector
          options={projectTypeOptions}
          selected={form.projectType}
          onSelect={(v) => update('projectType', v)}
        />
      )}

      <SectionLabel>Current Status *</SectionLabel>
      {lookupLoading && statusOptions === FALLBACK_STATUSES ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <ActivityIndicator size="small" color="#008E96" />
          <Text style={{ fontFamily: 'Inter-Regular', fontSize: 13, color: '#9CA3AF' }}>Loading statuses...</Text>
        </View>
      ) : (
        <ChipSelector
          options={statusOptions}
          selected={form.status}
          onSelect={(v) => update('status', v)}
        />
      )}

      <SectionLabel>Total Units</SectionLabel>
      <StyledInput
        placeholder="e.g. 120"
        value={form.totalUnits}
        onChangeText={(v) => update('totalUnits', v)}
        keyboardType="number-pad"
        icon="apartment"
      />
    </View>
  );

  // ─── Step 2: Location & Timeline ─────────────────────────────────────────────

  const renderStep2 = () => (
    <View>
      <Text style={{ fontFamily: 'Inter-Bold', fontSize: 20, color: '#111827', marginBottom: 4 }}>
        Location & Timeline
      </Text>
      <Text style={{ fontFamily: 'Inter-Regular', fontSize: 13, color: '#6B7280', marginBottom: 20 }}>
        Where is it located and when will it be ready?
      </Text>

      <SectionLabel>Street Address</SectionLabel>
      <StyledInput
        placeholder="Plot No, Street, Sector..."
        value={form.address}
        onChangeText={(v) => update('address', v)}
        icon="place"
      />

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <SectionLabel>City *</SectionLabel>
          <StyledInput
            placeholder="City"
            value={form.city}
            onChangeText={(v) => update('city', v)}
            icon="location-city"
          />
        </View>
        <View style={{ flex: 1 }}>
          <SectionLabel>State *</SectionLabel>
          <StyledInput
            placeholder="State"
            value={form.state}
            onChangeText={(v) => update('state', v)}
            icon="map"
          />
        </View>
      </View>

      <SectionLabel>Pincode</SectionLabel>
      <StyledInput
        placeholder="6-digit Pincode"
        value={form.pincode}
        onChangeText={(v) => update('pincode', v)}
        keyboardType="number-pad"
        icon="pin"
      />

      <SectionLabel>Launch / Start Date</SectionLabel>
      <StyledInput
        placeholder="MM/DD/YYYY"
        value={form.startDate}
        onChangeText={(v) => update('startDate', v)}
        icon="event"
      />

      <SectionLabel>Expected Completion Date</SectionLabel>
      <StyledInput
        placeholder="MM/DD/YYYY"
        value={form.completionDate}
        onChangeText={(v) => update('completionDate', v)}
        icon="event-available"
      />

      <SectionLabel>Avg. Price / Sq.ft (₹)</SectionLabel>
      <StyledInput
        placeholder="e.g. 4500"
        value={form.averagePricePerSqFt}
        onChangeText={(v) => update('averagePricePerSqFt', v)}
        keyboardType="decimal-pad"
        icon="currency-rupee"
      />
    </View>
  );

  // ─── Step 3: Amenities ────────────────────────────────────────────────────────

  const renderStep3 = () => (
    <View>
      <Text style={{ fontFamily: 'Inter-Bold', fontSize: 20, color: '#111827', marginBottom: 4 }}>
        Amenities
      </Text>
      <Text style={{ fontFamily: 'Inter-Regular', fontSize: 13, color: '#6B7280', marginBottom: 20 }}>
        Select all amenities available in your project.
      </Text>

      {lookupLoading && amenitiesList === FALLBACK_AMENITIES ? (
        <View style={{ alignItems: 'center', paddingVertical: 32, gap: 10 }}>
          <ActivityIndicator size="large" color="#008E96" />
          <Text style={{ fontFamily: 'Inter-Regular', fontSize: 13, color: '#9CA3AF' }}>Loading amenities...</Text>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {amenitiesList.map((a) => {
            const isSelected = form.amenities.includes(a._id);
            return (
              <TouchableOpacity
                key={a._id}
                onPress={() => toggleAmenity(a._id)}
                style={{
                  width: '47%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  borderWidth: 1.5,
                  borderColor: isSelected ? '#008E96' : '#E5E7EB',
                  backgroundColor: isSelected ? '#E6F7F6' : '#FFFFFF',
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                }}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: isSelected ? '#008E96' : '#F3F4F6',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MaterialIcons
                    name={a.icon || 'star-outline'}
                    size={18}
                    color={isSelected ? 'white' : '#9CA3AF'}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: isSelected ? 'Inter-SemiBold' : 'Inter-Regular',
                    fontSize: 12,
                    color: isSelected ? '#008E96' : '#374151',
                    flex: 1,
                  }}
                  numberOfLines={2}
                >
                  {a.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View
        style={{
          backgroundColor: '#F0FDF4',
          borderRadius: 12,
          padding: 14,
          marginTop: 16,
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 10,
          borderWidth: 1,
          borderColor: '#BBF7D0',
        }}
      >
        <MaterialIcons name="info" size={18} color="#16A34A" style={{ marginTop: 1 }} />
        <Text style={{ fontFamily: 'Inter-Regular', fontSize: 12, color: '#15803D', flex: 1, lineHeight: 18 }}>
          Projects with 5+ amenities listed get{' '}
          <Text style={{ fontFamily: 'Inter-Bold' }}>3× more enquiries</Text> on average.
          Add as many as apply!
        </Text>
      </View>
    </View>
  );

  // ─── Step 4: Review & Submit ─────────────────────────────────────────────────

  const ReviewRow = ({ label, value }) => {
    if (!value) return null;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
          gap: 8,
        }}
      >
        <Text style={{ fontFamily: 'Inter-Medium', fontSize: 13, color: '#6B7280', flex: 1 }}>
          {label}
        </Text>
        <Text
          style={{ fontFamily: 'Inter-SemiBold', fontSize: 13, color: '#111827', flex: 2, textAlign: 'right' }}
          numberOfLines={3}
        >
          {value}
        </Text>
      </View>
    );
  };

  const renderStep4 = () => {
    const selectedAmenities = amenitiesList
      .filter((a) => form.amenities.includes(a._id))
      .map((a) => a.label)
      .join(', ');

    return (
      <View>
        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 20, color: '#111827', marginBottom: 4 }}>
          Review & Submit
        </Text>
        <Text style={{ fontFamily: 'Inter-Regular', fontSize: 13, color: '#6B7280', marginBottom: 20 }}>
          Double-check your project details before publishing.
        </Text>

        {/* Section Card */}
        {[
          {
            title: 'Basic Info',
            icon: 'business',
            rows: [
              { label: 'Project Name', value: form.projectName },
              { label: 'Type', value: form.projectType },
              { label: 'Status', value: form.status },
              { label: 'Total Units', value: form.totalUnits },
              { label: 'Description', value: form.description },
            ],
          },
          {
            title: 'Location & Timeline',
            icon: 'location-on',
            rows: [
              { label: 'Address', value: form.address },
              { label: 'City', value: form.city },
              { label: 'State', value: form.state },
              { label: 'Pincode', value: form.pincode },
              { label: 'Start Date', value: form.startDate },
              { label: 'Completion', value: form.completionDate },
              { label: 'Avg ₹/Sq.ft', value: form.averagePricePerSqFt ? `₹${form.averagePricePerSqFt}` : '' },
            ],
          },
          {
            title: 'Amenities',
            icon: 'star',
            rows: [{ label: 'Selected', value: selectedAmenities || 'None selected' }],
          },
        ].map((section) => (
          <View
            key={section.title}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              padding: 16,
              marginBottom: 14,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            {/* Section header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  backgroundColor: '#E6F7F6',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name={section.icon} size={16} color="#008E96" />
              </View>
              <Text style={{ fontFamily: 'Inter-Bold', fontSize: 14, color: '#374151' }}>
                {section.title}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  const stepNum = section.title === 'Basic Info' ? 1 : section.title === 'Location & Timeline' ? 2 : 3;
                  setCurrentStep(stepNum);
                  scrollToTop();
                }}
                style={{ marginLeft: 'auto' }}
              >
                <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 12, color: '#008E96' }}>Edit</Text>
              </TouchableOpacity>
            </View>
            {section.rows.map((row) => (
              <ReviewRow key={row.label} label={row.label} value={row.value} />
            ))}
          </View>
        ))}

        {/* Warning */}
        <View
          style={{
            backgroundColor: '#FFFBEB',
            borderRadius: 12,
            padding: 14,
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
            borderWidth: 1,
            borderColor: '#FDE68A',
            marginBottom: 8,
          }}
        >
          <MaterialIcons name="warning" size={18} color="#D97706" style={{ marginTop: 1 }} />
          <Text style={{ fontFamily: 'Inter-Regular', fontSize: 12, color: '#92400E', flex: 1, lineHeight: 18 }}>
            Once submitted, your project will be reviewed by our team before appearing in search results.
          </Text>
        </View>
      </View>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  const stepContent = () => {
    if (currentStep === 1) return renderStep1();
    if (currentStep === 2) return renderStep2();
    if (currentStep === 3) return renderStep3();
    return renderStep4();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <LinearGradient
        colors={['#006B73', '#008E96']}
        style={{
          paddingTop: Platform.OS === 'android' ? 48 : 16,
          paddingBottom: 20,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={goBack}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: 18, color: 'white' }}>
            Add New Project
          </Text>
          <Text style={{ fontFamily: 'Inter-Regular', fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 1 }}>
            Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].title}
          </Text>
        </View>
        {/* Step counter badge */}
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.25)',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
          }}
        >
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: 12, color: 'white' }}>
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
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {stepContent()}
        </ScrollView>

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
            padding: 16,
            flexDirection: 'row',
            gap: 10,
          }}
        >
          {currentStep > 1 && (
            <TouchableOpacity
              onPress={goBack}
              style={{
                flex: 1,
                height: 50,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: '#E5E7EB',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 6,
              }}
            >
              <Ionicons name="arrow-back" size={16} color="#6B7280" />
              <Text style={{ fontFamily: 'Inter-SemiBold', color: '#6B7280', fontSize: 14 }}>
                Back
              </Text>
            </TouchableOpacity>
          )}

          {currentStep < 4 ? (
            <TouchableOpacity
              onPress={goNext}
              disabled={!canProceed()}
              style={{
                flex: 2,
                height: 50,
                borderRadius: 12,
                backgroundColor: canProceed() ? '#008E96' : '#E5E7EB',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
                shadowColor: canProceed() ? '#008E96' : 'transparent',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: canProceed() ? 4 : 0,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Inter-Bold',
                  color: canProceed() ? 'white' : '#9CA3AF',
                  fontSize: 15,
                }}
              >
                Continue
              </Text>
              <Ionicons name="arrow-forward" size={16} color={canProceed() ? 'white' : '#9CA3AF'} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting}
              style={{
                flex: 2,
                height: 50,
                borderRadius: 12,
                backgroundColor: '#008E96',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
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
                  <MaterialIcons name="rocket-launch" size={18} color="white" />
                  <Text style={{ fontFamily: 'Inter-Bold', color: 'white', fontSize: 15 }}>
                    Publish Project
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddProject;
