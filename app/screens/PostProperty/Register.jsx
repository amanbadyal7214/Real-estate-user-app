import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRegister } from '../../../hooks/Register';
import * as SecureStore from "expo-secure-store";

const PostProperty = () => {
  const router = useRouter();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      router.replace("/screens/PostProperty/PropertyDetails");
    }
  };

  const {
    step,
    formData,
    updateFormData,
    loading,
    setEnteredMockOtp,
    setEmailOtp,
    handlePhoneValidation,
    verifyMockOtp,
    handleRegister,
    handleVerifyEmailOtp,
    handleLogin,
  } = useRegister();

  const [propertyType, setPropertyType] = useState('Residential');
  const [lookingTo, setLookingTo] = useState('Rent');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  
  // OTP State
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputs = useRef([]);

  const isFormValid = 
    formData.phone.length === 10 && 
    formData.name.trim().length > 0 && 
    formData.email.includes('@') &&
    formData.password.length >= 6;

  useEffect(() => {
    if (step === 2 && !showOTPModal) {
      // Small delay to ensure state updates before modal actions if needed
    }
  }, [step]);

  const handleNext = async () => {
    if (isFormValid) {
      setOtp(['', '', '', '', '', '']);
      setShowOTPModal(true);
      // Call phone validation after modal is shown to avoid alert blocking modal transition
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
    } else if (step === 2 || step === 3) { // Step 2 can also happen during registration transistion
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
        await handleVerifyEmailOtp();
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Section with Gradient - Fixed in Background */}
      <View className="absolute top-0 left-0 right-0 z-0">
        <LinearGradient
          colors={['#006B73', '#008E96']}
          className="px-4 pt-12 pb-24"
        >
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center gap-2">
              <TouchableOpacity>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <View className="flex-row items-center bg-[#FDC700] p-1 rounded-sm w-6 h-6 justify-center">
                <View className="w-3 h-3 rounded-full bg-[#006B73]" />
              </View>
              <Text className="text-white text-lg ml-1" style={{ fontFamily: 'Inter-Bold' }}>Propertize</Text>
            </View>
          </View>

          <Text className="text-white text-2xl leading-8" style={{ fontFamily: 'Inter-Medium' }}>
            Sell or rent your property
          </Text>
          <Text className="text-white text-2xl leading-8" style={{ fontFamily: 'Inter-Medium' }}>
            faster with Propertize
          </Text>
          <View className="w-24 h-1 bg-[#FDC700] rounded-full mt-2 mb-6" />

          <View className="flex-row gap-4">
            <View className="flex-row items-center gap-2">
              <View className="w-5 h-5 rounded-full bg-[#FDC700] items-center justify-center">
                <Ionicons name="checkmark" size={14} color="#006B73" />
              </View>
              <Text className="text-white text-sm" style={{ fontFamily: 'Inter-Regular' }}>Post property for free</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-5 h-5 rounded-full bg-[#FDC700] items-center justify-center">
                <Ionicons name="checkmark" size={14} color="#006B73" />
              </View>
              <Text className="text-white text-sm" style={{ fontFamily: 'Inter-Regular' }}>Get verified buyers</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View className="flex-1">
        <View className="h-64 bg-transparent" />

        {/* Floating Form Container */}
        <View className="mx-3 -mt-18 bg-white rounded-2xl shadow-lg px-4 elevation-5 flex-1 mb-24">
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Owner Tab Indicator */}
            <View className="bg-[#EDE7F6] rounded-t-xl py-2 items-center -mx-4  mb-6">
              <Text className="text-[#5E35B1] text-base" style={{ fontFamily: 'Inter-Medium' }}>Owner</Text>
            </View>

          

            {/* User Inputs Section */}
            <View className="gap-6 mb-6">
              {!isLogin && (
                <View className="flex-row items-center border-b border-[#E5E7EB] pb-2">
                  <Text className="text-black text-sm pr-3" style={{ fontFamily: 'Inter-Regular' }}>+91</Text>
                  <TextInput 
                    placeholder="Enter Phone Number" 
                    placeholderTextColor="#99A1AF"
                    className="flex-1 text-sm py-1"
                    keyboardType="phone-pad"
                    style={{ fontFamily: 'Inter-Regular' }}
                    value={formData.phone}
                    onChangeText={(val) => updateFormData('phone', val)}
                    maxLength={10}
                  />
                </View>
              )}
              {!isLogin && (
                <View className="border-b border-[#E5E7EB] pb-2">
                  <TextInput 
                    placeholder="Your Name" 
                    placeholderTextColor="#99A1AF"
                    className="text-sm py-1"
                    style={{ fontFamily: 'Inter-Regular' }}
                    value={formData.name}
                    onChangeText={(val) => updateFormData('name', val)}
                  />
                </View>
              )}
              <View className="border-b border-[#E5E7EB] pb-2">
                <TextInput 
                  placeholder={isLogin ? "Email/Number" : "Email Address"} 
                  placeholderTextColor="#99A1AF"
                  className="text-sm py-1"
                  style={{ fontFamily: 'Inter-Regular' }}
                  value={formData.email}
                  onChangeText={(val) => updateFormData('email', val)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View className="flex-row items-center border-b border-[#E5E7EB] pb-2">
                <TextInput 
                  placeholder="Password" 
                  placeholderTextColor="#99A1AF"
                  className="flex-1 text-sm py-1"
                  style={{ fontFamily: 'Inter-Regular' }}
                  value={formData.password}
                  onChangeText={(val) => {
                    updateFormData('password', val);
                    updateFormData('confirmPassword', val); // Simplified for this screen
                  }}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#99A1AF" />
                </TouchableOpacity>
              </View>
              {!isLogin && (
                <View className="flex-row items-center border-b border-[#E5E7EB] pb-2">
                  <Ionicons name="location-outline" size={20} color="#5E35B1" />
                  <TextInput 
                    placeholder="Search City" 
                    placeholderTextColor="#99A1AF"
                    className="flex-1 text-sm px-2 py-1"
                    style={{ fontFamily: 'Inter-Regular' }}
                    value={formData.city || ''}
                    onChangeText={(val) => updateFormData('city', val)}
                  />
                  <Ionicons name="chevron-down" size={20} color="#5E35B1" />
                </View>
              )}
                {/* Property Type Section */}
            {!isLogin && (
              <View className="mb-6">
                <Text className="text-[#4A5565] text-sm mb-4" style={{ fontFamily: 'Inter-Medium' }}>Property type</Text>
                <View className="flex-row justify-between">
                  <TouchableOpacity 
                    onPress={() => setPropertyType('Residential')}
                    className={`flex-1 mr-2 py-3 rounded-xl border items-center ${propertyType === 'Residential' ? 'bg-[#E6F7F6] border-[#008E96]' : 'bg-white border-[#D1D5DC]'}`}
                  >
                    <Text className={`${propertyType === 'Residential' ? 'text-[#008E96]' : 'text-[#364153]'} text-base`} style={{ fontFamily: 'Inter-Medium' }}>Residential</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setPropertyType('Commercial')}
                    className={`flex-1 ml-2 py-3 rounded-xl border items-center ${propertyType === 'Commercial' ? 'bg-[#E6F7F6] border-[#008E96]' : 'bg-white border-[#D1D5DC]'}`}
                  >
                    <Text className={`${propertyType === 'Commercial' ? 'text-[#008E96]' : 'text-[#364153]'} text-base`} style={{ fontFamily: 'Inter-Medium' }}>Commercial</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Looking To Section */}
            {!isLogin && (
              <View className="mb-6">
                <Text className="text-[#4A5565] text-sm mb-4" style={{ fontFamily: 'Inter-Medium' }}>You're looking to...</Text>
                <View className="flex-row justify-between mb-4">
                  <TouchableOpacity 
                    onPress={() => setLookingTo('Rent')}
                    className={`flex-1 mr-2 py-3 rounded-xl border items-center ${lookingTo === 'Rent' ? 'bg-[#E6F7F6] border-[#008E96]' : 'bg-white border-[#D1D5DC]'}`}
                  >
                    <Text className={`${lookingTo === 'Rent' ? 'text-[#008E96]' : 'text-[#364153]'} text-base`} style={{ fontFamily: 'Inter-Medium' }}>Rent</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setLookingTo('Sell')}
                    className={`flex-1 ml-2 py-3 rounded-xl border items-center ${lookingTo === 'Sell' ? 'bg-[#E6F7F6] border-[#008E96]' : 'bg-white border-[#D1D5DC]'}`}
                  >
                    <Text className={`${lookingTo === 'Sell' ? 'text-[#008E96]' : 'text-[#364153]'} text-base`} style={{ fontFamily: 'Inter-Medium' }}>Sell</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity 
                  onPress={() => setLookingTo('PG')}
                  className={`w-full py-3 rounded-xl border items-center ${lookingTo === 'PG' ? 'bg-[#E6F7F6] border-[#008E96]' : 'bg-white border-[#D1D5DC]'}`}
                >
                  <Text className={`${lookingTo === 'PG' ? 'text-[#008E96]' : 'text-[#364153]'} text-base`} style={{ fontFamily: 'Inter-Medium' }}>PG/Co-Living</Text>
                </TouchableOpacity>
              </View>
            )}
            </View>

            {/* Content Navigation Button */}
            <TouchableOpacity 
              disabled={loading || (isLogin ? !(formData.email.trim() && formData.password.length >= 6) : !isFormValid)}
              onPress={isLogin ? handleLogin : handleNext}
              className={`w-full py-4 rounded-xl items-center mb-4 ${(loading || (isLogin ? !(formData.email.trim() && formData.password.length >= 6) : !isFormValid)) ? 'bg-[#E5E7EB]' : 'bg-[#008E96]'}`}
            >
              <Text className={`${(loading || (isLogin ? (formData.email.trim() && formData.password.length >= 6) : isFormValid)) ? 'text-white' : 'text-[#99A1AF]'} text-base`} style={{ fontFamily: 'Inter-Medium' }}>
                {loading ? 'Processing...' : (isLogin ? 'Login to continue' : 'Next, add address & price')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setIsLogin(!isLogin)}
              className="w-full bg-[#008E9614] py-3 rounded-xl items-center mb-6"
            >
              <Text className="text-[#364153] text-sm" style={{ fontFamily: 'Inter-Regular' }}>
                {isLogin ? "New user? " : "Existing user? "}
                <Text className="text-[#008E96]" style={{ fontFamily: 'Inter-Medium' }}>
                  {isLogin ? "Register Here" : "Login Here"}
                </Text>
              </Text>
            </TouchableOpacity>

            {/* OTP Modal */}
            <Modal
              visible={showOTPModal}
              transparent={true}
              animationType="slide"
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
                    <TouchableOpacity onPress={() => setShowOTPModal(false)}>
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

            {/* Statistics Banner */}
            <View className="mt-6 bg-[#008E96] rounded-2xl p-4 flex-row justify-between items-center">
              <View className="items-center flex-1">
                <Text className="text-white text-lg" style={{ fontFamily: 'Inter-Bold' }}>No.1</Text>
                <Text className="text-white opacity-90 text-[10px] text-center mt-1" style={{ fontFamily: 'Inter-Regular' }}>Property Destination</Text>
              </View>
              <View className="items-center flex-1 border-x border-white/20">
                <Text className="text-white text-lg" style={{ fontFamily: 'Inter-Bold' }}>1 Lakh+</Text>
                <Text className="text-white opacity-90 text-[10px] text-center mt-1" style={{ fontFamily: 'Inter-Regular' }}>Owners</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-white text-lg" style={{ fontFamily: 'Inter-Bold' }}>1.5 Cr+</Text>
                <Text className="text-white opacity-90 text-[10px] text-center mt-1" style={{ fontFamily: 'Inter-Regular' }}>Tenants/Buyers</Text>
              </View>
            </View>

            {/* Why List With Us Section */}
            <View className="mt-8">
              <Text className="text-[#101828] text-xl mb-6" style={{ fontFamily: 'Inter-Bold' }}>Why should you list with us</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {/* Card 1 */}
                <View className="w-[280px] bg-white border border-[#E5E7EB] rounded-2xl p-4 mr-4">
                  <View className="flex-row items-center mb-4">
                    <View className="w-12 h-12 rounded-full bg-[#F3E8FF] items-center justify-center mr-3">
                      <Ionicons name="people-outline" size={24} color="#5E35B1" />
                    </View>
                    <View>
                      <View className="flex-row items-center">
                        <Text className="text-[#0A0A0A] text-sm" style={{ fontFamily: 'Inter-Medium' }}>Amit Chakrapani</Text>
                        <Ionicons name="checkmark-circle" size={16} color="#99A1AF" className="ml-1" />
                      </View>
                      <View className="flex-row items-center">
                        <Text className="text-[#6A7282] text-xs" style={{ fontFamily: 'Inter-Regular' }}>Lead Score </Text>
                        <Text className="text-[#F6339A] text-xs" style={{ fontFamily: 'Inter-Bold' }}>★ 4.3</Text>
                      </View>
                    </View>
                  </View>
                  <View className="gap-2">
                    <View className="flex-row justify-between">
                      <Text className="text-[#4A5565] text-xs" style={{ fontFamily: 'Inter-Regular' }}>Budget</Text>
                      <Text className="text-[#101828] text-xs" style={{ fontFamily: 'Inter-Medium' }}>₹ 20000-25000</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-[#4A5565] text-xs" style={{ fontFamily: 'Inter-Regular' }}>Searching Since</Text>
                      <Text className="text-[#101828] text-xs" style={{ fontFamily: 'Inter-Medium' }}>Today</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-[#4A5565] text-xs" style={{ fontFamily: 'Inter-Regular' }}>Locality</Text>
                      <Text className="text-[#101828] text-xs text-right flex-1 ml-4" numberOfLines={1} style={{ fontFamily: 'Inter-Medium' }}>Koramangla, whitefield</Text>
                    </View>
                  </View>
                  <TouchableOpacity className="items-center mt-4">
                    <Text className="text-[#5E35B1] text-xs" style={{ fontFamily: 'Inter-Medium' }}>View Contact Details</Text>
                  </TouchableOpacity>
                </View>

                {/* Card 2 */}
                <View className="w-[280px] bg-white border border-[#E5E7EB] rounded-2xl p-4 mr-4">
                  <View className="flex-row items-center mb-4">
                    <View className="w-12 h-12 rounded-full bg-[#F3E8FF] items-center justify-center mr-3">
                      <Ionicons name="people-outline" size={24} color="#5E35B1" />
                    </View>
                    <View>
                      <View className="flex-row items-center">
                        <Text className="text-[#0A0A0A] text-sm" style={{ fontFamily: 'Inter-Medium' }}>Jitesh Prakash</Text>
                        <Ionicons name="checkmark-circle" size={16} color="#99A1AF" className="ml-1" />
                      </View>
                      <View className="flex-row items-center">
                        <Text className="text-[#6A7282] text-xs" style={{ fontFamily: 'Inter-Regular' }}>Lead Score </Text>
                        <Text className="text-[#F6339A] text-xs" style={{ fontFamily: 'Inter-Bold' }}>★ 2.3</Text>
                      </View>
                    </View>
                  </View>
                  <View className="gap-2">
                    <View className="flex-row justify-between">
                      <Text className="text-[#4A5565] text-xs" style={{ fontFamily: 'Inter-Regular' }}>Budget</Text>
                      <Text className="text-[#101828] text-xs" style={{ fontFamily: 'Inter-Medium' }}>₹ 20000-25000</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-[#4A5565] text-xs" style={{ fontFamily: 'Inter-Regular' }}>Searching Since</Text>
                      <Text className="text-[#101828] text-xs" style={{ fontFamily: 'Inter-Medium' }}>Today</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-[#4A5565] text-xs" style={{ fontFamily: 'Inter-Regular' }}>Locality</Text>
                      <Text className="text-[#101828] text-xs text-right flex-1 ml-4" numberOfLines={1} style={{ fontFamily: 'Inter-Medium' }}>Koramangla, whitefield</Text>
                    </View>
                  </View>
                  <TouchableOpacity className="items-center mt-4">
                    <Text className="text-[#5E35B1] text-xs" style={{ fontFamily: 'Inter-Medium' }}>View Contact Details</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>

            {/* Verified Seekers Cards */}
            <View className="mt-8">
              <Text className="text-[#101828] text-xl mb-6" style={{ fontFamily: 'Inter-Bold' }}>Verified seekers</Text>
              <View className="flex-row gap-3">
                <View className="flex-1 bg-white border border-[#E5E7EB] rounded-2xl p-4">
                  <View className="w-12 h-12 bg-[#F3E8FF] rounded-xl items-center justify-center mb-3">
                    <Ionicons name="eye-outline" size={24} color="#5E35B1" />
                  </View>
                  <Text className="text-[#0A0A0A] text-base mb-2" style={{ fontFamily: 'Inter-Bold' }}>Maximum visibility</Text>
                  <Text className="text-[#4A5565] text-xs leading-4" style={{ fontFamily: 'Inter-Regular' }}>Showcase your property to thousands of seekers eve</Text>
                </View>
                <View className="flex-1 bg-white border border-[#E5E7EB] rounded-2xl p-4">
                  <View className="w-12 h-12 bg-[#FEF9C2] rounded-xl items-center justify-center mb-3">
                    <Ionicons name="calculator-outline" size={24} color="#D08700" />
                  </View>
                  <Text className="text-[#0A0A0A] text-base mb-2" style={{ fontFamily: 'Inter-Bold' }}>Price calculator</Text>
                  <Text className="text-[#4A5565] text-xs leading-4" style={{ fontFamily: 'Inter-Regular' }}>Get estimated market price of your property, makin</Text>
                </View>
              </View>
            </View>

            {/* How It Works Section */}
            <View className="mt-12 items-center">
              <Text className="text-[#101828] text-xl text-center" style={{ fontFamily: 'Inter-Bold' }}>How it works</Text>
              <View className="w-12 h-1 bg-[#008E96] rounded-full mt-2 mb-8" />
              
              <View className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6">
                {/* Step 1 */}
                <View className="flex-row gap-4 mb-8">
                  <View className="items-center">
                    <View className="w-16 h-16 rounded-full border-2 border-[#5E35B1] bg-white items-center justify-center">
                      <View className="w-6 h-6 rounded-full bg-[#5E35B1] items-center justify-center mb-1">
                        <Text className="text-white text-[10px]" style={{ fontFamily: 'Inter-Bold' }}>1</Text>
                      </View>
                      <Text className="text-lg">🏢</Text>
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-[#0A0A0A] text-sm mb-1" style={{ fontFamily: 'Inter-Bold' }}>Upload your property in 3 quick steps</Text>
                    <Text className="text-[#4A5565] text-xs leading-4" style={{ fontFamily: 'Inter-Regular' }}>Tell us a few basic details about your property, a</Text>
                  </View>
                </View>

                {/* Step 2 */}
                <View className="flex-row gap-4 mb-8">
                  <View className="items-center">
                    <View className="w-16 h-16 rounded-full border-2 border-[#5E35B1] bg-white items-center justify-center">
                      <View className="w-6 h-6 rounded-full bg-[#5E35B1] items-center justify-center mb-1">
                        <Text className="text-white text-[10px]" style={{ fontFamily: 'Inter-Bold' }}>2</Text>
                      </View>
                      <Text className="text-lg">🏘️</Text>
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-[#0A0A0A] text-sm mb-1" style={{ fontFamily: 'Inter-Bold' }}>Property reaches to 10 lacs+ tenants & buyers</Text>
                    <Text className="text-[#4A5565] text-xs leading-4" style={{ fontFamily: 'Inter-Regular' }}>As the largest property search website of India, y</Text>
                  </View>
                </View>

                {/* Step 3 */}
                <View className="flex-row gap-4">
                  <View className="items-center">
                    <View className="w-16 h-16 rounded-full border-2 border-[#5E35B1] bg-white items-center justify-center">
                      <View className="w-6 h-6 rounded-full bg-[#5E35B1] items-center justify-center mb-1">
                        <Text className="text-white text-[10px]" style={{ fontFamily: 'Inter-Bold' }}>3</Text>
                      </View>
                      <Text className="text-lg">🔍</Text>
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-[#0A0A0A] text-sm mb-1" style={{ fontFamily: 'Inter-Bold' }}>Start getting enquiries</Text>
                    <Text className="text-[#4A5565] text-xs leading-4" style={{ fontFamily: 'Inter-Regular' }}>You will start getting enquiries from interested b</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* FAQs Section */}
            <View className="mt-12 mb-10">
              <Text className="text-[#101828] text-xl text-center mb-2" style={{ fontFamily: 'Inter-Bold' }}>Frequently asked questions</Text>
              <View className="items-center mb-8">
                <View className="w-12 h-1 bg-[#008E96] rounded-full" />
              </View>
              
              <View className="gap-3">
                {[
                  "How to post a property on Propertize?",
                  "Can I post a property for free?",
                  "Can I post a property for free?",
                  "Can I post a property for free?"
                ].map((faq, index) => (
                  <View key={index} className="flex-row justify-between items-center bg-white border border-[#E5E7EB] rounded-2xl p-4">
                    <Text className="text-[#101828] text-sm flex-1" style={{ fontFamily: 'Inter-Regular' }}>{faq}</Text>
                    <Ionicons name="chevron-down" size={20} color="#5E35B1" />
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Bottom Sticky Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] p-4">
        <TouchableOpacity 
          disabled={!isFormValid}
          onPress={() => router.push('/screens/PostProperty/PriceDetails')}
          className={`w-full py-4 rounded-xl items-center shadow-lg ${isFormValid ? 'bg-[#008E96]' : 'bg-[#E5E7EB]'}`}
        >
          <Text className={`${isFormValid ? 'text-white' : 'text-[#99A1AF]'} text-base`} style={{ fontFamily: 'Inter-Bold' }}>Post Property for FREE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PostProperty;
