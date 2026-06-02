import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
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
  } = useRegister();

  useEffect(() => {
    updateFormData("role", "user");
  }, []);

  // OTP State
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputs = useRef([]);

  const isFormValid =
    formData.phone.length === 10 &&
    formData.name.trim().length > 0 &&
    formData.email.includes('@') &&
    formData.password.length >= 6;

  const handleNext = async () => {
    if (isFormValid) {
      setOtp(['', '', '', '', '', '']);
      setShowOTPModal(true);
      setTimeout(() => {
        handlePhoneValidation();
      }, 500);
    }
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
        console.log("Calling verifyMockOtp");
        verifyMockOtp();
      } else if (step === 2 || step === 3) {
        console.log("Calling handleVerifyEmailOtp as fallback for step", step);
        await handleVerifyEmailOtp({
          onSuccess: () => {
            setShowOTPModal(false);
            router.replace("/screens/Buy/Buy");
          }
        });
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
              backgroundColor: isFormValid && !loading ? '#008E96' : '#E5E7EB',
              shadowColor: '#9ADDD9',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 6,
              elevation: 4
            }}
            onPress={handleNext}
            disabled={loading || !isFormValid}
          >
            <Text className={`${isFormValid && !loading ? 'text-white' : 'text-[#99A1AF]'} font-inter-bold text-lg`}>
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
    </SafeAreaView>
  );
};


export default Register;
