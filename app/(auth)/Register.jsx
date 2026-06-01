import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useRegister } from "../../hooks/Register";
import { PRIMARY_COLOR } from "../constants/theme";

const Register = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { formData, updateFormData, loading, handleRegister } = useRegister();

  return (
    <SafeAreaView className="flex-1 pt-12 bg-white">

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-7">

        <View className=" mb-8">
          <Text className="text-[24px] font-inter-bold text-gray-900 mt-4">
            Create Your Account
          </Text>
          <Text className="text-gray-500 mt-3 font-inter-regular ">
            Sign up as a <Text className="text-blue font-inter-medium">BUYER</Text> to access the platform.
          </Text>
        </View>

        {/* Role Selector - More Compact */}
        <View 
          className="flex-row items-center justify-center p-4 rounded-2xl mb-6 shadow-sm"
          style={{ backgroundColor: PRIMARY_COLOR }}
        >
          <Ionicons name="person-outline" size={18} color="white" />
          <Text className="text-white font-inter-bold ml-2">Buyer</Text>
        </View>

        {/* Form Fields - Tightened */}
        <View className="space-y-3 mb-2">
          <View className="flex-row items-center border border-gray-100 bg-gray-50 p-3 rounded-2xl">
            <Ionicons name="person-outline" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Your Full Name"
              className="flex-1 ml-3 font-inter-regular text-gray-800"
              placeholderTextColor="#9CA3AF"
              value={formData.name}
              onChangeText={(value) => updateFormData("name", value)}
            />
          </View>

          <View className="flex-row items-center border border-gray-100 bg-gray-50 p-3 rounded-2xl mt-3">
            <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Email address"
              keyboardType="email-address"
              className="flex-1 ml-3 font-inter-regular text-gray-800"
              placeholderTextColor="#9CA3AF"
              value={formData.email}
              onChangeText={(value) => updateFormData("email", value)}
            />
          </View>

          <View className="flex-row items-center border border-gray-100 bg-gray-50 p-3 rounded-2xl mt-3">
            <Ionicons name="phone-portrait-outline" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              className="flex-1 ml-3 font-inter-regular text-gray-800"
              placeholderTextColor="#9CA3AF"
              value={formData.phone}
              onChangeText={(value) => updateFormData("phone", value)}
            />
          </View>

          <View className="flex-row items-center border border-gray-100 bg-gray-50 p-3 rounded-2xl mt-3">
            <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              className="flex-1 ml-3 font-inter-regular text-gray-800"
              placeholderTextColor="#9CA3AF"
              value={formData.password}
              onChangeText={(value) => updateFormData("password", value)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center border border-gray-100 bg-gray-50 p-3 rounded-2xl mt-3">
            <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              className="flex-1 ml-3 font-inter-regular text-gray-800"
              placeholderTextColor="#9CA3AF"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData("confirmPassword", value)}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            shadowColor: '#DFFFFD',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 1,
            shadowRadius: 15,
            elevation: 10,
          }}
        >
          <TouchableOpacity 
            className="p-4 mt-4 items-center"
            style={{ 
              borderRadius: 14,
              backgroundColor: '#008E96',
              shadowColor: '#9ADDD9',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 6,
              elevation: 4
            }}
            onPress={() => handleRegister({ onSuccess: () => router.replace("/(auth)/Login") })}
            disabled={loading}
          >
            <Text className="text-white font-inter-bold text-lg">
              {loading ? "Registering..." : "Register and Create Account"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Social Login - Optimized height */}
        <View className="mt-6">
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-[1px] bg-gray-200" />
            <Text className="mx-4 text-gray-500 font-inter-medium">Or sign up with social</Text>
            <View className="flex-1 h-[1px] bg-gray-200" />
          </View>
          
          <View className="flex-row justify-center">
            <TouchableOpacity 
              activeOpacity={0.7}
              className="flex-row items-center justify-center p-2 bg-white border border-gray-200 rounded-2xl shadow-sm w-full h-14"
            >
              <AntDesign name="google" size={24} color="#DB4437" />
              <Text className="text-gray-900 font-inter-bold text-[16px] ml-3">Continue with Google</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          className="mt-6 mb-4"
          onPress={() => router.push("/(auth)/Login")}
        >
          <Text className="text-center font-inter-regular text-gray-500">
            Already have an account? <Text className="font-inter-bold" style={{ color: PRIMARY_COLOR }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};


export default Register;
