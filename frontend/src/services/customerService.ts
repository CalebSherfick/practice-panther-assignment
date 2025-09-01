import axios from 'axios';
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../types/customer';

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

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    try {
      const response = await api.get('/customers');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(error.response.data?.message || 'Failed to fetch customers');
        } else if (error.request) {
          throw new Error('Connection failed');
        }
      }
      throw new Error('Failed to fetch customers');
    }
  },

  async getCustomer(customerId: string): Promise<Customer> {
    try {
      const response = await api.get(`/customers/${customerId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(error.response.data?.message || 'Failed to fetch customer');
        } else if (error.request) {
          throw new Error('Connection failed');
        }
      }
      throw new Error('Failed to fetch customer');
    }
  },

  async createCustomer(customerData: CreateCustomerRequest): Promise<Customer> {
    try {
      const response = await api.post('/customers', customerData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(error.response.data?.message || 'Failed to create customer');
        } else if (error.request) {
          throw new Error('Connection failed');
        }
      }
      throw new Error('Failed to create customer');
    }
  },

  async updateCustomer(customerId: string, customerData: UpdateCustomerRequest): Promise<Customer> {
    try {
      const response = await api.put(`/customers/${customerId}`, customerData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(error.response.data?.message || 'Failed to update customer');
        } else if (error.request) {
          throw new Error('Connection failed');
        }
      }
      throw new Error('Failed to update customer');
    }
  },

  async deleteCustomer(customerId: string): Promise<void> {
    try {
      await api.delete(`/customers/${customerId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(error.response.data?.message || 'Failed to delete customer');
        } else if (error.request) {
          throw new Error('Connection failed');
        }
      }
      throw new Error('Failed to delete customer');
    }
  },
};
