import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoDataFound from '../../components/NoDataFound';
import PerfectMatchCard from '../../components/PerfectMatchCard';
import { usePropertyDiscovery } from '../../hooks/usePropertyDiscovery';
import { useLocation } from '../context/LocationContext';
import { formatPrice } from '../utils/formatPrice';

const FullyFurnishedProperties = () => {
  const { findPropertiesByLocation, fetchProperties, loading: discoveryLoading } = usePropertyDiscovery();
  const { currentLocation } = useLocation();
  const searchParams = useLocalSearchParams();
  const [properties, setProperties] = useState([]);
  const loading = discoveryLoading;

  const fetchFullyFurnishedProperties = useCallback(async () => {
    try {
      const params = {
        limit: 40,
        lookingFor: searchParams.lookingFor || 'rent',
        furnishingStatus: 'fully_furnished',
      };

      const effectiveCity = searchParams.city || currentLocation?.city;
      if (effectiveCity) params.city = effectiveCity;

      let res = await findPropertiesByLocation(params);

      const emptyResult = !(res && ((Array.isArray(res) && res.length) || (Array.isArray(res?.data) && res.data.length) || (Array.isArray(res?.results) && res.results.length)));
      if (emptyResult && fetchProperties) {
        try {
          res = await fetchProperties({
            city: params.city,
            limit: 40,
            lookingFor: params.lookingFor,
            furnishingStatus: 'fully_furnished',
          });
        } catch (_err) {
          // Keep the original response if the fallback endpoint fails.
        }
      }

      const items = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.results)
            ? res.results
            : [];

      const mapped = items.map((property, index) => {
        const bedrooms = property?.residential?.bedrooms || property?.bhk || property?.bedrooms || 'N/A';
        const area = property?.area || property?.builtUpArea || property?.carpetArea || 'N/A';
        const areaUnit = property?.areaUnit?.name || property?.areaUnit?.label || property?.areaUnit || 'sq.ft.';
        const furnishing = property?.furnishingStatus || property?.furnishedStatus || property?.furnishing || 'Fully Furnished';
        const rawPrice = property?.priceRange || property?.priceText || property?.monthlyRent || property?.rent || property?.price || property?.amount;

        const price = typeof rawPrice === 'number'
          ? `${formatPrice(rawPrice)} / Month`
          : (typeof rawPrice === 'string' && rawPrice.trim())
            ? rawPrice
            : 'View details';

        return {
          id: property?._id || property?.id || property?.propertyId || `furnished-${index}`,
          price,
          name: property?.title || property?.projectName || property?.name || 'Property',
          developer: property?.owner?.name || property?.sellerName || 'Owner',
          location: [property?.localityName, property?.city?.name || property?.city, property?.state?.name || property?.state].filter(Boolean).join(', ') || 'Location not available',
          details: `${bedrooms} BHK • ${area} ${areaUnit} • ${furnishing}`,
          images: property?.images?.length > 0 ? property.images : [property?.media?.[0]?.fileUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600'],
          photoCount: property?.images?.length || 1,
          isRera: property?.isRera ?? false,
          zeroBrokerage: property?.zeroBrokerage ?? false,
        };
      });

      setProperties(mapped);
    } catch (err) {
      console.error('Fully Furnished Properties fetch error:', err);
      setProperties([]);
    }
  }, [currentLocation?.city, fetchProperties, findPropertiesByLocation, searchParams.city, searchParams.lookingFor]);

  useEffect(() => {
    fetchFullyFurnishedProperties();
  }, [fetchFullyFurnishedProperties]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="px-4 py-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 justify-center items-center">
          <ArrowLeft size={28} color="#101828" />
        </TouchableOpacity>
        <Text className="ml-2 text-[20px] text-[#101828] font-inter-semibold">Fully Furnished Properties</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        {loading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#008E96" />
            <Text className="mt-4 text-[#6A7282] font-inter-medium">Searching furnished rentals...</Text>
          </View>
        ) : properties.length > 0 ? (
          properties.map((property) => (
            <PerfectMatchCard key={property.id} property={property} />
          ))
        ) : (
          <NoDataFound title="No fully furnished properties found" description="Try expanding the city or check back later." />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FullyFurnishedProperties;
