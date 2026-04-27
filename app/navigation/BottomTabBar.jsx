import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Heart, Search, User } from 'lucide-react-native';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

const BottomTabBar = ({ activeTab = 'Search', mode = 'Buy' }) => {
  const getSearchRoute = () => {
    switch (mode) {
      case 'Rent':
      case 'PG':
        return '/screens/Rent/Rentsearch';
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
          bottom: 0,
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? 90 : 81,
          backgroundColor: '#FFFFFF',
          borderWidth: 2,
          borderColor: '#008E96',
          borderBottomWidth: 0,
          borderTopWidth: 1,
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'flex-start',
          paddingTop: 12,
          paddingHorizontal: 8,
          paddingBottom: Platform.OS === 'ios' ? 20 : 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 8,
        }}
      >
        <TouchableOpacity onPress={() => router.push(getSearchRoute())} style={{ width: 80, alignItems: 'center', justifyContent: 'center', height: 55, gap: 4 }}>
          <Search color={activeTab === 'Search' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={24} />
          <Text style={{ color: activeTab === 'Search' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: 11, textAlign: 'center', marginTop: 4 }}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/screens/Saved')} style={{ width: 80, alignItems: 'center', justifyContent: 'center', height: 55, gap: 4 }}>
          <Heart color={activeTab === 'Saved' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={24} />
          <Text style={{ color: activeTab === 'Saved' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: 11, textAlign: 'center', marginTop: 4 }}>Saved</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/screens/Profile')} style={{ width: 80, alignItems: 'center', justifyContent: 'center', height: 55, gap: 4 }}>
          <User color={activeTab === 'Profile' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={24} />
          <Text style={{ color: activeTab === 'Profile' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: 11, textAlign: 'center', marginTop: 4 }}>Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (mode === 'Rent' || mode === 'PG') {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? 90 : 81,
          backgroundColor: '#FFFFFF',
          borderWidth: 2,
          borderColor: '#008E96',
          borderBottomWidth: 0,
          borderTopWidth: 1,
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
          flexDirection: 'row',
          justifyContent: 'space-around', // Using space-around for 4 items
          alignItems: 'flex-start',
          paddingTop: 12,
          paddingHorizontal: 8,
          paddingBottom: Platform.OS === 'ios' ? 20 : 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 8,
        }}
      >
        <TouchableOpacity onPress={() => router.push(getSearchRoute())} style={{ width: 80, alignItems: 'center', justifyContent: 'center', height: 55, gap: 4 }}>
          <Search color={activeTab === 'Search' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={24} />
          <Text style={{ color: activeTab === 'Search' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: 11, textAlign: 'center', marginTop: 4 }}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/screens/Rent/services')} style={{ width: 80, alignItems: 'center', justifyContent: 'center', height: 55, gap: 4 }}>
          <MaterialCommunityIcons name="room-service-outline" color={activeTab === 'Services' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={24} />
          <Text style={{ color: activeTab === 'Services' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: 11, textAlign: 'center', marginTop: 4 }}>services</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/screens/Saved')} style={{ width: 80, alignItems: 'center', justifyContent: 'center', height: 55, gap: 4 }}>
          <Heart color={activeTab === 'Saved' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={24} />
          <Text style={{ color: activeTab === 'Saved' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: 11, textAlign: 'center', marginTop: 4 }}>Saved</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/screens/Profile')} style={{ width: 80, alignItems: 'center', justifyContent: 'center', height: 55, gap: 4 }}>
          <User color={activeTab === 'Profile' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={24} />
          <Text style={{ color: activeTab === 'Profile' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: 11, textAlign: 'center', marginTop: 4 }}>Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Default Buy Mode
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: Platform.OS === 'ios' ? 90 : 81,
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#008E96',
        borderBottomWidth: 0,
        borderTopWidth: 1,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingTop: 12,
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
      }}
    >
      <TouchableOpacity onPress={() => router.push(getSearchRoute())} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 55, gap: 4 }}>
        <Search color={activeTab === 'Search' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={24} />
        <Text style={{ color: activeTab === 'Search' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: 11, textAlign: 'center', marginTop: 4 }}>Search</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/screens/Buy/Insights')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 55, gap: 4 }}>
        <MaterialCommunityIcons name="google-analytics" color={activeTab === 'Insights' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={24} />
        <Text style={{ color: activeTab === 'Insights' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: 11, textAlign: 'center', marginTop: 4 }}>Insights</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/screens/Buy/Suggestions')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 55, gap: 4 }}>
        <Search color={activeTab === 'Suggestions' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={24} />
        <Text style={{ color: activeTab === 'Suggestions' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: 11, textAlign: 'center', marginTop: 4 }}>Suggestions</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/screens/Saved')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 55, gap: 4 }}>
        <Heart color={activeTab === 'Saved' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={24} />
        <Text style={{ color: activeTab === 'Saved' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: 11, textAlign: 'center', marginTop: 4 }}>Saved</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/screens/Profile')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 55, gap: 4 }}>
        <User color={activeTab === 'Profile' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={24} />
        <Text style={{ color: activeTab === 'Profile' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: 11, textAlign: 'center', marginTop: 4 }}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomTabBar;
