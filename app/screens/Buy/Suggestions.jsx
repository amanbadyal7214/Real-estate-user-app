import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import PropertyCard from '../../../components/PropertyCard';
import BottomTabBar from '../../navigation/BottomTabBar';

const Suggestions = () => {
  const router = useRouter();

  // Mock Data
  const suggestionsData = [
    {
      id: 1,
      projectName: "Nirwana The Moksha",
      location: "Khanpur, Mohali",
      priceRange: "₹ 45.03 L – ₹ 1.11 Cr",
      possessionDate: "Oct, 2030",
      avgRate: "₹5,700",
      bhkFlats: "1, 2, 3 BHK Flats",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60",
      imageCount: 22,
      reraCertified: true,
      configurations: [
        { type: "1 BHK", area: "790 sq.ft.", price: "₹45.03 L" },
        { type: "2 BHK", area: "1490 sq.ft.", price: "₹84.93 L" },
        { type: "3 BHK", area: "1940 sq.ft.", price: "₹1.11 Cr" }
      ]
    },
    {
      id: 2,
      projectName: "The Grand Residency",
      location: "Sector 62, Mohali",
      priceRange: "₹ 1.2 Cr – ₹ 2.5 Cr",
      possessionDate: "Dec, 2028",
      avgRate: "₹7,200",
      bhkFlats: "3, 4, 5 BHK Apartments",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
      imageCount: 15,
      reraCertified: true,
      configurations: [
        { type: "3 BHK", area: "2100 sq.ft.", price: "₹1.2 Cr" },
        { type: "4 BHK", area: "2800 sq.ft.", price: "₹1.8 Cr" },
        { type: "5 BHK", area: "3500 sq.ft.", price: "₹2.5 Cr" }
      ]
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4  pb-5 border-b border-[#E4E7EC] bg-white">
        <TouchableOpacity onPress={() => router.back()} className="w-9 h-9 justify-center items-center rounded-full">
          <ArrowLeft size={24} color="#4A5565" />
        </TouchableOpacity>
        
        <View className="items-center flex-1">
          <Text className="text-[19px] font-inter-bold text-[#101828] leading-[24px] text-center">
            10 Smart Suggestions
          </Text>
          <Text className="text-[13px] text-[#6A7282] font-inter-regular leading-[16px] text-center mt-0.5">
            Based on your last search in Mohali
          </Text>
        </View>

        <TouchableOpacity className="w-9 h-9 justify-center items-center rounded-full">
          <Share2 size={24} color="#4A5565" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {suggestionsData.map((item) => (
          <PropertyCard key={item.id} property={item} />
        ))}
      </ScrollView>

      <BottomTabBar activeTab="Suggestions" />
    </SafeAreaView>
  );
};

export default Suggestions;
