import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import PasswordValidator, { validatePasswordRules } from "../../components/PasswordValidator";
import Toast from "../../components/Toast";
import { performRoleBasedRedirect, useRegister } from "../../hooks/Register";
import { PRIMARY_COLOR } from "../constants/theme";

const Register = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  // Google phone-OTP modal state
  const [googleOtpModalVisible, setGoogleOtpModalVisible] = useState(false);
  const [googleOtp, setGoogleOtp] = useState(["", "", "", "", "", ""]);
  const [googleSelectedRole, setGoogleSelectedRole] = useState("buyer");
  const googleOtpInputs = useRef([]);

  // Supported signup roles (admin excluded)
  const SIGNUP_ROLES = [
    { key: "buyer",   label: "Buyer" },
    { key: "owner",   label: "Owner" },
    { key: "builder", label: "Builder" },
    { key: "broker",  label: "Broker" },
    { key: "realtor", label: "Realtor" },
  ];

  const {
    step,
    setStep,
    formData,
    updateFormData,
    loading,
    setEnteredMockOtp,
    setEmailOtp,
    handlePhoneValidation,
    verifyMockOtp,
    handleRegister,
    handleVerifyEmailOtp,
    roleSelector,
    setRoleSelector,
    existingUserDetails,
    isPhoneVerified,
    resetForm,
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

  useEffect(() => {
    checkToken();
    updateFormData("role", "buyer");
  }, []);

  // When the hook sets googleSignupState (new Google user), open the modal
  useEffect(() => {
    if (googleSignupState) {
      setGoogleSelectedRole(googleSignupState.role || "buyer");
      setGoogleOtpModalVisible(true);
    }
  }, [googleSignupState]);

  const checkToken = async () => {
    const token = await SecureStore.getItemAsync("token");
    const role = await SecureStore.getItemAsync("userRole");
    if (token) {
      setTimeout(() => {
        performRoleBasedRedirect(role, "/screens/Buy/Buy", setRoleSelector);
      }, 100);
    }
  };

  const isRoleActive = (roleName) => {
    return formData.role === roleName ||
      (Array.isArray(formData.role) && formData.role.includes(roleName)) ||
      (typeof formData.role === 'string' && formData.role.includes(roleName));
  };

  // OTP State
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputs = useRef([]);

  const isExistingUserFormValid =
    isPhoneVerified &&
    formData.phone.length === 10 &&
    formData.role &&
    formData.name.trim().length > 0 &&
    formData.email.includes('@') &&
    formData.password.length >= 6 &&
    (formData.role !== 'builder' || (formData.companyName?.trim() && formData.businessSince?.trim()));

  const isFormValid = isLogin
    ? isExistingUserFormValid
    : (formData.phone.length === 10 &&
      formData.name.trim().length > 0 &&
      formData.email.includes('@') &&
      validatePasswordRules(formData.password).isValid &&
      formData.password === formData.confirmPassword);

  const handleNext = async () => {
    if (isFormValid) {
      setOtp(['', '', '', '', '', '']);
      setShowOTPModal(true);
      setTimeout(() => {
        handlePhoneValidation();
      }, 500);
    }
  };

  const handleVerifyPhonePress = () => {
    setOtp(['', '', '', '', '', '']);
    setShowOTPModal(true);
    setTimeout(() => {
      handlePhoneValidation();
    }, 500);
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }

    // Update hook state based on current step
    const fullOtp = newOtp.join('');
    console.log("OTP Change:", { step, fullOtp });
    if (step === 1) {
      setEnteredMockOtp(fullOtp);
    } else if (step === 2 || step === 3) {
      setEmailOtp(fullOtp);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const verifyOTP = async () => {
    const otpValue = otp.join('');
    console.log("verifyOTP Clicked:", { step, otpValueLength: otpValue.length });
    if (otpValue.length === 6) {
      if (step === 1) {
        console.log("Calling verifyMockOtp with isExisting:", isLogin);
        const success = await verifyMockOtp({ isExisting: isLogin });
        if (success && isLogin) {
          setShowOTPModal(false);
        }
      } else if (step === 2 || step === 3) {
        console.log("Calling handleVerifyEmailOtp");
        const success = await handleVerifyEmailOtp({ defaultTarget: "/screens/Buy/Buy" });
        if (success) {
          setShowOTPModal(false);
        }
      }
    } else {
      console.log("OTP length is not 6");
    }
  };

  // Effect to handle automatic transitions after successful actions
  useEffect(() => {
    const registerAndNext = async () => {
      if (step === 2 && showOTPModal && !loading) {
        // Mock OTP verified, now register
        await handleRegister();
      }
    };
    registerAndNext();
  }, [step, showOTPModal]);

  // Effect to open modal when transitioning to step 3 (Email Verification)
  useEffect(() => {
    if (step === 3) {
      setShowOTPModal(true);
    }
  }, [step]);

  // Effect to clear OTP when moving to email verification or step 2
  useEffect(() => {
    if (step === 2 || step === 3) {
      setOtp(['', '', '', '', '', '']);
    }
  }, [step]);

  const handleCloseModal = () => {
    setShowOTPModal(false);
    setStep(1);
  };

  const handleSafeBack = () => {
    router.replace("/screens/Buy/Buy");
  };

  // ─── Google OTP modal helpers ─────────────────────────────────────────────
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
      onSuccess: (data) => {
        performRoleBasedRedirect(data.role, "/screens/Buy/Buy", setRoleSelector);
      },
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

  const handleGoogleRoleSelect = (roleKey) => {
    setGoogleSelectedRole(roleKey);
    // Sync to hook's googleSignupState via formData role (completeGoogleSignup reads googleSignupState.role)
    updateFormData("role", roleKey);
    if (googleSignupState) {
      googleSignupState.role = roleKey; // mutate in-place so completeGoogleSignup picks it up
    }
  };

  const handleGoogleSignUpPress = () => {
    handleGoogleSignIn({ defaultRole: "buyer" });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="flex-row items-center justify-between px-4 py-2">
        <TouchableOpacity onPress={handleSafeBack} className="p-2">
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center justify-center">
          <Image
            source={require('../../assets/images/logo.png')}
            style={{ width: 140, height: 40 }}
            resizeMode="contain"
          />
        </View>
        <View className="w-10" />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 pb-16">

        <View className="mb-8">
          <Text className="text-[24px] font-bold text-gray-900">
            Create Your Account
          </Text>
          <Text className="text-gray-500 mt-3 font-normal">
            Sign up to access the platform.
          </Text>
        </View>

        {/* User Type display */}
        <View className="mb-6">
          <Text className="text-gray-500 text-sm mb-3 font-medium">
            User Type
          </Text>
          <View className="flex-row gap-2">
            <View
              className="flex-1 py-3 rounded-2xl border items-center shadow-sm bg-[#E6F7F6] border-[#008E96]"
            >
              <Text
                className="text-sm font-bold text-[#008E96]"
              >
                Buyer
              </Text>
            </View>
          </View>
        </View>

        {/* Form Fields - Tightened */}
        <View className="mb-2">
          {/* Phone Number Input */}
          {(!isLogin || !isPhoneVerified) ? (
            <View 
              className="flex-row items-center border border-gray-100 bg-gray-50"
              style={{
                paddingVertical: hp('1.1%'),
                paddingHorizontal: wp('3.5%'),
                borderRadius: 12,
              }}
            >
              <Ionicons name="phone-portrait-outline" size={hp('2.2%')} color="#9CA3AF" />
              <TextInput
                placeholder="Phone Number"
                keyboardType="phone-pad"
                className="flex-1 ml-3 font-normal text-gray-800"
                placeholderTextColor="#9CA3AF"
                value={formData.phone}
                onChangeText={(value) => updateFormData("phone", value)}
                maxLength={10}
                style={{ fontSize: hp('1.7%'), padding: 0 }}
              />
            </View>
          ) : (
            <View 
              className="flex-row items-center border border-gray-100 bg-gray-50 opacity-60"
              style={{
                paddingVertical: hp('1.1%'),
                paddingHorizontal: wp('3.5%'),
                borderRadius: 12,
              }}
            >
              <Ionicons name="phone-portrait-outline" size={hp('2.2%')} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 font-normal text-gray-800"
                value={formData.phone}
                editable={false}
                style={{ fontSize: hp('1.7%'), padding: 0 }}
              />
              <Ionicons name="checkmark-circle" size={hp('2.4%')} color="green" />
            </View>
          )}

          {/* Name Field */}
          {(!isLogin || isPhoneVerified) && (
            <View 
              className="flex-row items-center border border-gray-100 bg-gray-50"
              style={{
                paddingVertical: hp('1.1%'),
                paddingHorizontal: wp('3.5%'),
                borderRadius: 12,
                marginTop: hp('1.1%'),
              }}
            >
              <Ionicons name="person-outline" size={hp('2.2%')} color="#9CA3AF" />
              <TextInput
                placeholder="Your Full Name"
                className="flex-1 ml-3 font-normal text-gray-800"
                placeholderTextColor="#9CA3AF"
                value={formData.name}
                onChangeText={(value) => updateFormData("name", value)}
                style={{ fontSize: hp('1.7%'), padding: 0 }}
              />
            </View>
          )}

          {/* Email Field */}
          {(!isLogin || isPhoneVerified) && (
            <View 
              className="flex-row items-center border border-gray-100 bg-gray-50"
              style={{
                paddingVertical: hp('1.1%'),
                paddingHorizontal: wp('3.5%'),
                borderRadius: 12,
                marginTop: hp('1.1%'),
              }}
            >
              <Ionicons name="mail-outline" size={hp('2.2%')} color="#9CA3AF" />
              <TextInput
                placeholder="Email address"
                keyboardType="email-address"
                className="flex-1 ml-3 font-normal text-gray-800"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(value) => updateFormData("email", value)}
                autoCapitalize="none"
                style={{ fontSize: hp('1.7%'), padding: 0 }}
              />
            </View>
          )}

          {/* Password Field */}
          {(!isLogin || isPhoneVerified) && (
            <View style={{ marginTop: hp('1.1%') }}>
              <View 
                className="flex-row items-center border border-gray-100 bg-gray-50"
                style={{
                  paddingVertical: hp('1.1%'),
                  paddingHorizontal: wp('3.5%'),
                  borderRadius: 12,
                }}
              >
                <Ionicons name="lock-closed-outline" size={hp('2.2%')} color="#9CA3AF" />
                <TextInput
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  className="flex-1 ml-3 font-normal text-gray-800"
                  placeholderTextColor="#9CA3AF"
                  value={formData.password}
                  onChangeText={(value) => updateFormData("password", value)}
                  style={{ fontSize: hp('1.7%'), padding: 0 }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={hp('2.2%')} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              {isLogin && (
                <Text className="text-xs text-gray-500 mt-1 ml-1" style={{ fontWeight: '400', fontSize: hp('1.4%') }}>
                  Fill your login password to get a new role
                </Text>
              )}
              {!isLogin && (
                <PasswordValidator password={formData.password} />
              )}
            </View>
          )}

          {/* Confirm Password Field (Only for New User) */}
          {!isLogin && (
            <View 
              className="flex-row items-center border border-gray-100 bg-gray-50"
              style={{
                paddingVertical: hp('1.1%'),
                paddingHorizontal: wp('3.5%'),
                borderRadius: 12,
                marginTop: hp('1.1%'),
              }}
            >
              <Ionicons name="lock-closed-outline" size={hp('2.2%')} color="#9CA3AF" />
              <TextInput
                placeholder="Confirm Password"
                secureTextEntry={!showConfirmPassword}
                className="flex-1 ml-3 font-normal text-gray-800"
                placeholderTextColor="#9CA3AF"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData("confirmPassword", value)}
                style={{ fontSize: hp('1.7%'), padding: 0 }}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={hp('2.2%')} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          )}

          {/* Search City Field */}
          {(!isLogin || isPhoneVerified) && (
            <View 
              className="flex-row items-center border border-gray-100 bg-gray-50"
              style={{
                paddingVertical: hp('1.1%'),
                paddingHorizontal: wp('3.5%'),
                borderRadius: 12,
                marginTop: hp('1.1%'),
              }}
            >
              <Ionicons name="location-outline" size={hp('2.2%')} color="#9CA3AF" />
              <TextInput
                placeholder="Search City"
                className="flex-1 ml-3 font-normal text-gray-800"
                placeholderTextColor="#9CA3AF"
                value={formData.city || ''}
                onChangeText={(value) => updateFormData("city", value)}
                style={{ fontSize: hp('1.7%'), padding: 0 }}
              />
            </View>
          )}

          {/* Builder specific fields */}
          {(!isLogin || isPhoneVerified) && formData.role === 'builder' && (
            <>
              <View 
                className="flex-row items-center border border-gray-100 bg-gray-50"
                style={{
                  paddingVertical: hp('1.1%'),
                  paddingHorizontal: wp('3.5%'),
                  borderRadius: 12,
                  marginTop: hp('1.1%'),
                }}
              >
                <Ionicons name="business-outline" size={hp('2.2%')} color="#9CA3AF" />
                <TextInput
                  placeholder="Company Name"
                  className="flex-1 ml-3 font-normal text-gray-800"
                  placeholderTextColor="#9CA3AF"
                  value={formData.companyName || ''}
                  onChangeText={(value) => updateFormData("companyName", value)}
                  style={{ fontSize: hp('1.7%'), padding: 0 }}
                />
              </View>

              <View 
                className="flex-row items-center border border-gray-100 bg-gray-50"
                style={{
                  paddingVertical: hp('1.1%'),
                  paddingHorizontal: wp('3.5%'),
                  borderRadius: 12,
                  marginTop: hp('1.1%'),
                }}
              >
                <Ionicons name="calendar-outline" size={hp('2.2%')} color="#9CA3AF" />
                <TextInput
                  placeholder="Business Since (Year)"
                  keyboardType="number-pad"
                  maxLength={4}
                  className="flex-1 ml-3 font-normal text-gray-800"
                  placeholderTextColor="#9CA3AF"
                  value={formData.businessSince || ''}
                  onChangeText={(value) => updateFormData("businessSince", value)}
                  style={{ fontSize: hp('1.7%'), padding: 0 }}
                />
              </View>
            </>
          )}
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
              backgroundColor: (
                isLogin
                  ? (isPhoneVerified ? isExistingUserFormValid : formData.phone.length === 10)
                  : isFormValid
              ) && !loading ? '#008E96' : '#E5E7EB',
              shadowColor: '#9ADDD9',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 6,
              elevation: 4
            }}
            onPress={() => {
              if (isLogin) {
                if (isPhoneVerified) {
                  handleRegister();
                } else {
                  handleVerifyPhonePress();
                }
              } else {
                handleNext();
              }
            }}
            disabled={loading || !(
              isLogin
                ? (isPhoneVerified ? isExistingUserFormValid : formData.phone.length === 10)
                : isFormValid
            )}
          >
            <Text className={`${(
              isLogin
                ? (isPhoneVerified ? isExistingUserFormValid : formData.phone.length === 10)
                : isFormValid
            ) && !loading ? 'text-white' : 'text-[#99A1AF]'} font-bold text-lg`}>
              {loading
                ? "Processing..."
                : (isLogin
                  ? (isPhoneVerified ? "Get New Role & Login" : "Verify Phone")
                  : "Register and Create Account"
                )
              }
            </Text>
          </TouchableOpacity>
        </View>


        {/* Divider */}
        <View className="flex-row items-center my-5">
          <View className="flex-1 h-px bg-[#E4E7EC]" />
          <Text className="mx-3 text-[#9CA3AF] text-sm font-normal">or sign up with</Text>
          <View className="flex-1 h-px bg-[#E4E7EC]" />
        </View>

        {/* Google Sign-Up Button */}
        <TouchableOpacity
          onPress={handleGoogleSignUpPress}
          disabled={loading}
          className="mb-5"
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
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png",
            }}
            style={{ width: 20, height: 20, marginRight: 10 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: hp("1.8%"), fontWeight: "600", color: "#101828" }}>
            {loading ? "Please wait..." : "Sign up with Google"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-2 mb-6"
          onPress={() => router.push("/(auth)/Login")}
        >
          <Text className="text-center font-normal text-gray-500">
            Already have an account? <Text className="font-bold" style={{ color: PRIMARY_COLOR }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* OTP Modal */}
      <Modal
        visible={showOTPModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end bg-black/50"
        >
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl" style={{ fontWeight: '700' }}>
                {step === 1 ? 'Verify Phone' : 'Verify Email'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-500 mb-6" style={{ fontWeight: '400' }}>
              {step === 1
                ? `Enter the 6-digit code sent to +91 ${formData.phone}`
                : `Enter the 6-digit code sent to ${formData.email}`
              }
            </Text>

            <View className="flex-row justify-between mb-8 px-2">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpInputs.current[index] = ref)}
                  className="bg-white border border-gray-200 rounded-xl text-center text-lg"
                  style={{
                    fontWeight: '700',
                    width: 38,
                    height: 46,
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
              ))}
            </View>

            <TouchableOpacity
              onPress={verifyOTP}
              className={`w-full py-4 rounded-xl items-center ${otp.join('').length === 6 ? 'bg-[#008E96]' : 'bg-gray-200'}`}
            >
              <Text className="text-white text-base" style={{ fontWeight: '500' }}>
                Verify & Continue
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="mt-4 items-center"
              onPress={() => {
                if (step === 1) {
                  handlePhoneValidation();
                } else {
                  setToast({ message: "Verification code resent to your email.", type: "info" });
                }
              }}
            >
              <Text className="text-[#008E96]" style={{ fontWeight: '500' }}>Resend Code</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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

      {/* ─── Google New-User Phone Verification Modal ────────────────────────── */}
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
          <ScrollView
            style={{ backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
            contentContainerStyle={{ padding: 24 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#101828" }}>
                {googlePhoneOtpSent ? "Verify Your Phone" : "Complete Google Sign-Up"}
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
                <Text style={{ color: "#6A7282", marginBottom: 14, fontSize: 14 }}>
                  A verified phone number is required. Choose your role and enter your number below.
                </Text>

                {/* Role selector */}
                <Text style={{ color: "#374151", fontWeight: "600", marginBottom: 8, fontSize: 14 }}>Sign up as</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {SIGNUP_ROLES.map((r) => (
                    <TouchableOpacity
                      key={r.key}
                      onPress={() => handleGoogleRoleSelect(r.key)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        borderWidth: 1.5,
                        borderColor: googleSelectedRole === r.key ? PRIMARY_COLOR : "#E4E7EC",
                        backgroundColor: googleSelectedRole === r.key ? "#E6F7F6" : "#F9FAFB",
                      }}
                    >
                      <Text
                        style={{
                          color: googleSelectedRole === r.key ? PRIMARY_COLOR : "#6A7282",
                          fontWeight: googleSelectedRole === r.key ? "700" : "500",
                          fontSize: 13,
                        }}
                      >
                        {r.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

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
                    marginBottom: 24,
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
                    {loading ? "Creating account..." : "Verify & Create Account"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleGoogleOtpSend} style={{ alignItems: "center", marginBottom: 24 }}>
                  <Text style={{ color: PRIMARY_COLOR, fontWeight: "500", fontSize: 14 }}>Resend Code</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};


export default Register;
