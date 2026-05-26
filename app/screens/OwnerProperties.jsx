import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoDataFound from '../../components/NoDataFound';
import PerfectMatchCard from '../../components/PerfectMatchCard';
import { useLocality } from '../../hooks/useLocality';
import { usePropertyDiscovery } from '../../hooks/usePropertyDiscovery';
import { useLocation } from '../context/LocationContext';
import { formatPrice } from '../utils/formatPrice';

const OwnerProperties = () => {
  const { findPropertiesByLocation, fetchProperties, loading: discoveryLoading } = usePropertyDiscovery();
  const { resolveLocalities, loading: localityLoading } = useLocality();
  const loading = discoveryLoading || localityLoading;
  const { currentLocation } = useLocation();
  const searchParams = useLocalSearchParams();
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.city || currentLocation?.city || '');

  const fetchOwnerProperties = useCallback(async () => {
    try {
      const params = { limit: 40, lookingFor: searchParams.lookingFor || 'rent' };
      const effectiveCity = searchParams.city || currentLocation?.city;

      if (effectiveCity) params.city = effectiveCity;

      // Prefer server-side sellerType filtering; fall back to broader fetch if needed
      params.sellerType = 'owner';

      let res = await findPropertiesByLocation(params);

      // If no results, try alternate param shapes
      const emptyResult = !(res && ((Array.isArray(res) && res.length) || (Array.isArray(res?.data) && res.data.length) || (Array.isArray(res?.results) && res.results.length)));
      if (emptyResult && fetchProperties) {
        try {
          res = await fetchProperties({ city: params.city, owner: true, limit: 40 });
        } catch (e) {
          // ignore and keep existing res
        }
      }

      const items = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.results)
            ? res.results
            : [];

      if (items.length === 0) {
        setProperties([]);
        return;
      }

      const enriched = await resolveLocalities(items);
      setProperties(enriched || items);
    } catch (err) {
      console.error('Owner Properties fetch error:', err);
      setProperties([]);
    }
  }, [currentLocation?.city, findPropertiesByLocation, fetchProperties, resolveLocalities, searchParams.city, searchParams.lookingFor]);

  useEffect(() => {
    fetchOwnerProperties();
  }, [fetchOwnerProperties]);

  const mapped = properties.map((property, index) => ({
    id: property._id || property.id || `owner-${index}`,
    price: (() => {
      const raw = property.price ?? property.priceRange;
      if (typeof raw === 'number') return formatPrice(raw);
      if (typeof raw === 'string') {
        if (raw.trim().startsWith('₹')) return raw;
        const digits = raw.replace(/[^0-9.]/g, '');
        const num = Number(digits);
        if (Number.isFinite(num) && num > 0) return formatPrice(num);
        return raw;
      }
      return 'View details';
    })(),
    name: property.title || property.projectName || property.name || 'Property',
    developer: property.owner?.name || property.sellerName || 'Owner',
    location: [property.localityName, property.city?.name || property.city, property.state?.name || property.state].filter(Boolean).join(', ') || 'Location not available',
    details: `${property.residential?.bedrooms || property.bhk || property.bedrooms || 'N/A'} BHK • ${property.area || 'N/A'} ${property.areaUnit?.name || 'sq.ft.'}`,
    seller: property.owner?.name || property.sellerName || 'Owner',
    images: property.images?.length > 0 ? property.images : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600'],
    photoCount: property.images?.length || 0,
    isRera: property.isRera ?? false,
    zeroBrokerage: property.zeroBrokerage ?? false,
  }));

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="px-4 py-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 justify-center items-center">
          <ArrowLeft size={28} color="#101828" />
        </TouchableOpacity>
        <Text className="ml-2 text-[20px] text-[#101828] font-inter-semibold">Owner Properties</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        {loading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#008E96" />
            <Text className="mt-4 text-[#6A7282] font-inter-medium">Searching owner listings...</Text>
          </View>
        ) : mapped.length > 0 ? (
          mapped.map((property) => (
            <PerfectMatchCard key={property.id} property={property} />
          ))
        ) : (
          <NoDataFound title="No owner-listed properties found" description="Try expanding the city or check back later." />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OwnerProperties;
