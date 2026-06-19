import { AntDesign, Ionicons } from "@expo/vector-icons";
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
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardSelectorModal from "../../components/DashboardSelectorModal";
import Toast from "../../components/Toast";
import { performRoleBasedRedirect, useRegister } from "../../hooks/Register";
import { PRIMARY_COLOR } from "../constants/theme";

const Register = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

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
  } = useRegister();

  useEffect(() => {
    checkToken();
    updateFormData("role", "buyer");
  }, []);

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
      formData.password.length >= 6);

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
        setShowOTPModal(false);
      }
    };
    registerAndNext();
  }, [step, showOTPModal]);

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
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(auth)/onboard");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4">
        <TouchableOpacity onPress={handleSafeBack} className="p-2 self-start">
          <Ionicons name="chevron-back" size={32} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 pb-16">

        <View className=" mb-8">
          <Image
            source={require('../../assets/images/realeasteapphorizontal11(1).png')}
            style={{ width: 220, height: 60 }}
            resizeMode="contain"
            className="mb-3"
          />
          <Text className="text-[24px] font-inter-bold text-gray-900">
            {isLogin ? "Existing User Roles" : "Create Your Account"}
          </Text>
          <Text className="text-gray-500 mt-3 font-inter-regular ">
            {isLogin
              ? "Verify your phone and select a new role to continue."
              : `Sign up as a ${formData.role || 'user'} to access the platform.`
            }
          </Text>
        </View>

        {/* Auth Tabs */}
        <View className="flex-row bg-[#F3F4F6] rounded-xl p-1 mb-6">
          <TouchableOpacity
            onPress={() => {
              setIsLogin(false);
              resetForm(false);
            }}
            className="flex-1 py-3 rounded-lg items-center"
            style={{
              backgroundColor: !isLogin ? '#008E96' : 'transparent',
              shadowColor: !isLogin ? '#000' : 'transparent',
              shadowOffset: !isLogin ? { width: 0, height: 1 } : { width: 0, height: 0 },
              shadowOpacity: !isLogin ? 0.15 : 0,
              shadowRadius: !isLogin ? 1.00 : 0,
              elevation: !isLogin ? 1 : 0,
            }}
          >
            <Text
              className="text-sm font-inter-medium"
              style={{
                color: !isLogin ? '#FFFFFF' : '#4B5563'
              }}
            >
              New User
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsLogin(true);
              resetForm(true);
            }}
            className="flex-1 py-3 rounded-lg items-center"
            style={{
              backgroundColor: isLogin ? '#008E96' : 'transparent',
              shadowColor: isLogin ? '#000' : 'transparent',
              shadowOffset: isLogin ? { width: 0, height: 1 } : { width: 0, height: 0 },
              shadowOpacity: isLogin ? 0.15 : 0,
              shadowRadius: isLogin ? 1.00 : 0,
              elevation: isLogin ? 1 : 0,
            }}
          >
            <Text
              className="text-sm font-inter-medium"
              style={{
                color: isLogin ? '#FFFFFF' : '#4B5563'
              }}
            >
              Existing User
            </Text>
          </TouchableOpacity>
        </View>

        {/* Role Selector for New User, or Role Assignment for Existing User */}
        {!isLogin ? (
          <View className="mb-6">
            <Text className="text-gray-500 text-sm mb-3 font-inter-medium">
              User Type
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => updateFormData('role', 'buyer')}
                className="flex-1 py-3 rounded-2xl border items-center shadow-sm"
                style={{
                  backgroundColor: isRoleActive('buyer') ? '#E6F7F6' : '#FFFFFF',
                  borderColor: isRoleActive('buyer') ? '#008E96' : '#E5E7EB'
                }}
              >
                <Text
                  className="text-sm font-inter-bold"
                  style={{
                    color: isRoleActive('buyer') ? '#008E96' : '#4B5563'
                  }}
                >
                  Buyer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => updateFormData('role', 'owner')}
                className="flex-1 py-3 rounded-2xl border items-center shadow-sm"
                style={{
                  backgroundColor: isRoleActive('owner') ? '#E6F7F6' : '#FFFFFF',
                  borderColor: isRoleActive('owner') ? '#008E96' : '#E5E7EB'
                }}
              >
                <Text
                  className="text-sm font-inter-bold"
                  style={{
                    color: isRoleActive('owner') ? '#008E96' : '#4B5563'
                  }}
                >
                  Owner
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => updateFormData('role', 'builder')}
                className="flex-1 py-3 rounded-2xl border items-center shadow-sm"
                style={{
                  backgroundColor: isRoleActive('builder') ? '#E6F7F6' : '#FFFFFF',
                  borderColor: isRoleActive('builder') ? '#008E96' : '#E5E7EB'
                }}
              >
                <Text
                  className="text-sm font-inter-bold"
                  style={{
                    color: isRoleActive('builder') ? '#008E96' : '#4B5563'
                  }}
                >
                  Builder
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          isPhoneVerified && (
            <View className="mb-6 gap-4">
              {/* Already Assigned Roles */}
              <View>
                <Text className="text-gray-500 text-sm mb-2 font-inter-medium">
                  Already Assigned Roles
                </Text>
                <View className="flex-row gap-2 flex-wrap">
                  {existingUserDetails?.role && (Array.isArray(existingUserDetails.role) ? existingUserDetails.role : [existingUserDetails.role]).map((r) => (
                    <View key={r} className="bg-gray-100 px-4 py-2 rounded-2xl border border-gray-200">
                      <Text className="text-gray-500 text-xs capitalize font-semibold" style={{ fontFamily: 'Inter-Medium' }}>
                        {r}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Select Your Role (unassigned) */}
              <View>
                <Text className="text-gray-500 text-sm mb-3 font-inter-medium">
                  Select Your Role
                </Text>
                {(() => {
                  const allRolesList = ['buyer', 'owner', 'builder'];
                  const assignedRolesList = existingUserDetails?.role
                    ? (Array.isArray(existingUserDetails.role) ? existingUserDetails.role : [existingUserDetails.role])
                    : [];
                  const unassignedRolesList = allRolesList.filter(r => !assignedRolesList.includes(r));

                  if (unassignedRolesList.length === 0) {
                    return (
                      <Text className="text-red-500 text-xs italic" style={{ fontFamily: 'Inter-Regular' }}>
                        All roles are already assigned to this account.
                      </Text>
                    );
                  }

                  return (
                    <View className="flex-row gap-2">
                      {unassignedRolesList.map((roleName) => (
                        <TouchableOpacity
                          key={roleName}
                          onPress={() => updateFormData('role', roleName)}
                          className="flex-1 py-3 rounded-2xl border items-center shadow-sm"
                          style={{
                            backgroundColor: formData.role === roleName ? '#E6F7F6' : '#FFFFFF',
                            borderColor: formData.role === roleName ? '#008E96' : '#E5E7EB'
                          }}
                        >
                          <Text
                            className="text-sm capitalize font-inter-bold"
                            style={{
                              color: formData.role === roleName ? '#008E96' : '#4B5563'
                            }}
                          >
                            {roleName}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  );
                })()}
              </View>
            </View>
          )
        )}

        {/* Form Fields - Tightened */}
        <View className="space-y-3 mb-2">
          {/* Phone Number Input */}
          {(!isLogin || !isPhoneVerified) ? (
            <View className="flex-row items-center border border-gray-100 bg-gray-50 p-3 rounded-2xl">
              <Ionicons name="phone-portrait-outline" size={18} color="#9CA3AF" />
              <TextInput
                placeholder="Phone Number"
                keyboardType="phone-pad"
                className="flex-1 ml-3 font-inter-regular text-gray-800"
                placeholderTextColor="#9CA3AF"
                value={formData.phone}
                onChangeText={(value) => updateFormData("phone", value)}
                maxLength={10}
              />
            </View>
          ) : (
            <View className="flex-row items-center border border-gray-100 bg-gray-50 p-3 rounded-2xl opacity-60">
              <Ionicons name="phone-portrait-outline" size={18} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 font-inter-regular text-gray-800"
                value={formData.phone}
                editable={false}
              />
              <Ionicons name="checkmark-circle" size={20} color="green" />
            </View>
          )}

          {/* Name Field */}
          {(!isLogin || isPhoneVerified) && (
            <View className="flex-row items-center border border-gray-100 bg-gray-50 p-3 rounded-2xl mt-3">
              <Ionicons name="person-outline" size={18} color="#9CA3AF" />
              <TextInput
                placeholder="Your Full Name"
                className="flex-1 ml-3 font-inter-regular text-gray-800"
                placeholderTextColor="#9CA3AF"
                value={formData.name}
                onChangeText={(value) => updateFormData("name", value)}
              />
            </View>
          )}

          {/* Email Field */}
          {(!isLogin || isPhoneVerified) && (
            <View className="flex-row items-center border border-gray-100 bg-gray-50 p-3 rounded-2xl mt-3">
              <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
              <TextInput
                placeholder="Email address"
                keyboardType="email-address"
                className="flex-1 ml-3 font-inter-regular text-gray-800"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(value) => updateFormData("email", value)}
                autoCapitalize="none"
              />
            </View>
          )}

          {/* Password Field */}
          {(!isLogin || isPhoneVerified) && (
            <View className="mt-3">
              <View className="flex-row items-center border border-gray-100 bg-gray-50 p-3 rounded-2xl">
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
              {isLogin && (
                <Text className="text-xs text-gray-500 mt-1 ml-1" style={{ fontFamily: 'Inter-Regular' }}>
                  Fill your login password to get a new role
                </Text>
              )}
            </View>
          )}

          {/* Confirm Password Field (Only for New User) */}
          {!isLogin && (
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
          )}

          {/* Search City Field */}
          {(!isLogin || isPhoneVerified) && (
            <View className="flex-row items-center border border-gray-100 bg-gray-50 p-3 rounded-2xl mt-3">
              <Ionicons name="location-outline" size={18} color="#9CA3AF" />
              <TextInput
                placeholder="Search City"
                className="flex-1 ml-3 font-inter-regular text-gray-800"
                placeholderTextColor="#9CA3AF"
                value={formData.city || ''}
                onChangeText={(value) => updateFormData("city", value)}
              />
            </View>
          )}

          {/* Builder specific fields */}
          {(!isLogin || isPhoneVerified) && formData.role === 'builder' && (
            <>
              <View className="flex-row items-center border border-gray-100 bg-gray-50 p-3 rounded-2xl mt-3">
                <Ionicons name="business-outline" size={18} color="#9CA3AF" />
                <TextInput
                  placeholder="Company Name"
                  className="flex-1 ml-3 font-inter-regular text-gray-800"
                  placeholderTextColor="#9CA3AF"
                  value={formData.companyName || ''}
                  onChangeText={(value) => updateFormData("companyName", value)}
                />
              </View>

              <View className="flex-row items-center border border-gray-100 bg-gray-50 p-3 rounded-2xl mt-3">
                <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
                <TextInput
                  placeholder="Business Since (Year)"
                  keyboardType="number-pad"
                  maxLength={4}
                  className="flex-1 ml-3 font-inter-regular text-gray-800"
                  placeholderTextColor="#9CA3AF"
                  value={formData.businessSince || ''}
                  onChangeText={(value) => updateFormData("businessSince", value)}
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
            ) && !loading ? 'text-white' : 'text-[#99A1AF]'} font-inter-bold text-lg`}>
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

        {/* Toggle to Existing User / New User */}
        <TouchableOpacity
          className="mt-6 mb-4"
          onPress={() => {
            if (isLogin) {
              setIsLogin(false);
              resetForm(false);
            } else {
              setIsLogin(true);
              resetForm(true);
            }
          }}
        >
          <Text className="text-center font-inter-regular text-gray-500">
            {isLogin ? "Need a new account? " : "Already have an account? "}
            <Text className="font-inter-bold" style={{ color: PRIMARY_COLOR }}>
              {isLogin ? "Register Here" : "Add Role / Login Here"}
            </Text>
          </Text>
        </TouchableOpacity>

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
              <Text className="text-xl" style={{ fontFamily: 'Inter-Bold' }}>
                {step === 1 ? 'Verify Phone' : 'Verify Email'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-500 mb-6" style={{ fontFamily: 'Inter-Regular' }}>
              {step === 1
                ? `Enter the 6-digit code sent to +91 ${formData.phone}`
                : `Enter the 6-digit code sent to ${formData.email}`
              }
            </Text>

            <View className="flex-row justify-between mb-8">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpInputs.current[index] = ref)}
                  className="w-11 h-14 border-2 border-gray-200 rounded-lg text-center text-xl"
                  style={{ fontFamily: 'Inter-Bold' }}
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
              <Text className="text-white text-base" style={{ fontFamily: 'Inter-Medium' }}>
                Verify & Continue
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="mt-4 items-center">
              <Text className="text-[#008E96]" style={{ fontFamily: 'Inter-Medium' }}>Resend Code</Text>
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
    </SafeAreaView>
  );
};


export default Register;
