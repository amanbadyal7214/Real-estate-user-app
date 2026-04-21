import { Text, View, TouchableOpacity,SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { PRIMARY_COLOR } from "./constants/index";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 justify-center">
        <View className="items-center mb-16">
          <View 
            className="w-24 h-24 rounded-3xl items-center justify-center mb-8 shadow-2xl shadow-cyan-900/40"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            <Ionicons name="home" size={48} color="white" />
          </View>
          <Text className="text-4xl font-bold text-gray-900 tracking-tighter mb-2">
            RealEstate
          </Text>
          <Text className="text-gray-500 text-center text-lg px-8">
            The most premium way to find your perfect sanctuary.
          </Text>
        </View>
        
        <View className="space-y-4">
          <TouchableOpacity 
            className="w-full p-5 rounded-2xl items-center shadow-xl shadow-cyan-900/30"
            style={{ backgroundColor: PRIMARY_COLOR }}
            onPress={() => router.push("/(auth)/Login")}
          >
            <Text className="text-white font-bold text-lg">Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="w-full p-5 rounded-2xl items-center border border-gray-100 bg-gray-50 mt-4"
            onPress={() => router.push("/(auth)/Register")}
          >
            <Text className="font-bold text-lg" style={{ color: PRIMARY_COLOR }}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

