import { useState } from "react";
import api from "../app/api";

const localityNameCache = new Map();

const isObjectId = (value) => typeof value === "string" && /^[a-f0-9]{24}$/i.test(value.trim());

export const useLocalityAveragePrice = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const resolveLocalityName = async (locality) => {
        if (!locality || !isObjectId(locality)) {
            return locality;
        }

        const cacheKey = locality.trim();
        if (localityNameCache.has(cacheKey)) {
            return localityNameCache.get(cacheKey);
        }

        const response = await api.get(`/localities/${cacheKey}`);
        const localityName = response.data?.data?.name || response.data?.data?.label || cacheKey;
        localityNameCache.set(cacheKey, localityName);
        return localityName;
    };

    const fetchAveragePriceByCity = async (city) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/localities/average-price", {
                params: { city }
            });
            const payload = response.data;

            const enrichedData = await Promise.all((Array.isArray(payload.data) ? payload.data : []).map(async (item) => {
                try {
                    return {
                        ...item,
                        localityName: await resolveLocalityName(item.locality),
                    };
                } catch (_lookupError) {
                    return {
                        ...item,
                        localityName: item.locality,
                    };
                }
            }));

            return {
                ...payload,
                data: enrichedData,
            };
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to fetch locality prices";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        fetchAveragePriceByCity,
        loading,
        error
    };
};