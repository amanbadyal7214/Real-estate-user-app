import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InsightPropertyCard from '../../../components/InsightPropertyCard';
import LocalityExploreCard from '../../../components/LocalityExploreCard';
import RevisitPropertyCard from '../../../components/RevisitPropertyCard';
import TopRatedProjectCard from '../../../components/TopRatedProjectCard';
import HighestGrowthCard from '../../../components/HighestGrowthCard';
import UniqueAmenityCard from '../../../components/UniqueAmenityCard';
import PreferenceCard from '../../../components/PreferenceCard';
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
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop',
        possession: 'Possession by Nov, 2027',
        title: 'Amayra Sky Villas',
        location: 'Daun Majra, Mohali',
        price: '₹ 80.25 L - 1.63 Cr',
        bhk: '2, 3 BHK Apartment',
        area: '1338 sq.ft.',
        isRera: true
    }
];

const revisitMockProperties = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400&auto=format&fit=crop',
        possession: 'Ready to Move',
        title: 'Tallest Landmark',
        location: 'Nirwana City, Mohali',
        price: '₹ 1.2 Cr - 2.5 Cr',
        bhk: '3, 4 BHK Apartment',
        area: '1950 sq.ft.',
        isRera: true
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop',
        possession: 'Possession by Aug, 2030',
        title: 'Emerald Heights',
        location: 'Kharar Road, Mohali',
        price: '₹ 72 L - 1.28 Cr',
        bhk: '2, 3 BHK Apartment',
        area: '1280 sq.ft.',
        isRera: true
    }
];

const localityMockData = [
    { title: 'Sector 91', rating: '5', price: '₹13.1K/sq.ft.', properties: '60+' },
    { title: 'Sector 115', rating: '4.8', price: '₹5K/sqft.', properties: '45+' },
    { title: 'Sector 82', rating: '4.6', price: '₹7K/sqft.', properties: '32+' },
];

const topRatedProjects = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop',
        title: 'Homeland Heights',
        location: 'Sector 70, Mohali',
        price: '₹15,903/sq.ft.',
        rating: '4.9',
        ratingCount: '5'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400&auto=format&fit=crop',
        title: 'Sky Tower Premium',
        location: 'Sector 115, Mohali',
        price: '₹14,250/sq.ft.',
        rating: '4.7',
        ratingCount: '8'
    }
];

const highestGrowthProjects = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400&auto=format&fit=crop',
        title: 'Sukh Sansar Apartments',
        location: 'Model Town, Mohali',
        growth: '94.4%',
        timeline: '1 yrs',
        price: '₹3,888/sq.ft.'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400&auto=format&fit=crop',
        title: 'Green Valley Heights',
        location: 'Sector 91, Mohali',
        growth: '82.3%',
        timeline: '1 yrs',
        price: '₹6,125/sq.ft.'
    }
];

const uniqueAmenities = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop',
        title: 'Jogging Track',
        properties: '16'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop',
        title: 'Meditation Zone',
        properties: '12'
    }
];

const preferencesData = [
    {
        id: 1,
        icon: 'map-marker-outline',
        label: 'Locality',
        value: 'Sector 91',
        properties: '60'
    },
    {
        id: 2,
        icon: 'currency-rupee',
        label: 'Price range',
        value: '₹ 75 L - ₹ 1 Cr',
        properties: '700'
    },
    {
        id: 3,
        icon: 'view-grid-outline',
        label: 'BHK',
        value: '3 BHK',
        properties: '1K'
    },
    {
        id: 4,
        icon: 'office-building-outline',
        label: 'Property type',
        value: 'Apartment',
        properties: '1K'
    }
];

const Insights = () => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>

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
                        {revisitMockProperties.map((prop, index) => (
                            <RevisitPropertyCard key={`revisit-${index}`} {...prop} />
                        ))}
                    </ScrollView>
                </View>

                {/* Explore Localities Nearby Section */}
                <View className="pl-4 mt-6">
                    <View className="flex-row items-center justify-between pr-4 mb-4">
                        <Text className="text-[#101828] text-[16px] font-inter-bold">Explore localities nearby</Text>
                        <TouchableOpacity>
                            <Text className="text-[#008E96] text-[13px] font-inter-medium">See all</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 16 }}
                    >
                        {localityMockData.map((item, index) => (
                            <View key={`locality-${index}`} className="mr-4">
                                <LocalityExploreCard {...item} />
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Top Rated Projects Section */}
                <View className="px-4 mt-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-[#101828] text-[18px] font-inter-semibold">Top rated projects</Text>
                        <TouchableOpacity>
                            <Text className="text-[#008E96] text-[14px] font-inter-medium">See all</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        {topRatedProjects.map((project) => (
                            <TopRatedProjectCard key={project.id} {...project} />
                        ))}
                    </View>
                </View>

                {/* Highest Growth Projects Section */}
                <View className="pl-4 mt-6">
                    <View className="flex-row items-center justify-between pr-4 mb-4">
                        <Text className="text-[#101828] text-[18px] font-inter-semibold">Highest growth projects</Text>
                        <TouchableOpacity>
                            <Text className="text-[#008E96] text-[14px] font-inter-medium">See all</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 16 }}
                    >
                        {highestGrowthProjects.map((project) => (
                            <View key={project.id} className="mr-4">
                                <HighestGrowthCard {...project} />
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Projects with Unique Amenities Section */}
                <View className="pl-4 mt-6 pb-6">
                    <View className="flex-row items-center justify-between pr-4 mb-4">
                        <Text className="text-[#101828] text-[18px] font-inter-semibold">Projects with unique amenities</Text>
                        <TouchableOpacity>
                            <Text className="text-[#008E96] text-[14px] font-inter-medium">See all</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 16 }}
                    >
                        {uniqueAmenities.map((amenity) => (
                            <View key={amenity.id} className="mr-4">
                                <UniqueAmenityCard {...amenity} />
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Explore by your preferences Section */}
                <View className="px-4 ">
                    <View className="mb-6">
                        <Text className="text-[#101828] text-[16px] font-inter-semibold leading-[30px]">Explore by what matters to you</Text>
                        <Text className="text-[#6A7282] text-[14px] font-inter-regular leading-[21px]">See properties based on your top preferences</Text>
                    </View>
                    <View className="flex-row ml-2 flex-wrap gap-x-4">
                        {preferencesData.map((pref) => (
                            <PreferenceCard key={pref.id} {...pref} />
                        ))}
                    </View>
                </View>

            </ScrollView>
            {/* <BottomTabBar activeTab="Insights" /> */}
        </SafeAreaView>
    );
};

export default Insights;
