import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import api from "../app/api";
import { validatePasswordRules } from "../components/PasswordValidator";

// Required for the OAuth redirect to close the browser automatically
WebBrowser.maybeCompleteAuthSession();

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
    const hasRealtor = roleArray.includes('realtor');

    const activeRoles = [];
    if (hasBuyer) activeRoles.push('buyer');
    if (hasOwner) activeRoles.push('owner');
    if (hasBuilder) activeRoles.push('builder');
    if (hasRealtor) activeRoles.push('realtor');

    roleArray.forEach((r) => {
        if (!activeRoles.includes(r)) {
            activeRoles.push(r);
        }
    });

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
            if (hasRealtor) {
                buttons.push({
                    text: "Realtor Dashboard",
                    onPress: () => router.replace("/screens/PostProperty/MyProperties"),
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
    } else if (hasOwner || hasRealtor) {
        router.replace("/screens/PostProperty/MyProperties");
    } else if (hasBuyer) {
        if (defaultTarget === "/screens/PostProperty/PropertyDetails") {
            router.replace("/screens/PostProperty/Register");
        } else {
            router.replace("/screens/Buy/Buy");
        }
    } else {
        router.replace(defaultTarget || "/screens/Buy/Buy");
    }
};

export const extractResponseError = (data, defaultMessage = "Operation failed.") => {
    if (!data) return defaultMessage;
    if (typeof data === "string" && data.trim()) return data;
    if (data.message && typeof data.message === "string") return data.message;
    if (data.error && typeof data.error === "string") return data.error;
    if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors
            .map((e) => (typeof e === "string" ? e : e.msg || e.message || JSON.stringify(e)))
            .join(", ");
    }
    return defaultMessage;
};

export const extractApiError = (error, defaultMessage = "Something went wrong. Please try again.") => {
    if (!error) return defaultMessage;
    const data = error.response?.data;
    if (data) {
        return extractResponseError(data, defaultMessage);
    }
    if (error.message && typeof error.message === "string") return error.message;
    return defaultMessage;
};

export const useRegister = () => {
    const [loading, setLoading] = useState(false);

    // Google OAuth client IDs
    const GOOGLE_WEB_CLIENT_ID = "312477495308-8ldl1it97plfb19qok06h4nde71ib692.apps.googleusercontent.com";
    const GOOGLE_ANDROID_CLIENT_ID = "312477495308-rldc9onq3eooefknt50q6363qg6ks25q.apps.googleusercontent.com";
    // App scheme from app.json — used as the OAuth redirect URI
    const APP_SCHEME = "realestateuser";
    const [step, setStep] = useState(1); // 1: Phone Validation, 2: Details Form, 3: Email OTP Verification
    const [roleSelector, setRoleSelector] = useState({ visible: false, roles: [] });

    // Existing user flow states
    const [existingUserDetails, setExistingUserDetails] = useState(null);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);

    const [toast, setToast] = useState(null);
    const toastTimeoutRef = useRef(null);

    // Google signup state — tracks mid-flight Google auth that needs phone verification
    const [googleSignupState, setGoogleSignupState] = useState(null);
    // { idToken, googleUser: { name, email, photo } }
    const [googlePhoneOtpSent, setGooglePhoneOtpSent] = useState(false);

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
                showToast(extractResponseError(response.data, "Failed to send verification code."), "error");
            }
        } catch (error) {
            console.error("API Error: /auth/send-phone-otp (Send)", error.response?.data || error.message);
            const message = extractApiError(error, "Failed to send verification code.");
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
                showToast(extractResponseError(response.data, "Incorrect verification code."), "error");
                return false;
            }
        } catch (error) {
            console.error("API Error: /auth/verify-phone-otp (Verify)", error.response?.data || error.message);
            const message = extractApiError(error, "Verification failed. Please try again.");
            showToast(message, "error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Account Registration (Backend OTP)
    const handleRegister = async (options = {}) => {
        const { onSuccess } = options;

        const pwdRules = validatePasswordRules(formData.password);
        if (!pwdRules.isValid) {
            showToast("Password must be 8+ chars with 1 capital letter, 1 number & 1 special char.", "error");
            return;
        }

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
                showToast(response.data.message || "OTP sent to your email to complete registration", "success");
                if (response.data.verifyEmail || response.data.success) {
                    setStep(3); // Proceed to Email OTP verification
                } else {
                    await handleLogin();
                }
            } else {
                // If success is false but no error thrown
                showToast(extractResponseError(response.data, "Something went wrong."), "warning");
                // Removed setStep(1) to let user stay on the form
            }
        } catch (error) {
            console.error("API Error: /auth/register", error.response?.data || error.message);
            const message = extractApiError(error, "Registration failed. Please try again.");
            showToast(message, "error");

            // Temporary Workaround: Agar email fail ho raha hai but user create ho gaya ho (backend check)
            // Ya sirf debugging ke liye allow karna chahte hain to step 3 par bhej sakte hain
            if (message.includes("Email could not be sent")) {
                showToast("User created but email dispatch failed.", "warning");
                setStep(3);
            }
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Email OTP Verification
    const handleVerifyEmailOtp = async (options = {}) => {
        const { onSuccess, defaultTarget } = options;
        console.log("handleVerifyEmailOtp Debug:", {
            emailInFormData: formData.email,
            enteredOtp: emailOtp,
            step: step
        });

        if (!emailOtp) {
            showToast("Please enter the OTP sent to your email.", "error");
            return false;
        }

        if (!formData.email) {
            showToast("Email address is missing from form data.", "error");
            return false;
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

                showToast("Account verified successfully!", "success");
                if (typeof onSuccess === "function") {
                    onSuccess(response.data);
                } else {
                    performRoleBasedRedirect(role, defaultTarget || "/screens/PostProperty/PropertyDetails", setRoleSelector);
                }
                return true;
            } else {
                showToast(extractResponseError(response.data, "Invalid OTP"), "error");
                return false;
            }
        } catch (error) {
            console.error("API Error: /auth/verify-otp", error.response?.data || error.message);
            const errorMessage = extractApiError(error, "Verification failed. Please try again.");
            showToast(errorMessage, "error");
            return false;
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
                showToast(extractResponseError(response.data, "Invalid credentials"), "error");
            }
        } catch (error) {
            console.error("API Error: /screens/PostProperty/Register", error.response?.data || error.message);

            const message = extractApiError(error, "Login failed. Please try again.");
            showToast(message, "error");
        } finally {
            setLoading(false);
        }
    };

    // ─── Google Auth Flow (expo-web-browser — no extra package needed) ──────────

    // Ref to persist the onSuccess / defaultRole options across the async OAuth popup
    const googleOptionsRef = useRef({});

    /**
     * Called once we have an id_token from Google OAuth.
     * Sends it to POST /auth/google and handles existing vs new-user response.
     */
    const _processGoogleIdToken = async (idToken, googleUser) => {
        const { onSuccess, defaultRole = "buyer" } = googleOptionsRef.current;
        setLoading(true);
        try {
            console.log("API Request: POST /auth/google (initial)", { idToken: "[redacted]" });
            const response = await api.post("/auth/google", { idToken });
            console.log("API Response: /auth/google", response.data);

            if (response.data.success) {
                // ── Existing Google user – logged in directly ──
                const { token, role, user } = response.data;
                await Promise.all([
                    SecureStore.setItemAsync("token", token),
                    SecureStore.setItemAsync("userRole", typeof role === "string" ? role : JSON.stringify(role)),
                    SecureStore.setItemAsync("userData", JSON.stringify(user)),
                ]);
                showToast("Signed in with Google!", "success");
                if (typeof onSuccess === "function") {
                    onSuccess(response.data);
                } else {
                    performRoleBasedRedirect(role, "/screens/Buy/Buy", setRoleSelector);
                }
            } else if (response.data.isNewUser) {
                // ── New Google user – needs phone verification ──
                setGoogleSignupState({ idToken, googleUser, role: defaultRole });
                setFormData(prev => ({
                    ...prev,
                    name: googleUser?.name || prev.name,
                    email: googleUser?.email || prev.email,
                    role: defaultRole,
                    phone: "",
                }));
                showToast("Almost there! Verify your phone to complete sign-up.", "info");
            } else {
                showToast(extractResponseError(response.data, "Google sign-in failed."), "error");
            }
        } catch (error) {
            console.error("API Error: /auth/google", error.response?.data || error.message);
            showToast(extractApiError(error, "Google sign-in failed. Please try again."), "error");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Opens Google OAuth in a Chrome Custom Tab using expo-web-browser.
     * On redirect, parses id_token from the URL fragment and calls _processGoogleIdToken.
     *
     * Redirect URI registered in Google Cloud Console must be:
     *   https://auth.expo.io/@<expo-username>/REALESTATE-USER
     * OR for Android native:
     *   com.amanbadyal94.REALESTATEUSER:/oauth2redirect
     */
    const handleGoogleSignIn = async (options = {}) => {
        googleOptionsRef.current = options;
        const { defaultRole = "buyer" } = options;

        // Build Google OAuth 2.0 authorization URL
        const redirectUri = `https://auth.expo.io/@anonymous/${APP_SCHEME}`;
        const params = new URLSearchParams({
            client_id: GOOGLE_WEB_CLIENT_ID,
            redirect_uri: redirectUri,
            response_type: "token id_token",
            scope: "openid profile email",
            nonce: Math.random().toString(36).substring(2),
        });
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

        setLoading(true);
        try {
            const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
            console.log("Google OAuth result:", result?.type);

            if (result.type === "success" && result.url) {
                // id_token is in the URL fragment (#id_token=...)
                const fragment = result.url.split("#")[1] || "";
                const fragParams = new URLSearchParams(fragment);
                const idToken = fragParams.get("id_token");

                if (idToken) {
                    await _processGoogleIdToken(idToken, {});
                } else {
                    showToast("Google sign-in failed – no ID token received.", "error");
                }
            } else if (result.type === "cancel" || result.type === "dismiss") {
                // User closed the browser – silent
            } else {
                showToast("Google sign-in was cancelled.", "info");
            }
        } catch (error) {
            console.error("Google OAuth error:", error.message);
            showToast("Google sign-in failed. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Sends a phone OTP as part of the Google new-user registration flow.
     * Validates phone length first.
     */
    const sendGooglePhoneOtp = async () => {
        if (formData.phone.length !== 10) {
            showToast("Please enter a valid 10-digit phone number.", "error");
            return false;
        }
        setLoading(true);
        try {
            const payload = { phone: formData.phone };
            console.log("API Request: POST /auth/send-phone-otp (Google signup)", payload);
            const response = await api.post("/auth/send-phone-otp", payload);
            console.log("API Response: /auth/send-phone-otp (Google signup)", response.data);
            if (response.data.success) {
                setGooglePhoneOtpSent(true);
                showToast("OTP sent to your phone.", "success");
                return true;
            } else {
                showToast(extractResponseError(response.data, "Failed to send OTP."), "error");
                return false;
            }
        } catch (error) {
            console.error("API Error: /auth/send-phone-otp (Google signup)", error.response?.data || error.message);
            showToast(extractApiError(error, "Failed to send OTP."), "error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Step 2 of Google new-user flow:
     *  - POST /auth/verify-phone-otp  (validate the OTP entered by user)
     *  - POST /auth/google             (complete registration with phone + role)
     */
    const completeGoogleSignup = async (options = {}) => {
        const { enteredOtp, onSuccess } = options;

        if (!googleSignupState) {
            showToast("Google sign-in state lost. Please try again.", "error");
            return false;
        }

        if (!enteredOtp || enteredOtp.length !== 6) {
            showToast("Please enter the 6-digit OTP.", "error");
            return false;
        }

        if (formData.phone.length !== 10) {
            showToast("Please enter a valid 10-digit phone number.", "error");
            return false;
        }

        setLoading(true);
        try {
            // 1. Verify the phone OTP
            console.log("API Request: POST /auth/verify-phone-otp (Google signup verify)");
            const verifyRes = await api.post("/auth/verify-phone-otp", {
                phone: formData.phone,
                otp: enteredOtp.trim(),
            });
            console.log("API Response: /auth/verify-phone-otp (Google signup verify)", verifyRes.data);

            if (!verifyRes.data.success) {
                showToast(extractResponseError(verifyRes.data, "Incorrect OTP. Please try again."), "error");
                return false;
            }

            // 2. Complete Google signup
            const role = googleSignupState.role || formData.role || "buyer";
            const payload = {
                idToken: googleSignupState.idToken,
                phone: formData.phone,
                role,
            };
            console.log("API Request: POST /auth/google (complete signup)", { ...payload, idToken: "[redacted]" });
            const signupRes = await api.post("/auth/google", payload);
            console.log("API Response: /auth/google (complete signup)", signupRes.data);

            if (signupRes.data.success) {
                const { token, role: userRole, user } = signupRes.data;
                await Promise.all([
                    SecureStore.setItemAsync("token", token),
                    SecureStore.setItemAsync("userRole", typeof userRole === "string" ? userRole : JSON.stringify(userRole)),
                    SecureStore.setItemAsync("userData", JSON.stringify(user)),
                ]);
                setGoogleSignupState(null);
                setGooglePhoneOtpSent(false);
                showToast("Account created successfully!", "success");
                if (typeof onSuccess === "function") {
                    onSuccess(signupRes.data);
                } else {
                    performRoleBasedRedirect(userRole, "/screens/Buy/Buy", setRoleSelector);
                }
                return true;
            } else {
                showToast(extractResponseError(signupRes.data, "Failed to complete sign-up."), "error");
                return false;
            }
        } catch (error) {
            console.error("API Error: completeGoogleSignup", error.response?.data || error.message);
            showToast(extractApiError(error, "Sign-up failed. Please try again."), "error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    /** Resets the mid-flight Google signup state (user cancelled the modal) */
    const cancelGoogleSignup = () => {
        setGoogleSignupState(null);
        setGooglePhoneOtpSent(false);
        setFormData(prev => ({ ...prev, phone: "", name: "", email: "", role: "buyer" }));
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
        // Google auth
        handleGoogleSignIn,
        sendGooglePhoneOtp,
        completeGoogleSignup,
        cancelGoogleSignup,
        googleSignupState,
        googlePhoneOtpSent,
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
