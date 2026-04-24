import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Folder, Heart, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import ActivityTabs from '../navigation/ActivityTabs';

const Saved = () => {
  const [activeTab, setActiveTab] = useState('saved');
  const router = useRouter();

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
      <ActivityTabs activeTab={activeTab} onTabPress={setActiveTab} />

      {/* Content Area - Based on ActivityPage EmptyState CSS */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white">
        <View className="flex-1 items-center justify-center px-16 -mt-20">
          {/* Illustration Container */}
          <View className="w-[200px] h-[200px] items-center justify-center relative mb-8">
            {/* Using Lucide Folder icon to represent the main shape in image */}
            <View className="absolute inset-0 items-center justify-center">
              <Folder size={120} color="#008E96" strokeWidth={1.5} fill="rgba(28, 178, 169, 0.15)" />
            </View>
            {/* Small floating icons as seen in the image */}
            <View className="absolute top-10 right-10 bg-white p-1 rounded-sm border border-[#008E96]">
               <Heart size={16} color="#008E96" fill="#008E96" />
            </View>
            <View className="absolute bottom-12 right-12">
               <Search size={24} color="#008E96" strokeWidth={2.5} />
            </View>
            {/* Small dots like in the image */}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Saved;

