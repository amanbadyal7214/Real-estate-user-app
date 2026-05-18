import { useEffect, useState } from "react";
import api from "../app/api";

export const useProjectDetails = (projectId) => {
    const [projectData, setProjectData] = useState(null);
    const [priceInsights, setPriceInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (!projectId) {
                setError("Project ID is required");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                setPriceInsights(null);

                // Try to fetch as project first
                try {
                    const projectResponse = await api.get(`/projects/${projectId}`);
                    if (projectResponse.data?.success && projectResponse.data?.data) {
                        setProjectData(projectResponse.data.data);
                        try {
                            const priceResponse = await api.get(`/projects/${projectId}/average-price`);
                            if (priceResponse.data?.success && priceResponse.data?.data) {
                                setPriceInsights(priceResponse.data.data);
                            }
                        } catch (priceErr) {
                            console.warn("Average price API Error:", priceErr?.response?.data || priceErr.message);
                        }
                        return;
                    } else if (projectResponse.data?.data) {
                        setProjectData(projectResponse.data.data);
                        try {
                            const priceResponse = await api.get(`/projects/${projectId}/average-price`);
                            if (priceResponse.data?.success && priceResponse.data?.data) {
                                setPriceInsights(priceResponse.data.data);
                            }
                        } catch (priceErr) {
                            console.warn("Average price API Error:", priceErr?.response?.data || priceErr.message);
                        }
                        return;
                    }
                } catch (_projectErr) {
                    console.log("Not a project, trying as property...");
                    // If project fetch fails, try as property
                    const propertyResponse = await api.get(`/properties/${projectId}`);
                    if (propertyResponse.data?.success && propertyResponse.data?.data) {
                        setProjectData(propertyResponse.data.data);
                        return;
                    } else if (propertyResponse.data?.data) {
                        setProjectData(propertyResponse.data.data);
                        return;
                    } else if (propertyResponse.data) {
                        setProjectData(propertyResponse.data);
                        return;
                    }
                }

                throw new Error("Invalid API response");
            } catch (err) {
                const errorMessage = err.response?.data?.error || err.message || "Failed to fetch details";
                console.error("Error fetching project/property details:", errorMessage);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    const getDisplayValue = (value) => {
        if (!value) return '';
        if (typeof value === 'string' || typeof value === 'number') return String(value);
        return value.label || value.name || value.title || value.value || value.cityName || value.stateName || value.districtName || '';
    };

    // Extract commonly used data - handle both project and property structures
    const location = projectData
        ? [
            getDisplayValue(projectData.district),
            getDisplayValue(projectData.city),
            getDisplayValue(projectData.state)
        ].filter(Boolean).join(', ')
        : '';
    const builderName = projectData?.builder?.name || projectData?.developer || projectData?.sellerName || "N/A";
    const possessionDate = formatDate(projectData?.completionDate || projectData?.possessionDate);
    const startDate = formatDate(projectData?.startDate);
    const images = projectData?.media?.map(m => m.fileUrl || m) || projectData?.images || [];
    const brochureUrl = projectData?.brochureUrl
        || projectData?.brochure
        || projectData?.documents?.find((document) => document?.fileUrl || document?.url)?.fileUrl
        || projectData?.documents?.find((document) => document?.fileUrl || document?.url)?.url
        || projectData?.files?.find((file) => file?.fileUrl || file?.url)?.fileUrl
        || projectData?.files?.find((file) => file?.fileUrl || file?.url)?.url
        || null;
    const brochureImages = images.slice(0, 3);
    const brochurePages = projectData?.brochurePages || projectData?.documentCount || images.length || 30;

    return {
        projectData,
        loading,
        error,
        images,
        brochureUrl,
        brochureImages,
        brochurePages,
        location,
        builderName,
        possessionDate,
        startDate,
        priceInsights,
        averagePricePerSqFt: priceInsights?.averagePricePerSqFt ?? null,
        minPricePerSqFt: priceInsights?.minPricePerSqFt ?? null,
        maxPricePerSqFt: priceInsights?.maxPricePerSqFt ?? null,
        totalProperties: priceInsights?.totalProperties ?? 0,
        formatDate
    };
};
