import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
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
    });

    const [mockOtp, setMockOtp] = useState("");
    const [enteredMockOtp, setEnteredMockOtp] = useState("");
    const [emailOtp, setEmailOtp] = useState("");

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Step 1: Phone Validation
    const handlePhoneValidation = async () => {
        if (formData.phone.length !== 10) {
            Alert.alert("Error", "Please enter a valid 10-digit phone number.");
            return;
        }
        setLoading(true);
        try {
            const payload = { phone: formData.phone };
            console.log("API Request: POST /auth/send-phone-otp (Send)", payload);
            const response = await api.post("/auth/send-phone-otp", payload);
            console.log("API Response: /auth/send-phone-otp (Send)", response.data);

            if (response.data.success) {
                Alert.alert("Success", "Verification OTP sent to your phone.");
            } else {
                Alert.alert("Error", response.data.message || "Failed to send verification code.");
            }
        } catch (error) {
            console.error("API Error: /auth/send-phone-otp (Send)", error.response?.data || error.message);
            const message = error.response?.data?.message || error.response?.data?.error || "Failed to send verification code.";
            Alert.alert("Error", message);
        } finally {
            setLoading(false);
        }
    };

    const verifyMockOtp = async () => {
        if (enteredMockOtp.length !== 6) {
            Alert.alert("Error", "Please enter a 6-digit OTP code.");
            return;
        }
        setLoading(true);
        try {
            const payload = {
                phone: formData.phone,
                otp: enteredMockOtp.trim(),
            };
            console.log("API Request: POST /auth/verify-phone-otp (Verify)", payload);
            const response = await api.post("/auth/verify-phone-otp", payload);
            console.log("API Response: /auth/verify-phone-otp (Verify)", response.data);

            if (response.data.success) {
                setStep(2); // Proceed to registration details
            } else {
                Alert.alert("Verification Failed", response.data.message || "Incorrect verification code.");
            }
        } catch (error) {
            console.error("API Error: /auth/verify-phone-otp (Verify)", error.response?.data || error.message);
            const message = error.response?.data?.message || error.response?.data?.error || "Verification failed. Please try again.";
            Alert.alert("Error", message);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Account Registration (Backend OTP)
    const handleRegister = async (options = {}) => {
        const { onSuccess } = options;

        if (formData.password !== formData.confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
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
                Alert.alert("Success", "Account created successfully!");
                // Commented out email verification step, log in directly
                // setStep(3); // Proceed to Email OTP verification
                await handleLogin();
            } else {
                // If success is false but no error thrown
                Alert.alert("Warning", response.data.error || "Something went wrong.");
                // Removed setStep(1) to let user stay on the form
            }
        } catch (error) {
            console.error("API Error: /auth/register", error.response?.data || error.message);
            const message = error.response?.data?.error || error.response?.data?.message || "Registration failed. Please try again.";
            Alert.alert("Backend Error", message);

            // Temporary Workaround: Agar email fail ho raha hai but user create ho gaya ho (backend check)
            // Ya sirf debugging ke liye allow karna chahte hain to step 3 par bhej sakte hain
            if (message.includes("Email could not be sent")) {
                Alert.alert("Info", "Backend created user but couldn't send email. Check your email later.");
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
            Alert.alert("Error", "Please enter the OTP sent to your email.");
            return;
        }

        if (!formData.email) {
            Alert.alert("Error", "Email address is missing from form data.");
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

                Alert.alert("Success", "Account created successfully!");
                performRoleBasedRedirect(role, "/screens/PostProperty/PropertyDetails", setRoleSelector);
            } else {
                Alert.alert("Verification Failed", response.data.message || "Invalid OTP");
            }
        } catch (error) {
            console.error("API Error: /auth/verify-otp", error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || "Verification failed. Please try again.";
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (options = {}) => {
        const { onSuccess } = options;

        if (!formData.email || !formData.password) {
            Alert.alert("Error", "Please enter both Email/Number and Password");
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

                Alert.alert("Success", "Logged in successfully!");
                if (typeof onSuccess === "function") {
                    onSuccess(response.data);
                } else {
                    performRoleBasedRedirect(role, "/screens/PostProperty/PropertyDetails", setRoleSelector);
                }
            } else {
                Alert.alert("Login Failed", response.data.message || "Invalid credentials");
            }
        } catch (error) {
            console.error("API Error: /screens/PostProperty/Register", error.response?.data || error.message);

            const message = error.response?.data?.error || error.response?.data?.message || "Login failed. Please try again.";
            Alert.alert("Error", message);
        } finally {
            setLoading(false);
        }
    };

    return {
        step,
        setStep,
        formData,
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
    };
};
