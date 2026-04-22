import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TrendingProjectCard from "../../components/TrendingProjectCard";

const BuyScreen = () => {
  const router = useRouter();

  const popularLocalities = [
    { name: "Kharar", price: "₹6.2K/sq.ft." },
    { name: "Zirakpur", price: "₹7.5K/sq.ft." },
    { name: "Sector 125", price: "₹8.9K/sq.ft." },
    { name: "Derabassi", price: "₹5.4K/sq.ft." },
  ];

  const popularLandmarks = [
    { name: "City Heart", icon: "location-outline" },
    { name: "Maxim Merry School", icon: "location-outline" },
    { name: "Mohali Stadium", icon: "location-outline" },
    { name: "Phase 11 Market", icon: "location-outline" },
    { name: "ISB Campus", icon: "location-outline" },
  ];

  const trendingProjects = [
    {
      name: "Woodland Heights",
      location: "Sambalki, Mohali",
      price: "₹7.8K/sq.ft.",
      image: require("../../assets/images/house.jpg"),
    },
    {
      name: "Green Valley",
      location: "Sector 117, Mohali",
      price: "₹9.2K/sq.ft.",
      image: require("../../assets/images/house.jpg"),
    },
    {
      name: "Palm Residency",
      location: "Kharar Road",
      price: "₹6.5K/sq.ft.",
      image: require("../../assets/images/house.jpg"),
    },
    {
      name: "Sky Garden",
      location: "New Chandigarh",
      price: "₹11.3K/sq.ft.",
      image: require("../../assets/images/house.jpg"),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Container */}
      <View className="flex-row items-center px-4 py-4">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="w-10 h-10 items-center justify-center rounded-full"
        >
          <Ionicons name="arrow-back" size={20} color="#101828" />
        </TouchableOpacity>
        
        <View className="flex-1 ml-2">
          <Text className="text-[18px] font-inter-bold text-[#101828]">Buy</Text>
        </View>

        <TouchableOpacity className="flex-row items-center bg-white px-3 py-1.5 rounded-[10px] border border-gray-100">
          <Ionicons name="location" size={16} color="#008E96" />
          <Text className="mx-1.5 text-sm font-inter-medium text-[#4A5565]">Mohali</Text>
          <Ionicons name="chevron-down" size={14} color="#6A7282" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Search Bar Container */}
        <View className="px-4 mb-6 mt-2">
          <View className="flex-row items-center bg-white/40 border-2 border-[#008E96]/30 rounded-full px-4 h-11">
            <Ionicons name="search-outline" size={18} color="#6A7282" />
            <TextInput
              placeholder="Locality, Landmark, Project..."
              className="flex-1 ml-3 text-sm font-inter-regular text-[#101828]"
              placeholderTextColor="#6A7282"
            />
            <TouchableOpacity>
              <Ionicons name="mic-outline" size={18} color="#008E96" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Localities Section */}
        <View className="bg-[#EDFBFA] py-4 mb-6 rounded-[24px] mx-4">
          <View className="flex-row items-center mb-3 px-4">
            <MaterialCommunityIcons name="trending-up" size={16} color="#008E96" />
            <Text className="ml-2 text-base font-inter-medium text-[#101828]">
              Popular Localities
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
            {popularLocalities.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="bg-[#F7F9FA] border border-[#E4E7EC] shadow-sm rounded-2xl p-3 mr-3 w-[140px]"
              >
                <Text className="text-[#101828] font-inter-medium text-[15px] mb-1">
                  {item.name}
                </Text>
                <Text className="text-[#6A7282] text-[13px] font-inter-regular">
                  {item.price}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Landmarks Section */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="star-outline" size={16} color="#008E96" />
            <Text className="ml-2 text-base font-inter-medium text-[#101828]">
              Popular Landmarks
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {popularLandmarks.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center bg-white border border-[#E4E7EC] rounded-full px-4 py-2"
              >
                <Ionicons name="location-outline" size={14} color="#008E96" />
                <Text className="ml-2 text-[#4A5565] text-[13px] font-inter-medium">
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trending Projects Section */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center mb-3">
            <MaterialCommunityIcons name="office-building-outline" size={16} color="#008E96" />
            <Text className="ml-2 text-base font-inter-medium text-[#101828]">
              Trending Projects
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trendingProjects.map((item, index) => (
              <TrendingProjectCard
                key={index}
                name={item.name}
                location={item.location}
                price={item.price}
                image={item.image}
              />
            ))}
          </ScrollView>
        </View>

        {/* Explore Nearby Properties Button */}
        <TouchableOpacity className="mx-4 mb-10 bg-[#008E96]/10 border border-[#008E96]/20 rounded-2xl p-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="bg-[#F5F5F5] p-2 rounded-full mr-3">
              <Ionicons name="arrow-forward" size={16} color="#008E96" />
            </View>
            <Text className="text-[#101828] text-[15px] font-inter-medium">
              Explore nearby properties
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#008E96" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BuyScreen;
