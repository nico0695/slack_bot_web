import apiConfig from '@config/apiConfig';
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from '@utils/api/fetch.utils';

import { INote, NoteFormOmitedFields } from '@interfaces/notes.interfaces';

export const getNotes = async (): Promise<INote[]> => {
  try {
    const res = await getRequest<INote[]>(`${apiConfig.BASE_URL}/notes`);

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return res.data;
  } catch (err) {
    console.log('error= ', err);
    return [];
  }
};

export const createNote = async (
  note: Omit<INote, NoteFormOmitedFields>
): Promise<INote | null> => {
  try {
    const res = await postRequest<INote>(`${apiConfig.BASE_URL}/notes`, note);

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return res.data;
  } catch (err) {
    return null;
  }
};

export const updateNote = async (
  id: number,
  note: Partial<INote>
): Promise<boolean> => {
  try {
    const res = await putRequest<INote>(
      `${apiConfig.BASE_URL}/notes/${id}`,
      note
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

export const deleteNote = async (id: number): Promise<boolean> => {
  try {
    const res = await deleteRequest(`${apiConfig.BASE_URL}/notes/${id}`);

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return true;
  } catch (err) {
    console.log('error= ', err);
    return false;
  }
};
