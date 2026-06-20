import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useLocation } from '../app/context/LocationContext';
import { formatPrice } from '../app/utils/formatPrice';
import { usePropertyDiscovery } from '../hooks/usePropertyDiscovery';
import FurnishedPropertyCard from './FurnishedPropertyCard';

const FurnishedPropertiesSection = () => {
  const [properties, setProperties] = useState([]);
  const { fetchProperties, findPropertiesByLocation } = usePropertyDiscovery();
  const { currentLocation } = useLocation();

  useEffect(() => {
    let isMounted = true;
    const city = currentLocation?.city || 'Mohali';

    const isLikelyId = (v) => typeof v === 'string' && /^[a-f0-9]{24}$/i.test(v);
    const humanize = (v) => {
      if (v === null || v === undefined) return '';
      if (typeof v === 'string') return isLikelyId(v) ? '' : v.trim();
      if (typeof v === 'number') return String(v);
      if (typeof v === 'object') return v.name || v.label || v.title || v.value || '';
      return String(v);
    };

    const loadProperties = async () => {
      try {
        // Use city-specific endpoint to fetch properties for this section
        const response = await findPropertiesByLocation({
          city,
          limit: 4,
          lookingFor: 'rent',
          furnishingStatus: 'fully_furnished',
        });

        if (!isMounted) return;

        const items = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.properties)
              ? response.properties
              : Array.isArray(response?.results)
                ? response.results
                : [];

        const mapped = items.map((property, index) => {
          const bedroomsRaw = property?.residential?.bedrooms ?? property?.bhk ?? property?.bedrooms ?? property?.configuration?.bhk;
          const bedrooms = humanize(bedroomsRaw);

          let areaRaw = property?.area ?? property?.areaValue ?? property?.size ?? property?.builtUpArea ?? property?.carpetArea ?? property?.residential?.area ?? property?.unit?.area;
          if (typeof areaRaw === 'object') areaRaw = areaRaw.value || areaRaw.size || areaRaw.area || '';
          areaRaw = humanize(areaRaw);

          const areaUnitRaw = property?.areaUnit?.name || property?.areaUnit?.label || property?.areaUnit || property?.unit?.areaUnit || '';
          const areaUnit = humanize(areaUnitRaw) || 'sq.ft.';

          const furnishedStatus = humanize(property?.furnishing) || humanize(property?.furnishedStatus) || humanize(property?.furnishingStatus) || 'Fully Furnished';
          const priceValue = property?.priceRange ?? property?.priceText ?? property?.monthlyRent ?? property?.rent ?? property?.price ?? property?.amount;

          const localityPart = humanize(property?.locality?.name) || humanize(property?.localityName) || humanize(property?.locality);
          const cityPart = humanize(property?.city?.name) || humanize(property?.city) || humanize(city);
          const addressPart = humanize(property?.address) || humanize(property?.location);

          const locationStr = [addressPart, localityPart, cityPart].filter(Boolean).join(', ') || city;

          return {
            id: property?._id || property?.id || property?.propertyId || `furnished-${index}`,
            image: property?.media?.[0]?.fileUrl || property?.images?.[0] || property?.coverImage || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
            price: typeof priceValue === 'number' ? `${formatPrice(priceValue)} / Month` : (priceValue ? String(priceValue) : 'View details'),
            title: humanize(property?.title) || humanize(property?.name) || humanize(property?.propertyName) || `${bedrooms || 'Property'} BHK Property`,
            location: locationStr,
            furnishedStatus,
            area: `${bedrooms ? `${bedrooms} BHK • ` : ''}${areaRaw ? `${areaRaw} ${areaUnit}` : 'Area not available'}`,
          };
        });

        setProperties(mapped);
      } catch (_error) {
        if (isMounted) setProperties([]);
      }
    };

    loadProperties();

    return () => {
      isMounted = false;
    };
  }, [currentLocation, fetchProperties, findPropertiesByLocation]);

  const data = properties;

  return (
    <View className="mx-4 sm:mx-6 md:mx-8 rounded-[24px] bg-[#F5F5F5] py-4 sm:py-6 mb-4">
      <View className="mb-4 flex-row items-start justify-between px-4 sm:px-6">
        <View className="flex-1 pr-4">
          <Text className="font-inter-bold text-[17px] sm:text-[22px] leading-8 text-[#101828]">Fully Furnished Properties</Text>
          <Text className="mt-[-2px] sm:mt-1 font-inter-regular text-[13px] sm:text-[15px] leading-6 text-[#6A7282]">Most sought-after rental properties</Text>
        </View>
        <TouchableOpacity
          className="pt-[5px] sm:pt-2 active:opacity-80"
          onPress={() => router.push('/screens/FullyFurnishedProperties')}
        >
          <Text className="font-inter-medium text-[14px] sm:text-[16px] text-[#008E96]">See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName="px-4 sm:px-6 gap-4"
      >
        {data.map(item => (
          <FurnishedPropertyCard key={item.id} {...item} />
        ))}
      </ScrollView>
    </View>
  );
};

export default FurnishedPropertiesSection;
