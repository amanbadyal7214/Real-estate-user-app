import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { PRIMARY_COLOR } from "../constants/index";

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-10">
        <View className="items-center mb-12">
          <Text className="text-3xl font-bold text-gray-900 mt-10">
            Login to Your Account
          </Text>
          <Text className="text-gray-500 mt-2 text-center text-lg">
            Welcome back! Please enter your details.
          </Text>
        </View>

        {/* Form Fields */}
        <View className="space-y-6">
          <View className="flex-row items-center border border-gray-100 bg-gray-50 p-4 rounded-xl">
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Email address"
              keyboardType="email-address"
              className="flex-1 ml-3 text-gray-800"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="flex-row items-center border border-gray-100 bg-gray-50 p-4 rounded-xl mt-6">
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              className="flex-1 ml-3 text-gray-800"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity className="mt-4 self-end">
          <Text className="font-semibold" style={{ color: PRIMARY_COLOR }}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="mt-10 p-5 rounded-2xl items-center shadow-lg"
          style={{ backgroundColor: PRIMARY_COLOR }}
        >
          <Text className="text-white font-bold text-lg">Login</Text>
        </TouchableOpacity>

        {/* Social Login */}
        <View className="mt-12">
          <Text className="text-center text-gray-500 mb-8 font-medium">Or login with social</Text>
          <View className="flex-row justify-center space-x-6 gap-6">
            <TouchableOpacity className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm w-16 h-16 items-center justify-center">
              <AntDesign name="google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm w-16 h-16 items-center justify-center">
              <FontAwesome name="facebook" size={24} color="#4267B2" />
            </TouchableOpacity>
            <TouchableOpacity className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm w-16 h-16 items-center justify-center">
              <AntDesign name="apple1" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          className="mt-auto py-6"
          onPress={() => router.push("/(auth)/Register")}
        >
          <Text className="text-center text-gray-500">
            Don't have an account? <Text className="font-bold" style={{ color: PRIMARY_COLOR }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
