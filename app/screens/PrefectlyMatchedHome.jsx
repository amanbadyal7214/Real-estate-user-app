import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft , Search } from 'lucide-react-native';

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PerfectMatchCard from '../../components/PerfectMatchCard';
import NoDataFound from '../../components/NoDataFound';
import Svg, { Path } from 'react-native-svg';
import { usePropertyDiscovery } from '../../hooks/usePropertyDiscovery';
import { useLocation } from '../context/LocationContext';

const PrefectlyMatchedHome = () => {
  const { findPropertiesByLocation, loading } = usePropertyDiscovery();
  const { currentLocation } = useLocation();
  const searchParams = useLocalSearchParams();
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.city || currentLocation?.city || '');
  const [tabs, setTabs] = useState([
    { id: 1, label: 'Perfectly Matches Homes' },
    { id: 2, label: 'Smart Deals' },
    { id: 3, label: 'Ready to move' },
    { id: 4, label: 'Independent House' },
    { id: 5, label: 'Resale' },
    { id: 6, label: 'Saved' },
  ]);

  const [activeTab, setActiveTab] = useState(tabs[0].label);

  useEffect(() => {
    fetchMatches();
  }, [searchQuery]);

  const fetchMatches = async () => {
    try {
      const params = { limit: 20, lookingFor: 'sell' };
      
      // Check City from multiple sources (URL Params -> Context -> SearchBox)
      const effectiveCity = searchParams.city || currentLocation?.city;

      if (effectiveCity) {
        params.city = effectiveCity;
      }
      
      // Override with manual search query
      if (searchQuery.trim().length > 0) {
        if (/^\d{6}$/.test(searchQuery)) {
          params.pincode = searchQuery;
          delete params.city;
        } else {
          // Change manual search to search by city instead of locality
          params.city = searchQuery;
        }
      }

      const res = await findPropertiesByLocation(params);
      if (res.success) {
        setProperties(res.data);
      }
    } catch (err) {
      console.error("Match Fetch Error:", err);
    }
  };

  const handleTabPress = (clickedTab) => {
    setActiveTab(clickedTab.label);
    
    // Swap selected tab with the one at the first position
    setTabs(prevTabs => {
      const newTabs = [...prevTabs];
      const clickedIndex = newTabs.findIndex(t => t.id === clickedTab.id);
      
      // Swap elements at index 0 and clickedIndex
      [newTabs[0], newTabs[clickedIndex]] = [newTabs[clickedIndex], newTabs[0]];
      
      return newTabs;
    });
  };

  const matchedProperties = [
    {
      id: 1,
      price: '₹ 45.03 L - ₹ 1.11 Cr',
      name: 'Nirwana The Moksha',
      developer: 'by Nirwana Group',
      location: 'Khanpur, Mohali',
      details: '1, 2, 3 BHK Flats • ₹ 5.7k per sq.ft.',
      seller: 'Nirwana Group',
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400'
      ],
      photoCount: 22,
      isRera: true,
      zeroBrokerage: true
    },
    {
      id: 2,
      price: '₹ 45.03 L - ₹ 1.11 Cr',
      name: 'Nirwana The Moksha',
      developer: 'by Nirwana Group',
      location: 'Khanpur, Mohali',
      details: '1, 2, 3 BHK Flats • ₹ 5.7k per sq.ft.',
      seller: 'Nirwana Group',
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400'
      ],
      photoCount: 22,
      isRera: true,
      zeroBrokerage: true
    }
  ];

  const readyToMoveProperties = [
    {
      id: 1,
      price: '₹ 85.00 L - ₹ 1.50 Cr',
      name: 'Omaxe Cassia',
      developer: 'by Omaxe Group',
      location: 'New Chandigarh, Mohali',
      details: '3, 4 BHK Apartments • ₹ 6.5k per sq.ft.',
      seller: 'Omaxe Limited',
      images: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=400'
      ],
      photoCount: 15,
      isRera: true,
      zeroBrokerage: false
    },
    {
      id: 2,
      price: '₹ 1.10 Cr - ₹ 2.25 Cr',
      name: 'Hero Homes',
      developer: 'by Hero Realty',
      location: 'Sector 88, Mohali',
      details: '2, 3 BHK Flats • ₹ 7.2k per sq.ft.',
      seller: 'Hero Realty',
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=400'
      ],
      photoCount: 18,
      isRera: true,
      zeroBrokerage: true
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Header with Search */}
      <View className="px-4 py-2 flex-row items-center gap-3">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 justify-center items-center">
          <ArrowLeft size={28} color="#4A5565" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-row items-center border border-[#008E9633] bg-white h-[50px] px-5 rounded-[40px] flex-1"
          style={{ borderWidth: 1.5, borderColor: '#B2E0E2' }}
        >
          <Search size={22} color="#6A7282" />
          <TextInput
            placeholder="Locality, Pincode, City..."
            placeholderTextColor="#6A7282"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="ml-3 flex-1 text-[#101828] text-[16px]"
            style={{ fontFamily: 'Inter-Regular' }}
          />
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View className="flex-row px-4 gap-2 ">
        <TouchableOpacity className="flex-row items-center border border-[#6A7282] rounded-[24px] px-4 py-2 bg-white">
          <Text className="text-[#101828] text-[16px] mr-2" style={{ fontFamily: 'Inter-Medium' }}>Budget in Rs.</Text>
          <Svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <Path d="M1 1L5 5L9 1" stroke="#101828" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </Svg>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center border border-[#6A7282] rounded-[24px] px-4 py-2 bg-white">
          <Text className="text-[#101828] text-[16px] mr-2" style={{ fontFamily: 'Inter-Medium' }}>BHK type</Text>
          <Svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <Path d="M1 1L5 5L9 1" stroke="#101828" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </Svg>
        </TouchableOpacity>
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
            <Text className="mt-4 text-[#6A7282] font-inter-medium">Searching...</Text>
          </View>
        ) : properties.length > 0 ? (
          properties.map((property) => (
            <PerfectMatchCard 
              key={property._id} 
              property={{
                id: property._id,
                price: `₹ ${property.price}`,
                name: property.title,
                developer: property.projectName || "Unknown Developer",
                location: `${property.locality}, ${property.city}`,
                details: `${property.residential?.bedrooms || 0} BHK • ${property.area} ${property.areaUnit?.name || 'sq.ft.'}`,
                seller: property.owner?.name || "Seller",
                images: property.images?.length > 0 ? property.images : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600'],
                photoCount: property.images?.length || 0,
                isRera: true,
                zeroBrokerage: true
              }} 
            />
          ))
        ) : (
          <NoDataFound />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrefectlyMatchedHome;
