import { useState } from "react";
import api from "../app/api";

export const useUserActivity = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRecentlyViewed = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/properties/recently-viewed");
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch recently viewed";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedSearches = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/user/saved-searches");
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch saved searches";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const saveSearch = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post("/user/saved-searches", payload);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to save search";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        fetchRecentlyViewed,
        fetchSavedSearches,
        saveSearch,
        loading,
        error
    };
};
