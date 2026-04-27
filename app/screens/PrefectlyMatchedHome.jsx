import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PerfectMatchCard from '../../components/PerfectMatchCard';
import NoDataFound from '../../components/NoDataFound';
import Svg, { Path } from 'react-native-svg';

const PrefectlyMatchedHome = () => {
  const [tabs, setTabs] = useState([
    { id: 1, label: 'Perfectly Matches Homes' },
    { id: 2, label: 'Smart Deals' },
    { id: 3, label: 'Ready to move' },
    { id: 4, label: 'Independent House' },
    { id: 5, label: 'Resale' },
    { id: 6, label: 'Saved' },
  ]);

  const activeTab = tabs[0].label;

  const handleTabPress = (clickedTab) => {
    if (clickedTab.label === activeTab) return;
    
    setTabs(prevTabs => {
      const filtered = prevTabs.filter(t => t.id !== clickedTab.id);
      return [clickedTab, ...filtered];
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

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-4 ">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 justify-center">
          <ArrowLeft size={24} color="#4A5565" />
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
                style={{ width: isActive ? 191 : tab.label.length * 10 + 40, height: 64 }}
              >
                {isActive ? (
                  <View className="relative w-full h-full justify-center items-center">
                    <View className="absolute inset-0">
                      <Svg width="191" height="64" viewBox="0 0 191 64" fill="none">
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
        {activeTab === 'Perfectly Matches Homes' || activeTab === 'Smart Deals' ? (
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

export default PrefectlyMatchedHome;
