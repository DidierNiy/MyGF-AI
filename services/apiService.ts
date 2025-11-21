
import axios from 'axios';
import type { User, Listing, Tenant, MaintenanceRequest, Lead } from '../types';

const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.baseURL + config.url,
        hasToken: !!token,
        headers: config.headers
    });
    return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('API Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

// Auth Service
export const authService = {
    register: async (userData: { name: string; email: string; password: string; phone: string }) => {
        return api.post('/auth/register', userData);
    },
    verify: async (data: { email: string; otp: string }) => {
        return api.post('/auth/verify', data);
    },
    setupAccount: async (data: { role: string; plan: string }, token: string) => {
        return api.put('/auth/setup', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    signup: async (userData: any) => {
        return api.post('/auth/signup', userData);
    },
    login: async (credentials: { email: string; password: string }) => {
        return api.post('/auth/login', credentials);
    },
    googleSignIn: async (data: { credential: string }) => {
        return api.post('/auth/google', data);
    },
    getMe: async () => {
        return api.get('/auth/me');
    },
};

// User Service
export const userService = {
    getTenants: async () => {
        return api.get('/users/tenants');
    },
    inviteTenant: async (tenantData: any) => {
        return api.post('/users/invite-tenant', tenantData);
    },
    updateProfile: async (userId: string, updates: Partial<User>) => {
        return api.put(`/users/${userId}`, updates);
    },
};

// Property Service
export const propertyService = {
    getProperties: async () => {
        return api.get('/properties');
    },
    createProperty: async (propertyData: any) => {
        console.log('apiService.createProperty called with:', propertyData);
        const formData = new FormData();

        // Append text fields
        Object.keys(propertyData).forEach(key => {
            if (key !== 'images') {
                formData.append(key, propertyData[key]);
            }
        });

        // Append images
        if (propertyData.images && propertyData.images.length > 0) {
            console.log(`Appending ${propertyData.images.length} images`);
            propertyData.images.forEach((image: File) => {
                formData.append('imageUrls', image);
            });
        } else {
            console.warn('No images found in propertyData');
        }

        console.log('Sending FormData to /properties');
        return api.post('/properties', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },
    updateProperty: async (propertyId: string, updates: Partial<Omit<Listing, 'id' | 'imageUrls'>>) => {
        return api.put(`/properties/${propertyId}`, updates);
    },
    deleteProperty: async (propertyId: string) => {
        return api.delete(`/properties/${propertyId}`);
    },
};

// Maintenance Service
export const maintenanceService = {
    getRequests: async () => {
        return api.get('/maintenance');
    },
    createRequest: async (requestData: { description: string }) => {
        return api.post('/maintenance', requestData);
    },
};

// Lead Service
export const leadService = {
    getLeads: async (filters?: { status?: string; dealType?: string }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.dealType) params.append('dealType', filters.dealType);

        return api.get(`/leads?${params.toString()}`);
    },
    getLeadById: async (leadId: string) => {
        return api.get(`/leads/${leadId}`);
    },
    updateLead: async (leadId: string, updates: { status?: string; notes?: string }) => {
        return api.put(`/leads/${leadId}`, updates);
    },
    deleteLead: async (leadId: string) => {
        return api.delete(`/leads/${leadId}`);
    },
    getLeadStats: async () => {
        return api.get('/leads/stats');
    },
};

export default api;
