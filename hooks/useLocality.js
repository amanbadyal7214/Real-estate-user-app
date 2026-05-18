import { useState, useCallback } from "react";
import api from "../app/api";

const localityNameCache = new Map();

const isObjectId = (value) => typeof value === "string" && /^[a-f0-9]{24}$/i.test(value.trim());

export const useLocality = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const resolveLocalityName = useCallback(async (locality) => {
        if (!locality || !isObjectId(locality)) {
            return locality;
        }

        const cacheKey = locality.trim();
        if (localityNameCache.has(cacheKey)) {
            return localityNameCache.get(cacheKey);
        }

        try {
            const response = await api.get(`/localities/${cacheKey}`);
            const localityName = response.data?.data?.name || response.data?.data?.label || cacheKey;
            localityNameCache.set(cacheKey, localityName);
            return localityName;
        } catch (err) {
            console.error(`Error resolving locality ${locality}:`, err);
            return locality; // Fallback to ID on error
        }
    }, []);

    const resolveLocalities = useCallback(async (properties) => {
        setLoading(true);
        try {
            const enrichedProperties = await Promise.all(properties.map(async (property) => {
                if (property.locality && isObjectId(property.locality)) {
                    const name = await resolveLocalityName(property.locality);
                    return { ...property, localityName: name };
                }
                return { ...property, localityName: property.locality };
            }));
            return enrichedProperties;
        } catch (err) {
            setError(err.message);
            return properties;
        } finally {
            setLoading(false);
        }
    }, [resolveLocalityName]);

    return {
        resolveLocalityName,
        resolveLocalities,
        loading,
        error
    };
};
