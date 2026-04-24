import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import InsightPropertyCard from '../../../components/InsightPropertyCard';
import BottomTabBar from '../../navigation/BottomTabBar';

const mockProperties = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400&auto=format&fit=crop',
    possession: 'Possession by Dec, 2028',
    title: 'Urban Heights Premium',
    location: 'Sector 127, Mohali',
    price: '₹ 95.5 L - 2.1 Cr',
    bhk: '3, 4 BHK Apartment',
    area: '2150 sq.ft.',
    isRera: true
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d93688?q=80&w=400&auto=format&fit=crop',
    possession: 'Possession by Nov, 2027',
    title: 'Amayra Sky Villas',
    location: 'Daun Majra, Mohali',
    price: '₹ 80.25 L - 1.63 Cr',
    bhk: '2, 3 BHK Apartment',
    area: '1338 sq.ft.',
    isRera: true
  }
];

const Insights = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <TouchableOpacity 
          className="flex-row items-center px-4 mt-2"
          onPress={() => router.back()}
        >
          <ArrowLeft size={18} color="#6A7282" />
          <Text className="text-[#6A7282] text-[14px] font-inter-medium ml-2">Back to Home</Text>
        </TouchableOpacity>

        <View className="px-4 mt-6 mb-3">
          <Text className="text-[#6A7282] text-[13px] font-inter-medium">Hi Prerna Sablok,</Text>
          <Text className="text-[#101828] text-[24px] font-inter-bold mt-1">Welcome back!</Text>
        </View>

        {/* New Listings Section */}
        <View className="pl-4">
          <View className="flex-row items-center justify-between pr-4 mb-4">
            <Text className="text-[#101828] text-[16px] font-inter-semibold">New Listings added nearby</Text>
            <TouchableOpacity>
              <Text className="text-[#008E96] text-[13px] font-inter-medium">See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {mockProperties.map((prop) => (
              <InsightPropertyCard key={prop.id} {...prop} />
            ))}
          </ScrollView>
        </View>

        {/* Revisit Properties Section */}
        <View className="pl-4 mt-8">
          <View className="flex-row items-center justify-between pr-4 mb-4">
            <Text className="text-[#101828] text-[16px] font-inter-semibold">Revisit properties seen by you</Text>
            <TouchableOpacity>
              <Text className="text-[#008E96] text-[13px] font-inter-medium">See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {mockProperties.map((prop, index) => (
              <InsightPropertyCard key={`revisit-${index}`} {...prop} />
            ))}
          </ScrollView>
        </View>

      </ScrollView>
      <BottomTabBar activeTab="Insights" />
    </SafeAreaView>
  );
};

export default Insights;
