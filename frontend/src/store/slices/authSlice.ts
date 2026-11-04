import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginCredentials, SignupCredentials, AuthResponse } from '../../types/auth.types';
import { authService } from '../../api/auth.service';

// 1. Read existing token and user from localStorage on boot
const savedToken = localStorage.getItem('token');
const savedUser = localStorage.getItem('user');

const initialState: AuthState = {
  token: savedToken || null,
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: Boolean(savedToken),
  loading: false,
  error: null,
};

// 2. Async thunk for logging in
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const res = await authService.login({
        email: credentials.email,
        password: credentials.password || '',
      });
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message || 'Login failed');
    }
  }
);

// 3. Async thunk for signing up
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (credentials: SignupCredentials, { rejectWithValue }) => {
    try {
      const res = await authService.signup({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password || '',
      });
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message || 'Signup failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
