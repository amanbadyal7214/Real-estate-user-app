import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardSelectorModal from "../../components/DashboardSelectorModal";
import Toast from "../../components/Toast";
import { performRoleBasedRedirect, useRegister } from "../../hooks/Register";
import { PRIMARY_COLOR } from "../constants/theme";

const Login = () => {
  const router = useRouter();
  const { redirectTo } = useLocalSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const { formData, updateFormData, loading, handleLogin, roleSelector, setRoleSelector, toast, setToast } = useRegister();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await SecureStore.getItemAsync("token");
    const role = await SecureStore.getItemAsync("userRole");
    if (token) {
      let target = resolveRedirectTarget();
      if (target === "/screens/PostProperty/PropertyDetails") {
        target = undefined;
      }
      setTimeout(() => {
        performRoleBasedRedirect(role, target, setRoleSelector);
      }, 100);
    }
  };

  const resolveRedirectTarget = () => {
    if (!redirectTo || typeof redirectTo !== "string") {
      return "/screens/PostProperty/PropertyDetails";
    }

    try {
      return JSON.parse(decodeURIComponent(redirectTo));
    } catch (error) {
      console.warn("Unable to parse login redirect target", error?.message);
      return "/screens/PostProperty/PropertyDetails";
    }
  };

  const handleLoginSuccess = (data) => {
    const role = data?.role;
    let target = resolveRedirectTarget();
    if (target === "/screens/PostProperty/PropertyDetails") {
      target = undefined; // Let role check determine fallback (Buyer Buy dashboard vs Owner dashboard)
    }
    performRoleBasedRedirect(role, target, setRoleSelector);
  };

  const handleSafeBack = () => {
    try {
      router.back();
    } catch {
      router.replace("/(auth)/onboard");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-2">
        <TouchableOpacity onPress={handleSafeBack} className="p-2 self-start">
          <Ionicons name="chevron-back" size={32} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-4">
        <View className="flex-1 justify-center">
          <View className="items-center mb-8">
            <Image
              source={require('../../assets/images/realeasteapphorizontal1.png')}
              style={{ width: 240, height: 70 }}
              resizeMode="contain"
            />
            <Text className="text-3xl font-inter-bold text-gray-900 mt-4">
              Login to Your Account
            </Text>
            <Text className="text-gray-500 mt-1 text-center text-lg">
              Welcome back! Please enter your details.
            </Text>
          </View>

          {/* Form Fields - Tightened */}
          <View className="space-y-4">
            <View className="flex-row items-center border border-gray-100 bg-gray-50 p-4 rounded-xl">
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Email address"
                keyboardType="email-address"
                className="flex-1 ml-3 text-gray-800"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(value) => updateFormData("email", value)}
              />
            </View>

            <View className="flex-row items-center border border-gray-100 bg-gray-50 p-4 rounded-xl mt-4">
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Password"
                secureTextEntry={!showPassword}
                className="flex-1 ml-3 text-gray-800"
                placeholderTextColor="#9CA3AF"
                value={formData.password}
                onChangeText={(value) => updateFormData("password", value)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity className="mt-4 self-end">
            <Text className="font-inter-medium" style={{ color: PRIMARY_COLOR }}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-8 p-5 rounded-2xl items-center shadow-lg"
            style={{ backgroundColor: PRIMARY_COLOR }}
            onPress={() => handleLogin({ onSuccess: handleLoginSuccess })}
            disabled={loading}
          >
            <Text className="text-white font-inter-bold text-lg">
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* Social Login */}
          <View className="mt-12">
            <View className="flex-row items-center mb-8">
              <View className="flex-1 h-[1px] bg-gray-200" />
              <Text className="mx-4 text-gray-500 font-inter-medium">Or login with social</Text>
              <View className="flex-1 h-[1px] bg-gray-200" />
            </View>

            <View className="flex-row justify-center">
              <TouchableOpacity
                activeOpacity={0.7}
                className="flex-row items-center justify-center p-2 bg-white border border-gray-200 rounded-2xl shadow-sm w-full h-16"
              >
                <AntDesign name="google" size={24} color="#DB4437" />
                <Text className="text-gray-900 font-inter-bold text-[16px] ml-3">Continue with Google</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="mt-auto py-6"
          onPress={() => router.push("/(auth)/Register")}
        >
          <Text className="text-center text-gray-500">
            Don&apos;t have an account? <Text className="font-inter-bold" style={{ color: PRIMARY_COLOR }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <DashboardSelectorModal
        visible={roleSelector.visible}
        roles={roleSelector.roles}
        onSelect={(target) => {
          setRoleSelector(prev => ({ ...prev, visible: false }));
          router.replace(target);
        }}
        onClose={() => setRoleSelector(prev => ({ ...prev, visible: false }))}
      />
      <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />
    </SafeAreaView>
  );
};

export default Login;
