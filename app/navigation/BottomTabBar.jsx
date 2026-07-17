import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Heart, Search, Sparkles, User } from 'lucide-react-native';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomTabBar = ({ activeTab = 'Search', mode = 'Buy' }) => {
  const insets = useSafeAreaInsets();
  const handleProtectedNavigation = async (destination) => {
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

  const getSearchRoute = () => {
    switch (mode) {
      case 'Rent':
        return '/screens/Rent/Rentsearch';
      case 'PG':
        return '/screens/PG/PGSearch';
      case 'Project':
        return '/screens/Project/ProjectSearch';
      case 'Commercial':
        return '/screens/Commercial/CommercialSearch';
      case 'Plot':
        return '/screens/Plot/PlotSearch';
      case 'Buy':
      default:
        return '/screens/Buy/BuySearch';
    }
  };

  if (mode === 'Plot') {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: insets.bottom + hp('1%'),
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? hp('8.6%') : hp('8%'),
          backgroundColor: '#FFFFFF',
          borderWidth: 2,
          borderColor: '#008E96',
          borderBottomWidth: 1,
          borderTopWidth: 1,
          borderTopLeftRadius: wp('9.3%'),
          borderTopRightRadius: wp('9.3%'),
          borderBottomLeftRadius: wp('9.3%'),
          borderBottomRightRadius: wp('9.3%'),
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginHorizontal: wp('1.3%'),
          alignItems: 'flex-start',
          paddingTop: hp('0.5%'),
          paddingHorizontal: wp('1.1%'),
          paddingBottom: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: hp('-0.5%') },
          shadowOpacity: 0.1,
          shadowRadius: wp('2.7%'),
          elevation: 8,
        }}
      >
        <TouchableOpacity onPress={() => router.push(getSearchRoute())} style={{ width: wp('21.3%'), alignItems: 'center', justifyContent: 'center', height: hp('6.8%'), gap: wp('1.1%') }}>
          <Search color={activeTab === 'Search' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={wp('6.4%')} />
          <Text style={{ color: activeTab === 'Search' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: wp('2.9%'), textAlign: 'center' }}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleProtectedNavigation('/screens/Saved')} style={{ width: wp('21.3%'), alignItems: 'center', justifyContent: 'center', height: hp('6.8%'), gap: wp('1.1%') }}>
          <Heart color={activeTab === 'Saved' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={wp('6.4%')} />
          <Text style={{ color: activeTab === 'Saved' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: wp('2.9%'), textAlign: 'center' }}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/screens/Profile')} style={{ width: wp('21.3%'), alignItems: 'center', justifyContent: 'center', height: hp('6.8%'), gap: wp('1.1%') }}>
          <User color={activeTab === 'Profile' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={wp('6.4%')} />
          <Text style={{ color: activeTab === 'Profile' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: wp('2.9%'), textAlign: 'center' }}>Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (mode === 'Rent' || mode === 'PG') {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: insets.bottom + hp('1%'),
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? hp('8.6%') : hp('8%'),
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: '#008E96',
          borderBottomWidth: 1,
          borderTopWidth: 1,
          borderTopLeftRadius: wp('9.3%'),
          borderTopRightRadius: wp('9.3%'),
          borderBottomLeftRadius: wp('9.3%'),
          borderBottomRightRadius: wp('9.3%'),
          flexDirection: 'row',
          justifyContent: 'space-around', // Using space-around for 4 items
          alignItems: 'flex-start',
          marginHorizontal: wp('1.3%'),
          paddingTop: hp('0.7%'),
          paddingHorizontal: wp('1.1%'),
          paddingBottom: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: hp('-0.5%') },
          shadowOpacity: 0.1,
          shadowRadius: wp('2.7%'),
          elevation: 8,
        }}
      >
        <TouchableOpacity onPress={() => router.push(getSearchRoute())} style={{ width: wp('21.3%'), alignItems: 'center', justifyContent: 'center', height: hp('6.8%'), gap: wp('1.1%') }}>
          <Search color={activeTab === 'Search' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={wp('6.4%')} />
          <Text style={{ color: activeTab === 'Search' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: wp('2.9%'), textAlign: 'center' }}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleProtectedNavigation('/screens/Rent/services')} style={{ width: wp('21.3%'), alignItems: 'center', justifyContent: 'center', height: hp('6.8%'), gap: wp('1.1%') }}>
          <MaterialCommunityIcons name="room-service-outline" color={activeTab === 'Services' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={wp('6.4%')} />
          <Text style={{ color: activeTab === 'Services' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: wp('2.9%'), textAlign: 'center' }}>services</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleProtectedNavigation('/screens/Saved')} style={{ width: wp('21.3%'), alignItems: 'center', justifyContent: 'center', height: hp('6.8%'), gap: wp('1.1%') }}>
          <Heart color={activeTab === 'Saved' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={wp('6.4%')} />
          <Text style={{ color: activeTab === 'Saved' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: wp('2.9%'), textAlign: 'center' }}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/screens/Profile')} style={{ width: wp('21.3%'), alignItems: 'center', justifyContent: 'center', height: hp('6.8%'), gap: wp('1.1%') }}>
          <User color={activeTab === 'Profile' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={wp('6.4%')} />
          <Text style={{ color: activeTab === 'Profile' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: wp('2.9%'), textAlign: 'center' }}>Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Default Buy Mode
  return (
    <View
      style={{
        position: 'absolute',
        bottom: insets.bottom + hp('1%'),
        left: 0,
        right: 0,
        height: Platform.OS === 'ios' ? hp('8.6%') : hp('8%'),
        backgroundColor: '#FFFFFF',
        marginHorizontal: wp('1.3%'),
        borderWidth: 1,
        borderColor: '#008E96',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderTopLeftRadius: wp('9.3%'),
        borderTopRightRadius: wp('9.3%'),
        borderBottomLeftRadius: wp('9.3%'),
        borderBottomRightRadius: wp('9.3%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingTop: hp('0.7%'),
        paddingHorizontal: wp('2.1%'),
        paddingBottom: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp('-0.5%') },
        shadowOpacity: 0.1,
        shadowRadius: wp('2.7%'),
        elevation: 8,
      }}
    >
      <TouchableOpacity onPress={() => router.push(getSearchRoute())} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: hp('6.8%'), gap: wp('1.1%') }}>
        <Search color={activeTab === 'Search' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={wp('6.4%')} />
        <Text style={{ color: activeTab === 'Search' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: wp('2.9%'), textAlign: 'center' }}>Explore</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleProtectedNavigation('/screens/Buy/Insights')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: hp('6.8%'), gap: wp('1.1%') }}>
        <MaterialCommunityIcons name="google-analytics" color={activeTab === 'Insights' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={wp('6.4%')} />
        <Text style={{ color: activeTab === 'Insights' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: wp('2.9%'), textAlign: 'center' }}>Trends</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleProtectedNavigation('/screens/Buy/Suggestions')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: hp('6.8%'), gap: wp('1.1%') }}>
        <Sparkles color={activeTab === 'Suggestions' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={wp('6.4%')} />
        <Text style={{ color: activeTab === 'Suggestions' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: wp('2.9%'), textAlign: 'center' }}>For You</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleProtectedNavigation('/screens/Saved')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: hp('6.8%'), gap: wp('1.1%') }}>
        <Heart color={activeTab === 'Saved' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={wp('6.4%')} />
        <Text style={{ color: activeTab === 'Saved' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: wp('2.9%'), textAlign: 'center' }}>Favorites</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/screens/Profile')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: hp('6.8%'), gap: wp('1.1%') }}>
        <User color={activeTab === 'Profile' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={wp('6.4%')} />
        <Text style={{ color: activeTab === 'Profile' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: wp('2.9%'), textAlign: 'center' }}>Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomTabBar;
