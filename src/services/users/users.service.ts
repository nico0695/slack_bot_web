import {
  IPaginationOptions,
  IPaginationResponse,
} from '@interfaces/pagination.interfaces';
import apiConfig from '../../config/apiConfig';

import { IUsers } from '@interfaces/users.interfaces';

import { getRequest, postRequest, putRequest } from '@utils/api/fetch.utils';

export const getUserMe = async (): Promise<IUsers | undefined> => {
  try {
    const res = await getRequest<IUsers | undefined>(
      `${apiConfig.BASE_URL}/users/me`
    );

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return res.data;
  } catch (err) {
    return undefined;
  }
};

export const getUserById = async (
  userId: number
): Promise<IUsers | undefined> => {
  try {
    const res = await getRequest<IUsers | undefined>(
      `${apiConfig.BASE_URL}/users/${userId}`
    );

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return res.data;
  } catch (err) {
    console.log('error= ', err);
    return undefined;
  }
};

export const updateUser = async (
  userId: number,
  data: Partial<IUsers>
): Promise<IUsers | undefined> => {
  try {
    const res = await putRequest<IUsers | undefined>(
      `${apiConfig.BASE_URL}/users/${userId}`,
      data
    );

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return res.data;
  } catch (err) {
    console.log('error= ', err);
    return undefined;
  }
};

export const getUsers = async (
  paginationOptions: IPaginationOptions
): Promise<IPaginationResponse<IUsers>> => {
  try {
    const res = await getRequest<IPaginationResponse<IUsers>>(
      `${apiConfig.BASE_URL}/users?page=${paginationOptions.page}&pageSize=${
        paginationOptions.pageSize ?? 6
      }`
    );

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return res.data;
  } catch (err) {
    return {
      data: [],
      page: 0,
      pageSize: 6,
      count: 0,
    };
  }
};

export const subscribePushNotification = async (
  subscription: PushSubscription
): Promise<boolean> => {
  try {
    const res = await postRequest<boolean>(
      `${apiConfig.BASE_URL}/users/subscribe_notifications`,
      subscription
    );

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return res.data;
  } catch (err) {
    return false;
  }
};
