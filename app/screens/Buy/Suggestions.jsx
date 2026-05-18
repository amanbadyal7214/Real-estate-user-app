import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import PropertyCard from '../../../components/PropertyCard';
import { useProject } from '../../../hooks/useProject';
import { useLocation } from '../../context/LocationContext';
import api from "../../api";

const Suggestions = () => {
  const router = useRouter();
  const { fetchProjects, loading } = useProject();
  const { currentLocation } = useLocation();
  const [projectsList, setProjectsList] = useState([]);

  const loadSuggestions = useCallback(async () => {
    try {
      const city = currentLocation?.city || 'Mohali';
      const res = await fetchProjects({ 
        city,
        limit: 10 
      });
      
      const projects = Array.isArray(res) ? res : (res?.data || []);
      
      // Fetch summaries (BHK configurations) for each project in parallel
      const projectsWithSummaries = await Promise.all(
        projects.map(async (p) => {
          try {
            const summaryRes = await api.get(`/projects/${p._id}/summaries`);
            // The API returns { success: true, data: [ { summaries: [...] } ] }
            const summaryGroups = summaryRes.data?.data || [];
            const allSummaries = summaryGroups.flatMap(group => group.summaries || []);
            return { ...p, configurations: allSummaries };
          } catch (err) {
            console.warn(`Failed to fetch summaries for project ${p._id}:`, err?.message);
            return p;
          }
        })
      );

      setProjectsList(projectsWithSummaries);
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    }
  }, [fetchProjects, currentLocation?.city]);

  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  // Transform API data to PropertyCard format
  const suggestionsData = projectsList.map((p, index) => {
    // Handle price range and BHK flats info
    const avgRateLabel = p.avgPriceUnit?.label || 'Sq. Ft';
    
    // Extract unique BHK types for the bhkFlats summary text
    const bhkTypes = p.configurations?.map(s => `${s.structure?.value || ''} ${s.structure?.id?.name || 'BHK'}`).filter((v, i, a) => a.indexOf(v) === i);
    const bhkInfo = bhkTypes?.length > 0 ? bhkTypes.join(', ') : 'Apartments';
    
    return {
      id: p._id || `proj-${index}`,
      _id: p._id,
      projectName: p.projectName || 'Project',
      location: p.addressLine1 || (p.city?.name ? `${p.city.name}` : 'Mohali'),
      priceRange: p.avgPriceRate ? `₹ ${p.avgPriceRate} / ${avgRateLabel}` : 'View Details',
      possessionDate: p.possessionStatus?.label || 'TBA',
      avgRate: p.avgPriceRate ? `₹ ${p.avgPriceRate}` : 'TBA',
      bhkFlats: bhkInfo,
      image: p.media?.[0]?.fileUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60",
      imageCount: p.media?.length || 0,
      reraCertified: p.isReraApproved ?? true,
      configurations: p.configurations?.map(s => ({
        type: `${s.structure?.value || ''} ${s.structure?.id?.name || 'BHK'}`,
        area: `${s.area} ${s.areaUnit?.label || 'Sq. Ft'}`,
        price: s.price ? `₹ ${s.price}` : (p.avgPriceRate ? `₹ ${(p.avgPriceRate * s.area).toLocaleString()}` : 'Price on Request')
      })) || []
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pb-5 border-b border-[#E4E7EC] bg-white">
        <TouchableOpacity onPress={() => router.back()} className="w-9 h-9 justify-center items-center rounded-full">
          <ArrowLeft size={24} color="#4A5565" />
        </TouchableOpacity>
        
        <View className="items-center flex-1">
          <Text className="text-[19px] font-inter-bold text-[#101828] leading-[24px] text-center">
            {suggestionsData.length > 0 ? `${suggestionsData.length} Smart Suggestions` : 'Smart Suggestions'}
          </Text>
          <Text className="text-[13px] text-[#6A7282] font-inter-regular leading-[16px] text-center mt-0.5">
            Based on your last search in {currentLocation?.city || 'Mohali'}
          </Text>
        </View>

        <TouchableOpacity className="w-9 h-9 justify-center items-center rounded-full">
          <Share2 size={24} color="#4A5565" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {loading && projectsList.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#008E96" />
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          {suggestionsData.length > 0 ? (
            suggestionsData.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))
          ) : (
            <View className="flex-1 items-center justify-center mt-10">
              <Text className="font-inter-medium text-[#6A7282]">No suggestions found for this location.</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* <BottomTabBar activeTab="Suggestions" /> */}
    </SafeAreaView>
  );
};

export default Suggestions;

