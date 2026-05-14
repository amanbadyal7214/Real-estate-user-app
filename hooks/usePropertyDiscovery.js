import { useState } from "react";
import api from "../app/api";

export const usePropertyDiscovery = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Find properties by various location parameters
     * @param {Object} params - { city, locality, pincode, projectName, state, country, page, limit }
     */
    const findPropertiesByLocation = async (params) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/properties/find/location", { params });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to find properties";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch high demand properties (sorted by view count)
     * @param {Object} params - { limit }
     */
    const fetchHighDemandProperties = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/properties/find/high-demand", { params });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch high demand properties";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch unique profiles of sellers in a specific location
     * @param {Object} params - { city, locality, pincode, projectName }
     */
    const fetchSellersByLocation = async (params) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/properties/find/sellers-by-location", { params });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch sellers";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch better priced properties based on viewed properties or location
     * @param {Object} params - { city, locality, pincode, limit, basedOnViewed: boolean }
     */
    const fetchBetterPricedProperties = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/properties?PriceAscending=true");
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch better priced properties";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        findPropertiesByLocation,
        fetchHighDemandProperties,
        fetchSellersByLocation,
        fetchBetterPricedProperties,
        loading,
        error
    };
};
