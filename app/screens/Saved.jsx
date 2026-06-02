import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Folder, Heart, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import ActivityTabs from '../navigation/ActivityTabs';
import { useUserActivity } from '../../hooks/useUserActivity';
import PropertyCardSmall from '../../components/PropertyCardSmall';

const Saved = () => {
  const [activeTab, setActiveTab] = useState('saved');
  const router = useRouter();
  const {
    fetchActivitySummary,
    activitySummary,
    fetchRecentlyViewed,
    recentlyViewed,
    fetchContactedProperties,
    contactedProperties,
    fetchWishlistProperties,
    wishlistProperties,
    fetchRecentSearches,
    recentSearches,
    loading
  } = useUserActivity();

  useEffect(() => {
    fetchActivitySummary().catch((err) => {
      console.error("Error fetching activity summary in Saved screen:", err);
    });
  }, []);

  useEffect(() => {
    if (activeTab === 'saved') {
      fetchWishlistProperties().catch((err) => {
        console.error("Error fetching wishlist properties:", err);
      });
    } else if (activeTab === 'seen') {
      fetchRecentlyViewed().catch((err) => {
        console.error("Error fetching recently viewed:", err);
      });
    } else if (activeTab === 'contacted') {
      fetchContactedProperties().catch((err) => {
        console.error("Error fetching contacted properties:", err);
      });
    } else if (activeTab === 'recent') {
      fetchRecentSearches().catch((err) => {
        console.error("Error fetching recent searches:", err);
      });
    }
  }, [activeTab]);

  const formatPrice = (value) => {
    if (!value) return "Price on Request";
    if (value >= 10000000) {
      return `₹ ${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) {
      return `₹ ${(value / 100000).toFixed(1)} L`;
    }
    return `₹ ${value.toLocaleString('en-IN')}`;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center pt-20">
          <ActivityIndicator size="large" color="#008E96" />
        </View>
      );
    }

    if (activeTab === 'saved' && wishlistProperties && wishlistProperties.length > 0) {
      return (
        <View className="flex-row flex-wrap px-4 pt-5 gap-3 pb-24">
          {wishlistProperties.map((item, index) => {
            const property = item.property || item;
            const id = property._id || property.id;
            const title = property.title || property.projectName || 'Property';
            const price = typeof property.price === 'number' 
              ? formatPrice(property.price) 
              : (property.priceRange || 'Price on Request');
            const area = property.area 
              ? `${property.area} ${property.areaUnit?.label || 'sq. ft.'}` 
              : (property.bhkFlats || '');
            const location = property.locality?.label || property.locality || property.address || '';
            const image = (property.images && property.images[0]) || property.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60";

            return (
              <View key={id || index} style={{ width: '48%' }} className="mb-2">
                <PropertyCardSmall
                  id={id}
                  image={image}
                  price={price}
                  title={title}
                  area={area}
                  location={location}
                />
              </View>
            );
          })}
        </View>
      );
    }

    if (activeTab === 'seen' && recentlyViewed && recentlyViewed.length > 0) {
      return (
        <View className="flex-row flex-wrap px-4 pt-5 gap-3 pb-24">
          {recentlyViewed.map((item, index) => {
            const property = item.property || item;
            const id = property._id || property.id;
            const title = property.title || property.projectName || 'Property';
            const price = typeof property.price === 'number' 
              ? formatPrice(property.price) 
              : (property.priceRange || 'Price on Request');
            const area = property.area 
              ? `${property.area} ${property.areaUnit?.label || 'sq. ft.'}` 
              : (property.bhkFlats || '');
            const location = property.locality?.label || property.locality || property.address || '';
            const image = (property.images && property.images[0]) || property.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60";

            return (
              <View key={id || index} style={{ width: '48%' }} className="mb-2">
                <PropertyCardSmall
                  id={id}
                  image={image}
                  price={price}
                  title={title}
                  area={area}
                  location={location}
                />
              </View>
            );
          })}
        </View>
      );
    }

    if (activeTab === 'contacted' && contactedProperties && contactedProperties.length > 0) {
      return (
        <View className="flex-row flex-wrap px-4 pt-5 gap-3 pb-24">
          {contactedProperties.map((item, index) => {
            const property = item.property || item;
            const id = property._id || property.id;
            const title = property.title || property.projectName || 'Property';
            const price = typeof property.price === 'number' 
              ? formatPrice(property.price) 
              : (property.priceRange || 'Price on Request');
            const area = property.area 
              ? `${property.area} ${property.areaUnit?.label || 'sq. ft.'}` 
              : (property.bhkFlats || '');
            const location = property.locality?.label || property.locality || property.address || '';
            const image = (property.images && property.images[0]) || property.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60";

            return (
              <View key={id || index} style={{ width: '48%' }} className="mb-2">
                <PropertyCardSmall
                  id={id}
                  image={image}
                  price={price}
                  title={title}
                  area={area}
                  location={location}
                />
              </View>
            );
          })}
        </View>
      );
    }

    if (activeTab === 'recent' && recentSearches && recentSearches.length > 0) {
      return (
        <View className="px-4 pt-5 pb-24">
          {recentSearches.map((item, index) => {
            const name = item.searchName || item.name || `Search #${index + 1}`;
            const city = item.filters?.city || '';
            const category = item.filters?.category || '';
            const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '';

            return (
              <View key={item._id || index} className="w-full bg-[#F7F9FA] border border-[#E4E7EC] rounded-2xl p-4 mb-3 flex-row justify-between items-center">
                <View className="flex-1">
                  <Text style={{ fontFamily: 'Inter-SemiBold' }} className="text-[15px] font-semibold text-[#101828] mb-1">{name}</Text>
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[13px] text-[#6A7282]">
                    {city && `City: ${city}`} {category && ` • Category: ${category}`}
                  </Text>
                </View>
                {date && (
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[12px] text-[#6A7282]">
                    {date}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      );
    }

    // Default Empty State
    return (
      <View className="flex-1 items-center justify-center px-16 -mt-20">
        {/* Illustration Container */}
        <View className="w-[200px] h-[200px] items-center justify-center relative mb-8">
          <View className="absolute inset-0 items-center justify-center">
            <Folder size={120} color="#008E96" strokeWidth={1.5} fill="rgba(28, 178, 169, 0.15)" />
          </View>
          <View className="absolute top-10 right-10 bg-white p-1 rounded-sm border border-[#008E96]">
             <Heart size={16} color="#008E96" fill="#008E96" />
          </View>
          <View className="absolute bottom-12 right-12">
             <Search size={24} color="#008E96" strokeWidth={2.5} />
          </View>
          <View className="absolute left-6 top-1/2 w-2 h-2 rounded-full bg-[#008E961A]" />
          <View className="absolute right-6 top-2/3 w-2 h-2 rounded-full bg-[#008E961A]" />
          <View className="absolute left-10 bottom-1/3 w-2 h-2 rounded-full bg-[#008E961A]" />
        </View>

        {/* Button */}
        <TouchableOpacity 
          className="h-[48.5px] px-8 items-center justify-center bg-[#008E961A] rounded-[14px]"
          activeOpacity={0.7}
        >
          <Text 
            className="text-[#008E96] text-[15px] font-medium text-center"
            style={{ fontFamily: 'Inter-Medium' }}
          >
            Start new search
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header - Based on ActivityPage Header CSS */}
      <View className="flex-row items-center px-4 h-[68px] border-b border-[#E4E7EC]">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-9 h-9 items-center justify-center rounded-full mr-3"
        >
          <ArrowLeft size={24} color="#101828" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Inter-SemiBold' }} className="text-[21px] font-semibold text-[#101828]">
          My Activity
        </Text>
      </View>

      {/* Tab Bar Component */}
      <ActivityTabs 
        activeTab={activeTab} 
        onTabPress={setActiveTab} 
        counts={{
          wishlistCount: activitySummary?.wishlistCount ?? 0,
          viewedPropertiesCount: activitySummary?.viewedPropertiesCount ?? 0,
          contactedPropertiesCount: activitySummary?.contactedPropertiesCount ?? 0,
          recentSearchesCount: activitySummary?.recentSearchesCount ?? 0,
        }}
      />

      {/* Content Area */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white">
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Saved;

