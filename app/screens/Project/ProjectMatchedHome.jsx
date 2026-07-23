import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import NoDataFound from '../../../components/NoDataFound';
import PerfectMatchCard from '../../../components/PerfectMatchCard';
import { useProject } from '../../../hooks/useProject';
import { useLocation } from '../../context/LocationContext';
import { formatPricePerSqft } from '../../utils/formatPrice';

const ProjectMatchedHome = () => {
  const { fetchProjects, loading: projectsLoading } = useProject();
  const { currentLocation } = useLocation();
  const searchParams = useLocalSearchParams();
  const searchQuery = searchParams.city || currentLocation?.city || '';
  const [properties, setProperties] = useState([]);
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

    fetchMatches();
  }, [searchQuery, fetchProjects, searchParams.city, currentLocation?.city]);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} edges={['top', 'left', 'right']}>
      <View 
        className="flex-row items-center"
        style={{
          paddingHorizontal: wp('4.3%'),
          paddingVertical: hp('2%'),
          gap: wp('3%')
        }}
      >
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="justify-center items-center"
          style={{ width: wp('9.6%'), height: wp('9.6%') }}
        >
          <ArrowLeft size={wp('6.4%')} color="#4A5565" />
        </TouchableOpacity>
        <Text 
          className="font-bold text-[#101828]"
          style={{ fontSize: wp('5.3%') }}
        >Perfectly Matched Projects</Text>
      </View>

      <View style={{ marginBottom: hp('2%') }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: wp('4.3%'),
            gap: wp('1.1%'),
            height: hp('11.7%'),
            alignItems: 'center',
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => handleTabPress(tab)}
                className="justify-center items-center"
                style={{ height: hp('7.9%'), marginHorizontal: wp('0.5%') }}
              >
                {isActive ? (
                  <View 
                    className="relative h-full justify-center items-center"
                    style={{ paddingHorizontal: wp('6.4%') }}
                  >
                    <View 
                      className="absolute inset-0 border border-[#008E96]" 
                      style={{
                        borderRadius: wp('5.3%'),
                        backgroundColor: 'rgba(0, 142, 150, 0.08)',
                      }}
                    />
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: wp('3.7%'),
                        lineHeight: hp('2.5%'),
                        textAlign: 'center',
                        color: '#008E96',
                      }}
                    >
                      {tab.label}
                    </Text>
                  </View>
                ) : (
                  <View
                    className="border border-[#E4E7EC] justify-center items-center"
                    style={{
                      borderRadius: wp('5.3%'),
                      paddingHorizontal: wp('5.3%'),
                      paddingVertical: hp('1.5%'),
                      height: hp('6.9%'),
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: wp('3.7%'),
                        lineHeight: hp('2.5%'),
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

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: wp('4.3%'), paddingBottom: hp('3%') }}
      >
        {loading ? (
          <View 
            className="items-center justify-center"
            style={{ paddingVertical: hp('10%') }}
          >
            <ActivityIndicator size="large" color="#008E96" />
            <Text 
              className="text-[#6A7282] font-medium"
              style={{ marginTop: hp('1.8%'), fontSize: wp('3.7%') }}
            >Searching...</Text>
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
