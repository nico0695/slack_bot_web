import {
  IPaginationOptions,
  IPaginationResponse,
} from '@interfaces/pagination.interfaces';
import apiConfig from '../../config/apiConfig';

import { IUsers } from '@interfaces/users.interfaces';

import { getRequest, postRequest, putRequest } from '@utils/api/fetch.utils';

export const getUserMe = async (): Promise<IUsers> => {
  const res = await getRequest<IUsers>(`${apiConfig.BASE_URL}/users/me`);

  if (res.error || !res.data) {
    throw new Error(res.error || 'Failed to fetch user data');
  }

  return res.data;
};

export const getUserById = async (userId: number): Promise<IUsers> => {
  const res = await getRequest<IUsers>(
    `${apiConfig.BASE_URL}/users/${userId}`
  );

  if (res.error || !res.data) {
    throw new Error(res.error || 'Failed to fetch user by ID');
  }

  return res.data;
};

export const updateUser = async (
  userId: number,
  data: Partial<IUsers>
): Promise<IUsers> => {
  const res = await putRequest<IUsers>(
    `${apiConfig.BASE_URL}/users/${userId}`,
    data
  );

  if (res.error || !res.data) {
    throw new Error(res.error || 'Failed to update user');
  }

  return res.data;
};

export const getUsers = async (
  paginationOptions: IPaginationOptions
): Promise<IPaginationResponse<IUsers>> => {
  const params = new URLSearchParams({
    page: String(paginationOptions.page),
    pageSize: String(paginationOptions.pageSize ?? 6),
  });

  const res = await getRequest<IPaginationResponse<IUsers>>(
    `${apiConfig.BASE_URL}/users?${params.toString()}`
  );

  if (res.error || !res.data) {
    throw new Error(res.error || 'Failed to fetch users');
  }

  return res.data;
};

export const subscribePushNotification = async (
  subscription: PushSubscription
): Promise<boolean> => {
  const res = await postRequest<boolean>(
    `${apiConfig.BASE_URL}/users/subscribe_notifications`,
    subscription
  );

  if (res.error || !res.data) {
    throw new Error(res.error || 'Failed to subscribe to push notifications');
  }

  return res.data;
};
