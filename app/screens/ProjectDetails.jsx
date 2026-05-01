import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect, useRef } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InvestmentInsightsCard from '../../components/InvestmentInsightsCard';
import ProjectBrochureCard from '../../components/ProjectBrochureCard';
import ProjectComparisonSection from '../../components/ProjectComparisonSection';
import ProjectConfigCard from '../../components/ProjectConfigCard';
import ProjectContactFormCard from '../../components/ProjectContactFormCard';
import ProjectDisclaimerCard from '../../components/ProjectDisclaimerCard';
import ProjectFinancialServicesCard from '../../components/ProjectFinancialServicesCard';
import ProjectMapCard from '../../components/ProjectMapCard';
import ProjectSellerCard from '../../components/ProjectSellerCard';

const ProjectDetails = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef(null);
  
  const images = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(timer);
  }, []);

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setCurrentImageIndex(Math.round(index));
  };

  const configData = [
    {
      title: "3 BHK",
      areaRange: "3284 - 3729 sq.ft.",
      priceRange: "₹3.24 Cr - ₹3.73 Cr"
    },
    {
      title: "4 BHK",
      areaRange: "3800 - 4100 sq.ft.",
      priceRange: "₹3.80 Cr - ₹4.10 Cr"
    },
    {
      title: "5 BHK",
      areaRange: "4275 - 4769 sq.ft.",
      priceRange: "₹4.49 Cr - ₹5.01 Cr"
    },
    {
      title: "6 BHK",
      areaRange: "5000 - 5500 sq.ft.",
      priceRange: "₹5.50 Cr - ₹6.20 Cr"
    }
  ];

  const comparisonData = [
    {
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=400',
      possession: 'Feb, 2031',
      name: 'Vamana Riseonic',
      locality: 'New Chandigarh, Chandigarh',
      bhk: '3 BHK',
      area: '3421.0 sq.ft',
      price: '3.24 Cr'
    },
    {
      image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=400',
      possession: 'Apr, 2029',
      name: 'The Tiara',
      locality: 'New Chandigarh, Chandigarh',
      bhk: '4 BHK',
      area: '4079.0 sq.ft',
      price: '4.49 Cr'
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-1 bg-[#F9FAFB]">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Image Section */}
          <View className="w-full h-[320px] rounded-b-[40px] overflow-hidden bg-gray-200">
            <FlatList
              ref={flatListRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={{ width: Dimensions.get('window').width, height: 320 }}
                  resizeMode="cover"
                />
              )}
            />
            
            <LinearGradient
              colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
              className="absolute inset-0"
            />
            
            <View className="absolute top-0 left-0 right-0 flex-row justify-between items-center px-4 mt-4">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-12 h-12 bg-black/40 rounded-full items-center justify-center"
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <View className="flex-row gap-3">
                <TouchableOpacity className="w-10 h-10 bg-black/40 rounded-full items-center justify-center">
                  <Ionicons name="share-social-outline" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="w-10 h-10 bg-black/40 rounded-full items-center justify-center">
                  <Ionicons name="heart-outline" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="w-10 h-10 bg-black/40 rounded-full items-center justify-center">
                  <Ionicons name="chatbubble-outline" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="absolute bottom-10 left-4 gap-2">
              <View className="bg-[#008E96] self-start px-2 py-1 rounded-[4px] flex-row items-center gap-1">
                <Ionicons name="checkmark" size={12} color="white" />
                <Text className="text-white text-[12px] font-inter-regular">RERA</Text>
              </View>
              <Text className="text-white text-[24px] font-inter-medium">Vamana Riseonic</Text>
              <View className="flex-row justify-between items-center w-[358px]">
                 <Text className="text-white text-[14px] font-inter-regular">New Chandigarh, Chandigarh</Text>
                 <TouchableOpacity className="bg-white/20 px-4 py-2 rounded-[10px] flex-row items-center gap-2">
                   <Ionicons name="location-outline" size={16} color="white" />
                   <Text className="text-white font-inter-medium text-[14px]">See on Map</Text>
                 </TouchableOpacity>
              </View>
            </View>

            <View className="absolute bottom-6 right-4 bg-black/60 px-3 py-1 rounded-full">
              <Text className="text-white text-[14px] font-inter-regular">
                {currentImageIndex + 1}/{images.length}
              </Text>
            </View>
          </View>

          {/* Price & BHK Section */}
        <View className="bg-white p-4 border-b border-[#E5E7EB]">
          <Text className="text-[#6A7282] text-[12px] mb-2 font-inter-regular">Zero Brokerage • Possession by Feb, 2031 • Avg. rate ₹ 9.87K - ₹ 10.50K / sq.ft.</Text>
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-[#0A0A0A] text-[20px] font-inter-medium">₹ 3.24 Cr - ₹ 5.01 Cr</Text>
            <Text className="text-[#6A7282] text-[16px] font-inter-regular">ⓘ</Text>
          </View>
          <Text className="text-[#6A7282] text-[14px] font-inter-regular">3, 5 BHK Apartments</Text>
        </View>

        {/* Tab Navigation Placeholder */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-4 gap-2">
            {['Overview', 'Highlights', 'Property Tour', 'Data Insights'].map((tab, idx) => (
              <TouchableOpacity key={tab} className={`px-4 py-2 rounded-[14px] ${idx === 0 ? 'bg-[#E6F7F7]' : 'bg-[#F2F4F7]'} mr-2`}>
                <Text className={`text-[14px] font-inter-medium ${idx === 0 ? 'text-[#008E96]' : 'text-[#6A7282]'}`}>{tab}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>

        <View className="p-4 gap-4">
          {/* Project Configurations */}
          <View>
            <Text className="text-[#101828] text-[18px] font-inter-medium mb-3">Project Configurations</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {configData.map((item, index) => (
                <ProjectConfigCard 
                  key={index}
                  title={item.title} 
                  areaRange={item.areaRange} 
                  priceRange={item.priceRange} 
                />
              ))}
            </ScrollView>
          </View>

          <ProjectSellerCard 
            sellerName="Passionate Developers" 
            postedBy="Passionate Developers Pvt Ltd" 
          />

          <View className="bg-white rounded-[16px] p-4 gap-2 shadow-sm">
            <Text className="text-[#101828] text-[18px] font-inter-medium">About Vamana Riseonic</Text>
            <Text className="text-[#000] text-[13px] leading-[27px] font-inter-regular">
              • Modern 3BHK apartment in a prime location with spacious, well-lit interiors and premium finishes{"\n"}
              • Equipped with essential amenities like 24/7 security, parking, and landscaped surroundings
            </Text>
          </View>

          <View className="bg-white rounded-[16px] p-4 gap-4 shadow-sm">
            <Text className="text-[#101828] text-[18px] font-inter-medium">Additional details</Text>
            <View className="flex-row">
              <View className="flex-1">
                <Text className="text-[#6A7282] text-[12px] font-inter-regular">Launched in</Text>
                <Text className="text-[#101828] text-[14px] font-inter-medium">Dec. 2025</Text>
              </View>
              <View className="flex-1 items-center">
                <View>
                  <Text className="text-[#6A7282] text-[12px] font-inter-regular">Project area</Text>
                  <Text className="text-[#101828] text-[14px] font-inter-medium">1.22 Acres</Text>
                </View>
              </View>
              <View className="flex-1 items-end">
                <View>
                  <Text className="text-[#6A7282] text-[12px] font-inter-regular text-right">Units</Text>
                  <Text className="text-[#101828] text-[14px] font-inter-medium text-right">500</Text>
                </View>
              </View>
            </View>
            <View className="bg-[#F9FAFB] p-3 rounded-[8px]">
              <Text className="text-black text-[14px] font-inter-regular">Rera Id PBRERA-SAS81-PRO799</Text>
            </View>
          </View>

          <InvestmentInsightsCard 
            appreciation="127.6%"
            appreciationYear="2021"
            currentValue="3.24 Cr"
            projectedValue="4.08 Cr"
            roi="26.0%"
            potentialGain="84.18 L"
          />

          <TouchableOpacity className="bg-[#008E96] rounded-[14px] h-[48px] items-center justify-center">
            <Text className="text-white font-inter-medium text-[16px]">Contact seller and invest now</Text>
          </TouchableOpacity>

          <ProjectBrochureCard />
          
          <ProjectMapCard />

          <ProjectContactFormCard 
            sellerName="Passionate Developers Pvt Ltd"
            sellerPhone="72180XXXXX"
          />

          <ProjectComparisonSection properties={comparisonData} />

          <ProjectFinancialServicesCard />

          <ProjectDisclaimerCard />
        </View>
      </ScrollView>
    </View>
  </SafeAreaView>
  );
};

export default ProjectDetails;