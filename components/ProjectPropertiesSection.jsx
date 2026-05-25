import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import api from '../app/api';
import { formatPrice } from '../app/utils/formatPrice';

const ProjectPropertyCard = ({ property }) => {
  const [localityName, setLocalityName] = useState('Loading...');

  useEffect(() => {
    const localityObj = property.locality;
    if (typeof localityObj === 'object' && localityObj !== null) {
      setLocalityName(localityObj.label || localityObj.name || 'N/A');
    } else if (typeof localityObj === 'string') {
      api.get(`/localities/${localityObj}`)
        .then(res => {
          if (res.data?.success && res.data?.data) {
            setLocalityName(res.data.data.name || res.data.data.label || 'N/A');
          } else {
            setLocalityName('N/A');
          }
        })
        .catch(err => {
          console.warn("Failed to fetch locality:", err?.response?.data || err.message);
          setLocalityName('N/A');
        });
    } else {
      setLocalityName('N/A');
    }
  }, [property.locality]);

  // using shared formatPrice

  const image = property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1512915922686-57c11f9ad6b3?auto=format&fit=crop&q=80&w=400';
  const name = property.title || 'N/A';

  const bhk = property.subPropertyType?.label || property.subPropertyType?.name || 'N/A';
  const area = property.area ? `${property.area} sq.ft` : 'N/A';
  const price = formatPrice(property.price);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push({ pathname: '/screens/PropertyDetails', params: { propertyId: property._id } })}
      className="bg-white border border-[#E5E7EB] rounded-[14px] p-3 mr-3 overflow-hidden shadow-sm"
      style={{ width: 280 }}
    >
      <Image
        source={{ uri: typeof image === 'string' ? image : image?.url }}
        className="w-full h-[128px] rounded-[10px] mb-3"
      />
      <Text className="font-inter-medium text-[#0A0A0A] text-[14px] mb-1" numberOfLines={1}>{name}</Text>
      <Text className="font-inter-regular text-[#6A7282] text-[12px] mb-4" numberOfLines={1}>{localityName}</Text>

      <View className="gap-2 mb-4">
        <View className="flex-row justify-between items-center">
          <Text className="font-inter-regular text-[#6A7282] text-[12px]">Property Type</Text>
          <View className="flex-row items-center">
            <Text className="font-inter-regular text-[#0A0A0A] text-[12px] mr-1">{bhk}</Text>
          </View>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="font-inter-regular text-[#6A7282] text-[12px]">Area</Text>
          <View className="flex-row items-center">
            <Text className="font-inter-regular text-[#0A0A0A] text-[12px] mr-1">{area}</Text>
          </View>
        </View>
      </View>

      <Text className="font-inter-regular text-[#0A0A0A] text-[18px] mb-3">{price}</Text>

      <TouchableOpacity className="border-2 border-[#008E96] rounded-[10px] h-[40px] items-center justify-center">
        <Text className="text-[#008E96] font-inter-medium text-[14px]">Contact</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const ProjectPropertiesSection = ({ projectId, localityId, cityId, cityName, propertyType, lookingFor = 'sell', title = "Properties in this Project" }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const endpoint = projectId ? `/projects/${projectId}/properties` : "/properties";
        const params = {
          lookingFor,
          city: (cityName || cityId || 'mohali'),
          limit: 6
        };

        if (!projectId) {
          if (localityId) {
            params.locality = localityId;
          } else if (cityId) {
            params.city = cityId;
          }
        }

        if (propertyType) {
          params.propertyType = propertyType;
        }

        const response = await api.get(endpoint, { params });

        const data = response.data?.success && response.data?.data ? response.data.data : (Array.isArray(response.data) ? response.data : []);
        setProperties(data);
      } catch (err) {
        console.warn("Failed to fetch related properties:", err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [projectId, localityId, cityId, propertyType, cityName, lookingFor]);

  if (loading) {
    return (
      <View className="w-full py-4 items-center justify-center">
        <ActivityIndicator size="small" color="#008E96" />
        <Text className="text-[#6A7282] mt-2">Loading properties...</Text>
      </View>
    );
  }

  if (properties.length === 0) {
    return null; // Don't show the section if no properties
  }

  return (
    <View className="w-full">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="font-inter-medium text-[#101828] text-[18px]">{title}</Text>
        <TouchableOpacity className="border border-[#E5E7EB] rounded-full px-3 py-1 bg-white">
          <Text className="font-inter-medium text-[#0A0A0A] text-[14px]">Top ↑</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4 mb-4">
        {properties.map((prop, index) => (
          <ProjectPropertyCard key={prop._id || index} property={prop} />
        ))}
      </ScrollView>

      <TouchableOpacity className="mx-4 bg-[#008E96] rounded-[14px] h-[48px] items-center justify-center">
        <Text className="text-white font-inter-medium text-[16px]">Contact sellers</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProjectPropertiesSection;
