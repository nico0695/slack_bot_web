import apiConfig from '@app/config/apiConfig';

import { IUsers } from '@interfaces/users.interfaces';

import { getRequest, putRequest } from '@utils/api/fetch.utils';

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
