import apiConfig from '@config/apiConfig';
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from '@utils/api/fetch.utils';

import { ILink, LinkFormOmitedFields } from '@interfaces/links.interfaces';

export const getLinks = async (): Promise<ILink[]> => {
  try {
    const res = await getRequest<ILink[]>(`${apiConfig.BASE_URL}/links`);

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return res.data;
  } catch (err) {
    console.log('error= ', err);
    return [];
  }
};

export const createLink = async (
  link: Omit<ILink, LinkFormOmitedFields>
): Promise<ILink | null> => {
  try {
    const res = await postRequest<ILink>(`${apiConfig.BASE_URL}/links`, link);

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return res.data;
  } catch (err) {
    console.log('error= ', err);
    return null;
  }
};

export const updateLink = async (
  id: number,
  link: Partial<ILink>
): Promise<boolean> => {
  try {
    const res = await putRequest<ILink>(
      `${apiConfig.BASE_URL}/links/${id}`,
      link
    );

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return true;
  } catch (err) {
    console.log('error= ', err);
    return false;
  }
};

export const deleteLink = async (id: number): Promise<boolean> => {
  try {
    const res = await deleteRequest(`${apiConfig.BASE_URL}/links/${id}`);

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return true;
  } catch (err) {
    console.log('error= ', err);
    return false;
  }
};
