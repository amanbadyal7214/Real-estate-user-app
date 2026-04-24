import { router } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryTabs from '../../navigation/CategoryTabs';
import SearchBox from '../../../components/SearchBox';
import UserHeader from '../../../components/UserHeader';

const Rent = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top Header */}
      <UserHeader />

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* Main Category Blue Container */}
        <View className="mx-4 mt-2 p-4 rounded-[32px] bg-[#E6F4F5]">
          <CategoryTabs
            activeTab="Rent"
            onTabPress={(tabId) => {
              if (tabId === 'Buy') {
                router.push('/screens/Buy/Buy');
              } else if (tabId !== 'Rent') {
                // handle other tabs if needed
                router.push(`/screens/${tabId}/${tabId}`);
              }
            }}
          />

          <SearchBox 
            placeholder="Search city, locality, landmark for rent ..."
            onPress={() => router.push('/screens/Buy/BuySearch')} // Using BuySearch as common search screen
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Rent;
