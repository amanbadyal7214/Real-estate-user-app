import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, RefreshCcw } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PerfectMatchCard from '../../components/PerfectMatchCard';
import { useLocality } from '../../hooks/useLocality';
import { usePropertyDiscovery } from '../../hooks/usePropertyDiscovery';

const HighDemandProduct = () => {
  const router = useRouter();
  const { city, locality, pincode } = useLocalSearchParams();
  const { fetchHighDemandProperties, loading: discoveryLoading, error } = usePropertyDiscovery();
  const { resolveLocalities, loading: localityLoading } = useLocality();
  const [projects, setProjects] = useState([]);

  const loading = discoveryLoading || localityLoading;

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    const num = parseFloat(price);
    if (num >= 10000000) {
      return `₹ ${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `₹ ${(num / 100000).toFixed(2)} L`;
    }
    return `₹ ${num.toLocaleString('en-IN')}`;
  };

  const loadHighDemandProperties = async () => {
    try {
      const response = await fetchHighDemandProperties({
        limit: 10,
        city,
        locality,
        pincode,
        lookingFor: 'sell'
      });

      // API returns { success: true, data: [...] }
      const propertiesArray = response?.data || response || [];

      if (!Array.isArray(propertiesArray)) {
        console.error("API did not return an array:", response);
        setProjects([]);
        return;
      }

      // Map API data to the format expected by PerfectMatchCard
      const enrichedArray = await resolveLocalities(propertiesArray);

      const formattedData = enrichedArray.map(property => {
        const price = property.price?.$numberDecimal || property.price || 0;
        const totalArea = property.totalArea || property.area || 1; // Avoid division by zero
        const pricePerSqft = price > 0 ? (price / totalArea).toFixed(0) : 0;

        return {
          id: property._id,
          price: formatPrice(price),
          name: property.title || 'Property Name',
          developer: `by ${property.seller?.name || 'Developer'}`,
          location: `${property.localityName || property.locality?.name || ''}, ${property.city?.name || ''}`,
          details: `${property.bhk || 0} BHK ${property.propertyType?.name || property.propertyType || ''} • ₹ ${pricePerSqft} per sq.ft.`,
          seller: property.seller?.name,
          isRera: property.isRera || false,
          zeroBrokerage: property.zeroBrokerage || false,
          images: property.images && property.images.length > 0
            ? property.images
            : ["https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=203&auto=format&fit=crop"]
        };
      });
      setProjects(formattedData);
    } catch (err) {
      console.error("Error fetching high demand properties:", err);
    }
  };

  useEffect(() => {
    loadHighDemandProperties();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 flex-row items-center py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-1"
        >
          <ArrowLeft size={24} color="#101828" />
        </TouchableOpacity>
        <Text className="text-[24px] font-inter-bold text-[#101828] ml-2">
          High Demand Properties
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
            <Text className="mt-4 font-inter-medium text-[#6A7282]">Fetching high demand projects...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center py-20 px-10">
            <Text className="text-red-500 font-inter-semibold text-center mb-4">{error}</Text>
            <TouchableOpacity
              onPress={loadHighDemandProperties}
              className="flex-row items-center gap-2 bg-[#008E96] px-6 py-3 rounded-xl"
            >
              <RefreshCcw size={18} color="white" />
              <Text className="text-white font-inter-bold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : projects.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="font-inter-medium text-[#6A7282]">No high demand projects found.</Text>
          </View>
        ) : (
          projects.map((item) => (
            <PerfectMatchCard key={item.id} property={item} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HighDemandProduct;
