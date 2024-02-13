import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError,
} from 'axios';

import apiConfig from '../../../config/apiConfig';

import { getAuthData } from '../localStorage/auth.utils';
import { toast } from 'react-toastify';

export interface IApiResponse<T> {
  data?: T;
  error?: string;
}

// Create an Axios instance with base URL and headers
const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiConfig.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Redirect to login page if the user is unauthorized
    if (error.response?.status === 401) {
      window.location.href = '/';
    }

    if (error.response?.status === 403) {
      toast.error('Error de autenticación');
    }

    return Promise.reject(error.message);
  }
);

// Central function to make API requests
export const fetchData = async <T>(
  config: AxiosRequestConfig
): Promise<IApiResponse<T>> => {
  try {
    const authData = getAuthData();

    const configWithAuth: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${authData.token}`,
      },
    };

    const response = await axiosInstance(configWithAuth);

    return {
      data: response.data,
    };
  } catch (err) {
    if (isAxiosError(err)) {
      return {
        error: err.response?.data?.error || err.message,
      };
    } else {
      return {
        error: (err as Error)?.message ?? 'Unknown error',
      };
    }
  }
};
