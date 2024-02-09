import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError,
} from 'axios';

import apiConfig from '../../../app/config/apiConfig';

import { getAuthData } from '../localStorage/auth.utils';

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

// Function for GET requests
export const getRequest = async <T>(url: string): Promise<IApiResponse<T>> => {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url,
  };

  return fetchData<T>(config);
};

export const getBlobRequest = async (url: string): Promise<Response> => {
  const authData = getAuthData();

  const res = await fetch(url, {
    headers: {
      method: 'GET',
      'Content-Type': 'audio/wav',
      Authorization: `Bearer ${authData.token}`,
    },
  });

  return res;
};

// Function for POST requests
export const postRequest = async <T>(
  url: string,
  body?: object
): Promise<IApiResponse<T>> => {
  const config: AxiosRequestConfig = {
    method: 'POST',
    url,
    data: body ? JSON.stringify(body) : undefined,
  };

  return fetchData<T>(config);
};

// Function for PUT requests
export const putRequest = async <T>(
  url: string,
  body?: object
): Promise<IApiResponse<T>> => {
  const config: AxiosRequestConfig = {
    method: 'PUT',
    url,
    data: body ? JSON.stringify(body) : undefined,
  };

  return fetchData<T>(config);
};

// Function for DELETE requests
export const deleteRequest = async <T>(
  url: string,
  body?: object
): Promise<IApiResponse<T>> => {
  const config: AxiosRequestConfig = {
    method: 'DELETE',
    url,
    data: body ? JSON.stringify(body) : undefined,
  };

  return fetchData<T>(config);
};
