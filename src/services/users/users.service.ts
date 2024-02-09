import apiConfig from '@app/config/apiConfig';
import {
  IPaginationOptions,
  IPaginationResponse,
} from '@interfaces/pagination.interfaces';
import { IUsers } from '@interfaces/users.interfaces';

import { getRequest } from '@utils/api/serverFetch.utils';

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
