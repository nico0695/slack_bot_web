import apiConfig from '@config/apiConfig';
import { getRequest } from '@utils/api/fetch.utils';

import { ITask } from '@interfaces/tasks.interfaces';

export const getTasks = async (): Promise<ITask[]> => {
  try {
    const res = await getRequest<ITask[]>(`${apiConfig.BASE_URL}/tasks`);

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return res.data;
  } catch (err) {
    console.log('error= ', err);
    return [];
  }
};
