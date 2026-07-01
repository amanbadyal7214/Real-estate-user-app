import { Ionicons } from "@expo/vector-icons";
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
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import DashboardSelectorModal from "../../components/DashboardSelectorModal";
import ForgotPasswordModal from "../../components/ForgotPasswordModal";
import Toast from "../../components/Toast";
import { performRoleBasedRedirect, useRegister } from "../../hooks/Register";
import { PRIMARY_COLOR } from "../constants/theme";

const Login = () => {
  const router = useRouter();
  const { redirectTo } = useLocalSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
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
    router.replace('/screens/Buy/Buy');
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
              source={require('../../assets/images/icon3.jpeg')}
              style={{ width: 240, height: 70 }}
              resizeMode="contain"
            />
            <Text className="text-2xl font-inter-bold text-[#101828] mt-4">
              Login to Your Account
            </Text>
            <Text className="text-[#6A7282] mt-1.5 text-center text-sm font-inter-regular">
              Welcome back! Please enter your details.
            </Text>
          </View>

          {/* Form Fields - Tightened */}
          <View>
            <View 
              className="flex-row items-center border border-[#E4E7EC] bg-[#F9FAFB]"
              style={{
                paddingVertical: hp('1.1%'),
                paddingHorizontal: wp('3.5%'),
                borderRadius: 12,
              }}
            >
              <Ionicons name="mail-outline" size={hp('2.2%')} color="#9CA3AF" />
              <TextInput
                placeholder="Email address"
                keyboardType="email-address"
                className="flex-1 ml-2.5 text-[#101828] font-inter-regular"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(value) => updateFormData("email", value)}
                style={{ fontSize: hp('1.7%'), padding: 0 }}
              />
            </View>

            <View 
              className="flex-row items-center border border-[#E4E7EC] bg-[#F9FAFB]"
              style={{
                paddingVertical: hp('1.1%'),
                paddingHorizontal: wp('3.5%'),
                borderRadius: 12,
                marginTop: hp('1.1%'),
              }}
            >
              <Ionicons name="lock-closed-outline" size={hp('2.2%')} color="#9CA3AF" />
              <TextInput
                placeholder="Password"
                secureTextEntry={!showPassword}
                className="flex-1 ml-2.5 text-[#101828] font-inter-regular"
                placeholderTextColor="#9CA3AF"
                value={formData.password}
                onChangeText={(value) => updateFormData("password", value)}
                style={{ fontSize: hp('1.7%'), padding: 0 }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-1">
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={hp('2.2%')} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity className="mt-3 self-end" onPress={() => setForgotPasswordVisible(true)}>
            <Text className="font-inter-medium text-sm" style={{ color: PRIMARY_COLOR }}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-8 p-4 rounded-xl items-center shadow-sm"
            style={{ backgroundColor: PRIMARY_COLOR }}
            onPress={() => handleLogin({ onSuccess: handleLoginSuccess })}
            disabled={loading}
          >
            <Text className="text-white font-inter-semibold text-base">
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* Social Login removed */}
        </View>

        <TouchableOpacity
          className="mt-auto py-6"
          onPress={() => router.push("/(auth)/Register")}
        >
          <Text className="text-center text-[#6A7282] text-sm font-inter-regular">
            Don&apos;t have an account? <Text className="font-inter-semibold" style={{ color: PRIMARY_COLOR }}>Sign up</Text>
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
      <ForgotPasswordModal
        visible={forgotPasswordVisible}
        onClose={() => setForgotPasswordVisible(false)}
        setToast={setToast}
        onLoginSuccess={handleLoginSuccess}
      />
    </SafeAreaView>
  );
};

export default Login;
