import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, RefreshCcw } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import PerfectMatchCard from '../../components/PerfectMatchCard';
import { useProject } from '../../hooks/useProject';
import { formatPrice } from '../utils/formatPrice';

const ProjectInFocus = () => {
  const router = useRouter();
  const { city, locality, pincode } = useLocalSearchParams();
  const { fetchProjects, loading: apiLoading, error } = useProject();
  const [projectsList, setProjectsList] = useState([]);

  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  const loading = isInitialLoading || apiLoading;

  const loadFocusProjects = async (pageToFetch = 1, isLoadMore = false) => {
    if (isLoadMore && (loadingMore || !hasMore)) return;

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setIsInitialLoading(true);
      setHasMore(true);
      setPage(1);
    }

    try {
      const params = {
        isFocus: true,
        limit: 10,
        page: pageToFetch,
        city,
        locality,
        pincode
      };

      const response = await fetchProjects(params);

      // API returns array or { data: [...] }
      const data = response?.data || response || [];

      if (!Array.isArray(data)) {
        if (!isLoadMore) {
          setProjectsList([]);
        }
        setHasMore(false);
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

      if (isLoadMore) {
        setProjectsList((prev) => [...prev, ...formattedData]);
      } else {
        setProjectsList(formattedData);
      }

      if (formattedData.length < params.limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setPage(pageToFetch);
    } catch (err) {
      console.error("Error fetching focus projects:", err);
      if (!isLoadMore) {
        setProjectsList([]);
      }
      setHasMore(false);
    } finally {
      setIsInitialLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadFocusProjects(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, locality, pincode]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center" style={{ paddingHorizontal: wp('4%'), paddingTop: hp('2%'), paddingBottom: hp('2.5%') }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: wp('1%') }}
        >
          <ArrowLeft size={wp('6%')} color="#101828" />
        </TouchableOpacity>
        <Text className="font-inter-bold text-[#101828]" style={{ fontSize: wp('6%'), marginLeft: wp('2%') }}>
          Project in Focus
        </Text>
      </View>

      {/* Content */}
      {loading && projectsList.length === 0 ? (
        <View className="flex-1 items-center justify-center" style={{ paddingVertical: hp('10%') }}>
          <ActivityIndicator size="large" color="#008E96" />
          <Text className="font-inter-medium text-[#6A7282]" style={{ marginTop: hp('2%'), fontSize: wp('3.5%') }}>Fetching focus projects...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center" style={{ paddingVertical: hp('10%'), paddingHorizontal: wp('10%') }}>
          <Text className="text-red-500 font-inter-semibold text-center" style={{ marginBottom: hp('2%'), fontSize: wp('3.5%') }}>{error}</Text>
          <TouchableOpacity
            onPress={() => loadFocusProjects(1, false)}
            className="flex-row items-center bg-[#008E96]"
            style={{ gap: wp('2%'), paddingHorizontal: wp('6%'), paddingVertical: hp('1.5%'), borderRadius: wp('3%') }}
          >
            <RefreshCcw size={wp('4.5%')} color="white" />
            <Text className="text-white font-inter-bold" style={{ fontSize: wp('3.5%') }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          className="flex-1"
          style={{ paddingHorizontal: wp('4%') }}
          data={projectsList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PerfectMatchCard
              property={item}
              showWishlist={false}
              onPress={() => router.push({
                pathname: '/screens/ProjectDetails',
                params: { projectId: item.id }
              })}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp('2.5%') }}
          onEndReached={() => {
            if (hasMore && !loadingMore && !loading) {
              loadFocusProjects(page + 1, true);
            }
          }}
          onEndReachedThreshold={0.2}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center" style={{ paddingVertical: hp('10%') }}>
              <Text className="font-inter-medium text-[#6A7282]" style={{ fontSize: wp('3.5%') }}>No focus projects found.</Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <View className="items-center justify-center" style={{ paddingVertical: hp('2%') }}>
                <ActivityIndicator size="small" color="#008E96" />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ProjectInFocus;

