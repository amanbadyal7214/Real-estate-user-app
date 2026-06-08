import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
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
import { useProject } from '../../../hooks/useProject';



const MOCK_PROJECTS = [
  {
    _id: "sbp-homes",
    title: "SBP Homes",
    projectName: "SBP Homes",
    builderName: "SBP Group",
    location: "Punjab, Mohali",
    city: "Mohali",
    completionDate: "5/16/2026",
    status: "Completed",
    isActive: true,
    projectType: "Residential",
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400"],
    description: "Premium residential apartments in Sector 126, Mohali, offering modern living spaces with outstanding amenities.",
    amenities: ["Gym", "Pool", "Parking", "Power Backup"]
  },
  {
    _id: "homeland",
    title: "HomeLand",
    projectName: "HomeLand",
    builderName: "Homeland Group",
    location: "Punjab, Chandigarh",
    city: "Chandigarh",
    completionDate: "5/14/2026",
    status: "Completed",
    isActive: true,
    projectType: "Residential",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400"],
    description: "Luxury high-rise residential apartments with scenic views, top-notch security, and exquisite clubhouse.",
    amenities: ["Gym", "Pool", "Parking", "Power Backup", "Clubhouse"]
  },
  {
    _id: "skyline",
    title: "Skyline Residency",
    projectName: "Skyline Residency",
    builderName: "Skyline Builders",
    location: "Punjab, Chandigarh",
    city: "Chandigarh",
    completionDate: "5/13/2026",
    status: "Completed",
    isActive: true,
    projectType: "Residential",
    images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400"],
    description: "",
    amenities: []
  },
  {
    _id: "ansal-api",
    title: "ANSAL API",
    projectName: "ANSAL API",
    builderName: "Ansal API Group",
    location: "Punjab, Mohali",
    city: "Mohali",
    completionDate: "5/13/2026",
    status: "Completed",
    isActive: false,
    projectType: "Commercial",
    images: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600"],
    description: "State of the art commercial retail spaces, showrooms, and modern business suites in a hot investment zone.",
    amenities: ["Lift", "Parking", "Power Backup"]
  }
];

const MyProjects = () => {
  const { fetchDeveloperProjects, loading: apiLoading } = useProject();

  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState("Builder");



  // Filter States
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedProjectType, setSelectedProjectType] = useState(null);

  // Dropdown UI States
  const [activeFilterDropdown, setActiveFilterDropdown] = useState(null);

  // Project Dots Menu State
  const [activeMenuProjectId, setActiveMenuProjectId] = useState(null);

  const loadBuilderProjects = useCallback(async () => {
    try {
      setLoading(true);
      const userStr = await SecureStore.getItemAsync("userData");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.name || "Builder");

        if (user.id || user._id) {
          const userId = user._id || user.id;
          const apiProjects = await fetchDeveloperProjects(userId);
          if (apiProjects && apiProjects.success && apiProjects.data && apiProjects.data.length > 0) {
            setProjects(apiProjects.data);
          }
        }
      }
    } catch (error) {
      console.warn("Failed to load developer projects, using high-fidelity fallback:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchDeveloperProjects]);

  useEffect(() => {
    loadBuilderProjects();
  }, [loadBuilderProjects]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBuilderProjects();
    setRefreshing(false);
  };


  const handleDelete = (id) => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to permanently delete this project listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setProjects(prev => prev.filter(p => p._id !== id));
            Alert.alert('Success', 'Project deleted successfully.');
          },
        },
      ]
    );
  };





  const handleCreateProject = () => {
    router.push('/screens/Project/AddProject');
  };

  const handleEdit = (project) => {
    Alert.alert(
      "Edit Project",
      `Would you like to edit details for "${project.projectName || project.title}"? This wizard is coming soon.`,
      [{ text: "OK" }]
    );
  };

  const toggleProjectMenu = (id) => {
    setActiveMenuProjectId(prev => (prev === id ? null : id));
  };

  const handleAddSummary = (project) => {
    setActiveMenuProjectId(null);
    Alert.alert(
      "Add Property Summary",
      `Add summary details for "${project.projectName || project.title}". Feature coming soon.`,
      [{ text: "OK" }]
    );
  };

  const handleViewSummary = (project) => {
    setActiveMenuProjectId(null);
    Alert.alert(
      "View Property Summary",
      `Displaying summary details for "${project.projectName || project.title}". Feature coming soon.`,
      [{ text: "OK" }]
    );
  };

  // Filter List Logic
  const cities = Array.from(new Set(MOCK_PROJECTS.map(p => p.city).filter(Boolean)));
  const statuses = Array.from(new Set(MOCK_PROJECTS.map(p => p.status).filter(Boolean)));
  const projectTypes = Array.from(new Set(MOCK_PROJECTS.map(p => p.projectType).filter(Boolean)));

  const filteredProjects = projects.filter(item => {
    if (selectedCity && item.city !== selectedCity) return false;
    if (selectedStatus && item.status !== selectedStatus) return false;
    if (selectedProjectType && item.projectType !== selectedProjectType) return false;
    return true;
  });

  const clearFilters = () => {
    setSelectedCity(null);
    setSelectedStatus(null);
    setSelectedProjectType(null);
  };

  const renderFilterPill = (type, label, isActive) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setActiveFilterDropdown(type);
        }}
        className="px-3 py-1.5 rounded-full border flex-row items-center gap-1 bg-white"
        style={{
          borderColor: isActive ? '#008E96' : '#E5E7EB',
          backgroundColor: isActive ? '#E6F7F6' : '#FFFFFF'
        }}
      >
        <Text
          style={{
            fontFamily: isActive ? 'Inter-SemiBold' : 'Inter-Medium',
            color: isActive ? '#008E96' : '#4B5563'
          }}
          className="text-xs text-gray-700"
        >
          {label}
        </Text>
        <Ionicons
          name="chevron-down"
          size={12}
          color={isActive ? '#008E96' : '#6B7280'}
        />
      </TouchableOpacity>
    );
  };

  const renderSelectionModal = () => {
    let title = '';
    let options = [];
    let selectedValue = null;
    let onSelect = () => { };

    if (activeFilterDropdown === 'city') {
      title = 'Select Location';
      options = cities.map(c => ({ key: c, label: c }));
      selectedValue = selectedCity;
      onSelect = (opt) => {
        setSelectedCity(opt.key);
        setActiveFilterDropdown(null);
      };
    } else if (activeFilterDropdown === 'status') {
      title = 'Select Status';
      options = statuses.map(s => ({ key: s, label: s }));
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



  const renderProjectCard = ({ item }) => {
    const hasPhotos = item.images && item.images.length > 0;

    return (
      <View className="bg-white border border-[#E5E7EB] rounded-2xl p-4 mb-4 shadow-sm">
        {/* Top Section: Image and Details */}
        <View className="flex-row">
          {/* Project Image with overlays */}
          <View className="w-[110px] h-[110px] rounded-xl overflow-hidden bg-gray-100 relative">
            <Image
              source={{
                uri: hasPhotos
                  ? item.images[0]
                  : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=300',
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
                  Featured Project
                </Text>
                <Text className="text-gray-400 text-[10px]">•</Text>
                <Text className="text-gray-500 text-[10px] font-inter-semibold uppercase">
                  {item.projectType}
                </Text>
              </View>
              <Text className="text-[#101828] text-base font-inter-bold" numberOfLines={1}>
                {item.projectName || item.title || 'Project'}
              </Text>
              <Text className="text-gray-400 text-xs mt-0.5" numberOfLines={1}>
                by {item.builderName || "Developer"}
              </Text>
            </View>
            <View className="flex-row items-center gap-2 mt-2">
              <Text className="text-gray-500 text-xs font-inter-regular">
                {item.completionDate ? `Date: ${item.completionDate}` : 'Completion N/A'}
              </Text>
              <Text className="text-gray-300">|</Text>
              <View className="bg-gray-100 px-2 py-0.5 rounded-md">
                <Text className="text-[10px] font-inter-medium text-gray-600 uppercase">
                  {item.city}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons Row */}
        {/* Action Buttons Row */}
        <View className="flex-row items-center justify-end gap-5 mt-4 border-t border-[#F2F4F7] pt-4 relative z-50">
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/screens/ProjectDetails',
                params: {
                  projectId: item._id || item.id,
                  project: JSON.stringify(item)
                },
              })
            }
            className="p-1"
          >
            <Ionicons name="eye-outline" size={20} color="#2563EB" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleEdit(item)}
            className="p-1"
          >
            <Ionicons name="create-outline" size={20} color="#D97706" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDelete(item._id)}
            className="p-1"
          >
            <Ionicons name="trash-outline" size={20} color="#DC2626" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleProjectMenu(item._id)}
            className="p-1"
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
          </TouchableOpacity>

          {/* Dropdown Menu Popup */}
          {activeMenuProjectId === item._id && (
            <View
              className="absolute right-0 top-10 bg-white border border-gray-100 rounded-2xl p-4 shadow-xl z-50 w-[220px]"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 5,
              }}
            >
              <TouchableOpacity
                onPress={() => handleAddSummary(item)}
                className="flex-row items-center py-2 border-b border-gray-50"
              >
                <View className="w-2.5 h-2.5 rounded-full bg-[#10B981] mr-3" />
                <Text className="text-[#0F172A] text-sm font-inter-semibold">Add Property Summary</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleViewSummary(item)}
                className="flex-row items-center py-2 mt-1"
              >
                <View className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] mr-3" />
                <Text className="text-[#0F172A] text-sm font-inter-semibold">View Property Summary</Text>
              </TouchableOpacity>
            </View>
          )}
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
            <Text className="text-white text-lg font-inter-bold">{userName ? `${userName}'s Console` : "My Projects"}</Text>
          </View>
          <TouchableOpacity
            onPress={handleCreateProject}
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
            'city',
            selectedCity || 'City',
            !!selectedCity
          )}
          {renderFilterPill(
            'status',
            selectedStatus || 'Status',
            !!selectedStatus
          )}
          {renderFilterPill(
            'projectType',
            selectedProjectType || 'Type',
            !!selectedProjectType
          )}
        </ScrollView>
        {(selectedCity || selectedStatus || selectedProjectType) && (
          <TouchableOpacity onPress={clearFilters} className="px-2 py-1">
            <Text className="text-[#EF4444] text-[11px] font-inter-bold uppercase tracking-wider">
              Reset
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Projects List */}
      <View className="flex-1 px-4 mt-4">
        {loading || apiLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#008E96" />
            <Text className="mt-4 text-gray-500 font-inter-medium">Loading your projects...</Text>
          </View>
        ) : filteredProjects.length > 0 ? (
          <FlatList
            data={filteredProjects}
            keyExtractor={item => item._id}
            renderItem={renderProjectCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListHeaderComponent={() => (
              <Text className="text-gray-500 text-xs font-inter-medium mb-3">
                Showing {filteredProjects.length} out of {projects.length} projects
              </Text>
            )}
          />
        ) : (
          <View className="flex-1 items-center justify-center py-20 px-8">
            <View className="w-16 h-16 rounded-full bg-[#E6F7F7] items-center justify-center mb-4">
              <Ionicons name="business-outline" size={32} color="#008E96" />
            </View>
            <Text className="text-[#101828] text-lg font-inter-bold text-center">
              No Projects Found
            </Text>
            <Text className="text-gray-500 text-sm font-inter-regular text-center mt-2">
              {projects.length > 0
                ? 'Try resetting or changing your search filters.'
                : "You haven't posted any builder projects yet. Click below to post."}
            </Text>
            {projects.length === 0 && (
              <TouchableOpacity
                onPress={handleCreateProject}
                className="mt-6 bg-[#008E96] px-6 py-3 rounded-xl shadow-md"
              >
                <Text className="text-white font-inter-semibold">Post Project for FREE</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Dropdown Modals */}
      {renderSelectionModal()}
    </SafeAreaView>
  );
};

export default MyProjects;
