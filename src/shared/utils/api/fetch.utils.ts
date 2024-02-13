import { AxiosRequestConfig } from 'axios';

import { getAuthData } from '../localStorage/auth.utils';
export interface IApiResponse<T> {
  data?: T;
  error?: string;
}

// Central function to make API requests
export const fetchData = async <T>(
  config: AxiosRequestConfig
): Promise<IApiResponse<T>> => {
  if (typeof window === 'undefined') {
    const { fetchData: fetchToUse } = await import('./serverFetch.utils');

    return fetchToUse(config);
  }

  const { fetchData: fetchToUse } = await import('./clientFetch.utils');

  return fetchToUse(config);
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
