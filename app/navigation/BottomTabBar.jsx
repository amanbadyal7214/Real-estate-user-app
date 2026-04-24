import { router } from 'expo-router';
import { BarChart2, Heart, Home, Search, User } from 'lucide-react-native';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

const BottomTabBar = ({ activeTab = 'Search' }) => {
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
      <TouchableOpacity onPress={() => router.push('/')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 55, gap: 4 }}>
        <Search color={activeTab === 'Search' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={24} />
        <Text style={{ color: activeTab === 'Search' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: 11, textAlign: 'center', marginTop: 4 }}>Search</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/screens/Buy/Insights')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 55, gap: 4 }}>
        <BarChart2 color={activeTab === 'Insights' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={24} />
        <Text style={{ color: activeTab === 'Insights' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: 11, textAlign: 'center', marginTop: 4 }}>Insights</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/screens/Buy/Suggestions')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 55, gap: 4 }}>
        <Home color={activeTab === 'Suggestions' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={24} />
        <Text style={{ color: activeTab === 'Suggestions' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: 11, textAlign: 'center', marginTop: 4 }}>Suggestions</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/screens/Saved')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 55, gap: 4 }}>
        <Heart color={activeTab === 'Saved' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={24} />
        <Text style={{ color: activeTab === 'Saved' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: 11, textAlign: 'center', marginTop: 4 }}>Saved</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/profile')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 55, gap: 4 }}>
        <User color={activeTab === 'Profile' ? "#008E96" : "rgba(16, 24, 40, 0.82)"} size={24} />
        <Text style={{ color: activeTab === 'Profile' ? '#008E96' : 'rgba(16, 24, 40, 0.82)', fontFamily: 'Inter-Medium', fontSize: 11, textAlign: 'center', marginTop: 4 }}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomTabBar;
