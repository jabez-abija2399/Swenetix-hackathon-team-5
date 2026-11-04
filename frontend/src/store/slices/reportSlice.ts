import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
  Report,
  ReportFormData,
  ReportFilterParams,
} from '../../types/report.types';
import * as reportService from '../../api/reportService';

interface ReportsState {
  items: Report[];
  selectedReport: Report | null;
  matches: Report[];
  loading: boolean;
  matchesLoading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  items: [],
  selectedReport: null,
  matches: [],
  loading: false,
  matchesLoading: false,
  error: null,
};

const getErrorMessage = (err: any, fallback: string): string =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  fallback;

// Async Thunks
export const fetchReports = createAsyncThunk(
  'reports/fetchAll',
  async (filters: ReportFilterParams = {}, { rejectWithValue }) => {
    try {
      return await reportService.getAllReports(filters);
    } catch (err: any) {
      return rejectWithValue(getErrorMessage(err, 'Failed to fetch reports'));
    }
  }
);

export const searchReports = createAsyncThunk(
  'reports/search',
  async (query: string, { rejectWithValue }) => {
    try {
      return await reportService.searchReports(query);
    } catch (err: any) {
      return rejectWithValue(getErrorMessage(err, 'Failed to search reports'));
    }
  }
);

export const fetchReportById = createAsyncThunk(
  'reports/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await reportService.getReportById(id);
    } catch (err: any) {
      return rejectWithValue(getErrorMessage(err, 'Report not found'));
    }
  }
);

export const fetchReportMatches = createAsyncThunk(
  'reports/fetchMatches',
  async (id: string, { rejectWithValue }) => {
    try {
      return await reportService.getReportMatches(id);
    } catch (err: any) {
      return rejectWithValue(getErrorMessage(err, 'Failed to load matches'));
    }
  }
);

export const addReport = createAsyncThunk(
  'reports/create',
  async (data: ReportFormData, { rejectWithValue }) => {
    try {
      return await reportService.createReport(data);
    } catch (err: any) {
      return rejectWithValue(getErrorMessage(err, 'Failed to create report'));
    }
  }
);

export const removeReport = createAsyncThunk(
  'reports/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await reportService.deleteReport(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(getErrorMessage(err, 'Failed to delete report'));
    }
  }
);

export const updateExistingReport = createAsyncThunk(
  'reports/update',
  async ({ id, data }: { id: string; data: ReportFormData }, { rejectWithValue }) => {
    try {
      return await reportService.updateReport(id, data);
    } catch (err: any) {
      return rejectWithValue(getErrorMessage(err, 'Failed to update report'));
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearSelectedReport: (state) => {
      state.selectedReport = null;
    },
    clearMatches: (state) => {
      state.matches = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action: PayloadAction<Report[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Search
      .addCase(searchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchReports.fulfilled, (state, action: PayloadAction<Report[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(searchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch by ID
      .addCase(fetchReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportById.fulfilled, (state, action: PayloadAction<Report>) => {
        state.loading = false;
        state.selectedReport = action.payload;
      })
      .addCase(fetchReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch matches
      .addCase(fetchReportMatches.pending, (state) => {
        state.matchesLoading = true;
      })
      .addCase(fetchReportMatches.fulfilled, (state, action: PayloadAction<Report[]>) => {
        state.matchesLoading = false;
        state.matches = action.payload;
      })
      .addCase(fetchReportMatches.rejected, (state) => {
        state.matchesLoading = false;
        state.matches = [];
      })

      // Add Report
      .addCase(addReport.fulfilled, (state, action: PayloadAction<Report>) => {
        state.items.unshift(action.payload);
      })

      // Delete Report
      .addCase(removeReport.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        if (state.selectedReport?._id === action.payload) {
          state.selectedReport = null;
        }
      })

      // Update Report
      .addCase(updateExistingReport.fulfilled, (state, action: PayloadAction<Report>) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedReport?._id === action.payload._id) {
          state.selectedReport = action.payload;
        }
      });
  },
});

export const { clearSelectedReport, clearMatches } = reportsSlice.actions;
export default reportsSlice.reducer;
