import { useCallback, useState } from "react";
import api from "../app/api";

export const useBulkProperty = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Post multiple properties in bulk
     * POST /properties/bulk
     * @param {Object} bulkPayload - The bulk payload containing commonData and units/properties
     * @returns {Promise<Object>} The API response
     */
    const saveBulkProperties = useCallback(async (bulkPayload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post("/properties/bulk", bulkPayload);
            return response.data;
        } catch (err) {
            const errData = err.response?.data;
            const errorMessage =
                errData?.error ||
                errData?.message ||
                (Array.isArray(errData?.errors)
                    ? errData.errors.map((e) => (typeof e === "string" ? e : e.msg || e.message || JSON.stringify(e))).join(", ")
                    : null) ||
                err.message ||
                "Failed to save bulk properties";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        saveBulkProperties,
        loading,
        error
    };
};
