import { useState, useCallback } from "react";
import api from "../app/api";

export const useUserActivity = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activitySummary, setActivitySummary] = useState(null);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [contactedProperties, setContactedProperties] = useState([]);
    const [wishlistProperties, setWishlistProperties] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);

    const fetchActivitySummary = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/user/activity/summary");
            if (response.data.success) {
                setActivitySummary(response.data.data);
            }
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to fetch activity summary";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRecentlyViewed = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/properties/recently-viewed");
            if (response.data.success) {
                setRecentlyViewed(response.data.data || []);
            }
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch recently viewed";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchContactedProperties = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/properties/contacted");
            if (response.data.success) {
                setContactedProperties(response.data.data || []);
            }
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch contacted properties";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchWishlistProperties = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/properties/wishlist");
            if (response.data.success) {
                setWishlistProperties(response.data.data || []);
            }
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch wishlist properties";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRecentSearches = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/search/recent");
            if (response.data.success) {
                setRecentSearches(response.data.data || []);
            }
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch recent searches";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSavedSearches = useCallback(async () => {
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
    }, []);

    const saveSearch = useCallback(async (payload) => {
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
    }, []);

    return {
        fetchActivitySummary,
        activitySummary,
        fetchRecentlyViewed,
        recentlyViewed,
        fetchContactedProperties,
        contactedProperties,
        fetchWishlistProperties,
        wishlistProperties,
        fetchRecentSearches,
        recentSearches,
        fetchSavedSearches,
        saveSearch,
        loading,
        error
    };
};

