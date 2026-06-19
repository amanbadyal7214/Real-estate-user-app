import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import PropertyCard from '../../../components/PropertyCard';
import { useProject } from '../../../hooks/useProject';
import { useLocation } from '../../context/LocationContext';
import api from "../../api";

const PAGE_LIMIT = 10;

const Suggestions = () => {
  const router = useRouter();
  const { fetchProjects, loading } = useProject();
  const { currentLocation } = useLocation();
  const [projectsList, setProjectsList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const isFetchingRef = useRef(false);

  const enrichWithSummaries = async (projects) => {
    return Promise.all(
      projects.map(async (p) => {
        try {
          const summaryRes = await api.get(`/projects/${p._id}/summaries`);
          const summaryGroups = summaryRes.data?.data || [];
          const allSummaries = summaryGroups.flatMap(group => group.summaries || []);
          return { ...p, configurations: allSummaries };
        } catch (err) {
          console.warn(`Failed to fetch summaries for project ${p._id}:`, err?.message);
          return p;
        }
      })
    );
  };

  const loadSuggestions = useCallback(async (pageNum = 1) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const city = currentLocation?.city || 'Mohali';
      const res = await fetchProjects({
        city,
        limit: PAGE_LIMIT,
        page: pageNum,
      });

      const projects = Array.isArray(res) ? res : (res?.data || []);

      if (projects.length < PAGE_LIMIT) {
        setHasMore(false);
      }

      const enriched = await enrichWithSummaries(projects);

      if (pageNum === 1) {
        setProjectsList(enriched);
      } else {
        setProjectsList(prev => [...prev, ...enriched]);
      }
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    } finally {
      isFetchingRef.current = false;
      setLoadingMore(false);
    }
  }, [fetchProjects, currentLocation?.city]);

  // Initial load
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setProjectsList([]);
    loadSuggestions(1);
  }, [loadSuggestions]);

  const handleLoadMore = () => {
    if (!hasMore || loading || loadingMore || isFetchingRef.current) return;
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    loadSuggestions(nextPage);
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
  };

  // Transform API data to PropertyCard format
  const suggestionsData = projectsList.map((p, index) => {
    const avgRateLabel = p.avgPriceUnit?.label || 'Sq. Ft';
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
      <View className="flex-row items-center justify-between border-b border-[#E4E7EC] bg-white" style={{ paddingHorizontal: wp('4.3%'), paddingBottom: hp('2.5%') }}>
        <TouchableOpacity onPress={() => router.back()} className="justify-center items-center rounded-full" style={{ width: wp('9.6%'), height: wp('9.6%') }}>
          <ArrowLeft size={wp('6.4%')} color="#4A5565" />
        </TouchableOpacity>

        <View className="items-center flex-1">
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('5.1%'), lineHeight: hp('3%') }} className="text-[#101828] text-center">
            {suggestionsData.length > 0 ? `${suggestionsData.length} Smart Suggestions` : 'Smart Suggestions'}
          </Text>
          <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.5%'), lineHeight: hp('2%'), marginTop: hp('0.2%') }} className="text-[#6A7282] text-center">
            Based on your last search in {currentLocation?.city || 'Mohali'}
          </Text>
        </View>

        <TouchableOpacity className="justify-center items-center rounded-full" style={{ width: wp('9.6%'), height: wp('9.6%') }}>
          <Share2 size={wp('6.4%')} color="#4A5565" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {loading && projectsList.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#008E96" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: wp('4.3%'), paddingTop: hp('2.5%'), paddingBottom: hp('3.7%') }}
          showsVerticalScrollIndicator={false}
          className="flex-1"
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              handleLoadMore();
            }
          }}
          scrollEventThrottle={400}
        >
          {suggestionsData.length > 0 ? (
            suggestionsData.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))
          ) : (
            <View className="flex-1 items-center justify-center" style={{ marginTop: hp('4.9%') }}>
              <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.5%') }} className="text-[#6A7282]">No suggestions found for this location.</Text>
            </View>
          )}

          {/* Load more indicator */}
          {loadingMore && (
            <View className="items-center" style={{ paddingVertical: hp('3%') }}>
              <ActivityIndicator size="small" color="#008E96" />
            </View>
          )}

          {/* End of list message */}
          {!hasMore && suggestionsData.length > 0 && (
            <View className="items-center" style={{ paddingVertical: hp('3%') }}>
              <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.5%') }} className="text-[#6A7282]">You've seen all suggestions</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Suggestions;
