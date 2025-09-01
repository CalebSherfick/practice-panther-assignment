import axios from 'axios';
import type { LoginRequest, SignupRequest, AuthResponse, User } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5206/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      return { token, user };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(error.response.data?.message || 'Login failed');
        } else if (error.request) {
          throw new Error('Connection failed');
        }
      }
      throw new Error('Login failed');
    }
  },

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/signup', userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      return { token, user };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(error.response.data?.message || 'Signup failed');
        } else if (error.request) {
          throw new Error('Connection failed');
        }
      }
      throw new Error('Signup failed');
    }
  },

  async getMe(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
