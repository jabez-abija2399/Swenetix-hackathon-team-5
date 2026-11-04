import { LostItemCategory } from '../types/report.types';

export type MockUser = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
};

export type MockReport = {
  _id: string;
  type: 'LOST' | 'FOUND';
  title: string;
  description: string;
  category: LostItemCategory;
  location: string;
  date: string;
  status: 'OPEN' | 'RESOLVED';
  reporter: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEYS = {
  USERS: 'swenetix_mock_users',
  REPORTS: 'swenetix_mock_reports',
} as const;

const seedUsers: MockUser[] = [
  {
    _id: 'mock_user_1',
    name: 'Admin User',
    email: 'admin@swenetix.com',
    password: 'password123',
    role: 'admin',
  },
  {
    _id: 'mock_user_2',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
  },
  {
    _id: 'mock_user_3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
  },
];

const seedReports: MockReport[] = [
  {
    _id: 'mock_report_1',
    type: 'LOST',
    title: 'Black Leather Wallet',
    description: 'Lost near the library entrance. Contains student ID and credit cards.',
    category: LostItemCategory.WalletsAndMoney,
    location: 'Library',
    date: '2025-09-18',
    status: 'OPEN',
    reporter: { _id: 'mock_user_2', name: 'John Doe', email: 'john@example.com' },
    createdAt: '2025-09-18T10:00:00Z',
    updatedAt: '2025-09-18T10:00:00Z',
  },
  {
    _id: 'mock_report_2',
    type: 'FOUND',
    title: 'Blue Water Bottle',
    description: 'Found in the cafeteria on a table near the window.',
    category: LostItemCategory.Other,
    location: 'Cafeteria',
    date: '2025-09-17',
    status: 'OPEN',
    reporter: { _id: 'mock_user_3', name: 'Jane Smith', email: 'jane@example.com' },
    createdAt: '2025-09-17T14:30:00Z',
    updatedAt: '2025-09-17T14:30:00Z',
  },
  {
    _id: 'mock_report_3',
    type: 'LOST',
    title: 'iPhone 14 Pro',
    description: 'Lost somewhere between Building A and Building B. Black case with a small scratch on the back.',
    category: LostItemCategory.Electronics,
    location: 'Building A',
    date: '2025-09-16',
    status: 'RESOLVED',
    reporter: { _id: 'mock_user_2', name: 'John Doe', email: 'john@example.com' },
    createdAt: '2025-09-16T09:15:00Z',
    updatedAt: '2025-09-18T08:00:00Z',
  },
  {
    _id: 'mock_report_4',
    type: 'FOUND',
    title: 'Set of Keys with Red Tag',
    description: 'Found on a bench near the gym entrance. Has 3 keys and a red tag.',
    category: LostItemCategory.Keys,
    location: 'Gym',
    date: '2025-09-19',
    status: 'OPEN',
    reporter: { _id: 'mock_user_3', name: 'Jane Smith', email: 'jane@example.com' },
    createdAt: '2025-09-19T07:45:00Z',
    updatedAt: '2025-09-19T07:45:00Z',
  },
  {
    _id: 'mock_report_5',
    type: 'LOST',
    title: 'Math Textbook',
    description: 'Lost in Lecture Hall 3. Has my name written inside the cover.',
    category: LostItemCategory.BooksAndSchoolItems,
    location: 'Lecture Hall 3',
    date: '2025-09-15',
    status: 'OPEN',
    reporter: { _id: 'mock_user_2', name: 'John Doe', email: 'john@example.com' },
    createdAt: '2025-09-15T11:20:00Z',
    updatedAt: '2025-09-15T11:20:00Z',
  },
];

function loadUsers(): MockUser[] {
  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fall through to seed
    }
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(seedUsers));
  return [...seedUsers];
}

function saveUsers(users: MockUser[]) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function loadReports(): MockReport[] {
  const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fall through to seed
    }
  }
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(seedReports));
  return [...seedReports];
}

function saveReports(reports: MockReport[]) {
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
}

let mockUsers = loadUsers();

function generateId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type AuthCredentials = { email: string; password: string };
export type SignupData = { name: string; email: string; password: string };
export type AuthResponse = { user: { _id: string; name: string; email: string }; token: string };

export const mockAuth = {
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    await delay(350);
    const user = mockUsers.find((u) => u.email === credentials.email);
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid email or password');
    }
    return {
      user: { _id: user._id, name: user.name, email: user.email },
      token: `mock-jwt-${user._id}-${Date.now()}`,
    };
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    await delay(400);
    const existing = mockUsers.find((u) => u.email === data.email);
    if (existing) {
      throw new Error('An account with this email already exists');
    }
    const newUser: MockUser = {
      _id: generateId('mock_user'),
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'user',
    };
    mockUsers = [...mockUsers, newUser];
    saveUsers(mockUsers);
    return {
      user: { _id: newUser._id, name: newUser.name, email: newUser.email },
      token: `mock-jwt-${newUser._id}-${Date.now()}`,
    };
  },
};

export const mockReportService = {
  getAll: async (): Promise<MockReport[]> => {
    await delay(200);
    return [...loadReports()];
  },

  getById: async (id: string): Promise<MockReport> => {
    await delay(150);
    const report = loadReports().find((r) => r._id === id);
    if (!report) throw new Error('Report not found');
    return { ...report };
  },

  create: async (data: {
    type: 'LOST' | 'FOUND';
    title: string;
    description: string;
    category: LostItemCategory;
    location: string;
    date: string;
    reporter: { _id: string; name: string; email: string };
  }): Promise<MockReport> => {
    await delay(300);
    const reports = loadReports();
    const newReport: MockReport = {
      _id: generateId('mock_report'),
      ...data,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    reports.unshift(newReport);
    saveReports(reports);
    return { ...newReport };
  },

  update: async (
    id: string,
    data: Partial<Omit<MockReport, '_id' | 'reporter' | 'createdAt'>>
  ): Promise<MockReport> => {
    await delay(250);
    const reports = loadReports();
    const index = reports.findIndex((r) => r._id === id);
    if (index === -1) throw new Error('Report not found');
    const updated = { ...reports[index], ...data, updatedAt: new Date().toISOString() };
    reports[index] = updated;
    saveReports(reports);
    return { ...updated };
  },

  delete: async (id: string): Promise<void> => {
    await delay(200);
    const reports = loadReports().filter((r) => r._id !== id);
    saveReports(reports);
  },

  search: async (query: string): Promise<MockReport[]> => {
    await delay(200);
    const lower = query.toLowerCase();
    return loadReports().filter(
      (r) =>
        r.title.toLowerCase().includes(lower) ||
        r.description.toLowerCase().includes(lower) ||
        r.location.toLowerCase().includes(lower)
    );
  },
};

export const resetMockData = () => {
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.REPORTS);
  mockUsers = [...seedUsers];
};
