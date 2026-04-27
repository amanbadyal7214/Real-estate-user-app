import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import PerfectMatchCard from '../../components/PerfectMatchCard';

const HighDemandProduct = () => {
  const router = useRouter();

  const projects = [
    {
      id: 1,
      price: "₹ 45.03 L - ₹ 1.11 Cr",
      name: "Nirwana The Moksha",
      developer: "by Nirwana Group",
      location: "Khanpur, Mohali",
      details: "1, 2, 3 BHK Flats • ₹ 5.7k per sq.ft.",
      seller: "Nirwana Group",
      isRera: true,
      zeroBrokerage: true,
      images: [
        "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=203&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=203&auto=format&fit=crop"
      ]
    },
    {
      id: 2,
      price: "₹ 55.00 L - ₹ 1.25 Cr",
      name: "Sunrise Greens",
      developer: "by Sunrise Developers",
      location: "Sector 12, Mohali",
      details: "2, 3 BHK Apartments • ₹ 6.2k per sq.ft.",
      seller: "Sunrise Developers",
      isRera: true,
      zeroBrokerage: false,
      images: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=203&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=203&auto=format&fit=crop"
      ]
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4   ">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-1"
        >
          <ArrowLeft size={24} color="#101828" />
        </TouchableOpacity>
        <Text className="text-[24px] font-inter-bold text-[#101828] ml-2">
          High Demand Projects
        </Text>
      </View>

      {/* Content */}
      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {projects.map((item) => (
          <PerfectMatchCard key={item.id} property={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HighDemandProduct;
