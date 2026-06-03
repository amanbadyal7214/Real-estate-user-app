import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {
    ArrowLeft,
    Building,
    ChevronDown,
    ChevronRight,
    CircleHelp,
    CreditCard,
    Crown,
    Eye,
    FileText,
    Folder,
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
    Zap
} from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserActivity } from '../../hooks/useUserActivity';
import PropertyCardSmall from '../../components/PropertyCardSmall';

const ProfileHeader = () => {
  return (
    <View className="bg-white px-4 py-3 flex-row items-start justify-between">
      <View className="flex-row gap-3">
        {/* Avatar Container - 68x68 Teal Circle */}
        <View 
          className="w-[68px] h-[68px] items-center justify-center bg-[#008E96]"
          style={{ borderRadius: 68 / 2 }}
        >
          {/* Inner Circle - 48x48 White Circle */}
          <View 
            className="w-[48px] h-[48px] items-center justify-center bg-white/90"
            style={{ borderRadius: 48 / 2 }}
          >
            <Text 
              className="text-[#008E96] text-[24px] font-semibold"
              style={{ fontFamily: 'Inter-SemiBold', marginTop: -2 }}
            >
              P
            </Text>
          </View>
        </View>

        {/* User Info */}
        <View className="ml-1">
          <Text 
            className="text-[#101828] text-[18px] font-semibold"
            style={{ fontFamily: 'Inter-SemiBold' }}
          >
            Hello Guest !
          </Text>
          <Text 
            className="text-[#4A5565] text-[13px] font-normal mt-0.5"
            style={{ fontFamily: 'Inter-Regular' }}
          >
            guest@example.com
          </Text>
          <Text 
            className="text-[#4A5565] text-[13px] font-normal"
            style={{ fontFamily: 'Inter-Regular' }}
          >
            +91-6284461119
          </Text>
          
          <TouchableOpacity className="flex-row items-center mt-3 gap-1.5" activeOpacity={0.7}>
            <Crown size={16} color="#008E96" fill="#008E96" />
            <Text 
              className="text-[#008E96] text-[13px] font-medium"
              style={{ fontFamily: 'Inter-Medium' }}
            >
              Upgrade to Premium
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Edit Button */}
      <TouchableOpacity 
        className="px-4 py-2 border border-[#E4E7EC] rounded-full"
        activeOpacity={0.7}
      >
        <Text 
          className="text-[#101828] text-[14px] font-medium"
          style={{ fontFamily: 'Inter-Medium' }}
        >
          Edit
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const ActivityTabCard = ({ id, label1, label2, count, icon: Icon, isActive, onPress }) => {
  return (
    <View className="items-center mr-3">
      <TouchableOpacity 
        onPress={() => onPress(id)}
        className={`w-[95px] h-[110px] rounded-[13px] items-center justify-center border-2 ${
          isActive ? 'bg-[#008E9614] border-[#008E96]' : 'bg-white border-[#E4E7EC]'
        }`}
        activeOpacity={0.7}
      >
        {/* Icon & Badge Container */}
        <View className="relative w-[28px] h-[28px] mb-4">
          <Icon size={28} color={isActive ? "#008E96" : "#6A7282"} strokeWidth={1.5} />
          {count && (
            <View 
              className={`absolute -top-2 -right-3 px-1.5 py-0.5 rounded-full items-center justify-center h-[24px] min-w-[24.22px] ${
                isActive ? 'bg-[#008E96]' : 'bg-[#E4E7EC]'
              }`}
            >
              <Text 
                className={`text-[11px] font-bold ${isActive ? 'text-white' : 'text-[#6A7282]'}`}
                style={{ fontFamily: 'Inter-SemiBold' }}
              >
                {count}
              </Text>
            </View>
          )}
        </View>

        {/* Labels */}
        <View className="items-center px-1">
          <Text 
            className={`text-[13px] font-medium leading-[16px] text-center ${
              isActive ? 'text-[#101828]' : 'text-[#6A7282]'
            }`}
            style={{ fontFamily: 'Inter-Medium' }}
          >
            {label1}
          </Text>
          <Text 
            className={`text-[13px] font-medium leading-[16px] text-center ${
              isActive ? 'text-[#101828]' : 'text-[#6A7282]'
            }`}
            style={{ fontFamily: 'Inter-Medium' }}
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
    <View className="px-4 py-4">
      <LinearGradient
        colors={['#FFF8E7', '#FFE8D6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 16, borderWeight: 0.67, borderColor: '#E4E7EC', borderWidth: 0.67 }}
        className="flex-row items-center p-5 gap-4 h-[133.33px]"
      >
        {/* House Illustration */}
        <View className="w-[90px] h-[90px] items-center justify-center relative">
          <View className="absolute inset-0 items-center justify-center">
             <Building size={60} color="#D4A574" opacity={0.6} />
          </View>
          <View className="absolute top-2 right-2 w-8 h-8 rounded-full border-2 border-[#F4A261] opacity-60" />
        </View>

        {/* Content */}
        <View className="flex-1 justify-center">
          <Text 
            className="text-[#101828] text-[16px] font-semibold leading-[20px] mb-3"
            style={{ fontFamily: 'Inter-SemiBold' }}
          >
            Looking to sell/rent{"\n"}your property?
          </Text>
          
          <TouchableOpacity 
            className="bg-white px-3 py-2 rounded-[10px] self-start items-center justify-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2,
              width: 140
            }}
          >
            <Text 
              className="text-[#101828] text-[14px] font-medium"
              style={{ fontFamily: 'Inter-Medium' }}
            >
              Post property for
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const MenuItem = ({ label, icon: Icon, isNew = false, indicator = 'ChevronRight', count = null }) => {
  const IndicatorIcon = indicator === 'ChevronDown' ? ChevronDown : ChevronRight;
  
  return (
    <TouchableOpacity 
      className="flex-row items-center px-4 h-[52px] gap-[12px]"
      activeOpacity={0.7}
    >
      <View className="w-6 h-6 items-center justify-center">
        <Icon size={24} color="#4A5565" strokeWidth={1.5} />
      </View>
      
      <View className="flex-1">
        <Text 
          className="text-[#101828] text-[15px] font-medium leading-[22px]"
          style={{ fontFamily: 'Inter-Medium' }}
        >
          {label}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        {count && (
          <View className="bg-[#E4E7EC] px-2.5 py-0.5 rounded-full items-center justify-center">
            <Text 
              className="text-[#6A7282] text-[13px] font-semibold"
              style={{ fontFamily: 'Inter-SemiBold', lineHeight: 20 }}
            >
              {count}
            </Text>
          </View>
        )}
        {isNew && (
          <View className="bg-[#008E96] px-2 py-0.5 rounded-[4px] items-center justify-center">
            <Text 
                className="text-white text-[11px] font-bold uppercase"
                style={{ fontFamily: 'Inter-Bold', lineHeight: 16 }}
            >
                NEW
            </Text>
          </View>
        )}
        <IndicatorIcon size={20} color="#6A7282" />
      </View>
    </TouchableOpacity>
  );
};

const QuickLinks = () => {
  return (
    <View className="mt-8 border-t border-[#E4E7EC] pt-4">
      {/* Header Row */}
      <View className="flex-row items-center px-4 mb-4 gap-3">
        <HandCoins size={24} color="#101828" strokeWidth={1.5} />
        <Text 
          className="flex-1 text-[#101828] text-[18px] font-semibold"
          style={{ fontFamily: 'Inter-SemiBold' }}
        >
          Quick Links
        </Text>
        <ChevronDown size={20} color="#6A7282" />
      </View>

      {/* Grid of Cards */}
      <View className="flex-row px-4 justify-between gap-3">
        {/* Smart Deals Card */}
        <TouchableOpacity 
          className="flex-1 h-[100px] bg-[#F7F9FA] border border-[#E4E7EC] rounded-[12px] items-center justify-center gap-2"
          activeOpacity={0.7}
        >
          <Zap size={32} color="#008E96" strokeWidth={1.5} />
          <Text 
            className="text-[#101828] text-[14px] font-medium"
            style={{ fontFamily: 'Inter-Medium' }}
          >
            Smart Deals
          </Text>
        </TouchableOpacity>

        {/* Sell/Rent Property Card */}
        <TouchableOpacity 
          className="flex-1 h-[100px] bg-[#F7F9FA] border border-[#E4E7EC] rounded-[12px] items-center justify-center gap-2 relative"
          activeOpacity={0.7}
        >
          {/* FREE Badge */}
          <View className="absolute top-2 right-2 bg-[#008E96] px-2 py-0.5 rounded-[4px]">
            <Text 
              className="text-white text-[11px] font-bold uppercase"
              style={{ fontFamily: 'Inter-Bold', lineHeight: 16 }}
            >
              FREE
            </Text>
          </View>
          
          <HandCoins size={32} color="#008E96" strokeWidth={1.5} />
          <Text 
            className="text-[#101828] text-[14px] font-medium"
            style={{ fontFamily: 'Inter-Medium' }}
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
      <View className="items-center justify-center pt-4 pb-8 px-16">
        <View className="w-[200px] h-[200px] items-center justify-center relative mb-8">
          <View className="absolute inset-0 items-center justify-center">
            <Folder size={120} color="#008E96" strokeWidth={1.5} fill="rgba(28, 178, 169, 0.15)" />
          </View>
          <View className="absolute top-10 right-10 bg-white p-1 rounded-sm border border-[#008E96]">
             <Heart size={16} color="#008E96" fill="#008E96" />
          </View>
          <View className="absolute bottom-12 right-12">
             <Search size={24} color="#008E96" strokeWidth={2.5} />
          </View>
          <View className="absolute left-6 top-1/2 w-2 h-2 rounded-full bg-[#008E961A]" />
          <View className="absolute right-6 top-2/3 w-2 h-2 rounded-full bg-[#008E961A]" />
          <View className="absolute left-10 bottom-1/3 w-2 h-2 rounded-full bg-[#008E961A]" />
        </View>

        <TouchableOpacity 
          className="h-[48.5px] w-[176.18px] items-center justify-center bg-[#008E961A] rounded-[14px]"
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
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Navigator Back Header */}
      <View className="px-4  justify-center">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#101828" />
        </TouchableOpacity>
      </View>

      <ProfileHeader />

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {/* My Activity Section */}
        <View>
          <Text 
            className="text-[#101828] text-[18px] font-semibold mb-5 px-4"
            style={{ fontFamily: 'Inter-SemiBold' }}
          >
            My Activity
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 h-[130px]">
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
          <MenuItem label="Zero Brokerage Properties" icon={Gem} />
          <MenuItem label="Saved Search" icon={History} />
          <MenuItem label="My Transactions" icon={CreditCard} />
          <MenuItem label="My Reviews" icon={Star} isNew={true} />
        </View>

        {/* Quick Links Section */}
        <QuickLinks />

        {/* Menu Items Section 2 */}
        <View className="mt-8 border-t border-[#E4E7EC] pt-2">
          <MenuItem label="Residential Packages" icon={FileText} />
          <MenuItem label="Home Search" icon={Home} />
          <MenuItem label="Tools & Advices" icon={Puzzle} />
          <MenuItem label="Housing News" icon={Newspaper} />
          <MenuItem label="Housing Edge Services" icon={Home} />
        </View>

        {/* Menu Items Section 3 */}
        <View className="mt-8 border-t border-[#E4E7EC] pt-2">
          <MenuItem label="Recommended Properties" icon={Home} count="10" />
          <MenuItem label="Account Settings" icon={Settings} />
          <MenuItem label="Report a fraud" icon={TriangleAlert} />
        </View>

        {/* Help Centre Section */}
        <View className="px-4 mt-4">
          <TouchableOpacity 
            className="flex-row items-center px-4 h-[56px] bg-[#F7F9FA] rounded-[12px] gap-[12px]"
            activeOpacity={0.7}
          >
            <CircleHelp size={24} color="#4A5565" strokeWidth={1.5} />
            <Text 
              className="text-[#101828] text-[15px] font-medium"
              style={{ fontFamily: 'Inter-Medium' }}
            >
              Help Centre
            </Text>
          </TouchableOpacity>
        </View>

        {/* Log Out Section */}
        <View className="px-4 mt-4 mb-5">
          <TouchableOpacity 
            onPress={isLoggedIn ? handleLogout : () => router.push('/screens/PostProperty/Register')}
            className="flex-row items-center justify-center h-[50.5px] border-2 border-[#E4E7EC] rounded-[12px] gap-[8px]"
            activeOpacity={0.7}
          >
            <LogOut size={20} color="#4A5565" strokeWidth={1.5} />
            <Text 
              className="text-[#101828] text-[15px] font-medium text-center"
              style={{ fontFamily: 'Inter-Medium' }}
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
