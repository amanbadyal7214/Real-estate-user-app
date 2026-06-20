import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {
  ArrowLeft,
  Building,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Eye,
  Gem,
  HandCoins,
  Heart,
  History,
  Home,
  LogOut,
  Newspaper,
  Phone,
  Puzzle,
  Search,
  Settings,
  Star,
  TriangleAlert,
  Zap,
  Calculator,
  Percent
} from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Svg, { Circle, Path } from 'react-native-svg';
import PropertyCardSmall from '../../components/PropertyCardSmall';
import { useUserActivity } from '../../hooks/useUserActivity';

const ProfileHeader = ({ userData }) => {
  const name = userData?.name || "Prerna Sablok";
  const email = userData?.email || "sablokprerna003@gmail.com";
  const phone = userData?.profileData?.phone || userData?.phone || "+91-6284461119";
  const initialLetter = name.charAt(0).toUpperCase();

  return (
    <View className="bg-white flex-row items-start justify-between" style={{ paddingHorizontal: wp('4%'), paddingVertical: hp('1.5%') }}>
      <View className="flex-row" style={{ gap: wp('3%') }}>
        {/* Avatar Container - Double-Ring Teal/White Circle */}
        <View
          className="items-center justify-center bg-white border-2 border-[#008E96]"
          style={{ width: wp('18%'), height: wp('18%'), borderRadius: wp('9%') }}
        >
          {/* Inner Circle - 52x52 Teal Circle */}
          <View
            className="items-center justify-center bg-[#008E96]"
            style={{ width: wp('14%'), height: wp('14%'), borderRadius: wp('7%') }}
          >
            <Text
              className="text-white font-semibold"
              style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('6%'), marginTop: -2 }}
            >
              {initialLetter}
            </Text>
          </View>
        </View>

        {/* User Info */}
        <View style={{ marginLeft: wp('1%'), justifyContent: 'center' }}>
          <Text
            className="text-[#101828] font-semibold"
            style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('4.5%') }}
          >
            Hello {name}!
          </Text>
          <Text
            className="text-[#4A5565] font-normal"
            style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.3%'), marginTop: hp('0.5%') }}
          >
            {email}
          </Text>
          <Text
            className="text-[#4A5565] font-normal"
            style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.3%') }}
          >
            {phone}
          </Text>

        </View>
      </View>

      {/* Edit Button */}
      <TouchableOpacity
        className="border border-[#E4E7EC] rounded-full"
        style={{ paddingHorizontal: wp('4%'), paddingVertical: hp('1%') }}
        activeOpacity={0.7}
      >
        <Text
          className="text-[#101828] font-medium"
          style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.5%') }}
        >
          Edit
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const ActivityTabCard = ({ id, label1, label2, count, icon: Icon, isActive, onPress }) => {
  return (
    <View className="items-center" style={{ marginRight: wp('3%') }}>
      <TouchableOpacity
        onPress={() => onPress(id)}
        className={`items-center justify-center border-2 ${isActive ? 'bg-[#008E9614] border-[#008E96]' : 'bg-white border-[#E4E7EC]'
          }`}
        style={{ width: wp('24%'), height: hp('13%'), borderRadius: wp('3.5%') }}
        activeOpacity={0.7}
      >
        {/* Icon & Badge Container */}
        <View className="relative" style={{ width: wp('7%'), height: wp('7%'), marginBottom: hp('2%') }}>
          <Icon size={wp('7%')} color={isActive ? "#008E96" : "#6A7282"} strokeWidth={1.5} />
          {count !== undefined && count !== null && (
            <View
              className={`absolute rounded-full items-center justify-center border-2 border-white ${isActive ? 'bg-[#008E96]' : 'bg-[#E4E7EC]'
                }`}
              style={{ top: -wp('2.5%'), right: -wp('3.5%'), paddingHorizontal: wp('1.5%'), paddingVertical: hp('0.2%'), minWidth: wp('6%'), height: wp('6%') }}
            >
              <Text
                className={`font-bold ${isActive ? 'text-white' : 'text-[#6A7282]'}`}
                style={{ fontFamily: 'Inter-Bold', fontSize: wp('2.5%') }}
              >
                {count}
              </Text>
            </View>
          )}
        </View>

        {/* Labels */}
        <View className="items-center px-1">
          <Text
            className={`font-medium text-center ${isActive ? 'text-[#101828]' : 'text-[#6A7282]'
              }`}
            style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.3%'), lineHeight: wp('4%') }}
          >
            {label1}
          </Text>
          <Text
            className={`font-medium text-center ${isActive ? 'text-[#101828]' : 'text-[#6A7282]'
              }`}
            style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.3%'), lineHeight: wp('4%') }}
          >
            {label2}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Active Triangle Indicator */}
      {isActive && (
        <View
          className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-[#008E96] mt-[-2px]"
        />
      )}
    </View>
  );
};

const SellRentBanner = () => {
  return (
    <View style={{ paddingHorizontal: wp('4%'), paddingVertical: hp('2%') }}>
      <LinearGradient
        colors={['#FFF8E7', '#FFE8D6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: wp('4%'), borderWeight: 0.67, borderColor: '#E4E7EC', borderWidth: 0.67, padding: wp('5%'), gap: wp('4%'), minHeight: hp('15%') }}
        className="flex-row items-center"
      >
        {/* House Illustration */}
        <View className="items-center justify-center relative" style={{ width: wp('22%'), height: wp('22%') }}>
          <View className="absolute inset-0 items-center justify-center">
            <Building size={wp('15%')} color="#D4A574" opacity={0.6} />
          </View>
          <View className="absolute rounded-full border-2 border-[#F4A261] opacity-60" style={{ top: wp('2%'), right: wp('2%'), width: wp('8%'), height: wp('8%') }} />
        </View>

        {/* Content */}
        <View className="flex-1 justify-center">
          <Text
            className="text-[#101828] font-semibold"
            style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('4%'), lineHeight: wp('5%'), marginBottom: hp('1.5%') }}
          >
            Looking to sell/rent{"\n"}your property?
          </Text>

          <TouchableOpacity
            className="bg-white rounded-[10px] self-start items-center justify-center"
            style={{
              paddingHorizontal: wp('3%'),
              paddingVertical: hp('1%'),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2,
              width: wp('35%')
            }}
          >
            <Text
              className="text-[#101828] font-medium"
              style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.5%') }}
            >
              Post property for
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const MenuItem = ({ label, icon: Icon, isNew = false, indicator = 'ChevronRight', count = null, onPress }) => {
  const IndicatorIcon = indicator === 'ChevronDown' ? ChevronDown : ChevronRight;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center"
      style={{ paddingHorizontal: wp('4%'), height: hp('6.5%'), gap: wp('3%') }}
      activeOpacity={0.7}
    >
      <View className="items-center justify-center" style={{ width: wp('6%'), height: wp('6%') }}>
        <Icon size={wp('6%')} color="#4A5565" strokeWidth={1.5} />
      </View>

      <View className="flex-1">
        <Text
          className="text-[#101828] font-medium"
          style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.8%'), lineHeight: wp('5.5%') }}
        >
          {label}
        </Text>
      </View>

      <View className="flex-row items-center" style={{ gap: wp('2%') }}>
        {count && (
          <View className="bg-[#E4E7EC] rounded-full items-center justify-center" style={{ paddingHorizontal: wp('2.5%'), paddingVertical: hp('0.2%') }}>
            <Text
              className="text-[#6A7282] font-semibold"
              style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('3.3%'), lineHeight: wp('5%') }}
            >
              {count}
            </Text>
          </View>
        )}
        {isNew && (
          <View className="bg-[#008E96] rounded-[4px] items-center justify-center" style={{ paddingHorizontal: wp('2%'), paddingVertical: hp('0.2%') }}>
            <Text
              className="text-white font-bold uppercase"
              style={{ fontFamily: 'Inter-Bold', fontSize: wp('2.8%'), lineHeight: wp('4%') }}
            >
              NEW
            </Text>
          </View>
        )}
        <IndicatorIcon size={wp('5%')} color="#6A7282" />
      </View>
    </TouchableOpacity>
  );
};

const QuickLinks = () => {
  const router = useRouter();
  return (
    <View className="border-t border-[#E4E7EC]" style={{ marginTop: hp('4%'), paddingTop: hp('2%') }}>
      {/* Header Row */}
      <View className="flex-row items-center mb-4 gap-3" style={{ paddingHorizontal: wp('4%') }}>
        <HandCoins size={wp('6%')} color="#101828" strokeWidth={1.5} />
        <Text
          className="flex-1 text-[#101828] font-semibold"
          style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('4.5%') }}
        >
          Quick Links
        </Text>
        <ChevronDown size={wp('5%')} color="#6A7282" />
      </View>

      {/* Grid of Cards */}
      <View className="flex-row justify-between gap-3" style={{ paddingHorizontal: wp('4%') }}>
        {/* Sell/Rent Property Card */}
        <TouchableOpacity
          onPress={() => router.push('/screens/PostProperty/PropertyDetails')}
          className="flex-1 bg-[#F7F9FA] border border-[#E4E7EC] rounded-[12px] items-center justify-center gap-2 relative"
          style={{ height: hp('12%') }}
          activeOpacity={0.7}
        >
          {/* FREE Badge */}
          <View className="absolute bg-[#008E96] rounded-[4px]" style={{ top: hp('1%'), right: wp('2%'), paddingHorizontal: wp('2%'), paddingVertical: hp('0.2%') }}>
            <Text
              className="text-white font-bold uppercase"
              style={{ fontFamily: 'Inter-Bold', fontSize: wp('2.8%'), lineHeight: wp('4%') }}
            >
              FREE
            </Text>
          </View>

          <HandCoins size={wp('8%')} color="#008E96" strokeWidth={1.5} />
          <Text
            className="text-[#101828] font-medium"
            style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.5%') }}
          >
            Sell/Rent property
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const Profile = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('saved');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isHomeSearchExpanded, setIsHomeSearchExpanded] = React.useState(false);
  const [isToolsExpanded, setIsToolsExpanded] = React.useState(false);
  const [userData, setUserData] = React.useState(null);
  const {
    fetchActivitySummary,
    activitySummary,
    fetchRecentlyViewed,
    recentlyViewed,
    fetchContactedProperties,
    contactedProperties,
    fetchWishlistProperties,
    wishlistProperties,
    fetchRecentSearches,
    recentSearches,
    loading
  } = useUserActivity();

  const checkLoginStatus = React.useCallback(async () => {
    const token = await SecureStore.getItemAsync('token');
    setIsLoggedIn(!!token);
    if (token) {
      const userStr = await SecureStore.getItemAsync('userData');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserData(user);
        } catch (e) {
          console.error("Error parsing userData in Profile:", e);
        }
      }
    } else {
      setUserData(null);
    }
  }, []);

  React.useEffect(() => {
    checkLoginStatus();
    fetchActivitySummary().catch((err) => {
      console.error("Error fetching activity summary in Profile screen:", err);
    });
  }, [checkLoginStatus, fetchActivitySummary]);

  React.useEffect(() => {
    if (activeTab === 'saved') {
      fetchWishlistProperties().catch((err) => {
        console.error("Error fetching wishlist properties in Profile:", err);
      });
    } else if (activeTab === 'seen') {
      fetchRecentlyViewed().catch((err) => {
        console.error("Error fetching recently viewed in Profile:", err);
      });
    } else if (activeTab === 'contacted') {
      fetchContactedProperties().catch((err) => {
        console.error("Error fetching contacted properties in Profile:", err);
      });
    } else if (activeTab === 'recent') {
      fetchRecentSearches().catch((err) => {
        console.error("Error fetching recent searches in Profile:", err);
      });
    }
  }, [activeTab, fetchWishlistProperties, fetchRecentlyViewed, fetchContactedProperties, fetchRecentSearches]);

  const formatPrice = (value) => {
    if (!value) return "Price on Request";
    if (value >= 10000000) {
      return `₹ ${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) {
      return `₹ ${(value / 100000).toFixed(1)} L`;
    }
    return `₹ ${value.toLocaleString('en-IN')}`;
  };

  const handleLogout = async () => {
    try {
      // Clean up secure storage
      await Promise.all([
        SecureStore.deleteItemAsync('token'),
        SecureStore.deleteItemAsync('userRole'),
        SecureStore.deleteItemAsync('userData')
      ]);

      Alert.alert("Success", "Logged out successfully!");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout Error:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  const tabs = [
    { id: 'saved', label1: 'Saved', label2: 'Properties', icon: Heart, count: String(activitySummary?.wishlistCount ?? 0).padStart(2, '0') },
    { id: 'seen', label1: 'Seen', label2: 'Properties', icon: Eye, count: String(activitySummary?.viewedPropertiesCount ?? 0).padStart(2, '0') },
    { id: 'contacted', label1: 'Contacted', label2: 'Properties', icon: Phone, count: String(activitySummary?.contactedPropertiesCount ?? 0).padStart(2, '0') },
    { id: 'recent', label1: 'Recent', label2: 'Searches', icon: Search, count: String(activitySummary?.recentSearchesCount ?? 0).padStart(2, '0') },
  ];

  const renderActivityContent = () => {
    if (loading) {
      return (
        <View className="items-center justify-center pt-8 pb-12">
          <ActivityIndicator size="large" color="#008E96" />
        </View>
      );
    }

    if (activeTab === 'saved' && wishlistProperties && wishlistProperties.length > 0) {
      return (
        <View className="flex-row flex-wrap px-4 pt-5 gap-3 pb-8">
          {wishlistProperties.map((item, index) => {
            const property = item.property || item;
            const id = property._id || property.id;
            const title = property.title || property.projectName || 'Property';
            const price = typeof property.price === 'number'
              ? formatPrice(property.price)
              : (property.priceRange || 'Price on Request');
            const area = property.area
              ? `${property.area} ${property.areaUnit?.label || 'sq. ft.'}`
              : (property.bhkFlats || '');
            const location = property.locality?.label || property.locality || property.address || '';
            const image = (property.images && property.images[0]) || property.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60";

            return (
              <View key={id || index} style={{ width: '48%' }} className="mb-2">
                <PropertyCardSmall
                  id={id}
                  image={image}
                  price={price}
                  title={title}
                  area={area}
                  location={location}
                  isWishlisted={true}
                  onWishlistToggle={() => {
                    fetchWishlistProperties().catch(err => console.error(err));
                    fetchActivitySummary().catch(err => console.error(err));
                  }}
                />
              </View>
            );
          })}
        </View>
      );
    }

    if (activeTab === 'seen' && recentlyViewed && recentlyViewed.length > 0) {
      return (
        <View className="flex-row flex-wrap px-4 pt-5 gap-3 pb-8">
          {recentlyViewed.map((item, index) => {
            const property = item.property || item;
            const id = property._id || property.id;
            const title = property.title || property.projectName || 'Property';
            const price = typeof property.price === 'number'
              ? formatPrice(property.price)
              : (property.priceRange || 'Price on Request');
            const area = property.area
              ? `${property.area} ${property.areaUnit?.label || 'sq. ft.'}`
              : (property.bhkFlats || '');
            const location = property.locality?.label || property.locality || property.address || '';
            const image = (property.images && property.images[0]) || property.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60";

            return (
              <View key={id || index} style={{ width: '48%' }} className="mb-2">
                <PropertyCardSmall
                  id={id}
                  image={image}
                  price={price}
                  title={title}
                  area={area}
                  location={location}
                  isWishlisted={wishlistProperties?.some(w => {
                    const wp = w.property || w;
                    return (wp._id || wp.id) === id;
                  })}
                  onWishlistToggle={() => {
                    fetchWishlistProperties().catch(err => console.error(err));
                    fetchActivitySummary().catch(err => console.error(err));
                  }}
                />
              </View>
            );
          })}
        </View>
      );
    }

    if (activeTab === 'contacted' && contactedProperties && contactedProperties.length > 0) {
      return (
        <View className="flex-row flex-wrap px-4 pt-5 gap-3 pb-8">
          {contactedProperties.map((item, index) => {
            const property = item.property || item;
            const id = property._id || property.id;
            const title = property.title || property.projectName || 'Property';
            const price = typeof property.price === 'number'
              ? formatPrice(property.price)
              : (property.priceRange || 'Price on Request');
            const area = property.area
              ? `${property.area} ${property.areaUnit?.label || 'sq. ft.'}`
              : (property.bhkFlats || '');
            const location = property.locality?.label || property.locality || property.address || '';
            const image = (property.images && property.images[0]) || property.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60";

            return (
              <View key={id || index} style={{ width: '48%' }} className="mb-2">
                <PropertyCardSmall
                  id={id}
                  image={image}
                  price={price}
                  title={title}
                  area={area}
                  location={location}
                  isWishlisted={wishlistProperties?.some(w => {
                    const wp = w.property || w;
                    return (wp._id || wp.id) === id;
                  })}
                  onWishlistToggle={() => {
                    fetchWishlistProperties().catch(err => console.error(err));
                    fetchActivitySummary().catch(err => console.error(err));
                  }}
                />
              </View>
            );
          })}
        </View>
      );
    }

    if (activeTab === 'recent' && recentSearches && recentSearches.length > 0) {
      return (
        <View className="px-4 pt-5 pb-8">
          {recentSearches.map((item, index) => {
            const name = item.searchName || item.name || `Search #${index + 1}`;
            const city = item.filters?.city || '';
            const category = item.filters?.category || '';
            const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '';

            return (
              <View key={item._id || index} className="w-full bg-[#F7F9FA] border border-[#E4E7EC] rounded-2xl p-4 mb-3 flex-row justify-between items-center">
                <View className="flex-1">
                  <Text style={{ fontFamily: 'Inter-SemiBold' }} className="text-[15px] font-semibold text-[#101828] mb-1">{name}</Text>
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[13px] text-[#6A7282]">
                    {city && `City: ${city}`} {category && ` • Category: ${category}`}
                  </Text>
                </View>
                {date && (
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[12px] text-[#6A7282]">
                    {date}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      );
    }

    // Default Empty State
    return (
      <View className="items-center justify-center" style={{ paddingTop: hp('4%'), paddingBottom: hp('4%'), paddingHorizontal: wp('16%') }}>
        <View className="items-center justify-center relative" style={{ width: wp('50%'), height: wp('35%'), marginBottom: hp('3%') }}>
          <Svg width={wp('45%')} height={wp('35%')} viewBox="0 0 180 140">
            {/* Left sparkles/dots */}
            <Circle cx="22" cy="78" r="3" fill="#B2E0E2" />
            <Circle cx="12" cy="65" r="2" fill="#B2E0E2" />
            <Circle cx="25" cy="50" r="1.5" fill="#B2E0E2" />

            {/* Right sparkles/dots */}
            <Circle cx="158" cy="72" r="3" fill="#B2E0E2" />
            <Circle cx="165" cy="58" r="2" fill="#B2E0E2" />
            <Circle cx="150" cy="85" r="1.5" fill="#B2E0E2" />

            {/* Folder Path */}
            <Path
              d="M 38 22 H 60 Q 68 22 73 29 Q 78 36 86 36 H 122 Q 132 36 132 46 V 92 Q 132 102 122 102 H 38 Q 28 102 28 92 V 32 Q 28 22 38 22 Z"
              stroke="#008E96"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Heart on the tab */}
            <Path
              d="M 44 18 C 39.5 11.5 30.5 13.5 30.5 21 C 30.5 28 44 36 44 36 C 44 36 57.5 28 57.5 21 C 57.5 13.5 48.5 11.5 44 18 Z"
              stroke="#008E96"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="#BEECEE"
            />

            {/* Magnifying Glass */}
            {/* Glass handle */}
            <Path
              d="M 125 43 L 134 52"
              stroke="#008E96"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Glass lens/circle */}
            <Circle
              cx="116"
              cy="34"
              r="10"
              stroke="#008E96"
              strokeWidth="3.5"
              fill="white"
            />
          </Svg>
        </View>

        <TouchableOpacity
          className="items-center justify-center bg-[#E6F4F5] rounded-full"
          style={{ height: hp('6%'), width: wp('45%') }}
          activeOpacity={0.7}
        >
          <Text
            className="text-[#008E96] font-semibold text-center"
            style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('3.8%') }}
          >
            Start new search
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Navigator Back Header */}
      <View className="justify-center" style={{ paddingHorizontal: wp('4%'), paddingVertical: hp('1%') }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={wp('6%')} color="#101828" />
        </TouchableOpacity>
      </View>

      <ProfileHeader userData={userData} />

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {/* My Activity Section */}
        <View>
          <Text
            className="text-[#101828] font-semibold"
            style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('4.5%'), marginBottom: hp('2%'), paddingHorizontal: wp('4%') }}
          >
            My Activity
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="h-[130px]"
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {tabs.map((tab) => (
              <ActivityTabCard
                key={tab.id}
                {...tab}
                isActive={activeTab === tab.id}
                onPress={setActiveTab}
              />
            ))}
          </ScrollView>
        </View>

        {/* Dynamic Activity Content (List or Empty State) */}
        {renderActivityContent()}

        {/* Sell/Rent Banner */}
        <SellRentBanner />

        {/* Menu Items Section 1 */}
        <View className="mt-8 border-t border-[#E4E7EC] pt-2">
          <MenuItem 
            label="Zero Brokerage Properties" 
            icon={Gem} 
            onPress={() => router.push('/screens/ComingSoon')} 
          />
          <MenuItem 
            label="Saved Search" 
            icon={History} 
            onPress={() => router.push({ pathname: '/screens/Saved', params: { tab: 'recent' } })}
          />
          <MenuItem 
            label="My Reviews" 
            icon={Star} 
            isNew={true} 
            onPress={() => router.push('/screens/ComingSoon')}
          />
        </View>

        {/* Quick Links Section */}
        <QuickLinks />

        {/* Menu Items Section 2 */}
        <View className="border-t border-[#E4E7EC]" style={{ marginTop: hp('4%'), paddingTop: hp('1%') }}>
          <MenuItem 
            label="Home Search" 
            icon={Home} 
            indicator={isHomeSearchExpanded ? 'ChevronDown' : 'ChevronRight'}
            onPress={() => setIsHomeSearchExpanded(!isHomeSearchExpanded)}
          />
          {isHomeSearchExpanded && (
            <View className="flex-row justify-between" style={{ paddingHorizontal: wp('4%'), gap: wp('3%'), marginVertical: hp('1.5%') }}>
              {/* Buy Property Card */}
              <TouchableOpacity
                onPress={() => router.push('/screens/Buy/BuySearch')}
                className="flex-1 bg-[#F7F9FA] border border-[#E4E7EC] rounded-[12px] items-center justify-center gap-2"
                style={{ height: hp('12%') }}
                activeOpacity={0.7}
              >
                <Home size={wp('8%')} color="#008E96" strokeWidth={1.5} />
                <Text
                  className="text-[#101828] font-medium"
                  style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.5%') }}
                >
                  Buy Property
                </Text>
              </TouchableOpacity>

              {/* Rent Property Card */}
              <TouchableOpacity
                onPress={() => router.push('/screens/Rent/Rentsearch')}
                className="flex-1 bg-[#F7F9FA] border border-[#E4E7EC] rounded-[12px] items-center justify-center gap-2"
                style={{ height: hp('12%') }}
                activeOpacity={0.7}
              >
                <Building size={wp('8%')} color="#008E96" strokeWidth={1.5} />
                <Text
                  className="text-[#101828] font-medium"
                  style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.5%') }}
                >
                  Rent Property
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <MenuItem 
            label="Tools" 
            icon={Puzzle} 
            indicator={isToolsExpanded ? 'ChevronDown' : 'ChevronRight'}
            onPress={() => setIsToolsExpanded(!isToolsExpanded)}
          />
          {isToolsExpanded && (
            <View className="flex-row flex-wrap justify-between" style={{ paddingHorizontal: wp('4%'), gap: wp('3%'), marginVertical: hp('1.5%') }}>
              {/* EMI Calculator */}
              <TouchableOpacity
                onPress={() => router.push('/screens/EMICalculator')}
                className="bg-[#F7F9FA] border border-[#E4E7EC] rounded-[12px] items-center justify-center gap-2"
                style={{ width: '48%', height: hp('12%') }}
                activeOpacity={0.7}
              >
                <Calculator size={wp('8%')} color="#008E96" strokeWidth={1.5} />
                <Text
                  className="text-[#101828] font-medium text-center"
                  style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.3%') }}
                >
                  EMI Calculator
                </Text>
              </TouchableOpacity>

              {/* Eligibility Calculator */}
              <TouchableOpacity
                onPress={() => router.push('/screens/ECalculator')}
                className="bg-[#F7F9FA] border border-[#E4E7EC] rounded-[12px] items-center justify-center gap-2"
                style={{ width: '48%', height: hp('12%') }}
                activeOpacity={0.7}
              >
                <Percent size={wp('8%')} color="#008E96" strokeWidth={1.5} />
                <Text
                  className="text-[#101828] font-medium text-center"
                  style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.3%') }}
                >
                  Eligibility Calculator
                </Text>
              </TouchableOpacity>

              {/* Affordability Calculator */}
              <TouchableOpacity
                onPress={() => router.push('/screens/AffordabilityCalculator')}
                className="bg-[#F7F9FA] border border-[#E4E7EC] rounded-[12px] items-center justify-center gap-2"
                style={{ width: '100%', height: hp('12%') }}
                activeOpacity={0.7}
              >
                <HandCoins size={wp('8%')} color="#008E96" strokeWidth={1.5} />
                <Text
                  className="text-[#101828] font-medium text-center"
                  style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.3%') }}
                >
                  Affordability Calculator
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <MenuItem 
            label="News" 
            icon={Newspaper} 
            onPress={() => router.push('/screens/NewsForYou')}
          />
        </View>

        {/* Menu Items Section 3 */}
        <View className="border-t border-[#E4E7EC]" style={{ marginTop: hp('4%'), paddingTop: hp('1%') }}>
          <MenuItem 
            label="Recommended Properties" 
            icon={Home} 
            count="10" 
            onPress={() => router.push('/screens/RecommendedProperties')}
          />
          <MenuItem 
            label="Account Settings" 
            icon={Settings} 
            onPress={() => router.push('/screens/AccountSettings')}
          />
          <MenuItem label="Report a fraud" icon={TriangleAlert} />
        </View>

        {/* Help Centre Section */}
        <View style={{ paddingHorizontal: wp('4%'), marginTop: hp('2%') }}>
          <TouchableOpacity
            className="flex-row items-center bg-[#F7F9FA] rounded-[12px]"
            style={{ paddingHorizontal: wp('4%'), height: hp('7%'), gap: wp('3%') }}
            activeOpacity={0.7}
          >
            <CircleHelp size={wp('6%')} color="#4A5565" strokeWidth={1.5} />
            <Text
              className="text-[#101828] font-medium"
              style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.8%') }}
            >
              Help Centre
            </Text>
          </TouchableOpacity>
        </View>

        {/* Log Out Section */}
        <View style={{ paddingHorizontal: wp('4%'), marginTop: hp('2%'), marginBottom: hp('2.5%') }}>
          <TouchableOpacity
            onPress={isLoggedIn ? handleLogout : () => router.push('/screens/PostProperty/Register')}
            className="flex-row items-center justify-center border-2 border-[#E4E7EC] rounded-[12px]"
            style={{ height: hp('6.5%'), gap: wp('2%') }}
            activeOpacity={0.7}
          >
            <LogOut size={wp('5%')} color="#4A5565" strokeWidth={1.5} />
            <Text
              className="text-[#101828] font-medium text-center"
              style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.8%') }}
            >
              {isLoggedIn ? "Log Out" : "Login"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
