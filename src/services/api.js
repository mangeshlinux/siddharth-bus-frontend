/**
 * API Service Layer — Siddharth School Bus & Travels
 * 
 * Centralized API wrapper that replaces localStorage with backend calls.
 * Uses native fetch. All requests include JWT token from localStorage.
 */

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://siddharth-bus-backend.onrender.com/api' : '/api');

// ─── Token Management ───
const getToken = () => localStorage.getItem('siddharth_auth_token');
const setToken = (token) => localStorage.setItem('siddharth_auth_token', token);
const removeToken = () => localStorage.removeItem('siddharth_auth_token');

// ─── Base Fetch Helper ───
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  // Handle non-JSON responses
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API Error: ${response.status}`);
  }

  return data;
}

// ─── Auth API ───
export const authAPI = {
  // Parent login — no OTP, just phone number
  parentLogin: async (phone) => {
    const data = await apiFetch('/auth/parent-login', {
      method: 'POST',
      body: JSON.stringify({ phone })
    });
    if (data.token) setToken(data.token);
    return data;
  },

  // Owner login with PIN
  ownerLogin: async (pin) => {
    const data = await apiFetch('/auth/owner-login', {
      method: 'POST',
      body: JSON.stringify({ pin })
    });
    if (data.token) setToken(data.token);
    return data;
  },

  // Verify current token and get user info
  getMe: async () => {
    try {
      const data = await apiFetch('/auth/me');
      return data;
    } catch {
      removeToken();
      return null;
    }
  },

  // Logout
  logout: () => {
    removeToken();
  },

  // Check if token exists
  hasToken: () => !!getToken()
};

// ─── Students API ───
export const studentsAPI = {
  // Get all students (owner) or parent's children
  getAll: () => apiFetch('/students'),

  // Get students by parent phone
  getByPhone: (phone) => apiFetch(`/students/by-phone/${phone}`),

  // Add new student (owner only)
  add: (studentData) => apiFetch('/students', {
    method: 'POST',
    body: JSON.stringify(studentData)
  }),

  // Update student (owner only)
  update: (id, updates) => apiFetch(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),

  // Delete student (owner only)
  delete: (id) => apiFetch(`/students/${id}`, {
    method: 'DELETE'
  }),

  // Bulk import students (owner only)
  bulkImport: (students) => apiFetch('/students/bulk-import', {
    method: 'POST',
    body: JSON.stringify({ students })
  }),

  // Bulk set fee (owner only)
  bulkSetFee: (studentIds, totalAnnualFee) => apiFetch('/students/bulk-fee', {
    method: 'PUT',
    body: JSON.stringify({ studentIds, totalAnnualFee })
  }),

  // Bulk set pickup stop (owner only)
  bulkSetStop: (studentIds, stopName) => apiFetch('/students/bulk-stop', {
    method: 'PUT',
    body: JSON.stringify({ studentIds, stopName })
  })
};

// ─── Payments API ───
export const paymentsAPI = {
  // Record a payment (owner only)
  record: (studentId, { amount, mode, term, clearedMonths, notes }) =>
    apiFetch(`/payments/${studentId}`, {
      method: 'POST',
      body: JSON.stringify({ amount, mode, term, clearedMonths, notes })
    })
};

// ─── Notices API ───
export const noticesAPI = {
  // Get all notices
  getAll: () => apiFetch('/notices'),

  // Broadcast new notice (owner only)
  broadcast: (noticeData) => apiFetch('/notices', {
    method: 'POST',
    body: JSON.stringify(noticeData)
  }),

  // Delete a notice (owner only)
  delete: (id) => apiFetch(`/notices/${id}`, {
    method: 'DELETE'
  }),

  // Clear all notices (owner only)
  clearAll: () => apiFetch('/notices', {
    method: 'DELETE'
  })
};

// ─── Schools API ───
export const schoolsAPI = {
  getAll: () => apiFetch('/schools')
};

// ─── Fleet API ───
export const fleetAPI = {
  getAll: () => apiFetch('/fleet')
};

// ─── Config API ───
export const configAPI = {
  get: () => apiFetch('/config')
};
