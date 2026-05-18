import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoDataFound from '../../components/NoDataFound';
import PerfectMatchCard from '../../components/PerfectMatchCard';
import { useLocality } from '../../hooks/useLocality';
import { usePropertyDiscovery } from '../../hooks/usePropertyDiscovery';
import { useLocation } from '../context/LocationContext';
import Svg, { Path } from 'react-native-svg';

const BestPriceProperty = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const { currentLocation } = useLocation();
  const { fetchBetterPricedProperties, loading: discoveryLoading } = usePropertyDiscovery();
  const { resolveLocalities, loading: localityLoading } = useLocality();
  const loading = discoveryLoading || localityLoading;

  const [properties, setProperties] = useState([]);
  const [tabs, setTabs] = useState([
    { id: 1, label: 'Best Price Properties' },
    { id: 2, label: 'Smart Deals' },
    { id: 3, label: 'Ready to move' },
    { id: 4, label: 'Independent House' },
    { id: 5, label: 'Resale' },
    { id: 6, label: 'Saved' },
  ]);

  const [activeTab, setActiveTab] = useState(tabs[0].label);

  const fetchMatches = useCallback(async () => {
    try {
      const params = { 
        limit: 20, 
        lookingFor: 'sell',
        PriceAscending: true 
      };
      
      const effectiveCity = searchParams.city || currentLocation?.city;
      if (effectiveCity) params.city = effectiveCity;
      if (searchParams.locality) params.locality = searchParams.locality;
      if (searchParams.pincode) params.pincode = searchParams.pincode;

      const res = await fetchBetterPricedProperties(params);
      if (res.success) {
        const enriched = await resolveLocalities(res.data);
        setProperties(enriched);
      }
    } catch (err) {
      console.error('Best Price Fetch Error:', err);
    }
  }, [currentLocation?.city, fetchBetterPricedProperties, searchParams.city, searchParams.locality, searchParams.pincode, resolveLocalities]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleTabPress = (clickedTab) => {
    setActiveTab(clickedTab.label);
    
    setTabs(prevTabs => {
      const newTabs = [...prevTabs];
      const clickedIndex = newTabs.findIndex(t => t.id === clickedTab.id);
      [newTabs[0], newTabs[clickedIndex]] = [newTabs[clickedIndex], newTabs[0]];
      return newTabs;
    });
  };

  const matchedProperties = properties.map((property, index) => ({
    id: property._id || property.id || `best-${index}`,
    price: typeof property.price === 'number' ? `₹ ${property.price}` : property.price || property.priceRange || 'View details',
    name: property.title || property.projectName || 'Property',
    developer: property.projectName ? `by ${property.projectName}` : `by ${property.owner?.name || 'Developer'}`,
    location: [property.localityName, property.city?.name || property.city, property.state?.name || property.state].filter(Boolean).join(', ') || 'Location not available',
    details: `${property.residential?.bedrooms || property.bhk || property.bedrooms || 'N/A'} BHK Flats • ${property.area || 'N/A'} ${property.areaUnit?.name || 'sq.ft.'}`,
    seller: property.owner?.name || property.sellerName || 'Seller',
    images: property.images?.length > 0 ? property.images : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600'],
    photoCount: property.images?.length || 0,
    isRera: true,
    zeroBrokerage: true
  }));

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 justify-center items-center">
          <ArrowLeft size={28} color="#101828" />
        </TouchableOpacity>
        <Text className="ml-2 text-[20px] text-[#101828] font-inter-semibold">Better Price Properties</Text>
      </View>

      {/* Filter Tabs */}
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
                    <View className="absolute inset-0">
                      <Svg width="100%" height="64" viewBox="0 0 191 64" preserveAspectRatio="none">
                        <Path
                          d="M16.25 1H174.25C182.534 1 189.25 7.716 189.25 16V40C189.25 44.5 187.75 47.5 185.25 50C183.25 52 180.917 53.8333 178.25 55.5C175.583 57.1667 172.583 58.5 169.25 59.5C165.917 60.5 162.25 61.3333 158.25 62C154.25 62.6667 150.25 63 146.25 63H44.25C40.25 63 36.25 62.6667 32.25 62C28.25 61.3333 24.5833 60.5 21.25 59.5C17.9167 58.5 14.9167 57.1667 12.25 55.5C9.58333 53.8333 7.25 52 5.25 50C2.75 47.5 1.25 44.5 1.25 40V16C1.25 7.716 7.966 1 16.25 1Z"
                          fill="#008E96"
                          fillOpacity="0.08"
                          stroke="#008E96"
                          strokeWidth="2.5"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    </View>
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

      {/* Property List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        {loading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#008E96" />
            <Text className="mt-4 text-[#6A7282] font-inter-medium">Finding best prices...</Text>
          </View>
        ) : matchedProperties.length > 0 ? (
          matchedProperties.map((property) => (
            <PerfectMatchCard key={property.id} property={property} />
          ))
        ) : (
          <NoDataFound />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BestPriceProperty;
