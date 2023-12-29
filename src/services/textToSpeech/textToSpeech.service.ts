import apiConfig from '../../app/config/apiConfig';
import { IPaginationResponse } from '../../shared/interfaces/pagination.interfaces';

import { ITextToSpeech } from '../../shared/interfaces/textToSpeech.interfaces';
import { getRequest } from '../../shared/utils/api/fetch.utils';

export const getTextToSpeech = async (
  pageNumber: number
): Promise<IPaginationResponse<ITextToSpeech>> => {
  try {
    const res = await getRequest<IPaginationResponse<ITextToSpeech>>(
      `/text-to-speech?page=${pageNumber}&pageSize=${100}`
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

export const getUrlAudioById = async (
  audioId: number
): Promise<string | null> => {
  try {
    const res = await fetch(
      `${apiConfig.BASE_URL}/text-to-speech/${audioId}/audio`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'audio/wav',
        },
      }
    );

    const blob = await res.blob();

    const url = URL.createObjectURL(blob);

    return url;
  } catch (err) {
    console.log('catch= ', err);

    return null;
  }
};
