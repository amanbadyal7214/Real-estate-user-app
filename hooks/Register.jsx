import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Alert } from "react-native";
import api from "../app/api";

export const useRegister = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Phone Validation, 2: Details Form, 3: Email OTP Verification

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

    // Step 1: Phone Validation (Mock)
    const handlePhoneValidation = () => {
        if (formData.phone.length !== 10) {
            Alert.alert("Error", "Please enter a valid 10-digit phone number.");
            return;
        }
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setMockOtp(generatedOtp);
        
        // Show alert AFTER moving to step or with a small delay to ensure it doesn't block UI logic
        setTimeout(() => {
            Alert.alert("Phone Verification", `Your verification code is: ${generatedOtp}`);
        }, 100);
        
        // setStep(1) is redundant but ensures we are explicitly starting phone verification
    };

    const verifyMockOtp = () => {
        if (enteredMockOtp === mockOtp) {
            setStep(2); // Proceed to registration details
        } else {
            Alert.alert("Error", "Incorrect verification code.");
        }
    };

    // Step 2: Account Registration (Backend OTP)
    const handleRegister = async () => {
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
                Alert.alert("Success", response.data.message);
                setStep(3); // Proceed to Email OTP verification
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
                    SecureStore.setItemAsync("userRole", role),
                    SecureStore.setItemAsync("userData", JSON.stringify(user))
                ]);
                
                Alert.alert("Success", "Account created successfully!");
                router.replace("/screens/PostProperty/PropertyDetails"); // Redirect to post property flow
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

    const handleLogin = async () => {
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
                    SecureStore.setItemAsync("userRole", role),
                    SecureStore.setItemAsync("userData", JSON.stringify(user))
                ]);

                Alert.alert("Success", "Logged in successfully!");
                router.replace("/screens/PostProperty/PropertyDetails"); // Redirect to post property flow
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
    };
};
