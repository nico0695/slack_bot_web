import apiConfig from '@config/apiConfig';
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from '@utils/api/fetch.utils';

import { ITask, TaskFormOmitedFields } from '@interfaces/tasks.interfaces';

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

export const createTask = async (
  task: Omit<ITask, TaskFormOmitedFields>
): Promise<ITask | null> => {
  try {
    const res = await postRequest<ITask>(`${apiConfig.BASE_URL}/tasks`, task);

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return res.data;
  } catch (err) {
    return null;
  }
};

export const updateTask = async (
  id: number,
  task: Partial<ITask>
): Promise<boolean> => {
  try {
    const res = await putRequest<ITask>(
      `${apiConfig.BASE_URL}/tasks/${id}`,
      task
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

export const deleteTask = async (id: number): Promise<boolean> => {
  try {
    const res = await deleteRequest(`${apiConfig.BASE_URL}/tasks/${id}`);

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return true;
  } catch (err) {
    console.log('error= ', err);
    return false;
  }
};
