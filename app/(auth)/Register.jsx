import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { PRIMARY_COLOR } from "../constants/index";

const Register = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2 self-start">
          <Ionicons name="chevron-back" size={32} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-7">

        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-gray-900 mt-4">
            Create Your Account
          </Text>
          <Text className="text-gray-500 mt-1 text-center">
            Sign up as a <Text className="text-blue-600 font-bold">BUYER</Text> to access the platform.
          </Text>
        </View>

        {/* Role Selector - More Compact */}
        <TouchableOpacity 
          className="flex-row items-center justify-center p-3 rounded-xl mb-6 shadow-sm"
          style={{ backgroundColor: PRIMARY_COLOR }}
        >
          <Ionicons name="person-outline" size={18} color="white" />
          <Text className="text-white font-bold ml-2">Buyer</Text>
        </TouchableOpacity>

        {/* Form Fields - Tightened */}
        <View className="space-y-3">
          <View className="flex-row items-center border border-gray-100 bg-gray-50 p-3.5 rounded-xl">
            <Ionicons name="person-outline" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Your Full Name"
              className="flex-1 ml-3 text-gray-800"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="flex-row items-center border border-gray-100 bg-gray-50 p-3.5 rounded-xl mt-3">
            <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Email address"
              keyboardType="email-address"
              className="flex-1 ml-3 text-gray-800"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="flex-row items-center border border-gray-100 bg-gray-50 p-3.5 rounded-xl mt-3">
            <Ionicons name="phone-portrait-outline" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              className="flex-1 ml-3 text-gray-800"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="flex-row items-center border border-gray-100 bg-gray-50 p-3.5 rounded-xl mt-3">
            <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              className="flex-1 ml-3 text-gray-800"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center border border-gray-100 bg-gray-50 p-3.5 rounded-xl mt-3">
            <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              className="flex-1 ml-3 text-gray-800"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          className="mt-6 p-4 rounded-xl items-center shadow-md"
          style={{ backgroundColor: PRIMARY_COLOR }}
        >
          <Text className="text-white font-bold text-lg">Register and Create Account</Text>
        </TouchableOpacity>

        {/* Social Login - Optimized height */}
        <View className="mt-6">
          <Text className="text-center text-gray-500 mb-4 font-medium">Or sign up with social</Text>
          <View className="flex-row justify-center space-x-6 gap-6">
            <TouchableOpacity className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm w-14 h-14 items-center justify-center">
              <AntDesign name="google" size={22} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm w-14 h-14 items-center justify-center">
              <FontAwesome name="facebook" size={22} color="#4267B2" />
            </TouchableOpacity>
            <TouchableOpacity className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm w-14 h-14 items-center justify-center">
              <AntDesign name="apple1" size={22} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          className="mt-6 mb-4"
          onPress={() => router.push("/(auth)/Login")}
        >
          <Text className="text-center text-gray-500">
            Already have an account? <Text className="font-bold" style={{ color: PRIMARY_COLOR }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};


export default Register;
