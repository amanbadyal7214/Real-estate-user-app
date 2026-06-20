import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ArrowLeft, Folder, Heart, Search } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ActivityTabs from '../navigation/ActivityTabs';
import { useUserActivity } from '../../hooks/useUserActivity';
import PropertyCardSmall from '../../components/PropertyCardSmall';

const Saved = () => {
  const { tab } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState(tab || 'saved');
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
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  useEffect(() => {
    fetchActivitySummary().catch((err) => {
      console.error("Error fetching activity summary in Saved screen:", err);
    });
  }, [fetchActivitySummary]);

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
  }, [activeTab, fetchWishlistProperties, fetchRecentlyViewed, fetchContactedProperties, fetchRecentSearches]);

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
        <View className="flex-row flex-wrap" style={{ paddingHorizontal: wp('4%'), paddingTop: hp('2.5%'), gap: wp('3%'), paddingBottom: hp('12%') }}>
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
                  isWishlisted={true}
                  onWishlistToggle={() => {
                    fetchWishlistProperties().catch(err => console.error(err));
                    fetchActivitySummary().catch(err => console.error(err));
                  }}
                />
              </View>
            );
          })}
        </View>
      );
    }

    if (activeTab === 'seen' && recentlyViewed && recentlyViewed.length > 0) {
      return (
        <View className="flex-row flex-wrap" style={{ paddingHorizontal: wp('4%'), paddingTop: hp('2.5%'), gap: wp('3%'), paddingBottom: hp('12%') }}>
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
                  isWishlisted={wishlistProperties?.some(w => {
                    const wp = w.property || w;
                    return (wp._id || wp.id) === id;
                  })}
                  onWishlistToggle={() => {
                    fetchWishlistProperties().catch(err => console.error(err));
                    fetchActivitySummary().catch(err => console.error(err));
                  }}
                />
              </View>
            );
          })}
        </View>
      );
    }

    if (activeTab === 'contacted' && contactedProperties && contactedProperties.length > 0) {
      return (
        <View className="flex-row flex-wrap" style={{ paddingHorizontal: wp('4%'), paddingTop: hp('2.5%'), gap: wp('3%'), paddingBottom: hp('12%') }}>
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
                  isWishlisted={wishlistProperties?.some(w => {
                    const wp = w.property || w;
                    return (wp._id || wp.id) === id;
                  })}
                  onWishlistToggle={() => {
                    fetchWishlistProperties().catch(err => console.error(err));
                    fetchActivitySummary().catch(err => console.error(err));
                  }}
                />
              </View>
            );
          })}
        </View>
      );
    }

    if (activeTab === 'recent' && recentSearches && recentSearches.length > 0) {
      return (
        <View style={{ paddingHorizontal: wp('4%'), paddingTop: hp('2.5%'), paddingBottom: hp('12%') }}>
          {recentSearches.map((item, index) => {
            const name = item.searchName || item.name || `Search #${index + 1}`;
            const city = item.filters?.city || '';
            const category = item.filters?.category || '';
            const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '';

            return (
              <View key={item._id || index} className="w-full bg-[#F7F9FA] border border-[#E4E7EC] flex-row justify-between items-center" style={{ borderRadius: wp('4%'), padding: wp('4%'), marginBottom: hp('1.5%') }}>
                <View className="flex-1">
                  <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('3.8%'), marginBottom: hp('0.5%') }} className="font-semibold text-[#101828]">{name}</Text>
                  <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.3%') }} className="text-[#6A7282]">
                    {city && `City: ${city}`} {category && ` • Category: ${category}`}
                  </Text>
                </View>
                {date && (
                  <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3%') }} className="text-[#6A7282]">
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
      <View className="flex-1 items-center justify-center" style={{ paddingHorizontal: wp('16%'), marginTop: hp('-10%') }}>
        {/* Illustration Container */}
        <View className="items-center justify-center relative" style={{ width: wp('50%'), height: wp('50%'), marginBottom: hp('4%') }}>
          <View className="absolute inset-0 items-center justify-center">
            <Folder size={wp('30%')} color="#008E96" strokeWidth={1.5} fill="rgba(28, 178, 169, 0.15)" />
          </View>
          <View className="absolute bg-white p-1 rounded-sm border border-[#008E96]" style={{ top: wp('10%'), right: wp('10%') }}>
             <Heart size={wp('4%')} color="#008E96" fill="#008E96" />
          </View>
          <View className="absolute" style={{ bottom: wp('12%'), right: wp('12%') }}>
             <Search size={wp('6%')} color="#008E96" strokeWidth={2.5} />
          </View>
          <View className="absolute rounded-full bg-[#008E961A]" style={{ left: wp('6%'), top: '50%', width: wp('2%'), height: wp('2%') }} />
          <View className="absolute rounded-full bg-[#008E961A]" style={{ right: wp('6%'), top: '66%', width: wp('2%'), height: wp('2%') }} />
          <View className="absolute rounded-full bg-[#008E961A]" style={{ left: wp('10%'), bottom: '33%', width: wp('2%'), height: wp('2%') }} />
        </View>

        {/* Button */}
        <TouchableOpacity 
          className="items-center justify-center bg-[#008E961A]"
          style={{ height: hp('6%'), paddingHorizontal: wp('8%'), borderRadius: wp('3.5%') }}
          activeOpacity={0.7}
        >
          <Text 
            className="text-[#008E96] font-medium text-center"
            style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.8%') }}
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
      <View className="flex-row items-center border-b border-[#E4E7EC]" style={{ paddingHorizontal: wp('4%'), height: hp('8.5%') }}>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="items-center justify-center rounded-full"
          style={{ width: wp('9%'), height: wp('9%'), marginRight: wp('3%') }}
        >
          <ArrowLeft size={wp('6%')} color="#101828" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('5.3%') }} className="font-semibold text-[#101828]">
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

