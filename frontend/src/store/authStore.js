import { create } from "zustand";
import axios from "axios";

const API_URI = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set)=>({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,
    signup: async(name, email, password)=>{
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URI}/signup`, {name, email, password});
            set({
                user: response.data.user, 
                isAuthenticated: true, 
                isLoading: false
            });
        } catch (error) {
            console.log(error.response.data.message);
            set({error: error.response.data.message || "Error in signing up", isLoading: false});
            throw error;
        }
    },
    login: async(email, password)=>{
        set({isLoading: true, error:null});
        try {
            const response = await axios.post(`${API_URI}/login`, {email, password});
            set({
                isAuthenticated: true, 
                user: response.data.user,
                error: null,
                isLoading: false
            });
        } catch (error) {
            console.log(error.response.data.message);
            set({error: error.response?.data?.message || "Error in logging in", isLoading: false});
            throw error;
        }
    },
    logout: async()=>{
        set({isLoading: true, error: null});
        await new Promise((resolve)=> setTimeout(resolve, 2000));
        try {
            const response = await axios.post(`${API_URI}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
        } catch (error) {
            console.log(error.response.data.message);
            set({error: error.response.data.message || "Error in signing up", isLoading: false});
            throw error;
        }
    },
    verifyEmail: async(code)=>{
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URI}/verify-email`, {code});
            set({user: response.data.user, isAuthenticated: true, isLoading: false});
            return response.data;
        } catch (error) {
            set({error: error.response.data.message || "Error verifying E-mail", isLoading: false});
            throw error;
        }
    },
    checkAuth: async()=>{
        await new Promise((resolve)=> setTimeout(resolve, 2000));
        set({isCheckingAuth: true, error: null});
        try {
            const response = await axios.get(`${API_URI}/check-auth`);
            set({user: response.data.user, isAuthenticated: true, isCheckingAuth: false});
        } catch (error) {
            set({error: null, isCheckingAuth: false, isAuthenticated: false});
        }
    },
    forgotPassword: async(email)=>{
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URI}/forgot-password`, {email});
            set({message: response.data.message, isLoading: false});
        } catch (error) {
            set({isLoading: false, error: error.response.data.message || "Error in sending reset password email"});
            throw error;
        }
    },
    resetPassword: async(token, password)=>{
        set({isLoading: true, error: null})
        try {
            const response = await axios.post(`${API_URI}/reset-password/${token}`, {password});
            set({message: response.data.message, isLoading: false})
        } catch (error) {
            set({isLoading: false, error: error.response.data.message || "Error in sending reset password email"});
            throw error;
        }
    }
}));
