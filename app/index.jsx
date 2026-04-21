import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { PRIMARY_COLOR } from "./constants/index";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-3xl font-bold text-gray-900 mb-2">Real Estate App</Text>
      <Text className="text-gray-500 text-center mb-10">
        Find your dream home with ease.
      </Text>
      
      <TouchableOpacity 
        className="w-full p-4 rounded-xl items-center mb-4 shadow-md"
        style={{ backgroundColor: PRIMARY_COLOR }}
        onPress={() => router.push("/(auth)/Login")}
      >
        <Text className="text-white font-bold text-lg">Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="w-full p-4 rounded-xl items-center border border-gray-200"
        onPress={() => router.push("/(auth)/Register")}
      >
        <Text className="font-bold text-lg" style={{ color: PRIMARY_COLOR }}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}