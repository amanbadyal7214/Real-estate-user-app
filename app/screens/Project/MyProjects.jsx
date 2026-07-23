import { SafeAreaView } from 'react-native-safe-area-context';
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
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useProject } from '../../../hooks/useProject';
import api from '../../api';



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

const getCityName = (city) => {
  if (!city) return '';
  if (typeof city === 'object') {
    return city.name || city.label || '';
  }
  return city;
};

const formatDateOnly = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

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
  const [menuProject, setMenuProject] = useState(null);

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
          onPress: async () => {
            try {
              const res = await api.delete(`/projects/${id}`);
              if (res.data?.success || res.status === 200 || res.status === 204) {
                setProjects(prev => prev.filter(p => p._id !== id));
                Alert.alert('Success', 'Project deleted successfully.');
              } else {
                throw new Error(res.data?.message || 'Delete failed');
              }
            } catch (err) {
              const msg = err.response?.data?.message || err.message || 'Failed to delete project';
              Alert.alert('Error', msg);
            }
          },
        },
      ]
    );
  };





  const handleCreateProject = () => {
    router.push('/screens/Project/AddProject');
  };

  const handleEdit = (project) => {
    router.push({
      pathname: '/screens/Project/AddProject',
      params: {
        projectId: project._id || project.id,
        project: JSON.stringify(project)
      }
    });
  };

  const toggleProjectMenu = (id, project) => {
    if (activeMenuProjectId === id) {
      setActiveMenuProjectId(null);
      setMenuProject(null);
    } else {
      setActiveMenuProjectId(id);
      setMenuProject(project);
    }
  };

  const handleAddSummary = (project) => {
    setActiveMenuProjectId(null);
    router.push({
      pathname: '/screens/Project/PropertySummary',
      params: { 
        projectId: project._id || project.id,
        projectName: project.projectName || project.title,
        mode: 'add'
      }
    });
  };

  const handleViewSummary = (project) => {
    setActiveMenuProjectId(null);
    setMenuProject(null);
    router.push({
      pathname: '/screens/Project/ViewPropertySummary',
      params: {
        projectId: project._id || project.id,
        projectName: project.projectName || project.title
      }
    });
  };

  // Filter List Logic
  const cities = Array.from(new Set(projects.map(p => getCityName(p.city)).filter(Boolean)));
  const statuses = Array.from(new Set(projects.map(p => p.status).filter(Boolean)));
  const projectTypes = Array.from(new Set(projects.map(p => p.projectType).filter(Boolean)));

  const filteredProjects = projects.filter(item => {
    if (selectedCity && getCityName(item.city) !== selectedCity) return false;
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
        className="flex-row items-center bg-white border"
        style={{
          borderColor: isActive ? '#008E96' : '#E5E7EB',
          backgroundColor: isActive ? '#E6F7F6' : '#FFFFFF',
          paddingHorizontal: wp('3%'),
          paddingVertical: hp('0.8%'),
          borderRadius: wp('5%'),
          gap: wp('1%'),
        }}
      >
        <Text
          style={{
            fontFamily: isActive ? 'Inter-SemiBold' : 'Inter-Medium',
            color: isActive ? '#008E96' : '#4B5563',
            fontSize: wp('3.2%')
          }}
        >
          {label}
        </Text>
        <Ionicons
          name="chevron-down"
          size={wp('3.2%')}
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
          <View 
            className="bg-white"
            style={{
              borderTopLeftRadius: wp('6%'),
              borderTopRightRadius: wp('6%'),
              paddingBottom: hp('4.5%'),
              maxHeight: hp('70%'),
            }}
          >
            <View style={{ alignItems: 'center', paddingVertical: hp('1.5%') }}>
              <View 
                className="bg-gray-200"
                style={{
                  width: wp('10%'),
                  height: hp('0.5%'),
                  borderRadius: wp('1%'),
                }}
              />
            </View>
            <View 
              className="border-b border-gray-100 flex-row justify-between items-center"
              style={{
                paddingHorizontal: wp('5%'),
                paddingBottom: hp('1.5%'),
              }}
            >
              <Text 
                className="text-[#101828]"
                style={{
                  fontWeight: '700',
                  fontSize: wp('4.8%'),
                }}
              >{title}</Text>
              <TouchableOpacity onPress={() => setActiveFilterDropdown(null)}>
                <Text 
                  className="text-[#6A7282]"
                  style={{
                    fontWeight: '500',
                    fontSize: wp('3.7%'),
                  }}
                >Cancel</Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              showsVerticalScrollIndicator={false}
              style={{
                paddingHorizontal: wp('5%'),
                marginTop: hp('1%'),
              }}
            >
              {options.length > 0 ? (
                options.map((option) => {
                  const isSelected = selectedValue === option.key;
                  return (
                    <TouchableOpacity
                      key={option.key}
                      onPress={() => onSelect(option)}
                      className="border-b border-gray-50 flex-row justify-between items-center"
                      style={{
                        paddingVertical: hp('1.8%'),
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: isSelected ? 'Inter-SemiBold' : 'Inter-Regular',
                          color: isSelected ? '#008E96' : '#344054',
                          fontSize: wp('4%'),
                        }}
                      >
                        {option.label}
                      </Text>
                      {isSelected && (
                        <View 
                          className="bg-[#008E96] items-center justify-center"
                          style={{
                            width: wp('5%'),
                            height: wp('5%'),
                            borderRadius: wp('2.5%'),
                          }}
                        >
                          <Ionicons name="checkmark" size={wp('3%')} color="white" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View 
                  className="items-center justify-center"
                  style={{
                    paddingVertical: hp('5%'),
                  }}
                >
                  <Text className="text-gray-400 font-medium">No options available</Text>
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
      <View 
        className="bg-white border border-[#E5E7EB] shadow-sm"
        style={{
          borderRadius: wp('4%'),
          padding: wp('4%'),
          marginBottom: hp('1.8%'),
        }}
      >
        {/* Top Section: Image and Details */}
        <View className="flex-row">
          {/* Project Image with overlays */}
          <View 
            className="bg-gray-100 relative"
            style={{
              width: wp('28%'),
              height: wp('28%'),
              borderRadius: wp('3%'),
              overflow: 'hidden',
            }}
          >
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
            <View 
              className="absolute bg-white/95 flex-row items-center shadow-sm"
              style={{
                top: hp('1%'),
                left: wp('2%'),
                paddingHorizontal: wp('2%'),
                paddingVertical: hp('0.5%'),
                borderRadius: wp('4%'),
                gap: wp('1%'),
              }}
            >
              <View
                style={{ 
                  width: wp('1.5%'), 
                  height: wp('1.5%'), 
                  borderRadius: wp('0.75%'),
                  backgroundColor: item.isActive ? '#10B981' : '#F97316',
                }}
              />
              <Text 
                className="font-semibold text-gray-700 uppercase"
                style={{ fontSize: wp('2.6%') }}
              >
                {item.isActive ? 'Active' : 'Reviewing'}
              </Text>
            </View>
            {/* Photo Count */}
            {hasPhotos && (
              <View 
                className="absolute bg-black/60"
                style={{
                  top: hp('1%'),
                  right: wp('2%'),
                  paddingHorizontal: wp('1.5%'),
                  paddingVertical: hp('0.5%'),
                  borderRadius: wp('1%'),
                }}
              >
                <Text 
                  className="font-bold text-white"
                  style={{ fontSize: wp('2.4%') }}
                >
                  {item.images.length} imgs
                </Text>
              </View>
            )}
            {/* Delete button */}
            <TouchableOpacity
              onPress={() => handleDelete(item._id)}
              className="absolute bg-white items-center justify-center shadow-md border border-gray-100"
              style={{
                bottom: hp('1%'),
                left: wp('2%'),
                width: wp('8%'),
                height: wp('8%'),
                borderRadius: wp('4%'),
              }}
            >
              <Ionicons name="trash" size={wp('4%')} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* Text details */}
          <View 
            className="flex-1 justify-between"
            style={{ marginLeft: wp('4%') }}
          >
            <View>
              <View 
                className="flex-row items-center"
                style={{ gap: wp('1%'), marginBottom: hp('0.4%') }}
              >
                <Text 
                  className="font-bold text-blue-600 uppercase tracking-wider"
                  style={{ fontSize: wp('2.6%') }}
                >
                  Featured Project
                </Text>
                <Text className="text-gray-400" style={{ fontSize: wp('2.6%') }}>•</Text>
                <Text 
                  className="text-gray-500 font-semibold uppercase"
                  style={{ fontSize: wp('2.6%') }}
                >
                  {item.projectType}
                </Text>
              </View>
              <Text 
                className="text-[#101828] font-bold" 
                style={{ fontSize: wp('4.2%') }}
                numberOfLines={1}
              >
                {item.projectName || item.title || 'Project'}
              </Text>
              <Text 
                className="text-gray-400" 
                style={{ fontSize: wp('3.2%'), marginTop: hp('0.2%') }}
                numberOfLines={1}
              >
                by {item.builderName || "Developer"}
              </Text>
            </View>
            <View 
              className="flex-row items-center"
              style={{ gap: wp('2%'), marginTop: hp('0.8%') }}
            >
              <Text 
                className="text-gray-500 font-normal"
                style={{ fontSize: wp('3.2%') }}
              >
                {item.completionDate ? `Date: ${formatDateOnly(item.completionDate)}` : 'Completion N/A'}
              </Text>
              <Text className="text-gray-300">|</Text>
              <View 
                className="bg-gray-100"
                style={{
                  paddingHorizontal: wp('2%'),
                  paddingVertical: hp('0.5%'),
                  borderRadius: wp('1%'),
                }}
              >
                <Text 
                  className="font-medium text-gray-600 uppercase"
                  style={{ fontSize: wp('2.6%') }}
                >
                  {getCityName(item.city)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons Row */}
        <View 
          className="flex-row items-center justify-end border-t border-[#F2F4F7] relative z-50"
          style={{
            gap: wp('5%'),
            marginTop: hp('1.8%'),
            paddingTop: hp('1.8%'),
          }}
        >
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
            <Ionicons name="eye-outline" size={wp('5%')} color="#2563EB" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleEdit(item)}
            className="p-1"
          >
            <Ionicons name="create-outline" size={wp('5%')} color="#D97706" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDelete(item._id)}
            className="p-1"
          >
            <Ionicons name="trash-outline" size={wp('5%')} color="#DC2626" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleProjectMenu(item._id, item)}
            className="p-1"
          >
            <Ionicons name="ellipsis-vertical" size={wp('5%')} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header Bar */}
      <LinearGradient 
        colors={['#006B73', '#008E96']} 
        className="shadow-md"
        style={{
          paddingHorizontal: wp('4%'),
          paddingTop: hp('5%'),
          paddingBottom: hp('3%'),
          borderBottomLeftRadius: wp('8%'),
          borderBottomRightRadius: wp('8%'),
        }}
      >
        <View 
          className="flex-row justify-between items-center"
          style={{ marginBottom: hp('1.5%') }}
        >
          <View 
            className="flex-row items-center"
            style={{ gap: wp('2%') }}
          >
            <TouchableOpacity
              onPress={() => {
                router.replace('/screens/Buy/Buy');
              }}
              style={{ marginRight: wp('1%') }}
            >
              <Ionicons name="arrow-back" size={wp('6%')} color="white" />
            </TouchableOpacity>
            <Text 
              className="text-white font-bold"
              style={{ fontSize: wp('4.8%') }}
            >
              {userName ? `${userName}'s Console` : "My Projects"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleCreateProject}
            className="bg-white/25 flex-row items-center"
            style={{
              paddingHorizontal: wp('3%'),
              paddingVertical: hp('1%'),
              borderRadius: wp('5%'),
              gap: wp('1%'),
            }}
          >
            <Ionicons name="add" size={wp('4%')} color="white" />
            <Text 
              className="text-white font-semibold"
              style={{ fontSize: wp('3.2%') }}
            >
              Add New
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Filter Options */}
      <View 
        className="bg-white border-b border-[#F2F4F7] flex-row justify-between items-center"
        style={{
          paddingHorizontal: wp('4%'),
          paddingVertical: hp('1.5%'),
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: wp('2%') }}
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
          <TouchableOpacity 
            onPress={clearFilters} 
            style={{
              paddingHorizontal: wp('2%'),
              paddingVertical: hp('0.5%'),
            }}
          >
            <Text 
              className="text-[#EF4444] font-bold uppercase tracking-wider"
              style={{ fontSize: wp('3%') }}
            >
              Reset
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Projects List */}
      <View 
        className="flex-1"
        style={{
          paddingHorizontal: wp('4%'),
          marginTop: hp('1.8%'),
        }}
      >
        {loading || apiLoading ? (
          <View 
            className="flex-1 items-center justify-center"
            style={{ paddingVertical: hp('10%') }}
          >
            <ActivityIndicator size="large" color="#008E96" />
            <Text 
              className="text-gray-500 font-medium"
              style={{ marginTop: hp('1.8%'), fontSize: wp('3.7%') }}
            >
              Loading your projects...
            </Text>
          </View>
        ) : filteredProjects.length > 0 ? (
          <FlatList
            data={filteredProjects}
            keyExtractor={item => item._id}
            renderItem={renderProjectCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: hp('3%') }}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListHeaderComponent={() => (
              <Text 
                className="text-gray-500 font-medium"
                style={{ fontSize: wp('3.2%'), marginBottom: hp('1.2%') }}
              >
                Showing {filteredProjects.length} out of {projects.length} projects
              </Text>
            )}
          />
        ) : (
          <View 
            className="flex-1 items-center justify-center"
            style={{
              paddingVertical: hp('10%'),
              paddingHorizontal: wp('8%'),
            }}
          >
            <View 
              className="rounded-full bg-[#E6F7F7] items-center justify-center"
              style={{
                width: wp('16%'),
                height: wp('16%'),
                borderRadius: wp('8%'),
                marginBottom: hp('1.8%'),
              }}
            >
              <Ionicons name="business-outline" size={wp('8%')} color="#008E96" />
            </View>
            <Text 
              className="text-[#101828] font-bold text-center"
              style={{ fontSize: wp('4.8%') }}
            >
              No Projects Found
            </Text>
            <Text 
              className="text-gray-500 font-normal text-center"
              style={{ fontSize: wp('3.7%'), marginTop: hp('0.8%') }}
            >
              {projects.length > 0
                ? 'Try resetting or changing your search filters.'
                : "You haven't posted any builder projects yet. Click below to post."}
            </Text>
            {projects.length === 0 && (
              <TouchableOpacity
                onPress={handleCreateProject}
                className="bg-[#008E96] shadow-md"
                style={{
                  marginTop: hp('2.5%'),
                  paddingHorizontal: wp('6%'),
                  paddingVertical: hp('1.5%'),
                  borderRadius: wp('3%'),
                }}
              >
                <Text 
                  className="text-white font-semibold"
                  style={{ fontSize: wp('3.7%') }}
                >
                  Post Project for FREE
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Dropdown Modals */}
      {renderSelectionModal()}

      {/* Project Actions Bottom Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!activeMenuProjectId}
        onRequestClose={() => { setActiveMenuProjectId(null); setMenuProject(null); }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => { setActiveMenuProjectId(null); setMenuProject(null); }}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: wp('7%'),
              borderTopRightRadius: wp('7%'),
              paddingBottom: hp('4.5%'),
              paddingTop: hp('1%'),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.12,
              shadowRadius: 20,
              elevation: 20,
            }}>
              {/* Handle */}
              <View style={{ alignItems: 'center', paddingVertical: hp('1.5%') }}>
                <View style={{ width: wp('10%'), height: hp('0.5%'), backgroundColor: '#E5E7EB', borderRadius: 999 }} />
              </View>

              {/* Project Name Header */}
              {menuProject && (
                <View style={{ paddingHorizontal: wp('6%'), paddingBottom: hp('2%'), borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                  <Text style={{ fontWeight: '700', fontSize: wp('4.2%'), color: '#101828' }} numberOfLines={1}>
                    {menuProject.projectName || menuProject.title || 'Project'}
                  </Text>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%'), color: '#6B7280', marginTop: hp('0.2%') }}>
                    Manage project content
                  </Text>
                </View>
              )}

              {/* Action: Add Property Summary */}
              <TouchableOpacity
                onPress={() => menuProject && handleAddSummary(menuProject)}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: wp('6%'),
                  paddingVertical: hp('2.2%'),
                  borderBottomWidth: 1,
                  borderBottomColor: '#F9FAFB',
                }}
              >
                <View style={{
                  width: wp('11%'),
                  height: wp('11%'),
                  borderRadius: wp('3.5%'),
                  backgroundColor: '#ECFDF5',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: wp('4%'),
                }}>
                  <Ionicons name="add-circle-outline" size={wp('5.5%')} color="#059669" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', fontSize: wp('4%'), color: '#0F172A' }}>
                    Add Property Summary
                  </Text>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%'), color: '#9CA3AF', marginTop: hp('0.2%') }}>
                    Write a description for this project
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={wp('4.5%')} color="#D1D5DB" />
              </TouchableOpacity>

              {/* Action: View Property Summary */}
              <TouchableOpacity
                onPress={() => menuProject && handleViewSummary(menuProject)}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: wp('6%'),
                  paddingVertical: hp('2.2%'),
                }}
              >
                <View style={{
                  width: wp('11%'),
                  height: wp('11%'),
                  borderRadius: wp('3.5%'),
                  backgroundColor: '#EFF6FF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: wp('4%'),
                }}>
                  <Ionicons name="document-text-outline" size={wp('5.5%')} color="#2563EB" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', fontSize: wp('4%'), color: '#0F172A' }}>
                    View Property Summary
                  </Text>
                  <Text style={{ fontWeight: '400', fontSize: wp('3.2%'), color: '#9CA3AF', marginTop: hp('0.2%') }}>
                    Preview the existing summary
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={wp('4.5%')} color="#D1D5DB" />
              </TouchableOpacity>

              {/* Cancel */}
              <TouchableOpacity
                onPress={() => { setActiveMenuProjectId(null); setMenuProject(null); }}
                activeOpacity={0.7}
                style={{
                  marginHorizontal: wp('6%'),
                  marginTop: hp('1.5%'),
                  backgroundColor: '#F9FAFB',
                  borderRadius: wp('3.5%'),
                  paddingVertical: hp('1.8%'),
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontWeight: '600', fontSize: wp('4%'), color: '#4B5563' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default MyProjects;
