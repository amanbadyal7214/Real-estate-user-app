import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../app/api";
import { PRIMARY_COLOR } from "../app/constants/theme";
import PasswordValidator, { validatePasswordRules } from "./PasswordValidator";

const ForgotPasswordModal = ({ visible, onClose, setToast, onLoginSuccess }) => {
  const [step, setStep] = useState(1); // 1: Mobile, 2: OTP, 3: Reset Password
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // UX improvements state
  const [focusedField, setFocusedField] = useState(null);
  const [timer, setTimer] = useState(0);
  const otpInputRef = useRef(null);

  // Timer logic for Resend OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const showToast = (message, type = "info") => {
    if (setToast) {
      setToast({ message, type });
    }
  };

  const handleSendOtp = async () => {
    if (mobileNumber.length !== 10) {
      showToast("Please enter a valid 10-digit mobile number.", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/send-reset-phone-otp", {
        phone: mobileNumber,
      });

      if (response.data.success) {
        showToast("OTP sent to your mobile number.", "success");
        if (response.data.mockOtp) {
          console.log("🔑 [DEBUG] Forgot Password Mock OTP:", response.data.mockOtp);
        }
        setTimer(59); // Start 60s countdown
        setStep(2);
      } else {
        showToast(response.data.message || "Failed to send OTP.", "error");
      }
    } catch (error) {
      console.error("Error sending reset OTP:", error.response?.data || error.message);
      const msg = error.response?.data?.message || error.response?.data?.error || "Error sending OTP.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      showToast("Please enter a 6-digit OTP.", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/verify-reset-phone-otp", {
        phone: mobileNumber,
        otp: otp,
      });

      if (response.data.success) {
        showToast("OTP verified successfully.", "success");
        setStep(3);
      } else {
        showToast(response.data.message || "Incorrect verification code.", "error");
      }
    } catch (error) {
      console.error("Error verifying reset OTP:", error.response?.data || error.message);
      const msg = error.response?.data?.message || error.response?.data?.error || "Verification failed.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      showToast("Please fill all password fields.", "error");
      return;
    }

    const pwdRules = validatePasswordRules(newPassword);
    if (!pwdRules.isValid) {
      showToast("Password must be 8+ chars with 1 capital letter, 1 number & 1 special char.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/reset-password", {
        phone: mobileNumber,
        otp: otp,
        newPassword: newPassword,
      });

      if (response.data.success) {
        const { token, role, user } = response.data;

        await Promise.all([
          SecureStore.setItemAsync("token", token),
          SecureStore.setItemAsync("userRole", typeof role === "string" ? role : JSON.stringify(role)),
          SecureStore.setItemAsync("userData", JSON.stringify(user))
        ]);

        showToast("Password reset successfully! Logged in.", "success");

        onClose();
        if (onLoginSuccess) {
          onLoginSuccess(response.data);
        }

        setTimeout(() => {
          setStep(1);
          setMobileNumber("");
          setOtp("");
          setNewPassword("");
          setConfirmPassword("");
          setTimer(0);
        }, 300);
      } else {
        showToast(response.data.error || "Reset password failed.", "error");
      }
    } catch (error) {
      console.error("Error resetting password:", error.response?.data || error.message);
      const msg = error.response?.data?.error || error.response?.data?.message || "Password reset failed.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setMobileNumber("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setTimer(0);
    }, 300);
  };

  // Render step indicators
  const renderStepIndicator = () => {
    return (
      <View className="flex-row justify-center space-x-2 my-4">
        {[1, 2, 3].map((s) => (
          <View
            key={s}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: step === s ? 24 : 8,
              backgroundColor: step === s ? PRIMARY_COLOR : "#E4E7EC",
            }}
          />
        ))}
      </View>
    );
  };

  // Render header icon container
  const renderHeaderIcon = () => {
    let iconName = "phone-portrait-outline";
    let bgCircleColor = PRIMARY_COLOR + "1A"; // 10% opacity

    if (step === 2) {
      iconName = "shield-checkmark-outline";
    } else if (step === 3) {
      iconName = "key-outline";
    }

    return (
      <View className="items-center mb-2 mt-2">
        <View
          className="w-14 h-14 rounded-full items-center justify-center"
          style={{ backgroundColor: bgCircleColor }}
        >
          <Ionicons name={iconName} size={28} color={PRIMARY_COLOR} />
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-black/60 justify-end"
      >
        <View className="bg-white rounded-t-[32px] p-6 pb-8 shadow-2xl">
          {/* Top handle bar to close/indicate sheet modal */}
          <View className="items-center mb-2">
            <View className="w-12 h-1.5 bg-[#E4E7EC] rounded-full" />
          </View>

          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-[#101828] text-2xl font-inter-bold">
              {step === 1 ? "Forgot Password" : step === 2 ? "Verify Phone" : "Reset Password"}
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              className="p-1.5 bg-gray-100 rounded-full"
              disabled={loading}
            >
              <Ionicons name="close" size={20} color="#6A7282" />
            </TouchableOpacity>
          </View>

          {renderStepIndicator()}
          {renderHeaderIcon()}

          {step === 1 && (
            <>
              <Text className="text-[#475467] text-sm font-inter-regular text-center mb-6 leading-5 px-4">
                Enter your registered mobile number to receive a verification OTP.
              </Text>

              <Text className="text-[#344054] text-sm font-inter-medium mb-1.5">
                Mobile Number
              </Text>
              <View
                className="flex-row items-center border rounded-xl overflow-hidden mb-4 transition-all"
                style={{
                  borderColor: focusedField === "phone" ? PRIMARY_COLOR : "#E4E7EC",
                  borderWidth: focusedField === "phone" ? 1.5 : 1,
                  backgroundColor: focusedField === "phone" ? "white" : "#F9FAFB",
                }}
              >
                <View className="bg-[#F2F4F7] px-3.5 py-2.5 border-r border-[#E4E7EC]">
                  <Text className="text-[#344054] font-inter-semibold">+91</Text>
                </View>
                <TextInput
                  placeholder="Enter 10-digit number"
                  keyboardType="numeric"
                  maxLength={10}
                  className="flex-1 px-3.5 py-2.5 text-[#101828] text-sm font-inter-regular bg-transparent"
                  placeholderTextColor="#9CA3AF"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  editable={!loading}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>

              <TouchableOpacity
                className="w-full py-3 rounded-xl items-center justify-center flex-row space-x-2 shadow-sm"
                style={{ backgroundColor: PRIMARY_COLOR }}
                onPress={handleSendOtp}
                disabled={loading}
              >
                {loading && <ActivityIndicator size="small" color="white" />}
                <Text className="text-white font-inter-semibold text-base">
                  {loading ? "Sending..." : "Send OTP"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text className="text-[#475467] text-sm font-inter-regular text-center mb-5 leading-5 px-4">
                We&apos;ve sent a 6-digit verification code to your phone number.
              </Text>

              <Text className="text-[#344054] text-sm font-inter-medium mb-2 text-center">
                Enter OTP sent to +91 {mobileNumber}
              </Text>

              <View className="mb-3 position-relative">
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => otpInputRef.current?.focus()}
                  className="flex-row justify-between px-2"
                >
                  {Array(6).fill("").map((_, index) => {
                    const char = otp[index] || "";
                    const isFocusedBox = focusedField === "otp" && (otp.length === index || (otp.length === 6 && index === 5));

                    return (
                      <View
                        key={index}
                        className="items-center justify-center bg-white border"
                        style={{
                          width: 38,
                          height: 46,
                          borderRadius: 10,
                          borderColor: isFocusedBox ? PRIMARY_COLOR : "#E4E7EC",
                          borderWidth: isFocusedBox ? 1.5 : 1,
                        }}
                      >
                        <Text className="text-[#101828] text-lg font-inter-semibold">
                          {char}
                        </Text>
                      </View>
                    );
                  })}
                </TouchableOpacity>

                <TextInput
                  ref={otpInputRef}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  maxLength={6}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                  }}
                  onFocus={() => setFocusedField("otp")}
                  onBlur={() => setFocusedField(null)}
                  caretHidden
                />
              </View>

              <View className="items-center mb-4">
                {timer > 0 ? (
                  <Text className="text-[#6A7282] text-sm font-inter-regular">
                    Resend code in <Text className="font-inter-semibold text-[#101828]">{timer}s</Text>
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleSendOtp} className="py-1">
                    <Text className="font-inter-semibold text-sm" style={{ color: PRIMARY_COLOR }}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View className="flex-row items-center space-x-3">
                <TouchableOpacity
                  className="flex-1 py-3 rounded-xl border border-[#E4E7EC] items-center justify-center bg-white"
                  onPress={handleBack}
                  disabled={loading}
                >
                  <Text className="text-[#344054] font-inter-semibold text-sm">
                    Back
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 rounded-xl items-center justify-center flex-row space-x-2"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                  onPress={handleVerifyOtp}
                  disabled={loading}
                >
                  {loading && <ActivityIndicator size="small" color="white" />}
                  <Text className="text-white font-inter-semibold text-sm">
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 3 && (
            <>
              <Text className="text-[#344054] text-sm font-inter-medium mb-1.5">
                New Password
              </Text>
              <View
                className="flex-row items-center border bg-white px-3 py-2.5 rounded-xl mb-3 transition-all"
                style={{
                  borderColor: focusedField === "newPass" ? PRIMARY_COLOR : "#E4E7EC",
                  borderWidth: focusedField === "newPass" ? 1.5 : 1,
                }}
              >
                <TextInput
                  placeholder="Enter New Password"
                  secureTextEntry={!showNewPassword}
                  className="flex-1 text-[#101828] text-sm font-inter-regular"
                  placeholderTextColor="#9CA3AF"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  editable={!loading}
                  onFocus={() => setFocusedField("newPass")}
                  onBlur={() => setFocusedField(null)}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} className="p-1">
                  <Ionicons name={showNewPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#6A7282" />
                </TouchableOpacity>
              </View>
              <PasswordValidator password={newPassword} />

              <Text className="text-[#344054] text-sm font-inter-medium mb-1.5">
                Confirm Password
              </Text>
              <View
                className="flex-row items-center border bg-white px-3 py-2.5 rounded-xl mb-4 transition-all"
                style={{
                  borderColor: focusedField === "confPass" ? PRIMARY_COLOR : "#E4E7EC",
                  borderWidth: focusedField === "confPass" ? 1.5 : 1,
                }}
              >
                <TextInput
                  placeholder="Confirm Password"
                  secureTextEntry={!showConfirmPassword}
                  className="flex-1 text-[#101828] text-sm font-inter-regular"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!loading}
                  onFocus={() => setFocusedField("confPass")}
                  onBlur={() => setFocusedField(null)}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="p-1">
                  <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#6A7282" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                className="w-full py-3 rounded-xl items-center justify-center flex-row space-x-2 shadow-sm"
                style={{ backgroundColor: PRIMARY_COLOR }}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading && <ActivityIndicator size="small" color="white" />}
                <Text className="text-white font-inter-semibold text-base">
                  {loading ? "Resetting..." : "Reset Password"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ForgotPasswordModal;
