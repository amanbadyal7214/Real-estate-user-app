import { useState } from "react";
import api from "../app/api";

export const useCalculator = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const calculateAffordability = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post("/calculators/affordability", payload);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Affordability calculation failed";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const calculateEligibility = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post("/calculators/eligibility", payload);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Eligibility calculation failed";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const calculateEmiBreakdown = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post("/calculators/emi-breakdown", payload);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "EMI calculation failed";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        calculateAffordability,
        calculateEligibility,
        calculateEmiBreakdown,
        loading,
        error
    };
};
