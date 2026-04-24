import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ContinueCards from '../../../components/ContinueCards';
import PropertySuggestionCard from '../../../components/PropertySuggestionCard';
import SearchBox from '../../../components/SearchBox';
import UserHeader from '../../../components/UserHeader';
import CategoryTabs from '../../navigation/CategoryTabs';
import RecommendedPropertyCard from '../../../components/RecommendedPropertyCard';

const Rent = () => {
    const recentSearches = [
        { title: 'Apartment, Rent, Mohali,', subtitle: 'Min ₹15K, 2+ BHK' },
        { title: 'Rent, Sector 66', subtitle: 'Max ₹40K' },
        { title: 'Independent House, Rent, Zirakpur', subtitle: '3 BHK' },
    ];

    const suggestions = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600',
            developerName: 'Nirwana Group',
            developerInitial: 'N',
            price: '₹ 45.03 L - 1.11 Cr',
            title: 'Nirwana The Moksha',
            location: 'Khanpur, Mohali',
            config: '1, 2, 3 BHK Flats'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
            developerName: 'Vatika Group',
            developerInitial: 'V',
            price: '₹ 51.9 L - 89.3 L',
            title: 'Vatika Seven Lamps',
            location: 'Sector 82, Mohali',
            config: '2 BHK Flats'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=600',
            developerName: 'DLF Limited',
            developerInitial: 'D',
            price: '₹ 62.5 L - 1.25 Cr',
            title: 'DLF Garden City',
            location: 'Sector 91, Mohali',
            config: '2, 3, 4 BHK Flats'
        },
        {
            id: 4,
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
            developerName: 'Emaar India',
            developerInitial: 'E',
            price: '₹ 75.2 L - 1.45 Cr',
            title: 'Emaar Palm Heights',
            location: 'Sector 77, Mohali',
            config: '2, 3 BHK Flats'
        }
    ];
    

  const recommendedProperties = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=400',
      price: '₹ 4.25 Cr',
      title: '5 BHK Independent House',
      area: '2000 sq.ft.',
      location: 'Janta Sector 90 A, Mohali',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
      price: '₹ 2.10 Cr',
      title: '3 BHK Modern Villa',
      area: '1800 sq.ft.',
      location: 'Sector 82, Mohali',
    }
  ]; 

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

                <ContinueCards data={recentSearches} />

                {/* Smart Suggestions Section */}
                <View className="mt-8">
                    <View className="px-4 mb-4">
                        <View className="flex-row justify-between items-center">
                            <Text className="font-inter-bold text-[22px] text-[#101828]">Smart Suggestions</Text>
                            <TouchableOpacity>
                                <Text className="font-inter-semibold text-[15px] text-[#008E96]">See all</Text>
                            </TouchableOpacity>
                        </View>
                        <Text className="font-inter-regular text-[14px] text-[#6A7282] mt-1">
                            Based on your last search in Khanpur
                        </Text>
                    </View>

                    <View className="flex-row gap-2 px-4 mb-6">
                        <View className="w-10 h-1 bg-[#008E96] rounded-full" />
                        <View className="w-10 h-1 bg-[#E4E7EC] rounded-full" />
                        <View className="w-10 h-1 bg-[#E4E7EC] rounded-full" />
                        <View className="w-10 h-1 bg-[#E4E7EC] rounded-full" />
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
                    >
                        {suggestions.map((item) => (
                            <PropertySuggestionCard key={item.id} {...item} />
                        ))}
                    </ScrollView>
                </View>
                {/* Recommended Properties Section */}
        <View className="px-4 py-6">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="font-inter-bold text-[18px] text-[#101828]">Recommended Properties</Text>
              <Text className="font-inter-regular text-[14px] text-[#667085]">Properties matching your requirements</Text>
            </View>
            <TouchableOpacity>
              <Text className="font-inter-regular text-[16px] text-[#008E96]">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
          >
            {recommendedProperties.map((item) => (
              <RecommendedPropertyCard
                key={item.id}
                image={item.image}
                price={item.price}
                title={item.title}
                area={item.area}
                location={item.location}
              />
            ))}
          </ScrollView>
        </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Rent;
