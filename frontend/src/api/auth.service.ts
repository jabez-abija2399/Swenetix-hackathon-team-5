import axiosInstance from './axiosInstance';
import { mockAuth } from '../mocks';

const USE_MOCK = process.env.REACT_APP_USE_MOCK_API === 'true';

export type AuthCredentials = { email: string; password: string };
export type SignupData = { name: string; email: string; password: string };
export type AuthResponse = { user: { _id: string; name: string; email: string }; token: string };

export const authService = {
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    if (USE_MOCK) {
      return mockAuth.login(credentials);
    }
    const res = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    return res.data;
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    if (USE_MOCK) {
      return mockAuth.signup(data);
    }
    const res = await axiosInstance.post<AuthResponse>('/auth/signup', data);
    return res.data;
  },
};
