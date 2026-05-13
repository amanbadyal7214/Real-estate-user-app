import { useState } from "react";
import api from "../app/api";

export const useInsights = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchInsights = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/insights", { params });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch insights";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        fetchInsights,
        loading,
        error
    };
};
