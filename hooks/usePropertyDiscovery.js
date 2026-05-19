import { useCallback, useState } from "react";
import api from "../app/api";

// Ensure we only send primitive params to the server. Nested objects may serialize
// into query parameters like `foo[$options]=...` which some backends reject.
const sanitizeParams = (params = {}) => {
    const out = {};
    Object.keys(params || {}).forEach((k) => {
        const v = params[k];
        if (v === undefined) return;
        if (v === null) {
            out[k] = '';
        } else if (typeof v === 'object') {
            try {
                out[k] = JSON.stringify(v);
            } catch (e) {
                out[k] = String(v);
            }
        } else {
            out[k] = v;
        }
    });
    return out;
};

export const usePropertyDiscovery = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Find properties by various location parameters
     * @param {Object} params - { city, locality, pincode, projectName, state, country, page, limit }
     */
    const findPropertiesByLocation = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const safeParams = sanitizeParams(params);
            const response = await api.get("/properties/city", { params: safeParams });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to find properties";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * General properties fetch (supports queries like `?locality=sector 71`)
     * @param {Object} params - { city, locality, pincode, limit, page, lookingFor, PriceAscending }
     */
    const fetchProperties = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const safeParams = sanitizeParams(params);
            const response = await api.get("/properties", { params: safeParams });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to fetch properties";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch high demand properties (sorted by view count)
     * @param {Object} params - { limit }
     */
    const fetchHighDemandProperties = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const safeParams = sanitizeParams(params);
            // Do not send `locality` for this endpoint per UI requirement
            if ('locality' in safeParams) delete safeParams.locality;
            const response = await api.get("/properties/find/high-demand", { params: safeParams });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to fetch high demand properties";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch unique profiles of sellers in a specific location
     * @param {Object} params - { city, locality, pincode, projectName }
     */
    const fetchSellersByLocation = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const safeParams = sanitizeParams(params);
            // Do not send `locality` for this endpoint per UI requirement
            if ('locality' in safeParams) delete safeParams.locality;
            const response = await api.get("/properties/find/sellers-by-location", { params: safeParams });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to fetch sellers";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch better priced properties based on viewed properties or location
     * @param {Object} params - { city, locality, pincode, limit, lookingFor, PriceAscending }
     */
    const fetchBetterPricedProperties = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const safeParams = sanitizeParams(params);
            const response = await api.get("/properties/city", { params: safeParams });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to fetch better priced properties";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch a single property by id
     * @param {string} propertyId
     */
    const fetchPropertyById = useCallback(async (propertyId) => {
        if (!propertyId) {
            throw new Error("Property ID is required");
        }

        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/properties/${propertyId}`);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to fetch property";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch city-wide property statistics (min/max price, counts etc)
     * @param {Object} params - { city }
     */
    const fetchCityStats = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const safeParams = sanitizeParams(params);
            const response = await api.get("/properties/city/stats", { params: safeParams });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to fetch city stats";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        findPropertiesByLocation,
        fetchHighDemandProperties,
        fetchSellersByLocation,
        fetchBetterPricedProperties,
        fetchPropertyById,
        fetchProperties,
        fetchCityStats,
        loading,
        error
    };
};
