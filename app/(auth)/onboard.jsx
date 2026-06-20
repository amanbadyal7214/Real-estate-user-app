import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import {
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get('window');

const OnboardSelection = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 justify-between py-10">
        
        {/* Top Content: Logo & Illustration */}
        <View className="items-center  flex-1 justify-center">
          <Image 
            source={require('../../assets/images/icon3.jpeg')}
            style={{ width: width * 0.7, height: 200 }}
            resizeMode="contain"
          />
          
          <Text className="text-[18px] text-[#4A5565] text-center mt-20 font-inter-regular px-4">
            Find your perfect home with ease
          </Text>

          {/* Category Chips */}
          <View className="flex-row flex-wrap justify-center gap-3 mt-8">
            <View className="bg-[#EFF6FF] px-4 py-2 rounded-full flex-row items-center border border-[#DBEAFE]">
              <Text className="text-[#426FF5] font-inter-medium text-sm">🏠 PG Rooms</Text>
            </View>
            <View className="bg-[#FAF5FF] px-4 py-2 rounded-full flex-row items-center border border-[#F3E8FF]">
              <Text className="text-[#9810FA] font-inter-medium text-sm">🏢 Flats</Text>
            </View>
            <View className="bg-[#FDF2F8] px-4 py-2 rounded-full flex-row items-center border border-[#FCE7F3]">
              <Text className="text-[#E60076] font-inter-medium text-sm">🏡 Rentals</Text>
            </View>
          </View>
        </View>

        {/* Bottom content: Buttons & Terms */}
        <View className="mb-6">
          <TouchableOpacity 
            className="w-full h-14 bg-primary rounded-2xl flex-row justify-center items-center shadow-lg shadow-primary/30 mb-4"
            activeOpacity={0.8}
            onPress={() => router.push('/(auth)/Register')}
          >
            <Text className="text-white text-lg font-inter-bold mr-2 ml-4">Create Your Account</Text>
            <ChevronRight color="white" size={20} strokeWidth={3} />
          </TouchableOpacity>

          <TouchableOpacity 
            className="w-full h-14 bg-white border-2 border-primary rounded-2xl justify-center items-center mb-10"
            activeOpacity={0.7}
            onPress={() => router.push('/(auth)/Login')}
          >
            <Text className="text-primary text-lg font-inter-bold">Login</Text>
          </TouchableOpacity>

          {/* Terms and Privacy */}
          <View className="items-center">
            <Text className="text-[12px] text-[#6A7282] font-inter-regular text-center leading-5 px-10">
              By continuing, you agree to our{" "}
              <Text className="text-primary  underline font-inter-bold">Terms of Service</Text>
              {" "}and{" "}
              <Text className="text-primary underline font-inter-bold">Privacy Policy</Text>
            </Text>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default OnboardSelection;
