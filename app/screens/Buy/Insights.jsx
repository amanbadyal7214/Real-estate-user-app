import { useIsFocused } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ArrowLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import InsightPropertyCard from '../../../components/InsightPropertyCard';
import LocalityExploreCard from '../../../components/LocalityExploreCard';
import PreferenceCard from '../../../components/PreferenceCard';
import RevisitPropertyCard from '../../../components/RevisitPropertyCard';
import { useLocality } from '../../../hooks/useLocality';
import { useLocalityAveragePrice } from '../../../hooks/useLocalityAveragePrice';
import { usePropertyDiscovery } from '../../../hooks/usePropertyDiscovery';
import { useUserActivity } from '../../../hooks/useUserActivity';
import { useLocation } from '../../context/LocationContext';


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

const formatPrice = (value) => {
    if (!value) return "Price on Request";
    if (typeof value !== 'number') return value;
    if (value >= 10000000) {
        return `₹ ${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) {
        return `₹ ${(value / 100000).toFixed(1)} L`;
    }
    return `₹ ${value.toLocaleString('en-IN')}`;
};

const getPropertyLocation = (property) => {
    if (!property) return '';
    const locality = typeof property.locality === 'object' ? (property.locality?.name || property.locality?.label || '') : (property.localityName || property.locality || '');
    const city = typeof property.city === 'object' ? (property.city?.name || '') : (property.city || '');
    return [locality, city].filter(Boolean).join(', ');
};

const Insights = () => {
    const isFocused = useIsFocused();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("Guest");
    const { fetchRecentlyViewed, recentlyViewed } = useUserActivity();

    const { findPropertiesByLocation, loading: discoveryLoading } = usePropertyDiscovery();
    const { resolveLocalities, loading: localityLoading } = useLocality();
    const { fetchAveragePriceByCity, loading: localityPriceLoading } = useLocalityAveragePrice();
    const { currentLocation } = useLocation();
    const [nearbyProperties, setNearbyProperties] = useState([]);
    const [nearbyLocalities, setNearbyLocalities] = useState([]);

    useEffect(() => {
        const checkLogin = async () => {
            const token = await SecureStore.getItemAsync('token');
            setIsLoggedIn(!!token);
            if (token) {
                const userStr = await SecureStore.getItemAsync('userData');
                if (userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        setUserName(user.name || "User");
                    } catch (e) {
                        console.error("Error parsing userData in Insights:", e);
                        setUserName("User");
                    }
                } else {
                    setUserName("User");
                }
                fetchRecentlyViewed().catch(err => console.error("Error fetching recently viewed in Insights:", err));
            } else {
                setUserName("Guest");
            }
        };
        if (isFocused) {
            checkLogin();
        }
    }, [isFocused, fetchRecentlyViewed]);

    const handleProtectedViewMore = async (destination) => {
        const token = await SecureStore.getItemAsync('token');
        const redirectTo = encodeURIComponent(JSON.stringify(destination));

        if (!token) {
            router.replace({
                pathname: '/(auth)/Login',
                params: { redirectTo },
            });
            return;
        }

        router.push(destination);
    };

    const loading = discoveryLoading || localityLoading || localityPriceLoading;

    useEffect(() => {
        const fetchNearby = async () => {
            try {
                // Determine search parameters
                const city = currentLocation?.city || 'Mohali';
                const locality = currentLocation?.locality;
                const params = { limit: 10, city, lookingFor: 'sell' };
                if (locality) params.locality = locality;

                const res = await findPropertiesByLocation(params);
                if (res.success) {
                    const enriched = await resolveLocalities(res.data);
                    setNearbyProperties(enriched);
                }
            } catch (err) {
                console.error("Insights Nearby Fetch Error:", err);
            }
        };

        const fetchLocalities = async () => {
            try {
                const res = await fetchAveragePriceByCity(currentLocation?.city || 'Mohali');
                if (res?.success) {
                    setNearbyLocalities(res.data || []);
                }
            } catch (err) {
                console.error("Insights Locality Fetch Error:", err);
            }
        };

        fetchNearby();
        fetchLocalities();
    }, [currentLocation]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <Stack.Screen options={{ animation: 'slide_from_bottom', gestureEnabled: true }} />
            <ScrollView contentContainerStyle={{ paddingBottom: hp('3.7%') }} showsVerticalScrollIndicator={false}>

                {/* Header Section */}
                <Animated.View entering={FadeInUp.duration(600).delay(100)}>
                    <TouchableOpacity
                        className="flex-row items-center"
                        style={{ paddingHorizontal: wp('4.3%'), marginTop: hp('1%') }}
                        onPress={() => router.back()}
                    >
                        <ArrowLeft size={wp('4.8%')} color="#6A7282" />
                        <Text style={{ fontWeight: '500', fontSize: wp('3.7%'), marginLeft: wp('2.1%') }} className="text-[#6A7282]">Back to Home</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(200)} style={{ paddingHorizontal: wp('4.3%'), marginTop: hp('2.5%'), marginBottom: hp('1.2%') }}>
                    <Text style={{ fontWeight: '500', fontSize: wp('3%') }} className="text-[#6A7282]">Hi  {userName},</Text>
                    <Text style={{ fontWeight: '700', fontSize: wp('5.5%'), marginTop: hp('0.4%') }} className="text-[#101828]">Welcome back!</Text>
                </Animated.View>

                {/* New Listings Section */}
                <Animated.View entering={FadeInDown.duration(600).delay(300)} style={{ paddingLeft: wp('4.3%') }}>
                    <View className="flex-row items-center" style={{ paddingRight: wp('4.3%'), marginBottom: hp('1.5%') }}>
                        <Text style={{ fontWeight: '600', fontSize: wp('3.7%') }} className="text-[#101828]">New Listings added nearby</Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: wp('4.3%') }}
                    >
                        {loading && nearbyProperties.length === 0 ? (
                            <View className="flex-row items-center justify-center" style={{ paddingVertical: hp('4.9%'), width: wp('53.3%') }}>
                                <ActivityIndicator size="small" color="#008E96" />
                            </View>
                        ) : (nearbyProperties.length > 0 ? nearbyProperties : mockProperties).map((prop) => (
                            <InsightPropertyCard
                                key={prop._id || prop.id}
                                id={prop._id || prop.id}
                                image={prop.images?.[0] || prop.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400&auto=format&fit=crop'}
                                possession={prop.possessionStatus || prop.possession || 'Ready to Move'}
                                title={prop.title || prop.projectName || 'Premium Residence'}
                                location={getPropertyLocation(prop) || prop.location || 'Mohali'}
                                price={prop.price ? (typeof prop.price === 'number' ? `₹ ${prop.price}` : prop.price) : 'Price on Request'}
                                bhk={prop.residential ? `${prop.residential?.bedrooms || 0} BHK Apartment` : prop.bhk}
                                area={prop.area ? `${prop.area} ${prop.areaUnit?.name || 'sq.ft.'}` : prop.area}
                                isRera={prop.isRera !== undefined ? prop.isRera : true}
                                isWishlisted={prop.isWishlisted}
                            />
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* Revisit Properties Section */}
                <Animated.View entering={FadeInDown.duration(600).delay(400)} style={{ paddingLeft: wp('4.3%'), marginTop: hp('3.9%') }}>
                    <View className="flex-row items-center justify-between" style={{ paddingRight: wp('4.3%'), marginBottom: hp('1.5%') }}>
                        <Text style={{ fontWeight: '600', fontSize: wp('3.7%') }} className="text-[#101828]">Revisit properties seen by you</Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: wp('4.3%') }}
                    >
                        {(isLoggedIn && recentlyViewed.length > 0 ? recentlyViewed : revisitMockProperties).map((prop, index) => {
                            const property = prop.property || prop;
                            const isMock = !isLoggedIn || recentlyViewed.length === 0;

                            const cardData = isMock ? prop : {
                                id: property._id || property.id,
                                image: property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400&auto=format&fit=crop',
                                possession: property.possessionStatus?.label || property.possessionStatus || 'Ready to Move',
                                title: property.title || property.projectName || 'Premium Residence',
                                location: getPropertyLocation(property) || 'Mohali',
                                price: formatPrice(property.price),
                                bhk: property.residential ? `${property.residential?.bedrooms || 0} BHK Apartment` : (property.bhk || ''),
                                area: property.area ? `${property.area} ${property.areaUnit?.name || 'sq.ft.'}` : (property.bhkFlats || ''),
                                isRera: property.isRera !== undefined ? property.isRera : true,
                                isWishlisted: prop.isWishlisted
                            };

                            return (
                                <RevisitPropertyCard key={cardData.id || `revisit-${index}`} {...cardData} />
                            );
                        })}
                    </ScrollView>
                </Animated.View>

                {/* Explore Localities Nearby Section */}
                <Animated.View entering={FadeInDown.duration(600).delay(500)} style={{ paddingLeft: wp('4.3%'), marginTop: hp('3%') }}>
                    <View className="flex-row items-center justify-between" style={{ paddingRight: wp('4.3%'), marginBottom: hp('1.5%') }}>
                        <Text style={{ fontWeight: '700', fontSize: wp('3.7%') }} className="text-[#101828]">Explore localities nearby</Text>
                        <TouchableOpacity onPress={() => handleProtectedViewMore('/screens/ExploreLocalities')}>
                            <Text style={{ fontWeight: '500', fontSize: wp('3%') }} className="text-[#008E96]">See all</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: wp('4.3%') }}
                    >
                        {nearbyLocalities.length > 0 ? nearbyLocalities.map((item, index) => (
                            <View key={`locality-${index}`} style={{ marginRight: wp('4.3%') }}>
                                <LocalityExploreCard
                                    title={item.localityName || item.locality}
                                    rating={item.rating || (4 + Math.random()).toFixed(1)}
                                    price={item.averagePricePerSqft ? `₹${(item.averagePricePerSqft / 1000).toFixed(1)}K/sq.ft.` : 'N/A'}
                                    properties={item.totalProperties || Math.floor(Math.random() * 50) + 10 + '+'}
                                    onPress={() => handleProtectedViewMore('/screens/ExploreLocalities')}
                                />
                            </View>
                        )) : localityMockData.map((item, index) => (
                            <View key={`locality-${index}`} style={{ marginRight: wp('4.3%') }}>
                                <LocalityExploreCard {...item} />
                            </View>
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* Explore by your preferences Section */}
                <Animated.View entering={FadeInDown.duration(600).delay(900)} style={{ paddingHorizontal: wp('4.3%'), marginTop: hp('3%') }}>
                    <View style={{ marginBottom: hp('2.5%') }}>
                        <Text style={{ fontWeight: '600', fontSize: wp('3.7%'), lineHeight: hp('3.2%') }} className="text-[#101828]">Explore by what matters to you</Text>
                        <Text style={{ fontWeight: '400', fontSize: wp('3.2%'), lineHeight: hp('2.2%') }} className="text-[#6A7282]">See properties based on your top preferences</Text>
                    </View>
                    <View className="flex-row flex-wrap" style={{ marginLeft: wp('2.1%'), columnGap: wp('4.3%') }}>
                        {preferencesData.map((pref) => (
                            <PreferenceCard key={pref.id} {...pref} />
                        ))}
                    </View>
                </Animated.View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Insights;
