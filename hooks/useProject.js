import { useCallback, useState } from "react";
import api from "../app/api";

export const useProject = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProjects = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/projects/all", { params });
            return response.data;
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
            return response.data;
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
