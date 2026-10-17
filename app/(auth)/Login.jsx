import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
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

  // Google phone-OTP modal state
  const [googleOtpModalVisible, setGoogleOtpModalVisible] = useState(false);
  const [googleOtp, setGoogleOtp] = useState(["", "", "", "", "", ""]);
  const googleOtpInputs = useRef([]);

  const {
    formData,
    updateFormData,
    loading,
    handleLogin,
    roleSelector,
    setRoleSelector,
    toast,
    setToast,
    // Google auth
    handleGoogleSignIn,
    sendGooglePhoneOtp,
    completeGoogleSignup,
    cancelGoogleSignup,
    googleSignupState,
    googlePhoneOtpSent,
  } = useRegister();

  // When googleSignupState is set, show the phone OTP modal
  useEffect(() => {
    if (googleSignupState) {
      setGoogleOtpModalVisible(true);
    }
  }, [googleSignupState]);

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
      target = undefined;
    }
    performRoleBasedRedirect(role, target, setRoleSelector);
  };

  const handleSafeBack = () => {
    router.replace("/screens/Buy/Buy");
  };

  // ─── Google OTP modal helpers ───────────────────────────────────────────────
  const handleGoogleOtpChange = (value, index) => {
    const next = [...googleOtp];
    next[index] = value;
    setGoogleOtp(next);
    if (value && index < 5) {
      googleOtpInputs.current[index + 1]?.focus();
    }
  };

  const handleGoogleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !googleOtp[index] && index > 0) {
      googleOtpInputs.current[index - 1]?.focus();
    }
  };

  const handleGoogleOtpSend = async () => {
    await sendGooglePhoneOtp();
  };

  const handleGoogleOtpVerify = async () => {
    const enteredOtp = googleOtp.join("");
    const success = await completeGoogleSignup({
      enteredOtp,
      onSuccess: handleLoginSuccess,
    });
    if (success) {
      setGoogleOtpModalVisible(false);
      setGoogleOtp(["", "", "", "", "", ""]);
    }
  };

  const handleGoogleOtpModalClose = () => {
    setGoogleOtpModalVisible(false);
    setGoogleOtp(["", "", "", "", "", ""]);
    cancelGoogleSignup();
  };

  const handleGoogleSignInPress = () => {
    handleGoogleSignIn({ onSuccess: handleLoginSuccess, defaultRole: "buyer" });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="px-4 pt-2">
        <TouchableOpacity onPress={handleSafeBack} className="p-2 self-start">
          <Ionicons name="chevron-back" size={32} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-4">
        <View className="flex-1 justify-center">
          <View className="items-center mb-8">
            <Image
              source={require("../../assets/images/icon3.png")}
              style={{ width: 240, height: 70 }}
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-[#101828] mt-4">
              Login to Your Account
            </Text>
            <Text className="text-[#6A7282] mt-1.5 text-center text-sm font-normal">
              Welcome back! Please enter your details.
            </Text>
          </View>

          {/* Form Fields */}
          <View>
            <View
              className="flex-row items-center border border-[#E4E7EC] bg-[#F9FAFB]"
              style={{
                paddingVertical: hp("1.1%"),
                paddingHorizontal: wp("3.5%"),
                borderRadius: 12,
              }}
            >
              <Ionicons name="mail-outline" size={hp("2.2%")} color="#9CA3AF" />
              <TextInput
                placeholder="Phone Number"
                keyboardType="email-address"
                className="flex-1 ml-2.5 text-[#101828] font-normal"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(value) => updateFormData("email", value)}
                style={{ fontSize: hp("1.7%"), padding: 0 }}
              />
            </View>

            <View
              className="flex-row items-center border border-[#E4E7EC] bg-[#F9FAFB]"
              style={{
                paddingVertical: hp("1.1%"),
                paddingHorizontal: wp("3.5%"),
                borderRadius: 12,
                marginTop: hp("1.1%"),
              }}
            >
              <Ionicons name="lock-closed-outline" size={hp("2.2%")} color="#9CA3AF" />
              <TextInput
                placeholder="Password"
                secureTextEntry={!showPassword}
                className="flex-1 ml-2.5 text-[#101828] font-normal"
                placeholderTextColor="#9CA3AF"
                value={formData.password}
                onChangeText={(value) => updateFormData("password", value)}
                style={{ fontSize: hp("1.7%"), padding: 0 }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-1">
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={hp("2.2%")}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity className="mt-3 self-end" onPress={() => setForgotPasswordVisible(true)}>
            <Text className="font-medium text-sm" style={{ color: PRIMARY_COLOR }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-8 p-4 rounded-xl items-center shadow-sm"
            style={{ backgroundColor: PRIMARY_COLOR }}
            onPress={() => handleLogin({ onSuccess: handleLoginSuccess })}
            disabled={loading}
          >
            <Text className="text-white font-semibold text-base">
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-5">
            <View className="flex-1 h-px bg-[#E4E7EC]" />
            <Text className="mx-3 text-[#9CA3AF] text-sm font-normal">or continue with</Text>
            <View className="flex-1 h-px bg-[#E4E7EC]" />
          </View>

          {/* Google Sign-In Button */}
          <TouchableOpacity
            onPress={handleGoogleSignInPress}
            disabled={loading}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1.5,
              borderColor: "#E4E7EC",
              borderRadius: 12,
              paddingVertical: hp("1.4%"),
              backgroundColor: "#FFFFFF",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {/* Google G SVG inline */}
            <View style={{ width: 20, height: 20, marginRight: 10 }}>
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png",
                }}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            </View>
            <Text style={{ fontSize: hp("1.8%"), fontWeight: "600", color: "#101828" }}>
              {loading ? "Please wait..." : "Sign in with Google"}
            </Text>
          </TouchableOpacity>
           <TouchableOpacity
          className="mt-2 py-6"
          onPress={() => router.push("/(auth)/Register")}
        >
          <Text className="text-center text-[#6A7282] text-sm font-normal">
            Don&apos;t have an account?{" "}
            <Text className="font-semibold" style={{ color: PRIMARY_COLOR }}>
              Sign up
            </Text>
          </Text>
        </TouchableOpacity>
        </View>

       
      </ScrollView>

      <DashboardSelectorModal
        visible={roleSelector.visible}
        roles={roleSelector.roles}
        onSelect={(target) => {
          setRoleSelector((prev) => ({ ...prev, visible: false }));
          router.replace(target);
        }}
        onClose={() => setRoleSelector((prev) => ({ ...prev, visible: false }))}
      />
      <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />
      <ForgotPasswordModal
        visible={forgotPasswordVisible}
        onClose={() => setForgotPasswordVisible(false)}
        setToast={setToast}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* ─── Google New-User Phone Verification Modal ─────────────────────────── */}
      <Modal
        visible={googleOtpModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleGoogleOtpModalClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
            {/* Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#101828" }}>
                {googlePhoneOtpSent ? "Verify Your Phone" : "Complete Sign-Up"}
              </Text>
              <TouchableOpacity onPress={handleGoogleOtpModalClose}>
                <Ionicons name="close" size={24} color="#6A7282" />
              </TouchableOpacity>
            </View>

            {/* Google user info banner */}
            {googleSignupState?.googleUser?.name ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F0FDF9",
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 16,
                }}
              >
                <Ionicons name="person-circle-outline" size={28} color={PRIMARY_COLOR} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={{ fontWeight: "600", color: "#101828", fontSize: 13 }}>
                    {googleSignupState.googleUser.name}
                  </Text>
                  <Text style={{ color: "#6A7282", fontSize: 12 }}>
                    {googleSignupState.googleUser.email}
                  </Text>
                </View>
              </View>
            ) : null}

            {!googlePhoneOtpSent ? (
              <>
                <Text style={{ color: "#6A7282", marginBottom: 16, fontSize: 14 }}>
                  A verified phone number is required to create your account. Enter your 10-digit number below.
                </Text>
                {/* Phone input */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#E4E7EC",
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: hp("1.2%"),
                    backgroundColor: "#F9FAFB",
                    marginBottom: 20,
                  }}
                >
                  <Ionicons name="phone-portrait-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    placeholder="10-digit phone number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    placeholderTextColor="#9CA3AF"
                    value={formData.phone}
                    onChangeText={(v) => updateFormData("phone", v)}
                    style={{ flex: 1, marginLeft: 10, fontSize: 15, color: "#101828", padding: 0 }}
                  />
                </View>
                <TouchableOpacity
                  onPress={handleGoogleOtpSend}
                  disabled={loading || formData.phone.length !== 10}
                  style={{
                    backgroundColor: formData.phone.length === 10 && !loading ? PRIMARY_COLOR : "#E5E7EB",
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: formData.phone.length === 10 && !loading ? "#fff" : "#9CA3AF",
                      fontWeight: "700",
                      fontSize: 16,
                    }}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={{ color: "#6A7282", marginBottom: 20, fontSize: 14 }}>
                  Enter the 6-digit code sent to +91 {formData.phone}
                </Text>
                {/* OTP inputs */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 24, paddingHorizontal: 4 }}>
                  {googleOtp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (googleOtpInputs.current[index] = ref)}
                      style={{
                        width: 44,
                        height: 52,
                        borderWidth: 1.5,
                        borderColor: digit ? PRIMARY_COLOR : "#E4E7EC",
                        borderRadius: 12,
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#101828",
                        backgroundColor: "#F9FAFB",
                      }}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={digit}
                      onChangeText={(value) => handleGoogleOtpChange(value, index)}
                      onKeyPress={(e) => handleGoogleOtpKeyPress(e, index)}
                    />
                  ))}
                </View>
                <TouchableOpacity
                  onPress={handleGoogleOtpVerify}
                  disabled={loading || googleOtp.join("").length !== 6}
                  style={{
                    backgroundColor: googleOtp.join("").length === 6 && !loading ? PRIMARY_COLOR : "#E5E7EB",
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      color: googleOtp.join("").length === 6 && !loading ? "#fff" : "#9CA3AF",
                      fontWeight: "700",
                      fontSize: 16,
                    }}
                  >
                    {loading ? "Verifying..." : "Verify & Create Account"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleGoogleOtpSend} style={{ alignItems: "center" }}>
                  <Text style={{ color: PRIMARY_COLOR, fontWeight: "500", fontSize: 14 }}>Resend Code</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default Login;
