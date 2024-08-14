import axios from "axios";
import { create } from "zustand";

// const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";
const API_URL = "http://localhost:3000/api/auth"
// axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    signup: async (data, type) => {
        set({ isLoading: true, error: null })
        try {
            const response = await axios.post(`${API_URL}/${type}`, data)
            set({ user: response.data.user, isAuthenticated: true, isLoading: false, error: null })
        } catch (error) {
            set({ error: error.response.data.message, isLoading: false })
            throw error;
        }
    },

    varifyEmail: async (code) => {
        set({ isLoading: true, error: null })
        try {
            const response = await axios.post(`${API_URL}/varify-email`, { code })
            set({ user: response.data.user, isAuthenticated: true, isLoading: false, error: null })
        } catch (error) {
            set({ error: error.response.data.message, isLoading: false })
            throw error;
        }
    }

}))