import { IPaginationResponse } from '../../shared/interfaces/pagination.interfaces';

import { ITextToSpeech } from '../../shared/interfaces/textToSpeech.interfaces';
import { getRequest } from '../../shared/utils/api/serverFetch.utils';

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
