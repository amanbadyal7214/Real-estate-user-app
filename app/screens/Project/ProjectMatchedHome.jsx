import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoDataFound from '../../../components/NoDataFound';
import PerfectMatchCard from '../../../components/PerfectMatchCard';
import { useProject } from '../../../hooks/useProject';
import { useLocation } from '../../context/LocationContext';
import { formatPricePerSqft } from '../../utils/formatPrice';

const ProjectMatchedHome = () => {
  const { fetchProjects, loading: projectsLoading } = useProject();
  const { currentLocation } = useLocation();
  const searchParams = useLocalSearchParams();
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.city || currentLocation?.city || '');
  const [tabs, setTabs] = useState([
    { id: 1, label: 'Perfectly Matches Homes' },
    { id: 2, label: 'Smart Deals' },
    { id: 3, label: 'Ready to move' },
    { id: 4, label: 'Independent House' },
    { id: 5, label: 'Resale' },
    { id: 6, label: 'Saved' },
  ]);
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  const loading = projectsLoading;

  useEffect(() => {
    fetchMatches();
  }, [searchQuery]);

  const fetchMatches = async () => {
    try {
      const params = { limit: 20 };
      const effectiveCity = searchParams.city || currentLocation?.city;

      if (effectiveCity) {
        params.city = effectiveCity;
      }

      if (searchQuery.trim().length > 0) {
        if (/^\d{6}$/.test(searchQuery)) {
          params.pincode = searchQuery;
          delete params.city;
        } else {
          params.city = searchQuery;
        }
      }

      const res = await fetchProjects(params);
      const data = Array.isArray(res) ? res : (res?.data || []);
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Match Fetch Error:', err);
    }
  };

  const handleTabPress = (clickedTab) => {
    setActiveTab(clickedTab.label);
    setTabs((prevTabs) => {
      const newTabs = [...prevTabs];
      const clickedIndex = newTabs.findIndex((tab) => tab.id === clickedTab.id);
      [newTabs[0], newTabs[clickedIndex]] = [newTabs[clickedIndex], newTabs[0]];
      return newTabs;
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="px-4 py-4 flex-row items-center gap-3">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 justify-center items-center">
          <ArrowLeft size={28} color="#4A5565" />
        </TouchableOpacity>
        <Text className="font-inter-bold text-[20px] text-[#101828]">Perfectly Matched Projects</Text>
      </View>

      <View className="mb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 4, height: 95, alignItems: 'center' }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => handleTabPress(tab)}
                className="justify-center items-center"
                style={{ height: 64, marginHorizontal: 2 }}
              >
                {isActive ? (
                  <View className="relative h-full justify-center items-center px-6">
                    <View className="absolute inset-0 rounded-[20px] bg-[#008E96]/8 border border-[#008E96]" />
                    <Text
                      style={{
                        fontFamily: 'Inter-SemiBold',
                        fontSize: 14,
                        lineHeight: 21,
                        textAlign: 'center',
                        color: '#008E96',
                      }}
                    >
                      {tab.label}
                    </Text>
                  </View>
                ) : (
                  <View
                    className="border border-[#E4E7EC] rounded-[20px] px-5 py-3 justify-center items-center"
                    style={{ height: 56 }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Inter-SemiBold',
                        fontSize: 14,
                        lineHeight: 21,
                        textAlign: 'center',
                        color: '#6A7282',
                      }}
                    >
                      {tab.label}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        {loading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#008E96" />
            <Text className="mt-4 text-[#6A7282] font-inter-medium">Searching...</Text>
          </View>
        ) : properties.length > 0 ? (
          properties.map((property, index) => {
            const locationText = [
              property.localityName || property.locality || '',
              property.district || property.city?.name || property.city || '',
            ].filter(Boolean).join(', ');

            const priceText = property.priceRange
              || (property.avgPriceRate ? formatPricePerSqft(property.avgPriceRate) : 'Price on Request');

            return (
            <PerfectMatchCard
              key={property._id || property.id || `project-${index}`}
              showWishlist={false}
              property={{
                id: property._id || property.id || `project-${index}`,
                price: priceText,
                name: property.projectName || property.title || 'Project',
                developer: `by ${property.builder?.name || property.builderInfo?.name || 'Developer'}`,
                location: locationText || 'Mohali',
                details: `${property.area || 'N/A'} ${property.areaUnit?.label || property.areaUnit?.name || 'sq.ft.'} • ${property.possessionStatus?.label || 'Project'}`,
                seller: property.builder?.name || property.builderInfo?.name || 'Seller',
                images: property.media?.length > 0
                  ? property.media.map((mediaItem) => mediaItem.fileUrl).filter(Boolean)
                  : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600'],
                photoCount: property.media?.length || property.images?.length || 0,
                isRera: Boolean(property.isReraApproved),
                zeroBrokerage: true
              }}
            />
          );
          })
        ) : (
          <NoDataFound />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProjectMatchedHome;
