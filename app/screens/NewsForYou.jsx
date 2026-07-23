import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Platform, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NewsForYou = () => {
  const router = useRouter();
  const tabs = ['Latest', 'Property trends', 'Home decor', 'Current news'];
  const [activeTab, setActiveTab] = React.useState('Latest');

  const newsData = {
    'Latest': [
      {
        id: 1,
        title: 'From connectivity to capital appreciation: How is infra...',
        description: 'Luxury housing is no longer confined to a narrow set of traditio...',
        category: 'Property Trends',
        date: 'Apr 23',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000',
      },
      {
        id: 2,
        title: 'Auspicious Griha Pravesh Muhurat dates in 2026',
        description: 'Performing Griha Pravesh at an auspicious time brings good fort...',
        category: 'Property Trends',
        date: 'Apr 22',
        image: 'https://images.unsplash.com/photo-1513584684374-8bdb74838a0f?q=80&w=1000',
      },
      {
        id: 21,
        title: 'Top 5 upcoming residential projects in North Delhi',
        description: 'These projects are set to change the skyline of North Delhi with world-class amenities...',
        category: 'Latest',
        date: 'Apr 21',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000',
      },
      {
        id: 22,
        title: 'Why Gen Z is investing in real estate early?',
        description: 'Financial independence and long-term security are driving young investors...',
        category: 'Insight',
        date: 'Apr 20',
        image: 'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?q=80&w=1000',
      },
      {
        id: 23,
        title: 'The impact of new metro lines on property prices',
        description: 'Connectivity remains the biggest driver for residential demand in the NCR region...',
        category: 'Infrastucture',
        date: 'Apr 19',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000',
      },
    ],
    'Property trends': [
      {
        id: 3,
        title: 'Mumbai Real Estate: Why demand is shifting to Suburbs',
        description: 'With improved infrastructure, the suburbs are seeing a massive hike...',
        category: 'Trends',
        date: 'Apr 25',
        image: 'https://images.unsplash.com/photo-1554231365-1d6ebfa7075c?q=80&w=1000',
      },
      {
        id: 31,
        title: 'Co-living spaces: The future of urban housing?',
        description: 'Millennials are opting for community living over traditional rentals...',
        category: 'New Gen',
        date: 'Apr 24',
        image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=1000',
      },
      {
        id: 32,
        title: 'Sustainability in construction: Green buildings',
        description: 'Ecofriendly materials are becoming the standard for luxury developments...',
        category: 'Eco',
        date: 'Apr 23',
        image: 'https://images.unsplash.com/photo-1448630360428-6e2a2366c1ad?q=80&w=1000',
      },
      {
        id: 33,
        title: 'Rise of Tier-2 cities in the Indian market',
        description: 'Investors are looking beyond metros for better ROI in 2026...',
        category: 'Market',
        date: 'Apr 22',
        image: 'https://images.unsplash.com/photo-1449156001935-d2870597d7bb?q=80&w=1000',
      },
      {
        id: 34,
        title: 'Digital twins in real estate management',
        description: 'How technology is used to create virtual replicas of physical buildings...',
        category: 'Tech',
        date: 'Apr 21',
        image: 'https://images.unsplash.com/photo-1460472178825-e51f73ad2f91?q=80&w=1000',
      },
    ],
    'Home decor': [
      {
        id: 4,
        title: '10 Minimalist design ideas for your new apartment',
        description: 'Small spaces can feel huge with these smart decor tricks...',
        category: 'Decor',
        date: 'Apr 20',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000',
      },
      {
        id: 41,
        title: 'Vastu tips for a harmonious living room',
        description: 'Balance energy in your home with these simple Vastu principles...',
        category: 'Vastu',
        date: 'Apr 19',
        image: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=1000',
      },
      {
        id: 42,
        title: 'Best Indoor plants for low light conditions',
        description: 'Keep your home green even without direct sunlight...',
        category: 'Nature',
        date: 'Apr 18',
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1000',
      },
      {
        id: 43,
        title: 'Color palettes that will dominate 2026',
        description: 'From earthy tones to bold accents, here is what is trending...',
        category: 'Design',
        date: 'Apr 17',
        image: 'https://images.unsplash.com/photo-1556035511-3168381bb4d4?q=80&w=1000',
      },
      {
        id: 44,
        title: 'Modular kitchens vs Traditional: A comparison',
        description: 'Which one offers better utility and style for your home?',
        category: 'Kitchen',
        date: 'Apr 16',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000',
      },
    ],
    'Current news': [
      {
        id: 5,
        title: 'Government announces new tax benefits for IT buyers',
        description: 'A major boost for first-time home buyers in the latest budget...',
        category: 'Policy',
        date: 'Apr 18',
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1000',
      },
      {
        id: 51,
        title: 'RBI maintains interest rates: Good news for EMI?',
        description: 'Stability in home loan rates expected for the next two quarters...',
        category: 'Finance',
        date: 'Apr 17',
        image: 'https://images.unsplash.com/photo-1550565118-3d1428df4a78?q=80&w=1000',
      },
      {
        id: 52,
        title: 'New RERA guidelines to protect home buyers',
        description: 'Stricter penalties for developers failing to deliver on time...',
        category: 'Regulation',
        date: 'Apr 16',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000',
      },
      {
        id: 53,
        title: 'Global investors pouring capital into Indian REITs',
        description: 'The commercial sector is seeing unprecedented foreign investment...',
        category: 'Investment',
        date: 'Apr 15',
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1000',
      },
      {
        id: 54,
        title: 'Digital land records: No more property disputes?',
        description: 'How blockchain is being used to digitize land ownership records...',
        category: 'Tech',
        date: 'Apr 14',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000',
      },
    ]
  };

  return (
    <SafeAreaView 
      className="flex-1 bg-white" 
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
    >
      {/* Static Header & Tabs Section */}
      <View>
        {/* Header */}
        <View className="flex-row items-center" style={{ paddingHorizontal: wp('4%'), height: hp('5%') }}>
          <TouchableOpacity 
            onPress={() => router.back()}
            className="items-center justify-center"
            style={{ width: wp('10%'), height: wp('10%') }}
          >
            <Ionicons name="arrow-back" size={wp('6%')} color="#101828" />
          </TouchableOpacity>
        </View>

        {/* Featured News Card */}
        <View className="bg-white border border-[#E4E7EC] overflow-hidden" 
              style={{ marginHorizontal: wp('4%'), borderRadius: wp('4%'), width: SCREEN_WIDTH - wp('8%') }}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000' }}
            className="w-full"
            style={{ height: hp('20%') }}
          />
          <View style={{ padding: wp('4%') }}>
            <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('4%'), lineHeight: wp('5%') }}>
              Commercial Real Estate Trends 2025
            </Text>
            <Text className="text-[#6A7282] font-medium" style={{ fontSize: wp('3.5%'), lineHeight: wp('5.5%'), marginTop: hp('1%') }}>
              Explore the latest market trends and investment opportunities in commercial properties.
            </Text>
            <View className="flex-row items-center" style={{ marginTop: hp('1.5%'), gap: wp('3%') }}>
              <Text className="text-[#6A7282] font-medium" style={{ fontSize: wp('3%') }}>Apr 14, 2026</Text>
              <Text className="text-[#6A7282] font-medium" style={{ fontSize: wp('3%') }}>•</Text>
              <View className="flex-row items-center" style={{ gap: wp('1%') }}>
                <Feather name="clock" size={wp('3%')} color="#6A7282" />
                <Text className="text-[#6A7282] font-medium" style={{ fontSize: wp('3%') }}>5 min read</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={{ marginTop: hp('1.5%') }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: wp('4%') }}>
            <View className="flex-row" style={{ gap: wp('5%') }}>
              {tabs.map((tab) => (
                <TouchableOpacity 
                  key={tab} 
                  onPress={() => setActiveTab(tab)}
                  style={{ paddingBottom: hp('1%') }}
                >
                  <Text className={`font-medium ${activeTab === tab ? 'text-[#008E96]' : 'text-[#6A7282]'}`} style={{ fontSize: wp('3.5%') }}>
                    {tab}
                  </Text>
                  {activeTab === tab && (
                    <View className="absolute bottom-0 left-0 right-0 bg-[#008E96]" style={{ height: hp('0.3%'), borderTopLeftRadius: wp('0.5%'), borderTopRightRadius: wp('0.5%') }} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Section Title moved to Static area */}
        <View style={{ paddingHorizontal: wp('4%'), marginTop: hp('1.5%') }}>
          <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('5%'), lineHeight: wp('7.5%') }}>News for you</Text>
        </View>
      </View>

      {/* Scrollable News Items Section */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* News Items List */}
        <View style={{ paddingHorizontal: wp('4%'), marginTop: hp('2%'), gap: hp('2%'), marginBottom: hp('5%') }}>
          {newsData[activeTab].map((item) => (
            <View key={item.id} className="flex-row items-start border-bottom border-[#F2F4F7]" style={{ paddingBottom: hp('2%'), borderBottomWidth: 0.67, borderBottomColor: '#F2F4F7' }}>
              <Image 
                source={{ uri: item.image }}
                style={{ width: wp('18%'), height: wp('18%'), borderRadius: wp('3%') }}
              />
              <View className="flex-1" style={{ marginLeft: wp('3%') }}>
                <Text className="text-[#101828] font-semibold" style={{ fontSize: wp('4%'), lineHeight: wp('5.5%') }} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text className="text-[#6A7282] font-normal" style={{ fontSize: wp('3.3%'), lineHeight: wp('4.5%'), marginTop: hp('0.5%') }} numberOfLines={2}>
                  {item.description}
                </Text>
                <View className="flex-row justify-between items-center" style={{ marginTop: hp('1%') }}>
                  <Text className="text-[#98A2B3] font-normal" style={{ fontSize: wp('3%') }}>
                    {item.category} • {item.date}
                  </Text>
                  <TouchableOpacity className="rounded-full bg-[#F2F4F7] items-center justify-center" style={{ width: wp('8%'), height: wp('8%') }}>
                    <Feather name="share-2" size={wp('4%')} color="#6A7282" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewsForYou;
