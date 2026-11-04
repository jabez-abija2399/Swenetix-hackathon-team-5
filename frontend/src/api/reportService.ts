import axiosInstance from './axiosInstance';
import { mockReportService } from '../mocks';
import type {
  Report,
  ReportFormData,
  ReportFilterParams,
} from '../types/report.types';

const USE_MOCK = process.env.REACT_APP_USE_MOCK_API === 'true';

const cleanParams = (params: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  );

const unwrapReport = (payload: any): Report =>
  payload?.report ?? payload?.data ?? payload;

const unwrapReports = (payload: any): Report[] => {
  if (Array.isArray(payload)) return payload;
  return payload?.reports ?? payload?.items ?? payload?.data ?? [];
};

export const getAllReports = async (
  filters: ReportFilterParams = {}
): Promise<Report[]> => {
  if (USE_MOCK) {
    const reports = await mockReportService.getAll();
    const { search, ...query } = filters;
    let result = reports;
    if (query.type) result = result.filter((r) => r.type === query.type);
    if (query.status) result = result.filter((r) => r.status === query.status);
    if (query.category) result = result.filter((r) => r.category === query.category);
    if (query.location) {
      const loc = query.location.toLowerCase();
      result = result.filter((r) => r.location.toLowerCase().includes(loc));
    }
    if (query.sort === 'oldest') result = [...result].reverse();
    return result;
  }
  const { search, ...query } = filters;
  const res = await axiosInstance.get('/reports', {
    params: cleanParams(query),
  });
  return unwrapReports(res.data);
};

export const getReportById = async (id: string): Promise<Report> => {
  if (USE_MOCK) {
    return mockReportService.getById(id);
  }
  const res = await axiosInstance.get(`/reports/${id}`);
  return unwrapReport(res.data);
};

export const createReport = async (data: ReportFormData): Promise<Report> => {
  if (USE_MOCK) {
    return mockReportService.create(data as any);
  }
  const res = await axiosInstance.post('/reports', data);
  return unwrapReport(res.data);
};

export const updateReport = async (
  id: string,
  data: ReportFormData
): Promise<Report> => {
  if (USE_MOCK) {
    return mockReportService.update(id, data as any);
  }
  const res = await axiosInstance.put(`/reports/${id}`, data);
  return unwrapReport(res.data);
};

export const deleteReport = async (id: string): Promise<void> => {
  if (USE_MOCK) {
    return mockReportService.delete(id);
  }
  await axiosInstance.delete(`/reports/${id}`);
};

export const searchReports = async (q: string): Promise<Report[]> => {
  if (USE_MOCK) {
    return mockReportService.search(q);
  }
  const res = await axiosInstance.get('/reports/search', { params: { q } });
  return unwrapReports(res.data);
};

export const getReportMatches = async (id: string): Promise<Report[]> => {
  if (USE_MOCK) {
    return [];
  }
  const res = await axiosInstance.get(`/reports/${id}/matches`);
  return unwrapReports(res.data);
};
