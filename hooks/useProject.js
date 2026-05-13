import { useState } from "react";
import api from "../app/api";

export const useProject = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProjects = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/projects", { params });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch projects";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectById = async (id) => {
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
    };

    const fetchDevelopers = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/developers", { params });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch developers";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        fetchProjects,
        fetchProjectById,
        fetchDevelopers,
        loading,
        error
    };
};
