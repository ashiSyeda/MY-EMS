import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${apiUrl}/auth/`;

const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

const setAccessToken = (token) => localStorage.setItem('accessToken', token);
const setRefreshToken = (token) => localStorage.setItem('refreshToken', token);

const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          removeTokens();
          window.location.href = '/login';
          return Promise.reject(error);
        }
        const response = await axios.post(API_URL + 'refresh-token', { token: refreshToken });
        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        return api(originalRequest);
      } catch (refreshError) {
        removeTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// EMPLOYEE ROUTES

export const fetchAllEmployees = async () => {
  const response = await api.get('employees');
  return response.data;
};

export const createEmployee = async (employeeData) => {
  const response = await api.post('employees', employeeData);
  return response.data;
};

export const updateEmployee = async (id, updatedData) => {
  const response = await api.put('employees/' + id, updatedData);
  return response.data;
};

// New API call to fetch logged-in user's profile
export const fetchLoggedInUserProfile = async () => {
  const response = await api.get('dashboard');
  return response.data;
};

// SALARY ROUTES

export const fetchEmployeeSalary = async (id) => {
  const response = await api.get('employees/' + id + '/salary');
  return response.data;
};

export const updateEmployeeSalary = async (id, salaryData) => {
  const response = await api.put('employees/' + id + '/salary', salaryData);
  return response.data;
};

export { setAccessToken, setRefreshToken, api };
