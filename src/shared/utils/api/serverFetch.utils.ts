import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError,
} from 'axios';

import apiConfig from '../../../config/apiConfig';

export interface IApiResponse<T> {
  data?: T;
  error?: string;
}

// Create an Axios instance with base URL and headers
const axiosServerInstance: AxiosInstance = axios.create({
  timeout: 30000,
  baseURL: apiConfig.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to handle errors globally
axiosServerInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // TODO: Redirect to login page if the user is unauthorized
    if (error.response?.status === 401) {
      console.log('ERROR AUTH');
      // window.location.href = '/';
    }

    return Promise.reject(error.message);
  }
);

// Central function to make API requests
export const fetchData = async <T>(
  config: AxiosRequestConfig
): Promise<IApiResponse<T>> => {
  try {
    const { cookies } = await import('next/headers');

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const session = await supabase.auth.getSession();
    const accessToken = session.data?.session?.access_token;

    const configWithAuth: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axiosServerInstance(configWithAuth);

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
