import { useCallback, useState } from "react";
import api from "../app/api";

const enrichProjectsWithMedia = async (projectsArray) => {
    if (!Array.isArray(projectsArray)) return projectsArray;
    return Promise.all(
        projectsArray.map(async (project) => {
            try {
                const projectId = project._id || project.id;
                if (!projectId) return project;
                const mediaRes = await api.get(`/projects/${projectId}/media`);
                
                let mediaArray = [];
                if (mediaRes?.data) {
                    if (Array.isArray(mediaRes.data)) {
                        mediaArray = mediaRes.data;
                    } else if (Array.isArray(mediaRes.data?.data)) {
                        mediaArray = mediaRes.data.data;
                    } else if (Array.isArray(mediaRes.data?.media)) {
                        mediaArray = mediaRes.data.media;
                    }
                }

                const mediaUrls = mediaArray
                    .filter(m => m.fileUrl)
                    .map(m => m.fileUrl);
                
                return {
                    ...project,
                    media: mediaArray,
                    images: mediaUrls.length > 0 ? mediaUrls : (project.images || [])
                };
            } catch (e) {
                console.warn(`Failed to fetch media for project ${project._id || project.id}:`, e?.message);
            }
            return project;
        })
    );
};

const enrichResponseData = async (rawData) => {
    if (Array.isArray(rawData)) {
        return await enrichProjectsWithMedia(rawData);
    } else if (rawData && typeof rawData === 'object') {
        const keysToEnrich = ['data', 'projects', 'results'];
        const enrichedObj = { ...rawData };
        for (const key of keysToEnrich) {
            if (Array.isArray(rawData[key])) {
                enrichedObj[key] = await enrichProjectsWithMedia(rawData[key]);
            }
        }
        return enrichedObj;
    }
    return rawData;
};

export const useProject = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProjects = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/projects/city", { params });
            const enriched = await enrichResponseData(response.data);
            return enriched;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch projects";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchProjectById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/projects/${id}`);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch project details";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDevelopers = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/developers/top-builders", { params });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch developers";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDeveloperProjects = useCallback(async (developerId, params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/developers/${developerId}/projects`, { params });
            const enriched = await enrichResponseData(response.data);
            return enriched;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch developer projects";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        fetchProjects,
        fetchProjectById,
        fetchDevelopers,
        fetchDeveloperProjects,
        loading,
        error
    };
};
