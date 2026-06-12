import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState, useRef } from "react";
import { Alert } from "react-native";
import api from "../app/api";

export const performRoleBasedRedirect = (role, defaultTarget, setRoleSelector) => {
    let roleArray = [];
    if (Array.isArray(role)) {
        roleArray = role;
    } else if (typeof role === 'string') {
        try {
            const parsed = JSON.parse(role);
            if (Array.isArray(parsed)) {
                roleArray = parsed;
            } else {
                roleArray = [role];
            }
        } catch {
            roleArray = [role];
        }
    }

    const hasOwner = roleArray.includes('owner');
    const hasBuilder = roleArray.includes('builder');
    const hasBuyer = roleArray.includes('buyer');

    const activeRoles = [];
    if (hasBuyer) activeRoles.push('buyer');
    if (hasOwner) activeRoles.push('owner');
    if (hasBuilder) activeRoles.push('builder');

    if (activeRoles.length > 1) {
        if (setRoleSelector) {
            setRoleSelector({
                visible: true,
                roles: roleArray
            });
        } else {
            const buttons = [];
            if (hasBuyer) {
                buttons.push({
                    text: "Buyer Dashboard",
                    onPress: () => router.replace("/screens/Buy/Buy"),
                });
            }
            if (hasOwner) {
                buttons.push({
                    text: "Owner Dashboard",
                    onPress: () => router.replace("/screens/PostProperty/MyProperties"),
                });
            }
            if (hasBuilder) {
                buttons.push({
                    text: "Builder Dashboard",
                    onPress: () => router.replace("/screens/Project/MyProjects"),
                });
            }
            Alert.alert(
                "Select Dashboard",
                "Which dashboard would you like to open?",
                buttons,
                { cancelable: false }
            );
        }
    } else if (hasBuilder) {
        router.replace("/screens/Project/MyProjects");
    } else if (hasOwner) {
        router.replace("/screens/PostProperty/MyProperties");
    } else if (hasBuyer) {
        router.replace("/screens/Buy/Buy");
    } else {
        router.replace(defaultTarget || "/screens/Buy/Buy");
    }
};

export const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Phone Validation, 2: Details Form, 3: Email OTP Verification
    const [roleSelector, setRoleSelector] = useState({ visible: false, roles: [] });

    // Existing user flow states
    const [existingUserDetails, setExistingUserDetails] = useState(null);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);

    const [toast, setToast] = useState(null);
    const toastTimeoutRef = useRef(null);

    const showToast = (message, type = "info") => {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        setToast({ message, type });
        toastTimeoutRef.current = setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "buyer", // default role
        companyName: "",
        businessSince: "",
        city: "",
    });

    const [mockOtp, setMockOtp] = useState("");
    const [enteredMockOtp, setEnteredMockOtp] = useState("");
    const [emailOtp, setEmailOtp] = useState("");

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = (isExistingUser = false) => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            role: isExistingUser ? "" : "buyer",
            companyName: "",
            businessSince: "",
            city: "",
        });
        setExistingUserDetails(null);
        setIsPhoneVerified(false);
        setStep(1);
        setEnteredMockOtp("");
        setEmailOtp("");
    };

    // Step 1: Phone Validation
    const handlePhoneValidation = async () => {
        if (formData.phone.length !== 10) {
            showToast("Please enter a valid 10-digit phone number.", "error");
            return;
        }
        setLoading(true);
        try {
            const payload = { phone: formData.phone };
            console.log("API Request: POST /auth/send-phone-otp (Send)", payload);
            const response = await api.post("/auth/send-phone-otp", payload);
            console.log("API Response: /auth/send-phone-otp (Send)", response.data);

            if (response.data.success) {
                showToast("Verification OTP sent to your phone.", "success");
            } else {
                showToast(response.data.message || "Failed to send verification code.", "error");
            }
        } catch (error) {
            console.error("API Error: /auth/send-phone-otp (Send)", error.response?.data || error.message);
            const message = error.response?.data?.message || error.response?.data?.error || "Failed to send verification code.";
            showToast(message, "error");
        } finally {
            setLoading(false);
        }
    };

    const verifyMockOtp = async (options = {}) => {
        const { isExisting = false } = options;
        if (enteredMockOtp.length !== 6) {
            showToast("Please enter a 6-digit OTP code.", "error");
            return false;
        }
        setLoading(true);
        try {
            const payload = {
                phone: formData.phone,
                otp: enteredMockOtp.trim(),
            };
            if (isExisting) {
                payload.existUser = true;
            }
            console.log("API Request: POST /auth/verify-phone-otp (Verify)", payload);
            const response = await api.post("/auth/verify-phone-otp", payload);
            console.log("API Response: /auth/verify-phone-otp (Verify)", response.data);

            if (response.data.success) {
                if (isExisting) {
                    const user = response.data.user;
                    setExistingUserDetails(user);
                    setIsPhoneVerified(true);
                    showToast("Phone verified successfully!", "success");
                    
                    // Pre-fill form fields
                    setFormData(prev => ({
                        ...prev,
                        name: user.name || "",
                        email: user.email || "",
                        city: user.city || "",
                        password: "", // password must be filled by user
                        confirmPassword: "",
                        role: "", // reset role for selection
                        companyName: "",
                        businessSince: "",
                    }));
                } else {
                    showToast("Phone verified! Enter details.", "success");
                    setStep(2); // Proceed to registration details
                }
                return true;
            } else {
                showToast(response.data.message || "Incorrect verification code.", "error");
                return false;
            }
        } catch (error) {
            console.error("API Error: /auth/verify-phone-otp (Verify)", error.response?.data || error.message);
            const message = error.response?.data?.message || error.response?.data?.error || "Verification failed. Please try again.";
            showToast(message, "error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Account Registration (Backend OTP)
    const handleRegister = async (options = {}) => {
        const { onSuccess } = options;

        if (formData.password !== formData.confirmPassword) {
            showToast("Passwords do not match.", "error");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                profileData: {
                    phone: formData.phone,
                    city: formData.city,
                    companyName: formData.companyName,
                    businessSince: formData.businessSince,
                }
            };

            console.log("API Request: POST /auth/register", payload);
            const response = await api.post("/auth/register", payload);
            console.log("API Response: /auth/register", response.data);

            if (response.data.success) {
                showToast("Account created successfully!", "success");
                // Commented out email verification step, log in directly
                // setStep(3); // Proceed to Email OTP verification
                await handleLogin();
            } else {
                // If success is false but no error thrown
                showToast(response.data.error || "Something went wrong.", "warning");
                // Removed setStep(1) to let user stay on the form
            }
        } catch (error) {
            console.error("API Error: /auth/register", error.response?.data || error.message);
            const message = error.response?.data?.error || error.response?.data?.message || "Registration failed. Please try again.";
            showToast(message, "error");

            // Temporary Workaround: Agar email fail ho raha hai but user create ho gaya ho (backend check)
            // Ya sirf debugging ke liye allow karna chahte hain to step 3 par bhej sakte hain
            if (message.includes("Email could not be sent")) {
                showToast("User created but email dispatch failed.", "warning");
                // setStep(3); // Uncomment this only if you want to bypass for testing
            }
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Email OTP Verification
    const handleVerifyEmailOtp = async () => {
        console.log("handleVerifyEmailOtp Debug:", {
            emailInFormData: formData.email,
            enteredOtp: emailOtp,
            step: step
        });

        if (!emailOtp) {
            showToast("Please enter the OTP sent to your email.", "error");
            return;
        }

        if (!formData.email) {
            showToast("Email address is missing from form data.", "error");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                email: formData.email.trim().toLowerCase(),
                otp: emailOtp.trim(),
            };
            console.log("API Request: POST /auth/verify-otp", payload);
            const response = await api.post("/auth/verify-otp", payload);
            console.log("API Response: /auth/verify-otp", response.data);

            if (response.data.success) {
                const { token, role, user } = response.data;
                // Wait for all storage operations to complete first
                await Promise.all([
                    SecureStore.setItemAsync("token", token),
                    SecureStore.setItemAsync("userRole", typeof role === "string" ? role : JSON.stringify(role)),
                    SecureStore.setItemAsync("userData", JSON.stringify(user))
                ]);

                showToast("Account created successfully!", "success");
                performRoleBasedRedirect(role, "/screens/PostProperty/PropertyDetails", setRoleSelector);
            } else {
                showToast(response.data.message || "Invalid OTP", "error");
            }
        } catch (error) {
            console.error("API Error: /auth/verify-otp", error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || "Verification failed. Please try again.";
            showToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (options = {}) => {
        const { onSuccess } = options;

        if (!formData.email || !formData.password) {
            showToast("Please enter both Email and Password", "error");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            };
            console.log("API Request: POST /auth/login", payload);
            const response = await api.post("/auth/login", payload);
            console.log("API Response: /auth/login", response.data);

            if (response.data.success) {
                const { token, role, user } = response.data;
                // Wait for all storage operations to complete first
                await Promise.all([
                    SecureStore.setItemAsync("token", token),
                    SecureStore.setItemAsync("userRole", typeof role === "string" ? role : JSON.stringify(role)),
                    SecureStore.setItemAsync("userData", JSON.stringify(user))
                ]);

                showToast("Logged in successfully!", "success");
                if (typeof onSuccess === "function") {
                    onSuccess(response.data);
                } else {
                    performRoleBasedRedirect(role, "/screens/PostProperty/PropertyDetails", setRoleSelector);
                }
            } else {
                showToast(response.data.message || "Invalid credentials", "error");
            }
        } catch (error) {
            console.error("API Error: /screens/PostProperty/Register", error.response?.data || error.message);

            const message = error.response?.data?.error || error.response?.data?.message || "Login failed. Please try again.";
            showToast(message, "error");
        } finally {
            setLoading(false);
        }
    };

    return {
        step,
        setStep,
        formData,
        setFormData,
        updateFormData,
        loading,
        mockOtp,
        enteredMockOtp,
        setEnteredMockOtp,
        emailOtp,
        setEmailOtp,
        handlePhoneValidation,
        verifyMockOtp,
        handleRegister,
        handleVerifyEmailOtp,
        handleLogin,
        roleSelector,
        setRoleSelector,
        existingUserDetails,
        setExistingUserDetails,
        isPhoneVerified,
        setIsPhoneVerified,
        resetForm,
        toast,
        setToast,
    };
};
