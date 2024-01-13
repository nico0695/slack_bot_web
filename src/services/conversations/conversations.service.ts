import { getRequest } from '../../shared/utils/api/fetch.utils';

export const getChannels = async (): Promise<string[]> => {
  try {
    const res = await getRequest<string[]>(`/conversations/show-channels`);

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return res.data;
  } catch (err) {
    return [];
  }
};
