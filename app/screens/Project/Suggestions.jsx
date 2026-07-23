import { useRouter } from 'expo-router';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import PropertyCard from '../../../components/PropertyCard';
import { useProject } from '../../../hooks/useProject';
import api from '../../api';
import { useLocation } from '../../context/LocationContext';

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
        limit: 10,
      });

      const projects = Array.isArray(res) ? res : (res?.data || []);

      const projectsWithSummaries = await Promise.all(
        projects.map(async (project) => {
          try {
            const summaryRes = await api.get(`/projects/${project._id}/summaries`);
            const summaryGroups = summaryRes.data?.data || [];
            const allSummaries = summaryGroups.flatMap((group) => group.summaries || []);
            return { ...project, configurations: allSummaries };
          } catch (err) {
            console.warn(`Failed to fetch summaries for project ${project._id}:`, err?.message);
            return project;
          }
        })
      );

      setProjectsList(projectsWithSummaries);
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
    }
  }, [fetchProjects, currentLocation?.city]);

  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  const suggestionsData = projectsList.map((project, index) => {
    const avgRateLabel = project.avgPriceUnit?.label || 'Sq. Ft';
    const bhkTypes = project.configurations?.map((summary) => `${summary.structure?.value || ''} ${summary.structure?.id?.name || 'BHK'}`).filter((value, currentIndex, array) => array.indexOf(value) === currentIndex);
    const bhkInfo = bhkTypes?.length > 0 ? bhkTypes.join(', ') : 'Apartments';

    return {
      id: project._id || `proj-${index}`,
      _id: project._id,
      projectName: project.projectName || 'Project',
      location: project.addressLine1 || (project.city?.name ? `${project.city.name}` : 'Mohali'),
      priceRange: project.avgPriceRate ? `₹ ${project.avgPriceRate} / ${avgRateLabel}` : 'View Details',
      possessionDate: project.possessionStatus?.label || 'TBA',
      avgRate: project.avgPriceRate ? `₹ ${project.avgPriceRate}` : 'TBA',
      bhkFlats: bhkInfo,
      image: project.media?.[0]?.fileUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60',
      imageCount: project.media?.length || 0,
      reraCertified: project.isReraApproved ?? true,
      configurations: project.configurations?.map((summary) => ({
        type: `${summary.structure?.value || ''} ${summary.structure?.id?.name || 'BHK'}`,
        area: `${summary.area} ${summary.areaUnit?.label || 'Sq. Ft'}`,
        price: summary.price ? `₹ ${summary.price}` : (project.avgPriceRate ? `₹ ${(project.avgPriceRate * summary.area).toLocaleString()}` : 'Price on Request')
      })) || []
    };
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={{ paddingHorizontal: wp('4%'), paddingBottom: hp('2.2%') }} className="flex-row items-center justify-between border-b border-[#E4E7EC] bg-white">
        <TouchableOpacity onPress={() => router.back()} style={{ width: wp('9%'), height: wp('9%') }} className="justify-center items-center rounded-full">
          <ArrowLeft size={wp('6%')} color="#4A5565" />
        </TouchableOpacity>

        <View className="items-center flex-1">
          <Text style={{ fontSize: wp('5%'), lineHeight: wp('6.4%') }} className="font-bold text-[#101828] text-center">
            {suggestionsData.length > 0 ? `${suggestionsData.length} Smart Suggestions` : 'Smart Suggestions'}
          </Text>
          <Text style={{ fontSize: wp('3.5%'), lineHeight: wp('4.3%'), marginTop: hp('0.3%') }} className="text-[#6A7282] font-normal text-center">
            Based on your last search in {currentLocation?.city || 'Mohali'}
          </Text>
        </View>

        <TouchableOpacity style={{ width: wp('9%'), height: wp('9%') }} className="justify-center items-center rounded-full">
          <Share2 size={wp('6%')} color="#4A5565" />
        </TouchableOpacity>
      </View>

      {loading && projectsList.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#008E96" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: wp('4%'), paddingTop: hp('2.2%'), paddingBottom: hp('3.5%') }}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          {suggestionsData.length > 0 ? (
            suggestionsData.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))
          ) : (
            <View style={{ marginTop: hp('4%') }} className="flex-1 items-center justify-center">
              <Text style={{ fontSize: wp('3.7%') }} className="font-medium text-[#6A7282]">No suggestions found for this location.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Suggestions;
