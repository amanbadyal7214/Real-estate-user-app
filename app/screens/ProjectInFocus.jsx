import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, RefreshCcw } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PerfectMatchCard from '../../components/PerfectMatchCard';
import { useProject } from '../../hooks/useProject';
import { formatPrice } from '../utils/formatPrice';

const ProjectInFocus = () => {
  const router = useRouter();
  const { city, locality, pincode } = useLocalSearchParams();
  const { fetchProjects, loading, error } = useProject();
  const [projectsList, setProjectsList] = useState([]);

  // using shared formatPrice

  const loadFocusProjects = async () => {
    try {
      const response = await fetchProjects({
        isFocus: true,
        limit: 10,
        city,
        locality,
        pincode
      });

      // API returns array or { data: [...] }
      const data = response?.data || response || [];

      if (!Array.isArray(data)) {
        setProjectsList([]);
        return;
      }

      const formattedData = data.map(project => ({
        id: project._id,
        price: project.priceRange || (project.price ? formatPrice(project.price) : (project.avgPriceRate ? `₹ ${project.avgPriceRate} / ${project.avgPriceUnit?.label || 'sq.ft.'}` : "Price on Request")),
        name: project.projectName || project.title || 'Project Name',
        developer: `by ${project.builder?.name || 'Developer'}`,
        location: `${project.locality || ''}${project.locality ? ', ' : ''}${project.city?.name || project.city || ''}`,
        details: `${project.possessionStatus?.label || ''} • ₹ ${project.avgPriceRate || 'N/A'} per ${project.avgPriceUnit?.label || 'sq.ft.'}`,
        seller: project.builder?.name,
        isRera: project.isReraApproved || true,
        zeroBrokerage: true,
        images: project.media && project.media.length > 0
          ? project.media.map(m => m.fileUrl)
          : ["https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=203&auto=format&fit=crop"]
      }));
      setProjectsList(formattedData);
    } catch (err) {
      console.error("Error fetching focus projects:", err);
    }
  };

  useEffect(() => {
    loadFocusProjects();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pb-5 flex-row items-center pt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-1"
        >
          <ArrowLeft size={24} color="#101828" />
        </TouchableOpacity>
        <Text className="text-[24px] font-inter-bold text-[#101828] ml-2">
          Project in Focus
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#008E96" />
            <Text className="mt-4 font-inter-medium text-[#6A7282]">Fetching focus projects...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center py-20 px-10">
            <Text className="text-red-500 font-inter-semibold text-center mb-4">{error}</Text>
            <TouchableOpacity
              onPress={loadFocusProjects}
              className="flex-row items-center gap-2 bg-[#008E96] px-6 py-3 rounded-xl"
            >
              <RefreshCcw size={18} color="white" />
              <Text className="text-white font-inter-bold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : projectsList.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="font-inter-medium text-[#6A7282]">No focus projects found.</Text>
          </View>
        ) : (
          projectsList.map((item) => (
            <PerfectMatchCard
              key={item.id}
              property={item}
              showWishlist={false}
              onPress={() => router.push({
                pathname: '/screens/ProjectDetails',
                params: { projectId: item.id }
              })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProjectInFocus;
