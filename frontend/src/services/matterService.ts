import axios from 'axios';
import type { 
  Matter, 
  CreateMatterRequest, 
  UpdateMatterRequest
} from '../types/matter';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5206/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const matterService = {
  // Get all matters for a customer
  async getMatters(customerId: string): Promise<Matter[]> {
    try {
      const response = await api.get(`/customers/${customerId}/matters`);
      return response.data;
    } catch (error) {
      console.error('Error fetching matters:', error);
      throw error;
    }
  },

  async getMatter(customerId: string, matterId: string): Promise<Matter> {
    try {
      const response = await api.get(`/customers/${customerId}/matters/${matterId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching matter:', error);
      throw error;
    }
  },

  async createMatter(customerId: string, matterData: CreateMatterRequest): Promise<Matter> {
    try {
      const response = await api.post(`/customers/${customerId}/matters`, matterData);
      return response.data;
    } catch (error) {
      console.error('Error creating matter:', error);
      throw error;
    }
  },

  async updateMatter(customerId: string, matterId: string, matterData: UpdateMatterRequest): Promise<Matter> {
    try {
      const response = await api.put(`/customers/${customerId}/matters/${matterId}`, matterData);
      return response.data;
    } catch (error) {
      console.error('Error updating matter:', error);
      throw error;
    }
  },

  async deleteMatter(customerId: string, matterId: string): Promise<void> {
    try {
      await api.delete(`/customers/${customerId}/matters/${matterId}`);
    } catch (error) {
      console.error('Error deleting matter:', error);
      throw error;
    }
  }
};
