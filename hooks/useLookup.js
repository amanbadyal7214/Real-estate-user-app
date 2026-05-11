import { useState } from "react";
import api from "../app/api";

export const useLookup = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [lookups, setLookups] = useState({
        propertyTypes: [],
        categories: [],
        subPropertyTypes: [],
        measurementUnits: [],
        furnishingStatus: [],
        amenities: [],
        constructionStatus: [],
        possessionStatus: [],
        ownershipTypes: [],
        zoneTypes: [],
        locationHubs: [],
        facingDirections: [],
    });

    const fetchLookups = async () => {
        setLoading(true);
        setError(null);
        try {
            const endpoints = {
                propertyTypes: "/property-types",
                categories: "/categories",
                subPropertyTypes: "/sub-property-types",
                measurementUnits: "/measurement-units",
                furnishingStatus: "/furnishing-status",
                amenities: "/amenities",
                constructionStatus: "/construction-status",
                possessionStatus: "/possession-status",
                ownershipTypes: "/ownership-types",
                zoneTypes: "/zone-types",
                locationHubs: "/location-hubs",
                facingDirections: "/facing-directions",
            };

            const keys = Object.keys(endpoints);
            const promises = keys.map(key => api.get(endpoints[key]));

            const results = await Promise.all(promises);
            
            const newData = {};
            results.forEach((response, index) => {
                const key = keys[index];
                if (response.data && response.data.success) {
                    newData[key] = response.data.data;
                } else {
                    newData[key] = [];
                }
            });

            setLookups(prev => ({ ...prev, ...newData }));
        } catch (err) {
            console.error("Error fetching lookup data:", err);
            setError(err.message || "Failed to fetch lookup data");
        } finally {
            setLoading(false);
        }
    };

    // Helper to fetch a single lookup if needed
    const fetchSingleLookup = async (entity) => {
        const endpoints = {
            propertyTypes: "/property-types",
            categories: "/categories",
            subPropertyTypes: "/sub-property-types",
            measurementUnits: "/measurement-units",
            furnishingStatus: "/furnishing-status",
            amenities: "/amenities",
            constructionStatus: "/construction-status",
            possessionStatus: "/possession-status",
            ownershipTypes: "/ownership-types",
            zoneTypes: "/zone-types",
            locationHubs: "/location-hubs",
            facingDirections: "/facing-directions",
        };

        if (!endpoints[entity]) return;

        try {
            const response = await api.get(endpoints[entity]);
            if (response.data && response.data.success) {
                setLookups(prev => ({ ...prev, [entity]: response.data.data }));
            }
        } catch (err) {
            console.error(`Error fetching ${entity}:`, err);
        }
    };

    return {
        ...lookups,
        loading,
        error,
        fetchLookups,
        fetchSingleLookup
    };
};
