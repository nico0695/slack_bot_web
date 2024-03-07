import apiConfig from '@config/apiConfig';
import { deleteRequest, getRequest, postRequest } from '@utils/api/fetch.utils';

import { IAlert, AlertFormOmitedFields } from '@interfaces/alerts.interfaces';

export const getAlerts = async (): Promise<IAlert[]> => {
  try {
    const res = await getRequest<IAlert[]>(`${apiConfig.BASE_URL}/alerts`);

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return res.data;
  } catch (err) {
    console.log('error= ', err);
    return [];
  }
};

export const createAlert = async (
  alert: Omit<IAlert, AlertFormOmitedFields>
): Promise<IAlert | null> => {
  try {
    const res = await postRequest<IAlert>(
      `${apiConfig.BASE_URL}/alerts`,
      alert
    );

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return res.data;
  } catch (err) {
    return null;
  }
};

export const deleteAlert = async (id: number): Promise<boolean> => {
  try {
    const res = await deleteRequest(`${apiConfig.BASE_URL}/alerts/${id}`);

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return true;
  } catch (err) {
    console.log('error= ', err);
    return false;
  }
};
